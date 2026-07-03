import { Request, Response, NextFunction } from "express";
import { marketingService } from "./marketing.service";
import { successResponse } from "../../shared/utils/response.util";

export class MarketingController {
  // Coupons
  async listCoupons(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page, limit } = req.query as any;
      const result = await marketingService.listCoupons(
        page ? parseInt(page, 10) : 1,
        limit ? parseInt(limit, 10) : 20
      );
      successResponse(res, "Coupons listed successfully", result.items, 200, result.meta);
    } catch (error) {
      next(error);
    }
  }

  async createCoupon(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const coupon = await marketingService.createCoupon(req.body);
      successResponse(res, "Coupon created successfully", coupon, 201);
    } catch (error) {
      next(error);
    }
  }

  async updateCoupon(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updated = await marketingService.updateCouponStatus(
        req.params.id as string,
        req.body.isActive
      );
      successResponse(res, "Coupon status updated successfully", updated);
    } catch (error) {
      next(error);
    }
  }

  async validateCoupon(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { code, amount } = req.query as any;
      const coupon = await marketingService.validateCoupon(code, parseFloat(amount));
      successResponse(res, "Coupon is valid", coupon);
    } catch (error) {
      next(error);
    }
  }

  // Templates
  async listTemplates(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page, limit } = req.query as any;
      const result = await marketingService.listTemplates(
        page ? parseInt(page, 10) : 1,
        limit ? parseInt(limit, 10) : 20
      );
      successResponse(res, "Templates listed successfully", result.items, 200, result.meta);
    } catch (error) {
      next(error);
    }
  }

  async createTemplate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const template = await marketingService.createTemplate(req.body);
      successResponse(res, "Template created successfully", template, 201);
    } catch (error) {
      next(error);
    }
  }

  // Subscribers
  async listSubscribers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page, limit } = req.query as any;
      const result = await marketingService.listSubscribers(
        page ? parseInt(page, 10) : 1,
        limit ? parseInt(limit, 10) : 20
      );
      successResponse(res, "Newsletter subscribers listed successfully", result.items, 200, result.meta);
    } catch (error) {
      next(error);
    }
  }

  async addSubscriber(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const record = await marketingService.addSubscriber(req.body.email);
      successResponse(res, "Subscribed successfully", record, 201);
    } catch (error) {
      next(error);
    }
  }
}
export const marketingController = new MarketingController();
