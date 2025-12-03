import { render, screen } from '@testing-library/react';
import React, { act } from 'react';
import { vi } from 'vitest';
import { FiltersProvider } from '../../src/lib/filters/context';
import { LastUpdatedProvider } from '../../src/lib/last-updated/context';
import { RosterProvider } from '../../src/lib/roster/context';
import { FloorplanView } from '../../src/components/Floorplan/FloorplanView';
import { writeBookings } from '../../src/lib/storage/bookings';
import { writeUsers } from '../../src/lib/storage/users';
import { todayLocalISO } from '../../src/lib/date';
import { availabilityColors } from '../../src/lib/style/tokens';

const renderWithProviders = (ui: React.ReactElement) =>
  render(
    <LastUpdatedProvider>
      <RosterProvider>
        <FiltersProvider>{ui}</FiltersProvider>
      </RosterProvider>
    </LastUpdatedProvider>,
  );

describe('Availability coloring', () => {
  const date = todayLocalISO();

  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('applies booked/free/selected colors and legend sync (AC1, AC2)', () => {
    writeUsers([
      { id: 'u1', name: 'Ada', active: true },
      { id: 'u2', name: 'Grace', active: true },
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
    ]);

    renderWithProviders(<FloorplanView />);

    const buttons = screen.getAllByRole('button', { hidden: true });
    const booked = buttons.find((b) => b.getAttribute('data-status') === 'booked')!;
    const free = buttons.find((b) => b.getAttribute('data-status') === 'free')!;

    expect(booked).toBeInTheDocument();
    expect(booked).toHaveStyle(`border-color: ${availabilityColors.booked}`);
    expect(free).toHaveStyle(`border-color: ${availabilityColors.selected}`); // free uses selected border fallback

    expect(screen.getByText(/Booked \(1\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Free/)).toBeInTheDocument();
  });

  it('updates colors when bookings change (AC3)', () => {
    writeUsers([{ id: 'u1', name: 'Ada', active: true }]);
    writeBookings([]);
    const { rerender } = renderWithProviders(<FloorplanView />);

    expect(screen.getByText(/Free \(/)).toBeInTheDocument();

    act(() => {
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
      ]);
    });

    rerender(
      <LastUpdatedProvider>
        <RosterProvider>
          <FiltersProvider>
            <FloorplanView />
          </FiltersProvider>
        </RosterProvider>
      </LastUpdatedProvider>,
    );

    const booked = screen.getAllByRole('button', { hidden: true }).find((b) => b.getAttribute('data-status') === 'booked');
    expect(booked).toBeTruthy();
  });
});
