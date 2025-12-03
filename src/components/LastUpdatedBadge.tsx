import React from 'react';
import { useLastUpdatedDisplay } from '../lib/last-updated/context';

export const LastUpdatedBadge: React.FC = () => {
  const display = useLastUpdatedDisplay();
  return (
    <div className="card last-updated" role="status" aria-live="polite">
      <strong>Last updated</strong>
      <p>{display}</p>
    </div>
  );
};
