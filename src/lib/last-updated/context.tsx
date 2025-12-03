import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import initialData from '../../../data/last-updated.json';
import { onLastUpdated } from '../storage/last-updated';

export type LastUpdatedContextValue = {
  lastUpdated: string;
  setLastUpdated: (value: string) => void;
};

const LastUpdatedContext = createContext<LastUpdatedContextValue | undefined>(undefined);

type ProviderProps = { children: React.ReactNode; initialLastUpdated?: string };

export const LastUpdatedProvider = ({ children, initialLastUpdated }: ProviderProps) => {
  const [lastUpdated, setLastUpdatedState] = useState<string>(
    typeof initialLastUpdated === 'string'
      ? initialLastUpdated
      : typeof initialData?.updatedAt === 'string'
        ? initialData.updatedAt
        : '',
  );

  const setLastUpdated = useCallback((value: string) => setLastUpdatedState(value), []);

  useEffect(() => {
    const unsubscribe = onLastUpdated((ts) => setLastUpdated(ts));
    return unsubscribe;
  }, [setLastUpdated]);

  return (
    <LastUpdatedContext.Provider value={{ lastUpdated, setLastUpdated }}>
      {children}
    </LastUpdatedContext.Provider>
  );
};

export const useLastUpdated = (): LastUpdatedContextValue => {
  const ctx = useContext(LastUpdatedContext);
  if (!ctx) throw new Error('useLastUpdated must be used within LastUpdatedProvider');
  return ctx;
};

export const useLastUpdatedDisplay = () => {
  const { lastUpdated } = useLastUpdated();
  return lastUpdated && lastUpdated.length > 0 ? lastUpdated : 'Not yet saved';
};
