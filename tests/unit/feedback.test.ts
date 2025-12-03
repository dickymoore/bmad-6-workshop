import { describe, it, expect } from 'vitest';
import { mapErrorToMessage, successMessage } from '../../src/lib/feedback/messages';

describe('feedback messages', () => {
  it('maps success copy with path', () => {
    expect(successMessage('backup.export', { path: 'data/backup/file.json' })).toContain('data/backup/file.json');
  });

  it('maps booking conflict error to friendly copy', () => {
    const msg = mapErrorToMessage('booking.create', 'User already has a booking');
    expect(msg).toMatch(/already has a booking/i);
  });

  it('falls back to raw error when no hint', () => {
    const msg = mapErrorToMessage('backup.import', 'Custom failure reason');
    expect(msg).toBe('Custom failure reason');
  });
});
