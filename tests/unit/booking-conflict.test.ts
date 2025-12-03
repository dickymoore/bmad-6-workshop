import { describe, it, expect } from 'vitest';
import { createBooking, checkUserDateConflict } from '../../src/lib/booking/create';
import { writeBookings } from '../../src/lib/storage/bookings';

const baseBooking = {
  id: 'b1',
  office: 'office-lon',
  floor: 'lon-1',
  deskId: 'LON1-D01',
  date: '2025-12-03',
  userId: 'u1',
  createdAt: '2025-12-01T00:00:00Z',
};

describe('booking conflict rules', () => {
  beforeEach(() => localStorage.clear());

  it('detects conflict for same user/date', () => {
    writeBookings([baseBooking]);
    const result = createBooking(
      { office: 'office-lon', floor: 'lon-1', deskId: 'LON1-D02', date: '2025-12-03' },
      'u1',
    );
    expect(result.ok).toBe(false);
    expect(result.code).toBe('USER_DATE_CONFLICT');
  });

  it('allows different user same date', () => {
    writeBookings([baseBooking]);
    const result = createBooking(
      { office: 'office-lon', floor: 'lon-1', deskId: 'LON1-D02', date: '2025-12-03' },
      'u2',
    );
    expect(result.ok).toBe(true);
  });

  it('visitor id conflicts on same date', () => {
    writeBookings([{ ...baseBooking, userId: 'visitor' }]);
    const result = createBooking(
      { office: 'office-lon', floor: 'lon-1', deskId: 'LON1-D02', date: '2025-12-03' },
      'visitor',
    );
    expect(result.ok).toBe(false);
    expect(result.code).toBe('USER_DATE_CONFLICT');
  });

  it('checkUserDateConflict helper', () => {
    const has = checkUserDateConflict([baseBooking], 'u1', '2025-12-03');
    expect(has).toBe(true);
  });
});
