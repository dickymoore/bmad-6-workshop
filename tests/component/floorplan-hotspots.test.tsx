// Component tests require Playwright component test setup; placeholder skipped until configured.
import { test, expect } from '@playwright/experimental-ct-react';

test.describe.skip('Floorplan hotspots (component)', () => {
  test('[P0] hotspots focusable with aria labels', async ({ mount }) => {
    // TODO: mount Floorplan component and assert focus/aria when CT runner is configured.
    await expect(true).toBeTruthy();
  });
});

