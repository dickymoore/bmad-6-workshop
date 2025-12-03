import fs from 'node:fs';
import path from 'node:path';
import { readUsers, writeUsers, onUsersChanged, type User } from '../../src/lib/storage/users';

const dataDir = path.resolve(process.cwd(), 'data');
const usersPath = path.join(dataDir, 'users.json');
const lastUpdatedPath = path.join(dataDir, 'last-updated.json');

const resetFiles = () => {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(usersPath, JSON.stringify([]), 'utf8');
  fs.writeFileSync(lastUpdatedPath, JSON.stringify({ updatedAt: '' }), 'utf8');
};

describe('users storage', () => {
  beforeEach(() => resetFiles());

  it('seeds empty array when file missing', () => {
    fs.unlinkSync(usersPath);
    const result = readUsers();
    expect(result.ok).toBe(true);
    expect(result.data).toEqual([]);
    expect(fs.existsSync(usersPath)).toBe(true);
  });

  it('rejects duplicate names', () => {
    const users: User[] = [
      { id: '1', name: 'Alice', active: true },
      { id: '2', name: 'alice', active: true },
    ];
    const result = writeUsers(users);
    expect(result.ok).toBe(false);
  });

  it('rejects empty names', () => {
    const users: User[] = [{ id: '1', name: '   ', active: true }];
    const result = writeUsers(users);
    expect(result.ok).toBe(false);
  });

  it('skips invalid rows on read with warning', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    fs.writeFileSync(usersPath, JSON.stringify([{ id: '', name: '', active: true }]), 'utf8');
    const result = readUsers();
    expect(result.ok).toBe(true);
    expect(result.data).toEqual([]);
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it('writes users and updates last-updated', () => {
    const users: User[] = [
      { id: '1', name: 'Alice', active: true },
      { id: '2', name: 'Bob', active: false },
    ];
    const result = writeUsers(users);
    expect(result.ok).toBe(true);
    const stored = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
    expect(stored.length).toBe(2);
    const last = JSON.parse(fs.readFileSync(lastUpdatedPath, 'utf8'));
    expect(typeof last.updatedAt).toBe('string');
    expect(last.updatedAt.length).toBeGreaterThan(0);
  });

  it('emits change events', () => {
    const users: User[] = [{ id: '1', name: 'Alice', active: true }];
    let called = false;
    const unsubscribe = onUsersChanged(() => {
      called = true;
    });
    writeUsers(users);
    unsubscribe();
    expect(called).toBe(true);
  });
});
