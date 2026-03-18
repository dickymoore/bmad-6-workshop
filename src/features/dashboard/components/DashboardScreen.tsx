import { AtmosphericHeader } from "@/features/dashboard/components/AtmosphericHeader";
import { ModeSummaryGrid } from "@/features/dashboard/components/ModeSummaryGrid";

type NearbyModeViewModel = {
  key: string;
  label: string;
  state: string;
  stateLabel: string;
  summary: string;
  nuance: string | null;
};

type DashboardViewModel = {
  placeLabel: string;
  overallState: string;
  stateKicker: string;
  stateHeadline: string;
  weatherSummary: string;
  mobilitySummary: string;
  freshnessLabel: string;
  supportLabel: string;
  nearbyModeHeading: string;
  nearbyModeIntro: string;
  nearbyModes: readonly NearbyModeViewModel[];
  mapPlaceholder: {
    title: string;
    label: string;
  };
};

export function DashboardScreen({ viewModel }: { viewModel: DashboardViewModel }) {
  return (
    <main className="dashboard-page">
      <div className="dashboard-backdrop" aria-hidden="true" />
      <section className="dashboard-shell" aria-label="Royal Institution departure picture">
        <AtmosphericHeader viewModel={viewModel} />

        <div className="dashboard-lower-grid" aria-label="Shared nearby departure structure">
          <ModeSummaryGrid viewModel={viewModel} />

          <section
            className="dashboard-reserved dashboard-reserved--map"
            aria-label={viewModel.mapPlaceholder.title}
          >
            <p className="dashboard-reserved__label">{viewModel.mapPlaceholder.title}</p>
            <p className="dashboard-reserved__caption">{viewModel.mapPlaceholder.label}</p>
            <div className="dashboard-reserved__surface" aria-hidden="true" />
          </section>
        </div>
      </section>
    </main>
  );
}
