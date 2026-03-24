import { z } from 'zod';

// ── Pagination ─────────────────────────────────────────────────────────────
export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type PaginationQuery = z.infer<typeof paginationQuerySchema>;

export const paginatedResultSchema = <T extends z.ZodTypeAny>(
  itemSchema: T,
): z.ZodObject<{
  items: z.ZodArray<T>;
  total: z.ZodNumber;
  page: z.ZodNumber;
  limit: z.ZodNumber;
  totalPages: z.ZodNumber;
  hasNextPage: z.ZodBoolean;
  hasPrevPage: z.ZodBoolean;
}> =>
  z.object({
    items: z.array(itemSchema),
    total: z.number().int().nonnegative(),
    page: z.number().int().positive(),
    limit: z.number().int().positive(),
    totalPages: z.number().int().nonnegative(),
    hasNextPage: z.boolean(),
    hasPrevPage: z.boolean(),
  });

// ── ID ─────────────────────────────────────────────────────────────────────
export const idSchema = z.string().uuid('ID must be a valid UUID');
export type Id = z.infer<typeof idSchema>;

// ── Timestamps ─────────────────────────────────────────────────────────────
export const timestampsSchema = z.object({
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Timestamps = z.infer<typeof timestampsSchema>;

// ── API Error ──────────────────────────────────────────────────────────────
export const apiErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
  details: z.unknown().optional(),
});

export type ApiError = z.infer<typeof apiErrorSchema>;
