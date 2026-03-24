import { initTRPC, TRPCError } from '@trpc/server';
import { ZodError } from 'zod';
import type { Context } from './context.js';

const t = initTRPC.context<Context>().create({
  errorFormatter: ({ shape, error }) => ({
    ...shape,
    data: {
      ...shape.data,
      zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
    },
  }),
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const middleware = t.middleware;

const authMiddleware = middleware(({ ctx, next }) => {
  if (!ctx.user) { throw new TRPCError({ code: 'UNAUTHORIZED' }); }
  return next({ ctx: { ...ctx, user: ctx.user } });
});

export const protectedProcedure = t.procedure.use(authMiddleware);
