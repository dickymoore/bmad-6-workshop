import { createDashboardSnapshot } from "./dashboard-snapshot.js";

function freezeRecord(value) {
  return Object.freeze({ ...value });
}

function createRecoveryMeta(recovery) {
  if (!recovery || typeof recovery !== "object") {
    throw new Error('Dashboard API response "meta.recovery" must be an object');
  }

  const { phase, recoveredAt, recoverySource, livePublicationResumed, resumedAt } = recovery;

  if (!["live", "recovering", "unavailable"].includes(phase)) {
    throw new Error('Dashboard API response "meta.recovery.phase" must be live, recovering, or unavailable');
  }

  if (!["stored-snapshot", "live-publish", "none"].includes(recoverySource)) {
    throw new Error(
      'Dashboard API response "meta.recovery.recoverySource" must be stored-snapshot, live-publish, or none',
    );
  }

  if (typeof livePublicationResumed !== "boolean") {
    throw new Error('Dashboard API response "meta.recovery.livePublicationResumed" must be a boolean');
  }

  for (const [fieldName, value] of Object.entries({ recoveredAt, resumedAt })) {
    if (value != null && (typeof value !== "string" || Number.isNaN(Date.parse(value)))) {
      throw new Error(`Dashboard API response "meta.recovery.${fieldName}" must be a valid ISO timestamp when present`);
    }
  }

  return freezeRecord({
    phase,
    recoveredAt: recoveredAt ?? null,
    recoverySource,
    livePublicationResumed,
    resumedAt: resumedAt ?? null,
  });
}

export function createDashboardApiResponse(data, meta) {
  const snapshot = createDashboardSnapshot(data);

  if (!meta || typeof meta !== "object") {
    throw new Error('Dashboard API response "meta" must be an object');
  }

  const { publishedAt, recovery, refreshIntervalMs, snapshotState, venueKey } = meta;

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
      recovery: createRecoveryMeta(recovery),
    }),
  });
}
