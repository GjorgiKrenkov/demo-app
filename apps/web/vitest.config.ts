import { defineConfig, mergeConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { baseVitestConfig } from '@demo-app/config/vitest/base';

export default mergeConfig(baseVitestConfig, defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.tsx', 'src/**/*.test.ts'],
    setupFiles: ['src/__tests__/setup.ts'],
  },
  resolve: {
    alias: { '@': resolve(__dirname, './src') },
  },
}));