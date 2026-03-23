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
    weatherSummary: "Rain nearby.",
    weatherTemperatureC: 12,
    mobilitySummary: "Some nearby services are slower than normal.",
    placeLabel: "Royal Institution, Albemarle Street",
    supportLabel: "Transport and weather are live.",
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
      title: "Local orientation",
      state: mapState,
      sourceStatus: createSourceStatus({
        state: mapState === "fallback" ? "carried-forward" : "live",
        detail:
          mapState === "fallback"
            ? "Showing the simpler local map."
            : "Local map is live.",
      }),
      venueAnchor: {
        key: "royal-institution",
        label: "Royal Institution",
        x: 44,
        y: 47,
      },
      nearbyReferences:
        mapState === "fallback"
          ? [
              {
                key: "green-park-station",
                label: "Green Park",
                kind: "station",
                caption: "Jubilee, Piccadilly, Victoria",
              },
              {
                key: "piccadilly-stop-r",
                label: "Piccadilly / St James's Street",
                kind: "stop",
                caption: "Bus stop R",
              },
            ]
          : [
              {
                key: "green-park-station",
                label: "Green Park",
                kind: "station",
                caption: "Jubilee, Piccadilly, Victoria",
              },
              {
                key: "piccadilly-stop-r",
                label: "Piccadilly / St James's Street",
                kind: "stop",
                caption: "Bus stop R",
              },
              {
                key: "albemarle-street",
                label: "Albemarle Street",
                kind: "corridor",
                caption: "Royal Institution frontage",
              },
            ],
      selectedNearbyNodes:
        mapState === "fallback"
          ? [
              {
                key: "green-park",
                label: "Green Park",
                x: 54,
                y: 30,
              },
              {
                key: "piccadilly-stop-r",
                label: "Piccadilly / St James's Street",
                x: 37,
                y: 59,
              },
            ]
          : [
              {
                key: "green-park",
                label: "Green Park",
                x: 54,
                y: 30,
              },
              {
                key: "piccadilly-stop-r",
                label: "Piccadilly / St James's Street",
                x: 37,
                y: 59,
              },
              {
                key: "albemarle-street",
                label: "Albemarle Street",
                x: 44,
                y: 38,
              },
            ],
      orientationSummary:
        mapState === "fallback"
          ? "Simplified local orientation keeps the Royal Institution, Green Park, and the Piccadilly / St James's Street stop visible."
          : "Royal Institution, Green Park, and the Piccadilly / St James's Street stop are shown on the local map.",
      localityEmphasis:
        mapState === "fallback"
          ? {
              label: "Simplified local orientation keeps the Royal Institution, Green Park, and the Piccadilly / St James's Street stop visible.",
            }
          : {
              label: "Royal Institution, Green Park, and the Piccadilly / St James's Street stop are shown on the local map.",
            },
      fallbackCopy:
        mapState === "fallback"
          ? "Simplified local orientation keeps the Royal Institution, Green Park, and the Piccadilly / St James's Street stop visible."
          : null,
    },
    nearbyModes: [
      {
        key: "tube-rail",
        label: "Tube and rail",
        state: "available",
        disruptionScope: "unaffected-readable",
        summary: "Green Park and Piccadilly services are running normally.",
        nuance: "No reported issue.",
        sourceStatus: createSourceStatus({
          state: "live",
          detail: "Tube and rail is live.",
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
        summary: "Nearby buses are slower than normal.",
        nuance: "Expect some delay.",
        sourceStatus: createSourceStatus({
          state: "live",
          detail: "Bus is live.",
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
        summary: "Road traffic is slower than normal.",
        nuance: "Pickup waits may be longer.",
        sourceStatus: createSourceStatus({
          state: "live",
          detail: "Roads are live.",
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
        summary: "Micromobility availability is reduced.",
        nuance: "Docking points are thinner than usual.",
        sourceStatus: createSourceStatus({
          state: "live",
          detail: "Cycles and scooters are live.",
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
