import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";

import { createDashboardSnapshot } from "../../contracts/dashboard-snapshot.js";

const SNAPSHOT_PATH = resolve(process.cwd(), "runtime", "snapshots", "dashboard-snapshot.json");

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

export function getDashboardSnapshotPath() {
  return join("runtime", "snapshots", "dashboard-snapshot.json");
}
