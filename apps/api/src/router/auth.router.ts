import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import type { FastifyReply } from 'fastify';
import { z } from 'zod';

import { TRPCError } from '@trpc/server';

import { usersTable } from '@demo-app/db';
import { loginSchema, registerSchema } from '@demo-app/validators';

import { COOKIE_MAX_AGE, COOKIE_NAME, signToken } from '../lib/jwt.js';
import type { Context } from '../trpc/context.js';
import { authenticatedProcedure, publicProcedure, router } from '../trpc/init.js';

const SALT_ROUNDS = 12;
const INVALID_CREDENTIALS = 'Invalid email or password';

const setCookie = (res: FastifyReply, token: string): void => {
  void res.setCookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env['NODE_ENV'] === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  });
};

const insertUser = async (
  db: Context['db'],
  input: { email: string; name: string; password: string },
): Promise<{ id: string; email: string; name: string; role: 'admin' | 'member' | 'viewer' }> => {
  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);
  const [user] = await db
    .insert(usersTable)
    .values({ email: input.email, name: input.name, passwordHash })
    .returning({
      id: usersTable.id,
      email: usersTable.email,
      name: usersTable.name,
      role: usersTable.role,
    });
  if (!user) {
    throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
  }
  return user;
};

export const authRouter = router({
  register: publicProcedure.input(registerSchema).mutation(async ({ ctx, input }) => {
    const [existing] = await ctx.db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.email, input.email));

    if (existing) {
      throw new TRPCError({ code: 'CONFLICT', message: 'Email already registered' });
    }

    const user = await insertUser(ctx.db, input);
    const token = await signToken({ sub: user.id, email: user.email, role: user.role });
    setCookie(ctx.res, token);

    return { id: user.id, email: user.email, name: user.name, role: user.role };
  }),

  login: publicProcedure.input(loginSchema).mutation(async ({ ctx, input }) => {
    const [user] = await ctx.db.select().from(usersTable).where(eq(usersTable.email, input.email));

    if (!user?.passwordHash) {
      throw new TRPCError({ code: 'UNAUTHORIZED', message: INVALID_CREDENTIALS });
    }

    const valid = await bcrypt.compare(input.password, user.passwordHash);
    if (!valid) {
      throw new TRPCError({ code: 'UNAUTHORIZED', message: INVALID_CREDENTIALS });
    }

    const token = await signToken({ sub: user.id, email: user.email, role: user.role });
    setCookie(ctx.res, token);

    return { id: user.id, email: user.email, name: user.name, role: user.role };
  }),

  logout: publicProcedure.mutation(({ ctx }) => {
    void ctx.res.clearCookie(COOKIE_NAME, { path: '/' });
    return { success: true };
  }),

  me: publicProcedure.query(
    ({ ctx }): { id: string; email: string; name: string; role: string } | null => {
      if (!ctx.user) {
        return null;
      }
      return {
        id: ctx.user.id,
        email: ctx.user.email,
        name: ctx.user.email,
        role: ctx.user.role,
      };
    },
  ),

  changePassword: authenticatedProcedure
    .input(
      z.object({
        currentPassword: z.string().min(1),
        newPassword: z.string().min(8).max(72),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [user] = await ctx.db.select().from(usersTable).where(eq(usersTable.id, ctx.user.id));

      if (!user?.passwordHash) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }

      const valid = await bcrypt.compare(input.currentPassword, user.passwordHash);
      if (!valid) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Current password is incorrect' });
      }

      const passwordHash = await bcrypt.hash(input.newPassword, SALT_ROUNDS);
      await ctx.db
        .update(usersTable)
        .set({ passwordHash, updatedAt: new Date() })
        .where(eq(usersTable.id, ctx.user.id));

      return { success: true };
    }),
});
