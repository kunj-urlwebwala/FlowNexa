import { Response } from "express";

interface PaginatedMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export function successResponse<T>(
  res: Response,
  message: string,
  data: T,
  statusCode = 200,
  meta: PaginatedMeta | null = null
): void {
  res.status(statusCode).json({
    success: true,
    message,
    data,
    meta,
    errors: null,
  });
}

export function errorResponse(
  res: Response,
  message: string,
  statusCode = 500,
  errors: any[] | null = null
): void {
  res.status(statusCode).json({
    success: false,
    message,
    data: null,
    meta: null,
    errors,
  });
}
