import { faker } from '@faker-js/faker';

// Local app has no API; factory just returns deterministic users for UI interactions.
// If you add an API later, wire create/delete calls here and track created IDs for cleanup.
export function createUserFactory() {
  const createdIds: string[] = [];

  function generateUser(overrides: Partial<{ id: string; name: string; email: string }> = {}) {
    const user = {
      id: overrides.id || faker.string.uuid(),
      name: overrides.name || faker.person.fullName(),
      email: overrides.email || faker.internet.email(),
    };
    createdIds.push(user.id);
    return user;
  }

  async function cleanup() {
    createdIds.length = 0; // No-op for local file-based app; placeholder for future API deletes.
  }

  return { generateUser, cleanup };
}
