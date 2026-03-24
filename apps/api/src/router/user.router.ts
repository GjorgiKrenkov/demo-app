import { count, eq } from 'drizzle-orm';
import { z } from 'zod';

import { TRPCError } from '@trpc/server';

import { usersTable } from '@demo-app/db';
import {
  createUserSchema,
  idSchema,
  paginationQuerySchema,
  updateUserSchema,
} from '@demo-app/validators';

import { publicProcedure, router } from '../trpc/init.js';

const USER_NOT_FOUND = 'User not found';

export const userRouter = router({
  list: publicProcedure.input(paginationQuerySchema).query(async ({ ctx, input }) => {
    const { page, limit } = input;
    const offset = (page - 1) * limit;
    const [items, [countResult]] = await Promise.all([
      ctx.db.select().from(usersTable).limit(limit).offset(offset),
      ctx.db.select({ count: count() }).from(usersTable),
    ]);
    const total = countResult?.count ?? 0;
    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }),

  byId: publicProcedure.input(z.object({ id: idSchema })).query(async ({ ctx, input }) => {
    const [user] = await ctx.db.select().from(usersTable).where(eq(usersTable.id, input.id));
    if (!user) {
      throw new TRPCError({ code: 'NOT_FOUND', message: USER_NOT_FOUND });
    }
    return user;
  }),

  create: publicProcedure.input(createUserSchema).mutation(async ({ ctx, input }) => {
    const [user] = await ctx.db.insert(usersTable).values(input).returning();
    if (!user) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
    }
    return user;
  }),

  update: publicProcedure
    .input(z.object({ id: idSchema, data: updateUserSchema }))
    .mutation(async ({ ctx, input }) => {
      const [user] = await ctx.db
        .update(usersTable)
        .set({ ...input.data, updatedAt: new Date() })
        .where(eq(usersTable.id, input.id))
        .returning();
      if (!user) {
        throw new TRPCError({ code: 'NOT_FOUND', message: USER_NOT_FOUND });
      }
      return user;
    }),

  delete: publicProcedure.input(z.object({ id: idSchema })).mutation(async ({ ctx, input }) => {
    const [user] = await ctx.db.delete(usersTable).where(eq(usersTable.id, input.id)).returning();
    if (!user) {
      throw new TRPCError({ code: 'NOT_FOUND', message: USER_NOT_FOUND });
    }
    return { success: true };
  }),
});
