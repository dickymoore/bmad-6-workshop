// Placeholder API tests for booking rules; skip until backend exists.
import { test, expect } from '@playwright/test';

test.describe.skip('Booking rules API (pending backend)', () => {
  test('[P0] creating second booking same user/date returns conflict', async ({ request }) => {
    const payload = { userId: 'u1', deskId: 'desk-1', date: '2025-12-03' };
    await request.post('/api/bookings', { data: payload });
    const second = await request.post('/api/bookings', { data: { ...payload, deskId: 'desk-2' } });
    expect(second.status()).toBe(409);
  });
});

