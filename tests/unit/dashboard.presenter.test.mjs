import { describe, expect, it } from "vitest";

import { createTrustSignal } from "../../src/lib/contracts/freshness.js";
import {
  DASHBOARD_ADVISORY_LANGUAGE_PATTERN,
  NEARBY_MODE_STATES,
  OVERALL_DEPARTURE_STATES,
  createDashboardSnapshot,
} from "../../src/lib/contracts/dashboard-snapshot.js";
import {
  getDashboardMetadata,
  presentDashboardSnapshot,
} from "../../src/features/dashboard/presenters/dashboard-presenter.js";

function buildSnapshot(overrides = {}) {
  return createDashboardSnapshot({
    publishedAt: "2026-03-19T08:00:00.000Z",
    overallState: "watchful",
    overallTrend: "steady",
    weatherSummary: "Cold rain is moving across Mayfair and the street is reading a little slower.",
    mobilitySummary: "Nearby departures are still moving, with a tighter rhythm under the rain.",
    placeLabel: "Royal Institution, Albemarle Street",
    supportLabel: "Weather and movement reinforce the same local read.",
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
    localMap: {
      title: "Local frame",
      state: "default",
      venueAnchor: {
        key: "royal-institution",
        label: "Royal Institution",
        x: 48,
        y: 58,
      },
      selectedNearbyNodes: [
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
      ],
      localityEmphasis: {
        label: "Piccadilly and Green Park remain the clearest local corridor.",
      },
      fallbackCopy: null,
    },
    nearbyModes: [
      {
        key: "tube-rail",
        label: "Tube and rail",
        state: "available",
        summary: "Green Park and Piccadilly lines are still reading open nearby.",
        nuance: "Station approaches may bunch lightly after talks end.",
        trust: createTrustSignal({
          state: "current",
          subject: "Tube and rail",
        }),
      },
      {
        key: "bus",
        label: "Bus",
        state: "caution",
        summary: "West End stops are moving, though spacing is a little uneven in the rain.",
        nuance: "Street queues are forming lightly under shelter.",
        trust: createTrustSignal({
          state: "delayed",
          subject: "Bus",
        }),
      },
    ],
    ...overrides,
  });
}

describe("dashboard snapshot contract", () => {
  it("supports the approved public-state vocabularies", () => {
    expect(OVERALL_DEPARTURE_STATES).toEqual(["calm", "watchful", "strained", "disrupted"]);
    expect(NEARBY_MODE_STATES).toEqual(["available", "caution", "disrupted"]);
  });

  it("returns a frozen normalized snapshot with trend and local trust metadata", () => {
    const snapshot = buildSnapshot();

    expect(snapshot.overallTrend).toBe("steady");
    expect(snapshot.headerTrust.weather.state).toBe("current");
    expect(snapshot.nearbyModes[1].trust.state).toBe("delayed");
    expect(Object.isFrozen(snapshot)).toBe(true);
    expect(Object.isFrozen(snapshot.headerTrust)).toBe(true);
    expect(Object.isFrozen(snapshot.nearbyModes)).toBe(true);
  });

  it("rejects advisory wording in public copy and trust details", () => {
    expect(DASHBOARD_ADVISORY_LANGUAGE_PATTERN.test("recommended")).toBe(true);

    let supportError;
    let trustError;

    try {
      buildSnapshot({
        supportLabel: "Take the tube while it is quiet.",
      });
    } catch (error) {
      supportError = error;
    }

    try {
      buildSnapshot({
        headerTrust: {
          weather: createTrustSignal({
            state: "current",
            detail: "Weather is current and best option is unchanged.",
          }),
          mobility: createTrustSignal({
            state: "current",
            subject: "Movement",
          }),
        },
      });
    } catch (error) {
      trustError = error;
    }

    expect(supportError?.message).toMatch(/must stay fact-only/);
    expect(trustError?.message).toMatch(/must stay fact-only/);
  });
});

describe("dashboard presenter", () => {
  it("shapes overall trend and local trust cues without broadening the whole screen", () => {
    const viewModel = presentDashboardSnapshot(buildSnapshot());

    expect(viewModel.overallTrendLabel).toBe("Steady");
    expect(viewModel.trendMessage).toBe("The departure picture is holding steady.");
    expect(viewModel.currentnessMessage).toBe("Current signals refresh inside the same calm shared view.");
    expect(viewModel.weatherTrust.isNarrowed).toBe(false);
    expect(viewModel.mobilityTrust.isNarrowed).toBe(true);
    expect(viewModel.nearbyModes[0].trust.isNarrowed).toBe(false);
    expect(viewModel.nearbyModes[1].trust.isNarrowed).toBe(true);
    expect(viewModel.nearbyModes[1].trust.detail).toMatch(/should be read with care/i);
  });

  it("keeps metadata stable for the public route", () => {
    expect(getDashboardMetadata()).toEqual({
      title: "Albemarle Pulse | Royal Institution departures",
      description: "Overall departure picture for the Royal Institution foyer.",
    });
  });

  it("keeps the header calm when no recent trend evidence exists", () => {
    const viewModel = presentDashboardSnapshot(
      buildSnapshot({
        overallTrend: null,
      }),
    );

    expect(viewModel.overallTrendLabel).toBe(null);
    expect(viewModel.trendMessage).toBe(null);
    expect(viewModel.currentnessMessage).toBe("Current signals refresh inside the same calm shared view.");
  });
});
