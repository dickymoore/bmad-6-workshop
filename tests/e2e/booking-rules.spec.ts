import { test as base, expect } from '../support/fixtures';
import { todayIso } from '../support/helpers/date';
import { seedLocalStorage } from '../support/helpers/seed';

const RUN_LIVE = process.env.E2E_RUN === '1';
const describe = RUN_LIVE ? base.describe : base.describe.skip;

const office = process.env.E2E_OFFICE || 'office-lon';
const floor = process.env.E2E_FLOOR || 'lon-1';
const deskA = process.env.E2E_DESK || 'LON1-D01';
const deskB = process.env.E2E_DESK_B || 'LON1-D02';
const userName = process.env.E2E_USER || 'Visitor';

describe('Booking rules & conflicts', () => {
  base('[P0] @p0 conflict blocks duplicate booking for same user/date', async ({ page }) => {
    const today = todayIso();

    await seedLocalStorage(page, {
      users: [{ id: 'u1', name: userName, active: true }],
    });
    await page.goto('/');
    await page.getByTestId('office-select').selectOption(office);
    await page.getByTestId('floor-select').selectOption(floor);
    await page.getByTestId('date-picker').fill(today);
    await page.getByTestId('user-select').selectOption(userName);

    // First booking succeeds
    await page.getByTestId(`desk-${deskA}`).click();
    await page.getByTestId('confirm-booking').click();
    await expect(page.getByTestId('feedback-toast')).toContainText(/booking confirmed/i);

    // Second booking same user/date should be blocked
    await page.getByTestId(`desk-${deskB}`).click();
    await page.getByTestId('confirm-booking').click();

    await expect(page.getByTestId('feedback-toast')).toContainText(/conflict|already has/i);
  });

  base('[P0] @p0 double-click confirm creates only one booking', async ({ page }) => {
    const today = todayIso();

    await seedLocalStorage(page, {
      users: [{ id: 'u1', name: userName, active: true }],
    });
    await page.goto('/');
    await page.getByTestId('office-select').selectOption(office);
    await page.getByTestId('floor-select').selectOption(floor);
    await page.getByTestId('date-picker').fill(today);
    await page.getByTestId('user-select').selectOption(userName);

    const desk = page.getByTestId(`desk-${deskA}`);
    await desk.click();

    const confirm = page.getByTestId('confirm-booking');
    await confirm.dblclick(); // simulate rapid double submit

    await expect(page.getByTestId('feedback-toast')).toContainText(/booking confirmed/i);

    // List should show only one entry for user+date
    const listText = await page.getByTestId('booking-list').textContent();
    const occurrences = (listText || '').split(userName).length - 1;
    expect(occurrences).toBe(1);
  });

  base('[P1] @p1 cancel removes booking and frees desk', async ({ page }) => {
    const today = todayIso();

    await seedLocalStorage(page, {
      users: [{ id: 'u1', name: userName, active: true }],
    });
    await page.goto('/');
    await page.getByTestId('office-select').selectOption(office);
    await page.getByTestId('floor-select').selectOption(floor);
    await page.getByTestId('date-picker').fill(today);
    await page.getByTestId('user-select').selectOption(userName);

    await page.getByTestId(`desk-${deskA}`).click();
    await page.getByTestId('confirm-booking').click();
    await expect(page.getByTestId('feedback-toast')).toContainText(/booking confirmed/i);

    await page.getByTestId(`cancel-${deskA}`).click();
    await page.getByTestId('confirm-cancel').click();
    await expect(page.getByTestId('feedback-toast')).toContainText(/booking cancelled/i);
    await expect(page.getByTestId('booking-list')).not.toContainText(userName);
  });
});
