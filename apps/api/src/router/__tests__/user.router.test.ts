import { beforeEach, describe, expect, it } from 'vitest';

import type { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';

import type { Context } from '../../trpc/context.js';
import { createContext } from '../../trpc/context.js';
import { createCallerFactory } from '../../trpc/init.js';
import { appRouter } from '../index.js';

// ── Test factory ───────────────────────────────────────────────────────────
const createCaller = createCallerFactory(appRouter);

const makeMockCtx = (): Context => createContext({} as unknown as CreateFastifyContextOptions);

// ── Tests ──────────────────────────────────────────────────────────────────
describe('userRouter', () => {
  let caller: ReturnType<typeof createCaller>;

  beforeEach(() => {
    caller = createCaller(makeMockCtx());
  });

  describe('create', () => {
    it('creates a user with valid input', async () => {
      const result = await caller.user.create({ email: 'test@example.com', name: 'Test User' });

      expect(result.email).toBe('test@example.com');
      expect(result.name).toBe('Test User');
      expect(result.id).toBeDefined();
    });

    it('rejects invalid email', async () => {
      await expect(caller.user.create({ email: 'not-an-email', name: 'Test' })).rejects.toThrow();
    });
  });

  describe('list', () => {
    it('returns paginated users', async () => {
      await caller.user.create({ email: 'a@example.com', name: 'A' });
      const result = await caller.user.list({ page: 1, limit: 20 });

      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(1);
    });
  });

  describe('byId', () => {
    it('throws NOT_FOUND for unknown id', async () => {
      await expect(
        caller.user.byId({ id: '00000000-0000-0000-0000-000000000000' }),
      ).rejects.toMatchObject({ code: 'NOT_FOUND' });
    });
  });
});
