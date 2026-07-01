import { z } from "zod";
import { StockTransactionType } from "@prisma/client";

export const createWarehouseSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name is required").max(100),
    code: z.string().min(2, "Code is required").max(20),
    address: z.string().min(5, "Address is required"),
    capacity: z.number().int().positive().optional().nullable(),
  }),
});

export const updateWarehouseSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid warehouse ID"),
  }),
  body: z.object({
    name: z.string().min(2).max(100).optional(),
    address: z.string().min(5).optional(),
    capacity: z.number().int().positive().optional().nullable(),
  }),
});

export const adjustStockSchema = z.object({
  body: z.object({
    warehouseId: z.string().uuid("Invalid warehouse ID"),
    productId: z.string().uuid("Invalid product ID"),
    variantId: z.string().uuid("Invalid variant ID").optional().nullable(),
    quantity: z.number().int("Quantity must be an integer"), // positive to add, negative to deduct
    type: z.nativeEnum(StockTransactionType),
    note: z.string().max(200).optional(),
  }),
});

export const createStockAuditSchema = z.object({
  body: z.object({
    title: z.string().min(3),
    warehouseName: z.string().min(2),
    auditDate: z.string().transform((val) => new Date(val)),
    inspector: z.string().min(2),
  }),
});

export const updateStockAuditStatusSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid audit ID"),
  }),
  body: z.object({
    status: z.enum(["PENDING", "COMPLETED", "CANCELLED"]),
  }),
});

export const createRestockRequestSchema = z.object({
  body: z.object({
    productName: z.string().min(2),
    quantity: z.number().int().positive(),
    warehouseName: z.string().min(2),
    urgency: z.enum(["HIGH", "MEDIUM", "LOW"]),
  }),
});

export const updateRestockRequestStatusSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid request ID"),
  }),
  body: z.object({
    status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
  }),
});

export const createDamagedStockSchema = z.object({
  body: z.object({
    productName: z.string().min(2),
    sku: z.string().min(2),
    quantity: z.number().int().positive(),
    warehouseName: z.string().min(2),
    reason: z.string().min(3),
  }),
});

export const updateDamagedStockStatusSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid quarantine ID"),
  }),
  body: z.object({
    status: z.enum(["QUARANTINED", "SCRAPPED", "RESTORED"]),
  }),
});
