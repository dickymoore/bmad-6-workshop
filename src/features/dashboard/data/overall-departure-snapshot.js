import { createDashboardSnapshot } from "../../../lib/contracts/dashboard-snapshot.js";

const overallDepartureSnapshot = createDashboardSnapshot({
  overallState: "watchful",
  weatherSummary: "Cold rain is moving across Mayfair and the street is reading a little slower.",
  mobilitySummary: "Nearby departures are still moving, with a tighter rhythm under the rain.",
  placeLabel: "Royal Institution, Albemarle Street",
  freshnessLabel: "Updated moments ago from the current local snapshot.",
  supportLabel: "Weather and mobility reinforce the same local read.",
  nearbyModes: [
    {
      key: "tube-rail",
      label: "Tube and rail",
      state: "available",
      summary: "Green Park and Piccadilly lines are still reading open within the short walk from here.",
      nuance: "Platforms may feel a little fuller once the current lecture lets out.",
    },
    {
      key: "bus",
      label: "Bus",
      state: "caution",
      summary: "West End stops nearby are moving, though spacing is a little uneven in the rain.",
      nuance: "Sheltered queues are beginning to gather along the wetter side streets.",
    },
    {
      key: "roads",
      label: "Roads",
      state: "caution",
      summary: "Mayfair traffic is still flowing, with slower turns around the wetter junctions.",
      nuance: "Street crossings remain readable, but the pace is not especially brisk.",
    },
    {
      key: "cycles-scooters",
      label: "Cycles and scooters",
      state: "disrupted",
      summary: "Open micromobility nearby is looking sparse while the rain sits over central London.",
      nuance: "Any remaining vehicles are likely to be more scattered than usual from here.",
    },
  ],
});

export function getOverallDepartureSnapshot() {
  return overallDepartureSnapshot;
}
