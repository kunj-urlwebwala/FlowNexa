import { z } from "zod";

export const createCouponSchema = z.object({
  body: z.object({
    code: z.string().min(2, "Code must be at least 2 characters").toUpperCase(),
    discountType: z.enum(["PERCENTAGE", "FIXED"]),
    discountValue: z.number().positive(),
    minOrderAmount: z.number().nonnegative().default(0),
    expiryDate: z.string().transform((val) => new Date(val)),
  }),
});

export const updateCouponSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid coupon ID"),
  }),
  body: z.object({
    isActive: z.boolean(),
  }),
});

export const createEmailTemplateSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    subject: z.string().min(2),
    body: z.string().min(10),
    triggerEvent: z.string(), // e.g. USER_REGISTERED, ORDER_PLACED
  }),
});

export const createSubscriberSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address"),
  }),
});
