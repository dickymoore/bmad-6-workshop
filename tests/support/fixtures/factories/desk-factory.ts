import { faker } from '@faker-js/faker';

type Desk = {
  id: string;
  office: string;
  floor: string;
  label: string;
  x: number;
  y: number;
};

export function createDeskFactory() {
  const createdIds: string[] = [];

  function generateDesk(overrides: Partial<Desk> = {}): Desk {
    const desk: Desk = {
      id: overrides.id || `desk-${faker.number.int({ min: 1, max: 200 })}`,
      office: overrides.office || 'LON',
      floor: overrides.floor || '1',
      label: overrides.label || 'Desk',
      x: overrides.x ?? faker.number.int({ min: 10, max: 900 }),
      y: overrides.y ?? faker.number.int({ min: 10, max: 900 }),
    };

    createdIds.push(desk.id);
    return desk;
  }

  async function cleanup() {
    createdIds.length = 0; // No remote cleanup needed for local assets
  }

  return { generateDesk, cleanup };
}

export type DeskFactory = ReturnType<typeof createDeskFactory>;
