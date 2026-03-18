import { createDashboardSnapshot } from "../../../lib/contracts/dashboard-snapshot.js";

const HEADLINES = Object.freeze({
  calm: "Calm across the Royal Institution threshold",
  watchful: "Watchful across the Royal Institution threshold",
  strained: "Strained across the Royal Institution threshold",
  disrupted: "Disrupted across the Royal Institution threshold",
});

const RESERVED_SECTIONS = Object.freeze([
  Object.freeze({ title: "Nearby modes", variant: "summary" }),
  Object.freeze({ title: "Local frame", variant: "map" }),
]);

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
    reservedSections: RESERVED_SECTIONS,
  });
}

export function getDashboardMetadata() {
  return DASHBOARD_METADATA;
}
