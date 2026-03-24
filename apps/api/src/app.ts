import Fastify from 'fastify';
import cors from '@fastify/cors';
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import { appRouter } from './router/index.js';
import { createContext } from './trpc/context.js';

export const createApp = async () => {
  const app = Fastify({ logger: process.env['NODE_ENV'] !== 'test' });

  await app.register(cors, {
    origin: (process.env['CORS_ORIGINS'] ?? 'http://localhost:5173').split(','),
    credentials: true,
  });

  await app.register(fastifyTRPCPlugin, {
    prefix: '/trpc',
    trpcOptions: { router: appRouter, createContext },
  });

  app.get('/health', async () => ({ status: 'ok', timestamp: new Date().toISOString() }));

  return app;
};
