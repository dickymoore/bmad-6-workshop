import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";

const RECOVERY_STATE_PATH = resolve(process.cwd(), "runtime", "snapshots", "dashboard-recovery.json");
const RECOVERY_PHASES = Object.freeze(["live", "recovering", "unavailable"]);
const RECOVERY_SOURCES = Object.freeze(["stored-snapshot", "live-publish", "none"]);

function normalizeTimestamp(value, fieldName) {
  if (value == null) {
    return null;
  }

  if (typeof value !== "string" || Number.isNaN(Date.parse(value))) {
    throw new Error(`Dashboard recovery state field "${fieldName}" must be a valid ISO timestamp when present`);
  }

  return value;
}

export function createDashboardRecoveryState(state = {}) {
  if (!state || typeof state !== "object") {
    throw new Error("Dashboard recovery state must be an object");
  }

  const {
    phase = "live",
    recoveredAt = null,
    recoverySource = phase === "unavailable" ? "none" : phase === "recovering" ? "stored-snapshot" : "live-publish",
    livePublicationResumed = phase === "live",
    resumedAt = livePublicationResumed ? recoveredAt : null,
  } = state;

  if (!RECOVERY_PHASES.includes(phase)) {
    throw new Error(`Unsupported dashboard recovery phase: ${phase}`);
  }

  if (!RECOVERY_SOURCES.includes(recoverySource)) {
    throw new Error(`Unsupported dashboard recovery source: ${recoverySource}`);
  }

  if (typeof livePublicationResumed !== "boolean") {
    throw new Error('Dashboard recovery state field "livePublicationResumed" must be a boolean');
  }

  return Object.freeze({
    phase,
    recoveredAt: normalizeTimestamp(recoveredAt, "recoveredAt"),
    recoverySource,
    livePublicationResumed,
    resumedAt: normalizeTimestamp(resumedAt, "resumedAt"),
  });
}

export async function readDashboardRecoveryState(recoveryStatePath = RECOVERY_STATE_PATH) {
  try {
    const fileContents = await readFile(recoveryStatePath, "utf8");
    return createDashboardRecoveryState(JSON.parse(fileContents));
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
      return null;
    }

    throw error;
  }
}

export async function writeDashboardRecoveryState(state, recoveryStatePath = RECOVERY_STATE_PATH) {
  const normalizedState = createDashboardRecoveryState(state);
  await mkdir(dirname(recoveryStatePath), { recursive: true });
  await writeFile(recoveryStatePath, `${JSON.stringify(normalizedState, null, 2)}\n`, "utf8");
  return normalizedState;
}

export async function recordDashboardRestartRecovery({ now = new Date(), writeRecoveryState = writeDashboardRecoveryState } = {}) {
  return writeRecoveryState({
    phase: "recovering",
    recoveredAt: now.toISOString(),
    recoverySource: "stored-snapshot",
    livePublicationResumed: false,
    resumedAt: null,
  });
}

export async function recordDashboardLiveRecoveryResumed({
  now = new Date(),
  existingRecoveryState = null,
  writeRecoveryState = writeDashboardRecoveryState,
} = {}) {
  const recoveredAt = existingRecoveryState?.recoveredAt ?? now.toISOString();

  return writeRecoveryState({
    phase: "live",
    recoveredAt,
    recoverySource: "live-publish",
    livePublicationResumed: true,
    resumedAt: now.toISOString(),
  });
}

export function createDashboardRecoveryMeta({ snapshotState, recoveryState } = {}) {
  const normalizedRecoveryState =
    recoveryState == null
      ? createDashboardRecoveryState({
          phase: snapshotState === "fallback" ? "unavailable" : "live",
          recoverySource: snapshotState === "fallback" ? "none" : "live-publish",
          livePublicationResumed: snapshotState !== "last-safe",
          recoveredAt: null,
          resumedAt: null,
        })
      : createDashboardRecoveryState(recoveryState);

  return Object.freeze({
    phase: normalizedRecoveryState.phase,
    recoveredAt: normalizedRecoveryState.recoveredAt,
    recoverySource: normalizedRecoveryState.recoverySource,
    livePublicationResumed: normalizedRecoveryState.livePublicationResumed,
    resumedAt: normalizedRecoveryState.resumedAt,
  });
}

export function getDashboardRecoveryStatePath() {
  return join("runtime", "snapshots", "dashboard-recovery.json");
}
