import React, { useMemo, useState } from 'react';
import { useFilters } from '../lib/filters/context';
import { useSelectedUser } from '../lib/booking/selection';
import { createBooking, checkUserDateConflict } from '../lib/booking/create';
import { validateDeskForBooking } from '../lib/storage/bookings';
import { todayLocalISO } from '../lib/date';

export type BookingConfirmProps = {
  selectedDeskId?: string;
  onBooked?: () => void;
};

export const BookingConfirm: React.FC<BookingConfirmProps> = ({ selectedDeskId, onBooked }) => {
  const { state } = useFilters();
  const { selectedUserId, options } = useSelectedUser();
  const [message, setMessage] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);

  const selectedUserName = useMemo(
    () => options.find((u) => u.id === selectedUserId)?.name ?? 'Unknown',
    [options, selectedUserId],
  );

  const canBook = !!selectedDeskId && !!selectedUserId;

  const handleConfirm = async () => {
    if (!selectedDeskId || !selectedUserId) {
      setError('Select a user and desk before booking');
      return;
    }
    setSubmitting(true);
    setError(undefined);
    setMessage(undefined);

    const existing = JSON.parse(localStorage.getItem('desk-booking:bookings') || '[]');
    if (checkUserDateConflict(existing, selectedUserId, state.date || todayLocalISO())) {
      setSubmitting(false);
      setError('User already has a booking on this date');
      return;
    }

    const deskValidation = validateDeskForBooking(state.office, state.floor, selectedDeskId);
    if (!deskValidation.ok) {
      setSubmitting(false);
      setError(deskValidation.error);
      return;
    }

    const result = createBooking(
      {
        office: state.office,
        floor: state.floor,
        deskId: selectedDeskId,
        date: state.date || todayLocalISO(),
      },
      selectedUserId,
    );

    if (!result.ok) {
      setError(result.error);
      setSubmitting(false);
      return;
    }

    setMessage('Booking confirmed');
    setSubmitting(false);
    onBooked?.();
  };

  return (
    <section className="card" aria-label="Booking confirmation">
      <h2>Confirm Booking</h2>
      {!selectedDeskId && <p className="help">Select a free desk on the map to book.</p>}
      {selectedDeskId && (
        <div className="confirm-summary">
          <p><strong>Desk:</strong> {selectedDeskId}</p>
          <p><strong>User:</strong> {selectedUserName}</p>
          <p>
            <strong>Office/Floor:</strong> {state.office} / {state.floor}
          </p>
          <p>
            <strong>Date:</strong> {state.date || todayLocalISO()}
          </p>
        </div>
      )}
      <div className="actions">
        <button onClick={handleConfirm} disabled={!canBook || submitting}>
          {submitting ? 'Booking…' : 'Confirm booking'}
        </button>
      </div>
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
