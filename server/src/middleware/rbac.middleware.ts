import { Request, Response, NextFunction } from "express";
import { AuthorizationError } from "../shared/errors/AppError";
import { AdminRole } from "@prisma/client";

export function rbacMiddleware(allowedRoles: AdminRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw new AuthorizationError("Access denied: User details missing");
      }

      // Customers don't have roles list standard admins. If user is customer and allowedRoles is empty or has Customer role.
      // But this is primarily for admin dashboard control.
      const userRole = req.user.role as AdminRole;

      if (!allowedRoles.includes(userRole) && userRole !== AdminRole.SUPER_ADMIN) {
        throw new AuthorizationError("Access denied: Insufficient permissions");
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}
