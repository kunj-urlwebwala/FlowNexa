import { Request, Response, NextFunction } from "express";
import { AuthenticationError } from "../shared/errors/AppError";
import { verifyAccessToken } from "../shared/utils/jwt.util";

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AuthenticationError("No token provided");
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      throw new AuthenticationError("Invalid token format");
    }

    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    next(new AuthenticationError(error instanceof Error ? error.message : "Authentication failed"));
  }
}
