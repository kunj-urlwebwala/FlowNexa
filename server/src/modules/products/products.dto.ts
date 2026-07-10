import { z } from "zod";

const productVariantSchema = z.object({
  sku: z.string().min(2, "SKU is required"),
  price: z.number().positive("Price must be a positive number"),
  stock: z.number().nonnegative().default(0),
  attributes: z.record(z.string(), z.any()), // e.g. {"color": "Midnight Black", "size": "M"}
});

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(200),
    slug: z.string().min(2).max(200).optional(),
    description: z.string().min(10, "Description must be at least 10 characters"),
    price: z.number().positive("Price must be positive"),
    compareAtPrice: z.number().positive().optional().nullable(),
    categoryId: z.string().uuid("Invalid category ID"),
    brandId: z.string().uuid("Invalid brand ID").optional().nullable(),
    images: z.array(z.string().url("Invalid image URL")).default([]),
    isActive: z.boolean().default(true),
    variants: z.array(productVariantSchema).default([]),
  }),
});

export const updateProductSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid product ID"),
  }),
  body: z.object({
    name: z.string().min(2).max(200).optional(),
    slug: z.string().min(2).max(200).optional(),
    description: z.string().min(10).optional(),
    price: z.number().positive().optional(),
    compareAtPrice: z.number().positive().optional().nullable(),
    categoryId: z.string().uuid().optional(),
    brandId: z.string().uuid().optional().nullable(),
    images: z.array(z.string().url()).optional(),
    isActive: z.boolean().optional(),
  }),
});

export const listProductsSchema = z.object({
  query: z.object({
    page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
    limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 10)),
    search: z.string().optional(),
    category: z.string().optional(), // category slug or ID
    brand: z.string().optional(), // brand slug or ID
    minPrice: z.string().optional().transform((val) => (val ? parseFloat(val) : undefined)),
    maxPrice: z.string().optional().transform((val) => (val ? parseFloat(val) : undefined)),
    sortBy: z.enum(["price_asc", "price_desc", "newest", "createdAt_desc", "createdAt_asc"]).default("newest"),
  }),
});

export const getProductByIdSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Product ID or slug is required"),
  }),
});
