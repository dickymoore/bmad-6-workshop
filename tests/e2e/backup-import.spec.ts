import fs from 'fs';
import os from 'os';
import path from 'path';
import { test as base, expect } from '../support/fixtures';

const RUN_LIVE = process.env.E2E_RUN === '1';
const describe = RUN_LIVE ? base.describe : base.describe.skip;

describe('Backup and import', () => {
  base('[P0] @p0 export backup succeeds', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('export-backup').click();
    await expect(page.getByText(/backup saved/i)).toBeVisible();
  });

  base('[P0] @p0 import valid backup restores data', async ({ page, backupFactory }) => {
    await page.goto('/');

    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'backup-'));
    const backup = backupFactory.generateBackup();
    const backupPath = path.join(dir, 'backup.json');
    fs.writeFileSync(backupPath, JSON.stringify(backup, null, 2));

    await page.getByTestId('import-backup-file').setInputFiles(backupPath);
    await page.getByTestId('import-backup-submit').click();

    await expect(page.getByText(/backup imported/i)).toBeVisible();
  });

  base('[P1] @p1 import rejects malformed backup', async ({ page }) => {
    await page.goto('/');

    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'backup-'));
    const badPath = path.join(dir, 'bad.json');
    fs.writeFileSync(badPath, '{"users": true'); // malformed JSON

    await page.getByTestId('import-backup-file').setInputFiles(badPath);
    await page.getByTestId('import-backup-submit').click();

    await expect(page.getByText(/invalid|error|failed/i)).toBeVisible();
  });
});

