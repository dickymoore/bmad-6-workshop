import fs from 'node:fs';
import path from 'node:path';
import { touchLastUpdated } from './last-updated';
import { UsersSchema, UserSchema } from './schema';

export type User = { id: string; name: string; active: boolean };
export type Result<T> = { ok: true; data: T } | { ok: false; error: string };

const DATA_PATH = path.resolve(process.cwd(), 'data');
const FILE_PATH = path.join(DATA_PATH, 'users.json');

type Listener = (users: User[]) => void;
const subscribers = new Set<Listener>();

const ensureDir = () => {
  if (!fs.existsSync(DATA_PATH)) fs.mkdirSync(DATA_PATH, { recursive: true });
};

const seedValue: User[] = [];

const hasDuplicateNames = (users: User[]) => {
  const seen = new Set<string>();
  for (const u of users) {
    const key = u.name.trim().toLowerCase();
    if (seen.has(key)) return true;
    seen.add(key);
  }
  return false;
};

const emit = (users: User[]) => subscribers.forEach((fn) => fn(users));

export const onUsersChanged = (listener: Listener) => {
  subscribers.add(listener);
  return () => subscribers.delete(listener);
};

export const readUsers = (): Result<User[]> => {
  try {
    ensureDir();
    if (!fs.existsSync(FILE_PATH)) {
      fs.writeFileSync(FILE_PATH, JSON.stringify(seedValue), 'utf8');
      return { ok: true, data: seedValue };
    }
    const raw = fs.readFileSync(FILE_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    const users: User[] = [];
    if (Array.isArray(parsed)) {
      parsed.forEach((row, idx) => {
        const result = UserSchema.safeParse(row);
        if (result.success) users.push(result.data);
        else console.warn(`Invalid user at index ${idx}: ${result.error.issues.map((i) => i.message).join('; ')}`);
      });
    }
    return { ok: true, data: users };
  } catch (error: any) {
    return { ok: false, error: error?.message ?? 'Failed to read users' };
  }
};

export const writeUsers = (users: User[]): Result<void> => {
  const parsed = UsersSchema.safeParse(users);
  if (!parsed.success) {
    const msg = parsed.error.issues.map((i) => i.message).join('; ');
    return { ok: false, error: `User validation failed: ${msg}` };
  }
  if (hasDuplicateNames(users)) return { ok: false, error: 'Duplicate user names are not allowed' };

  try {
    ensureDir();
    const tempPath = `${FILE_PATH}.tmp`;
    fs.writeFileSync(tempPath, JSON.stringify(users, null, 2), 'utf8');
    fs.renameSync(tempPath, FILE_PATH);
    touchLastUpdated();
    emit(users);
    return { ok: true, data: undefined } as Result<void>;
  } catch (error: any) {
    return { ok: false, error: error?.message ?? 'Failed to write users' };
  }
};
