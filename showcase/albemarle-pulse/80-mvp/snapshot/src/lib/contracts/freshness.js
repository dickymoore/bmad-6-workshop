export const FRESHNESS_STATES = Object.freeze([
  "current",
  "aging",
  "stale",
  "delayed",
  "reduced-confidence",
  "unavailable",
]);

export const TREND_STATES = Object.freeze([
  "improving",
  "steady",
  "worsening",
]);

export const TRUST_CONFIDENCE_STATES = Object.freeze([
  "full",
  "narrowed",
]);

export const SOURCE_STATUS_STATES = Object.freeze([
  "live",
  "carried-forward",
  "unavailable",
]);

const FRESHNESS_LABELS = Object.freeze({
  current: "Current",
  aging: "Aging",
  stale: "Stale",
  delayed: "Delayed",
  "reduced-confidence": "Reduced confidence",
  unavailable: "Unavailable",
});

const SOURCE_STATUS_LABELS = Object.freeze({
  live: "Live",
  "carried-forward": "Carried forward",
  unavailable: "Unavailable",
});

const DEFAULT_DETAIL_BUILDERS = Object.freeze({
  current: (subject) => `${subject} is up to date.`,
  aging: (subject) => `${subject} is a few minutes old.`,
  stale: (subject) => `${subject} may be out of date.`,
  delayed: (subject) => `${subject} is delayed.`,
  "reduced-confidence": (subject) => `${subject} has reduced confidence.`,
  unavailable: (subject) => `${subject} is unavailable.`,
});

const DEFAULT_SOURCE_STATUS_BUILDERS = Object.freeze({
  live: (subject) => `${subject} is live.`,
  "carried-forward": (subject) => `${subject} is showing the last available update.`,
  unavailable: (subject) => `${subject} is unavailable.`,
});

export function getFreshnessLabel(state) {
  if (!FRESHNESS_STATES.includes(state)) {
    throw new Error(`Unsupported freshness state: ${state}`);
  }

  return FRESHNESS_LABELS[state];
}

export function createTrustSignal({
  state,
  label = getFreshnessLabel(state),
  detail,
  confidence = state === "current" ? "full" : "narrowed",
  subject = "This signal",
} = {}) {
  if (!FRESHNESS_STATES.includes(state)) {
    throw new Error(`Unsupported freshness state: ${state}`);
  }

  if (!TRUST_CONFIDENCE_STATES.includes(confidence)) {
    throw new Error(`Unsupported trust confidence state: ${confidence}`);
  }

  const normalizedLabel = typeof label === "string" ? label.trim() : "";
  const normalizedDetail =
    typeof detail === "string" && detail.trim().length > 0
      ? detail.trim()
      : DEFAULT_DETAIL_BUILDERS[state](subject);

  if (normalizedLabel.length === 0) {
    throw new Error('Trust signal field "label" must be a non-empty string');
  }

  if (normalizedDetail.length === 0) {
    throw new Error('Trust signal field "detail" must be a non-empty string');
  }

  return Object.freeze({
    state,
    label: normalizedLabel,
    detail: normalizedDetail,
    confidence,
  });
}

export function createSourceStatus({
  state,
  label = SOURCE_STATUS_LABELS[state],
  detail,
  subject = "This source",
  confirmedAt = null,
} = {}) {
  if (!SOURCE_STATUS_STATES.includes(state)) {
    throw new Error(`Unsupported source status state: ${state}`);
  }

  const normalizedLabel = typeof label === "string" ? label.trim() : "";
  const normalizedDetail =
    typeof detail === "string" && detail.trim().length > 0
      ? detail.trim()
      : DEFAULT_SOURCE_STATUS_BUILDERS[state](subject);

  if (normalizedLabel.length === 0) {
    throw new Error('Source status field "label" must be a non-empty string');
  }

  if (normalizedDetail.length === 0) {
    throw new Error('Source status field "detail" must be a non-empty string');
  }

  const normalizedConfirmedAt =
    typeof confirmedAt === "string" && confirmedAt.trim().length > 0 ? confirmedAt.trim() : null;

  return Object.freeze({
    state,
    label: normalizedLabel,
    detail: normalizedDetail,
    confirmedAt: normalizedConfirmedAt,
  });
}

export function classifyFreshnessState({
  now,
  observedAt,
  fallbackAt,
  missedRefreshes = 0,
  reducedConfidence = false,
  unavailable = false,
} = {}) {
  if (unavailable) {
    return "unavailable";
  }

  if (reducedConfidence) {
    return "reduced-confidence";
  }

  const referenceTimestamp = observedAt ?? fallbackAt;
  const referenceMs =
    typeof referenceTimestamp === "string" ? Date.parse(referenceTimestamp) : Number.NaN;
  const nowMs = now instanceof Date ? now.getTime() : Date.parse(String(now ?? ""));

  if (Number.isNaN(referenceMs) || Number.isNaN(nowMs)) {
    return "reduced-confidence";
  }

  const ageMs = Math.max(0, nowMs - referenceMs);

  if (missedRefreshes >= 2 || ageMs > 15 * 60_000) {
    return "delayed";
  }

  if (ageMs > 10 * 60_000) {
    return "stale";
  }

  if (ageMs > 5 * 60_000) {
    return "aging";
  }

  return "current";
}

export function buildTrustSignal({
  now,
  observedAt,
  fallbackAt,
  missedRefreshes = 0,
  reducedConfidence = false,
  unavailable = false,
  subject = "This signal",
} = {}) {
  const state = classifyFreshnessState({
    now,
    observedAt,
    fallbackAt,
    missedRefreshes,
    reducedConfidence,
    unavailable,
  });

  return createTrustSignal({
    state,
    subject,
  });
}
