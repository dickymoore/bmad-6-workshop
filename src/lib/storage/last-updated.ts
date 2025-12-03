export type LastUpdated = { updatedAt: string };
export type Result<T> = { ok: true; data: T } | { ok: false; error: string };

const isoPattern = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/;

type Listener = (timestamp: string) => void;
const subscribers = new Set<Listener>();

const STORAGE_KEY = 'desk-booking:last-updated';
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
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seedValue));
      return { ok: true, data: seedValue };
    }
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ updatedAt }));
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
