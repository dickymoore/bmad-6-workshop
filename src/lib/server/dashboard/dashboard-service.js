import { createFixtureDashboardSnapshot } from "../../../features/dashboard/data/overall-departure-snapshot.js";
import { createDashboardApiResponse } from "../../contracts/api-response.js";
import { createTrustSignal } from "../../contracts/freshness.js";
import { createDashboardSnapshot } from "../../contracts/dashboard-snapshot.js";
import { getMemoryCacheEntry, setMemoryCacheEntry } from "../cache/memory-cache.js";
import { readStoredDashboardSnapshot } from "../cache/snapshot-store.js";
import { buildDashboardSnapshot } from "./build-dashboard-snapshot.js";
import { publishDashboardSnapshot } from "./publish-dashboard-snapshot.js";

const CACHE_KEY = "dashboard-snapshot";
const VENUE_KEY = "royal-institution";
const DEFAULT_REFRESH_INTERVAL_MS = 30_000;

function createResponse(snapshot, snapshotState, refreshIntervalMs) {
  return createDashboardApiResponse(snapshot, {
    venueKey: VENUE_KEY,
    publishedAt: snapshot.publishedAt,
    refreshIntervalMs,
    snapshotState,
  });
}

function createReducedConfidenceFallbackSnapshot(publishedAt) {
  const fallbackSnapshot = createFixtureDashboardSnapshot({ publishedAt });

  return createDashboardSnapshot({
    ...fallbackSnapshot,
    overallTrend: null,
    supportLabel: "The shared picture stays readable while live signals reconnect.",
    headerTrust: {
      weather: createTrustSignal({
        state: "reduced-confidence",
        subject: "Weather",
      }),
      mobility: createTrustSignal({
        state: "reduced-confidence",
        subject: "Movement",
      }),
    },
    nearbyModes: fallbackSnapshot.nearbyModes.map((mode) => ({
      ...mode,
      trust: createTrustSignal({
        state: "reduced-confidence",
        subject: mode.label,
      }),
    })),
  });
}

export async function getDashboardApiResponse({
  now = new Date(),
  refreshIntervalMs = Number(process.env.DASHBOARD_REFRESH_INTERVAL_MS ?? DEFAULT_REFRESH_INTERVAL_MS),
  cacheGet = getMemoryCacheEntry,
  cacheSet = setMemoryCacheEntry,
  readSnapshot = readStoredDashboardSnapshot,
  buildSnapshot = buildDashboardSnapshot,
  publishSnapshot = publishDashboardSnapshot,
} = {}) {
  const nowMs = now.getTime();
  const cachedEntry = cacheGet(CACHE_KEY);

  if (cachedEntry && nowMs - cachedEntry.cachedAt < refreshIntervalMs) {
    return createResponse(cachedEntry.snapshot, cachedEntry.snapshotState, refreshIntervalMs);
  }

  const storedSnapshot = cachedEntry?.snapshot ?? (await readSnapshot());

  if (!cachedEntry && storedSnapshot) {
    cacheSet(CACHE_KEY, {
      snapshot: storedSnapshot,
      snapshotState: "last-safe",
      cachedAt: nowMs,
    });
  }

  try {
    const built = await buildSnapshot({ now });
    const published = await publishSnapshot({
      snapshot: built.snapshot,
      snapshotState: built.snapshotState,
      cacheSet,
    });

    return createResponse(published.snapshot, published.snapshotState, refreshIntervalMs);
  } catch {
    if (storedSnapshot) {
      cacheSet(CACHE_KEY, {
        snapshot: storedSnapshot,
        snapshotState: "last-safe",
        cachedAt: nowMs,
      });

      return createResponse(storedSnapshot, "last-safe", refreshIntervalMs);
    }

    const fallbackSnapshot = createReducedConfidenceFallbackSnapshot(now.toISOString());

    cacheSet(CACHE_KEY, {
      snapshot: fallbackSnapshot,
      snapshotState: "fallback",
      cachedAt: nowMs,
    });

    return createResponse(fallbackSnapshot, "fallback", refreshIntervalMs);
  }
}
