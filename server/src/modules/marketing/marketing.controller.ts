import { Request, Response, NextFunction } from "express";
import { marketingService } from "./marketing.service";
import { successResponse } from "../../shared/utils/response.util";

export class MarketingController {
  // Coupons
  async listCoupons(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const coupons = await marketingService.listCoupons();
      successResponse(res, "Coupons listed successfully", coupons);
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
      const templates = await marketingService.listTemplates();
      successResponse(res, "Templates listed successfully", templates);
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
      const list = await marketingService.listSubscribers();
      successResponse(res, "Newsletter subscribers listed successfully", list);
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
