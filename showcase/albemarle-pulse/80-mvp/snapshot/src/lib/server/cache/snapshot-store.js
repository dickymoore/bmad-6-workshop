import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";

import { createDashboardSnapshot } from "../../contracts/dashboard-snapshot.js";

const SNAPSHOT_PATH = resolve(process.cwd(), "runtime", "snapshots", "dashboard-snapshot.json");
const HISTORY_PATH = resolve(process.cwd(), "runtime", "snapshots", "dashboard-history.json");
const HISTORY_WINDOW_MS = 15 * 60_000;

function createHistoryEntry(snapshot) {
  return {
    publishedAt: snapshot.publishedAt,
    overallState: snapshot.overallState,
    nearbyModes: snapshot.nearbyModes.map((mode) => ({
      key: mode.key,
      state: mode.state,
    })),
  };
}

function pruneHistory(history, nowMs) {
  return history.filter((entry) => {
    const publishedAtMs = Date.parse(entry?.publishedAt ?? "");
    return !Number.isNaN(publishedAtMs) && nowMs - publishedAtMs <= HISTORY_WINDOW_MS;
  });
}

export async function readStoredDashboardSnapshot(snapshotPath = SNAPSHOT_PATH) {
  try {
    const fileContents = await readFile(snapshotPath, "utf8");
    return createDashboardSnapshot(JSON.parse(fileContents));
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
      return null;
    }

    throw error;
  }
}

export async function writeStoredDashboardSnapshot(snapshot, snapshotPath = SNAPSHOT_PATH) {
  await mkdir(dirname(snapshotPath), { recursive: true });
  await writeFile(snapshotPath, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
  return createDashboardSnapshot(snapshot);
}

export async function readStoredDashboardHistory(historyPath = HISTORY_PATH) {
  try {
    const fileContents = await readFile(historyPath, "utf8");
    const parsed = JSON.parse(fileContents);

    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
      return [];
    }

    throw error;
  }
}

export async function writeStoredDashboardHistory(history, historyPath = HISTORY_PATH) {
  await mkdir(dirname(historyPath), { recursive: true });
  await writeFile(historyPath, `${JSON.stringify(history, null, 2)}\n`, "utf8");
  return history;
}

export async function appendStoredDashboardHistory(snapshot, historyPath = HISTORY_PATH) {
  const normalizedSnapshot = createDashboardSnapshot(snapshot);
  const existingHistory = await readStoredDashboardHistory(historyPath);
  const nextHistory = pruneHistory(
    [...existingHistory, createHistoryEntry(normalizedSnapshot)],
    Date.parse(normalizedSnapshot.publishedAt),
  );

  await writeStoredDashboardHistory(nextHistory, historyPath);
  return nextHistory;
}

export function getDashboardSnapshotPath() {
  return join("runtime", "snapshots", "dashboard-snapshot.json");
}

export function getDashboardHistoryPath() {
  return join("runtime", "snapshots", "dashboard-history.json");
}
