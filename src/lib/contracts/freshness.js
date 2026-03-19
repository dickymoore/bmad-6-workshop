export const FRESHNESS_STATES = Object.freeze([
  "current",
  "aging",
  "stale",
  "delayed",
  "reduced-confidence",
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

const FRESHNESS_LABELS = Object.freeze({
  current: "Current",
  aging: "Aging",
  stale: "Stale",
  delayed: "Delayed",
  "reduced-confidence": "Reduced confidence",
});

const DEFAULT_DETAIL_BUILDERS = Object.freeze({
  current: (subject) => `${subject} is current for the foyer.`,
  aging: (subject) => `${subject} is aging slightly.`,
  stale: (subject) => `${subject} is stale and may have shifted.`,
  delayed: (subject) => `${subject} is delayed and should be read with care.`,
  "reduced-confidence": (subject) => `${subject} is less certain just now.`,
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

export function classifyFreshnessState({
  now,
  observedAt,
  fallbackAt,
  missedRefreshes = 0,
  reducedConfidence = false,
} = {}) {
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
  subject = "This signal",
} = {}) {
  const state = classifyFreshnessState({
    now,
    observedAt,
    fallbackAt,
    missedRefreshes,
    reducedConfidence,
  });

  return createTrustSignal({
    state,
    subject,
  });
}
