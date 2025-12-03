import { test as base, expect } from '../support/fixtures';
import { todayIso } from '../support/helpers/date';

const RUN_LIVE = process.env.E2E_RUN === '1';
const describe = RUN_LIVE ? base.describe : base.describe.skip;

const office = process.env.E2E_OFFICE || 'LON';
const floor = process.env.E2E_FLOOR || '1';
const deskA = process.env.E2E_DESK || 'desk-1';
const deskB = process.env.E2E_DESK_B || 'desk-2';
const userName = process.env.E2E_USER || 'Alice';

describe('Booking rules & conflicts', () => {
  base('[P0] @p0 conflict blocks duplicate booking for same user/date', async ({ page }) => {
    const today = todayIso();

    await page.goto('/');
    await page.getByTestId('office-select').selectOption(office);
    await page.getByTestId('floor-select').selectOption(floor);
    await page.getByTestId('date-picker').fill(today);
    await page.getByTestId('user-select').selectOption(userName);

    // First booking succeeds
    await page.getByTestId(`desk-${deskA}`).click();
    await page.getByTestId('confirm-booking').click();
    await expect(page.getByText(/booking confirmed/i)).toBeVisible();

    // Second booking same user/date should be blocked
    await page.getByTestId(`desk-${deskB}`).click();
    await page.getByTestId('confirm-booking').click();

    await expect(page.getByText(/conflict|already have/i)).toBeVisible();
  });

  base('[P0] @p0 double-click confirm creates only one booking', async ({ page }) => {
    const today = todayIso();

    await page.goto('/');
    await page.getByTestId('office-select').selectOption(office);
    await page.getByTestId('floor-select').selectOption(floor);
    await page.getByTestId('date-picker').fill(today);
    await page.getByTestId('user-select').selectOption(userName);

    const desk = page.getByTestId(`desk-${deskA}`);
    await desk.click();

    const confirm = page.getByTestId('confirm-booking');
    await confirm.dblclick(); // simulate rapid double submit

    await expect(page.getByText(/booking confirmed/i)).toBeVisible();

    // List should show only one entry for user+date
    const listText = await page.getByTestId('booking-list').textContent();
    const occurrences = (listText || '').split(userName).length - 1;
    expect(occurrences).toBe(1);
  });

  base('[P1] @p1 cancel removes booking and frees desk', async ({ page }) => {
    const today = todayIso();

    await page.goto('/');
    await page.getByTestId('office-select').selectOption(office);
    await page.getByTestId('floor-select').selectOption(floor);
    await page.getByTestId('date-picker').fill(today);
    await page.getByTestId('user-select').selectOption(userName);

    await page.getByTestId(`desk-${deskA}`).click();
    await page.getByTestId('confirm-booking').click();
    await expect(page.getByText(/booking confirmed/i)).toBeVisible();

    await page.getByTestId(`cancel-${deskA}`).click();
    await expect(page.getByText(/booking cancelled/i)).toBeVisible();
    await expect(page.getByTestId('booking-list')).not.toContainText(userName);
  });
});

