import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { BookingConfirm } from '../../src/components/BookingConfirm';
import { FiltersProvider } from '../../src/lib/filters/context';
import { SelectedUserProvider } from '../../src/lib/booking/selection';
import { LastUpdatedProvider } from '../../src/lib/last-updated/context';
import { RosterProvider } from '../../src/lib/roster/context';
import { writeUsers } from '../../src/lib/storage/users';

const shell = (ui: React.ReactElement) => (
  <LastUpdatedProvider>
    <RosterProvider>
      <SelectedUserProvider>
        <FiltersProvider>{ui}</FiltersProvider>
      </SelectedUserProvider>
    </RosterProvider>
  </LastUpdatedProvider>
);

describe('BookingConfirm invalid desk pre-check', () => {
  beforeEach(() => {
    localStorage.clear();
    writeUsers([{ id: 'u1', name: 'Alice', active: true }]);
  });

  it('blocks confirm when desk is invalid for office/floor', () => {
    render(shell(<BookingConfirm selectedDeskId="BAD" />));
    fireEvent.click(screen.getByRole('button', { name: /Confirm booking/i }));
    expect(screen.getByText(/deskId not found/i)).toBeInTheDocument();
  });
});
