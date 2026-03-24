import { defineConfig, mergeConfig } from 'vitest/config';
import { baseVitestConfig } from '@demo-app/config/vitest/base';

export default mergeConfig(baseVitestConfig, defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
}));