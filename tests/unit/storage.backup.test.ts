import { exportBackup, importBackup } from '../../src/lib/storage/backup';
import { readUsers, writeUsers } from '../../src/lib/storage/users';
import { writeBookings } from '../../src/lib/storage/bookings';

const reset = () => localStorage.clear();

describe('backup helpers', () => {
  beforeEach(() => reset());

  it('exports current data payload', () => {
    writeUsers([{ id: 'u1', name: 'Alice', active: true }]);
    writeBookings([]);
    const result = exportBackup();
    expect(result.ok).toBe(true);
    expect(result.data.payload).toBeDefined();
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
