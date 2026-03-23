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
};

const PUBLIC_STATUS = Object.freeze({
  calm: {
    headline: "Services: Good",
    boardLabel: "Green",
  },
  watchful: {
    headline: "Services: Watchful",
    boardLabel: "Amber",
  },
  strained: {
    headline: "Services: Delayed",
    boardLabel: "Amber",
  },
  disrupted: {
    headline: "Services: Disrupted",
    boardLabel: "Red",
  },
});

function getPublicStatus(overallState: string) {
  return PUBLIC_STATUS[overallState as keyof typeof PUBLIC_STATUS] ?? PUBLIC_STATUS.watchful;
}

function getDominantCue(viewModel: DashboardViewModel) {
  if (viewModel.disruption.hasSeriousDisruption) {
    return viewModel.disruption.detail ?? viewModel.disruption.title ?? viewModel.supportLabel;
  }

  return viewModel.supportLabel;
}

function getSignalNote(
  status: { state: string; isLive: boolean; label: string },
  trust: { label: string; confidence: string },
) {
  if (!status.isLive) {
    if (status.state === "unavailable") {
      return "Awaiting live read";
    }

    return trust.confidence === "narrowed" ? trust.label : "Last live read";
  }

  if (trust.confidence === "narrowed") {
    return trust.label;
  }

  return "Current";
}

export function AtmosphericHeader({ viewModel }: { viewModel: DashboardViewModel }) {
  const publicStatus = getPublicStatus(viewModel.overallState);
  const dominantCue = getDominantCue(viewModel);
  const motionNote = getSignalNote(viewModel.mobilityStatus, viewModel.mobilityTrust);
  const weatherNote = getSignalNote(viewModel.weatherStatus, viewModel.weatherTrust);
  const boardUpdate = viewModel.updateSummary?.detail ?? viewModel.currentnessMessage;

  return (
    <header
      className={`atmospheric-header atmospheric-header--${viewModel.disruption.level}`}
      aria-labelledby="overall-departure-state"
    >
      <div className="atmospheric-header__eyebrow">
        <p className="atmospheric-header__place">{viewModel.placeLabel}</p>
        <p className="atmospheric-header__board-label">{viewModel.stateKicker}</p>
      </div>

      <div className="atmospheric-header__body">
        <div className="atmospheric-header__primary">
          <div className="atmospheric-header__copy">
            <p className="atmospheric-header__kicker">{viewModel.overallTrendLabel ?? "Current board read"}</p>
            <h1 className="atmospheric-header__headline" id="overall-departure-state">
              {publicStatus.headline}
            </h1>
            <p className="atmospheric-header__summary">{dominantCue}</p>
          </div>

          <div className={`status-chip status-chip--${viewModel.overallState}`}>
            <span className="status-chip__dot" aria-hidden="true" />
            <span className="status-chip__meta">Status</span>
            <span className="status-chip__label">{publicStatus.boardLabel}</span>
          </div>
        </div>

        {viewModel.disruption.hasSeriousDisruption ? (
          <div className={`disruption-callout disruption-callout--${viewModel.disruption.level}`}>
            <p className="disruption-callout__label">{viewModel.disruption.label}</p>
            <p className="disruption-callout__title">{viewModel.disruption.title}</p>
            <p className="disruption-callout__detail">{viewModel.disruption.detail}</p>
          </div>
        ) : null}

        <div className="atmospheric-header__signal-grid" aria-label="Board status summary">
          <article className="signal-card signal-card--mobility">
            <p className="signal-card__label">Movement</p>
            <p className="signal-card__value">{viewModel.mobilityStatus.label}</p>
            <p className="signal-card__meta">{motionNote}</p>
          </article>

          <article className="signal-card signal-card--weather">
            <p className="signal-card__label">Weather</p>
            <p className="signal-card__value">{viewModel.weatherStatus.label}</p>
            <p className="signal-card__meta">{weatherNote}</p>
          </article>

          <article className="signal-card signal-card--board">
            <p className="signal-card__label">{viewModel.updateSummary?.label ?? "Board cue"}</p>
            <p className="signal-card__value">{viewModel.overallTrendLabel ?? "Stable read"}</p>
            <p className="signal-card__meta">{boardUpdate}</p>
          </article>
        </div>
      </div>

      {viewModel.liveAnnouncement ? (
        <p className="sr-only" aria-live="polite">
          {viewModel.liveAnnouncement}
        </p>
      ) : null}
    </header>
  );
}
