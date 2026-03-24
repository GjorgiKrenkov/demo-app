import { ZodError } from 'zod';

import { TRPCError, initTRPC } from '@trpc/server';

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
export const createCallerFactory = t.createCallerFactory;

/** Any authenticated user (admin, member, viewer) */
const authenticatedMiddleware = middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({ ctx: { ...ctx, user: ctx.user } });
});

/** Admin role only */
const adminMiddleware = middleware(({ ctx, next }) => {
  if (ctx.user?.role !== 'admin') {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({ ctx: { ...ctx, user: ctx.user } });
});

export const authenticatedProcedure = t.procedure.use(authenticatedMiddleware);
export const protectedProcedure = t.procedure.use(adminMiddleware);
