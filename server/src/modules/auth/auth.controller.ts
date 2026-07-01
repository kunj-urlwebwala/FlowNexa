import { Request, Response, NextFunction } from "express";
import { authService } from "./auth.service";
import { successResponse } from "../../shared/utils/response.util";

export class AuthController {
  /**
   * Storefront Customer Register
   */
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.registerUser(req.body);
      successResponse(res, "User registered successfully", result, 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Storefront Customer Login
   */
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.loginUser(req.body);
      successResponse(res, "Login successful", result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Admin Hub Login
   */
  async adminLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.loginAdmin(req.body);
      successResponse(res, "Admin login successful", result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Refresh Auth Tokens
   */
  async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.refreshToken(req.body.refreshToken);
      successResponse(res, "Tokens refreshed successfully", result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * User/Admin Logout
   */
  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // In a stateless JWT system, client deletes the token.
      // We can also blacklist it in Redis if needed.
      successResponse(res, "Logged out successfully", null);
    } catch (error) {
      next(error);
    }
  }
}
export const authController = new AuthController();
