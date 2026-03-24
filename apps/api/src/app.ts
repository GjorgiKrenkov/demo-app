import cors from '@fastify/cors';
import type { FastifyInstance } from 'fastify';
import Fastify from 'fastify';

import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';

import { appRouter } from './router/index.js';
import { createContext } from './trpc/context.js';

export const createApp = async (): Promise<FastifyInstance> => {
  const app = Fastify({ logger: process.env['NODE_ENV'] !== 'test' });

  await app.register(cors, {
    origin: (process.env['CORS_ORIGINS'] ?? 'http://localhost:5173').split(','),
    credentials: true,
  });

  await app.register(fastifyTRPCPlugin, {
    prefix: '/trpc',
    trpcOptions: { router: appRouter, createContext },
  });

  app.get('/health', () => ({ status: 'ok', timestamp: new Date().toISOString() }));

  return app;
};
