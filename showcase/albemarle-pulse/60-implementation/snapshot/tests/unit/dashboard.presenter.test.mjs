import { describe, expect, it } from "vitest";

import {
  DASHBOARD_ADVISORY_LANGUAGE_PATTERN,
  NEARBY_MODE_STATES,
  OVERALL_DEPARTURE_STATES,
  createDashboardSnapshot,
} from "../../src/lib/contracts/dashboard-snapshot.js";
import {
  createCurrentnessLabel,
  getDashboardMetadata,
  presentDashboardSnapshot,
} from "../../src/features/dashboard/presenters/dashboard-presenter.js";

function buildSnapshot(overrides = {}) {
  return createDashboardSnapshot({
    publishedAt: "2026-03-19T08:00:00.000Z",
    overallState: "watchful",
    weatherSummary: "Cold rain is moving across Mayfair and the street is reading a little slower.",
    mobilitySummary: "Nearby departures are still moving, with a tighter rhythm under the rain.",
    placeLabel: "Royal Institution, Albemarle Street",
    freshnessLabel: "Now refreshed for the foyer.",
    supportLabel: "Weather and mobility reinforce the same local read.",
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
      },
      {
        key: "bus",
        label: "Bus",
        state: "caution",
        summary: "West End stops are moving, though spacing is a little uneven in the rain.",
      },
    ],
    ...overrides,
  });
}

