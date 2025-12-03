import React from 'react';
import { useFilters } from '../lib/filters/context';
import { formatLocalDate } from '../lib/date';

export const FiltersBar: React.FC = () => {
  const { state, options, setOffice, setFloor, setDate } = useFilters();
  const noOffices = options.offices.length === 0;
  const noFloors = options.floors.length === 0;

  const onOfficeChange = (e: React.ChangeEvent<HTMLSelectElement>) => setOffice(e.target.value);
  const onFloorChange = (e: React.ChangeEvent<HTMLSelectElement>) => setFloor(e.target.value);
  const onDateChange = (e: React.ChangeEvent<HTMLInputElement>) => setDate(e.target.value);

  return (
    <section aria-label="Filters" className="card filters">
      <div className="field">
        <label htmlFor="office-select">Office</label>
        <select
          id="office-select"
          value={state.office}
          onChange={onOfficeChange}
          aria-live="polite"
          disabled={noOffices}
        >
          {options.offices.map((office) => (
            <option key={office.id} value={office.id}>
              {office.name}
            </option>
          ))}
        </select>
        {noOffices && <p role="status" className="help">No offices configured in desks.json</p>}
      </div>

      <div className="field">
        <label htmlFor="floor-select">Floor</label>
        <select
          id="floor-select"
          value={state.floor}
          onChange={onFloorChange}
          aria-live="polite"
          disabled={noFloors}
        >
          {options.floors.map((floor) => (
            <option key={floor.id} value={floor.id}>
              {floor.name}
            </option>
          ))}
        </select>
        {noFloors && <p role="status" className="help">No floors for selected office</p>}
      </div>

      <div className="field">
        <label htmlFor="date-input">Date</label>
        <input
          id="date-input"
          type="date"
          value={state.date}
          onChange={onDateChange}
          aria-live="polite"
          max="9999-12-31"
        />
        <p role="status" className="help">
          Showing availability for {state.date}
        </p>
      </div>
    </section>
  );
};

export const FiltersSummary: React.FC = () => {
  const { state } = useFilters();
  return (
    <div className="card summary" role="status" aria-live="polite">
      <strong>Current selection</strong>
      <p>
        Office: <code>{state.office}</code> · Floor: <code>{state.floor}</code> · Date: <code>{formatLocalDate(new Date(state.date))}</code>
      </p>
    </div>
  );
};
