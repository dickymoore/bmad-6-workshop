import { describe, expect, it } from "vitest";

import {
  DASHBOARD_ADVISORY_LANGUAGE_PATTERN,
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
    });

    expect(snapshot).toEqual({
      overallState: "watchful",
      weatherSummary: "Rain is slowing the street slightly around Albemarle Street.",
      mobilitySummary: "Nearby departures are still moving with a little more caution than usual.",
      placeLabel: "Royal Institution, Albemarle Street",
      freshnessLabel: "Updated moments ago for the public foyer display.",
      supportLabel: "Weather and mobility are telling the same local story.",
    });
    expect(Object.isFrozen(snapshot)).toBe(true);
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
      });
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError?.message).toMatch(/must stay fact-only/);
    expect(DASHBOARD_ADVISORY_LANGUAGE_PATTERN.test("recommended")).toBe(true);
  });
});

describe("dashboard presenter", () => {
  it("turns the snapshot into a room-scale atmospheric header without advice", () => {
    const viewModel = presentDashboardSnapshot(
      createDashboardSnapshot({
        overallState: "watchful",
        weatherSummary: "Cold rain is moving across Mayfair and the street is reading a little slower.",
        mobilitySummary: "Nearby departures are still moving, with a tighter rhythm under the rain.",
        placeLabel: "Royal Institution, Albemarle Street",
        freshnessLabel: "Updated moments ago from the current local snapshot.",
        supportLabel: "Weather and mobility reinforce the same local read.",
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
      reservedSections: [
        { title: "Nearby modes", variant: "summary" },
        { title: "Local frame", variant: "map" },
      ],
    });
    expect(Object.isFrozen(viewModel)).toBe(true);
    expect(Object.isFrozen(viewModel.reservedSections)).toBe(true);
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
      }),
    );

    const copy = JSON.stringify(viewModel);

    expect(/best option|recommended|switch to|take\b/i.test(copy)).toBe(false);
  });

  it("keeps metadata aligned with the overall departure picture", () => {
    expect(getDashboardMetadata()).toEqual({
      title: "Albemarle Pulse | Royal Institution departures",
      description: "Overall departure picture for the Royal Institution foyer.",
    });
  });
});
