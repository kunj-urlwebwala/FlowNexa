import { z } from "zod";

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(100),
    slug: z.string().min(2).max(100).optional(), // Can be auto-generated from name if not provided
    description: z.string().max(500).optional(),
    image: z.string().url("Invalid image URL").optional().nullable(),
    parentId: z.string().uuid("Invalid parent category ID").optional().nullable(),
  }),
});

export const updateCategorySchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid category ID"),
  }),
  body: z.object({
    name: z.string().min(2).max(100).optional(),
    slug: z.string().min(2).max(100).optional(),
    description: z.string().max(500).optional(),
    image: z.string().url("Invalid image URL").optional().nullable(),
    parentId: z.string().uuid("Invalid parent category ID").optional().nullable(),
  }),
});

export const getCategoryByIdSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid category ID"),
  }),
});
