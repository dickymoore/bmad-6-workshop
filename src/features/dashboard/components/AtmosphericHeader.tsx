type DashboardViewModel = {
  placeLabel: string;
  overallState: string;
  overallTrend: string | null;
  overallTrendLabel: string | null;
  trendMessage: string | null;
  currentnessMessage: string;
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
  mobilityTrust: {
    label: string;
    detail: string;
    confidence: string;
  };
  supportLabel: string;
};

export function AtmosphericHeader({ viewModel }: { viewModel: DashboardViewModel }) {
  return (
    <header
      className={`atmospheric-header atmospheric-header--${viewModel.disruption.level}`}
      aria-labelledby="overall-departure-state"
    >
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
        {viewModel.disruption.hasSeriousDisruption ? (
          <div className={`disruption-callout disruption-callout--${viewModel.disruption.level}`}>
            <p className="disruption-callout__label">{viewModel.disruption.label}</p>
            <p className="disruption-callout__title">{viewModel.disruption.title}</p>
            <p className="disruption-callout__detail">{viewModel.disruption.detail}</p>
          </div>
        ) : null}
        {viewModel.overallTrendLabel ? (
          <p className="atmospheric-header__trend" aria-label={`Trend ${viewModel.overallTrendLabel.toLowerCase()}`}>
            <span className={`trust-chip trust-chip--${viewModel.overallTrend ?? "steady"}`}>{viewModel.overallTrendLabel}</span>
            <span>{viewModel.trendMessage}</span>
          </p>
        ) : null}
        <p className="atmospheric-header__summary atmospheric-header__summary--weather">
          {viewModel.weatherSummary}
        </p>
        <p className="atmospheric-header__trust atmospheric-header__trust--weather">{viewModel.weatherTrust.detail}</p>
        <p className="atmospheric-header__summary atmospheric-header__summary--mobility">
          {viewModel.mobilitySummary}
        </p>
        <p className="atmospheric-header__trust atmospheric-header__trust--mobility">{viewModel.mobilityTrust.detail}</p>
      </div>

      <div className="atmospheric-header__footer" aria-label="trust cues">
        <p className="atmospheric-header__currentness" aria-live="polite">
          {viewModel.currentnessMessage}
        </p>
        <p>{viewModel.supportLabel}</p>
      </div>
    </header>
  );
}
