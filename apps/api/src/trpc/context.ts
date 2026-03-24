import type { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';

import { db } from '@demo-app/db';

export interface Context {
  req: CreateFastifyContextOptions['req'];
  res: CreateFastifyContextOptions['res'];
  db: typeof db;
  user: null | { id: string; email: string; role: string };
}

export const createContext = ({ req, res }: CreateFastifyContextOptions): Context => ({
  req,
  res,
  db,
  user: null,
});
