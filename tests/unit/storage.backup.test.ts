import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { exportBackup, importBackup } from '../../src/lib/storage/backup';
import { readUsers, writeUsers } from '../../src/lib/storage/users';
import { writeBookings } from '../../src/lib/storage/bookings';

const backupDir = path.resolve(process.cwd(), 'data/backup');

const reset = async () => {
  localStorage.clear();
  await fs.rm(backupDir, { recursive: true, force: true });
  await fs.mkdir(backupDir, { recursive: true });
};

describe('backup helpers', () => {
  beforeEach(async () => {
    await reset();
  });

  it('exports snapshot file with path and payload', async () => {
    localStorage.setItem('desk-booking:last-updated', JSON.stringify({ updatedAt: '2025-12-03T10:11:12.123Z' }));
    writeUsers([{ id: 'u1', name: 'Alice', active: true }]);
    writeBookings([]);

    const result = await exportBackup();
    expect(result.ok).toBe(true);
    const filePath = result.ok ? result.data.path : '';
    expect(path.dirname(filePath)).toBe(backupDir);
    expect(path.basename(filePath)).toMatch(/^backup-\d{8}-\d{6}\.json$/);

    const file = JSON.parse(await fs.readFile(filePath, 'utf8'));
    expect(file.users[0].name).toBe('Alice');
    expect(file.bookings).toEqual([]);
    expect(file.lastUpdated.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
  });

  it('surfaces permission errors without leaving partial files', async () => {
    localStorage.setItem('desk-booking:last-updated', JSON.stringify({ updatedAt: '2025-12-03T10:11:12.123Z' }));
    writeUsers([{ id: 'u1', name: 'Alice', active: true }]);
    writeBookings([]);

    const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'backup-ro-'));
    await fs.chmod(tmpDir, 0o500); // read/execute only

    const result = await exportBackup({ baseDir: tmpDir });
    expect(result.ok).toBe(false);

    const files = await fs.readdir(tmpDir);
    expect(files.length).toBe(0);

    await fs.chmod(tmpDir, 0o755);
    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  it('imports valid payload', () => {
    const payload = {
      users: [{ id: 'u1', name: 'Alice', active: true }],
      bookings: [],
      lastUpdated: { updatedAt: '2025-12-03T10:11:12.123Z' },
    };
    const result = importBackup(payload);
    expect(result.ok).toBe(true);
    expect(readUsers().data.length).toBe(1);
  });

  it('rejects invalid payload', () => {
    const result = importBackup({ bad: true });
    expect(result.ok).toBe(false);
  });
});
