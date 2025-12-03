import { readJsonFile, writeJsonFile, type Result } from './fs-adapter';
import { touchLastUpdated } from './last-updated';
import { BookingsSchema, BookingSchema } from './schema';
import { getDeskIndex } from './desks-index';

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

const BOOKINGS_PATH = 'bookings.json';
const deskIndex = getDeskIndex();

type Listener = (bookings: Booking[]) => void;
const subscribers = new Set<Listener>();
export const onBookingsChanged = (fn: Listener) => {
  subscribers.add(fn);
  return () => subscribers.delete(fn);
};

const emit = (bookings: Booking[]) => subscribers.forEach((fn) => fn(bookings));

export const readBookings = (): Result<Booking[]> => {
  const result = readJsonFile<Booking[]>(BOOKINGS_PATH, []);
  if (!result.ok) return result;
  const bookings: Booking[] = [];
  if (Array.isArray(result.data)) {
    result.data.forEach((row, idx) => {
      const parsed = BookingSchema.safeParse(row);
      if (parsed.success) {
        bookings.push(parsed.data);
      } else {
        console.warn(`Invalid booking at index ${idx}: ${parsed.error.issues.map((i) => i.message).join('; ')}`);
      }
    });
  }
  return { ok: true, data: bookings };
};

export const writeBookings = (bookings: Booking[]): Result<void> => {
  const parsed = BookingsSchema.safeParse(bookings);
  if (!parsed.success) {
    const msg = parsed.error.issues.map((i) => i.message).join('; ');
    return { ok: false, error: `Booking validation failed: ${msg}` };
  }
  const writeResult = writeJsonFile(BOOKINGS_PATH, bookings);
  if (!writeResult.ok) return writeResult;
  touchLastUpdated();
  emit(bookings);
  return { ok: true, data: undefined } as Result<void>;
};
