import { z } from "zod";

export const createBlogCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2),
    slug: z.string().optional(),
  }),
});

export const createBlogPostSchema = z.object({
  body: z.object({
    title: z.string().min(3),
    slug: z.string().optional(),
    content: z.string().min(10),
    image: z.string().url().optional().nullable(),
    categoryId: z.string().uuid("Invalid category ID"),
    isPublished: z.boolean().default(false),
  }),
});

export const updateBlogPostSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid post ID"),
  }),
  body: z.object({
    title: z.string().min(3).optional(),
    slug: z.string().optional(),
    content: z.string().min(10).optional(),
    image: z.string().url().optional().nullable(),
    categoryId: z.string().uuid().optional(),
    isPublished: z.boolean().optional(),
  }),
});

export const createTestimonialSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    role: z.string().optional().nullable(),
    company: z.string().optional().nullable(),
    content: z.string().min(5),
    avatar: z.string().url().optional().nullable(),
    rating: z.number().int().min(1).max(5).default(5),
  }),
});

export const createFaqSchema = z.object({
  body: z.object({
    question: z.string().min(5),
    answer: z.string().min(5),
    category: z.string().min(2),
  }),
});

export const createPageSchema = z.object({
  body: z.object({
    title: z.string().min(2),
    slug: z.string().optional(),
    content: z.string().min(10),
    isActive: z.boolean().default(true),
  }),
});

export const createSeoSchema = z.object({
  body: z.object({
    pageName: z.string().min(2),
    title: z.string().min(2),
    description: z.string().min(5),
    keywords: z.array(z.string()).default([]),
  }),
});

export const createBannerSchema = z.object({
  body: z.object({
    title: z.string().min(2),
    subtitle: z.string().optional().nullable(),
    image: z.string().url(),
    link: z.string().optional().nullable(),
    order: z.number().int().default(0),
    isActive: z.boolean().default(true),
  }),
});
