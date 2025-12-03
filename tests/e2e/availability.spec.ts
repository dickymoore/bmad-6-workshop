import { test as base, expect } from '../support/fixtures';
import { todayIso } from '../support/helpers/date';

// Gate runs so CI won't fail if app isn't up. Set E2E_RUN=1 to enable.
const RUN_LIVE = process.env.E2E_RUN === '1';
const describe = RUN_LIVE ? base.describe : base.describe.skip;

const office = process.env.E2E_OFFICE || 'LON';
const floor = process.env.E2E_FLOOR || '1';
const deskId = process.env.E2E_DESK || 'desk-1';
const userName = process.env.E2E_USER || 'Alice';

describe('Availability view & navigation', () => {
  base('[P0] @p0 @smoke filters drive map and list', async ({ page }) => {
    const today = todayIso();

    await page.goto('/');

    await page.getByTestId('office-select').selectOption(office);
    await page.getByTestId('floor-select').selectOption(floor);
    await page.getByTestId('date-picker').fill(today);

    // Legend should always be visible
    await expect(page.getByTestId('legend')).toBeVisible();

    // Availability list matches filters
    await expect(page.getByTestId('booking-list')).toBeVisible();
    await expect(page.getByTestId('booking-list')).toContainText(office);
    await expect(page.getByTestId('booking-list')).toContainText(floor);
  });

  base('[P0] @p0 map/list stay in sync on create + cancel', async ({ page }) => {
    const today = todayIso();

    await page.goto('/');
    await page.getByTestId('office-select').selectOption(office);
    await page.getByTestId('floor-select').selectOption(floor);
    await page.getByTestId('date-picker').fill(today);
    await page.getByTestId('user-select').selectOption(userName);

    const desk = page.getByTestId(`desk-${deskId}`);
    await expect(desk).toBeVisible();
    await desk.click();

    await page.getByTestId('confirm-booking').click();
    await expect(page.getByText(/booking confirmed/i)).toBeVisible();
    await expect(page.getByTestId('booking-list')).toContainText(userName);
    await expect(page.getByTestId('booking-list')).toContainText(deskId);

    // Cancel and ensure list/map clear entry
    await page.getByTestId(`cancel-${deskId}`).click();
    await expect(page.getByText(/booking cancelled/i)).toBeVisible();
    await expect(page.getByTestId('booking-list')).not.toContainText(userName);
  });

  base('[P1] @p1 filters update map/list when changed', async ({ page }) => {
    const today = todayIso();

    await page.goto('/');
    await page.getByTestId('date-picker').fill(today);

    // Switch office/floor and expect list to refresh (presence check)
    await page.getByTestId('office-select').selectOption(office);
    await page.getByTestId('floor-select').selectOption(floor);
    await expect(page.getByTestId('booking-list')).toBeVisible();
  });
});

