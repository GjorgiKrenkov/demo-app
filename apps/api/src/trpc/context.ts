import type { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';

import type { Database } from '@demo-app/db';
import { db } from '@demo-app/db';

import { COOKIE_NAME, verifyToken } from '../lib/jwt.js';

export interface SessionUser {
  id: string;
  email: string;
  role: 'admin' | 'member' | 'viewer';
}

const extractUser = async (
  req: CreateFastifyContextOptions['req'] | undefined,
): Promise<SessionUser | null> => {
  const cookies = req?.cookies as Record<string, string | undefined> | undefined;
  const token = cookies?.[COOKIE_NAME];
  if (!token) {
    return null;
  }
  const payload = await verifyToken(token);
  if (!payload) {
    return null;
  }
  return { id: payload.sub, email: payload.email, role: payload.role };
};

export const createContext = async ({
  req,
  res,
}: CreateFastifyContextOptions): Promise<{
  req: CreateFastifyContextOptions['req'];
  res: CreateFastifyContextOptions['res'];
  db: Database;
  user: SessionUser | null;
}> => ({
  req,
  res,
  db,
  user: await extractUser(req as CreateFastifyContextOptions['req'] | undefined),
});

export type Context = Awaited<ReturnType<typeof createContext>>;
