import type { Result } from './last-updated';
import { BackupSchema } from './schema';
import { readBookings, writeBookings } from './bookings';
import { readUsers, writeUsers } from './users';
import { readLastUpdated, touchLastUpdated, writeLastUpdated } from './last-updated';

const BACKUP_KEY = 'desk-booking:backup:last';
const DEFAULT_BACKUP_DIR = 'data/backup';

type ExportOptions = { baseDir?: string };

const formatTimestamp = (date: Date) => {
  const pad = (n: number) => String(n).padStart(2, '0');
  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
  ].join('') + '-' + [pad(date.getHours()), pad(date.getMinutes()), pad(date.getSeconds())].join('');
};

const describeFsError = (error: any) => {
  if (!error) return 'Unknown filesystem error';
  const code = error.code || error?.cause?.code;
  if (code === 'EACCES' || code === 'EPERM') return 'Permission denied writing backup. Check write access to data/backup.';
  if (code === 'ENOENT') return 'Backup directory missing and could not be created.';
  return error.message ?? 'Failed to write backup file';
};

const loadFs = async () => {
  if (typeof process === 'undefined' || !process.versions?.node) {
    return { ok: false as const, error: 'File system unavailable in this environment' };
  }
  try {
    const fs = await import('node:fs/promises');
    const path = await import('node:path');
    return { ok: true as const, data: { fs, path } };
  } catch (error: any) {
    return { ok: false as const, error: error?.message ?? 'Cannot access filesystem' };
  }
};

export const exportBackup = async (options: ExportOptions = {}): Promise<Result<{ path: string }>> => {
  const fsResult = await loadFs();
  if (!fsResult.ok) return fsResult;
  const { fs, path } = fsResult.data;

  const usersResult = readUsers();
  if (!usersResult.ok) return { ok: false, error: `Failed to read users: ${usersResult.error}` };
  const bookingsResult = readBookings();
  if (!bookingsResult.ok) return { ok: false, error: `Failed to read bookings: ${bookingsResult.error}` };
  const lastUpdatedResult = readLastUpdated();
  if (!lastUpdatedResult.ok) return { ok: false, error: `Failed to read lastUpdated: ${lastUpdatedResult.error}` };

  const lastUpdatedValue = lastUpdatedResult.data.updatedAt;
  const lastUpdated =
    typeof lastUpdatedValue === 'string' && lastUpdatedValue.trim() && !Number.isNaN(Date.parse(lastUpdatedValue))
      ? lastUpdatedValue
      : new Date().toISOString();

  const payload = {
    users: usersResult.data,
    bookings: bookingsResult.data,
    lastUpdated: { updatedAt: lastUpdated },
  };

  const validation = BackupSchema.safeParse(payload);
  if (!validation.success) {
    return { ok: false, error: `Backup validation failed: ${validation.error.issues.map((i) => i.message).join('; ')}` };
  }

  const backupDir = path.resolve(process.cwd(), options.baseDir ?? DEFAULT_BACKUP_DIR);
  const filename = `backup-${formatTimestamp(new Date())}.json`;
  const targetPath = path.join(backupDir, filename);
  const tempPath = `${targetPath}.tmp`;

  try {
    await fs.mkdir(backupDir, { recursive: true });
    await fs.writeFile(tempPath, JSON.stringify(validation.data, null, 2), { flag: 'w' });
    await fs.rename(tempPath, targetPath);
    localStorage.setItem(BACKUP_KEY, targetPath);
    return { ok: true, data: { path: targetPath } } as Result<{ path: string }>;
  } catch (error: any) {
    await fs.rm(tempPath, { force: true }).catch(() => {});
    return { ok: false, error: describeFsError(error) };
  }
};

type Snapshot = {
  users: ReturnType<typeof readUsers>['data'];
  bookings: ReturnType<typeof readBookings>['data'];
  lastUpdated: string;
};

const makeSnapshot = (): Result<Snapshot> => {
  const users = readUsers();
  if (!users.ok) return users;
  const bookings = readBookings();
  if (!bookings.ok) return bookings;
  const lastUpdated = readLastUpdated();
  if (!lastUpdated.ok) return lastUpdated;
  return {
    ok: true,
    data: { users: users.data, bookings: bookings.data, lastUpdated: lastUpdated.data.updatedAt },
  } as Result<Snapshot>;
};

const restoreSnapshot = (snapshot: Snapshot) => {
  writeUsers(snapshot.users);
  writeBookings(snapshot.bookings);
  writeLastUpdated(snapshot.lastUpdated || new Date().toISOString());
};

const describeImportError = (message: string) =>
  message.includes('deskId') ? `${message} (check desks.json mapping)` : message;

export const importBackup = (payload: unknown): Result<void> => {
  const parsed = BackupSchema.safeParse(payload);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues.map((i) => i.message).join('; ') };
  }

  const snapshot = makeSnapshot();
  if (!snapshot.ok) return snapshot;

  const targetUpdatedAt =
    typeof parsed.data.lastUpdated === 'string' ? parsed.data.lastUpdated : parsed.data.lastUpdated.updatedAt;

  try {
    const usersResult = writeUsers(parsed.data.users);
    if (!usersResult.ok) throw new Error(usersResult.error);

    const bookingsResult = writeBookings(parsed.data.bookings);
    if (!bookingsResult.ok) throw new Error(bookingsResult.error);

    const lastUpdatedResult = writeLastUpdated(targetUpdatedAt);
    if (!lastUpdatedResult.ok) throw new Error(lastUpdatedResult.error);

    localStorage.setItem(
      BACKUP_KEY,
      JSON.stringify({
        importedAt: new Date().toISOString(),
        schemaVersion: parsed.data.schemaVersion ?? '1.0.0',
        source: 'import',
      }),
    );

    return { ok: true, data: undefined } as Result<void>;
  } catch (error: any) {
    restoreSnapshot(snapshot.data);
    const message = describeImportError(error?.message ?? 'Failed to import backup');
    return { ok: false, error: `Import failed: ${message}` };
  }
};
