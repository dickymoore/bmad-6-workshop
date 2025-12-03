import './index.css';
import { FiltersBar, FiltersSummary } from './components/FiltersBar';
import { FiltersProvider } from './lib/filters/context';
import { FloorplanPlaceholder } from './components/FloorplanPlaceholder';
import { PerDayListPlaceholder } from './components/PerDayListPlaceholder';
import { LastUpdatedProvider } from './lib/last-updated/context';
import { LastUpdatedBadge } from './components/LastUpdatedBadge';
import { RosterProvider } from './lib/roster/context';
import { UserDropdown } from './components/UserDropdown';
import { FloorplanView } from './components/Floorplan/FloorplanView';
import { BookingList } from './components/BookingList';
import { BookingConfirm } from './components/BookingConfirm';
import { BookingCancel } from './components/BookingCancel';
import { useState } from 'react';
import { SelectedUserProvider } from './lib/booking/selection';
import { BackupControls } from './components/BackupControls';
import { FeedbackProvider } from './lib/feedback/context';
import { ToastViewport } from './components/ToastViewport';

export default function App() {
  const [selectedDeskId, setSelectedDeskId] = useState<string | undefined>();
  const [cancelDeskId, setCancelDeskId] = useState<string | undefined>();

  return (
    <FeedbackProvider>
      <LastUpdatedProvider>
        <RosterProvider>
          <SelectedUserProvider>
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
              <FloorplanView
                selectedDeskId={selectedDeskId}
                onDeskSelect={setSelectedDeskId}
                onFreeDeskClick={setSelectedDeskId}
                onBookedDeskClick={setCancelDeskId}
              />
              <BookingList
                selectedDeskId={selectedDeskId}
                onSelectDesk={setSelectedDeskId}
                onSelectBookedDesk={setCancelDeskId}
              />
            </div>
            <div className="grid two-column">
              <BookingConfirm selectedDeskId={selectedDeskId} onBooked={() => setSelectedDeskId(undefined)} />
              <BookingCancel deskId={cancelDeskId} onCancelled={() => setCancelDeskId(undefined)} />
            </div>
            <div className="grid two-column">
              <BackupControls />
            </div>
              <ToastViewport />
            </main>
          </FiltersProvider>
        </SelectedUserProvider>
        </RosterProvider>
      </LastUpdatedProvider>
    </FeedbackProvider>
  );
}
