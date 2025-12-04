import { render, screen } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';
import { FiltersProvider } from '../../src/lib/filters/context';
import { FloorplanView } from '../../src/components/Floorplan/FloorplanView';
import { writeBookings } from '../../src/lib/storage/bookings';
import { writeUsers } from '../../src/lib/storage/users';
import { todayLocalISO } from '../../src/lib/date';
import offices from '../../office-floorplans/assets/floorplans/offices.json';
import { RosterProvider } from '../../src/lib/roster/context';
import { LastUpdatedProvider } from '../../src/lib/last-updated/context';

const renderWithProviders = (ui: React.ReactElement) =>
  render(
    <LastUpdatedProvider>
      <RosterProvider>
        <FiltersProvider>{ui}</FiltersProvider>
      </RosterProvider>
    </LastUpdatedProvider>,
  );

describe('FloorplanView', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('renders floorplan image and hotspots', () => {
    renderWithProviders(<FloorplanView />);
    expect(screen.getByAltText(/floorplan/i)).toBeInTheDocument();
    const hotspots = screen.getAllByRole('button', { hidden: true });
    expect(hotspots.length).toBeGreaterThan(0);
    expect(hotspots[0].getAttribute('aria-label')).toMatch(/Desk/);
  });

  it('marks booked desks and updates legend counts', () => {
    const date = todayLocalISO();
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
    ]);

    renderWithProviders(<FloorplanView />);

    expect(screen.getByText(/Booked \(1\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Free/)).toBeInTheDocument();

    const booked = screen.getByLabelText(/Booked by Ada Lovelace/i);
    expect(booked.getAttribute('data-status')).toBe('booked');
  });

  it('applies rotation for desks with rotation metadata', () => {
    renderWithProviders(<FloorplanView />);
    const rotatedDesk = screen.getByLabelText(/LON1-D09/i) as HTMLButtonElement;
    expect(rotatedDesk.style.width).not.toEqual(rotatedDesk.style.height);
  });

  it('skips invalid coordinates and logs a warning', () => {
    const lon1 = (offices as any).offices[0].floors[0];
    const originalLength = lon1.desks.length;
    lon1.desks.push({ id: 'BAD-DESK', position: { x: 2, y: 2 }, size: { width: 0.1, height: 0.1 } });

    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    renderWithProviders(<FloorplanView />);

    expect(warn).toHaveBeenCalledWith(expect.stringContaining('BAD-DESK'));
    const hotspots = screen.getAllByRole('button', { hidden: true });
    expect(hotspots.length).toBe(originalLength);

    lon1.desks.pop();
  });
});
