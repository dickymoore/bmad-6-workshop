import { createDashboardSnapshot } from "../../../lib/contracts/dashboard-snapshot.js";

const HEADLINES = Object.freeze({
  calm: "Calm across the Royal Institution threshold",
  watchful: "Watchful across the Royal Institution threshold",
  strained: "Strained across the Royal Institution threshold",
  disrupted: "Disrupted across the Royal Institution threshold",
});

const MODE_STATE_LABELS = Object.freeze({
  available: "Available",
  caution: "Caution",
  disrupted: "Disrupted",
});

const LOCAL_MAP_STATE_LABELS = Object.freeze({
  default: "Default local frame",
  fallback: "Fallback local frame",
});

const TREND_LABELS = Object.freeze({
  improving: "Improving",
  steady: "Steady",
  worsening: "Worsening",
});

const DASHBOARD_METADATA = Object.freeze({
  title: "Albemarle Pulse | Royal Institution departures",
  description: "Overall departure picture for the Royal Institution foyer.",
});

const DISRUPTION_LABELS = Object.freeze({
  none: null,
  local: "Local disruption",
  overall: "Serious disruption",
});

const MODE_DISRUPTION_LABELS = Object.freeze({
  "unaffected-readable": "Readable nearby",
  "locally-disrupted": "Disrupted nearby",
  "overall-disrupted": "Disrupted across the picture",
});

function createTrendMessage(overallTrend) {
  if (overallTrend === "improving") {
    return "The departure picture is improving.";
  }

  if (overallTrend === "worsening") {
    return "The departure picture is tightening.";
  }

  return "The departure picture is holding steady.";
}

function createCurrentnessMessage() {
  return "Current signals refresh inside the same calm shared view.";
}

function presentTrust(trust) {
  return Object.freeze({
    state: trust.state,
    label: trust.label,
    detail: trust.detail,
    confidence: trust.confidence,
    isNarrowed: trust.confidence === "narrowed",
  });
}

function presentSourceStatus(sourceStatus) {
  return Object.freeze({
    state: sourceStatus.state,
    label: sourceStatus.label,
    detail: sourceStatus.detail,
    isLive: sourceStatus.state === "live",
  });
}

export function presentDashboardSnapshot(snapshotInput) {
  const snapshot = createDashboardSnapshot(snapshotInput);

  return Object.freeze({
    placeLabel: snapshot.placeLabel,
    overallState: snapshot.overallState,
    overallTrend: snapshot.overallTrend,
    overallTrendLabel: snapshot.overallTrend ? TREND_LABELS[snapshot.overallTrend] : null,
    trendMessage: snapshot.overallTrend ? createTrendMessage(snapshot.overallTrend) : null,
    currentnessMessage: createCurrentnessMessage(),
    stateKicker: "Overall departure picture",
    stateHeadline: HEADLINES[snapshot.overallState],
    disruption: Object.freeze({
      level: snapshot.disruptionEmphasis.level,
      label: DISRUPTION_LABELS[snapshot.disruptionEmphasis.level],
      title: snapshot.disruptionEmphasis.headline,
      detail: snapshot.disruptionEmphasis.detail,
      affectedModeKeys: snapshot.disruptionEmphasis.affectedModeKeys,
      hasSeriousDisruption: snapshot.disruptionEmphasis.level !== "none",
    }),
    weatherSummary: snapshot.weatherSummary,
    mobilitySummary: snapshot.mobilitySummary,
    weatherTrust: presentTrust(snapshot.headerTrust.weather),
    mobilityTrust: presentTrust(snapshot.headerTrust.mobility),
    weatherStatus: presentSourceStatus(snapshot.headerStatus.weather),
    mobilityStatus: presentSourceStatus(snapshot.headerStatus.mobility),
    supportLabel: snapshot.supportLabel,
    nearbyModeHeading: "Nearby modes",
    nearbyModeIntro: "From here, now: the nearby departure modes are reading as follows.",
    nearbyModes: Object.freeze(
      snapshot.nearbyModes.map((mode) =>
        Object.freeze({
          ...mode,
          sourceStatus: presentSourceStatus(mode.sourceStatus),
          trust: presentTrust(mode.trust),
          stateLabel: MODE_STATE_LABELS[mode.state],
          disruptionScope: mode.disruptionScope,
          emphasisLabel: MODE_DISRUPTION_LABELS[mode.disruptionScope],
          isDisrupted: mode.disruptionScope !== "unaffected-readable",
        }),
      ),
    ),
    localMap: Object.freeze({
      title: snapshot.localMap.title,
      ariaLabel: "Fixed local map anchored to the Royal Institution",
      state: snapshot.localMap.state,
      stateLabel: LOCAL_MAP_STATE_LABELS[snapshot.localMap.state],
      sourceStatus: presentSourceStatus(snapshot.localMap.sourceStatus),
      venueAnchor: Object.freeze({
        ...snapshot.localMap.venueAnchor,
        caption: "Anchor",
      }),
      selectedNearbyNodes: Object.freeze(
        snapshot.localMap.selectedNearbyNodes.map((node) =>
          Object.freeze({
            ...node,
            caption: "Nearby node",
          }),
        ),
      ),
      localityEmphasis: snapshot.localMap.localityEmphasis?.label ?? null,
      fallbackCopy: snapshot.localMap.fallbackCopy,
    }),
  });
}

export function getDashboardMetadata() {
  return DASHBOARD_METADATA;
}
