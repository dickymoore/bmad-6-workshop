export const OVERALL_DEPARTURE_STATES = Object.freeze([
  "calm",
  "watchful",
  "strained",
  "disrupted",
]);

export const NEARBY_MODE_STATES = Object.freeze([
  "available",
  "caution",
  "disrupted",
]);

export const DASHBOARD_ADVISORY_LANGUAGE_PATTERN =
  /\bbest option\b|\brecommended\b|\bswitch to\b|\btake\b/i;

function freezeSnapshot(snapshot) {
  return Object.freeze({ ...snapshot });
}

function normalizeNearbyModes(nearbyModes) {
  if (!Array.isArray(nearbyModes) || nearbyModes.length === 0) {
    throw new Error('Dashboard snapshot field "nearbyModes" must be a non-empty array');
  }

  const seenKeys = new Set();

  return Object.freeze(
    nearbyModes.map((mode, index) => {
      if (!mode || typeof mode !== "object") {
        throw new Error(`Dashboard nearby mode at index ${index} must be an object`);
      }

      const { key, label, state, summary, nuance } = mode;

      for (const [field, value] of Object.entries({ key, label, summary })) {
        if (typeof value !== "string" || value.trim().length === 0) {
          throw new Error(`Dashboard nearby mode field "${field}" must be a non-empty string`);
        }
      }

      if (!NEARBY_MODE_STATES.includes(state)) {
        throw new Error(`Unsupported nearby mode state: ${state}`);
      }

      for (const [field, value] of Object.entries({
        label,
        summary,
        ...(typeof nuance === "string" ? { nuance } : {}),
      })) {
        if (DASHBOARD_ADVISORY_LANGUAGE_PATTERN.test(value)) {
          throw new Error(`Dashboard nearby mode field "${field}" must stay fact-only`);
        }
      }

      if (nuance != null && (typeof nuance !== "string" || nuance.trim().length === 0)) {
        throw new Error('Dashboard nearby mode field "nuance" must be a non-empty string when present');
      }

      const normalizedKey = key.trim();

      if (seenKeys.has(normalizedKey)) {
        throw new Error(`Dashboard nearby mode key "${normalizedKey}" must be unique`);
      }

      seenKeys.add(normalizedKey);

      return freezeSnapshot({
        key: normalizedKey,
        label: label.trim(),
        state,
        summary: summary.trim(),
        nuance: typeof nuance === "string" ? nuance.trim() : null,
      });
    }),
  );
}

export function createDashboardSnapshot(input) {
  const {
    overallState,
    weatherSummary,
    mobilitySummary,
    placeLabel,
    freshnessLabel,
    supportLabel,
    nearbyModes,
  } = input;

  if (!OVERALL_DEPARTURE_STATES.includes(overallState)) {
    throw new Error(`Unsupported overall departure state: ${overallState}`);
  }

  for (const [field, value] of Object.entries({
    weatherSummary,
    mobilitySummary,
    placeLabel,
    freshnessLabel,
    supportLabel,
  })) {
    if (typeof value !== "string" || value.trim().length === 0) {
      throw new Error(`Dashboard snapshot field "${field}" must be a non-empty string`);
    }
  }

  for (const [field, value] of Object.entries({
    weatherSummary,
    mobilitySummary,
    freshnessLabel,
    supportLabel,
  })) {
    if (DASHBOARD_ADVISORY_LANGUAGE_PATTERN.test(value)) {
      throw new Error(`Dashboard snapshot field "${field}" must stay fact-only`);
    }
  }

  return freezeSnapshot({
    overallState,
    weatherSummary: weatherSummary.trim(),
    mobilitySummary: mobilitySummary.trim(),
    placeLabel: placeLabel.trim(),
    freshnessLabel: freshnessLabel.trim(),
    supportLabel: supportLabel.trim(),
    nearbyModes: normalizeNearbyModes(nearbyModes),
  });
}
