import { render, screen } from '@testing-library/react';
import React from 'react';
import { LastUpdatedProvider, useLastUpdated } from '../../src/lib/last-updated/context';
import { LastUpdatedBadge } from '../../src/components/LastUpdatedBadge';

const Wrapper: React.FC<{ initial?: string }> = ({ initial }) => {
  const { setLastUpdated } = useLastUpdated();
  React.useEffect(() => {
    if (initial) setLastUpdated(initial);
  }, [initial, setLastUpdated]);
  return <LastUpdatedBadge />;
};

const renderWithProvider = (ui: React.ReactElement, initial?: string) =>
  render(<LastUpdatedProvider initialLastUpdated={initial}>{ui}</LastUpdatedProvider>);

describe('LastUpdatedBadge', () => {
  it('renders placeholder when empty', () => {
    renderWithProvider(<LastUpdatedBadge />, '');
    expect(screen.getByText(/not yet saved/i)).toBeInTheDocument();
  });

  it('renders provided timestamp', () => {
    const stamp = '2030-01-02T00:00:00.000Z';
    renderWithProvider(<Wrapper initial={stamp} />);
    expect(screen.getByText(stamp)).toBeInTheDocument();
  });
});
