import { expect, test as base, mergeTests } from '@playwright/test';
import { createUserFactory } from './factories/user-factory';
import { createBookingFactory } from './factories/booking-factory';
import { createDeskFactory } from './factories/desk-factory';
import { createBackupFactory } from './factories/backup-factory';

// Single-responsibility fixture slices
const userFixture = base.extend({
  userFactory: async ({}, use) => {
    const factory = createUserFactory();
    await use(factory);
    await factory.cleanup();
  },
});

const bookingFixture = base.extend({
  bookingFactory: async ({}, use) => {
    const factory = createBookingFactory();
    await use(factory);
    await factory.cleanup();
  },
});

const deskFixture = base.extend({
  deskFactory: async ({}, use) => {
    const factory = createDeskFactory();
    await use(factory);
    await factory.cleanup();
  },
});

const backupFixture = base.extend({
  backupFactory: async ({}, use) => {
    const factory = createBackupFactory();
    await use(factory);
    await factory.cleanup();
  },
});

// Compose all fixtures for convenience
export const test = mergeTests(base, userFixture, bookingFixture, deskFixture, backupFixture);
export { expect };

export type UserFactory = ReturnType<typeof createUserFactory>;
export type BookingFactory = ReturnType<typeof createBookingFactory>;
export type DeskFactory = ReturnType<typeof createDeskFactory>;
export type BackupFactory = ReturnType<typeof createBackupFactory>;
