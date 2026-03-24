import { beforeAll, afterAll, beforeEach } from 'vitest';
import { db } from '@demo-app/db';
import { usersTable } from '@demo-app/db/schema';

beforeAll(async () => {
  // Ensure test DB is clean before suite
});

beforeEach(async () => {
  // Truncate tables before each test for isolation
  await db.delete(usersTable);
});

afterAll(async () => {
  // Cleanup
});
