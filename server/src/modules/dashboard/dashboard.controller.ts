import { Request, Response, NextFunction } from "express";
import { dashboardService } from "./dashboard.service";
import { successResponse } from "../../shared/utils/response.util";

export class DashboardController {
  async getStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await dashboardService.getStats();
      successResponse(res, "Dashboard stats retrieved successfully", stats);
    } catch (error) {
      next(error);
    }
  }
}

export const dashboardController = new DashboardController();
