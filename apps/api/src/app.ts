import cookie from '@fastify/cookie';
import cors from '@fastify/cors';
import type { FastifyInstance } from 'fastify';
import Fastify from 'fastify';

import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';

import { env } from './env.js';
import { appRouter } from './router/index.js';
import { createContext } from './trpc/context.js';

export const createApp = async (): Promise<FastifyInstance> => {
  const app = Fastify({ logger: env.NODE_ENV !== 'test' });

  await app.register(cookie, { secret: env.JWT_SECRET });

  await app.register(cors, {
    origin: env.CORS_ORIGINS.split(','),
    credentials: true,
  });

  await app.register(fastifyTRPCPlugin, {
    prefix: '/trpc',
    trpcOptions: { router: appRouter, createContext },
  });

  app.get('/health', () => ({ status: 'ok', timestamp: new Date().toISOString() }));

  return app;
};
