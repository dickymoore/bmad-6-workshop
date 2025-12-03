import React, { createContext, useContext, useMemo, useState, useCallback } from 'react';
import { getDesksMeta } from '../desks/meta';
import { todayLocalISO } from '../date';
import type { FilterOptions, FilterState } from './types';

export type FiltersContextValue = {
  state: FilterState;
  options: FilterOptions;
  setOffice: (office: string) => void;
  setFloor: (floor: string) => void;
  setDate: (date: string) => void;
};

const FiltersContext = createContext<FiltersContextValue | undefined>(undefined);

const buildOptions = (officeId: string): FilterOptions => {
  const meta = getDesksMeta();
  const offices = meta.offices.map((o) => ({ id: o.id, name: o.name }));
  const currentOffice = meta.offices.find((o) => o.id === officeId) ?? meta.offices[0];
  const floors = (currentOffice?.floors ?? []).map((f) => ({ id: f.id, name: f.name }));
  return { offices, floors };
};

export const FiltersProvider = ({ children }: { children: React.ReactNode }) => {
  const meta = getDesksMeta();
  const initialOffice = meta.offices[0]?.id ?? '';
  const initialFloor = meta.offices[0]?.floors?.[0]?.id ?? '';
  const [state, setState] = useState<FilterState>({
    office: initialOffice,
    floor: initialFloor,
    date: todayLocalISO(),
  });

  const options = useMemo(() => buildOptions(state.office || initialOffice), [state.office, initialOffice]);

  const setOffice = useCallback((office: string) => {
    const metaOffice = meta.offices.find((o) => o.id === office) ?? meta.offices[0];
    const firstFloor = metaOffice?.floors?.[0]?.id ?? '';
    setState((prev) => ({ ...prev, office: office || prev.office, floor: firstFloor }));
  }, [meta.offices]);

  const setFloor = useCallback((floor: string) => {
    setState((prev) => ({ ...prev, floor: floor || prev.floor }));
  }, []);

  const setDate = useCallback((date: string) => {
    setState((prev) => ({ ...prev, date }));
  }, []);

  const value = useMemo(
    () => ({ state, options, setOffice, setFloor, setDate }),
    [state, options, setOffice, setFloor, setDate],
  );

  return <FiltersContext.Provider value={value}>{children}</FiltersContext.Provider>;
};

export const useFilters = (): FiltersContextValue => {
  const ctx = useContext(FiltersContext);
  if (!ctx) throw new Error('useFilters must be used within FiltersProvider');
  return ctx;
};
