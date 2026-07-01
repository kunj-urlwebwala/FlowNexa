import { Request, Response, NextFunction } from "express";
import { usersService } from "./users.service";
import { successResponse } from "../../shared/utils/response.util";

export class UsersController {
  /**
   * List Customers
   */
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page, limit, search, status } = req.query as any;
      const result = await usersService.listUsers({ page, limit, search, status });
      successResponse(res, "Customers listed successfully", result.users, 200, result.meta);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get Customer Details
   */
  async getOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await usersService.getUserById(req.params.id as string);
      successResponse(res, "Customer details retrieved successfully", user);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update Customer Details
   */
  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updated = await usersService.updateUser(req.params.id as string, req.body);
      successResponse(res, "Customer updated successfully", updated);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete Customer
   */
  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await usersService.deleteUser(req.params.id as string);
      successResponse(res, "Customer deleted successfully", null);
    } catch (error) {
      next(error);
    }
  }

  // ----------------------------------------------------
  // CUSTOMER SELF-MANAGED PROFILE & ADDRESSES
  // ----------------------------------------------------

  async getMyProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      const profile = await usersService.getMyProfile(userId);
      successResponse(res, "Profile retrieved successfully", profile);
    } catch (error) {
      next(error);
    }
  }

  async updateMyProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      const updated = await usersService.updateMyProfile(userId, req.body);
      successResponse(res, "Profile updated successfully", updated);
    } catch (error) {
      next(error);
    }
  }

  async addAddress(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      const address = await usersService.addAddress(userId, req.body);
      successResponse(res, "Address added successfully", address, 201);
    } catch (error) {
      next(error);
    }
  }

  async updateAddress(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      const address = await usersService.updateAddress(userId, req.params.addressId as string, req.body);
      successResponse(res, "Address updated successfully", address);
    } catch (error) {
      next(error);
    }
  }

  async deleteAddress(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      await usersService.deleteAddress(userId, req.params.addressId as string);
      successResponse(res, "Address deleted successfully", null);
    } catch (error) {
      next(error);
    }
  }

  async setDefaultAddress(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      const address = await usersService.setDefaultAddress(userId, req.params.addressId as string);
      successResponse(res, "Default address updated", address);
    } catch (error) {
      next(error);
    }
  }
}
export const usersController = new UsersController();
