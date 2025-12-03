import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { RosterProvider } from '../../src/lib/roster/context';
import { SelectedUserProvider } from '../../src/lib/booking/selection';
import { useBookingPayloadBuilder } from '../../src/lib/booking/useBookingPayload';
import { LastUpdatedProvider } from '../../src/lib/last-updated/context';
import { FiltersProvider } from '../../src/lib/filters/context';

const TestComponent = () => {
  const { build, selectedUserId } = useBookingPayloadBuilder();
  const handle = () => {
    const payload = build({ office: 'office-lon', floor: 'lon-1', deskId: 'D1', date: '2025-12-03' } as any);
    (window as any).__payload = payload;
  };
  return (
    <div>
      <p data-testid="selected">{selectedUserId ?? 'none'}</p>
      <button onClick={handle}>make</button>
    </div>
  );
};

const shell = (children: React.ReactElement) => (
  <LastUpdatedProvider>
    <RosterProvider>
      <SelectedUserProvider>
        <FiltersProvider>{children}</FiltersProvider>
      </SelectedUserProvider>
    </RosterProvider>
  </LastUpdatedProvider>
);

describe('User selection flow', () => {
  beforeEach(() => {
    localStorage.setItem('desk-booking:users', JSON.stringify([{ id: 'u1', name: 'Alice', active: true }]));
  });

  afterEach(() => {
    delete (window as any).__payload;
  });

  it('carries selected user id into payload builder', () => {
    render(shell(<TestComponent />));
    expect(screen.getByTestId('selected').textContent).toBe('u1');
    screen.getByText('make').click();
    const payload = (window as any).__payload;
    expect(payload.userId).toBe('u1');
  });
});
