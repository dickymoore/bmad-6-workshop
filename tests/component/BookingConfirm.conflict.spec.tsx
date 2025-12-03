import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { BookingConfirm } from '../../src/components/BookingConfirm';
import { FiltersProvider } from '../../src/lib/filters/context';
import { SelectedUserProvider } from '../../src/lib/booking/selection';
import { LastUpdatedProvider } from '../../src/lib/last-updated/context';
import { RosterProvider } from '../../src/lib/roster/context';
import { writeUsers } from '../../src/lib/storage/users';
import { writeBookings } from '../../src/lib/storage/bookings';

const shell = (ui: React.ReactElement) => (
  <LastUpdatedProvider>
    <RosterProvider>
      <SelectedUserProvider>
        <FiltersProvider>{ui}</FiltersProvider>
      </SelectedUserProvider>
    </RosterProvider>
  </LastUpdatedProvider>
);

describe('BookingConfirm conflict UX', () => {
  beforeEach(() => {
    localStorage.clear();
    writeUsers([{ id: 'u1', name: 'Alice', active: true }]);
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
  });

  it('blocks confirm when user already booked that date', () => {
    render(shell(<BookingConfirm selectedDeskId="LON1-D02" />));
    fireEvent.click(screen.getByRole('button', { name: /Confirm booking/i }));
    expect(screen.getByText(/already has a booking/i)).toBeInTheDocument();
    const stored = JSON.parse(localStorage.getItem('desk-booking:bookings') || '[]');
    expect(stored.length).toBe(1);
  });
});
