import { BackupSchema, BookingsSchema, UsersSchema } from './schema';
import { writeBookings } from './bookings';
import { writeUsers } from './users';
import { touchLastUpdated, type Result } from './last-updated';

const BACKUP_KEY = 'desk-booking:backup:last';

export const exportBackup = (): Result<{ payload: unknown }> => {
  try {
    const usersRaw = localStorage.getItem('desk-booking:users');
    const bookingsRaw = localStorage.getItem('desk-booking:bookings');
    const users = usersRaw ? JSON.parse(usersRaw) : [];
    const bookings = bookingsRaw ? JSON.parse(bookingsRaw) : [];
    const parsedUsers = UsersSchema.safeParse(users);
    const parsedBookings = BookingsSchema.safeParse(bookings);
    if (!parsedUsers.success) return { ok: false, error: 'Users invalid, cannot export' };
    if (!parsedBookings.success) return { ok: false, error: 'Bookings invalid, cannot export' };
    const payload = {
      users: parsedUsers.data,
      bookings: parsedBookings.data,
      lastUpdated: { updatedAt: new Date().toISOString() },
    };
    localStorage.setItem(BACKUP_KEY, JSON.stringify(payload));
    return { ok: true, data: { payload } };
  } catch (error: any) {
    return { ok: false, error: error?.message ?? 'Failed to export backup' };
  }
};

export const importBackup = (payload: unknown): Result<void> => {
  const parsed = BackupSchema.safeParse(payload);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues.map((i) => i.message).join('; ') };
  }
  const { users, bookings, lastUpdated } = parsed.data;
  const usersResult = writeUsers(users);
  if (!usersResult.ok) return usersResult;
  const bookingsResult = writeBookings(bookings);
  if (!bookingsResult.ok) return bookingsResult;
  touchLastUpdated(lastUpdated.updatedAt);
  localStorage.setItem(BACKUP_KEY, JSON.stringify(parsed.data));
  return { ok: true, data: undefined } as Result<void>;
};
