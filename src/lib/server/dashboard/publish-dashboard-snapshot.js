import { createDashboardSnapshot } from "../../contracts/dashboard-snapshot.js";
import { setMemoryCacheEntry } from "../cache/memory-cache.js";
import {
  appendStoredDashboardHistory,
  writeStoredDashboardSnapshot,
} from "../cache/snapshot-store.js";
import {
  recordDashboardLiveRecoveryResumed,
  writeDashboardRecoveryState,
} from "./recovery-state.js";

const CACHE_KEY = "dashboard-snapshot";

export async function publishDashboardSnapshot({
  snapshot,
  snapshotState = "live",
  cacheSet = setMemoryCacheEntry,
  writeSnapshot = writeStoredDashboardSnapshot,
  appendHistory = appendStoredDashboardHistory,
  readRecoveryState,
  writeRecoveryState = writeDashboardRecoveryState,
  updateRecoveryState = recordDashboardLiveRecoveryResumed,
} = {}) {
  const normalizedSnapshot = createDashboardSnapshot(snapshot);
  await writeSnapshot(normalizedSnapshot);
  await appendHistory(normalizedSnapshot);
  const existingRecoveryState = typeof readRecoveryState === "function" ? await readRecoveryState() : null;
  const recoveryState = await updateRecoveryState({
    now: new Date(normalizedSnapshot.publishedAt),
    existingRecoveryState,
    writeRecoveryState,
  });

  const cacheEntry = {
    snapshot: normalizedSnapshot,
    snapshotState,
    recoveryState,
    cachedAt: Date.now(),
  };

  cacheSet(CACHE_KEY, cacheEntry);
  return cacheEntry;
}
