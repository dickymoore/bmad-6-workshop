import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/unit/**/*.test.ts', 'tests/component/**/*.spec.tsx'],
    environment: 'jsdom',
    environmentMatchGlobs: [['tests/unit/**', 'node']],
    globals: true,
    setupFiles: './tests/setup.ts',
  },
});
