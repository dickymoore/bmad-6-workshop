import { readUsers, writeUsers, onUsersChanged, type User } from '../../src/lib/storage/users';

const reset = () => localStorage.clear();

describe('users storage', () => {
  beforeEach(() => reset());

  it('seeds empty array when file missing', () => {
    const result = readUsers();
    expect(result.ok).toBe(true);
    expect(result.data).toEqual([]);
    expect(localStorage.getItem('desk-booking:users')).toBeTruthy();
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
    localStorage.setItem('desk-booking:users', JSON.stringify([{ id: '', name: '', active: true }]));
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
    const stored = JSON.parse(localStorage.getItem('desk-booking:users') ?? '[]');
    expect(stored.length).toBe(2);
    const last = JSON.parse(localStorage.getItem('desk-booking:last-updated') ?? '{}');
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
