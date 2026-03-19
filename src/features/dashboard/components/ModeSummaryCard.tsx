type NearbyModeViewModel = {
  key: string;
  label: string;
  state: string;
  stateLabel: string;
  summary: string;
  nuance: string | null;
  trust: {
    label: string;
    detail: string;
    confidence: string;
    isNarrowed: boolean;
  };
};

export function ModeSummaryCard({ mode }: { mode: NearbyModeViewModel }) {
  return (
    <article className={`mode-summary-card mode-summary-card--${mode.state}`} aria-label={mode.label}>
      <div className="mode-summary-card__header">
        <div>
          <p className="mode-summary-card__label">{mode.label}</p>
          <p className="mode-summary-card__state">
            <span className="mode-summary-card__state-mark" aria-hidden="true">
              {mode.state === "available" ? "Open" : mode.state === "caution" ? "Watch" : "Held"}
            </span>
            <span>{mode.stateLabel}</span>
          </p>
        </div>
      </div>
      <p className="mode-summary-card__summary">{mode.summary}</p>
      {mode.nuance ? <p className="mode-summary-card__nuance">{mode.nuance}</p> : null}
      <p className={`mode-summary-card__trust mode-summary-card__trust--${mode.trust.confidence}`}>{mode.trust.detail}</p>
    </article>
  );
}
