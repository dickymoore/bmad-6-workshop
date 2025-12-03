import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';
import { BookingConfirm } from '../../src/components/BookingConfirm';
import { FiltersProvider } from '../../src/lib/filters/context';
import { SelectedUserProvider } from '../../src/lib/booking/selection';
import { LastUpdatedProvider } from '../../src/lib/last-updated/context';
import { RosterProvider } from '../../src/lib/roster/context';
import { writeUsers } from '../../src/lib/storage/users';
import { writeBookings } from '../../src/lib/storage/bookings';
import { FeedbackProvider } from '../../src/lib/feedback/context';

const shell = (ui: React.ReactElement) => (
  <FeedbackProvider>
    <LastUpdatedProvider>
      <RosterProvider>
        <SelectedUserProvider>
          <FiltersProvider>{ui}</FiltersProvider>
        </SelectedUserProvider>
      </RosterProvider>
    </LastUpdatedProvider>
  </FeedbackProvider>
);

describe('BookingConfirm', () => {
  beforeEach(() => {
    localStorage.clear();
    writeUsers([{ id: 'u1', name: 'Alice', active: true }]);
    writeBookings([]);
  });

  it('shows summary and writes booking on confirm (AC1/AC2)', () => {
    const onBooked = vi.fn();
    render(shell(<BookingConfirm selectedDeskId="LON1-D01" onBooked={onBooked} />));

    expect(screen.getByText('LON1-D01')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Confirm booking/i }));

    expect(onBooked).toHaveBeenCalled();
    const stored = JSON.parse(localStorage.getItem('desk-booking:bookings') || '[]');
    expect(stored.length).toBe(1);
    expect(stored[0].deskId).toBe('LON1-D01');
  });

  it('shows error when booking fails (AC3)', () => {
    writeBookings([
      {
        id: 'b1',
        office: 'office-lon',
        floor: 'lon-1',
        deskId: 'LON1-D01',
        date: '2025-12-03',
        userId: 'u1',
        createdAt: new Date().toISOString(),
      },
    ]);

    render(shell(<BookingConfirm selectedDeskId="LON1-D01" />));
    fireEvent.click(screen.getByRole('button', { name: /Confirm booking/i }));

    expect(screen.getByText(/already has a booking/i)).toBeInTheDocument();
    const stored = JSON.parse(localStorage.getItem('desk-booking:bookings') || '[]');
    expect(stored.length).toBe(1); // unchanged
  });
});
