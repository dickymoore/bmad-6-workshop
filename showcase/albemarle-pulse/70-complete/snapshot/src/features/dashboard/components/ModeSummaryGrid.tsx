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
  const primaryModes = viewModel.nearbyModes.slice(0, 3);
  const secondaryModes = viewModel.nearbyModes.slice(3);

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
            Nearby mode status
          </h2>
        </div>
        <p className="mode-summary-panel__summary">W1S wayfinding</p>
      </div>
      <p className="sr-only" id="nearby-mode-intro">
        {viewModel.nearbyModeIntro}
      </p>
      <ul className="mode-summary-panel__rows mode-summary-grid" aria-label="Nearby departure mode summaries">
        {primaryModes.map((mode) => (
          <li key={mode.key} className="mode-summary-grid__row">
            <ModeSummaryCard mode={mode} />
          </li>
        ))}
      </ul>
      {secondaryModes.length ? (
        <section className="mode-summary-panel__secondary" aria-label="Additional nearby modes">
          <div className="mode-summary-panel__secondary-header">
            <h3 className="mode-summary-panel__secondary-title">Micromobility</h3>
          </div>
          <div className="mode-summary-panel__secondary-grid">
            {secondaryModes.map((mode) => (
              <article
                key={mode.key}
                className={`mode-summary-panel__secondary-card mode-summary-panel__secondary-card--${mode.state}`}
                aria-label={mode.label}
              >
                <div>
                  <p className="mode-summary-panel__secondary-label">{mode.label}</p>
                  <p className="mode-summary-panel__secondary-caption">{mode.sourceStatus.label}</p>
                </div>
                <div className="mode-summary-panel__secondary-reading">
                  <p className="mode-summary-panel__secondary-value">{mode.stateLabel}</p>
                  <p className="mode-summary-panel__secondary-meta">{mode.sourceStatus.label}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </section>
  );
}
