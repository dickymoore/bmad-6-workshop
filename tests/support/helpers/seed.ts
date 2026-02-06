import type { Page } from '@playwright/test';

type SeedUser = { id: string; name: string; active: boolean };

type SeedOptions = {
  users?: SeedUser[];
  bookings?: unknown[];
  lastUpdated?: string;
};

export const seedLocalStorage = async (page: Page, options: SeedOptions = {}) => {
  const users = options.users ?? [];
  const bookings = options.bookings ?? [];
  const lastUpdated = options.lastUpdated ?? '';

  await page.addInitScript(
    ({ usersArg, bookingsArg, lastUpdatedArg }) => {
      localStorage.setItem('desk-booking:users', JSON.stringify(usersArg));
      localStorage.setItem('desk-booking:bookings', JSON.stringify(bookingsArg));
      localStorage.setItem('desk-booking:last-updated', JSON.stringify({ updatedAt: lastUpdatedArg }));
    },
    { usersArg: users, bookingsArg: bookings, lastUpdatedArg: lastUpdated },
  );
};
