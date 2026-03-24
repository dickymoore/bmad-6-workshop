import { createFixtureDashboardSnapshot } from "../../../features/dashboard/data/overall-departure-snapshot.js";
import { createDashboardApiResponse } from "../../contracts/api-response.js";
import { createSourceStatus, createTrustSignal } from "../../contracts/freshness.js";
import { createDashboardSnapshot } from "../../contracts/dashboard-snapshot.js";
import { getMemoryCacheEntry, setMemoryCacheEntry } from "../cache/memory-cache.js";
import { readStoredDashboardSnapshot } from "../cache/snapshot-store.js";
import { buildDashboardSnapshot } from "./build-dashboard-snapshot.js";
import { publishDashboardSnapshot } from "./publish-dashboard-snapshot.js";
import {
  createDashboardRecoveryMeta,
  readDashboardRecoveryState,
  recordDashboardRestartRecovery,
} from "./recovery-state.js";

const CACHE_KEY = "dashboard-snapshot";
const VENUE_KEY = "royal-institution";
const DEFAULT_REFRESH_INTERVAL_MS = 30_000;

function createResponse(snapshot, snapshotState, refreshIntervalMs, recoveryState) {
  return createDashboardApiResponse(snapshot, {
    venueKey: VENUE_KEY,
    publishedAt: snapshot.publishedAt,
    refreshIntervalMs,
    snapshotState,
    recovery: createDashboardRecoveryMeta({
      snapshotState,
      recoveryState,
    }),
  });
}

function createCarriedForwardSnapshot(snapshot) {
  return createDashboardSnapshot({
    ...snapshot,
    headerTrust: {
      weather: createTrustSignal({
        state: "reduced-confidence",
        detail: "Weather is carried forward while live weather detail narrows.",
      }),
      mobility: createTrustSignal({
        state: "reduced-confidence",
        detail: "Movement is carried forward while live movement detail narrows.",
      }),
    },
    headerStatus: {
      weather: createSourceStatus({
        state: "carried-forward",
        detail: "Weather is carried forward while live weather detail narrows.",
      }),
      mobility: createSourceStatus({
        state: "carried-forward",
        detail: "Movement is carried forward while live movement detail narrows.",
      }),
    },
    localMap: {
      ...snapshot.localMap,
      state: "fallback",
      sourceStatus: createSourceStatus({
        state: "carried-forward",
        detail: "The local frame stays simplified while richer locality detail narrows.",
      }),
      fallbackCopy: "The local frame stays simplified while richer locality detail narrows.",
    },
    supportLabel: "The shared picture is carried forward while live detail narrows.",
    nearbyModes: snapshot.nearbyModes.map((mode) => ({
      ...mode,
      disruptionScope: "unaffected-readable",
      sourceStatus: createSourceStatus({
        state: "carried-forward",
        detail: `${mode.label} is carried forward while live nearby detail narrows.`,
      }),
      trust: createTrustSignal({
        state: "reduced-confidence",
        detail: `${mode.label} is carried forward while live nearby detail narrows.`,
      }),
    })),
  });
}

function createReducedConfidenceFallbackSnapshot(publishedAt) {
  const fallbackSnapshot = createFixtureDashboardSnapshot({ publishedAt });

  return createDashboardSnapshot({
    ...fallbackSnapshot,
    overallState: "calm",
    overallTrend: null,
    supportLabel: "The Royal Institution picture stays readable while live detail reconnects.",
    headerTrust: {
      weather: createTrustSignal({
        state: "unavailable",
        detail: "Weather is temporarily unavailable for the foyer.",
      }),
      mobility: createTrustSignal({
        state: "unavailable",
        detail: "Movement is temporarily unavailable for the foyer.",
      }),
    },
    headerStatus: {
      weather: createSourceStatus({
        state: "unavailable",
        detail: "Weather is temporarily unavailable for the foyer.",
      }),
      mobility: createSourceStatus({
        state: "unavailable",
        detail: "Movement is temporarily unavailable for the foyer.",
      }),
    },
    localMap: {
      ...fallbackSnapshot.localMap,
      state: "fallback",
      sourceStatus: createSourceStatus({
        state: "unavailable",
        detail: "The local frame stays simplified while richer locality detail is temporarily unavailable.",
      }),
      fallbackCopy: "The local frame stays simplified while richer locality detail is temporarily unavailable.",
    },
    nearbyModes: fallbackSnapshot.nearbyModes.map((mode) => ({
      ...mode,
      state: "caution",
      disruptionScope: "unaffected-readable",
      summary: `${mode.label} is temporarily unavailable in this nearby read.`,
      nuance: "The rest of the nearby picture remains readable.",
      sourceStatus: createSourceStatus({
        state: "unavailable",
        detail: `${mode.label} is temporarily unavailable in this nearby read.`,
      }),
      trust: createTrustSignal({
        state: "unavailable",
        detail: `${mode.label} is temporarily unavailable in this nearby read.`,
      }),
    })),
  });
}

