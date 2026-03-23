import {
  FRESHNESS_STATES,
  SOURCE_STATUS_STATES,
  TREND_STATES,
  TRUST_CONFIDENCE_STATES,
  createSourceStatus,
  createTrustSignal,
} from "./freshness.js";

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

export const LOCALITY_REFERENCE_KINDS = Object.freeze([
  "station",
  "stop",
  "corridor",
]);

export const DISRUPTION_EMPHASIS_LEVELS = Object.freeze([
  "none",
  "local",
  "overall",
]);

export const MODE_DISRUPTION_SCOPES = Object.freeze([
  "unaffected-readable",
  "locally-disrupted",
  "overall-disrupted",
]);

export const DASHBOARD_ADVISORY_LANGUAGE_PATTERN =
  /\bbest option\b|\brecommended\b|\bswitch to\b|\btake\b/i;

function freezeSnapshot(snapshot) {
  return Object.freeze({ ...snapshot });
}

function normalizeTrustSignal(signal, fieldName) {
  if (!signal || typeof signal !== "object") {
    throw new Error(`Dashboard trust field "${fieldName}" must be an object`);
  }

  const { state, label, detail, confidence } = signal;

  if (!FRESHNESS_STATES.includes(state)) {
    throw new Error(`Unsupported freshness state for "${fieldName}": ${state}`);
  }

  if (!TRUST_CONFIDENCE_STATES.includes(confidence)) {
    throw new Error(`Unsupported trust confidence state for "${fieldName}": ${confidence}`);
  }

  for (const [name, value] of Object.entries({ label, detail })) {
    if (typeof value !== "string" || value.trim().length === 0) {
      throw new Error(`Dashboard trust field "${fieldName}.${name}" must be a non-empty string`);
    }
  }

  for (const [name, value] of Object.entries({ label, detail })) {
    if (DASHBOARD_ADVISORY_LANGUAGE_PATTERN.test(value)) {
      throw new Error(`Dashboard trust field "${fieldName}.${name}" must stay fact-only`);
    }
  }

  return createTrustSignal({
    state,
    label: label.trim(),
    detail: detail.trim(),
    confidence,
  });
}

function normalizeHeaderTrust(headerTrust) {
  if (!headerTrust || typeof headerTrust !== "object") {
    throw new Error('Dashboard snapshot field "headerTrust" must be an object');
  }

  return freezeSnapshot({
    weather: normalizeTrustSignal(headerTrust.weather, "headerTrust.weather"),
    mobility: normalizeTrustSignal(headerTrust.mobility, "headerTrust.mobility"),
  });
}

function normalizeSourceStatus(sourceStatus, fieldName, fallbackState = "live") {
  if (sourceStatus == null) {
    return createSourceStatus({
      state: fallbackState,
    });
  }

  if (!sourceStatus || typeof sourceStatus !== "object") {
    throw new Error(`Dashboard source status field "${fieldName}" must be an object`);
  }

  const { state, label, detail } = sourceStatus;

  if (!SOURCE_STATUS_STATES.includes(state)) {
    throw new Error(`Unsupported dashboard source status for "${fieldName}": ${state}`);
  }

  for (const [name, value] of Object.entries({ label, detail })) {
    if (typeof value !== "string" || value.trim().length === 0) {
      throw new Error(`Dashboard source status field "${fieldName}.${name}" must be a non-empty string`);
    }

    if (DASHBOARD_ADVISORY_LANGUAGE_PATTERN.test(value)) {
      throw new Error(`Dashboard source status field "${fieldName}.${name}" must stay fact-only`);
    }
  }

  return createSourceStatus({
    state,
    label: label.trim(),
    detail: detail.trim(),
  });
}

