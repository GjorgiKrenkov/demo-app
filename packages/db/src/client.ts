import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as schema from './schema/index.js';

const getDatabaseUrl = (): string => {
  const url = process.env['DATABASE_URL'];
  if (!url) {
    throw new Error('DATABASE_URL environment variable is required');
  }
  return url;
};

const createPostgresClient = (url: string): postgres.Sql =>
  postgres(url, { max: 10, idle_timeout: 30, connect_timeout: 10 });

const createDatabase = (client: postgres.Sql): ReturnType<typeof drizzle<typeof schema>> =>
  drizzle(client, { schema, logger: process.env['NODE_ENV'] === 'development' });

const url = getDatabaseUrl();
const client = createPostgresClient(url);
export const db = createDatabase(client);

export type Database = typeof db;