export async function getDashboardApiResponse({
  now = new Date(),
  refreshIntervalMs = Number(process.env.DASHBOARD_REFRESH_INTERVAL_MS ?? DEFAULT_REFRESH_INTERVAL_MS),
  forceRefresh = false,
  cacheGet = getMemoryCacheEntry,
  cacheSet = setMemoryCacheEntry,
  readSnapshot = readStoredDashboardSnapshot,
  readRecoveryState = readDashboardRecoveryState,
  recordRestartRecovery = recordDashboardRestartRecovery,
  buildSnapshot = buildDashboardSnapshot,
  publishSnapshot = publishDashboardSnapshot,
} = {}) {
  const nowMs = now.getTime();
  const cachedEntry = cacheGet(CACHE_KEY);

  if (!forceRefresh && cachedEntry && nowMs - cachedEntry.cachedAt < refreshIntervalMs) {
    return createResponse(
      cachedEntry.snapshot,
      cachedEntry.snapshotState,
      refreshIntervalMs,
      cachedEntry.recoveryState,
    );
  }

  const storedSnapshot = cachedEntry?.snapshot ?? (await readSnapshot());
  const existingRecoveryState = cachedEntry?.recoveryState ?? (await readRecoveryState());

  if (!cachedEntry && storedSnapshot && !forceRefresh) {
    const carriedForwardSnapshot = createCarriedForwardSnapshot(storedSnapshot);
    const recoveryState = await recordRestartRecovery({ now });

    cacheSet(CACHE_KEY, {
      snapshot: carriedForwardSnapshot,
      snapshotState: "last-safe",
      recoveryState,
      cachedAt: nowMs,
    });

    return createResponse(carriedForwardSnapshot, "last-safe", refreshIntervalMs, recoveryState);
  }

  try {
    const built = await buildSnapshot({ now, lastSafeSnapshot: storedSnapshot });
    const published = await publishSnapshot({
      snapshot: built.snapshot,
      snapshotState: built.snapshotState,
      cacheSet,
      readRecoveryState: async () => existingRecoveryState,
    });

    return createResponse(published.snapshot, published.snapshotState, refreshIntervalMs, published.recoveryState);
  } catch {
    if (storedSnapshot) {
      const carriedForwardSnapshot = createCarriedForwardSnapshot(storedSnapshot);
      const recoveryState =
        existingRecoveryState?.phase === "recovering" && !existingRecoveryState.livePublicationResumed
          ? existingRecoveryState
          : null;

      cacheSet(CACHE_KEY, {
        snapshot: carriedForwardSnapshot,
        snapshotState: "last-safe",
        recoveryState,
        cachedAt: nowMs,
      });

      return createResponse(carriedForwardSnapshot, "last-safe", refreshIntervalMs, recoveryState);
    }

    const fallbackSnapshot = createReducedConfidenceFallbackSnapshot(now.toISOString());

    cacheSet(CACHE_KEY, {
      snapshot: fallbackSnapshot,
      snapshotState: "fallback",
      recoveryState: {
        phase: "unavailable",
        recoveredAt: null,
        recoverySource: "none",
        livePublicationResumed: false,
        resumedAt: null,
      },
      cachedAt: nowMs,
    });

    return createResponse(fallbackSnapshot, "fallback", refreshIntervalMs, {
      phase: "unavailable",
      recoveredAt: null,
      recoverySource: "none",
      livePublicationResumed: false,
      resumedAt: null,
    });
  }
}

export async function getLatestAvailableDashboardApiResponse({
  now = new Date(),
  refreshIntervalMs = Number(process.env.DASHBOARD_REFRESH_INTERVAL_MS ?? DEFAULT_REFRESH_INTERVAL_MS),
  cacheGet = getMemoryCacheEntry,
  cacheSet = setMemoryCacheEntry,
  readSnapshot = readStoredDashboardSnapshot,
  readRecoveryState = readDashboardRecoveryState,
  recordRestartRecovery = recordDashboardRestartRecovery,
} = {}) {
  const cachedEntry = cacheGet(CACHE_KEY);

  if (cachedEntry) {
    return createResponse(
      cachedEntry.snapshot,
      cachedEntry.snapshotState,
      refreshIntervalMs,
      cachedEntry.recoveryState,
    );
  }

  const storedSnapshot = await readSnapshot();
  const existingRecoveryState = await readRecoveryState();

  if (storedSnapshot) {
    const carriedForwardSnapshot = createCarriedForwardSnapshot(storedSnapshot);
    const recoveryState =
      existingRecoveryState?.phase === "recovering" && !existingRecoveryState.livePublicationResumed
        ? existingRecoveryState
        : await recordRestartRecovery({ now });

    cacheSet(CACHE_KEY, {
      snapshot: carriedForwardSnapshot,
      snapshotState: "last-safe",
      recoveryState,
      cachedAt: now.getTime(),
    });

    return createResponse(carriedForwardSnapshot, "last-safe", refreshIntervalMs, recoveryState);
  }

  return createResponse(createReducedConfidenceFallbackSnapshot(now.toISOString()), "fallback", refreshIntervalMs, {
    phase: "unavailable",
    recoveredAt: null,
    recoverySource: "none",
    livePublicationResumed: false,
    resumedAt: null,
  });
}
