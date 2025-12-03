import { readBookings, writeBookings, type Booking, validateDeskForBooking } from '../storage/bookings';
import { buildBookingPayload, type BookingInput } from './payload';

type ConflictCode = 'DESK_CONFLICT' | 'USER_DATE_CONFLICT';

export const checkUserDateConflict = (bookings: Booking[], userId: string, date: string): boolean =>
  bookings.some((b) => b.userId === userId && b.date === date);

export const createBooking = (input: BookingInput, userId: string): Result<Booking> & { code?: ConflictCode } => {
  if (!userId) return { ok: false, error: 'User must be selected before booking' };

  const existing = readBookings();
  if (!existing.ok) return { ok: false, error: existing.error };

  const deskValidation = validateDeskForBooking(input.office, input.floor, input.deskId);
  if (!deskValidation.ok) {
    return { ok: false, error: deskValidation.error, code: deskValidation.code as any };
  }

  if (checkUserDateConflict(existing.data, userId, input.date)) {
    return { ok: false, error: 'User already has a booking on this date', code: 'USER_DATE_CONFLICT' };
  }

  const deskConflict = existing.data.find(
    (b) => b.office === input.office && b.floor === input.floor && b.date === input.date && b.deskId === input.deskId,
  );
  if (deskConflict) return { ok: false, error: 'Desk already booked for this date', code: 'DESK_CONFLICT' };

  const payload = buildBookingPayload(input, userId);
  const next = [...existing.data, payload];
  const writeResult = writeBookings(next);
  if (!writeResult.ok) return { ok: false, error: writeResult.error };

  return { ok: true, data: payload } as Result<Booking>;
};
