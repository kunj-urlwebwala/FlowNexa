import { z } from "zod";
import { AdminRole, AdminStatus } from "@prisma/client";

export const createTeamMemberSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address"),
    username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    name: z.string().min(2).max(100),
    role: z.nativeEnum(AdminRole),
    avatar: z.string().url().optional(),
  }),
});

export const updateTeamMemberSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid team member ID format"),
  }),
  body: z.object({
    name: z.string().min(2).max(100).optional(),
    role: z.nativeEnum(AdminRole).optional(),
    status: z.nativeEnum(AdminStatus).optional(),
    avatar: z.string().url().optional().nullable(),
  }),
});

export const getTeamMemberByIdSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid team member ID format"),
  }),
});
