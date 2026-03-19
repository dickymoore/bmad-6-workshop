import { describe, expect, it } from "vitest";

import { createFixtureDashboardSnapshot } from "../../src/features/dashboard/data/overall-departure-snapshot.js";
import { createDashboardApiResponse } from "../../src/lib/contracts/api-response.js";
import {
  createOpsHealthPayload,
  getOpsHealthPayload,
} from "../../src/lib/server/ops/get-ops-health.js";
import { createDegradedImpactDiagnostics } from "../../src/lib/server/ops/get-degraded-impact-diagnostics.js";
import { createOpsHealthRouteResponse } from "../../src/lib/server/ops/create-ops-health-route-response.js";

function createCurrentSnapshot(snapshotOverrides = {}) {
  const fixture = createFixtureDashboardSnapshot({
    publishedAt: "2026-03-19T08:00:00.000Z",
  });

  return {
    ...fixture,
    headerTrust: {
      weather: {
        state: "current",
        label: "Current",
        detail: "Weather is current for the foyer.",
        confidence: "full",
      },
      mobility: {
        state: "current",
        label: "Current",
        detail: "Movement is current for the foyer.",
        confidence: "full",
      },
    },
    headerStatus: {
      weather: {
        state: "live",
        label: "Live",
        detail: "Weather is reading live for the foyer.",
      },
      mobility: {
        state: "live",
        label: "Live",
        detail: "Movement is reading live for the foyer.",
      },
    },
    localMap: {
      ...fixture.localMap,
      state: "default",
      sourceStatus: {
        state: "live",
        label: "Live",
        detail: "The local frame is reading live for this foyer.",
      },
      fallbackCopy: null,
    },
    nearbyModes: fixture.nearbyModes.map((mode) => ({
      ...mode,
      sourceStatus: {
        state: "live",
        label: "Live",
        detail: `${mode.label} is reading live nearby.`,
      },
      trust: {
        state: "current",
        label: "Current",
        detail: `${mode.label} is current for the foyer.`,
        confidence: "full",
      },
    })),
    ...snapshotOverrides,
  };
}

function createDashboardResponse(snapshotOverrides = {}, metaOverrides = {}) {
  const snapshot = createCurrentSnapshot(snapshotOverrides);

  return createDashboardApiResponse(snapshot, {
    venueKey: "royal-institution",
    publishedAt: snapshot.publishedAt,
    refreshIntervalMs: 30_000,
    snapshotState: "live",
    recovery: {
      phase: "live",
      recoveredAt: null,
      recoverySource: "live-publish",
      livePublicationResumed: true,
      resumedAt: null,
    },
    ...metaOverrides,
  });
}

function createDiagnostics(snapshotOverrides = {}, metaOverrides = {}) {
  return createDegradedImpactDiagnostics({
    dashboardResponse: createDashboardResponse(snapshotOverrides, metaOverrides),
  });
}

