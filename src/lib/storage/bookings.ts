import { touchLastUpdated } from './last-updated';
import { BookingsSchema, BookingSchema } from './schema';
import { getDeskIndex } from './desks-index';
import { validateDesk } from './validation';

export type Booking = {
  id: string;
  office: string;
  floor: string;
  deskId: string;
  date: string; // YYYY-MM-DD
  userId: string;
  createdAt: string; // ISO
  releasedAt?: string; // ISO optional
};

const BOOKINGS_KEY = 'desk-booking:bookings';
const deskIndex = getDeskIndex();

type Listener = (bookings: Booking[]) => void;
const subscribers = new Set<Listener>();
export const onBookingsChanged = (fn: Listener) => {
  subscribers.add(fn);
  return () => subscribers.delete(fn);
};

const emit = (bookings: Booking[]) => subscribers.forEach((fn) => fn(bookings));

export const readBookings = (): Result<Booking[]> => {
  const raw = localStorage.getItem(BOOKINGS_KEY);
  const data = raw ? JSON.parse(raw) : [];
  const bookings: Booking[] = [];
  if (Array.isArray(data)) {
    data.forEach((row, idx) => {
      const parsed = BookingSchema.safeParse(row);
      if (parsed.success) {
        bookings.push(parsed.data);
      } else {
        console.warn(`Invalid booking at index ${idx}: ${parsed.error.issues.map((i) => i.message).join('; ')}`);
      }
    });
  }
  return { ok: true, data: bookings } as Result<Booking[]>;
};

export const writeBookings = (bookings: Booking[]): Result<void> => {
  const parsed = BookingsSchema.safeParse(bookings);
  if (!parsed.success) {
    const msg = parsed.error.issues.map((i) => i.message).join('; ');
    return { ok: false, error: `Booking validation failed: ${msg}` };
  }
  try {
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings, null, 2));
  } catch (error: any) {
    return { ok: false, error: error?.message ?? 'Failed to write bookings' };
  }
  touchLastUpdated();
  emit(bookings);
  return { ok: true, data: undefined } as Result<void>;
};

export const validateDeskForBooking = (office: string, floor: string, deskId: string): Result<void> & { code?: string } => {
  const validation = validateDesk(office, floor, deskId);
  if (!validation.ok) {
    return { ok: false, error: validation.error, code: validation.code };
  }
  return { ok: true, data: undefined } as Result<void>;
};

export const cancelBooking = (bookingId: string): Result<void> => {
  const existing = readBookings();
  if (!existing.ok) return { ok: false, error: existing.error };

  const next = existing.data.filter((b) => b.id !== bookingId);
  if (next.length === existing.data.length) {
    return { ok: false, error: 'Booking not found' };
  }

  return writeBookings(next);
};
