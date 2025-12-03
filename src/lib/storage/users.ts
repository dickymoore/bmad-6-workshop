import { touchLastUpdated } from './last-updated';
import { UsersSchema, UserSchema } from './schema';

export type User = { id: string; name: string; active: boolean };
export type Result<T> = { ok: true; data: T } | { ok: false; error: string };

const STORAGE_KEY = 'desk-booking:users';

type Listener = (users: User[]) => void;
const subscribers = new Set<Listener>();

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
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seedValue));
      return { ok: true, data: seedValue };
    }
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users, null, 2));
    touchLastUpdated();
    emit(users);
    return { ok: true, data: undefined } as Result<void>;
  } catch (error: any) {
    return { ok: false, error: error?.message ?? 'Failed to write users' };
  }
};
