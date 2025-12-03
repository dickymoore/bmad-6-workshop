import React from 'react';
import { useRoster } from '../lib/roster/context';

export const UserDropdown: React.FC = () => {
  const { users, status, error } = useRoster();
  const hasUsers = users.length > 0;

  return (
    <section className="card" aria-label="User selection">
      <h2>User</h2>
      {!hasUsers && (
        <p role="status" className="help">
          Roster empty—add users to enable booking.
        </p>
      )}
      {error && (
        <p role="alert" className="help" style={{ color: '#f87171' }}>
          {error}
        </p>
      )}
      <select aria-label="User dropdown" disabled={!hasUsers || status === 'loading'}>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>
    </section>
  );
};
