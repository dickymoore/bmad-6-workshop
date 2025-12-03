import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RosterManager } from '../../src/components/RosterManager';
import { RosterProvider } from '../../src/lib/roster/context';
import { FeedbackProvider } from '../../src/lib/feedback/context';
import { ToastViewport } from '../../src/components/ToastViewport';
import * as usersModule from '../../src/lib/storage/users';

const shell = (ui: React.ReactElement) => (
  <FeedbackProvider>
    <RosterProvider>
      {ui}
      <ToastViewport />
    </RosterProvider>
  </FeedbackProvider>
);

describe('RosterManager', () => {
  beforeEach(() => {
    localStorage.clear();
    // seed initial roster
    localStorage.setItem('desk-booking:users', JSON.stringify([{ id: 'u1', name: 'Alice', active: true }]));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('adds a user and saves roster', async () => {
    render(shell(<RosterManager />));

    await userEvent.click(screen.getByTestId('add-user'));
    const newRow = screen.getAllByRole('row').at(-1)!;
    const input = within(newRow).getByRole('textbox');
    await userEvent.clear(input);
    await userEvent.type(input, 'Bob');

    await userEvent.click(screen.getByTestId('save-roster'));

    await waitFor(() => expect(screen.getByTestId('feedback-toast')).toHaveTextContent(/roster saved/i));

    const stored = JSON.parse(localStorage.getItem('desk-booking:users') || '[]');
    expect(stored.map((u: any) => u.name)).toEqual(['Alice', 'Bob']);
  });

  it('shows inline error on duplicate name and blocks save', async () => {
    render(shell(<RosterManager />));

    await userEvent.click(screen.getByTestId('add-user'));
    const newRow = screen.getAllByRole('row').at(-1)!;
    const input = within(newRow).getByRole('textbox');
    await userEvent.type(input, 'Alice');

    await userEvent.click(screen.getByTestId('save-roster'));

    expect(screen.getByText(/duplicate names/i)).toBeInTheDocument();
    const stored = JSON.parse(localStorage.getItem('desk-booking:users') || '[]');
    expect(stored).toHaveLength(1); // unchanged
  });

  it('surfaces save error and rolls back state', async () => {
    vi.spyOn(usersModule, 'writeUsers').mockReturnValue({ ok: false, error: 'disk failure' });
    render(shell(<RosterManager />));

    const input = screen.getByDisplayValue('Alice');
    await userEvent.type(input, ' Jr');
    await userEvent.click(screen.getByTestId('save-roster'));

    await waitFor(() => expect(screen.getByTestId('feedback-toast')).toHaveTextContent(/disk failure/i));

    const stored = JSON.parse(localStorage.getItem('desk-booking:users') || '[]');
    // writeUsers failed, so persisted data should remain original
    expect(stored[0].name).toBe('Alice');
  });
});
