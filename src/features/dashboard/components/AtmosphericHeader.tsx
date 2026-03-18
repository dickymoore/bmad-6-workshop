type ReservedSection = {
  title: string;
  variant: string;
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
  reservedSections: readonly ReservedSection[];
};

export function AtmosphericHeader({ viewModel }: { viewModel: DashboardViewModel }) {
  return (
    <header className="atmospheric-header" aria-labelledby="overall-departure-state">
      <div className="atmospheric-header__eyebrow">
        <p className="atmospheric-header__place">{viewModel.placeLabel}</p>
        <p className={`status-chip status-chip--${viewModel.overallState}`}>
          <span className="status-chip__dot" aria-hidden="true" />
          <span className="status-chip__label">{viewModel.overallState}</span>
        </p>
      </div>

      <div className="atmospheric-header__body">
        <p className="atmospheric-header__kicker">{viewModel.stateKicker}</p>
        <h1 className="atmospheric-header__headline" id="overall-departure-state">
          {viewModel.stateHeadline}
        </h1>
        <p className="atmospheric-header__summary atmospheric-header__summary--weather">
          {viewModel.weatherSummary}
        </p>
        <p className="atmospheric-header__summary atmospheric-header__summary--mobility">
          {viewModel.mobilitySummary}
        </p>
      </div>

      <div className="atmospheric-header__footer" aria-label="trust cues">
        <p>{viewModel.freshnessLabel}</p>
        <p>{viewModel.supportLabel}</p>
      </div>
    </header>
  );
}
