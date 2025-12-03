import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { useRoster } from '../roster/context';
import type { User } from '../storage/users';

export type SelectedUserContextValue = {
  selectedUserId?: string;
  setSelectedUserId: (id?: string) => void;
  options: User[];
  visitor: User;
};

const SelectedUserContext = createContext<SelectedUserContextValue | undefined>(undefined);

const buildVisitor = (): User => ({ id: 'visitor', name: 'Visitor', active: true });

export const SelectedUserProvider = ({ children }: { children: React.ReactNode }) => {
  const { users } = useRoster();
  const visitor = useMemo(buildVisitor, []);
  const options = useMemo(() => [...users, visitor], [users, visitor]);
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>(users[0]?.id);

  useEffect(() => {
    if (!selectedUserId && users[0]?.id) {
      setSelectedUserId(users[0].id);
    }
  }, [selectedUserId, users]);

  return (
    <SelectedUserContext.Provider value={{ selectedUserId, setSelectedUserId, options, visitor }}>
      {children}
    </SelectedUserContext.Provider>
  );
};

export const useSelectedUser = (): SelectedUserContextValue => {
  const ctx = useContext(SelectedUserContext);
  if (!ctx) throw new Error('useSelectedUser must be used within SelectedUserProvider');
  return ctx;
};
