import { Request, Response, NextFunction } from "express";
import { ordersService } from "./orders.service";
import { successResponse } from "../../shared/utils/response.util";

export class OrdersController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Storefront order creation. Authenticated user ID is passed from req.user
      const userId = req.user?.userId as string;
      const order = await ordersService.createOrder(userId, req.body);
      successResponse(res, "Order placed successfully", order, 201);
    } catch (error) {
      next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page, limit, status, paymentStatus, search } = req.query as any;
      const result = await ordersService.listOrders({
        page,
        limit,
        status,
        paymentStatus,
        search,
      });
      successResponse(res, "Orders listed successfully", result.orders, 200, result.meta);
    } catch (error) {
      next(error);
    }
  }

  async getOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const order = await ordersService.getOrderById(req.params.id as string);
      successResponse(res, "Order details retrieved successfully", order);
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status, paymentStatus } = req.body;
      const updated = await ordersService.updateOrderStatus(
        req.params.id as string,
        status,
        paymentStatus
      );
      successResponse(res, "Order status updated successfully", updated);
    } catch (error) {
      next(error);
    }
  }

  // Returns, Refunds, Cancellation Reason Codes
  async createReturn(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const returnRequest = await ordersService.createReturnRequest(req.body);
      successResponse(res, "Return request created successfully", returnRequest, 201);
    } catch (error) {
      next(error);
    }
  }

  async updateReturn(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updated = await ordersService.updateReturnStatus(
        req.params.id as string,
        req.body.status
      );
      successResponse(res, "Return request status updated successfully", updated);
    } catch (error) {
      next(error);
    }
  }

  async createRefund(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const refund = await ordersService.createRefund(req.body);
      successResponse(res, "Refund created successfully", refund, 201);
    } catch (error) {
      next(error);
    }
  }

  async listCancelReasons(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const reasons = await ordersService.listCancelReasons();
      successResponse(res, "Cancellation codes retrieved successfully", reasons);
    } catch (error) {
      next(error);
    }
  }

  async createCancelReason(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const reason = await ordersService.createCancelReason(req.body.reason);
      successResponse(res, "Cancellation code created successfully", reason, 201);
    } catch (error) {
      next(error);
    }
  }
}
export const ordersController = new OrdersController();
