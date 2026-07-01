import { Request, Response, NextFunction } from "express";
import { AppError } from "../shared/errors/AppError";
import { errorResponse } from "../shared/utils/response.util";
import { logger } from "../config/logger";
import { env } from "../config/env";

export function errorMiddleware(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // If headers already sent, delegate to the default Express error handler
  if (res.headersSent) {
    return next(err);
  }

  // Log error
  logger.error(
    {
      err: {
        ...err,
        message: err.message,
        stack: err.stack,
      },
      request: {
        method: req.method,
        url: req.url,
      },
    },
    "Request error occurred"
  );

  if (err instanceof AppError) {
    errorResponse(res, err.message, err.statusCode, err.errors);
    return;
  }

  // Handle Prisma errors
  if (err.name === "PrismaClientKnownRequestError") {
    // Unique constraint violation
    if ((err as any).code === "P2002") {
      const target = (err as any).meta?.target;
      errorResponse(res, "Unique constraint violation", 409, [
        {
          field: Array.isArray(target) ? target.join(", ") : target || "field",
          message: "Value already exists",
        },
      ]);
      return;
    }
  }

  // Handle default unknown errors
  const message = env.NODE_ENV === "production" ? "Internal server error" : err.message;
  errorResponse(res, message, 500);
}
