import { readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..', '..');

const readJson = (relativePath: string) => {
  const fullPath = path.resolve(repoRoot, relativePath);
  return JSON.parse(readFileSync(fullPath, 'utf8'));
};

describe('seed data and config', () => {
  it('ensures data folders exist', () => {
    expect(statSync(path.resolve(repoRoot, 'data')).isDirectory()).toBe(true);
    expect(statSync(path.resolve(repoRoot, 'data/backup')).isDirectory()).toBe(true);
  });

  it('validates seed files are present and well-formed', () => {
    const users = readJson('data/users.json');
    const bookings = readJson('data/bookings.json');
    const lastUpdated = readJson('data/last-updated.json');

    expect(Array.isArray(users)).toBe(true);
    expect(Array.isArray(bookings)).toBe(true);
    expect(typeof lastUpdated?.updatedAt).toBe('string');
  });

  it('pins stack versions and node engines', () => {
    const pkg = readJson('package.json');

    expect(pkg.engines?.node).toBe('>=22 <23');
    expect(pkg.dependencies?.react).toBe('19.2.0');
    expect(pkg.devDependencies?.vite).toBe('6.2.5');
  });

  it('gitignore excludes backups and build output', () => {
    const gitignore = readFileSync(path.resolve(repoRoot, '.gitignore'), 'utf8');
    expect(gitignore).toContain('data/backup/*');
    expect(gitignore).toContain('dist/');
    expect(gitignore).toContain('node_modules');
  });
});
