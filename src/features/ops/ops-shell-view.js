export function createOpsShellViewModel(status) {
  const diagnostics = normalizeDiagnostics(status.diagnostics);

  return Object.freeze({
    readinessHeading: "Public readiness",
    readinessLabel: status.readiness.label,
    readinessSummary: status.readiness.summary,
    snapshotLabel: formatSnapshotState(status.evidence.snapshotState),
    publishedAt: formatPublishedAt(status.evidence.publishedAt),
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
