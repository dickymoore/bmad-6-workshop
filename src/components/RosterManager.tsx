import React, { useEffect, useMemo, useState } from 'react';
import { useRoster } from '../lib/roster/context';
import { useFeedback } from '../lib/feedback/context';
import type { User } from '../lib/storage/users';

type RowError = Record<string, string | undefined>;

const makeId = () => (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `u-${Date.now()}-${Math.random().toString(16).slice(2)}`);

const validateUsers = (users: User[]): RowError => {
  const errors: RowError = {};
  const seen = new Set<string>();
  users.forEach((user) => {
    const trimmed = user.name.trim();
    if (!trimmed) {
      errors[user.id] = 'Name cannot be empty';
      return;
    }
    const key = trimmed.toLowerCase();
    if (seen.has(key)) {
      errors[user.id] = 'Duplicate names are not allowed';
      return;
    }
    seen.add(key);
  });
  return errors;
};

export const RosterManager: React.FC = () => {
  const { users, save, status, error } = useRoster();
  const { showSuccess, showError } = useFeedback();
  const [drafts, setDrafts] = useState<User[]>([]);
  const [errors, setErrors] = useState<RowError>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDrafts(users);
  }, [users]);

  const hasErrors = useMemo(() => Object.values(errors).some(Boolean), [errors]);

  const updateUser = (id: string, patch: Partial<User>) => {
    setDrafts((prev) => prev.map((u) => (u.id === id ? { ...u, ...patch } : u)));
  };

  const addUser = () => {
    setDrafts((prev) => [...prev, { id: makeId(), name: '', active: true }]);
  };

  const deactivateUser = (id: string, active: boolean) => updateUser(id, { active });

  const handleSave = async () => {
    const validation = validateUsers(drafts);
    setErrors(validation);
    if (Object.values(validation).some(Boolean)) return;

    setSaving(true);
    const result = await save(drafts);
    if (result.ok) {
      showSuccess('roster.save');
    } else {
      showError('roster.save', result.error);
      setDrafts(users); // rollback to last known good
    }
    setSaving(false);
  };

  return (
    <section className="card" aria-label="Roster manager">
      <div className="list-header-bar" style={{ alignItems: 'center' }}>
        <div>
          <p className="eyebrow" style={{ marginBottom: 4 }}>Roster</p>
          <h2 style={{ margin: 0 }}>Manage users</h2>
          <p className="help" style={{ margin: 0 }}>Add, edit, or deactivate users; changes save to users.json and update the booking dropdown.</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" onClick={addUser} data-testid="add-user">
            Add user
          </button>
          <button type="button" onClick={handleSave} disabled={saving || status === 'loading'} data-testid="save-roster">
            {saving ? 'Saving…' : 'Save roster'}
          </button>
        </div>
      </div>

      {error && (
        <p role="alert" className="help" style={{ color: '#f87171' }}>
          {error}
        </p>
      )}

      <div role="table" className="roster-table">
        <div role="row" className="roster-header">
          <span>Name</span>
          <span>Status</span>
          <span aria-hidden="true" />
        </div>
        {drafts.map((user) => (
          <div role="row" className="roster-row" key={user.id} data-testid={`roster-row-${user.id}`}>
            <label className="sr-only" htmlFor={`name-${user.id}`}>Name</label>
            <input
              id={`name-${user.id}`}
              data-testid={`name-${user.id}`}
              value={user.name}
              onChange={(e) => updateUser(user.id, { name: e.target.value })}
              aria-invalid={Boolean(errors[user.id])}
            />
            <div>
              <label>
                <input
                  type="checkbox"
                  checked={user.active}
                  onChange={(e) => deactivateUser(user.id, e.target.checked)}
                  data-testid={`active-${user.id}`}
                />
                Active
              </label>
            </div>
            <div style={{ minHeight: 20 }}>
              {errors[user.id] && (
                <p className="help" style={{ color: '#f87171', margin: 0 }} role="alert" data-testid={`error-${user.id}`}>
                  {errors[user.id]}
                </p>
              )}
            </div>
          </div>
        ))}
        {drafts.length === 0 && (
          <p className="help" role="status" data-testid="empty-roster">
            No users yet. Add a user to enable bookings.
          </p>
        )}
      </div>
    </section>
  );
};
