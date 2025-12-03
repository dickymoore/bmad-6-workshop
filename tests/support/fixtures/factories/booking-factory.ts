import { faker } from '@faker-js/faker';

type Booking = {
  id: string;
  office: string;
  floor: string;
  deskId: string;
  date: string; // YYYY-MM-DD
  userId: string;
  createdAt: string;
  releasedAt?: string;
};

export function createBookingFactory() {
  const createdIds: string[] = [];

  function generateBooking(overrides: Partial<Booking> = {}): Booking {
    const booking: Booking = {
      id: overrides.id || faker.string.uuid(),
      office: overrides.office || 'LON',
      floor: overrides.floor || '1',
      deskId: overrides.deskId || 'desk-1',
      date: overrides.date || new Date().toISOString().slice(0, 10),
      userId: overrides.userId || faker.string.uuid(),
      createdAt: overrides.createdAt || new Date().toISOString(),
      releasedAt: overrides.releasedAt,
    };

    createdIds.push(booking.id);
    return booking;
  }

  async function cleanup() {
    createdIds.length = 0; // No remote cleanup needed for local file-based app
  }

  return { generateBooking, cleanup };
}

export type BookingFactory = ReturnType<typeof createBookingFactory>;
