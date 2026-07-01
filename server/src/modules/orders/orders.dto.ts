import { z } from "zod";
import { OrderStatus, PaymentStatus, PaymentMethod, ReturnStatus } from "@prisma/client";

const addressSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(5),
  street: z.string().min(3),
  city: z.string().min(2),
  state: z.string().min(2),
  postalCode: z.string().min(3),
  country: z.string().default("India"),
});

const orderItemInputSchema = z.object({
  productId: z.string().min(1, "Invalid product ID"),
  variantId: z.string().uuid("Invalid variant ID").optional().nullable(),
  productName: z.string().min(2),
  sku: z.string().min(2),
  price: z.number().positive(),
  quantity: z.number().positive(),
});

export const createOrderSchema = z.object({
  body: z.object({
    shippingAddress: addressSchema,
    billingAddress: addressSchema,
    subtotal: z.number().nonnegative(),
    tax: z.number().nonnegative().default(0),
    shippingCharges: z.number().nonnegative().default(0),
    discount: z.number().nonnegative().default(0),
    total: z.number().positive(),
    paymentMethod: z.nativeEnum(PaymentMethod),
    couponCode: z.string().optional().nullable(),
    items: z.array(orderItemInputSchema).min(1, "Order must have at least 1 item"),
  }),
});

export const updateOrderStatusSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid order ID"),
  }),
  body: z.object({
    status: z.nativeEnum(OrderStatus),
    paymentStatus: z.nativeEnum(PaymentStatus).optional(),
  }),
});

export const listOrdersSchema = z.object({
  query: z.object({
    page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
    limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 10)),
    status: z.nativeEnum(OrderStatus).optional(),
    paymentStatus: z.nativeEnum(PaymentStatus).optional(),
    search: z.string().optional(),
  }),
});

export const getOrderByIdSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid order ID"),
  }),
});

// Returns & Refunds
export const createReturnSchema = z.object({
  body: z.object({
    orderId: z.string().uuid("Invalid order ID"),
    reason: z.string().min(5, "Reason must be at least 5 characters"),
    notes: z.string().max(500).optional(),
  }),
});

export const updateReturnStatusSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid return ID"),
  }),
  body: z.object({
    status: z.nativeEnum(ReturnStatus),
  }),
});

export const createRefundSchema = z.object({
  body: z.object({
    orderId: z.string().uuid("Invalid order ID"),
    amount: z.number().positive(),
    transactionId: z.string().optional(),
    reason: z.string().optional(),
  }),
});

export const cancelReasonSchema = z.object({
  body: z.object({
    reason: z.string().min(3, "Reason must be at least 3 characters"),
  }),
});
