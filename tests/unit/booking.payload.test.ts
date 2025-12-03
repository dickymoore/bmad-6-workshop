import { describe, it, expect } from 'vitest';
import { buildBookingPayload } from '../../src/lib/booking/payload';

describe('booking payload builder', () => {
  it('injects userId and ids', () => {
    const base = {
      office: 'office-lon',
      floor: 'lon-1',
      deskId: 'LON1-D01',
      date: '2025-12-03',
    } as any;

    const result = buildBookingPayload(base, 'user-1');
    expect(result.userId).toBe('user-1');
    expect(result.id).toBeTruthy();
    expect(result.createdAt).toBeTruthy();
  });
});
