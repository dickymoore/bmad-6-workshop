import { createDashboardSnapshot } from "../../../lib/contracts/dashboard-snapshot.js";

const FIXTURE_PUBLISHED_AT = "2026-03-19T08:00:00.000Z";

function createBaseSnapshot({ publishedAt = FIXTURE_PUBLISHED_AT, mapState = "default" } = {}) {
  return createDashboardSnapshot({
    publishedAt,
    overallState: "watchful",
    weatherSummary: "Cold rain is moving across Mayfair and the street is reading a little slower.",
    mobilitySummary: "Nearby departures are still moving, with a tighter rhythm under the rain.",
    placeLabel: "Royal Institution, Albemarle Street",
    freshnessLabel: "Live picture refreshed for the foyer.",
    supportLabel: "Weather and mobility reinforce the same local read.",
    localMap: {
      title: "Local frame",
      state: mapState,
      venueAnchor: {
        key: "royal-institution",
        label: "Royal Institution",
        x: 48,
        y: 58,
      },
      selectedNearbyNodes:
        mapState === "fallback"
          ? [
              {
                key: "green-park",
                label: "Green Park",
                x: 64,
                y: 32,
              },
              {
                key: "piccadilly-arcade",
                label: "Piccadilly Arcade",
                x: 34,
                y: 61,
              },
            ]
          : [
              {
                key: "green-park",
                label: "Green Park",
                x: 64,
                y: 32,
              },
              {
                key: "piccadilly-arcade",
                label: "Piccadilly Arcade",
                x: 34,
                y: 61,
              },
              {
                key: "burlington-gardens",
                label: "Burlington Gardens",
                x: 42,
                y: 24,
              },
            ],
      localityEmphasis:
        mapState === "fallback"
          ? {
              label: "Royal Institution, Green Park, and Piccadilly remain the core local read.",
            }
          : {
              label: "Piccadilly and Green Park remain the clearest local corridor from the Royal Institution.",
            },
      fallbackCopy:
        mapState === "fallback"
          ? "Simplified local frame while richer locality detail is unavailable."
          : null,
    },
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
}

const overallDepartureSnapshot = createBaseSnapshot();

export const overallDepartureFallbackSnapshot = createBaseSnapshot({
  mapState: "fallback",
});

export function createFixtureDashboardSnapshot({ publishedAt = FIXTURE_PUBLISHED_AT } = {}) {
  return createBaseSnapshot({ publishedAt });
}

export function createFixtureDashboardFallbackSnapshot({ publishedAt = FIXTURE_PUBLISHED_AT } = {}) {
  return createBaseSnapshot({ publishedAt, mapState: "fallback" });
}

export function getOverallDepartureSnapshot() {
  return overallDepartureSnapshot;
}
