import { createDashboardSnapshot } from "../../../lib/contracts/dashboard-snapshot.js";
import { createSourceStatus, createTrustSignal } from "../../../lib/contracts/freshness.js";

const FIXTURE_PUBLISHED_AT = "2026-03-19T08:00:00.000Z";

function createBaseSnapshot({
  publishedAt = FIXTURE_PUBLISHED_AT,
  mapState = "default",
  overallTrend = null,
} = {}) {
  return createDashboardSnapshot({
    publishedAt,
    overallState: "watchful",
    overallTrend,
    weatherSummary: "Cold rain is moving across Mayfair and the street is reading a little slower.",
    mobilitySummary: "Nearby departures are still moving, with a tighter rhythm under the rain.",
    placeLabel: "Royal Institution, Albemarle Street",
    supportLabel: "Weather and mobility reinforce the same local read.",
    disruptionEmphasis: {
      level: "none",
      headline: null,
      detail: null,
      affectedModeKeys: [],
    },
    headerTrust: {
      weather: createTrustSignal({
        state: "current",
        subject: "Weather",
      }),
      mobility: createTrustSignal({
        state: "aging",
        subject: "Movement",
      }),
    },
    headerStatus: {
      weather: createSourceStatus({
        state: "live",
        subject: "Weather",
      }),
      mobility: createSourceStatus({
        state: "live",
        subject: "Movement",
      }),
    },
    localMap: {
      title: "Local frame",
      state: mapState,
      sourceStatus: createSourceStatus({
        state: mapState === "fallback" ? "carried-forward" : "live",
        detail:
          mapState === "fallback"
            ? "The local frame stays simplified while richer locality detail narrows."
            : "The local frame is reading live for this foyer.",
      }),
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
        disruptionScope: "unaffected-readable",
        summary: "Green Park and Piccadilly lines are still reading open within the short walk from here.",
        nuance: "Platforms may feel a little fuller once the current lecture lets out.",
        sourceStatus: createSourceStatus({
          state: "live",
          detail: "Tube and rail is reading live nearby.",
        }),
        trust: createTrustSignal({
          state: "current",
          subject: "Tube and rail",
        }),
      },
      {
        key: "bus",
        label: "Bus",
        state: "caution",
        disruptionScope: "unaffected-readable",
        summary: "West End stops nearby are moving, though spacing is a little uneven in the rain.",
        nuance: "Sheltered queues are beginning to gather along the wetter side streets.",
        sourceStatus: createSourceStatus({
          state: "live",
          detail: "Bus is reading live nearby.",
        }),
        trust: createTrustSignal({
          state: "aging",
          subject: "Bus",
        }),
      },
      {
        key: "roads",
        label: "Roads",
        state: "caution",
        disruptionScope: "unaffected-readable",
        summary: "Mayfair traffic is still flowing, with slower turns around the wetter junctions.",
        nuance: "Street crossings remain readable, but the pace is not especially brisk.",
        sourceStatus: createSourceStatus({
          state: "live",
          detail: "Roads are reading live nearby.",
        }),
        trust: createTrustSignal({
          state: "stale",
          subject: "Roads",
        }),
      },
      {
        key: "cycles-scooters",
        label: "Cycles and scooters",
        state: "caution",
        disruptionScope: "unaffected-readable",
        summary: "Open micromobility nearby is still moving, though vehicles are thinner under the rain.",
        nuance: "Availability remains patchier than the clearer corridors nearby.",
        sourceStatus: createSourceStatus({
          state: "live",
          detail: "Cycles and scooters are reading live nearby.",
        }),
        trust: createTrustSignal({
          state: "reduced-confidence",
          subject: "Cycles and scooters",
        }),
      },
    ],
  });
}

const overallDepartureSnapshot = createBaseSnapshot();

export const overallDepartureFallbackSnapshot = createBaseSnapshot({
  mapState: "fallback",
});

export function createFixtureDashboardSnapshot({
  publishedAt = FIXTURE_PUBLISHED_AT,
  overallTrend = null,
} = {}) {
  return createBaseSnapshot({ publishedAt, overallTrend });
}

export function createFixtureDashboardFallbackSnapshot({
  publishedAt = FIXTURE_PUBLISHED_AT,
  overallTrend = null,
} = {}) {
  return createBaseSnapshot({ publishedAt, mapState: "fallback", overallTrend });
}

export function getOverallDepartureSnapshot() {
  return overallDepartureSnapshot;
}
