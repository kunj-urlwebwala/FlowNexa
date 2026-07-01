import { z } from "zod";
import { LeadStatus } from "@prisma/client";

export const createLeadSchema = z.object({
  body: z.object({
    title: z.string().min(2, "Title is required"),
    subtitle: z.string().max(200).optional().nullable(),
    email: z.string().email("Invalid email address").optional().nullable(),
    phone: z.string().optional().nullable(),
    status: z.nativeEnum(LeadStatus).default(LeadStatus.NEW),
    columnId: z.string().default("new"),
  }),
});

export const updateLeadSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid lead ID"),
  }),
  body: z.object({
    title: z.string().min(2).optional(),
    subtitle: z.string().max(200).optional().nullable(),
    email: z.string().email().optional().nullable(),
    phone: z.string().optional().nullable(),
    status: z.nativeEnum(LeadStatus).optional(),
    columnId: z.string().optional(),
  }),
});

export const createAreaSchema = z.object({
  body: z.object({
    regionName: z.string().min(2),
    country: z.string().default("India"),
  }),
});

export const createContactRequestSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().optional(),
    subject: z.string().optional(),
    message: z.string().min(10),
  }),
});

export const getLeadByIdSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid lead ID"),
  }),
});
