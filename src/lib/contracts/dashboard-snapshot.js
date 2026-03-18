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

export const LOCAL_MAP_STATES = Object.freeze([
  "default",
  "fallback",
]);

export const DASHBOARD_ADVISORY_LANGUAGE_PATTERN =
  /\bbest option\b|\brecommended\b|\bswitch to\b|\btake\b/i;

function freezeSnapshot(snapshot) {
  return Object.freeze({ ...snapshot });
}

function normalizeMapPoint(point, fieldName) {
  if (!point || typeof point !== "object") {
    throw new Error(`Dashboard local map field "${fieldName}" must be an object`);
  }

  const { key, label, x, y } = point;

  for (const [name, value] of Object.entries({ key, label })) {
    if (typeof value !== "string" || value.trim().length === 0) {
      throw new Error(`Dashboard local map field "${fieldName}.${name}" must be a non-empty string`);
    }
  }

  for (const [name, value] of Object.entries({ x, y })) {
    if (typeof value !== "number" || Number.isNaN(value) || value < 0 || value > 100) {
      throw new Error(`Dashboard local map field "${fieldName}.${name}" must be a number between 0 and 100`);
    }
  }

  if (DASHBOARD_ADVISORY_LANGUAGE_PATTERN.test(label)) {
    throw new Error(`Dashboard local map field "${fieldName}.label" must stay fact-only`);
  }

  return freezeSnapshot({
    key: key.trim(),
    label: label.trim(),
    x,
    y,
  });
}

function normalizeLocalMap(localMap) {
  if (!localMap || typeof localMap !== "object") {
    throw new Error('Dashboard snapshot field "localMap" must be an object');
  }

  const {
    title,
    state,
    venueAnchor,
    selectedNearbyNodes,
    localityEmphasis,
    fallbackCopy,
  } = localMap;

  if (typeof title !== "string" || title.trim().length === 0) {
    throw new Error('Dashboard snapshot field "localMap.title" must be a non-empty string');
  }

  if (DASHBOARD_ADVISORY_LANGUAGE_PATTERN.test(title)) {
    throw new Error('Dashboard snapshot field "localMap.title" must stay fact-only');
  }

  if (!LOCAL_MAP_STATES.includes(state)) {
    throw new Error(`Unsupported local map state: ${state}`);
  }

  const normalizedVenueAnchor = normalizeMapPoint(venueAnchor, "localMap.venueAnchor");

  if (!Array.isArray(selectedNearbyNodes) || selectedNearbyNodes.length === 0) {
    throw new Error('Dashboard snapshot field "localMap.selectedNearbyNodes" must be a non-empty array');
  }

  const seenKeys = new Set([normalizedVenueAnchor.key]);
  const normalizedNearbyNodes = Object.freeze(
    selectedNearbyNodes.map((node, index) => {
      const normalizedNode = normalizeMapPoint(node, `localMap.selectedNearbyNodes[${index}]`);

      if (seenKeys.has(normalizedNode.key)) {
        throw new Error(`Dashboard local map key "${normalizedNode.key}" must be unique`);
      }

      seenKeys.add(normalizedNode.key);
      return normalizedNode;
    }),
  );

  if (
    localityEmphasis != null &&
    (
      typeof localityEmphasis !== "object" ||
      typeof localityEmphasis.label !== "string" ||
      localityEmphasis.label.trim().length === 0
    )
  ) {
    throw new Error('Dashboard snapshot field "localMap.localityEmphasis.label" must be a non-empty string when present');
  }

  if (typeof localityEmphasis?.label === "string" && DASHBOARD_ADVISORY_LANGUAGE_PATTERN.test(localityEmphasis.label)) {
    throw new Error('Dashboard snapshot field "localMap.localityEmphasis.label" must stay fact-only');
  }

  if (fallbackCopy != null && (typeof fallbackCopy !== "string" || fallbackCopy.trim().length === 0)) {
    throw new Error('Dashboard snapshot field "localMap.fallbackCopy" must be a non-empty string when present');
  }

  if (typeof fallbackCopy === "string" && DASHBOARD_ADVISORY_LANGUAGE_PATTERN.test(fallbackCopy)) {
    throw new Error('Dashboard snapshot field "localMap.fallbackCopy" must stay fact-only');
  }

  if (state === "fallback" && typeof fallbackCopy !== "string") {
    throw new Error('Dashboard snapshot field "localMap.fallbackCopy" is required when state is "fallback"');
  }

  if (state !== "fallback" && fallbackCopy != null) {
    throw new Error('Dashboard snapshot field "localMap.fallbackCopy" is only allowed when state is "fallback"');
  }

  return freezeSnapshot({
    title: title.trim(),
    state,
    venueAnchor: normalizedVenueAnchor,
    selectedNearbyNodes: normalizedNearbyNodes,
    localityEmphasis:
      typeof localityEmphasis?.label === "string"
        ? freezeSnapshot({ label: localityEmphasis.label.trim() })
        : null,
    fallbackCopy: typeof fallbackCopy === "string" ? fallbackCopy.trim() : null,
  });
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
    localMap,
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
    localMap: normalizeLocalMap(localMap),
    nearbyModes: normalizeNearbyModes(nearbyModes),
  });
}
