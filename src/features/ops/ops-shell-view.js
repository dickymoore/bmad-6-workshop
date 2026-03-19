export function createOpsShellViewModel(status) {
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
  });
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