describe("ops health payload", () => {
  it("classifies live public-ready snapshots as current", () => {
    const payload = createOpsHealthPayload({
      dashboardResponse: createDashboardResponse(),
    });

    expect(payload.readiness.state).toBe("current");
    expect(payload.readiness.summary).toBe("Public display is current and ready for service.");
    expect(payload.checks.every((check) => check.status === "pass")).toBe(true);
    expect(payload.issues).toEqual([]);
  });

  it("classifies last-safe or narrowed evidence as reduced-confidence", () => {
    const payload = createOpsHealthPayload({
      dashboardResponse: createDashboardResponse(
        {
          headerStatus: {
            weather: {
              state: "carried-forward",
              label: "Carried forward",
              detail: "Weather is carried forward while live weather detail narrows.",
            },
            mobility: {
              state: "live",
              label: "Live",
              detail: "Movement is reading live for the foyer.",
            },
          },
          headerTrust: {
            weather: {
              state: "reduced-confidence",
              label: "Reduced confidence",
              detail: "Weather is carried forward while live weather detail narrows.",
              confidence: "narrowed",
            },
            mobility: {
              state: "aging",
              label: "Aging",
              detail: "Movement is aging slightly.",
              confidence: "narrowed",
            },
          },
        },
        {
          snapshotState: "last-safe",
        },
      ),
    });

    expect(payload.readiness.state).toBe("reduced-confidence");
    expect(payload.readiness.summary).toBe("Public display stays readable with reduced confidence.");
    expect(payload.issues).toContain("Weather is carried forward while live weather detail narrows.");
  });

  it("treats aging trust evidence as reduced-confidence before the display is fully stale", () => {
    const payload = createOpsHealthPayload({
      dashboardResponse: createDashboardResponse({
        headerTrust: {
          weather: {
            state: "aging",
            label: "Aging",
            detail: "Weather is aging slightly.",
            confidence: "narrowed",
          },
          mobility: {
            state: "current",
            label: "Current",
            detail: "Movement is current for the foyer.",
            confidence: "full",
          },
        },
      }),
    });

    expect(payload.readiness.state).toBe("reduced-confidence");
    expect(payload.issues).toContain("Weather is aging slightly.");
  });

  it("classifies fallback or missing public checks as unavailable", () => {
    const payload = createOpsHealthPayload({
      dashboardResponse: {
        data: {
          overallState: "watchful",
          weatherSummary: "Weather remains readable.",
          mobilitySummary: "Movement remains readable.",
          supportLabel: "Weather and movement still reinforce the same local read.",
          localMap: {
            title: "Local frame",
            sourceStatus: {
              state: "live",
              label: "Live",
              detail: "The local frame is reading live for this foyer.",
            },
          },
          nearbyModes: [],
        },
        meta: {
          snapshotState: "fallback",
          publishedAt: "2026-03-19T08:00:00.000Z",
        },
      },
    });

    expect(payload.readiness.state).toBe("unavailable");
    expect(payload.readiness.summary).toBe("Public display is unavailable for normal public trust.");
    expect(payload.checks.find((check) => check.id === "main-layout")?.status).toBe("attention");
    expect(payload.issues).toContain("The main public layout is incomplete in this read.");
  });

  it("strips raw provider failures from operator-facing issues", async () => {
    const payload = await getOpsHealthPayload({
      getDashboardResponse: async () => {
        throw new Error("TfL token secret stack trace");
      },
    });

    expect(payload.readiness.state).toBe("unavailable");
    expect(payload.issues).toEqual(["Live readiness could not be confirmed from this local surface."]);
  });
});

describe("ops health route", () => {
  it("stays local-only and fails closed for non-local hosts", async () => {
    const response = await createOpsHealthRouteResponse({
      requestHeaders: new Headers([["host", "example.com"]]),
    });

    expect(response.status).toBe(404);
    expect(await response.text()).toBe("");
  });

  it("returns a calm same-origin JSON contract for allowed local reads", async () => {
    const response = await createOpsHealthRouteResponse({
      requestHeaders: new Headers([["host", "localhost:3000"]]),
      getOpsHealth: async () => ({
        readiness: {
          state: "current",
          label: "Current",
          summary: "Public display is current and ready for service.",
        },
        checks: [
          {
            id: "main-layout",
            label: "Main layout is present",
            status: "pass",
            detail: "The main public layout is visible.",
          },
        ],
        issues: [],
        diagnostics: {
          summary: "No degraded areas are narrowing the public picture.",
          affectedAreas: [],
          healthyAreas: ["Weather remains healthy."],
        },
        evidence: {
          snapshotState: "live",
          publishedAt: "2026-03-19T08:00:00.000Z",
          recovery: {
            phase: "live",
            label: "Fresh live detail",
            summary: "Fresh live detail has resumed in the shared public view.",
            recoveredAt: null,
            recoverySource: "live-publish",
            livePublicationResumed: true,
            resumedAt: null,
          },
        },
      }),
    });

    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("no-store, max-age=0");
    expect(response.headers.get("Vary")).toBe("host, x-forwarded-host, forwarded");

    const payload = await response.json();

    expect(payload.readiness.state).toBe("current");
    expect(payload.checks.length).toBe(1);
    expect(payload.diagnostics).toEqual({
      summary: "No degraded areas are narrowing the public picture.",
      affectedAreas: [],
      healthyAreas: ["Weather remains healthy."],
    });
    expect(/TfL|WeatherAPI|stack|token|secret/i.test(JSON.stringify(payload))).toBe(false);
  });
});

