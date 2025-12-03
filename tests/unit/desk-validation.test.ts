import { describe, it, expect, vi } from 'vitest';
import { createBooking } from '../../src/lib/booking/create';
import { writeBookings, readBookings } from '../../src/lib/storage/bookings';

const base = {
  office: 'office-lon',
  floor: 'lon-1',
  deskId: 'LON1-D01',
  date: '2025-12-03',
};

describe('desk validation', () => {
  beforeEach(() => localStorage.clear());

  it('rejects invalid desk on create', () => {
    const result = createBooking({ ...base, deskId: 'BAD' }, 'u1');
    expect(result.ok).toBe(false);
    expect(result.code).toBe('INVALID_DESK');
  });

  it('drops invalid bookings on read with warning', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    localStorage.setItem(
      'desk-booking:bookings',
      JSON.stringify([
        { ...base, deskId: 'BAD', id: 'b1', userId: 'u1', createdAt: new Date().toISOString() },
        { ...base, deskId: 'LON1-D01', id: 'b2', userId: 'u2', createdAt: new Date().toISOString() },
      ]),
    );

    const result = readBookings();
    expect(result.data.length).toBe(1);
    expect(warn).toHaveBeenCalled();
  });
});
