import { render, screen } from '@testing-library/react';
import React from 'react';
import { RosterProvider } from '../../src/lib/roster/context';
import { UserDropdown } from '../../src/components/UserDropdown';

const renderWithRoster = (users: any[]) => {
  localStorage.setItem('desk-booking:users', JSON.stringify(users));
  return render(
    <RosterProvider>
      <UserDropdown />
    </RosterProvider>,
  );
};

describe('UserDropdown', () => {
  it('shows empty notice when no users', () => {
    renderWithRoster([]);
    expect(screen.getByText(/roster empty/i)).toBeInTheDocument();
  });

  it('renders users in dropdown when roster present', () => {
    renderWithRoster([{ id: '1', name: 'Alice', active: true }]);
    const dropdown = screen.getByLabelText(/user dropdown/i) as HTMLSelectElement;
    expect(dropdown.options.length).toBe(1);
    expect(dropdown.options[0].textContent).toBe('Alice');
  });
});
