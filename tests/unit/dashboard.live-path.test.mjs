import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";

import { describe, expect, it } from "vitest";

import { createFixtureDashboardSnapshot } from "../../src/features/dashboard/data/overall-departure-snapshot.js";
import { createDashboardApiResponse } from "../../src/lib/contracts/api-response.js";
import { buildDashboardSnapshot } from "../../src/lib/server/dashboard/build-dashboard-snapshot.js";
import { getDashboardApiResponse } from "../../src/lib/server/dashboard/dashboard-service.js";
import { publishDashboardSnapshot } from "../../src/lib/server/dashboard/publish-dashboard-snapshot.js";

const root = resolve(process.cwd());

describe("dashboard live path", () => {
  it("wraps canonical dashboard data in a public API response envelope", () => {
    const snapshot = createFixtureDashboardSnapshot({
      publishedAt: "2026-03-19T08:30:00.000Z",
      overallTrend: "steady",
    });
    const response = createDashboardApiResponse(snapshot, {
      venueKey: "royal-institution",
      publishedAt: snapshot.publishedAt,
      refreshIntervalMs: 30_000,
      snapshotState: "live",
    });

    expect(response.meta).toEqual({
      venueKey: "royal-institution",
      publishedAt: "2026-03-19T08:30:00.000Z",
      refreshIntervalMs: 30_000,
      snapshotState: "live",
    });
    expect(response.data.overallTrend).toBe("steady");
    expect(response.data.headerTrust.mobility.state).toBe("aging");
    expect(response.data.headerStatus.weather.state).toBe("live");
  });

  it("publishes the newest safe snapshot to cache, persistence, and recent history together", async () => {
    const writes = [];
    const historyWrites = [];
    const cacheEntries = [];
    const snapshot = createFixtureDashboardSnapshot({
      publishedAt: "2026-03-19T08:31:00.000Z",
      overallTrend: "steady",
    });
    const published = await publishDashboardSnapshot({
      snapshot,
      snapshotState: "live",
      cacheSet(key, value) {
        cacheEntries.push([key, value]);
        return value;
      },
      async writeSnapshot(nextSnapshot) {
        writes.push(nextSnapshot);
        return nextSnapshot;
      },
      async appendHistory(nextSnapshot) {
        historyWrites.push(nextSnapshot);
        return [nextSnapshot];
      },
    });

    expect(writes).toEqual([snapshot]);
    expect(historyWrites).toEqual([snapshot]);
    expect(cacheEntries[0][0]).toBe("dashboard-snapshot");
    expect(cacheEntries[0][1].snapshot).toEqual(snapshot);
    expect(published.snapshotState).toBe("live");
  });

  it("builds a live snapshot from provider summaries, timing evidence, and recent history", async () => {
    const built = await buildDashboardSnapshot({
      now: new Date("2026-03-19T08:31:00.000Z"),
      async readHistory() {
        return [
          {
            publishedAt: "2026-03-19T08:20:00.000Z",
            overallState: "watchful",
            nearbyModes: [
              {
                key: "tube-rail",
                state: "available",
              },
              {
                key: "bus",
                state: "available",
              },
            ],
          },
        ];
      },
      async tflProvider() {
        return {
          mobilitySummary: "Nearby departures are moving, with a slightly tighter live rhythm.",
          signalObservedAt: "2026-03-19T08:16:00.000Z",
          liveModes: [
            {
              key: "tube-rail",
              state: "caution",
              summary: "Tube and rail are moving with a tighter rhythm nearby.",
              nuance: "Queues and platform rhythms may bunch a little more than usual.",
              signalObservedAt: "2026-03-19T08:16:00.000Z",
            },
            {
              key: "bus",
              state: "disrupted",
              summary: "Nearby buses are reading disrupted around the West End.",
              nuance: "Bus spacing is delayed through the nearby streets.",
              signalObservedAt: "2026-03-19T08:11:00.000Z",
              missedRefreshes: 2,
            },
          ],
        };
      },
      async weatherProvider() {
        return {
          overallState: "watchful",
          weatherSummary: "Rain is moving across Mayfair and the nearby street is reading a little slower.",
          signalObservedAt: "2026-03-19T08:28:00.000Z",
        };
      },
    });

    expect(built.snapshotState).toBe("live");
    expect(built.snapshot.publishedAt).toBe("2026-03-19T08:31:00.000Z");
    expect(built.snapshot.overallTrend).toBe("worsening");
    expect(built.snapshot.disruptionEmphasis).toEqual({
      level: "local",
      headline: "Bus is disrupted nearby",
      detail: "Bus is under the most strain nearby while the rest of the departure picture stays readable.",
      affectedModeKeys: ["bus"],
    });
    expect(built.snapshot.headerTrust.weather.state).toBe("current");
    expect(built.snapshot.headerTrust.mobility.state).toBe("stale");
    expect(built.snapshot.headerStatus.weather.state).toBe("live");
    expect(built.snapshot.headerStatus.mobility.state).toBe("live");
    expect(built.snapshot.nearbyModes.find((mode) => mode.key === "tube-rail")?.disruptionScope).toBe("unaffected-readable");
    expect(built.snapshot.nearbyModes.find((mode) => mode.key === "bus")?.disruptionScope).toBe("locally-disrupted");
    expect(built.snapshot.nearbyModes.find((mode) => mode.key === "bus")?.sourceStatus.state).toBe("live");
    expect(built.snapshot.nearbyModes.find((mode) => mode.key === "bus")?.trust.state).toBe("delayed");
    expect(built.snapshot.localMap.sourceStatus.state).toBe("live");
  });

  it("does not invent serious disruption from reduced-confidence or stale live evidence alone", async () => {
    const built = await buildDashboardSnapshot({
      now: new Date("2026-03-19T08:31:00.000Z"),
      async readHistory() {
        return [];
      },
      async tflProvider() {
        return {
          mobilitySummary: "Nearby departures are still moving, with a slightly tighter live rhythm.",
          signalObservedAt: "2026-03-19T08:01:00.000Z",
          missedRefreshes: 3,
          liveModes: [
            {
              key: "tube-rail",
              state: "available",
              summary: "Tube and rail are still reading open nearby.",
              nuance: "Station approaches remain readable.",
              signalObservedAt: "2026-03-19T08:01:00.000Z",
              missedRefreshes: 3,
            },
            {
              key: "bus",
              state: "caution",
              summary: "Bus spacing is a little uneven nearby.",
              nuance: "Stops remain readable despite the slower refresh.",
              signalObservedAt: "2026-03-19T08:01:00.000Z",
              missedRefreshes: 3,
            },
          ],
        };
      },
      async weatherProvider() {
        return {
          overallState: "watchful",
          weatherSummary: "Rain is moving across Mayfair and the street is reading a little slower.",
          signalObservedAt: "2026-03-19T08:28:00.000Z",
        };
      },
    });

    expect(built.snapshot.overallState).toBe("watchful");
    expect(built.snapshot.disruptionEmphasis).toEqual({
      level: "none",
      headline: null,
      detail: null,
      affectedModeKeys: [],
    });
    expect(built.snapshot.nearbyModes.every((mode) => mode.state !== "disrupted")).toBe(true);
    expect(built.snapshot.nearbyModes.some((mode) => mode.trust.state === "delayed")).toBe(true);
  });

  it("keeps unaffected live signals visible while failed providers narrow only their own areas", async () => {
    const storedSnapshot = createFixtureDashboardSnapshot({
      publishedAt: "2026-03-19T08:18:00.000Z",
      overallTrend: "steady",
    });
    const built = await buildDashboardSnapshot({
      now: new Date("2026-03-19T08:31:00.000Z"),
      lastSafeSnapshot: storedSnapshot,
      async readHistory() {
        return [];
      },
      async tflProvider() {
        throw new Error("movement failed");
      },
      async weatherProvider() {
        return {
          overallState: "watchful",
          weatherSummary: "Rain is still moving across Mayfair.",
          signalObservedAt: "2026-03-19T08:29:00.000Z",
        };
      },
    });

    expect(built.snapshotState).toBe("live");
    expect(built.snapshot.weatherSummary).toBe("Rain is still moving across Mayfair.");
    expect(built.snapshot.headerStatus.weather.state).toBe("live");
    expect(built.snapshot.headerStatus.mobility.state).toBe("carried-forward");
    expect(built.snapshot.mobilitySummary).toBe(storedSnapshot.mobilitySummary);
    expect(built.snapshot.nearbyModes.every((mode) => mode.sourceStatus.state === "carried-forward")).toBe(true);
    expect(built.snapshot.nearbyModes.every((mode) => mode.trust.state === "reduced-confidence")).toBe(true);
    expect(built.snapshot.localMap.state).toBe("fallback");
    expect(built.snapshot.localMap.sourceStatus.state).toBe("carried-forward");
    expect(built.snapshot.disruptionEmphasis.level).toBe("none");
  });

  it("does not leak fixture service-state cues into unavailable nearby modes", async () => {
    const built = await buildDashboardSnapshot({
      now: new Date("2026-03-19T08:31:00.000Z"),
      async readHistory() {
        return [];
      },
      async tflProvider() {
        throw new Error("movement failed");
      },
      async weatherProvider() {
        return {
          overallState: "calm",
          weatherSummary: "Skies are settled around Mayfair.",
          signalObservedAt: "2026-03-19T08:29:00.000Z",
        };
      },
    });

    expect(built.snapshot.overallState).toBe("calm");
    expect(built.snapshot.disruptionEmphasis.level).toBe("none");
    expect(built.snapshot.headerStatus.weather.state).toBe("live");
    expect(built.snapshot.headerStatus.mobility.state).toBe("unavailable");
    expect(built.snapshot.nearbyModes.every((mode) => mode.state === "caution")).toBe(true);
    expect(built.snapshot.nearbyModes.every((mode) => mode.sourceStatus.state === "unavailable")).toBe(true);
    expect(built.snapshot.nearbyModes.every((mode) => mode.summary.includes("temporarily unavailable"))).toBe(true);
    expect(built.snapshot.localMap.sourceStatus.state).toBe("unavailable");
  });

  it("keeps one weaker signal local when the service falls back to the last safe snapshot", async () => {
    const storedSnapshot = createFixtureDashboardSnapshot({
      publishedAt: "2026-03-19T08:15:00.000Z",
      overallTrend: "steady",
    });
    const response = await getDashboardApiResponse({
      now: new Date("2026-03-19T08:32:00.000Z"),
      cacheGet() {
        return null;
      },
      cacheSet() {
        return null;
      },
      async readSnapshot() {
        return storedSnapshot;
      },
      async buildSnapshot() {
        throw new Error("provider failure");
      },
      async publishSnapshot() {
        throw new Error("should not publish");
      },
    });

    expect(response.meta.snapshotState).toBe("last-safe");
    expect(response.data.publishedAt).toBe("2026-03-19T08:15:00.000Z");
    expect(response.data.headerStatus.weather.state).toBe("carried-forward");
    expect(response.data.headerTrust.weather.state).toBe("reduced-confidence");
    expect(response.data.nearbyModes.every((mode) => mode.sourceStatus.state === "carried-forward")).toBe(true);
  });

  it("does not invent a trend when the service drops to fixture fallback", async () => {
    const response = await getDashboardApiResponse({
      now: new Date("2026-03-19T08:32:00.000Z"),
      cacheGet() {
        return null;
      },
      cacheSet() {
        return null;
      },
      async readSnapshot() {
        return null;
      },
      async buildSnapshot() {
        throw new Error("provider failure");
      },
      async publishSnapshot() {
        throw new Error("should not publish");
      },
    });

    expect(response.meta.snapshotState).toBe("fallback");
    expect(response.data.overallState).toBe("calm");
    expect(response.data.overallTrend).toBe(null);
    expect(response.data.headerStatus.weather.state).toBe("unavailable");
    expect(response.data.headerTrust.weather.state).toBe("unavailable");
    expect(response.data.headerTrust.mobility.state).toBe("unavailable");
    expect(response.data.disruptionEmphasis.level).toBe("none");
    expect(response.data.supportLabel).toBe("The Royal Institution picture stays readable while live detail reconnects.");
    expect(response.data.nearbyModes.every((mode) => mode.state === "caution")).toBe(true);
    expect(response.data.nearbyModes.every((mode) => mode.sourceStatus.state === "unavailable")).toBe(true);
    expect(response.data.nearbyModes.every((mode) => mode.trust.state === "unavailable")).toBe(true);
    expect(response.data.localMap.sourceStatus.state).toBe("unavailable");
  });

  it("keeps the polling boundary selective and route-local without a loading takeover", () => {
    const hookSource = readFileSync(join(root, "src", "features", "dashboard", "hooks", "useDashboardQuery.ts"), "utf8");
    const liveScreenSource = readFileSync(
      join(root, "src", "features", "dashboard", "components", "DashboardLiveScreen.tsx"),
      "utf8",
    );
    const pageSource = readFileSync(join(root, "src", "app", "(public)", "page.tsx"), "utf8");

    assert.match(hookSource, /queryKey:\s*\["dashboard"\]/);
    assert.match(hookSource, /headerTrust/);
    assert.match(liveScreenSource, /QueryClientProvider/);
    assert.match(liveScreenSource, /<DashboardScreen viewModel=\{viewModel\} \/>/);
    assert.doesNotMatch(liveScreenSource, /spinner|loading takeover|full-screen/i);
    assert.match(pageSource, /getDashboardApiResponse/);
    assert.match(pageSource, /export const dynamic = "force-dynamic"/);
  });
});
