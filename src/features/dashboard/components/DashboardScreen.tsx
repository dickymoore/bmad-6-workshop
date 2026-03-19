import { AtmosphericHeader } from "@/features/dashboard/components/AtmosphericHeader";
import { LocalMapFrame } from "@/features/dashboard/components/LocalMapFrame";
import { ModeSummaryGrid } from "@/features/dashboard/components/ModeSummaryGrid";

type NearbyModeViewModel = {
  key: string;
  label: string;
  state: string;
  stateLabel: string;
  disruptionScope: string;
  emphasisLabel: string;
  isDisrupted: boolean;
  summary: string;
  nuance: string | null;
  trust: {
    label: string;
    detail: string;
    confidence: string;
    isNarrowed: boolean;
  };
  sourceStatus: {
    state: string;
    label: string;
    detail: string;
    isLive: boolean;
  };
  changeSummary: string | null;
};

type DashboardViewModel = {
  placeLabel: string;
  overallState: string;
  overallTrend: string | null;
  overallTrendLabel: string | null;
  trendMessage: string | null;
  currentnessMessage: string;
  updateSummary: {
    label: string;
    detail: string;
  } | null;
  liveAnnouncement: string | null;
  stateKicker: string;
  stateHeadline: string;
  disruption: {
    level: string;
    label: string | null;
    title: string | null;
    detail: string | null;
    affectedModeKeys: readonly string[];
    hasSeriousDisruption: boolean;
  };
  weatherSummary: string;
  mobilitySummary: string;
  weatherTrust: {
    label: string;
    detail: string;
    confidence: string;
  };
  weatherStatus: {
    state: string;
    label: string;
    detail: string;
    isLive: boolean;
  };
  mobilityTrust: {
    label: string;
    detail: string;
    confidence: string;
  };
  mobilityStatus: {
    state: string;
    label: string;
    detail: string;
    isLive: boolean;
  };
  supportLabel: string;
  nearbyModeHeading: string;
  nearbyModeIntro: string;
  nearbyModes: readonly NearbyModeViewModel[];
  localMap: {
    title: string;
    ariaLabel: string;
    state: string;
    stateLabel: string;
    sourceStatus: {
      state: string;
      label: string;
      detail: string;
      isLive: boolean;
    };
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
    changeSummary: string | null;
  };
};

export function DashboardScreen({ viewModel }: { viewModel: DashboardViewModel }) {
  return (
    <main className="dashboard-page">
      <div className="dashboard-backdrop" aria-hidden="true" />
      <section
        className="dashboard-shell dashboard-shell--venue dashboard-shell--desktop"
        aria-label="Royal Institution departure picture"
        data-live-shell="calm-fixed"
      >
        <div className="dashboard-shell__header" data-reading-zone="header">
          <AtmosphericHeader viewModel={viewModel} />
        </div>

        <div className="dashboard-shell__body">
          <div className="dashboard-lower-grid" aria-label="Shared nearby departure structure">
            <div className="dashboard-lower-grid__modes" data-reading-zone="modes">
              <ModeSummaryGrid viewModel={viewModel} />
            </div>
            <div className="dashboard-lower-grid__map" data-reading-zone="map">
              <LocalMapFrame viewModel={viewModel.localMap} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
