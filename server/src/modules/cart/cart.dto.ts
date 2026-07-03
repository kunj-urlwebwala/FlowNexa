import { z } from "zod";

export const addItemSchema = z.object({
  body: z.object({
    productId: z.string().uuid("Invalid product ID"),
    variantId: z.string().uuid("Invalid variant ID").optional().nullable(),
    quantity: z.number().int().min(1, "Quantity must be at least 1").max(100, "Quantity cannot exceed 100").default(1),
  }),
});

export const updateItemSchema = z.object({
  params: z.object({
    itemId: z.string().uuid("Invalid cart item ID"),
  }),
  body: z.object({
    quantity: z.number().int().min(1, "Quantity must be at least 1").max(100, "Quantity cannot exceed 100"),
  }),
});

export const removeItemSchema = z.object({
  params: z.object({
    itemId: z.string().uuid("Invalid cart item ID"),
  }),
});
