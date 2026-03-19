import { getDashboardApiResponse } from "../dashboard/dashboard-service.js";
import { createDegradedImpactDiagnostics } from "./get-degraded-impact-diagnostics.js";

const READINESS_LABELS = Object.freeze({
  current: "Current",
  "reduced-confidence": "Reduced confidence",
  unavailable: "Unavailable",
});

const READINESS_SUMMARIES = Object.freeze({
  current: "Public display is current and ready for service.",
  "reduced-confidence": "Public display stays readable with reduced confidence.",
  unavailable: "Public display is unavailable for normal public trust.",
});

const CHECK_DEFINITIONS = Object.freeze([
  Object.freeze({
    id: "main-layout",
    label: "Main layout is present",
    passDetail: "The main public layout is visible.",
    failDetail: "The main public layout is incomplete in this read.",
    test(snapshot) {
      return (
        hasText(snapshot?.placeLabel) &&
        hasText(snapshot?.weatherSummary) &&
        hasText(snapshot?.mobilitySummary) &&
        hasText(snapshot?.supportLabel) &&
        hasText(snapshot?.localMap?.title) &&
        Array.isArray(snapshot?.nearbyModes) &&
        snapshot.nearbyModes.length > 0
      );
    },
  }),
  Object.freeze({
    id: "overall-state",
    label: "Overall departure state is present",
    passDetail: "The overall departure state is visible for staff review.",
    failDetail: "The overall departure state is missing from this read.",
    test(snapshot) {
      return hasText(snapshot?.overallState);
    },
  }),
  Object.freeze({
    id: "trust-labeling",
    label: "Trust labeling is present",
    passDetail: "Trust and source labels are present for the displayed signals.",
    failDetail: "Trust or source labels are missing for part of the displayed signals.",
    test(snapshot) {
      return hasTrustLabeling(snapshot);
    },
  }),
]);

function hasText(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function hasSignalLabel(signal) {
  return hasText(signal?.label) && hasText(signal?.detail);
}

function hasTrustLabeling(snapshot) {
  const headerSignals = [
    snapshot?.headerTrust?.weather,
    snapshot?.headerTrust?.mobility,
    snapshot?.headerStatus?.weather,
    snapshot?.headerStatus?.mobility,
    snapshot?.localMap?.sourceStatus,
  ];
  const nearbyModes = Array.isArray(snapshot?.nearbyModes) ? snapshot.nearbyModes : [];

  return (
    headerSignals.every(hasSignalLabel) &&
    nearbyModes.length > 0 &&
    nearbyModes.every((mode) => hasSignalLabel(mode?.trust) && hasSignalLabel(mode?.sourceStatus))
  );
}

function createCheck(definition, snapshot) {
  const passes = definition.test(snapshot);

  return Object.freeze({
    id: definition.id,
    label: definition.label,
    status: passes ? "pass" : "attention",
    detail: passes ? definition.passDetail : definition.failDetail,
  });
}

function collectAttentionSignals(snapshot) {
  const signals = [
    snapshot?.headerStatus?.weather,
    snapshot?.headerStatus?.mobility,
    snapshot?.headerTrust?.weather,
    snapshot?.headerTrust?.mobility,
    snapshot?.localMap?.sourceStatus,
    ...(Array.isArray(snapshot?.nearbyModes)
      ? snapshot.nearbyModes.flatMap((mode) => [mode?.sourceStatus, mode?.trust])
      : []),
  ];

  return signals.filter((signal) => {
    if (!signal || !hasText(signal.detail)) {
      return false;
    }

    return ["aging", "carried-forward", "unavailable", "stale", "delayed", "reduced-confidence"].includes(
      signal.state,
    );
  });
}

function createIssues(snapshot, snapshotState, checks) {
  const issues = [
    ...new Set([
      ...collectAttentionSignals(snapshot).map((signal) => signal.detail.trim()),
      ...checks.filter((check) => check.status === "attention").map((check) => check.detail.trim()),
    ]),
  ];

  if (issues.length === 0 && snapshotState === "last-safe") {
    issues.push("The public picture is carried forward while live detail narrows.");
  }

  return issues;
}

function classifyReadiness({ snapshot, snapshotState, checks, issues }) {
  const hasMissingPublicChecks = checks.some((check) => check.status === "attention");

  if (snapshotState === "fallback" || hasMissingPublicChecks) {
    return "unavailable";
  }

  if (snapshotState === "last-safe" || issues.length > 0 || snapshot?.localMap?.state === "fallback") {
    return "reduced-confidence";
  }

  return "current";
}

export function createOpsHealthPayload({ dashboardResponse } = {}) {
  const snapshot = dashboardResponse?.data ?? {};
  const snapshotState = dashboardResponse?.meta?.snapshotState ?? "fallback";
  const publishedAt = dashboardResponse?.meta?.publishedAt ?? null;
  const checks = CHECK_DEFINITIONS.map((definition) => createCheck(definition, snapshot));
  const issues = createIssues(snapshot, snapshotState, checks);
  const diagnostics = createDegradedImpactDiagnostics({ dashboardResponse });
  const readinessState = classifyReadiness({
    snapshot,
    snapshotState,
    checks,
    issues,
  });

  return Object.freeze({
    readiness: Object.freeze({
      state: readinessState,
      label: READINESS_LABELS[readinessState],
      summary: READINESS_SUMMARIES[readinessState],
    }),
    checks: Object.freeze(checks),
    issues: Object.freeze(issues),
    diagnostics,
    evidence: Object.freeze({
      snapshotState,
      publishedAt,
    }),
  });
}

export async function getOpsHealthPayload({
  getDashboardResponse = getDashboardApiResponse,
} = {}) {
  try {
    const dashboardResponse = await getDashboardResponse();
    return createOpsHealthPayload({ dashboardResponse });
  } catch {
    return Object.freeze({
      readiness: Object.freeze({
        state: "unavailable",
        label: READINESS_LABELS.unavailable,
        summary: READINESS_SUMMARIES.unavailable,
      }),
      checks: Object.freeze(
        CHECK_DEFINITIONS.map((definition) =>
          Object.freeze({
            id: definition.id,
            label: definition.label,
            status: "attention",
            detail: definition.failDetail,
          }),
        ),
      ),
      issues: Object.freeze(["Live readiness could not be confirmed from this local surface."]),
      diagnostics: Object.freeze({
        summary: "Detailed degraded diagnostics could not be confirmed from this local surface.",
        affectedAreas: Object.freeze([]),
        healthyAreas: Object.freeze([]),
      }),
      evidence: Object.freeze({
        snapshotState: "fallback",
        publishedAt: null,
      }),
    });
  }
}
