import { beforeEach, describe, expect, it } from 'vitest';

import type { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';

import { createContext } from '../../trpc/context.js';
import { createCallerFactory } from '../../trpc/init.js';
import { appRouter } from '../index.js';

// ── Test factory ───────────────────────────────────────────────────────────
const createCaller = createCallerFactory(appRouter);

const mockRes = {
  setCookie: () => mockRes,
  clearCookie: () => mockRes,
} as unknown as CreateFastifyContextOptions['res'];

const makeMockCtx = (): ReturnType<typeof createContext> =>
  createContext({ res: mockRes } as unknown as CreateFastifyContextOptions);

// ── Tests ──────────────────────────────────────────────────────────────────
describe('authRouter', () => {
  let caller: ReturnType<typeof createCaller>;

  beforeEach(async () => {
    caller = createCaller(await makeMockCtx());
  });

  describe('register', () => {
    it('creates a new member account', async () => {
      const result = await caller.auth.register({
        email: 'new@example.com',
        name: 'New User',
        password: 'password123',
      });

      expect(result.email).toBe('new@example.com');
      expect(result.name).toBe('New User');
      expect(result.role).toBe('member');
      expect(result.id).toBeDefined();
    });

    it('rejects duplicate email', async () => {
      await caller.auth.register({
        email: 'dup@example.com',
        name: 'First',
        password: 'password123',
      });

      await expect(
        caller.auth.register({
          email: 'dup@example.com',
          name: 'Second',
          password: 'password123',
        }),
      ).rejects.toMatchObject({ code: 'CONFLICT' });
    });

    it('rejects password shorter than 8 characters', async () => {
      await expect(
        caller.auth.register({ email: 'short@example.com', name: 'Test', password: 'abc' }),
      ).rejects.toThrow();
    });
  });

  describe('login', () => {
    it('returns user on valid credentials', async () => {
      await caller.auth.register({
        email: 'login@example.com',
        name: 'Login User',
        password: 'password123',
      });

      const result = await caller.auth.login({
        email: 'login@example.com',
        password: 'password123',
      });

      expect(result.email).toBe('login@example.com');
    });

    it('rejects wrong password', async () => {
      await caller.auth.register({
        email: 'wrongpw@example.com',
        name: 'User',
        password: 'correctpassword',
      });

      await expect(
        caller.auth.login({ email: 'wrongpw@example.com', password: 'wrongpassword' }),
      ).rejects.toMatchObject({ code: 'UNAUTHORIZED' });
    });

    it('rejects non-existent email', async () => {
      await expect(
        caller.auth.login({ email: 'ghost@example.com', password: 'password123' }),
      ).rejects.toMatchObject({ code: 'UNAUTHORIZED' });
    });
  });

  describe('me', () => {
    it('returns null when not authenticated', async () => {
      const result = await caller.auth.me();
      expect(result).toBeNull();
    });
  });

  describe('logout', () => {
    it('returns success', async () => {
      const result = await caller.auth.logout();
      expect(result.success).toBe(true);
    });
  });
});
