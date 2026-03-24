import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";

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
import {
  createFixtureDashboardFallbackSnapshot,
  createFixtureDashboardSnapshot,
} from "../../src/features/dashboard/data/overall-departure-snapshot.js";

const root = resolve(process.cwd());

function buildSnapshot(overrides = {}) {
  return createDashboardSnapshot({
    publishedAt: "2026-03-19T08:00:00.000Z",
    overallState: "watchful",
    overallTrend: "steady",
    weatherSummary: "Rain nearby.",
    weatherTemperatureC: 12,
    mobilitySummary: "Some nearby services are slower than normal.",
    placeLabel: "Royal Institution, Albemarle Street",
    supportLabel: "Transport and weather are live.",
    disruptionEmphasis: {
      level: "local",
      headline: "Bus is disrupted nearby",
      detail: "Bus has the most disruption nearby.",
      affectedModeKeys: ["bus"],
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
      weather: {
        state: "live",
        label: "Live",
        detail: "Weather is live.",
      },
      mobility: {
        state: "carried-forward",
        label: "Carried forward",
        detail: "Movement is showing the last available update.",
      },
    },
    localMap: {
      title: "Local orientation",
      state: "default",
      sourceStatus: {
        state: "live",
        label: "Live",
        detail: "The local orientation is reading live for this foyer.",
      },
      venueAnchor: {
        key: "royal-institution",
        label: "Royal Institution",
        x: 44,
        y: 47,
      },
      nearbyReferences: [
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
      selectedNearbyNodes: [
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
        "Royal Institution, Green Park, and the Piccadilly / St James's Street stop are shown on the local map.",
      localityEmphasis: {
        label: "Royal Institution, Green Park, and the Piccadilly / St James's Street stop are shown on the local map.",
      },
      fallbackCopy: null,
    },
    nearbyModes: [
      {
        key: "tube-rail",
        label: "Tube and rail",
        state: "available",
        disruptionScope: "unaffected-readable",
        summary: "Green Park and Piccadilly services are running normally.",
        nuance: "Station approaches may bunch lightly after talks end.",
        sourceStatus: {
          state: "live",
          label: "Live",
          detail: "Tube and rail is live.",
        },
        trust: createTrustSignal({
          state: "current",
          subject: "Tube and rail",
        }),
      },
      {
        key: "bus",
        label: "Bus",
        state: "caution",
        disruptionScope: "locally-disrupted",
        summary: "Nearby buses are slower than normal.",
        nuance: "Street queues are forming lightly under shelter.",
        sourceStatus: {
          state: "carried-forward",
          label: "Carried forward",
          detail: "Bus is showing the last available update.",
        },
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
    expect(snapshot.disruptionEmphasis.level).toBe("local");
    expect(snapshot.nearbyModes[1].disruptionScope).toBe("locally-disrupted");
    expect(snapshot.headerTrust.weather.state).toBe("current");
    expect(snapshot.headerStatus.mobility.state).toBe("carried-forward");
    expect(snapshot.localMap.sourceStatus.state).toBe("live");
    expect(snapshot.nearbyModes[1].sourceStatus.state).toBe("carried-forward");
    expect(snapshot.nearbyModes[1].trust.state).toBe("delayed");
    expect(Object.isFrozen(snapshot)).toBe(true);
    expect(Object.isFrozen(snapshot.headerTrust)).toBe(true);
    expect(Object.isFrozen(snapshot.disruptionEmphasis.affectedModeKeys)).toBe(true);
    expect(Object.isFrozen(snapshot.nearbyModes)).toBe(true);
  });

  it("backfills disruption defaults for older snapshots that omit the new emphasis fields", () => {
    const snapshot = buildSnapshot({
      disruptionEmphasis: undefined,
      nearbyModes: [
        {
          key: "tube-rail",
          label: "Tube and rail",
          state: "available",
          summary: "Green Park and Piccadilly lines are still reading open nearby.",
          nuance: "Station approaches may bunch lightly after talks end.",
          sourceStatus: {
            state: "live",
            label: "Live",
            detail: "Tube and rail is reading live nearby.",
          },
          trust: createTrustSignal({
            state: "current",
            subject: "Tube and rail",
          }),
        },
        {
          key: "bus",
          label: "Bus",
          state: "disrupted",
          summary: "West End stops are disrupted nearby.",
          nuance: "Street queues are bunching while spacing breaks apart.",
          sourceStatus: {
            state: "live",
            label: "Live",
            detail: "Bus is reading live nearby.",
          },
          trust: createTrustSignal({
            state: "delayed",
            subject: "Bus",
          }),
        },
      ],
    });

    expect(snapshot.disruptionEmphasis).toEqual({
      level: "local",
      headline: "Bus is disrupted nearby",
      detail: "The affected nearby modes are under the most strain while the rest of the picture stays readable.",
      affectedModeKeys: ["bus"],
    });
    expect(snapshot.nearbyModes[0].disruptionScope).toBe("unaffected-readable");
    expect(snapshot.nearbyModes[1].disruptionScope).toBe("locally-disrupted");
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
    expect(viewModel.trendMessage).toBe("Conditions are stable.");
    expect(viewModel.currentnessMessage).toBe("Board refreshes in place.");
    expect(viewModel.weatherTrust.isNarrowed).toBe(false);
    expect(viewModel.mobilityTrust.isNarrowed).toBe(true);
    expect(viewModel.weatherStatus.state).toBe("live");
    expect(viewModel.mobilityStatus.state).toBe("carried-forward");
    expect(viewModel.disruption.level).toBe("local");
    expect(viewModel.disruption.title).toBe("Bus is disrupted nearby");
    expect(viewModel.disruption.affectedModeKeys).toEqual(["bus"]);
    expect(viewModel.nearbyModes[0].trust.isNarrowed).toBe(false);
    expect(viewModel.nearbyModes[0].sourceStatus.state).toBe("live");
    expect(viewModel.nearbyModes[0].disruptionScope).toBe("unaffected-readable");
    expect(viewModel.nearbyModes[0].emphasisLabel).toBe("Running nearby");
    expect(viewModel.nearbyModes[0].summary.split(".").filter(Boolean).length).toBe(1);
    expect(/still reading|from here, now|best option|recommended/i.test(viewModel.nearbyModes[0].summary)).toBe(false);
    expect(viewModel.nearbyModes[0].nuance).toBe(null);
    expect(viewModel.nearbyModes[1].trust.isNarrowed).toBe(true);
    expect(viewModel.nearbyModes[1].sourceStatus.state).toBe("carried-forward");
    expect(viewModel.nearbyModes[1].disruptionScope).toBe("locally-disrupted");
    expect(viewModel.nearbyModes[1].emphasisLabel).toBe("Disrupted nearby");
    expect(viewModel.nearbyModes[1].summary).toMatch(/slower than normal|nearby buses/i);
    expect(/shelter|queues|recommended|take\b/i.test(viewModel.nearbyModes[1].summary)).toBe(false);
    expect(viewModel.nearbyModes[1].nuance).toMatch(/carried forward|read with care/i);
    expect(/west end stops are moving/i.test(viewModel.nearbyModes[1].nuance)).toBe(false);
    expect(viewModel.nearbyModes[1].trust.detail).toBe("Bus is delayed.");
    expect(viewModel.locality.title).toBe("Nearby");
    expect(viewModel.locality.heading).toBe("Nearby stations");
    expect(viewModel.locality.summary).toMatch(/green park|piccadilly/i);
    expect(viewModel.contextTiles).toEqual([
      {
        key: "bus",
        label: "Bus",
        value: "Caution",
        tone: "caution",
      },
      {
        key: "roads",
        label: "Roads",
        value: "Readable",
        tone: "caution",
      },
      {
        key: "weather",
        label: "Weather",
        value: "Rain 12°C",
        tone: "available",
      },
    ]);
    expect(viewModel.locality.references).toEqual([
      {
        key: "green-park-station",
        label: "Green Park",
        kind: "station",
        kindLabel: "Station",
        caption: "Jubilee, Piccadilly, Victoria",
        lineTokens: ["victoria", "jubilee", "piccadilly"],
      },
      {
        key: "piccadilly-stop-r",
        label: "Piccadilly / St James's Street",
        kind: "stop",
        kindLabel: "Stop",
        caption: "Bus stop R",
        lineTokens: ["piccadilly", "bus"],
      },
      {
        key: "albemarle-street",
        label: "Albemarle Street",
        kind: "corridor",
        kindLabel: "Street",
        caption: "Royal Institution frontage",
        lineTokens: ["station"],
      },
    ]);
    expect(/nearby node|recommended|best route|take\b/i.test(viewModel.locality.summary ?? "")).toBe(false);
    expect(viewModel.localMap.title).toBe("Local orientation");
    expect(viewModel.localMap.ariaLabel).toBe("Passive local orientation map anchored to the Royal Institution");
    expect(viewModel.localMap.localityEmphasis).toBe(
      "Royal Institution, Green Park, and the Piccadilly / St James's Street stop are shown on the local map.",
    );
    expect(viewModel.localMap.selectedNearbyNodes.map((node) => node.label)).toEqual([
      "Green Park",
      "Piccadilly / St James's Street",
      "Albemarle Street",
    ]);
    expect(viewModel.localMap.selectedNearbyNodes.map((node) => node.caption)).toEqual(["Station", "Stop", "Street"]);
    expect(viewModel.localMap.sourceStatus.state).toBe("live");
    expect(viewModel.updateSummary).toBe(null);
    expect(viewModel.liveAnnouncement).toBe(null);
  });

  it("backfills locality references from map nodes when explicit panel data is absent", () => {
    const viewModel = presentDashboardSnapshot(
      buildSnapshot({
        localMap: {
          title: "Local orientation",
          state: "fallback",
          sourceStatus: {
            state: "carried-forward",
            label: "Carried forward",
            detail: "Showing the simpler local map.",
          },
          venueAnchor: {
            key: "royal-institution",
            label: "Royal Institution",
            x: 56,
            y: 60,
          },
          nearbyReferences: [],
          selectedNearbyNodes: [
            {
              key: "green-park",
              label: "Green Park",
              x: 64,
              y: 32,
            },
          ],
          orientationSummary: "Green Park is shown on the simplified local map.",
          localityEmphasis: null,
          fallbackCopy: "Simplified local orientation keeps Green Park visible around the Royal Institution.",
        },
      }),
    );

    expect(viewModel.locality.summary).toBe("Green Park is shown on the simplified local map.");
    expect(viewModel.locality.references).toEqual([
      {
        key: "green-park",
        label: "Green Park",
        kind: "place",
        kindLabel: "Nearby place",
        caption: "Shown on the local frame",
        lineTokens: ["station"],
      },
    ]);
    expect(viewModel.localMap.localityEmphasis).toBe("Green Park is shown on the simplified local map.");
    expect(viewModel.localMap.fallbackCopy).toBe(
      "Simplified local orientation keeps Green Park visible around the Royal Institution.",
    );
  });

  it("keeps the live weather cue alongside temperature for dry conditions", () => {
    const viewModel = presentDashboardSnapshot(
      buildSnapshot({
        weatherSummary: "Dry nearby.",
        weatherTemperatureC: 11,
        headerStatus: {
          weather: {
            state: "live",
            label: "Live",
            detail: "Weather is live.",
          },
          mobility: {
            state: "live",
            label: "Live",
            detail: "Movement is live.",
          },
        },
      }),
    );

    expect(viewModel.contextTiles.find((tile) => tile.key === "weather")).toEqual({
      key: "weather",
      label: "Weather",
      value: "Dry 11°C",
      tone: "available",
    });
  });

  it("keeps fallback locality narrower than the live map while preserving the same anchor seam", () => {
    const liveViewModel = presentDashboardSnapshot(createFixtureDashboardSnapshot());
    const fallbackViewModel = presentDashboardSnapshot(createFixtureDashboardFallbackSnapshot());

    expect(liveViewModel.locality.references.map((reference) => reference.label)).toEqual([
      "Green Park",
      "Piccadilly / St James's Street",
      "Albemarle Street",
    ]);
    expect(fallbackViewModel.locality.references.map((reference) => reference.label)).toEqual([
      "Green Park",
      "Piccadilly / St James's Street",
    ]);
    expect(fallbackViewModel.localMap.selectedNearbyNodes.map((node) => node.label)).toEqual([
      "Green Park",
      "Piccadilly / St James's Street",
    ]);
    expect(fallbackViewModel.localMap.fallbackCopy).toMatch(/Royal Institution/);
  });

  it("locks nearby rows to compact fact-only board copy and local narrowed-confidence cues", () => {
    const viewModel = presentDashboardSnapshot(
      buildSnapshot({
        disruptionEmphasis: {
          level: "none",
          headline: null,
          detail: null,
          affectedModeKeys: [],
        },
        nearbyModes: [
          {
            key: "roads",
            label: "Roads",
            state: "caution",
            disruptionScope: "unaffected-readable",
            summary: "Mayfair traffic is still flowing, with slower turns around the wetter junctions.",
            nuance: "Street crossings remain readable, but the pace is not especially brisk.",
            sourceStatus: {
              state: "carried-forward",
              label: "Carried forward",
              detail: "Roads are showing the last available update.",
            },
            trust: createTrustSignal({
              state: "stale",
              subject: "Roads",
            }),
          },
        ],
      }),
    );

    expect(viewModel.nearbyModeHeading).toBe("Nearby modes");
    expect(viewModel.nearbyModeIntro).toBe("Use these rows to check each nearby mode.");
    expect(viewModel.nearbyModes[0].summary.split(".").filter(Boolean).length).toBe(1);
    expect(viewModel.nearbyModes[0].summary).toMatch(/mayfair traffic|wetter junctions/i);
    expect(/still flowing|not especially brisk|recommended|switch to|take\b/i.test(viewModel.nearbyModes[0].summary)).toBe(false);
    expect(viewModel.nearbyModes[0].nuance).toMatch(/carried forward|read with care/i);
    expect(/mayfair traffic|street crossings remain readable/i.test(viewModel.nearbyModes[0].nuance)).toBe(false);
    expect(viewModel.nearbyModes[0].changeSummary).toBe(null);
  });

  it("keeps restart messaging only while recovery is still active", () => {
    const recoveringView = presentDashboardSnapshot(buildSnapshot(), {
      recovery: {
        phase: "recovering",
        recoveredAt: "2026-03-19T08:05:00.000Z",
        recoverySource: "stored-snapshot",
        livePublicationResumed: false,
        resumedAt: null,
      },
    });
    const resumedView = presentDashboardSnapshot(buildSnapshot(), {
      recovery: {
        phase: "live",
        recoveredAt: "2026-03-19T08:05:00.000Z",
        recoverySource: "live-publish",
        livePublicationResumed: true,
        resumedAt: "2026-03-19T08:12:00.000Z",
      },
    });

    expect(recoveringView.currentnessMessage).toBe(
      "Board is recovering. Last safe data is on screen.",
    );
    expect(resumedView.currentnessMessage).toBe("Board refreshes in place.");
  });

  it("keeps nearby modes in canonical order and derives calm text-first update cues", () => {
    const previousSnapshot = buildSnapshot({
      publishedAt: "2026-03-19T08:00:00.000Z",
      overallTrend: "steady",
      nearbyModes: [
        {
          key: "bus",
          label: "Bus",
          state: "available",
          disruptionScope: "unaffected-readable",
          summary: "Nearby buses are running normally.",
          nuance: "Street queues remain light.",
          sourceStatus: {
            state: "live",
            label: "Live",
            detail: "Bus is live.",
          },
          trust: createTrustSignal({
            state: "current",
            subject: "Bus",
          }),
        },
        {
          key: "tube-rail",
          label: "Tube and rail",
          state: "available",
          disruptionScope: "unaffected-readable",
          summary: "Green Park and Piccadilly services are running normally.",
          nuance: "Station approaches remain readable.",
          sourceStatus: {
            state: "live",
            label: "Live",
            detail: "Tube and rail is live.",
          },
          trust: createTrustSignal({
            state: "current",
            subject: "Tube and rail",
          }),
        },
      ],
    });
    const nextSnapshot = buildSnapshot({
      publishedAt: "2026-03-19T08:30:00.000Z",
      overallTrend: "worsening",
      headerTrust: {
        weather: createTrustSignal({
          state: "current",
          subject: "Weather",
        }),
        mobility: createTrustSignal({
          state: "delayed",
          subject: "Movement",
        }),
      },
      localMap: {
        title: "Local orientation",
        state: "fallback",
        sourceStatus: {
          state: "carried-forward",
          label: "Carried forward",
          detail: "Showing the simpler local map.",
        },
        venueAnchor: {
          key: "royal-institution",
          label: "Royal Institution",
          x: 44,
          y: 47,
        },
        nearbyReferences: [],
        selectedNearbyNodes: [
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
        ],
        orientationSummary: "Simplified local orientation keeps the Royal Institution, Green Park, and the Piccadilly / St James's Street stop visible.",
        localityEmphasis: {
          label: "Simplified local orientation keeps the Royal Institution, Green Park, and the Piccadilly / St James's Street stop visible.",
        },
        fallbackCopy: "Simplified local orientation keeps the Royal Institution, Green Park, and the Piccadilly / St James's Street stop visible.",
      },
      nearbyModes: [
        {
          key: "bus",
          label: "Bus",
          state: "caution",
          disruptionScope: "locally-disrupted",
          summary: "Nearby buses are slower than normal.",
          nuance: "Street queues are forming lightly under shelter.",
          sourceStatus: {
            state: "carried-forward",
            label: "Carried forward",
            detail: "Bus is showing the last available update.",
          },
          trust: createTrustSignal({
            state: "delayed",
            subject: "Bus",
          }),
        },
        {
          key: "tube-rail",
          label: "Tube and rail",
          state: "available",
          disruptionScope: "unaffected-readable",
          summary: "Green Park and Piccadilly services are running normally.",
          nuance: "Station approaches may bunch lightly after talks end.",
          sourceStatus: {
            state: "live",
            label: "Live",
            detail: "Tube and rail is live.",
          },
          trust: createTrustSignal({
            state: "current",
            subject: "Tube and rail",
          }),
        },
      ],
    });

    const viewModel = presentDashboardSnapshot(nextSnapshot, { previousSnapshot });

    expect(viewModel.nearbyModes.map((mode) => mode.key)).toEqual(["tube-rail", "bus"]);
    expect(viewModel.currentnessMessage).toBe("Data refreshed in place.");
    expect(viewModel.updateSummary).toEqual({
      label: "Latest change",
      detail: "Conditions are getting worse. Movement is delayed.",
    });
    expect(viewModel.liveAnnouncement).toBe(
      "Live update. Movement is delayed. Showing the simpler local map.",
    );
    expect(viewModel.nearbyModes[1].changeSummary).toBe(
      "Bus now reads caution. Bus is now reading disrupted within the nearby picture.",
    );
    expect(viewModel.localMap.changeSummary).toBe(
      "Showing the simpler local map.",
    );
  });

  it("keeps later live updates tied to real snapshot deltas instead of repeating current-state summaries", () => {
    const initialSnapshot = buildSnapshot({
      publishedAt: "2026-03-19T08:00:00.000Z",
      overallTrend: "steady",
    });
    const firstUpdatedSnapshot = buildSnapshot({
      publishedAt: "2026-03-19T08:30:00.000Z",
      overallTrend: "worsening",
      headerTrust: {
        weather: createTrustSignal({
          state: "current",
          subject: "Weather",
        }),
        mobility: createTrustSignal({
          state: "delayed",
          subject: "Movement",
        }),
      },
    });
    const secondUpdatedSnapshot = buildSnapshot({
      publishedAt: "2026-03-19T08:45:00.000Z",
      overallTrend: "worsening",
      headerTrust: {
        weather: createTrustSignal({
          state: "current",
          subject: "Weather",
        }),
        mobility: createTrustSignal({
          state: "delayed",
          subject: "Movement",
        }),
      },
    });

    const firstUpdateViewModel = presentDashboardSnapshot(firstUpdatedSnapshot, {
      previousSnapshot: initialSnapshot,
      hasUpdatedSinceLoad: true,
    });
    const secondUpdateViewModel = presentDashboardSnapshot(secondUpdatedSnapshot, {
      previousSnapshot: firstUpdatedSnapshot,
      hasUpdatedSinceLoad: true,
    });

    expect(firstUpdateViewModel.updateSummary).toEqual({
      label: "Latest change",
      detail: "Conditions are getting worse. Movement is delayed.",
    });
    expect(secondUpdateViewModel.updateSummary).toBe(null);
    expect(secondUpdateViewModel.liveAnnouncement).toBe(null);
    expect(secondUpdateViewModel.currentnessMessage).toBe("Data refreshed in place.");
  });

  it("keeps board-facing copy concise enough for nearby-reference comprehension instead of explanatory prose", () => {
    const viewModel = presentDashboardSnapshot(buildSnapshot());
    const serialisedView = JSON.stringify(viewModel);

    expect(viewModel.currentnessMessage.split(" ").length <= 10).toBe(true);
    expect(viewModel.nearbyModes[0].summary.split(" ").length <= 10).toBe(true);
    expect(viewModel.nearbyModes[1].summary.split(" ").length <= 16).toBe(true);
    expect((viewModel.locality.summary?.split(" ").length ?? 0) <= 24).toBe(true);
    expect((viewModel.localMap.localityEmphasis?.split(" ").length ?? 0) <= 24).toBe(true);
    expect(viewModel.locality.references.map((reference) => reference.label)).toEqual([
      "Green Park",
      "Piccadilly / St James's Street",
      "Albemarle Street",
    ]);
    expect(/recommended|best option|switch to|take\b|you should|from here, now/i.test(serialisedView)).toBe(false);
    expect(/still reading|weather and movement reinforce the same local read/i.test(serialisedView)).toBe(false);
  });

  it("surfaces nearby recovery text when a disrupted mode becomes readable again", () => {
    const previousSnapshot = buildSnapshot({
      publishedAt: "2026-03-19T08:00:00.000Z",
      nearbyModes: [
        {
          key: "bus",
          label: "Bus",
          state: "caution",
          disruptionScope: "locally-disrupted",
          summary: "Nearby buses are slower than normal.",
          nuance: "Shelter queues are still bunching lightly.",
          sourceStatus: {
            state: "carried-forward",
            label: "Carried forward",
            detail: "Bus is showing the last available update.",
          },
          trust: createTrustSignal({
            state: "delayed",
            subject: "Bus",
          }),
        },
        {
          key: "tube-rail",
          label: "Tube and rail",
          state: "available",
          disruptionScope: "unaffected-readable",
          summary: "Green Park and Piccadilly services are running normally.",
          nuance: "Station approaches remain readable.",
          sourceStatus: {
            state: "live",
            label: "Live",
            detail: "Tube and rail is live.",
          },
          trust: createTrustSignal({
            state: "current",
            subject: "Tube and rail",
          }),
        },
      ],
    });
    const nextSnapshot = buildSnapshot({
      publishedAt: "2026-03-19T08:30:00.000Z",
      nearbyModes: [
        {
          key: "bus",
          label: "Bus",
          state: "available",
          disruptionScope: "unaffected-readable",
          summary: "Nearby buses are running normally.",
          nuance: "Street queues have eased back into a readable rhythm.",
          sourceStatus: {
            state: "live",
            label: "Live",
            detail: "Bus is live.",
          },
          trust: createTrustSignal({
            state: "current",
            subject: "Bus",
          }),
        },
        {
          key: "tube-rail",
          label: "Tube and rail",
          state: "available",
          disruptionScope: "unaffected-readable",
          summary: "Green Park and Piccadilly services are running normally.",
          nuance: "Station approaches remain readable.",
          sourceStatus: {
            state: "live",
            label: "Live",
            detail: "Tube and rail is live.",
          },
          trust: createTrustSignal({
            state: "current",
            subject: "Tube and rail",
          }),
        },
      ],
    });

    const viewModel = presentDashboardSnapshot(nextSnapshot, { previousSnapshot });

    expect(viewModel.nearbyModes.find((mode) => mode.key === "bus")?.changeSummary).toBe(
      "Bus now reads available. Bus returns to a readable nearby state.",
    );
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
    expect(viewModel.currentnessMessage).toBe("Board refreshes in place.");
  });

  it("elevates overall disruption without switching to advisory or takeover language", () => {
    const viewModel = presentDashboardSnapshot(
      buildSnapshot({
        overallState: "disrupted",
        disruptionEmphasis: {
          level: "overall",
          headline: "Disrupted across the Royal Institution threshold",
          detail: "Tube and bus are under visible strain across the nearby departure picture.",
          affectedModeKeys: ["tube-rail", "bus"],
        },
        nearbyModes: [
          {
            key: "tube-rail",
            label: "Tube and rail",
            state: "disrupted",
            disruptionScope: "overall-disrupted",
            summary: "Tube and rail are disrupted nearby.",
            nuance: "Platforms and approaches are reading under visible strain.",
            trust: createTrustSignal({
              state: "current",
              subject: "Tube and rail",
            }),
          },
          {
            key: "bus",
            label: "Bus",
            state: "disrupted",
            disruptionScope: "overall-disrupted",
            summary: "Bus is disrupted nearby.",
            nuance: "Street spacing is breaking apart around the local stops.",
            trust: createTrustSignal({
              state: "current",
              subject: "Bus",
            }),
          },
        ],
      }),
    );

    expect(viewModel.disruption.level).toBe("overall");
    expect(viewModel.disruption.label).toBe("Serious disruption");
    expect(viewModel.disruption.title).toBe("Disrupted across the Royal Institution threshold");
    expect(viewModel.disruption.detail).toBe("Tube and bus are under visible strain across the nearby departure picture.");
    expect(viewModel.nearbyModes.every((mode) => mode.disruptionScope === "overall-disrupted")).toBe(true);
    expect(viewModel.nearbyModes.every((mode) => mode.emphasisLabel === "Wider disruption")).toBe(true);
    expect(/best option|recommended|switch to|take buses instead|reroute now/i.test(viewModel.disruption.title)).toBe(false);
    expect(/warning banner|control room|ops console/i.test(viewModel.disruption.detail)).toBe(false);
  });

  it("keeps the presenter semantics wired into the real public screen components", () => {
    const viewModel = presentDashboardSnapshot(buildSnapshot());
    const screenSource = readFileSync(
      join(root, "src", "features", "dashboard", "components", "DashboardScreen.tsx"),
      "utf8",
    );
    const localityPanelSource = readFileSync(
      join(root, "src", "features", "dashboard", "components", "LocalityReferencePanel.tsx"),
      "utf8",
    );
    const headerSource = readFileSync(
      join(root, "src", "features", "dashboard", "components", "AtmosphericHeader.tsx"),
      "utf8",
    );
    const modeCardSource = readFileSync(
      join(root, "src", "features", "dashboard", "components", "ModeSummaryCard.tsx"),
      "utf8",
    );
    const localMapSource = readFileSync(
      join(root, "src", "features", "dashboard", "components", "LocalMapFrame.tsx"),
      "utf8",
    );
    const publicSources = [screenSource, headerSource, modeCardSource].join("\n");

    expect(viewModel.disruption.title).toBe("Bus is disrupted nearby");
    expect(viewModel.nearbyModes[0].emphasisLabel).toBe("Running nearby");
    expect(viewModel.nearbyModes[1].emphasisLabel).toBe("Disrupted nearby");
    expect(screenSource).toMatch(/<AtmosphericHeader viewModel=\{viewModel\} \/>/);
    expect(screenSource).toMatch(/<ModeSummaryGrid viewModel=\{viewModel\} \/>/);
    expect(screenSource).toMatch(/<LocalityReferencePanel viewModel=\{viewModel\.locality\} \/>/);
    expect(screenSource).toMatch(/<LocalMapFrame viewModel=\{viewModel\.localMap\} \/>/);
    expect(screenSource).toMatch(/viewModel\.contextTiles\.map/);
    expect(/weatherBoardCue|busMode|roadsMode/.test(screenSource)).toBe(false);
    expect(screenSource).toMatch(/dashboard-masthead/);
    expect(screenSource).toMatch(/dashboard-lower-grid__modes/);
    expect(screenSource).toMatch(/dashboard-lower-grid__locality/);
    expect(screenSource).toMatch(/dashboard-lower-grid__map/);
    expect(localityPanelSource).toMatch(/viewModel\.references/);
    expect(localityPanelSource).toMatch(/\{viewModel\.heading\}/);
    expect(localityPanelSource).toMatch(/reference\.lineTokens\.map/);
    expect(localityPanelSource).toMatch(/locality-reference-panel__list/);
    expect(headerSource).toMatch(/viewModel\.disruption\.hasSeriousDisruption/);
    expect(headerSource).toMatch(/viewModel\.disruption\.title/);
    expect(headerSource).toMatch(/viewModel\.disruption\.detail/);
    expect(headerSource).toMatch(/getPublicStatus/);
    expect(headerSource).toMatch(/signal-card/);
    expect(modeCardSource).toMatch(/mode\.isDisrupted/);
    expect(modeCardSource).toMatch(/mode\.emphasisLabel/);
    expect(modeCardSource).toMatch(/mode\.trust\.isNarrowed/);
    expect(modeCardSource).toMatch(/mode-summary-card__status-rag/);
    expect(modeCardSource).toMatch(/mode-summary-card__meta-chip/);
    expect(headerSource).toMatch(/viewModel\.weatherStatus/);
    expect(headerSource).toMatch(/viewModel\.mobilityStatus/);
    expect(modeCardSource).toMatch(/mode\.sourceStatus/);
    expect(localMapSource).toMatch(/local-map-panel__marker-layer/);
    expect(localMapSource).toMatch(/local-map-panel__district-label/);
    expect(localMapSource).toMatch(/local-map-panel__venue-pill/);
    expect(localMapSource).toMatch(/local-map-panel__overlay-card/);
    expect(localMapSource).toMatch(/Passive local orientation map anchored to the Royal Institution/);
    expect(localMapSource).toMatch(/viewModel\.selectedNearbyNodes\.map/);
    expect(localMapSource).toMatch(/viewModel\.venueAnchor\.label/);
    expect(/local-map-panel__corridor/.test(localMapSource)).toBe(false);
    expect(
      /warning banner|alert overlay|control room|ops console|Route Planner|best option|recommended|switch to|take buses instead|reroute now/i.test(
        publicSources,
      ),
    ).toBe(false);
  });

  it("keeps provider failure calm, local, and unavailable without inventing disruption", () => {
    const viewModel = presentDashboardSnapshot(
      buildSnapshot({
        disruptionEmphasis: {
          level: "none",
          headline: null,
          detail: null,
          affectedModeKeys: [],
        },
        headerStatus: {
          weather: {
            state: "unavailable",
            label: "Unavailable",
            detail: "Weather data is unavailable.",
          },
          mobility: {
            state: "live",
            label: "Live",
            detail: "Movement is live.",
          },
        },
        headerTrust: {
          weather: createTrustSignal({
            state: "unavailable",
            detail: "Weather data is unavailable.",
          }),
          mobility: createTrustSignal({
            state: "current",
            subject: "Movement",
          }),
        },
        localMap: {
          title: "Local orientation",
          state: "fallback",
          sourceStatus: {
            state: "unavailable",
            label: "Unavailable",
            detail: "Showing the simpler local map.",
          },
          venueAnchor: {
            key: "royal-institution",
            label: "Royal Institution",
            x: 44,
            y: 47,
          },
          nearbyReferences: [],
          selectedNearbyNodes: [
            {
              key: "green-park",
              label: "Green Park",
              x: 54,
              y: 30,
            },
          ],
          orientationSummary: "Simplified local orientation keeps the Royal Institution and Green Park visible.",
          localityEmphasis: null,
          fallbackCopy: "Simplified local orientation keeps the Royal Institution and Green Park visible.",
        },
        nearbyModes: [
          {
            key: "tube-rail",
            label: "Tube and rail",
            state: "available",
            disruptionScope: "unaffected-readable",
            summary: "Tube and rail are running normally.",
            nuance: "Station approaches remain clear enough to read.",
            sourceStatus: {
              state: "live",
              label: "Live",
              detail: "Tube and rail is live.",
            },
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
            summary: "Bus data is unavailable.",
            nuance: "Other nearby data is still shown.",
            sourceStatus: {
              state: "unavailable",
              label: "Unavailable",
              detail: "Bus data is unavailable.",
            },
            trust: createTrustSignal({
              state: "unavailable",
              detail: "Bus data is unavailable.",
            }),
          },
        ],
      }),
    );

    expect(viewModel.disruption.hasSeriousDisruption).toBe(false);
    expect(viewModel.weatherStatus.state).toBe("unavailable");
    expect(viewModel.localMap.sourceStatus.state).toBe("unavailable");
    expect(viewModel.nearbyModes[1].sourceStatus.state).toBe("unavailable");
    expect(viewModel.nearbyModes[1].trust.detail).toBe("Bus data is unavailable.");
    expect(/api|http|timeout|retry|provider|weatherapi|tfl/i.test(JSON.stringify(viewModel))).toBe(false);
  });
});
