import { resolve } from 'path';
import { defineConfig, mergeConfig } from 'vitest/config';

import { baseVitestConfig } from '@demo-app/config/vitest/base';

// Load .env for DATABASE_URL — cwd is apps/api/ when vitest runs
try {
  process.loadEnvFile(resolve(process.cwd(), '../../.env'));
} catch {
  /* .env is optional in CI */
}

export default mergeConfig(
  baseVitestConfig,
  defineConfig({
    test: {
      environment: 'node',
      include: ['src/**/*.test.ts'],
      setupFiles: ['src/__tests__/setup.ts'],
    },
  }),
);
