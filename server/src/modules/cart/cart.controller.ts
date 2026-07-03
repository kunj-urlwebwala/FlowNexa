import { Request, Response, NextFunction } from "express";
import { cartService } from "./cart.service";
import { successResponse } from "../../shared/utils/response.util";

export class CartController {
  async getCart(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId as string;
      const cart = await cartService.getCart(userId);
      successResponse(res, "Cart retrieved successfully", cart);
    } catch (error) {
      next(error);
    }
  }

  async addItem(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId as string;
      const cart = await cartService.addItem(userId, req.body);
      successResponse(res, "Item added to cart successfully", cart, 201);
    } catch (error) {
      next(error);
    }
  }

  async updateItem(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId as string;
      const itemId = req.params.itemId as string;
      const { quantity } = req.body;
      const cart = await cartService.updateItem(userId, itemId, quantity);
      successResponse(res, "Cart item updated successfully", cart);
    } catch (error) {
      next(error);
    }
  }

  async removeItem(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId as string;
      const itemId = req.params.itemId as string;
      const cart = await cartService.removeItem(userId, itemId);
      successResponse(res, "Item removed from cart successfully", cart);
    } catch (error) {
      next(error);
    }
  }

  async clearCart(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId as string;
      const cart = await cartService.clearCart(userId);
      successResponse(res, "Cart cleared successfully", cart);
    } catch (error) {
      next(error);
    }
  }
}

export const cartController = new CartController();
