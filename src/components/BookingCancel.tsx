import React, { useMemo, useState } from 'react';
import { useFilters } from '../lib/filters/context';
import { cancelBooking, readBookings } from '../lib/storage/bookings';
import { todayLocalISO } from '../lib/date';
import { useFeedback } from '../lib/feedback/context';

type Props = {
  deskId?: string;
  onCancelled?: () => void;
};

export const BookingCancel: React.FC<Props> = ({ deskId, onCancelled }) => {
  const { state } = useFilters();
  const [error, setError] = useState<string | undefined>();
  const [message, setMessage] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);
  const { showSuccess, showError } = useFeedback();

  const booking = useMemo(() => {
    const res = readBookings();
    if (!res.ok) return undefined;
    return res.data.find(
      (b) =>
        b.deskId === deskId && b.date === state.date && b.office === state.office && b.floor === state.floor,
    );
  }, [deskId, state.date, state.floor, state.office]);

  const handleCancel = () => {
    if (!booking) {
      const msg = showError('booking.cancel', 'Booking not found');
      setError(msg);
      return;
    }
    setBusy(true);
    setError(undefined);
    const result = cancelBooking(booking.id);
    if (!result.ok) {
      setBusy(false);
      const msg = showError('booking.cancel', result.error);
      setError(msg);
      return;
    }
    showSuccess('booking.cancel');
    setMessage('Booking cancelled');
    setBusy(false);
    onCancelled?.();
  };

  return (
    <section className="card" aria-label="Cancel booking">
      <h2>Cancel Booking</h2>
      {!booking && <p className="help">Select a booked desk to cancel.</p>}
      {booking && (
        <div className="confirm-summary">
          <p><strong>Desk:</strong> {booking.deskId}</p>
          <p><strong>User:</strong> {booking.userId}</p>
          <p><strong>Office/Floor:</strong> {booking.office} / {booking.floor}</p>
          <p><strong>Date:</strong> {booking.date || todayLocalISO()}</p>
          <div className="actions">
            <button onClick={handleCancel} disabled={busy}>
              {busy ? 'Cancelling…' : 'Confirm cancel'}
            </button>
          </div>
        </div>
      )}
      {message && (
        <p role="status" className="help" style={{ color: '#22c55e' }}>
          {message}
        </p>
      )}
      {error && (
        <p role="alert" className="help" style={{ color: '#f87171' }}>
          {error}
        </p>
      )}
    </section>
  );
};
