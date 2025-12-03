import type { Booking } from '../storage/bookings';

export type BookingInput = Omit<Booking, 'id' | 'createdAt' | 'releasedAt' | 'userId'> & { userId?: string; releasedAt?: string };

const randomId = () => crypto.randomUUID();

export const buildBookingPayload = (input: BookingInput, userId: string): Booking => ({
  ...input,
  id: randomId(),
  createdAt: new Date().toISOString(),
  userId,
});