describe("dashboard snapshot contract", () => {
  it("supports only the approved overall departure vocabulary", () => {
    expect(OVERALL_DEPARTURE_STATES).toEqual(["calm", "watchful", "strained", "disrupted"]);
  });

  it("supports only the approved nearby-mode vocabulary", () => {
    expect(NEARBY_MODE_STATES).toEqual(["available", "caution", "disrupted"]);
  });

  it("returns a frozen normalized snapshot for the public display", () => {
    const snapshot = buildSnapshot();

    expect(snapshot).toEqual({
      publishedAt: "2026-03-19T08:00:00.000Z",
      overallState: "watchful",
      weatherSummary: "Cold rain is moving across Mayfair and the street is reading a little slower.",
      mobilitySummary: "Nearby departures are still moving, with a tighter rhythm under the rain.",
      placeLabel: "Royal Institution, Albemarle Street",
      freshnessLabel: "Now refreshed for the foyer.",
      supportLabel: "Weather and mobility reinforce the same local read.",
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
        },
        {
          key: "bus",
          label: "Bus",
          state: "caution",
          summary: "West End stops are moving, though spacing is a little uneven in the rain.",
          nuance: null,
        },
      ],
    });
    expect(Object.isFrozen(snapshot)).toBe(true);
    expect(Object.isFrozen(snapshot.localMap)).toBe(true);
    expect(Object.isFrozen(snapshot.localMap.selectedNearbyNodes)).toBe(true);
    expect(Object.isFrozen(snapshot.localMap.selectedNearbyNodes[0])).toBe(true);
    expect(Object.isFrozen(snapshot.nearbyModes)).toBe(true);
  });

  it("rejects advisory wording in shared public-display copy", () => {
    let thrownError;

    try {
      buildSnapshot({
        mobilitySummary: "Take the tube before the next burst of rain.",
      });
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError?.message).toMatch(/must stay fact-only/);
    expect(DASHBOARD_ADVISORY_LANGUAGE_PATTERN.test("recommended")).toBe(true);
  });

  it("normalizes fixed local-map data for default and fallback states", () => {
    const snapshot = buildSnapshot({
      localMap: {
        title: "  Local frame ",
        state: "fallback",
        venueAnchor: {
          key: " royal-institution ",
          label: " Royal Institution ",
          x: 48,
          y: 58,
        },
        selectedNearbyNodes: [
          {
            key: " green-park ",
            label: " Green Park ",
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
          label: " Piccadilly and Green Park remain the clearest local corridor. ",
        },
        fallbackCopy: " Simplified local frame while richer locality detail is unavailable. ",
      },
    });

    expect(snapshot.localMap).toEqual({
      title: "Local frame",
      state: "fallback",
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
      fallbackCopy: "Simplified local frame while richer locality detail is unavailable.",
    });
  });

  it("rejects unsupported nearby-mode states and duplicate keys", () => {
    let invalidStateError;
    let advisoryCopyError;
    let duplicateKeyError;

    try {
      buildSnapshot({
        nearbyModes: [
          {
            key: "roads",
            label: "Roads",
            state: "best",
            summary: "Vehicle movement is still possible nearby.",
          },
        ],
      });
    } catch (error) {
      invalidStateError = error;
    }

    try {
      buildSnapshot({
        nearbyModes: [
          {
            key: "roads",
            label: "Roads",
            state: "caution",
            summary: "Best option is to head west by car.",
          },
        ],
      });
    } catch (error) {
      advisoryCopyError = error;
    }

    try {
      buildSnapshot({
        nearbyModes: [
          {
            key: " roads ",
            label: "Roads",
            state: "caution",
            summary: "Vehicle movement is still possible nearby.",
          },
          {
            key: "roads",
            label: "Roads again",
            state: "available",
            summary: "Traffic is easing slightly.",
          },
        ],
      });
    } catch (error) {
      duplicateKeyError = error;
    }

    expect(invalidStateError?.message).toMatch(/Unsupported nearby mode state/);
    expect(advisoryCopyError?.message).toMatch(/must stay fact-only/);
    expect(duplicateKeyError?.message).toMatch(/must be unique/);
  });

  it("rejects unsupported local-map states, invalid fallback usage, advisory fallback copy, and duplicate node keys", () => {
    let invalidStateError;
    let missingFallbackCopyError;
    let unexpectedFallbackCopyError;
    let advisoryCopyError;
    let duplicateKeyError;

    try {
      buildSnapshot({
        localMap: {
          title: "Local frame",
          state: "interactive",
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
          ],
        },
      });
    } catch (error) {
      invalidStateError = error;
    }

    try {
      buildSnapshot({
        localMap: {
          title: "Local frame",
          state: "fallback",
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
          ],
          localityEmphasis: null,
        },
      });
    } catch (error) {
      missingFallbackCopyError = error;
    }

    try {
      buildSnapshot({
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
          ],
          fallbackCopy: "Simplified local frame while richer locality detail is unavailable.",
        },
      });
    } catch (error) {
      unexpectedFallbackCopyError = error;
    }

    try {
      buildSnapshot({
        localMap: {
          title: "Local frame",
          state: "fallback",
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
          ],
          fallbackCopy: "Recommended local frame detail is unavailable.",
        },
      });
    } catch (error) {
      advisoryCopyError = error;
    }

    try {
      buildSnapshot({
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
              key: " green-park ",
              label: "Green Park",
              x: 64,
              y: 32,
            },
            {
              key: "green-park",
              label: "Green Park station",
              x: 66,
              y: 34,
            },
          ],
        },
      });
    } catch (error) {
      duplicateKeyError = error;
    }

    expect(invalidStateError?.message).toMatch(/Unsupported local map state/);
    expect(missingFallbackCopyError?.message).toMatch(/is required when state is "fallback"/);
    expect(unexpectedFallbackCopyError?.message).toMatch(/is only allowed when state is "fallback"/);
    expect(advisoryCopyError?.message).toMatch(/must stay fact-only/);
    expect(duplicateKeyError?.message).toMatch(/must be unique/);
  });
});

