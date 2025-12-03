import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';
import { FiltersProvider } from '../../src/lib/filters/context';
import { RosterProvider } from '../../src/lib/roster/context';
import { LastUpdatedProvider } from '../../src/lib/last-updated/context';
import { BookingList } from '../../src/components/BookingList';
import { writeUsers } from '../../src/lib/storage/users';
import { writeBookings } from '../../src/lib/storage/bookings';
import { todayLocalISO } from '../../src/lib/date';

const renderWithProviders = (ui: React.ReactElement) =>
  render(
    <LastUpdatedProvider>
      <RosterProvider>
        <FiltersProvider>{ui}</FiltersProvider>
      </RosterProvider>
    </LastUpdatedProvider>,
  );

describe('BookingList', () => {
  const date = todayLocalISO();

  beforeEach(() => {
    localStorage.clear();
  });

  it('shows filtered bookings with columns (AC1)', () => {
    writeUsers([
      { id: 'u1', name: 'Ada Lovelace', active: true },
      { id: 'u2', name: 'Grace Hopper', active: true },
    ]);
    writeBookings([
      {
        id: 'b1',
        office: 'office-lon',
        floor: 'lon-1',
        deskId: 'LON1-D01',
        date,
        userId: 'u1',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'b2',
        office: 'office-lon',
        floor: 'lon-1',
        deskId: 'LON1-D02',
        date: '1900-01-01',
        userId: 'u2',
        createdAt: new Date().toISOString(),
      },
    ]);

    renderWithProviders(<BookingList />);

    expect(screen.getByRole('columnheader', { name: 'User' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Desk' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Office / Floor' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Date' })).toBeInTheDocument();

    expect(screen.getByText(/Ada Lovelace/)).toBeInTheDocument();
    expect(screen.queryByText(/Grace Hopper/)).not.toBeInTheDocument();
  });

  it('sorts by user when toggled (AC2)', () => {
    writeUsers([
      { id: 'u1', name: 'Carol', active: true },
      { id: 'u2', name: 'Ada', active: true },
    ]);
    writeBookings([
      {
        id: 'b1',
        office: 'office-lon',
        floor: 'lon-1',
        deskId: 'LON1-D02',
        date,
        userId: 'u1',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'b2',
        office: 'office-lon',
        floor: 'lon-1',
        deskId: 'LON1-D01',
        date,
        userId: 'u2',
        createdAt: new Date().toISOString(),
      },
    ]);

    renderWithProviders(<BookingList />);

    const rows = screen.getAllByRole('row');
    expect(rows[1]).toHaveTextContent('LON1-D01'); // default desk sort

    fireEvent.click(screen.getByRole('button', { name: 'User' }));

    const rowsAfter = screen.getAllByRole('row');
    expect(rowsAfter[1]).toHaveTextContent('Ada');
  });

  it('calls onSelectDesk on row click (AC3)', () => {
    writeUsers([{ id: 'u1', name: 'Ada', active: true }]);
    writeBookings([
      {
        id: 'b1',
        office: 'office-lon',
        floor: 'lon-1',
        deskId: 'LON1-D03',
        date,
        userId: 'u1',
        createdAt: new Date().toISOString(),
      },
    ]);

    const onSelectDesk = vi.fn();
    renderWithProviders(<BookingList onSelectDesk={onSelectDesk} />);

    fireEvent.click(screen.getByRole('row', { name: /LON1-D03/i }));

    expect(onSelectDesk).toHaveBeenCalledWith('LON1-D03');
  });

  it('shows empty state when no bookings', () => {
    writeUsers([]);
    renderWithProviders(<BookingList />);
    expect(screen.getByText(/No bookings for this date/i)).toBeInTheDocument();
  });
});
