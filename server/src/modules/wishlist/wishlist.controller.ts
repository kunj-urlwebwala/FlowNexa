import { Request, Response, NextFunction } from "express";
import { wishlistService } from "./wishlist.service";
import { successResponse } from "../../shared/utils/response.util";

export class WishlistController {
  async getWishlist(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId as string;
      const items = await wishlistService.getWishlist(userId);
      successResponse(res, "Wishlist retrieved successfully", items);
    } catch (error) {
      next(error);
    }
  }

  async addItem(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId as string;
      const { productId } = req.body;
      const items = await wishlistService.addItem(userId, productId);
      successResponse(res, "Product added to wishlist successfully", items, 201);
    } catch (error) {
      next(error);
    }
  }

  async removeItem(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId as string;
      const itemId = req.params.itemId as string;
      const items = await wishlistService.removeItem(userId, itemId);
      successResponse(res, "Product removed from wishlist successfully", items);
    } catch (error) {
      next(error);
    }
  }

  async checkItem(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId as string;
      const productId = req.query.productId as string;
      const result = await wishlistService.checkItem(userId, productId);
      successResponse(res, "Wishlist check completed", result);
    } catch (error) {
      next(error);
    }
  }
}

export const wishlistController = new WishlistController();
