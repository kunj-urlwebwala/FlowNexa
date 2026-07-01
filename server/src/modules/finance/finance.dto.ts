import { z } from "zod";

export const createExpenseSchema = z.object({
  body: z.object({
    category: z.string().min(2),
    amount: z.number().positive(),
    description: z.string().min(3),
    date: z.string().transform((val) => new Date(val)),
  }),
});

export const createBankAccountSchema = z.object({
  body: z.object({
    bankName: z.string().min(2),
    accountNumber: z.string().min(8),
    routingNumber: z.string().min(4),
    type: z.enum(["SAVINGS", "CURRENT"]),
  }),
});

export const settleBankAccountSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid account ID"),
  }),
  body: z.object({
    isSettled: z.boolean(),
  }),
});
