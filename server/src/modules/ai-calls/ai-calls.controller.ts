import { Request, Response, NextFunction } from "express";
import { aiCallsService } from "./ai-calls.service";
import { successResponse } from "../../shared/utils/response.util";
import { logger } from "../../config/logger";

export class AiCallsController {
  /**
   * Handle Bland.ai webhook callback (no auth required)
   */
  async handleWebhook(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      logger.info({ body: req.body }, "Bland.ai webhook received");
      await aiCallsService.handleCallWebhook(req.body);
      // Bland.ai expects a 200 response
      res.status(200).json({ received: true });
    } catch (error) {
      logger.error({ error }, "Error processing Bland.ai webhook");
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
   * Manually trigger a retry verification call (admin)
   */
  async retryCall(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await aiCallsService.retryCallManually(req.params.orderId as string);
      successResponse(res, "Verification call scheduled successfully", null, 201);
    } catch (error) {
      next(error);
    }
  }
}

export const aiCallsController = new AiCallsController();
