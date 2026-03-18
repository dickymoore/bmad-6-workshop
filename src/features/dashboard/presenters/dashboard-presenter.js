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

const MAP_PLACEHOLDER = Object.freeze({
  title: "Local frame",
  label: "Royal Institution map frame held for nearby orientation.",
});

const DASHBOARD_METADATA = Object.freeze({
  title: "Albemarle Pulse | Royal Institution departures",
  description: "Overall departure picture for the Royal Institution foyer.",
});

export function presentDashboardSnapshot(snapshotInput) {
  const snapshot = createDashboardSnapshot(snapshotInput);

  return Object.freeze({
    placeLabel: snapshot.placeLabel,
    overallState: snapshot.overallState,
    stateKicker: "Overall departure picture",
    stateHeadline: HEADLINES[snapshot.overallState],
    weatherSummary: snapshot.weatherSummary,
    mobilitySummary: snapshot.mobilitySummary,
    freshnessLabel: snapshot.freshnessLabel,
    supportLabel: snapshot.supportLabel,
    nearbyModeHeading: "Nearby modes",
    nearbyModeIntro: "From here, now: the nearby departure modes are reading as follows.",
    nearbyModes: Object.freeze(
      snapshot.nearbyModes.map((mode) =>
        Object.freeze({
          ...mode,
          stateLabel: MODE_STATE_LABELS[mode.state],
        }),
      ),
    ),
    mapPlaceholder: MAP_PLACEHOLDER,
  });
}

export function getDashboardMetadata() {
  return DASHBOARD_METADATA;
}
