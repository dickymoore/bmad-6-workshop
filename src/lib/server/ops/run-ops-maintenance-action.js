import {
  getDashboardApiResponse,
  getLatestAvailableDashboardApiResponse,
} from "../dashboard/dashboard-service.js";
import { createOpsHealthPayload } from "./get-ops-health.js";

const SUPPORTED_ACTIONS = Object.freeze(["refresh", "trust-check"]);

function createActionSummary({ action, snapshotState, readinessState }) {
  if (action === "refresh") {
    if (snapshotState === "live" && readinessState === "current") {
      return {
        status: "succeeded",
        summary: "Refresh completed and the public view is current.",
      };
    }

    if (snapshotState === "live") {
      return {
        status: "attention",
        summary: "Refresh completed with reduced confidence.",
      };
    }

    if (snapshotState === "last-safe") {
      return {
        status: "attention",
        summary: "Refresh could not confirm fresh live detail; the last safe picture remains in service.",
      };
    }

    return {
      status: "attention",
      summary: "Refresh could not confirm a safe public picture from this local surface.",
    };
  }

  if (readinessState === "current") {
    return {
      status: "succeeded",
      summary: "Trust check completed and the public view remains current.",
    };
  }

  if (readinessState === "reduced-confidence") {
    return {
      status: "attention",
      summary: "Trust check completed with reduced confidence.",
    };
  }

  return {
    status: "attention",
    summary: "Trust check could not confirm normal public trust from this local surface.",
  };
}

export function createUnsupportedOpsMaintenanceActionError(action) {
  const error = new Error(`UNSUPPORTED_OPS_ACTION:${String(action ?? "")}`);
  error.name = "UnsupportedOpsMaintenanceActionError";
  return error;
}

export function isUnsupportedOpsMaintenanceActionError(error) {
  return error instanceof Error && error.message.startsWith("UNSUPPORTED_OPS_ACTION:");
}

export function isSupportedOpsMaintenanceAction(action) {
  return SUPPORTED_ACTIONS.includes(action);
}

/**
 * @param {{
 *   action: "refresh" | "trust-check";
 *   now?: Date;
 *   getDashboardResponse?: typeof getDashboardApiResponse;
 *   getLatestDashboardResponse?: typeof getLatestAvailableDashboardApiResponse;
 * }} [options]
 */
export async function runOpsMaintenanceAction({
  action,
  now = new Date(),
  getDashboardResponse = getDashboardApiResponse,
  getLatestDashboardResponse = getLatestAvailableDashboardApiResponse,
} = {}) {
  if (!isSupportedOpsMaintenanceAction(action)) {
    throw createUnsupportedOpsMaintenanceActionError(action);
  }

  const dashboardResponse =
    action === "refresh"
      ? await getDashboardResponse({ now, forceRefresh: true })
      : await getLatestDashboardResponse({ now });
  const health = createOpsHealthPayload({ dashboardResponse });
  const { status, summary } = createActionSummary({
    action,
    snapshotState: dashboardResponse.meta.snapshotState,
    readinessState: health.readiness.state,
  });

  return Object.freeze({
    action,
    status,
    summary,
    completedAt: now.toISOString(),
    readiness: health.readiness,
    diagnostics: health.diagnostics,
    checks: health.checks,
    issues: health.issues,
    evidence: health.evidence,
    attentionDetails: status === "attention" ? health.issues : undefined,
  });
}
