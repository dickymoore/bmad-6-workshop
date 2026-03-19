import { ModeSummaryCard } from "@/features/dashboard/components/ModeSummaryCard";

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

type ModeSummaryGridViewModel = {
  nearbyModeHeading: string;
  nearbyModeIntro: string;
  nearbyModes: readonly NearbyModeViewModel[];
};

export function ModeSummaryGrid({
  viewModel,
}: {
  viewModel: ModeSummaryGridViewModel;
}) {
  return (
    <section className="mode-summary-panel" aria-labelledby="nearby-mode-heading">
      <p className="dashboard-reserved__label">{viewModel.nearbyModeHeading}</p>
      <h2 className="mode-summary-panel__heading" id="nearby-mode-heading">
        Shared nearby read
      </h2>
      <p className="mode-summary-panel__intro">{viewModel.nearbyModeIntro}</p>
      <div className="mode-summary-grid" role="list" aria-label="Nearby departure mode summaries">
        {viewModel.nearbyModes.map((mode) => (
          <div key={mode.key} role="listitem">
            <ModeSummaryCard mode={mode} />
          </div>
        ))}
      </div>
    </section>
  );
}