describe("restart recovery evidence", () => {
  it("exposes carried-forward restart recovery only through the ops payload", () => {
    const payload = createOpsHealthPayload({
      dashboardResponse: createDashboardResponse(
        {
          headerStatus: {
            weather: {
              state: "carried-forward",
              label: "Carried forward",
              detail: "Weather is carried forward while live weather detail narrows.",
            },
            mobility: {
              state: "carried-forward",
              label: "Carried forward",
              detail: "Movement is carried forward while live movement detail narrows.",
            },
          },
        },
        {
          snapshotState: "last-safe",
          recovery: {
            phase: "recovering",
            recoveredAt: "2026-03-19T08:35:00.000Z",
            recoverySource: "stored-snapshot",
            livePublicationResumed: false,
            resumedAt: null,
          },
        },
      ),
    });

    expect(payload.evidence.recovery).toEqual({
      phase: "recovering",
      label: "Restart recovery",
      summary: "The public view is recovering from restart with carried-forward detail.",
      recoveredAt: "2026-03-19T08:35:00.000Z",
      recoverySource: "stored-snapshot",
      livePublicationResumed: false,
      resumedAt: null,
    });
    expect(/stack|token|secret|process id|pid/i.test(JSON.stringify(payload.evidence.recovery))).toBe(false);
  });
});

