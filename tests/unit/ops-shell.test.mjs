import { describe, expect, it } from "vitest";

import { OPS_SHELL_SECTIONS } from "../../src/features/ops/ops-shell-content.js";
import { createOpsShellViewModel } from "../../src/features/ops/ops-shell-view.js";
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
  });

  it("builds real readiness checks ahead of recovery notes in keyboard-safe order", () => {
    const viewModel = createOpsShellViewModel(createStatus());

    expect(viewModel.readinessHeading).toBe("Public readiness");
    expect(viewModel.readinessLabel).toBe("Current");
    expect(viewModel.publishedAt).toBe("19 Mar 2026, 08:00");
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
          },
        ),
      }),
    );

    expect(viewModel.readinessLabel).toBe("Reduced confidence");
    expect(viewModel.issues.join(" ")).toContain("carried forward");
    expect(/WeatherAPI|TfL|stack trace|token|secret/i.test(viewModel.issues.join(" "))).toBe(false);
  });
});