function normalizeHeaderStatus(headerStatus) {
  if (headerStatus == null) {
    return freezeSnapshot({
      weather: createSourceStatus({ state: "live", subject: "Weather" }),
      mobility: createSourceStatus({ state: "live", subject: "Movement" }),
    });
  }

  if (!headerStatus || typeof headerStatus !== "object") {
    throw new Error('Dashboard snapshot field "headerStatus" must be an object');
  }

  return freezeSnapshot({
    weather: normalizeSourceStatus(headerStatus.weather, "headerStatus.weather"),
    mobility: normalizeSourceStatus(headerStatus.mobility, "headerStatus.mobility"),
  });
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

function normalizeLocalityReference(reference, fieldName) {
  if (!reference || typeof reference !== "object") {
    throw new Error(`Dashboard locality field "${fieldName}" must be an object`);
  }

  const { key, label, kind, caption } = reference;

  for (const [name, value] of Object.entries({ key, label, caption })) {
    if (typeof value !== "string" || value.trim().length === 0) {
      throw new Error(`Dashboard locality field "${fieldName}.${name}" must be a non-empty string`);
    }

    if (DASHBOARD_ADVISORY_LANGUAGE_PATTERN.test(value)) {
      throw new Error(`Dashboard locality field "${fieldName}.${name}" must stay fact-only`);
    }
  }

  if (!LOCALITY_REFERENCE_KINDS.includes(kind)) {
    throw new Error(`Unsupported dashboard locality kind for "${fieldName}": ${kind}`);
  }

  return freezeSnapshot({
    key: key.trim(),
    label: label.trim(),
    kind,
    caption: caption.trim(),
  });
}

function normalizeLocalMap(localMap) {
  if (!localMap || typeof localMap !== "object") {
    throw new Error('Dashboard snapshot field "localMap" must be an object');
  }

  const {
    title,
    state,
    sourceStatus,
    venueAnchor,
    nearbyReferences,
    selectedNearbyNodes,
    orientationSummary,
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

  if (nearbyReferences != null && !Array.isArray(nearbyReferences)) {
    throw new Error('Dashboard snapshot field "localMap.nearbyReferences" must be an array when present');
  }

  const normalizedNearbyReferences = Object.freeze(
    (nearbyReferences ?? []).map((reference, index) =>
      normalizeLocalityReference(reference, `localMap.nearbyReferences[${index}]`),
    ),
  );

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
    orientationSummary != null &&
    (typeof orientationSummary !== "string" || orientationSummary.trim().length === 0)
  ) {
    throw new Error('Dashboard snapshot field "localMap.orientationSummary" must be a non-empty string when present');
  }

  if (typeof orientationSummary === "string" && DASHBOARD_ADVISORY_LANGUAGE_PATTERN.test(orientationSummary)) {
    throw new Error('Dashboard snapshot field "localMap.orientationSummary" must stay fact-only');
  }

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
    sourceStatus: normalizeSourceStatus(sourceStatus, "localMap.sourceStatus"),
    venueAnchor: normalizedVenueAnchor,
    nearbyReferences: normalizedNearbyReferences,
    selectedNearbyNodes: normalizedNearbyNodes,
    orientationSummary: typeof orientationSummary === "string" ? orientationSummary.trim() : null,
    localityEmphasis:
      typeof localityEmphasis?.label === "string"
        ? freezeSnapshot({ label: localityEmphasis.label.trim() })
        : null,
    fallbackCopy: typeof fallbackCopy === "string" ? fallbackCopy.trim() : null,
  });
}

function normalizeNearbyModes(nearbyModes, overallState) {
  if (!Array.isArray(nearbyModes) || nearbyModes.length === 0) {
    throw new Error('Dashboard snapshot field "nearbyModes" must be a non-empty array');
  }

  const seenKeys = new Set();

  return Object.freeze(
    nearbyModes.map((mode, index) => {
      if (!mode || typeof mode !== "object") {
        throw new Error(`Dashboard nearby mode at index ${index} must be an object`);
      }

      const { key, label, state, disruptionScope, summary, nuance, trust, sourceStatus } = mode;

      for (const [field, value] of Object.entries({ key, label, summary })) {
        if (typeof value !== "string" || value.trim().length === 0) {
          throw new Error(`Dashboard nearby mode field "${field}" must be a non-empty string`);
        }
      }

      if (!NEARBY_MODE_STATES.includes(state)) {
        throw new Error(`Unsupported nearby mode state: ${state}`);
      }

      if (disruptionScope != null && !MODE_DISRUPTION_SCOPES.includes(disruptionScope)) {
        throw new Error(`Unsupported nearby mode disruption scope: ${disruptionScope}`);
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
        disruptionScope:
          disruptionScope ??
          (state === "disrupted"
            ? overallState === "disrupted"
              ? "overall-disrupted"
              : "locally-disrupted"
            : "unaffected-readable"),
        summary: summary.trim(),
        nuance: typeof nuance === "string" ? nuance.trim() : null,
        sourceStatus: normalizeSourceStatus(sourceStatus, `nearbyModes[${index}].sourceStatus`),
        trust: normalizeTrustSignal(trust, `nearbyModes[${index}].trust`),
      });
    }),
  );
}

function createDefaultDisruptionEmphasis({ overallState, nearbyModes }) {
  const affectedModeKeys = nearbyModes
    .filter((mode) => mode.state === "disrupted")
    .map((mode) => mode.key);

  if (overallState === "disrupted") {
    return freezeSnapshot({
      level: "overall",
      headline: "Disrupted across the departure picture",
      detail: "The nearby departure picture is under visible strain while remaining readable.",
      affectedModeKeys: Object.freeze(affectedModeKeys),
    });
  }

  if (affectedModeKeys.length > 0) {
    const affectedModes = nearbyModes.filter((mode) => affectedModeKeys.includes(mode.key));
    const headline =
      affectedModes.length === 1
        ? `${affectedModes[0].label} is disrupted nearby`
        : "Multiple nearby modes are disrupted";

    return freezeSnapshot({
      level: "local",
      headline,
      detail: "The affected nearby modes are under the most strain while the rest of the picture stays readable.",
      affectedModeKeys: Object.freeze(affectedModeKeys),
    });
  }

  return freezeSnapshot({
    level: "none",
    headline: null,
    detail: null,
    affectedModeKeys: Object.freeze([]),
  });
}

