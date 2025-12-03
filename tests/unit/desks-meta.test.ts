import { getDesksMeta } from '../../src/lib/desks/meta';

describe('desks meta loader', () => {
  const meta = getDesksMeta();

  it('provides offices and floors from desks.json', () => {
    expect(meta.offices.length).toBeGreaterThan(0);
    const first = meta.offices[0];
    expect(first.id).toBeTruthy();
    expect(first.floors.length).toBeGreaterThan(0);
  });
});
