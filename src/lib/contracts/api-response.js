import { createDashboardSnapshot } from "./dashboard-snapshot.js";

function freezeRecord(value) {
  return Object.freeze({ ...value });
}

export function createDashboardApiResponse(data, meta) {
  const snapshot = createDashboardSnapshot(data);

  if (!meta || typeof meta !== "object") {
    throw new Error('Dashboard API response "meta" must be an object');
  }

  const { publishedAt, refreshIntervalMs, snapshotState, venueKey } = meta;

  if (typeof venueKey !== "string" || venueKey.trim().length === 0) {
    throw new Error('Dashboard API response "meta.venueKey" must be a non-empty string');
  }

  if (typeof publishedAt !== "string" || Number.isNaN(Date.parse(publishedAt))) {
    throw new Error('Dashboard API response "meta.publishedAt" must be a valid ISO timestamp');
  }

  if (typeof refreshIntervalMs !== "number" || !Number.isFinite(refreshIntervalMs) || refreshIntervalMs < 1_000) {
    throw new Error('Dashboard API response "meta.refreshIntervalMs" must be a number >= 1000');
  }

  if (!["live", "last-safe", "fallback"].includes(snapshotState)) {
    throw new Error('Dashboard API response "meta.snapshotState" must be live, last-safe, or fallback');
  }

  return freezeRecord({
    data: snapshot,
    meta: freezeRecord({
      venueKey: venueKey.trim(),
      publishedAt,
      refreshIntervalMs,
      snapshotState,
    }),
  });
}