describe("degraded impact diagnostics", () => {
  it("classifies a single narrowed signal as local-only impact and lists healthy areas", () => {
    const diagnostics = createDiagnostics({
      headerStatus: {
        weather: {
          state: "carried-forward",
          label: "Carried forward",
          detail: "Weather is carried forward while live weather detail narrows.",
        },
        mobility: {
          state: "live",
          label: "Live",
          detail: "Movement is reading live for the foyer.",
        },
      },
      headerTrust: {
        weather: {
          state: "reduced-confidence",
          label: "Reduced confidence",
          detail: "Weather is carried forward while live weather detail narrows.",
          confidence: "narrowed",
        },
        mobility: {
          state: "current",
          label: "Current",
          detail: "Movement is current for the foyer.",
          confidence: "full",
        },
      },
    });

    expect(diagnostics.summary).toBe("1 degraded area is narrowing the public picture.");
    expect(diagnostics.affectedAreas.length).toBe(1);
    expect(diagnostics.affectedAreas[0].areaLabel).toBe("Weather");
    expect(diagnostics.affectedAreas[0].impactScope).toBe("Local-only impact");
    expect(diagnostics.affectedAreas[0].signals.map((signal) => signal.label)).toEqual([
      "Weather source",
      "Weather trust",
    ]);
    expect(diagnostics.healthyAreas).toContain("Movement remains healthy.");
    expect(diagnostics.healthyAreas).toContain("The local frame remains healthy.");
  });

  it("classifies several narrowed local signals as multiple-local-signals impact", () => {
    const diagnostics = createDiagnostics({
      nearbyModes: createCurrentSnapshot().nearbyModes.map((mode) => {
        if (mode.key === "bus") {
          return {
            ...mode,
            disruptionScope: "locally-disrupted",
            sourceStatus: {
              state: "carried-forward",
              label: "Carried forward",
              detail: "Bus is carried forward while live detail narrows.",
            },
            trust: {
              state: "reduced-confidence",
              label: "Reduced confidence",
              detail: "Bus is less certain just now.",
              confidence: "narrowed",
            },
          };
        }

        if (mode.key === "roads") {
          return {
            ...mode,
            disruptionScope: "locally-disrupted",
            sourceStatus: {
              state: "unavailable",
              label: "Unavailable",
              detail: "Roads are temporarily unavailable for the foyer.",
            },
            trust: {
              state: "unavailable",
              label: "Unavailable",
              detail: "Roads are temporarily unavailable.",
              confidence: "narrowed",
            },
          };
        }

        return mode;
      }),
    });

    expect(diagnostics.affectedAreas.length).toBe(2);
    expect([...new Set(diagnostics.affectedAreas.map((area) => area.impactScope))]).toEqual([
      "Multiple-local-signals impact",
    ]);
    expect(diagnostics.healthyAreas).toContain("Tube and rail remain healthy nearby.");
  });

  it("shows optional-feed failures while preserving healthy core evidence", () => {
    const diagnostics = createDiagnostics({
      nearbyModes: createCurrentSnapshot().nearbyModes.map((mode) =>
        mode.key === "cycles-scooters"
          ? {
              ...mode,
              sourceStatus: {
                state: "unavailable",
                label: "Unavailable",
                detail: "Cycles and scooters are temporarily unavailable for the foyer.",
              },
              trust: {
                state: "unavailable",
                label: "Unavailable",
                detail: "Cycles and scooters are temporarily unavailable.",
                confidence: "narrowed",
              },
            }
          : mode,
      ),
    });

    expect(diagnostics.affectedAreas.length).toBe(1);
    expect(diagnostics.affectedAreas[0].areaLabel).toBe("Cycles and scooters");
    expect(diagnostics.healthyAreas).toContain("Weather remains healthy.");
    expect(diagnostics.healthyAreas).toContain("Tube and rail remain healthy nearby.");
  });

  it("surfaces disruption emphasis when affected modes are strained before trust labels narrow", () => {
    const diagnostics = createDiagnostics({
      disruptionEmphasis: {
        level: "local",
        headline: "Bus is disrupted nearby",
        detail: "Bus is under the most strain while the rest of the picture stays readable.",
        affectedModeKeys: ["bus"],
      },
      nearbyModes: createCurrentSnapshot().nearbyModes.map((mode) =>
        mode.key === "bus"
          ? {
              ...mode,
              state: "disrupted",
              disruptionScope: "locally-disrupted",
            }
          : mode,
      ),
    });

    expect(diagnostics.summary).toBe("1 degraded area is narrowing the public picture.");
    expect(diagnostics.affectedAreas).toEqual([
      {
        id: "bus",
        areaLabel: "Bus",
        impactScope: "Local-only impact",
        signals: [
          {
            label: "Operational impact",
            stateLabel: "Affected nearby",
            detail: "Bus is under the most strain while the rest of the picture stays readable.",
          },
        ],
      },
    ]);
    expect(diagnostics.healthyAreas).toContain("Weather remains healthy.");
  });

  it("does not claim healthy areas when the snapshot is in fallback", () => {
    const diagnostics = createDiagnostics(
      {
        overallState: "watchful",
        nearbyModes: createCurrentSnapshot().nearbyModes,
      },
      {
        snapshotState: "fallback",
      },
    );

    expect(diagnostics.summary).toBe("No degraded areas are narrowing the public picture.");
    expect(diagnostics.healthyAreas).toEqual([]);
  });

  it("classifies broad strain as overall departure-picture impact", () => {
    const diagnostics = createDiagnostics(
      {
        overallState: "disrupted",
        disruptionEmphasis: {
          level: "overall",
          headline: "Disrupted across the departure picture",
          detail: "The nearby departure picture is under visible strain while remaining readable.",
          affectedModeKeys: ["tube-rail", "bus"],
        },
        nearbyModes: createCurrentSnapshot().nearbyModes.map((mode) => ({
          ...mode,
          disruptionScope: "overall-disrupted",
          sourceStatus: {
            state: "carried-forward",
            label: "Carried forward",
            detail: `${mode.label} is carried forward while live detail narrows.`,
          },
          trust: {
            state: "reduced-confidence",
            label: "Reduced confidence",
            detail: `${mode.label} is less certain just now.`,
            confidence: "narrowed",
          },
        })),
      },
      {
        snapshotState: "last-safe",
      },
    );

    expect(diagnostics.affectedAreas.length > 1).toBe(true);
    expect([...new Set(diagnostics.affectedAreas.map((area) => area.impactScope))]).toEqual([
      "Overall departure-picture impact",
    ]);
    expect(diagnostics.summary).toBe("Several degraded areas are affecting the overall departure picture.");
  });
});
