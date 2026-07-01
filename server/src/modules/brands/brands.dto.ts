import { z } from "zod";

export const createBrandSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(100),
    slug: z.string().min(2).max(100).optional(),
    logo: z.string().url("Invalid logo URL").optional().nullable(),
    description: z.string().max(500).optional().nullable(),
  }),
});

export const updateBrandSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid brand ID"),
  }),
  body: z.object({
    name: z.string().min(2).max(100).optional(),
    slug: z.string().min(2).max(100).optional(),
    logo: z.string().url("Invalid logo URL").optional().nullable(),
    description: z.string().max(500).optional().nullable(),
  }),
});

export const getBrandByIdSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid brand ID"),
  }),
});
