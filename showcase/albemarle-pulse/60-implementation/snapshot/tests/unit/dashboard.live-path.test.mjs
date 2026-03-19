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
    expect(response.data.placeLabel).toBe("Royal Institution, Albemarle Street");
  });

  it("publishes the newest safe snapshot to cache and persistence together", async () => {
    const writes = [];
    const cacheEntries = [];
    const snapshot = createFixtureDashboardSnapshot({
      publishedAt: "2026-03-19T08:31:00.000Z",
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
    });

    expect(writes).toEqual([snapshot]);
    expect(cacheEntries[0][0]).toBe("dashboard-snapshot");
    expect(cacheEntries[0][1].snapshot).toEqual(snapshot);
    expect(published.snapshotState).toBe("live");
  });

  it("builds a live snapshot from provider summaries while keeping the canonical shape", async () => {
    const built = await buildDashboardSnapshot({
      now: new Date("2026-03-19T08:31:00.000Z"),
      async tflProvider() {
        return {
          mobilitySummary: "Nearby departures are moving, with a slightly tighter live rhythm.",
          liveModes: [
            {
              key: "tube-rail",
              state: "caution",
              summary: "Tube and rail are moving with a tighter rhythm nearby.",
              nuance: "Queues and platform rhythms may bunch a little more than usual.",
            },
          ],
        };
      },
      async weatherProvider() {
        return {
          overallState: "watchful",
          weatherSummary: "Rain is moving across Mayfair and the nearby street is reading a little slower.",
        };
      },
    });

    expect(built.snapshotState).toBe("live");
    expect(built.snapshot.publishedAt).toBe("2026-03-19T08:31:00.000Z");
    expect(built.snapshot.nearbyModes[0].state).toBe("caution");
    expect(built.snapshot.freshnessLabel).toBe("Now refreshed for the foyer.");
  });

  it("reuses the last safe snapshot when a refresh fails", async () => {
    const storedSnapshot = createFixtureDashboardSnapshot({
      publishedAt: "2026-03-19T08:15:00.000Z",
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
  });

  it("keeps the polling boundary selective and route-local without a loading takeover", () => {
    const hookSource = readFileSync(join(root, "src", "features", "dashboard", "hooks", "useDashboardQuery.ts"), "utf8");
    const liveScreenSource = readFileSync(
      join(root, "src", "features", "dashboard", "components", "DashboardLiveScreen.tsx"),
      "utf8",
    );
    const pageSource = readFileSync(join(root, "src", "app", "(public)", "page.tsx"), "utf8");
    const tsconfigSource = readFileSync(join(root, "tsconfig.json"), "utf8");

    assert.match(hookSource, /queryKey:\s*\["dashboard"\]/);
    assert.match(hookSource, /fetchJson<DashboardApiResponse>\("\/api\/dashboard"\)/);
    assert.match(hookSource, /refetchInterval:\s*initialData\.meta\.refreshIntervalMs/);
    assert.match(liveScreenSource, /QueryClientProvider/);
    assert.match(liveScreenSource, /<DashboardScreen viewModel=\{viewModel\} \/>/);
    assert.doesNotMatch(liveScreenSource, /spinner|loading takeover|full-screen/i);
    assert.match(pageSource, /getDashboardApiResponse/);
    assert.match(pageSource, /export const dynamic = "force-dynamic"/);
    assert.doesNotMatch(pageSource, /getOverallDepartureSnapshot/);
    assert.doesNotMatch(tsconfigSource, /"@tanstack\/react-query"\s*:/);
  });
});
