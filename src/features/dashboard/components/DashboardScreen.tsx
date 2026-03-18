import { AtmosphericHeader } from "@/features/dashboard/components/AtmosphericHeader";
import { LocalMapFrame } from "@/features/dashboard/components/LocalMapFrame";
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
  localMap: {
    title: string;
    ariaLabel: string;
    state: string;
    stateLabel: string;
    venueAnchor: {
      key: string;
      label: string;
      x: number;
      y: number;
      caption: string;
    };
    selectedNearbyNodes: readonly {
      key: string;
      label: string;
      x: number;
      y: number;
      caption: string;
    }[];
    localityEmphasis: string | null;
    fallbackCopy: string | null;
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
          <LocalMapFrame viewModel={viewModel.localMap} />
        </div>
      </section>
    </main>
  );
}
