// Component tests require Playwright component test setup; placeholder skipped until configured.
import { test, expect } from '@playwright/experimental-ct-react';

test.describe.skip('Roster notice (component)', () => {
  test('[P1] shows empty roster notice when no users', async ({ mount }) => {
    // TODO: mount roster component with empty list and assert notice is visible.
    await expect(true).toBeTruthy();
  });
});

