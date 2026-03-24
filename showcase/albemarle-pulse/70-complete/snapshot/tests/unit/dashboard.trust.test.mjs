import { describe, expect, it } from "vitest";

import {
  buildTrustSignal,
  classifyFreshnessState,
} from "../../src/lib/contracts/freshness.js";
import { classifyOverallTrend } from "../../src/lib/server/dashboard/build-dashboard-snapshot.js";

describe("freshness classification", () => {
  it("classifies current, aging, stale, delayed, reduced-confidence, and unavailable from timing evidence", () => {
    const now = new Date("2026-03-19T08:15:00.000Z");

    expect(
      classifyFreshnessState({
        now,
        observedAt: "2026-03-19T08:12:00.000Z",
      }),
    ).toBe("current");
    expect(
      classifyFreshnessState({
        now,
        observedAt: "2026-03-19T08:09:00.000Z",
      }),
    ).toBe("aging");
    expect(
      classifyFreshnessState({
        now,
        observedAt: "2026-03-19T08:03:00.000Z",
      }),
    ).toBe("stale");
    expect(
      classifyFreshnessState({
        now,
        observedAt: "2026-03-19T07:58:00.000Z",
      }),
    ).toBe("delayed");
    expect(
      classifyFreshnessState({
        now,
        fallbackAt: "2026-03-19T08:12:00.000Z",
        reducedConfidence: true,
      }),
    ).toBe("reduced-confidence");
    expect(
      classifyFreshnessState({
        now,
        unavailable: true,
      }),
    ).toBe("unavailable");
  });

  it("creates plain-language trust signals", () => {
    const trust = buildTrustSignal({
      now: new Date("2026-03-19T08:15:00.000Z"),
      observedAt: "2026-03-19T08:02:00.000Z",
      subject: "Bus",
    });

    expect(trust.label).toBe("Stale");
    expect(trust.detail).toBe("Bus is stale and may have shifted.");
    expect(trust.confidence).toBe("narrowed");
  });
});

describe("overall trend classification", () => {
  it("classifies worsening, improving, and steady from recent state history", () => {
    const currentSnapshot = {
      publishedAt: "2026-03-19T08:15:00.000Z",
      overallState: "strained",
      nearbyModes: [
        { key: "tube-rail", state: "caution" },
        { key: "bus", state: "disrupted" },
      ],
    };

    expect(
      classifyOverallTrend({
        now: new Date("2026-03-19T08:15:00.000Z"),
        currentSnapshot,
        history: [
          {
            publishedAt: "2026-03-19T08:02:00.000Z",
            overallState: "watchful",
            nearbyModes: [
              { key: "tube-rail", state: "available" },
              { key: "bus", state: "caution" },
            ],
          },
        ],
      }),
    ).toBe("worsening");

    expect(
      classifyOverallTrend({
        now: new Date("2026-03-19T08:15:00.000Z"),
        currentSnapshot: {
          ...currentSnapshot,
          overallState: "watchful",
          nearbyModes: [
            { key: "tube-rail", state: "available" },
            { key: "bus", state: "available" },
          ],
        },
        history: [
          {
            publishedAt: "2026-03-19T08:02:00.000Z",
            overallState: "strained",
            nearbyModes: [
              { key: "tube-rail", state: "caution" },
              { key: "bus", state: "disrupted" },
            ],
          },
        ],
      }),
    ).toBe("improving");

    expect(
      classifyOverallTrend({
        now: new Date("2026-03-19T08:15:00.000Z"),
        currentSnapshot,
        history: [
          {
            publishedAt: "2026-03-19T08:10:00.000Z",
            overallState: "strained",
            nearbyModes: [
              { key: "tube-rail", state: "caution" },
              { key: "bus", state: "disrupted" },
            ],
          },
        ],
      }),
    ).toBe("steady");
  });

  it("requires recent window evidence before surfacing a trend", () => {
    expect(
      classifyOverallTrend({
        now: new Date("2026-03-19T08:20:00.000Z"),
        currentSnapshot: {
          publishedAt: "2026-03-19T08:20:00.000Z",
          overallState: "watchful",
          nearbyModes: [{ key: "tube-rail", state: "available" }],
        },
        history: [
          {
            publishedAt: "2026-03-19T07:59:00.000Z",
            overallState: "calm",
            nearbyModes: [{ key: "tube-rail", state: "available" }],
          },
        ],
      }),
    ).toBe(null);
  });
});
