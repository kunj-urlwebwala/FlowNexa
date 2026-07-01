import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { ValidationError } from "../shared/errors/AppError";

export function validateRequest(schema: ZodSchema) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed = (await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      })) as any;
      req.body = parsed.body;
      Object.defineProperty(req, "query", {
        value: parsed.query,
        writable: true,
        configurable: true,
      });
      req.params = parsed.params;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorDetails = error.issues.map((issue) => ({
          field: issue.path.join(".").replace(/^(body|query|params)\./, ""),
          message: issue.message,
        }));
        next(new ValidationError("Validation failed", errorDetails));
      } else {
        next(error);
      }
    }
  };
}
