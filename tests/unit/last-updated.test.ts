import fs from 'node:fs';
import path from 'node:path';
import { readLastUpdated, writeLastUpdated, touchLastUpdated, isIsoString } from '../../src/lib/storage/last-updated';

const fixtureDir = path.resolve(process.cwd(), 'data');
const filePath = path.join(fixtureDir, 'last-updated.json');

const readFile = () => JSON.parse(fs.readFileSync(filePath, 'utf8'));

describe('last-updated storage helper', () => {
  beforeEach(() => {
    if (!fs.existsSync(fixtureDir)) fs.mkdirSync(fixtureDir, { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify({ updatedAt: '' }), 'utf8');
  });

  it('seeds empty file on read when missing', () => {
    fs.unlinkSync(filePath);
    const result = readLastUpdated();
    expect(result.ok).toBe(true);
    expect(result.data.updatedAt).toBe('');
    expect(fs.existsSync(filePath)).toBe(true);
  });

  it('validates iso format helper', () => {
    expect(isIsoString('2025-12-03T10:11:12.123Z')).toBe(true);
    expect(isIsoString('not-iso')).toBe(false);
  });

  it('writes ISO timestamp atomically', () => {
    const iso = '2025-12-03T10:11:12.123Z';
    const result = writeLastUpdated(iso);
    expect(result.ok).toBe(true);
    expect(readFile().updatedAt).toBe(iso);
  });

  it('rejects invalid timestamp', () => {
    const result = writeLastUpdated('bad');
    expect(result.ok).toBe(false);
  });

  it('touchLastUpdated writes current time', () => {
    const result = touchLastUpdated();
    expect(result.ok).toBe(true);
    expect(isIsoString(readFile().updatedAt)).toBe(true);
  });
});
