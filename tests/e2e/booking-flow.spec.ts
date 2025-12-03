import fs from 'fs';
import os from 'os';
import path from 'path';
import { test as base, expect } from '../support/fixtures';

const RUN_LIVE = process.env.E2E_RUN === '1';
const office = process.env.E2E_OFFICE || 'LON';
const floor = process.env.E2E_FLOOR || '1';
const deskTestId = process.env.E2E_DESK || 'desk-1';
const userName = process.env.E2E_USER || 'Alice';
const today = new Date().toISOString().slice(0, 10);

// Gate to avoid failing when app isn’t running yet.
const describe = RUN_LIVE ? base.describe : base.describe.skip;

describe('Desk booking happy path', () => {
  base('book then cancel a desk', async ({ page }) => {
    await page.goto('/');

    await page.getByTestId('office-select').selectOption(office);
    await page.getByTestId('floor-select').selectOption(floor);
    await page.getByTestId('date-picker').fill(today);
    await page.getByTestId('user-select').selectOption(userName);

    const desk = page.getByTestId(`desk-${deskTestId}`);
    await expect(desk).toBeVisible();
    await desk.click();

    const confirm = page.getByTestId('confirm-booking');
    await expect(confirm).toBeVisible();
    await confirm.click();

    await expect(page.getByText(/booking confirmed/i)).toBeVisible();
    await expect(page.getByTestId('booking-list')).toContainText(userName);
    await expect(page.getByTestId('booking-list')).toContainText(deskTestId);

    // Cancel
    await page.getByTestId(`cancel-${deskTestId}`).click();
    await expect(page.getByText(/booking cancelled/i)).toBeVisible();
  });
});

describe('Backup and restore', () => {
  base('export then import backup', async ({ page, tmpDir }) => {
    await page.goto('/');

    // Export
    await page.getByTestId('export-backup').click();
    await expect(page.getByText(/backup saved/i)).toBeVisible();

    // Create a minimal backup file for import
    const dir = tmpDir || fs.mkdtempSync(path.join(os.tmpdir(), 'e2e-'));
    const backupPath = path.join(dir, 'backup.json');
    const payload = {
      users: [{ id: 'u1', name: userName, active: true }],
      bookings: [],
      lastUpdated: new Date().toISOString(),
    };
    fs.writeFileSync(backupPath, JSON.stringify(payload, null, 2));

    const fileInput = page.getByTestId('import-backup-file');
    await fileInput.setInputFiles(backupPath);
    await page.getByTestId('import-backup-submit').click();
    await expect(page.getByText(/backup imported/i)).toBeVisible();
  });
});
