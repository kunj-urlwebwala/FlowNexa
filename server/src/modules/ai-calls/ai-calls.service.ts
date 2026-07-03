import { prisma } from "../../config/database";
import { env } from "../../config/env";
import { logger } from "../../config/logger";
import { NotFoundError } from "../../shared/errors/AppError";
import { addVerificationCallJob } from "../../jobs/queue";
import { OrderStatus } from "@prisma/client";

// Progressive retry delays: 15 minutes, then 30 minutes
const RETRY_DELAYS_MS = [
  15 * 60 * 1000, // 15 minutes
  30 * 60 * 1000, // 30 minutes
];

const MAX_ATTEMPTS = 3;

export class AiCallsService {
  /**
   * Initiate an AI verification call via Bland.ai
   */
  async initiateVerificationCall(orderId: string, attemptNumber: number): Promise<void> {
    // Fetch order with user details
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        items: true,
      },
    });

    if (!order) {
      logger.error({ orderId }, "Order not found for verification call");
      return;
    }

    // Skip if order is already past PENDING (already confirmed/cancelled)
    if (order.status !== OrderStatus.PENDING) {
      logger.info({ orderId, status: order.status }, "Order already processed, skipping verification call");
      const existingCall = await prisma.verificationCall.findFirst({ where: { orderId }, orderBy: { createdAt: "desc" } });
      if (existingCall) {
        await prisma.verificationCall.update({
          where: { id: existingCall.id },
          data: { status: "FAILED", result: "ERROR", summary: `Call skipped - order status is ${order.status}` },
        });
      }
      return;
    }

    // Get customer phone — prefer checkout shipping address phone over profile phone
    // (user entered this phone at checkout, so it's the most relevant for THIS order)
    const shippingAddr = order.shippingAddress as any;
    const customerPhone = shippingAddr?.phone || order.user?.phone;
    logger.info({ orderId, shippingPhone: shippingAddr?.phone, profilePhone: order.user?.phone, finalPhone: customerPhone }, "Phone resolution for verification call");

    if (!customerPhone) {
      logger.error({ orderId }, "No phone number found for customer, cannot place verification call");
      // Record the failure so the admin dashboard shows why the call didn't happen
      const existingCall = await prisma.verificationCall.findFirst({ where: { orderId }, orderBy: { createdAt: "desc" } });
      if (existingCall) {
        await prisma.verificationCall.update({
          where: { id: existingCall.id },
          data: { status: "FAILED", result: "ERROR", summary: "No phone number found on user profile or shipping address" },
        });
      } else {
        await prisma.verificationCall.create({
          data: {
            orderId,
            status: "FAILED",
            result: "ERROR",
            summary: "No phone number found on user profile or shipping address",
            attemptNumber,
          },
        });
      }
      return;
    }

    // Format phone number for Bland.ai (E.164 format)
    const formattedPhone = this.formatPhoneNumber(customerPhone);
    logger.info({ orderId, rawPhone: customerPhone, formattedPhone }, "Phone number resolved for verification call");

    // Find latest verification call record for this order to reuse it
    const existingCall = await prisma.verificationCall.findFirst({
      where: { orderId },
      orderBy: { createdAt: "desc" },
    });

    // Guard: Don't overwrite a CONFIRMED or COMPLETED record
    if (existingCall && existingCall.result === "CONFIRMED") {
      logger.info({ orderId, callId: existingCall.id }, "Existing call already CONFIRMED, skipping new call initiation");
      return;
    }

    let callRecord;
    if (existingCall) {
      callRecord = await prisma.verificationCall.update({
        where: { id: existingCall.id },
        data: {
          phoneNumber: formattedPhone,
          status: "CALLING",
          result: null,
          attemptNumber,
          transcript: null,
          summary: null,
          recordingUrl: null,
          callDuration: null,
          callId: null,
          retryAfter: null,
        },
      });
    } else {
      callRecord = await prisma.verificationCall.create({
        data: {
          orderId,
          phoneNumber: formattedPhone,
          status: "CALLING",
          attemptNumber,
        },
      });
    }

    // Check if Retell AI is configured
    if (!env.RETELL_API_KEY || !env.RETELL_AGENT_ID || !env.RETELL_FROM_NUMBER) {
      logger.warn({ orderId }, "Retell AI credentials or agent ID not configured, simulating call for development");
      // In development without API key, auto-mark as completed
      await prisma.verificationCall.update({
        where: { id: callRecord.id },
        data: {
          status: "COMPLETED",
          result: "CONFIRMED",
          summary: "[DEV MODE] Auto-confirmed - Retell AI config not configured",
          callDuration: 0,
        },
      });
      // Auto-update order to PROCESSING in dev mode
      await prisma.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.PROCESSING },
      });
      logger.info({ orderId }, "[DEV MODE] Order auto-confirmed to PROCESSING");
      return;
    }

    // Build AI agent dynamic values (Hinglish context info)
    const itemsList = order.items
      .map((item) => `${item.productName} (Qty: ${item.quantity}, Price: ₹${item.price})`)
      .join(", ");

    const paymentMethodLabel = order.paymentMethod === "COD" ? "Cash on Delivery" : "Card Payment (Online)";
    const customerName = shippingAddr?.fullName || order.user?.name || "Customer";

    try {
      // Call Retell AI create-phone-call API
      const response = await fetch("https://api.retellai.com/v2/create-phone-call", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${env.RETELL_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from_number: env.RETELL_FROM_NUMBER,
          to_number: formattedPhone,
          override_agent_id: env.RETELL_AGENT_ID,
          metadata: {
            orderId: order.id,
            callRecordId: callRecord.id,
            attemptNumber: attemptNumber.toString(),
          },
          retell_llm_dynamic_variables: {
            customer_name: customerName,
            order_number: order.orderNumber,
            items_list: itemsList,
            total_amount: order.total.toString(),
            payment_method: paymentMethodLabel,
          },
        }),
      });

      const data: any = await response.json();
      logger.info({ orderId, status: response.status, callId: data.call_id, responseOk: response.ok, responseData: data }, "Retell AI API response received");

      if (response.ok && data.call_id) {
        // Update call record with Retell AI call ID
        await prisma.verificationCall.update({
          where: { id: callRecord.id },
          data: { callId: data.call_id },
        });
        logger.info({ orderId, callId: data.call_id, attemptNumber, toNumber: formattedPhone }, "Retell AI verification call initiated");
      } else {
        logger.error({ orderId, response: data }, "Retell AI call failed to initiate");
        await prisma.verificationCall.update({
          where: { id: callRecord.id },
          data: { status: "FAILED", result: "ERROR", summary: JSON.stringify(data) },
        });
        // Schedule retry if possible
        await this.scheduleRetryCall(orderId, attemptNumber);
      }
    } catch (error) {
      logger.error({ error, orderId }, "Failed to call Retell AI API");
      await prisma.verificationCall.update({
        where: { id: callRecord.id },
        data: { status: "FAILED", result: "ERROR", summary: String(error) },
      });
      await this.scheduleRetryCall(orderId, attemptNumber);
    }
  }

  /**
   * Handle Retell AI webhook callback when call states update
   */
  async handleCallWebhook(webhookData: any): Promise<void> {
    const event = webhookData.event;
    const call = webhookData.call;

    if (!call) {
      logger.warn("Webhook received without call object, ignoring");
      return;
    }

    const callId = call.call_id;
    const metadata = call.metadata || {};
    const callRecordId = metadata.callRecordId;
    const orderId = metadata.orderId;

    // Find the call record in database
    const callRecord = callRecordId
      ? await prisma.verificationCall.findUnique({ where: { id: callRecordId } })
      : await prisma.verificationCall.findFirst({ where: { callId } });

    logger.info({ event, callId, orderId, currentStatus: callRecord?.status }, "Received Retell AI webhook callback");

    if (!callRecord) {
      logger.warn({ callId, callRecordId }, "No matching call record found for webhook");
      return;
    }

    // 1. Handle call_ended event (to check if it was not answered or busy)
    if (event === "call_ended") {
      const callStatus = call.call_status; // "ended" or "error"
      const durationMs = call.duration_ms || 0;
      const durationSec = Math.round(durationMs / 1000);
      const disconnectionReason = call.disconnection_reason; // e.g. "dial_busy", "dial_failed", "dial_no_answer", "voicemail"

      logger.info({ callId, orderId, callStatus, durationSec, disconnectionReason }, "call_ended webhook data");

      // If call failed to connect or wasn't answered
      const noAnswerReasons = [
        "dial_busy",
        "dial_failed",
        "dial_no_answer",
        "voicemail",
        "voicemail_reached",
        "machine_reached",
      ];
      const isNoAnswer = noAnswerReasons.includes(disconnectionReason) || (durationSec === 0);

      if (isNoAnswer) {
        await prisma.verificationCall.update({
          where: { id: callRecord.id },
          data: {
            status: "NO_ANSWER",
            result: "NO_ANSWER",
            summary: `Call not answered. Disconnection reason: ${disconnectionReason || "unknown"}`,
            callDuration: durationSec,
          },
        });

        // Trigger retry logic
        await this.scheduleRetryCall(callRecord.orderId, callRecord.attemptNumber);
      } else if (callStatus === "error") {
        await prisma.verificationCall.update({
          where: { id: callRecord.id },
          data: {
            status: "FAILED",
            result: "ERROR",
            summary: `Call ended with error: ${disconnectionReason || "unknown"}`,
            callDuration: durationSec,
          },
        });

        // Trigger retry logic
        await this.scheduleRetryCall(callRecord.orderId, callRecord.attemptNumber);
      } else if (callRecord.status === "CALLING") {
        // Fallback: call ended normally but was still in CALLING state
        // This catches cases where disconnection reason is not in the known list
        // e.g. carrier reject, number unreachable, etc.
        await prisma.verificationCall.update({
          where: { id: callRecord.id },
          data: {
            status: "FAILED",
            result: "ERROR",
            summary: `Call ended without connection. Reason: ${disconnectionReason || "unknown"}, Duration: ${durationSec}s`,
            callDuration: durationSec,
          },
        });

        // Trigger retry logic
        await this.scheduleRetryCall(callRecord.orderId, callRecord.attemptNumber);
      }
    }

    // 2. Handle call_analyzed event (main successful conversation verification)
    if (event === "call_analyzed") {
      // Skip analysis if call was already marked as not answered or failed
      // This prevents NO_ANSWER/FAILED from being overwritten to DENIED
      if (callRecord.status === "NO_ANSWER" || callRecord.status === "FAILED") {
        logger.info({ callId, orderId, status: callRecord.status }, "Call already marked as no-answer/failed, skipping analysis");
        return;
      }

      const transcript = call.transcript || null;
      const recordingUrl = call.recording_url || null;
      const durationMs = call.duration_ms || 0;
      const durationSec = Math.round(durationMs / 1000);

      const analysis = call.call_analysis || {};
      const customData = analysis.custom_analysis_data || {};

      // CRITICAL: If no transcript, no recording, and very short call — the call never connected
      // Retell AI may still send call_analyzed with empty analysis for failed calls
      // Do NOT mark as DENIED (which implies customer said no) — mark as FAILED instead
      if (!transcript && !recordingUrl && durationSec < 5) {
        logger.warn({ callId, orderId, durationSec, analysis }, "Call analyzed but no conversation recorded — call likely never connected");
        await prisma.verificationCall.update({
          where: { id: callRecord.id },
          data: {
            status: "FAILED",
            result: "ERROR",
            summary: `Call failed to connect. No conversation recorded. Duration: ${durationSec}s`,
            callDuration: durationSec,
          },
        });
        await this.scheduleRetryCall(callRecord.orderId, callRecord.attemptNumber);
        return;
      }

      const orderConfirmed = customData.order_confirmed === true || analysis.order_confirmed === true;

      const status = "COMPLETED";
      const result = orderConfirmed ? "CONFIRMED" : "DENIED";

      logger.info({ callId, orderId, result, durationSec, hasTranscript: !!transcript }, "Call analyzed with conversation data");

      // Update call record
      await prisma.verificationCall.update({
        where: { id: callRecord.id },
        data: {
          status,
          result,
          transcript,
          summary: customData.customer_response || analysis.summary || null,
          recordingUrl,
          callDuration: durationSec,
        },
      });

      // Update order status if confirmed
      if (result === "CONFIRMED" && callRecord.orderId) {
        await prisma.order.update({
          where: { id: callRecord.orderId },
          data: { status: OrderStatus.PROCESSING },
        });
        logger.info({ orderId: callRecord.orderId }, "Order status updated to PROCESSING (Retell AI verified)");
      }
    }

    logger.info({ callId, event }, "Retell AI webhook processed successfully");
  }

  /**
   * Schedule retry call with progressive delays
   */
  async scheduleRetryCall(orderId: string, currentAttempt: number): Promise<void> {
    if (currentAttempt >= MAX_ATTEMPTS) {
      logger.info({ orderId, attempts: currentAttempt }, "Max call attempts reached, no more retries");
      return;
    }

    // Check if order is still PENDING
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order || order.status !== OrderStatus.PENDING) {
      logger.info({ orderId }, "Order no longer PENDING, skipping retry");
      return;
    }

    const nextAttempt = currentAttempt + 1;
    const delayMs = RETRY_DELAYS_MS[currentAttempt - 1] || RETRY_DELAYS_MS[RETRY_DELAYS_MS.length - 1];

    logger.info({ orderId, nextAttempt, delayMinutes: delayMs / 60000 }, "Scheduling retry verification call");
    
    // Save retryAfter timestamp when scheduling retry
    const retryAfter = new Date(Date.now() + delayMs);
    await prisma.verificationCall.updateMany({
      where: { orderId },
      data: { retryAfter },
    });

    await addVerificationCallJob(orderId, nextAttempt, delayMs);
  }

  /**
   * Get all verification call logs for an order
   */
  async getCallLogs(orderId: string) {
    return prisma.verificationCall.findMany({
      where: { orderId },
      orderBy: { createdAt: "desc" },
      include: {
        order: {
          select: {
            orderNumber: true,
            status: true,
            total: true,
            user: { select: { name: true, email: true } },
          },
        },
      },
    });
  }

  /**
   * List all AI call records with pagination (for admin dashboard)
   */
  async listAllCalls(filters: { page: number; limit: number; status?: string }) {
    const { page, limit, status } = filters;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;

    const [calls, total] = await Promise.all([
      prisma.verificationCall.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          order: {
            select: {
              orderNumber: true,
              status: true,
              total: true,
              paymentMethod: true,
              user: { select: { name: true, email: true, phone: true } },
            },
          },
        },
      }),
      prisma.verificationCall.count({ where }),
    ]);

    return {
      calls,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get aggregate stats for AI calling dashboard
   */
  async getCallStats() {
    const [total, completed, confirmed, noAnswer, failed, pending] = await Promise.all([
      prisma.verificationCall.count(),
      prisma.verificationCall.count({ where: { status: "COMPLETED" } }),
      prisma.verificationCall.count({ where: { result: "CONFIRMED" } }),
      prisma.verificationCall.count({ where: { status: "NO_ANSWER" } }),
      prisma.verificationCall.count({ where: { status: "FAILED" } }),
      prisma.verificationCall.count({
        where: {
          status: {
            in: ["SCHEDULED", "CALLING"],
          },
        },
      }),
    ]);

    return { total, completed, confirmed, noAnswer, failed, pending };
  }

  /**
   * Manually trigger a verification call for an order (admin action)
   * Calls initiateVerificationCall directly for immediate execution (not via BullMQ queue)
   */
  async retryCallManually(orderId: string): Promise<{ phone: string; attempt: number }> {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundError("Order not found");

    // Guard: Don't retry if order is already past PENDING (confirmed/cancelled)
    if (order.status !== OrderStatus.PENDING) {
      throw new Error(`Cannot retry — order is already ${order.status}. The verification call has already been processed.`);
    }

    // Get the latest call record
    const latestCall = await prisma.verificationCall.findFirst({
      where: { orderId },
      orderBy: { createdAt: "desc" },
    });

    // Guard: Don't retry if latest call is already CONFIRMED
    if (latestCall?.result === "CONFIRMED") {
      throw new Error("Cannot retry — this order has already been verified and confirmed by AI.");
    }

    const attemptNumber = (latestCall?.attemptNumber || 0) + 1;

    // Call directly (not through queue) for immediate execution
    await this.initiateVerificationCall(orderId, attemptNumber);

    // Return the call record info for the response
    const callRecord = await prisma.verificationCall.findFirst({
      where: { orderId },
      orderBy: { createdAt: "desc" },
    });
    return { phone: callRecord?.phoneNumber || "unknown", attempt: attemptNumber };
  }

  /**
   * Format phone number to E.164 format for Bland.ai
   */
  private formatPhoneNumber(phone: string): string {
    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, "");

    // If starts with country code, keep it
    if (digits.startsWith("91") && digits.length >= 12) {
      return `+${digits}`;
    }

    // For Indian numbers (10 digits), add +91
    if (digits.length === 10) {
      return `+91${digits}`;
    }

    // Already has + prefix
    if (phone.startsWith("+")) {
      return phone;
    }

    // Default: prepend +91 for India
    return `+91${digits}`;
  }
}

export const aiCallsService = new AiCallsService();
