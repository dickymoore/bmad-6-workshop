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
  const boardStateLabel =
    mode.state === "available" ? "Green" : mode.state === "caution" ? "Amber" : "Red";
  const metaLabels = [mode.stateLabel, mode.sourceStatus.label];

  if (mode.trust.isNarrowed) {
    metaLabels.push("Read with care");
  }

  if (mode.isDisrupted) {
    metaLabels.push(mode.emphasisLabel);
  }

  const uniqueMetaLabels = [...new Set(metaLabels)];

  return (
    <article
      className={`mode-summary-card mode-summary-card--${mode.state} mode-summary-card--${mode.disruptionScope}`}
      aria-label={mode.label}
      data-mode-key={mode.key}
    >
      <span className="mode-summary-card__rail" aria-hidden="true" />
      <div className="mode-summary-grid__row">
        <div className="mode-summary-card__header">
          <p className="mode-summary-card__label">{mode.label}</p>
          <p className="mode-summary-card__summary">{mode.summary}</p>
        </div>
        <p className={`mode-summary-card__status mode-summary-card__status--${mode.state}`}>
          <span className="mode-summary-card__status-rag">{boardStateLabel}</span>
          <span>{mode.stateLabel}</span>
        </p>
      </div>
      {mode.nuance ? <p className="mode-summary-card__nuance">{mode.nuance}</p> : null}
      <div className="mode-summary-card__meta" aria-label={`${mode.label} status cues`}>
        {uniqueMetaLabels.map((label, index) => (
          <span key={`${mode.key}-${index}-${label}`} className="mode-summary-card__meta-chip">
            {label}
          </span>
        ))}
      </div>
      {mode.changeSummary ? <p className="mode-summary-card__update">{mode.changeSummary}</p> : null}
    </article>
  );
}
