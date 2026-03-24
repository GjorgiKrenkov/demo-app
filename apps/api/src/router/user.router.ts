import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createUserSchema, updateUserSchema, idSchema, paginationQuerySchema } from '@demo-app/validators';
import { publicProcedure, router } from '../trpc/init.js';
import { usersTable } from '@demo-app/db';
import { eq } from 'drizzle-orm';

export const userRouter = router({
  list: publicProcedure
    .input(paginationQuerySchema)
    .query(async ({ ctx, input }) => {
      const { page, limit } = input;
      const offset = (page - 1) * limit;
      const [items, [countResult]] = await Promise.all([
        ctx.db.select().from(usersTable).limit(limit).offset(offset),
        ctx.db.select({ count: usersTable.id }).from(usersTable),
      ]);
      const total = countResult ? Number(countResult.count) : 0;
      return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
    }),

  byId: publicProcedure
    .input(z.object({ id: idSchema }))
    .query(async ({ ctx, input }) => {
      const [user] = await ctx.db.select().from(usersTable).where(eq(usersTable.id, input.id));
      if (!user) { throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' }); }
      return user;
    }),

  create: publicProcedure
    .input(createUserSchema)
    .mutation(async ({ ctx, input }) => {
      const [user] = await ctx.db.insert(usersTable).values(input).returning();
      if (!user) { throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' }); }
      return user;
    }),

  update: publicProcedure
    .input(z.object({ id: idSchema, data: updateUserSchema }))
    .mutation(async ({ ctx, input }) => {
      const [user] = await ctx.db.update(usersTable)
        .set({ ...input.data, updatedAt: new Date() })
        .where(eq(usersTable.id, input.id))
        .returning();
      if (!user) { throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' }); }
      return user;
    }),

  delete: publicProcedure
    .input(z.object({ id: idSchema }))
    .mutation(async ({ ctx, input }) => {
      const [user] = await ctx.db.delete(usersTable)
        .where(eq(usersTable.id, input.id)).returning();
      if (!user) { throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' }); }
      return { success: true };
    }),
});
