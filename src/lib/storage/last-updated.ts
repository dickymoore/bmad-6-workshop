import fs from 'node:fs';
import path from 'node:path';

const DATA_PATH = path.resolve(process.cwd(), 'data');
const FILE_PATH = path.join(DATA_PATH, 'last-updated.json');

export type LastUpdated = { updatedAt: string };
export type Result<T> = { ok: true; data: T } | { ok: false; error: string };

const isoPattern = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/;

type Listener = (timestamp: string) => void;
const subscribers = new Set<Listener>();

const ensureDir = () => {
  if (!fs.existsSync(DATA_PATH)) fs.mkdirSync(DATA_PATH, { recursive: true });
};

const seedValue: LastUpdated = { updatedAt: '' };

export const isIsoString = (value: string) => isoPattern.test(value);

export const onLastUpdated = (listener: Listener) => {
  subscribers.add(listener);
  return () => subscribers.delete(listener);
};

const emit = (timestamp: string) => {
  subscribers.forEach((fn) => fn(timestamp));
};

export const readLastUpdated = (): Result<LastUpdated> => {
  try {
    ensureDir();
    if (!fs.existsSync(FILE_PATH)) {
      fs.writeFileSync(FILE_PATH, JSON.stringify(seedValue), 'utf8');
      return { ok: true, data: seedValue };
    }
    const raw = fs.readFileSync(FILE_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    const updatedAt = typeof parsed?.updatedAt === 'string' ? parsed.updatedAt : '';
    return { ok: true, data: { updatedAt } };
  } catch (error: any) {
    return { ok: false, error: error?.message ?? 'Failed to read last-updated' };
  }
};

export const writeLastUpdated = (updatedAt: string): Result<LastUpdated> => {
  if (!isIsoString(updatedAt) && Number.isNaN(Date.parse(updatedAt))) {
    return { ok: false, error: 'Invalid ISO timestamp' };
  }
  try {
    ensureDir();
    const tempPath = `${FILE_PATH}.tmp`;
    fs.writeFileSync(tempPath, JSON.stringify({ updatedAt }), 'utf8');
    fs.renameSync(tempPath, FILE_PATH);
    emit(updatedAt);
    return { ok: true, data: { updatedAt } };
  } catch (error: any) {
    return { ok: false, error: error?.message ?? 'Failed to write last-updated' };
  }
};

export const touchLastUpdated = (): Result<LastUpdated> => {
  const iso = new Date().toISOString();
  return writeLastUpdated(iso);
};
