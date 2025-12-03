import { readBookings, writeBookings, type Booking } from '../../src/lib/storage/bookings';
import { isIsoString } from '../../src/lib/storage/last-updated';

const reset = () => localStorage.clear();

describe('bookings storage', () => {
  beforeEach(() => reset());

  it('returns empty array when file missing', () => {
    const result = readBookings();
    expect(result.ok).toBe(true);
    expect(result.data).toEqual([]);
  });

  it('skips invalid rows on read with warning', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const data = [
      { id: '1', office: 'office-lon', floor: 'lon-1', deskId: 'INVALID', date: '2025-12-03', userId: 'u1', createdAt: '2025-12-03T10:11:12.123Z' },
    ];
    localStorage.setItem('desk-booking:bookings', JSON.stringify(data));
    const result = readBookings();
    expect(result.ok).toBe(true);
    expect(result.data).toEqual([]);
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it('rejects invalid booking on write (deskId)', () => {
    const bookings: Booking[] = [
      {
        id: '1',
        office: 'office-lon',
        floor: 'lon-1',
        deskId: 'not-real',
        date: '2025-12-03',
        userId: 'u1',
        createdAt: '2025-12-03T10:11:12.123Z',
      },
    ];
    const result = writeBookings(bookings);
    expect(result.ok).toBe(false);
  });

  it('writes valid bookings and updates last-updated', () => {
    const bookings: Booking[] = [
      {
        id: '1',
        office: 'office-lon',
        floor: 'lon-1',
        deskId: 'LON1-D01',
        date: '2025-12-03',
        userId: 'u1',
        createdAt: '2025-12-03T10:11:12.123Z',
      },
    ];
    const result = writeBookings(bookings);
    expect(result.ok).toBe(true);
    const stored = JSON.parse(localStorage.getItem('desk-booking:bookings') ?? '[]');
    expect(stored.length).toBe(1);
    const last = JSON.parse(localStorage.getItem('desk-booking:last-updated') ?? '{}');
    expect(isIsoString(last.updatedAt)).toBe(true);
  });
});
