import React from 'react';
import { useFilters } from '../lib/filters/context';

export const PerDayListPlaceholder: React.FC = () => {
  const { state } = useFilters();
  return (
    <section className="card">
      <h2>Per-day List</h2>
      <p>
        List bookings for <code>{state.date}</code> in <code>{state.office}</code> / <code>{state.floor}</code> (placeholder).
      </p>
    </section>
  );
};
