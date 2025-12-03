import React from 'react';
import type { DeskStatus } from './FloorplanView';
import { availabilityColors } from '../../lib/style/tokens';

type LegendProps = {
  counts: Record<DeskStatus, number>;
};

const swatches: Array<{ label: string; key: DeskStatus; color: string }> = [
  { label: 'Free', key: 'free', color: availabilityColors.free },
  { label: 'Booked', key: 'booked', color: availabilityColors.booked },
  { label: 'Selected', key: 'selected', color: availabilityColors.selected },
];

export const Legend: React.FC<LegendProps> = ({ counts }) => (
  <div className="legend" aria-label="Legend">
    {swatches.map((s) => (
      <span key={s.key} className="legend-item">
        <span className="legend-dot" style={{ backgroundColor: s.color }} aria-hidden />
        {s.label} ({counts[s.key] ?? 0})
      </span>
    ))}
  </div>
);
