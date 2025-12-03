import { describe, it, expect } from 'vitest';
import { cancelBooking, readBookings, writeBookings } from '../../src/lib/storage/bookings';

const booking = {
  id: 'b1',
  office: 'office-lon',
  floor: 'lon-1',
  deskId: 'LON1-D01',
  date: '2025-12-03',
  userId: 'u1',
  createdAt: '2025-12-01T00:00:00Z',
};

describe('cancelBooking', () => {
  beforeEach(() => localStorage.clear());

  it('removes booking and updates storage', () => {
    writeBookings([booking]);
    const result = cancelBooking('b1');
    expect(result.ok).toBe(true);
    const remaining = readBookings();
    expect(remaining.data.length).toBe(0);
  });

  it('returns error when not found', () => {
    writeBookings([booking]);
    const result = cancelBooking('missing');
    expect(result.ok).toBe(false);
  });
});
