type Action = 'booking.create' | 'booking.cancel' | 'backup.export' | 'backup.import';

const successCopy: Record<Action, (args?: { path?: string }) => string> = {
  'booking.create': () => 'Booking confirmed',
  'booking.cancel': () => 'Booking cancelled',
  'backup.export': (args) => `Backup saved${args?.path ? ` to ${args.path}` : ''}`,
  'backup.import': () => 'Backup imported successfully',
};

const errorHints: Array<{ match: RegExp; message: string }> = [
  { match: /already has a booking/i, message: 'User already has a booking on this date' },
  { match: /deskId/i, message: 'Desk is invalid for the selected office/floor' },
  { match: /permission denied/i, message: 'Permission denied. Check write access.' },
  { match: /invalid json/i, message: 'Backup file is not valid JSON' },
  { match: /booking not found/i, message: 'Booking not found for that desk/date' },
];

const fallbackErrors: Record<Action, string> = {
  'booking.create': 'Could not create booking. Please try again.',
  'booking.cancel': 'Could not cancel booking. Please try again.',
  'backup.export': 'Backup failed. Please retry.',
  'backup.import': 'Import failed. Check the file and try again.',
};

export function successMessage(action: Action, args?: { path?: string }) {
  return successCopy[action](args);
}

export function mapErrorToMessage(action: Action, raw?: string) {
  if (raw) {
    const hit = errorHints.find((h) => h.match.test(raw));
    if (hit) return hit.message;
    return raw;
  }
  return fallbackErrors[action];
}

export type FeedbackAction = Action;
