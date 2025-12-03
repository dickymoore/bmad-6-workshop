import './index.css';
import { FiltersBar, FiltersSummary } from './components/FiltersBar';
import { FiltersProvider } from './lib/filters/context';
import { FloorplanPlaceholder } from './components/FloorplanPlaceholder';
import { PerDayListPlaceholder } from './components/PerDayListPlaceholder';
import { LastUpdatedProvider } from './lib/last-updated/context';
import { LastUpdatedBadge } from './components/LastUpdatedBadge';
import { RosterProvider } from './lib/roster/context';
import { UserDropdown } from './components/UserDropdown';

export default function App() {
  return (
    <LastUpdatedProvider>
      <RosterProvider>
        <FiltersProvider>
          <main className="page">
            <header>
              <p className="eyebrow">Desk Booking</p>
              <h1>Office, Floor, and Date Filters</h1>
              <p className="lede">Choose an office, floor, and date to drive the floorplan and per-day availability list.</p>
            </header>
            <div className="grid two-column">
              <FiltersBar />
              <LastUpdatedBadge />
            </div>
            <div className="grid two-column">
              <UserDropdown />
              <FiltersSummary />
            </div>
            <div className="grid two-column">
              <FloorplanPlaceholder />
              <PerDayListPlaceholder />
            </div>
          </main>
        </FiltersProvider>
      </RosterProvider>
    </LastUpdatedProvider>
  );
}
