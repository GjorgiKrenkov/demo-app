import type { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';
import { db } from '@demo-app/db';

export const createContext = ({ req, res }: CreateFastifyContextOptions) => ({
  req,
  res,
  db,
  user: null as null | { id: string; email: string; role: string },
});

export type Context = ReturnType<typeof createContext>;
