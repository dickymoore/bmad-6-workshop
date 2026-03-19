import { createDashboardSnapshot } from "../../contracts/dashboard-snapshot.js";
import { setMemoryCacheEntry } from "../cache/memory-cache.js";
import {
  appendStoredDashboardHistory,
  writeStoredDashboardSnapshot,
} from "../cache/snapshot-store.js";

const CACHE_KEY = "dashboard-snapshot";

export async function publishDashboardSnapshot({
  snapshot,
  snapshotState = "live",
  cacheSet = setMemoryCacheEntry,
  writeSnapshot = writeStoredDashboardSnapshot,
  appendHistory = appendStoredDashboardHistory,
} = {}) {
  const normalizedSnapshot = createDashboardSnapshot(snapshot);
  await writeSnapshot(normalizedSnapshot);
  await appendHistory(normalizedSnapshot);

  const cacheEntry = {
    snapshot: normalizedSnapshot,
    snapshotState,
    cachedAt: Date.now(),
  };

  cacheSet(CACHE_KEY, cacheEntry);
  return cacheEntry;
}
