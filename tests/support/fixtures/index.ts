import { test as base, expect } from '@playwright/test';
import { createUserFactory } from './factories/user-factory';

export const test = base.extend({
  userFactory: async ({}, use) => {
    const factory = createUserFactory();
    await use(factory);
    await factory.cleanup();
  },
});

export { expect };

export type UserFactory = ReturnType<typeof createUserFactory>;
