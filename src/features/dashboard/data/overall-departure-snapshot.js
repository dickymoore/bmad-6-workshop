import { createDashboardSnapshot } from "../../../lib/contracts/dashboard-snapshot.js";

const overallDepartureSnapshot = createDashboardSnapshot({
  overallState: "watchful",
  weatherSummary: "Cold rain is moving across Mayfair and the street is reading a little slower.",
  mobilitySummary: "Nearby departures are still moving, with a tighter rhythm under the rain.",
  placeLabel: "Royal Institution, Albemarle Street",
  freshnessLabel: "Updated moments ago from the current local snapshot.",
  supportLabel: "Weather and mobility reinforce the same local read.",
});

export function getOverallDepartureSnapshot() {
  return overallDepartureSnapshot;
}
