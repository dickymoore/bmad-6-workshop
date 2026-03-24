import { describe, expect, it } from "vitest";

import { OPS_SHELL_SECTIONS } from "../../src/features/ops/ops-shell-content.js";
import {
  createOpsMaintenanceActionViewModel,
  createOpsShellViewModel,
} from "../../src/features/ops/ops-shell-view.js";
import { createOpsHealthPayload } from "../../src/lib/server/ops/get-ops-health.js";
import { createFixtureDashboardSnapshot } from "../../src/features/dashboard/data/overall-departure-snapshot.js";
import { createDashboardApiResponse } from "../../src/lib/contracts/api-response.js";

function createCurrentSnapshot() {
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
  };
}

function createStatus(overrides = {}) {
  return createOpsHealthPayload({
    dashboardResponse: createDashboardApiResponse(createCurrentSnapshot(), {
      venueKey: "royal-institution",
      publishedAt: "2026-03-19T08:00:00.000Z",
      refreshIntervalMs: 30_000,
      snapshotState: "live",
      recovery: {
        phase: "live",
        recoveredAt: null,
        recoverySource: "live-publish",
        livePublicationResumed: true,
        resumedAt: null,
      },
    }),
    ...overrides,
  });
}

describe("ops shell", () => {
  it("defines keyboard-safe sections and plain operational labels", () => {
    expect(OPS_SHELL_SECTIONS.map((section) => section.id)).toEqual([
      "ops-summary",
      "ops-system-checks",
      "ops-recovery-steps",
    ]);
    expect(OPS_SHELL_SECTIONS.map((section) => section.heading)).toEqual([
      "Venue operations",
      "System checks",
      "Recovery steps",
    ]);
    expect(OPS_SHELL_SECTIONS[2].intro).toContain("light maintenance checks");
  });

  it("builds real readiness checks ahead of recovery notes in keyboard-safe order", () => {
    const viewModel = createOpsShellViewModel(createStatus());

    expect(viewModel.readinessHeading).toBe("Public readiness");
    expect(viewModel.readinessLabel).toBe("Current");
    expect(viewModel.recoveryHeading).toBe("Recovery state");
    expect(viewModel.publishedAt).toBe("19 Mar 2026, 08:00");
    expect(viewModel.recoveryLabel).toBe("Fresh live detail");
    expect(viewModel.recoverySourceLabel).toBe("Fresh live publish");
    expect(viewModel.checks.map((check) => check.label)).toEqual([
      "Main layout is present",
      "Overall departure state is present",
      "Trust labeling is present",
    ]);
    expect(viewModel.checks.map((check) => check.cueLabel)).toEqual([
      "Pass",
      "Pass",
      "Pass",
    ]);
    expect(viewModel.issuesHeading).toBe("Current ops state");
    expect(viewModel.diagnosticsHeading).toBe("Degraded impact");
    expect(viewModel.diagnosticsSummary).toBe("No degraded areas are narrowing the public picture.");
  });

  it("shows calm issue language without provider internals when readiness narrows", () => {
    const viewModel = createOpsShellViewModel(
      createStatus({
        dashboardResponse: createDashboardApiResponse(
          {
            ...createCurrentSnapshot(),
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
            venueKey: "royal-institution",
            publishedAt: "2026-03-19T08:00:00.000Z",
            refreshIntervalMs: 30_000,
            snapshotState: "last-safe",
            recovery: {
              phase: "recovering",
              recoveredAt: "2026-03-19T08:05:00.000Z",
              recoverySource: "stored-snapshot",
              livePublicationResumed: false,
              resumedAt: null,
            },
          },
        ),
      }),
    );

    expect(viewModel.readinessLabel).toBe("Reduced confidence");
    expect(viewModel.recoveryHeading).toBe("Restart recovery");
    expect(viewModel.recoveryLabel).toBe("Restart recovery");
    expect(viewModel.recoveryAt).toBe("19 Mar 2026, 08:05");
    expect(viewModel.recoveryLiveLabel).toBe("Still carried forward");
    expect(viewModel.issues.join(" ")).toContain("carried forward");
    expect(viewModel.diagnosticsAreas.length).toBe(1);
    expect(viewModel.diagnosticsAreas[0].areaLabel).toBe("Weather");
    expect(viewModel.diagnosticsAreas[0].impactScope).toBe("Local-only impact");
    expect(viewModel.healthyAreas).toContain("Movement remains healthy.");
    expect(/WeatherAPI|TfL|stack trace|token|secret/i.test(viewModel.issues.join(" "))).toBe(false);
    expect(/WeatherAPI|TfL|stack trace|token|secret/i.test(JSON.stringify(viewModel.diagnosticsAreas))).toBe(false);
  });

  it("keeps carried-forward runtime fallback out of the restart heading when no restart recovery is active", () => {
    const viewModel = createOpsShellViewModel(
      createStatus({
        dashboardResponse: createDashboardApiResponse(
          {
            ...createCurrentSnapshot(),
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
            venueKey: "royal-institution",
            publishedAt: "2026-03-19T08:00:00.000Z",
            refreshIntervalMs: 30_000,
            snapshotState: "last-safe",
            recovery: {
              phase: "live",
              recoveredAt: "2026-03-19T08:05:00.000Z",
              recoverySource: "live-publish",
              livePublicationResumed: true,
              resumedAt: "2026-03-19T08:05:00.000Z",
            },
          },
        ),
      }),
    );

    expect(viewModel.recoveryHeading).toBe("Recovery state");
    expect(viewModel.recoveryLabel).toBe("Carried forward");
    expect(viewModel.recoveryLiveLabel).toBe("Still carried forward");
  });

  it("normalizes partial diagnostics payloads before rendering", () => {
    const status = createStatus();
    const viewModel = createOpsShellViewModel({
      ...status,
      diagnostics: {
        summary: " ",
        affectedAreas: [
          {
            id: "",
            areaLabel: "",
            impactScope: "",
            signals: [{}],
          },
        ],
        healthyAreas: ["  Weather remains healthy.  ", "", null],
      },
    });

    expect(viewModel.diagnosticsSummary).toBe("No degraded areas are narrowing the public picture.");
    expect(viewModel.diagnosticsAreas).toEqual([
      {
        id: "diagnostic-area",
        areaLabel: "Affected area",
        impactScope: "Local-only impact",
        signals: [
          {
            label: "Signal",
            stateLabel: "Attention needed",
            detail: "Signal detail is temporarily unavailable from this local surface.",
          },
        ],
      },
    ]);
    expect(viewModel.healthyAreas).toEqual(["Weather remains healthy."]);
  });

  it("builds a keyboard-safe maintenance action state with disabled in-flight controls", () => {
    const viewModel = createOpsMaintenanceActionViewModel({
      isPending: true,
    });

    expect(viewModel.disableActions).toBe(true);
    expect(viewModel.pendingMessage).toBe("Maintenance action is running from this local surface.");
    expect(viewModel.resultSummary).toBe(null);
  });

  it("renders calm maintenance action results without dropping the current ops context", () => {
    const viewModel = createOpsMaintenanceActionViewModel({
      actionResult: {
        action: "trust-check",
        status: "attention",
        summary: "Trust check completed with reduced confidence.",
        completedAt: "2026-03-19T08:12:00.000Z",
        readiness: {
          label: "Reduced confidence",
          summary: "Public display stays readable with reduced confidence.",
        },
        attentionDetails: ["Weather is carried forward while live weather detail narrows."],
      },
    });

    expect(viewModel.actionLabel).toBe("Run trust check");
    expect(viewModel.resultStatusLabel).toBe("Attention still needed");
    expect(viewModel.completedAt).toBe("19 Mar 2026, 08:12");
    expect(viewModel.readinessLabel).toBe("Reduced confidence");
    expect(viewModel.attentionDetails).toEqual(["Weather is carried forward while live weather detail narrows."]);
    expect(/stack trace|token|secret/i.test(JSON.stringify(viewModel))).toBe(false);
  });
});
