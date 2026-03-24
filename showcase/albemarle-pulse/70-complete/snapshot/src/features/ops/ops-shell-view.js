export function createOpsShellViewModel(status) {
  const diagnostics = normalizeDiagnostics(status.diagnostics);

  return Object.freeze({
    readinessHeading: "Public readiness",
    readinessLabel: status.readiness.label,
    readinessSummary: status.readiness.summary,
    snapshotLabel: formatSnapshotState(status.evidence.snapshotState),
    publishedAt: formatPublishedAt(status.evidence.publishedAt),
    recoveryHeading: formatRecoveryHeading(status.evidence.recovery.phase),
    recoveryLabel: status.evidence.recovery.label,
    recoverySummary: status.evidence.recovery.summary,
    recoveryPhase: status.evidence.recovery.phase,
    recoveryAt: formatPublishedAt(status.evidence.recovery.recoveredAt),
    recoveryResumedAt: formatPublishedAt(status.evidence.recovery.resumedAt),
    recoverySourceLabel: formatRecoverySource(status.evidence.recovery.recoverySource),
    recoveryLiveLabel: status.evidence.recovery.livePublicationResumed ? "Fresh live detail resumed" : "Still carried forward",
    checks: status.checks.map((check) =>
      Object.freeze({
        ...check,
        cue: check.status === "pass" ? "OK" : "ATTN",
        cueLabel: check.status === "pass" ? "Pass" : "Attention needed",
      }),
    ),
    issuesHeading: "Current ops state",
    issues:
      status.issues.length === 0
        ? Object.freeze(["No active issues are narrowing the public read."])
        : status.issues,
    diagnosticsHeading: "Degraded impact",
    diagnosticsSummary: diagnostics.summary,
    diagnosticsAreas: diagnostics.affectedAreas.map((area) =>
      Object.freeze({
        ...area,
        signals: area.signals.map((signal) => Object.freeze(signal)),
      }),
    ),
    healthyAreasHeading: "Still healthy",
    healthyAreas: Object.freeze(diagnostics.healthyAreas),
  });
}

/**
 * @param {{
 *   actionResult?: {
 *     action?: string;
 *     status?: string;
 *     summary?: string;
 *     completedAt?: string | null;
 *     readiness?: {
 *       label?: string;
 *       summary?: string;
 *     };
 *     attentionDetails?: readonly string[];
 *   } | null;
 *   errorMessage?: string | null;
 *   isPending?: boolean;
 * }} [options]
 */
export function createOpsMaintenanceActionViewModel({
  actionResult,
  errorMessage,
  isPending = false,
} = {}) {
  const activeActionLabel =
    actionResult?.action === "trust-check" ? "Run trust check" : actionResult?.action === "refresh" ? "Run refresh" : null;

  return Object.freeze({
    isPending,
    disableActions: isPending,
    pendingMessage: isPending ? "Maintenance action is running from this local surface." : null,
    errorMessage:
      typeof errorMessage === "string" && errorMessage.trim().length > 0
        ? errorMessage.trim()
        : null,
    resultHeading: actionResult ? "Latest maintenance update" : "Maintenance actions",
    resultSummary: typeof actionResult?.summary === "string" ? actionResult.summary : null,
    resultStatusLabel:
      actionResult?.status === "succeeded"
        ? "Completed"
        : actionResult?.status === "attention"
          ? "Attention still needed"
          : null,
    actionLabel: activeActionLabel,
    completedAt: formatPublishedAt(actionResult?.completedAt ?? null),
    readinessLabel: actionResult?.readiness?.label ?? null,
    readinessSummary: actionResult?.readiness?.summary ?? null,
    attentionDetails:
      Array.isArray(actionResult?.attentionDetails) && actionResult.attentionDetails.length > 0
        ? actionResult.attentionDetails
        : Object.freeze([]),
  });
}

function normalizeDiagnostics(diagnostics) {
  if (!diagnostics || typeof diagnostics !== "object") {
    return {
      summary: "No degraded areas are narrowing the public picture.",
      affectedAreas: Object.freeze([]),
      healthyAreas: Object.freeze([]),
    };
  }

  const affectedAreas = Array.isArray(diagnostics.affectedAreas)
    ? diagnostics.affectedAreas
        .filter((area) => area && typeof area === "object")
        .map((area) =>
          Object.freeze({
            id: typeof area.id === "string" && area.id.trim().length > 0 ? area.id.trim() : "diagnostic-area",
            areaLabel:
              typeof area.areaLabel === "string" && area.areaLabel.trim().length > 0
                ? area.areaLabel.trim()
                : "Affected area",
            impactScope:
              typeof area.impactScope === "string" && area.impactScope.trim().length > 0
                ? area.impactScope.trim()
                : "Local-only impact",
            signals: Array.isArray(area.signals)
              ? area.signals
                  .filter((signal) => signal && typeof signal === "object")
                  .map((signal) =>
                    Object.freeze({
                      label:
                        typeof signal.label === "string" && signal.label.trim().length > 0
                          ? signal.label.trim()
                          : "Signal",
                      stateLabel:
                        typeof signal.stateLabel === "string" && signal.stateLabel.trim().length > 0
                          ? signal.stateLabel.trim()
                          : "Attention needed",
                      detail:
                        typeof signal.detail === "string" && signal.detail.trim().length > 0
                          ? signal.detail.trim()
                          : "Signal detail is temporarily unavailable from this local surface.",
                    }),
                  )
              : Object.freeze([]),
          }),
        )
    : Object.freeze([]);

  const healthyAreas = Array.isArray(diagnostics.healthyAreas)
    ? diagnostics.healthyAreas
        .filter((area) => typeof area === "string" && area.trim().length > 0)
        .map((area) => area.trim())
    : Object.freeze([]);

  return {
    summary:
      typeof diagnostics.summary === "string" && diagnostics.summary.trim().length > 0
        ? diagnostics.summary.trim()
        : "No degraded areas are narrowing the public picture.",
    affectedAreas,
    healthyAreas,
  };
}

function formatSnapshotState(snapshotState) {
  if (snapshotState === "last-safe") {
    return "Last safe";
  }

  if (snapshotState === "fallback") {
    return "Fallback";
  }

  return "Live";
}

function formatRecoveryHeading(recoveryPhase) {
  return recoveryPhase === "recovering" ? "Restart recovery" : "Recovery state";
}

function formatPublishedAt(publishedAt) {
  if (typeof publishedAt !== "string") {
    return "Not available";
  }

  const parsedAt = new Date(publishedAt);

  if (Number.isNaN(parsedAt.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/London",
  }).format(parsedAt);
}

function formatRecoverySource(recoverySource) {
  if (recoverySource === "stored-snapshot") {
    return "Stored snapshot";
  }

  if (recoverySource === "live-publish") {
    return "Fresh live publish";
  }

  return "No safe carried-forward source";
}
