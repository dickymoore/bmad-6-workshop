import { faker } from '@faker-js/faker';
import { createUserFactory } from './user-factory';
import { createBookingFactory, type BookingFactory } from './booking-factory';

type BackupPayload = {
  users: Array<{ id: string; name: string; active: boolean }>;
  bookings: Array<ReturnType<BookingFactory['generateBooking']>>;
  lastUpdated: string;
  version?: string;
};

export function createBackupFactory() {
  const userFactory = createUserFactory();
  const bookingFactory = createBookingFactory();

  function generateBackup(overrides: Partial<BackupPayload> = {}): BackupPayload {
    const users = overrides.users || [userFactory.generateUser({ active: true })];
    const bookings = overrides.bookings || [];

    return {
      users,
      bookings,
      lastUpdated: overrides.lastUpdated || new Date().toISOString(),
      version: overrides.version || '1.0.0',
    };
  }

  async function cleanup() {
    await userFactory.cleanup();
    await bookingFactory.cleanup();
  }

  return { generateBackup, cleanup };
}

export type BackupFactory = ReturnType<typeof createBackupFactory>;
