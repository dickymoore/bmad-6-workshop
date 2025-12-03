import fs from 'node:fs';
import path from 'node:path';
import { readBookings, writeBookings, type Booking } from '../../src/lib/storage/bookings';
import { isIsoString } from '../../src/lib/storage/last-updated';

const dataDir = path.resolve(process.cwd(), 'data');
const bookingsPath = path.join(dataDir, 'bookings.json');
const lastUpdatedPath = path.join(dataDir, 'last-updated.json');

const resetFiles = () => {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(bookingsPath, JSON.stringify([]), 'utf8');
  fs.writeFileSync(lastUpdatedPath, JSON.stringify({ updatedAt: '' }), 'utf8');
};

describe('bookings storage', () => {
  beforeEach(() => resetFiles());

  it('returns empty array when file missing', () => {
    fs.unlinkSync(bookingsPath);
    const result = readBookings();
    expect(result.ok).toBe(true);
    expect(result.data).toEqual([]);
  });

  it('skips invalid rows on read with warning', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const data = [
      { id: '1', office: 'office-lon', floor: 'lon-1', deskId: 'INVALID', date: '2025-12-03', userId: 'u1', createdAt: '2025-12-03T10:11:12.123Z' },
    ];
    fs.writeFileSync(bookingsPath, JSON.stringify(data), 'utf8');
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
    const stored = JSON.parse(fs.readFileSync(bookingsPath, 'utf8'));
    expect(stored.length).toBe(1);
    const last = JSON.parse(fs.readFileSync(lastUpdatedPath, 'utf8'));
    expect(isIsoString(last.updatedAt)).toBe(true);
  });
});
