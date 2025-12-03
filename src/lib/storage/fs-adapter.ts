import fs from 'node:fs';
import path from 'node:path';

export type Result<T> = { ok: true; data: T } | { ok: false; error: string };

const DATA_DIR = path.resolve(process.cwd(), 'data');

const ensureDir = () => {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
};

const safePath = (relativePath: string) => {
  const resolved = path.resolve(DATA_DIR, relativePath);
  if (!resolved.startsWith(DATA_DIR)) throw new Error('Path traversal rejected');
  return resolved;
};

export const readJsonFile = <T>(relativePath: string, fallback: T): Result<T> => {
  try {
    ensureDir();
    const fullPath = safePath(relativePath);
    if (!fs.existsSync(fullPath)) {
      fs.writeFileSync(fullPath, JSON.stringify(fallback, null, 2), 'utf8');
      return { ok: true, data: fallback };
    }
    const raw = fs.readFileSync(fullPath, 'utf8');
    const parsed = JSON.parse(raw);
    return { ok: true, data: parsed as T };
  } catch (error: any) {
    return { ok: false, error: error?.message ?? 'Failed to read JSON file' };
  }
};

export const writeJsonFile = <T>(relativePath: string, data: T): Result<void> => {
  try {
    ensureDir();
    const fullPath = safePath(relativePath);
    const tempPath = `${fullPath}.tmp`;
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf8');
    fs.renameSync(tempPath, fullPath);
    return { ok: true, data: undefined } as Result<void>;
  } catch (error: any) {
    return { ok: false, error: error?.message ?? 'Failed to write JSON file' };
  }
};
