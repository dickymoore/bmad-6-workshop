// Placeholder API tests (local app is client-only). Enable when HTTP endpoints exist.
import { test, expect } from '@playwright/test';

test.describe.skip('Storage API (pending backend endpoints)', () => {
  test('[P0] should reject invalid backup payload', async ({ request }) => {
    const response = await request.post('/api/backup/import', {
      data: { users: true },
    });
    expect(response.status()).toBeGreaterThanOrEqual(400);
  });
});

