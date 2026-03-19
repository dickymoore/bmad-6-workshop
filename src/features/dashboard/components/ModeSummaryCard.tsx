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

export function ModeSummaryCard({ mode }: { mode: NearbyModeViewModel }) {
  const stateMark =
    mode.sourceStatus.state === "live"
      ? mode.state === "available"
        ? "Open"
        : mode.state === "caution"
          ? "Watch"
          : "Disrupted"
      : mode.sourceStatus.label;
  const stateLabel = mode.sourceStatus.state === "live" ? mode.stateLabel : mode.sourceStatus.label;

  return (
    <article
      className={`mode-summary-card mode-summary-card--${mode.state} mode-summary-card--${mode.disruptionScope}`}
      aria-label={mode.label}
      data-mode-key={mode.key}
    >
      <div className="mode-summary-card__header">
        <div>
          <p className="mode-summary-card__label">{mode.label}</p>
          <p className="mode-summary-card__state">
            <span className="mode-summary-card__state-mark" aria-hidden="true">
              {stateMark}
            </span>
            <span>{stateLabel}</span>
          </p>
        </div>
        {mode.isDisrupted ? <p className="mode-summary-card__emphasis">{mode.emphasisLabel}</p> : null}
      </div>
      <p className="mode-summary-card__summary">{mode.summary}</p>
      {mode.nuance ? <p className="mode-summary-card__nuance">{mode.nuance}</p> : null}
      <p className={`mode-summary-card__trust mode-summary-card__trust--source mode-summary-card__trust--source-${mode.sourceStatus.state}`}>
        {mode.sourceStatus.detail}
      </p>
      <p className={`mode-summary-card__trust mode-summary-card__trust--${mode.trust.confidence}`}>{mode.trust.detail}</p>
      {mode.changeSummary ? <p className="mode-summary-card__update">{mode.changeSummary}</p> : null}
    </article>
  );
}
