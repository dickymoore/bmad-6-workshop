import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { FiltersProvider } from '../../src/lib/filters/context';
import { FiltersBar, FiltersSummary } from '../../src/components/FiltersBar';
import { todayLocalISO } from '../../src/lib/date';

const renderWithProvider = (ui: React.ReactElement) => render(<FiltersProvider>{ui}</FiltersProvider>);

describe('FiltersBar', () => {
  it('defaults date to today', () => {
    renderWithProvider(<FiltersBar />);
    const dateInput = screen.getByLabelText(/date/i) as HTMLInputElement;
    expect(dateInput.value).toBe(todayLocalISO());
  });

  it('populates offices and floors from desks.json', () => {
    renderWithProvider(<FiltersBar />);
    const officeSelect = screen.getByLabelText(/office/i) as HTMLSelectElement;
    const floorSelect = screen.getByLabelText(/floor/i) as HTMLSelectElement;
    expect(officeSelect.options.length).toBeGreaterThan(0);
    expect(floorSelect.options.length).toBeGreaterThan(0);
  });

  it('updates summary when filters change', () => {
    renderWithProvider(
      <div>
        <FiltersBar />
        <FiltersSummary />
      </div>,
    );

    const officeSelect = screen.getByLabelText(/office/i) as HTMLSelectElement;
    const floorSelect = screen.getByLabelText(/floor/i) as HTMLSelectElement;
    const dateInput = screen.getByLabelText(/date/i) as HTMLInputElement;

    // change office (if multiple)
    if (officeSelect.options.length > 1) {
      fireEvent.change(officeSelect, { target: { value: officeSelect.options[1].value } });
    }
    fireEvent.change(floorSelect, { target: { value: floorSelect.options[floorSelect.options.length - 1].value } });
    fireEvent.change(dateInput, { target: { value: '2030-01-02' } });

    const matches = screen.getAllByText(/2030-01-02/);
    expect(matches.length).toBeGreaterThan(1);
  });
});
