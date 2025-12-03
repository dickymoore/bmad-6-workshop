import React, { useEffect, useMemo, useState } from 'react';
import { useFilters } from '../../lib/filters/context';
import { readBookings, onBookingsChanged, type Booking } from '../../lib/storage/bookings';
import { useRoster } from '../../lib/roster/context';
import { todayLocalISO } from '../../lib/date';

export type SortOrder = 'desk' | 'user';

export type BookingListProps = {
  selectedDeskId?: string;
  onSelectDesk?: (deskId: string) => void;
  onSelectBookedDesk?: (deskId: string) => void;
};

type Row = Booking & { userName: string };

type Status = 'loading' | 'ready' | 'error';

export const BookingList: React.FC<BookingListProps> = ({ selectedDeskId, onSelectDesk, onSelectBookedDesk }) => {
  const { state } = useFilters();
  const { users } = useRoster();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [status, setStatus] = useState<Status>('loading');
  const [error, setError] = useState<string | undefined>();
  const [sortOrder, setSortOrder] = useState<SortOrder>('desk');

  useEffect(() => {
    const result = readBookings();
    if (result.ok) {
      setBookings(result.data);
      setStatus('ready');
      setError(undefined);
    } else {
      setStatus('error');
      setError(result.error);
    }
    const unsubscribe = onBookingsChanged((next) => setBookings(next));
    return unsubscribe;
  }, []);

  const usersById = useMemo(() => new Map(users.map((u) => [u.id, u.name])), [users]);

  const filtered = useMemo<Row[]>(() => {
    return bookings
      .filter((b) => b.office === state.office && b.floor === state.floor && b.date === state.date)
      .map((b) => ({ ...b, userName: usersById.get(b.userId) ?? 'Unknown user' }));
  }, [bookings, state.office, state.floor, state.date, usersById]);

  const sorted = useMemo(() => {
    const copy = [...filtered];
    if (sortOrder === 'desk') {
      copy.sort((a, b) => a.deskId.localeCompare(b.deskId));
    } else {
      copy.sort((a, b) => a.userName.localeCompare(b.userName));
    }
    return copy;
  }, [filtered, sortOrder]);

  const handleSelect = (deskId: string) => {
    onSelectDesk?.(deskId);
  };

  const renderBody = () => {
    if (status === 'loading') return <p role="status" className="help">Loading availability…</p>;
    if (status === 'error') return <p role="alert" className="help" style={{ color: '#f87171' }}>{error}</p>;
    if (sorted.length === 0) return <p role="status" className="help">No bookings for this date.</p>;

    return (
      <div className="list-table" role="table" aria-label="Per-day availability list">
        <div className="list-header" role="row">
          <span role="columnheader">User</span>
          <span role="columnheader">Desk</span>
          <span role="columnheader">Office / Floor</span>
          <span role="columnheader">Date</span>
        </div>
        {sorted.map((row) => {
          const isSelected = selectedDeskId === row.deskId;
          return (
            <div
              key={row.id}
              role="row"
              className="list-row"
              data-selected={isSelected ? 'true' : 'false'}
              onClick={() => handleSelect(row.deskId)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleSelect(row.deskId);
                }
              }}
              tabIndex={0}
              aria-pressed={isSelected}
              aria-label={`Desk ${row.deskId} booked by ${row.userName}`}
            >
              <span role="cell">{row.userName}</span>
              <span role="cell">{row.deskId}</span>
              <span role="cell">{row.office} / {row.floor}</span>
              <span role="cell">{row.date}</span>
              <span role="cell">
                <button
                  type="button"
                  className="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectBookedDesk?.(row.deskId);
                  }}
                >
                  Cancel
                </button>
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <section className="card" aria-label="Per-day availability list">
      <header className="list-header-bar">
        <div>
          <p className="eyebrow">Availability</p>
          <h2>Who&apos;s where on {state.date || todayLocalISO()}</h2>
          <p className="help">Filtered by {state.office} / {state.floor}</p>
        </div>
        <div className="sort-toggle">
          <span className="help">Sort by</span>
          <div className="segmented">
            <button
              className={sortOrder === 'desk' ? 'active' : ''}
              aria-pressed={sortOrder === 'desk'}
              onClick={() => setSortOrder('desk')}
            >
              Desk
            </button>
            <button
              className={sortOrder === 'user' ? 'active' : ''}
              aria-pressed={sortOrder === 'user'}
              onClick={() => setSortOrder('user')}
            >
              User
            </button>
          </div>
        </div>
      </header>
      {renderBody()}
      <p className="help" aria-live="polite">
        {selectedDeskId ? `Highlighted desk ${selectedDeskId}` : 'No desk highlighted'}
      </p>
    </section>
  );
};
