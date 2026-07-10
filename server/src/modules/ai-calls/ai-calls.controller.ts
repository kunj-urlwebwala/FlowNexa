import { Request, Response, NextFunction } from "express";
import { aiCallsService } from "./ai-calls.service";
import { successResponse } from "../../shared/utils/response.util";
import { logger } from "../../config/logger";
import { env } from "../../config/env";
import crypto from "crypto";

export class AiCallsController {
  /**
   * Verify Retell AI webhook signature
   */
  private verifyWebhookSignature(req: Request): boolean {
    const secret = env.RETELL_WEBHOOK_SECRET;
    if (!secret) {
      // If no secret configured, skip verification (dev mode)
      return true;
    }

    const signature = req.headers["x-retell-signature"] as string;
    if (!signature) {
      return false;
    }

    try {
      const body = JSON.stringify(req.body);
      const expectedSignature = crypto
        .createHmac("sha256", secret)
        .update(body)
        .digest("hex");
      return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
    } catch {
      return false;
    }
  }

  /**
   * Handle Retell AI webhook callback (no auth required)
   */
  async handleWebhook(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Verify webhook signature for security
      if (!this.verifyWebhookSignature(req)) {
        logger.warn("Retell AI webhook signature verification failed");
        res.status(401).json({ received: false, error: "Invalid signature" });
        return;
      }

      logger.info({ body: req.body }, "Retell AI webhook received");
      await aiCallsService.handleCallWebhook(req.body);
      res.status(200).json({ received: true });
    } catch (error) {
      logger.error({ error }, "Error processing Retell AI webhook");
      // Still return 200 to prevent webhook retries
      res.status(200).json({ received: true, error: "Processing failed" });
    }
  }

  /**
   * Get call logs for a specific order (admin)
   */
  async getOrderCallLogs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const logs = await aiCallsService.getCallLogs(req.params.orderId as string);
      successResponse(res, "Call logs retrieved successfully", logs);
    } catch (error) {
      next(error);
    }
  }

  /**
   * List all AI call records with pagination (admin)
   */
  async listAllCalls(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const status = req.query.status as string | undefined;

      const result = await aiCallsService.listAllCalls({ page, limit, status });
      successResponse(res, "AI call records retrieved", result.calls, 200, result.meta);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get AI calling dashboard stats (admin)
   */
  async getCallStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await aiCallsService.getCallStats();
      successResponse(res, "AI calling stats retrieved", stats);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handle Exotel call status callback (no auth required)
   */
  async handleExotelCallback(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      logger.info({ body: req.body }, "Exotel callback received");
      await aiCallsService.handleExotelCallback(req.body);
      res.status(200).send("OK");
    } catch (error) {
      logger.error({ error }, "Error processing Exotel callback");
      res.status(200).send("OK");
    }
  }

  /**
   * Handle AI verification result from bot server (no auth - internal)
   */
  async handleBotResult(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { callRecordId, result, transcript, summary } = req.body;
      await aiCallsService.updateCallWithResult(callRecordId, result, transcript, summary);
      successResponse(res, "Call result updated successfully", {});
    } catch (error) {
      next(error);
    }
  }

  /**
   * Manually trigger a retry verification call (admin)
   */
  async retryCall(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await aiCallsService.retryCallManually(req.params.orderId as string);
      successResponse(res, `Verification call initiated to ${result.phone} (attempt #${result.attempt})`, result, 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Quick test call — no order or auth needed
   */
  async testCall(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { phone } = req.body;
      if (!phone) {
        res.status(400).json({ error: "Phone number is required" });
        return;
      }
      const result = await aiCallsService.testCall(phone);
      successResponse(res, `Test call initiated to ${phone}`, result, 201);
    } catch (error) {
      next(error);
    }
  }
}

export const aiCallsController = new AiCallsController();
