import { defineConfig } from 'drizzle-kit';
import { resolve } from 'path';

// cwd is packages/db/ when drizzle-kit runs — ../../.env resolves to repo root
try {
  process.loadEnvFile(resolve(process.cwd(), '../../.env'));
} catch {
  /* .env is optional */
}

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/schema/*.table.ts',
  out: './drizzle',
  dbCredentials: { url: process.env['DATABASE_URL'] ?? '' },
  verbose: true,
  strict: true,
});
