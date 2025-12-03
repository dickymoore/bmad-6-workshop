import React from 'react';
import { useFilters } from '../lib/filters/context';

export const FloorplanPlaceholder: React.FC = () => {
  const { state } = useFilters();
  return (
    <section className="card">
      <h2>Floorplan View</h2>
      <p>
        Render floorplan for <code>{state.office}</code> / <code>{state.floor}</code> on <code>{state.date}</code> (placeholder).
      </p>
    </section>
  );
};
