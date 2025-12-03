import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { onUsersChanged, readUsers, writeUsers, type User } from '../storage/users';

export type RosterContextValue = {
  users: User[];
  status: 'ready' | 'loading' | 'error';
  error?: string;
  save: (users: User[]) => Promise<boolean>;
};

const RosterContext = createContext<RosterContextValue | undefined>(undefined);

export const RosterProvider = ({ children }: { children: React.ReactNode }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [status, setStatus] = useState<'ready' | 'loading' | 'error'>('ready');
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    const result = readUsers();
    if (result.ok) {
      setUsers(result.data);
      setError(undefined);
    } else {
      setError(result.error);
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onUsersChanged((next) => setUsers(next));
    return unsubscribe;
  }, []);

  const save = useCallback(async (nextUsers: User[]) => {
    setStatus('loading');
    const result = writeUsers(nextUsers);
    if (result.ok) {
      setUsers(nextUsers);
      setStatus('ready');
      setError(undefined);
      return true;
    }
    setStatus('error');
    setError(result.error);
    return false;
  }, []);

  return (
    <RosterContext.Provider value={{ users, status, error, save }}>
      {children}
    </RosterContext.Provider>
  );
};

export const useRoster = (): RosterContextValue => {
  const ctx = useContext(RosterContext);
  if (!ctx) throw new Error('useRoster must be used within RosterProvider');
  return ctx;
};