function normalizeDisruptionEmphasis(disruptionEmphasis, { overallState, nearbyModes }) {
  if (disruptionEmphasis == null) {
    return createDefaultDisruptionEmphasis({ overallState, nearbyModes });
  }

  if (!disruptionEmphasis || typeof disruptionEmphasis !== "object") {
    throw new Error('Dashboard snapshot field "disruptionEmphasis" must be an object when present');
  }

  const { level, headline, detail, affectedModeKeys } = disruptionEmphasis;

  if (!DISRUPTION_EMPHASIS_LEVELS.includes(level)) {
    throw new Error(`Unsupported disruption emphasis level: ${level}`);
  }

  if (!Array.isArray(affectedModeKeys)) {
    throw new Error('Dashboard snapshot field "disruptionEmphasis.affectedModeKeys" must be an array');
  }

  const knownModeKeys = new Set(nearbyModes.map((mode) => mode.key));
  const seenKeys = new Set();
  const normalizedAffectedModeKeys = Object.freeze(
    affectedModeKeys.map((key, index) => {
      if (typeof key !== "string" || key.trim().length === 0) {
        throw new Error(
          `Dashboard snapshot field "disruptionEmphasis.affectedModeKeys[${index}]" must be a non-empty string`,
        );
      }

      const normalizedKey = key.trim();

      if (!knownModeKeys.has(normalizedKey)) {
        throw new Error(`Dashboard disruption emphasis key "${normalizedKey}" must exist in nearbyModes`);
      }

      if (seenKeys.has(normalizedKey)) {
        throw new Error(`Dashboard disruption emphasis key "${normalizedKey}" must be unique`);
      }

      seenKeys.add(normalizedKey);
      return normalizedKey;
    }),
  );

  if (level === "none") {
    if (headline != null || detail != null || normalizedAffectedModeKeys.length > 0) {
      throw new Error('Dashboard disruption emphasis level "none" cannot include headline, detail, or affected modes');
    }

    return freezeSnapshot({
      level,
      headline: null,
      detail: null,
      affectedModeKeys: normalizedAffectedModeKeys,
    });
  }

  for (const [field, value] of Object.entries({ headline, detail })) {
    if (typeof value !== "string" || value.trim().length === 0) {
      throw new Error(`Dashboard snapshot field "disruptionEmphasis.${field}" must be a non-empty string`);
    }

    if (DASHBOARD_ADVISORY_LANGUAGE_PATTERN.test(value)) {
      throw new Error(`Dashboard snapshot field "disruptionEmphasis.${field}" must stay fact-only`);
    }
  }

  return freezeSnapshot({
    level,
    headline: headline.trim(),
    detail: detail.trim(),
    affectedModeKeys: normalizedAffectedModeKeys,
  });
}

export function createDashboardSnapshot(input) {
  const {
    publishedAt,
    overallState,
    overallTrend,
    weatherSummary,
    mobilitySummary,
    placeLabel,
    supportLabel,
    disruptionEmphasis,
    headerTrust,
    headerStatus,
    localMap,
    nearbyModes,
  } = input;

  if (typeof publishedAt !== "string" || Number.isNaN(Date.parse(publishedAt))) {
    throw new Error('Dashboard snapshot field "publishedAt" must be a valid ISO timestamp');
  }

  if (!OVERALL_DEPARTURE_STATES.includes(overallState)) {
    throw new Error(`Unsupported overall departure state: ${overallState}`);
  }

  if (overallTrend != null && !TREND_STATES.includes(overallTrend)) {
    throw new Error(`Unsupported dashboard trend state: ${overallTrend}`);
  }

  for (const [field, value] of Object.entries({
    weatherSummary,
    mobilitySummary,
    placeLabel,
    supportLabel,
  })) {
    if (typeof value !== "string" || value.trim().length === 0) {
      throw new Error(`Dashboard snapshot field "${field}" must be a non-empty string`);
    }
  }

  for (const [field, value] of Object.entries({
    weatherSummary,
    mobilitySummary,
    supportLabel,
  })) {
    if (DASHBOARD_ADVISORY_LANGUAGE_PATTERN.test(value)) {
      throw new Error(`Dashboard snapshot field "${field}" must stay fact-only`);
    }
  }

  const normalizedNearbyModes = normalizeNearbyModes(nearbyModes, overallState);
  const normalizedDisruptionEmphasis = normalizeDisruptionEmphasis(disruptionEmphasis, {
    overallState,
    nearbyModes: normalizedNearbyModes,
  });

  return freezeSnapshot({
    publishedAt,
    overallState,
    overallTrend: overallTrend ?? null,
    weatherSummary: weatherSummary.trim(),
    mobilitySummary: mobilitySummary.trim(),
    placeLabel: placeLabel.trim(),
    supportLabel: supportLabel.trim(),
    disruptionEmphasis: normalizedDisruptionEmphasis,
    headerTrust: normalizeHeaderTrust(headerTrust),
    headerStatus: normalizeHeaderStatus(headerStatus),
    localMap: normalizeLocalMap(localMap),
    nearbyModes: normalizedNearbyModes,
  });
}
