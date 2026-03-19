import { describe, expect, it } from "vitest";

import { createFixtureDashboardSnapshot } from "../../src/features/dashboard/data/overall-departure-snapshot.js";
import { createDashboardApiResponse } from "../../src/lib/contracts/api-response.js";
import { createOpsActionsRouteResponse } from "../../src/lib/server/ops/create-ops-actions-route-response.js";
import { runOpsMaintenanceAction } from "../../src/lib/server/ops/run-ops-maintenance-action.js";

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
    ...metaOverrides,
  });
}

describe("ops maintenance action helper", () => {
  it("forces a refresh through the existing dashboard pipeline", async () => {
    const calls = [];
    const result = await runOpsMaintenanceAction({
      action: "refresh",
      now: new Date("2026-03-19T08:15:00.000Z"),
      async getDashboardResponse(options) {
        calls.push(options);
        return createDashboardResponse();
      },
    });

    expect(calls.length).toBe(1);
    expect(calls[0].forceRefresh).toBe(true);
    expect(result.action).toBe("refresh");
    expect(result.status).toBe("succeeded");
    expect(result.summary).toBe("Refresh completed and the public view is current.");
    expect(result.readiness.state).toBe("current");
    expect(result.completedAt).toBe("2026-03-19T08:15:00.000Z");
  });

  it("runs trust-check against the latest available dashboard response without forcing a publish", async () => {
    let refreshCalls = 0;
    let latestCalls = 0;

    const result = await runOpsMaintenanceAction({
      action: "trust-check",
      async getDashboardResponse() {
        refreshCalls += 1;
        return createDashboardResponse();
      },
      async getLatestDashboardResponse() {
        latestCalls += 1;
        return createDashboardResponse(
          {
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
          },
          {
            snapshotState: "last-safe",
          },
        );
      },
    });

    expect(refreshCalls).toBe(0);
    expect(latestCalls).toBe(1);
    expect(result.action).toBe("trust-check");
    expect(result.status).toBe("attention");
    expect(result.summary).toBe("Trust check completed with reduced confidence.");
    expect(result.attentionDetails).toContain("Weather is carried forward while live weather detail narrows.");
  });

  it("keeps the last safe read visible when a refresh cannot confirm fresh live detail", async () => {
    const result = await runOpsMaintenanceAction({
      action: "refresh",
      async getDashboardResponse() {
        return createDashboardResponse(
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
          },
          {
            snapshotState: "last-safe",
          },
        );
      },
    });

    expect(result.status).toBe("attention");
    expect(result.summary).toBe("Refresh could not confirm fresh live detail; the last safe picture remains in service.");
    expect(result.readiness.state).toBe("reduced-confidence");
    expect(result.evidence.snapshotState).toBe("last-safe");
  });

  it("rejects unsupported maintenance actions", async () => {
    let error;

    try {
      await runOpsMaintenanceAction({
        action: "restart-service",
      });
    } catch (caughtError) {
      error = caughtError;
    }

    expect(error?.message).toBe("UNSUPPORTED_OPS_ACTION:restart-service");
  });
});

describe("ops maintenance action route", () => {
  it("stays local-only and fails closed for non-local hosts", async () => {
    const response = await createOpsActionsRouteResponse({
      requestHeaders: new Headers([["host", "example.com"]]),
      requestBody: {
        action: "refresh",
      },
    });

    expect(response.status).toBe(404);
    expect(await response.text()).toBe("");
  });

  it("accepts only the supported action names with a calm bounded error", async () => {
    const response = await createOpsActionsRouteResponse({
      requestHeaders: new Headers([["host", "localhost:3000"]]),
      requestBody: {
        action: "restart-service",
      },
    });

    expect(response.status).toBe(400);

    const payload = await response.json();

    expect(payload).toEqual({
      error: {
        summary: "This maintenance action is not available from the local surface.",
      },
    });
  });

  it("returns a calm action result without leaking provider internals", async () => {
    const response = await createOpsActionsRouteResponse({
      requestHeaders: new Headers([["host", "localhost:3000"]]),
      requestBody: {
        action: "refresh",
      },
      async runAction() {
        return {
          action: "refresh",
          status: "attention",
          summary: "Refresh could not confirm fresh live detail; the last safe picture remains in service.",
          completedAt: "2026-03-19T08:20:00.000Z",
          readiness: {
            state: "reduced-confidence",
            label: "Reduced confidence",
            summary: "Public display stays readable with reduced confidence.",
          },
          diagnostics: {
            summary: "Weather is narrowed while movement remains healthy.",
            affectedAreas: [],
            healthyAreas: ["Movement remains healthy."],
          },
          checks: [],
          issues: ["Weather is carried forward while live weather detail narrows."],
          evidence: {
            snapshotState: "last-safe",
            publishedAt: "2026-03-19T08:19:00.000Z",
          },
          attentionDetails: ["Weather is carried forward while live weather detail narrows."],
        };
      },
    });

    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("no-store, max-age=0");

    const payload = await response.json();
    const payloadText = JSON.stringify(payload);

    expect(payload.action).toBe("refresh");
    expect(payload.summary).toBe("Refresh could not confirm fresh live detail; the last safe picture remains in service.");
    expect(/TfL|WeatherAPI|stack trace|token|secret/i.test(payloadText)).toBe(false);
  });
});
