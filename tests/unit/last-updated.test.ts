import { readLastUpdated, writeLastUpdated, touchLastUpdated, isIsoString } from '../../src/lib/storage/last-updated';

describe('last-updated storage helper', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('desk-booking:last-updated', JSON.stringify({ updatedAt: '' }));
  });

  it('seeds empty file on read when missing', () => {
    const result = readLastUpdated();
    expect(result.ok).toBe(true);
    expect(result.data.updatedAt).toBe('');
    expect(localStorage.getItem('desk-booking:last-updated')).toBeTruthy();
  });

  it('validates iso format helper', () => {
    expect(isIsoString('2025-12-03T10:11:12.123Z')).toBe(true);
    expect(isIsoString('not-iso')).toBe(false);
  });

  it('writes ISO timestamp atomically', () => {
    const iso = '2025-12-03T10:11:12.123Z';
    const result = writeLastUpdated(iso);
    expect(result.ok).toBe(true);
    const stored = JSON.parse(localStorage.getItem('desk-booking:last-updated') ?? '{}');
    expect(stored.updatedAt).toBe(iso);
  });

  it('rejects invalid timestamp', () => {
    const result = writeLastUpdated('bad');
    expect(result.ok).toBe(false);
  });

  it('touchLastUpdated writes current time', () => {
    const result = touchLastUpdated();
    expect(result.ok).toBe(true);
    const stored = JSON.parse(localStorage.getItem('desk-booking:last-updated') ?? '{}');
    expect(isIsoString(stored.updatedAt)).toBe(true);
  });
});
