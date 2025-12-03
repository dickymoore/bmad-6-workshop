import { useSelectedUser } from './selection';
import { buildBookingPayload, type BookingInput } from './payload';

export const useBookingPayloadBuilder = () => {
  const { selectedUserId } = useSelectedUser();

  const build = (input: BookingInput) => {
    if (!selectedUserId) throw new Error('User must be selected before booking');
    return buildBookingPayload(input, selectedUserId);
  };

  return { build, selectedUserId };
};
