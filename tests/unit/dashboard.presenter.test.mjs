import { describe, expect, it } from "vitest";

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

describe("dashboard snapshot contract", () => {
  it("supports only the approved overall departure vocabulary", () => {
    expect(OVERALL_DEPARTURE_STATES).toEqual(["calm", "watchful", "strained", "disrupted"]);
  });

  it("returns a frozen normalized snapshot for the public display", () => {
    const snapshot = createDashboardSnapshot({
      overallState: "watchful",
      weatherSummary: "Rain is slowing the street slightly around Albemarle Street.",
      mobilitySummary: "Nearby departures are still moving with a little more caution than usual.",
      placeLabel: "Royal Institution, Albemarle Street",
      freshnessLabel: "Updated moments ago for the public foyer display.",
      supportLabel: "Weather and mobility are telling the same local story.",
      nearbyModes: [
        {
          key: "tube-rail",
          label: "Tube and rail",
          state: "available",
          summary: "Green Park and Piccadilly lines are still reading open nearby.",
          nuance: "Platforms may feel a little busier after the next lecture release.",
        },
      ],
    });

    expect(snapshot).toEqual({
      overallState: "watchful",
      weatherSummary: "Rain is slowing the street slightly around Albemarle Street.",
      mobilitySummary: "Nearby departures are still moving with a little more caution than usual.",
      placeLabel: "Royal Institution, Albemarle Street",
      freshnessLabel: "Updated moments ago for the public foyer display.",
      supportLabel: "Weather and mobility are telling the same local story.",
      nearbyModes: [
        {
          key: "tube-rail",
          label: "Tube and rail",
          state: "available",
          summary: "Green Park and Piccadilly lines are still reading open nearby.",
          nuance: "Platforms may feel a little busier after the next lecture release.",
        },
      ],
    });
    expect(Object.isFrozen(snapshot)).toBe(true);
    expect(Object.isFrozen(snapshot.nearbyModes)).toBe(true);
    expect(Object.isFrozen(snapshot.nearbyModes[0])).toBe(true);
  });

  it("rejects advisory wording in shared public-display copy", () => {
    let thrownError;

    try {
      createDashboardSnapshot({
        overallState: "watchful",
        weatherSummary: "Cold rain is moving across Mayfair.",
        mobilitySummary: "Take the tube before the next burst of rain.",
        placeLabel: "Royal Institution, Albemarle Street",
        freshnessLabel: "Updated moments ago for the public foyer display.",
        supportLabel: "Weather and mobility are telling the same local story.",
        nearbyModes: [
          {
            key: "bus",
            label: "Bus",
            state: "caution",
            summary: "Bus stops nearby are still active.",
          },
        ],
      });
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError?.message).toMatch(/must stay fact-only/);
    expect(DASHBOARD_ADVISORY_LANGUAGE_PATTERN.test("recommended")).toBe(true);
  });

  it("supports only the approved nearby-mode vocabulary", () => {
    expect(NEARBY_MODE_STATES).toEqual(["available", "caution", "disrupted"]);
  });

  it("rejects nearby modes with advisory wording or unsupported state", () => {
    let invalidStateError;
    let advisoryCopyError;
    let duplicateKeyError;

    try {
      createDashboardSnapshot({
        overallState: "watchful",
        weatherSummary: "Cold rain is moving across Mayfair.",
        mobilitySummary: "Nearby departures are still moving with care.",
        placeLabel: "Royal Institution, Albemarle Street",
        freshnessLabel: "Updated moments ago for the public foyer display.",
        supportLabel: "Weather and mobility are telling the same local story.",
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
      createDashboardSnapshot({
        overallState: "watchful",
        weatherSummary: "Cold rain is moving across Mayfair.",
        mobilitySummary: "Nearby departures are still moving with care.",
        placeLabel: "Royal Institution, Albemarle Street",
        freshnessLabel: "Updated moments ago for the public foyer display.",
        supportLabel: "Weather and mobility are telling the same local story.",
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
      createDashboardSnapshot({
        overallState: "watchful",
        weatherSummary: "Cold rain is moving across Mayfair.",
        mobilitySummary: "Nearby departures are still moving with care.",
        placeLabel: "Royal Institution, Albemarle Street",
        freshnessLabel: "Updated moments ago for the public foyer display.",
        supportLabel: "Weather and mobility are telling the same local story.",
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
});

describe("dashboard presenter", () => {
  it("turns the snapshot into a room-scale display with nearby mode summaries and a future map slot", () => {
    const viewModel = presentDashboardSnapshot(
      createDashboardSnapshot({
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
      }),
    );

    expect(viewModel).toEqual({
      placeLabel: "Royal Institution, Albemarle Street",
      overallState: "watchful",
      stateKicker: "Overall departure picture",
      stateHeadline: "Watchful across the Royal Institution threshold",
      weatherSummary: "Cold rain is moving across Mayfair and the street is reading a little slower.",
      mobilitySummary: "Nearby departures are still moving, with a tighter rhythm under the rain.",
      freshnessLabel: "Updated moments ago from the current local snapshot.",
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
      mapPlaceholder: {
        title: "Local frame",
        label: "Royal Institution map frame held for nearby orientation.",
      },
    });
    expect(Object.isFrozen(viewModel)).toBe(true);
    expect(Object.isFrozen(viewModel.nearbyModes)).toBe(true);
  });

  it("keeps presenter copy inside the non-advisory doctrine boundaries", () => {
    const viewModel = presentDashboardSnapshot(
      createDashboardSnapshot({
        overallState: "calm",
        weatherSummary: "A bright, dry spell is keeping the local departure picture easy to read.",
        mobilitySummary: "Nearby movement is settling into an even public rhythm.",
        placeLabel: "Royal Institution, Albemarle Street",
        freshnessLabel: "Fresh enough for a shared foyer read.",
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
});
