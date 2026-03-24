/** @type {import('vitest/config').UserConfig} */
export const baseVitestConfig = {
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'json-summary', 'lcov', 'html'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80,
      },
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/*.d.ts',
        '**/index.ts',
        '**/*.config.*',
        '**/test-utils/**',
        '**/__mocks__/**',
      ],
    },
    reporters: ['verbose', 'junit'],
    outputFile: { junit: 'test-results/junit.xml' },
  },
};
