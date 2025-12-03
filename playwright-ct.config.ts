import { defineConfig } from '@playwright/experimental-ct-react';

export default defineConfig({
  testDir: './tests/component',
  /* Adjust if the app uses TS path aliases; add `resolve.alias` in `ctViteConfig` */
  ctViteConfig: {
    resolve: {
      alias: {
        '@tests': '/tests',
      },
    },
  },
  retries: 0,
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
});
