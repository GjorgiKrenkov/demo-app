import { z } from 'zod';
import { idSchema, timestampsSchema } from './common.schema.js';

// ── Base fields ────────────────────────────────────────────────────────────
const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email('Must be a valid email address')
  .max(255, 'Email must be at most 255 characters');

const nameSchema = z
  .string()
  .trim()
  .min(1, 'Name cannot be empty')
  .max(100, 'Name must be at most 100 characters');

// ── User domain schema ─────────────────────────────────────────────────────
export const userSchema = z.object({
  id: idSchema,
  email: emailSchema,
  name: nameSchema,
  role: z.enum(['admin', 'member', 'viewer']).default('member'),
  ...timestampsSchema.shape,
});

export type User = z.infer<typeof userSchema>;

// ── Create ─────────────────────────────────────────────────────────────────
export const createUserSchema = z.object({
  email: emailSchema,
  name: nameSchema,
  role: userSchema.shape.role.optional(),
});

export type CreateUser = z.infer<typeof createUserSchema>;

// ── Update ─────────────────────────────────────────────────────────────────
export const updateUserSchema = createUserSchema.partial();
export type UpdateUser = z.infer<typeof updateUserSchema>;

// ── Query ──────────────────────────────────────────────────────────────────
export const userQuerySchema = z.object({
  search: z.string().trim().optional(),
  role: userSchema.shape.role.optional(),
});

export type UserQuery = z.infer<typeof userQuerySchema>;