describe("dashboard presenter", () => {
  it("turns the snapshot into a room-scale display with nearby mode summaries and a fixed local map", () => {
    const viewModel = presentDashboardSnapshot(buildSnapshot());

    expect(viewModel).toEqual({
      placeLabel: "Royal Institution, Albemarle Street",
      overallState: "watchful",
      stateKicker: "Overall departure picture",
      stateHeadline: "Watchful across the Royal Institution threshold",
      weatherSummary: "Cold rain is moving across Mayfair and the street is reading a little slower.",
      mobilitySummary: "Nearby departures are still moving, with a tighter rhythm under the rain.",
      freshnessLabel: "Now refreshed for the foyer.",
      supportLabel: "Weather and mobility reinforce the same local read.",
      nearbyModeHeading: "Nearby modes",
      nearbyModeIntro: "From here, now: the nearby departure modes are reading as follows.",
      nearbyModes: [
        {
          key: "tube-rail",
          label: "Tube and rail",
          state: "available",
          stateLabel: "Available",
          summary: "Green Park and Piccadilly lines are still reading open nearby.",
          nuance: "Station approaches may bunch lightly after talks end.",
        },
        {
          key: "bus",
          label: "Bus",
          state: "caution",
          stateLabel: "Caution",
          summary: "West End stops are moving, though spacing is a little uneven in the rain.",
          nuance: null,
        },
      ],
      localMap: {
        title: "Local frame",
        ariaLabel: "Fixed local map anchored to the Royal Institution",
        state: "default",
        stateLabel: "Default local frame",
        venueAnchor: {
          key: "royal-institution",
          label: "Royal Institution",
          x: 48,
          y: 58,
          caption: "Anchor",
        },
        selectedNearbyNodes: [
          {
            key: "green-park",
            label: "Green Park",
            x: 64,
            y: 32,
            caption: "Nearby node",
          },
          {
            key: "piccadilly-arcade",
            label: "Piccadilly Arcade",
            x: 34,
            y: 61,
            caption: "Nearby node",
          },
        ],
        localityEmphasis: "Piccadilly and Green Park remain the clearest local corridor.",
        fallbackCopy: null,
      },
    });
    expect(Object.isFrozen(viewModel)).toBe(true);
    expect(Object.isFrozen(viewModel.localMap)).toBe(true);
    expect(Object.isFrozen(viewModel.nearbyModes)).toBe(true);
  });

  it("presents a calm fallback local-map variant without planner language", () => {
    const viewModel = presentDashboardSnapshot(
      buildSnapshot({
        localMap: {
          title: "Local frame",
          state: "fallback",
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
          ],
          localityEmphasis: null,
          fallbackCopy: "Simplified local frame while richer locality detail is unavailable.",
        },
      }),
    );

    expect(viewModel.localMap.state).toBe("fallback");
    expect(viewModel.localMap.stateLabel).toBe("Fallback local frame");
    expect(viewModel.localMap.fallbackCopy).toBe(
      "Simplified local frame while richer locality detail is unavailable.",
    );
    expect(/best option|recommended|switch to|take\b/i.test(JSON.stringify(viewModel.localMap))).toBe(false);
  });

  it("keeps presenter copy inside the non-advisory doctrine boundaries", () => {
    const viewModel = presentDashboardSnapshot(
      buildSnapshot({
        overallState: "calm",
        weatherSummary: "A bright, dry spell is keeping the local departure picture easy to read.",
        mobilitySummary: "Nearby movement is settling into an even public rhythm.",
        freshnessLabel: "Freshly settled across the foyer.",
        supportLabel: "Conditions remain calm without narrowing anyone toward a single choice.",
        nearbyModes: [
          {
            key: "roads",
            label: "Roads",
            state: "available",
            summary: "Traffic is still flowing through Mayfair at a readable pace.",
            nuance: "Crossings are staying simple to read.",
          },
        ],
      }),
    );

    const copy = JSON.stringify(viewModel);

    expect(/best option|recommended|switch to|take\b/i.test(copy)).toBe(false);
    expect(/Map placeholder/i.test(copy)).toBe(false);
  });

  it("keeps metadata aligned with the overall departure picture", () => {
    expect(getDashboardMetadata()).toEqual({
      title: "Albemarle Pulse | Royal Institution departures",
      description: "Overall departure picture for the Royal Institution foyer.",
    });
  });

  it("keeps the visible currentness cue calm and snapshot-driven", () => {
    expect(createCurrentnessLabel(" Freshly settled across the foyer. ")).toBe(
      "Freshly settled across the foyer.",
    );
    expect(createCurrentnessLabel("")).toBe("Holding a calm shared picture for the foyer.");
  });
});
