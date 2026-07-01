import type { ConnectionOptions } from "bullmq";
import { Worker, Job } from "bullmq";
import IORedis from "ioredis";
import { env } from "../../config/env";
import { logger } from "../../config/logger";
import { prisma } from "../../config/database";
import { sendMail } from "../../shared/utils/email.util";
import { generateInvoiceEmailHtml, generateInvoiceEmailSubject } from "../../shared/templates/invoice-email.template";
import { aiCallsService } from "../../modules/ai-calls/ai-calls.service";

const redis = new IORedis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

const connection = redis as unknown as ConnectionOptions;

export const verificationWorker = new Worker(
  "verificationQueue",
  async (job: Job) => {
    logger.info({ jobId: job.id, name: job.name, data: job.data }, "Processing verification job");

    switch (job.name) {
      case "send-invoice-email":
        await handleInvoiceEmail(job.data.orderId);
        break;

      case "ai-verification-call":
        await handleVerificationCall(job.data.orderId, job.data.attemptNumber);
        break;

      default:
        logger.warn({ jobName: job.name }, "Unknown verification job type");
    }
  },
  {
    connection,
    concurrency: 3,
  }
);

/**
 * Send order invoice email to customer
 */
async function handleInvoiceEmail(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      user: { select: { name: true, email: true } },
      items: true,
    },
  });

  if (!order || !order.user) {
    logger.error({ orderId }, "Order or user not found for invoice email");
    return;
  }

  const shippingAddr = order.shippingAddress as any;

  const emailHtml = generateInvoiceEmailHtml({
    customerName: order.user.name,
    orderNumber: order.orderNumber,
    orderDate: new Date(order.createdAt).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    items: order.items.map((item) => ({
      productName: item.productName,
      sku: item.sku,
      quantity: item.quantity,
      price: item.price,
    })),
    subtotal: order.subtotal,
    tax: order.tax,
    shippingCharges: order.shippingCharges,
    discount: order.discount,
    total: order.total,
    paymentMethod: order.paymentMethod,
    shippingAddress: shippingAddr || {},
  });

  const subject = generateInvoiceEmailSubject(order.orderNumber);

  const success = await sendMail(order.user.email, subject, emailHtml);

  if (success) {
    logger.info({ orderId, email: order.user.email }, "Invoice email sent successfully");
  } else {
    logger.error({ orderId, email: order.user.email }, "Failed to send invoice email");
  }
}

/**
 * Initiate AI verification call
 */
async function handleVerificationCall(orderId: string, attemptNumber: number) {
  logger.info({ orderId, attemptNumber }, "Initiating AI verification call");
  await aiCallsService.initiateVerificationCall(orderId, attemptNumber);
}

// Worker event listeners
verificationWorker.on("completed", (job) => {
  logger.info({ jobId: job.id, name: job.name }, "Verification job completed successfully");
});

verificationWorker.on("failed", (job, error) => {
  logger.error({ jobId: job?.id, name: job?.name, error }, "Verification job failed");
});

export function startVerificationWorker() {
  logger.info("🤖 AI Verification Queue Worker initialized");
}
