export const OVERALL_DEPARTURE_STATES = Object.freeze([
  "calm",
  "watchful",
  "strained",
  "disrupted",
]);

export const DASHBOARD_ADVISORY_LANGUAGE_PATTERN =
  /\bbest option\b|\brecommended\b|\bswitch to\b|\btake\b/i;

function freezeSnapshot(snapshot) {
  return Object.freeze({ ...snapshot });
}

export function createDashboardSnapshot(input) {
  const {
    overallState,
    weatherSummary,
    mobilitySummary,
    placeLabel,
    freshnessLabel,
    supportLabel,
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
  });
}
