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
    <section
      className="mode-summary-panel"
      aria-labelledby="nearby-mode-heading"
      aria-describedby="nearby-mode-intro"
    >
      <div className="mode-summary-panel__header">
        <div>
          <p className="dashboard-reserved__label">{viewModel.nearbyModeHeading}</p>
          <h2 className="mode-summary-panel__heading" id="nearby-mode-heading">
            Local mode field
          </h2>
        </div>
        <p className="mode-summary-panel__summary">One-screen nearby read</p>
      </div>
      <p className="sr-only" id="nearby-mode-intro">
        {viewModel.nearbyModeIntro}
      </p>
      <ul className="mode-summary-panel__rows mode-summary-grid" aria-label="Nearby departure mode summaries">
        {viewModel.nearbyModes.map((mode) => (
          <li key={mode.key} className="mode-summary-grid__row">
            <ModeSummaryCard mode={mode} />
          </li>
        ))}
      </ul>
    </section>
  );
}
