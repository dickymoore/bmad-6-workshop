const DEGRADED_TRUST_STATES = new Set([
  "aging",
  "stale",
  "delayed",
  "reduced-confidence",
  "unavailable",
]);

const DEGRADED_SOURCE_STATES = new Set(["carried-forward", "unavailable"]);
const DEFAULT_SUMMARY = "No degraded areas are narrowing the public picture.";

function freezeList(items) {
  return Object.freeze(items.map((item) => Object.freeze(item)));
}

function hasText(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isDegradedTrust(signal) {
  return Boolean(signal) && DEGRADED_TRUST_STATES.has(signal.state);
}

function isDegradedSource(signal) {
  return Boolean(signal) && DEGRADED_SOURCE_STATES.has(signal.state);
}

function createSignal(label, signal, fallbackDetail) {
  const detail = hasText(signal?.detail) ? signal.detail.trim() : hasText(fallbackDetail) ? fallbackDetail.trim() : null;

  if (!detail) {
    return null;
  }

  return {
    label,
    stateLabel: hasText(signal?.label) ? signal.label.trim() : "Attention needed",
    detail,
  };
}

function createArea({ id, areaLabel, scopeHint = "local", signals }) {
  if (!Array.isArray(signals) || signals.length === 0) {
    return null;
  }

  return {
    id,
    areaLabel,
    scopeHint,
    signals: [...signals],
  };
}

function createHealthyArea(label) {
  return hasText(label) ? label.trim() : null;
}

function createModeHealthyArea(label) {
  if (!hasText(label)) {
    return null;
  }

  const trimmedLabel = label.trim();
  const verb = trimmedLabel === "Roads" || / and /i.test(trimmedLabel) ? "remain" : "remains";
  return `${trimmedLabel} ${verb} healthy nearby.`;
}

function getGlobalImpactScope({ areas, snapshot, snapshotState }) {
  const hasOverallImpact =
    snapshotState === "fallback" ||
    snapshot?.disruptionEmphasis?.level === "overall" ||
    areas.some((area) => area.scopeHint === "overall");

  if (hasOverallImpact) {
    return "Overall departure-picture impact";
  }

  if (areas.length > 1) {
    return "Multiple-local-signals impact";
  }

  return "Local-only impact";
}

function getSummary({ impactScope, affectedCount }) {
  if (affectedCount === 0) {
    return DEFAULT_SUMMARY;
  }

  if (impactScope === "Overall departure-picture impact") {
    return "Several degraded areas are affecting the overall departure picture.";
  }

  if (affectedCount === 1) {
    return "1 degraded area is narrowing the public picture.";
  }

  return `${affectedCount} degraded areas are narrowing the public picture.`;
}

function appendArea(areas, nextArea) {
  if (!nextArea) {
    return;
  }

  const existingArea = areas.find((area) => area.id === nextArea.id);

  if (!existingArea) {
    areas.push(nextArea);
    return;
  }

  const signalKeys = new Set(existingArea.signals.map((signal) => `${signal.label}:${signal.stateLabel}:${signal.detail}`));

  for (const signal of nextArea.signals) {
    const signalKey = `${signal.label}:${signal.stateLabel}:${signal.detail}`;
    if (!signalKeys.has(signalKey)) {
      existingArea.signals.push(signal);
      signalKeys.add(signalKey);
    }
  }

  if (nextArea.scopeHint === "overall") {
    existingArea.scopeHint = "overall";
  }
}

function getModeMap(snapshot) {
  const nearbyModes = Array.isArray(snapshot?.nearbyModes) ? snapshot.nearbyModes : [];
  return new Map(nearbyModes.map((mode) => [mode.key, mode]));
}

function addDisruptionEmphasisAreas({ areas, snapshot, modeMap }) {
  const disruptionEmphasis = snapshot?.disruptionEmphasis;

  if (
    !disruptionEmphasis ||
    disruptionEmphasis.level === "none" ||
    !Array.isArray(disruptionEmphasis.affectedModeKeys) ||
    disruptionEmphasis.affectedModeKeys.length === 0
  ) {
    return;
  }

  const stateLabel = disruptionEmphasis.level === "overall" ? "Overall picture affected" : "Affected nearby";

  for (const modeKey of disruptionEmphasis.affectedModeKeys) {
    const mode = modeMap.get(modeKey);
    if (!mode || !hasText(mode.label)) {
      continue;
    }

    appendArea(
      areas,
      createArea({
        id: mode.key,
        areaLabel: mode.label.trim(),
        scopeHint:
          disruptionEmphasis.level === "overall" || mode.disruptionScope === "overall-disrupted" ? "overall" : "local",
        signals: [
          createSignal(
            "Operational impact",
            {
              label: stateLabel,
              detail: disruptionEmphasis.detail ?? disruptionEmphasis.headline,
            },
            disruptionEmphasis.headline,
          ),
        ].filter(Boolean),
      }),
    );
  }
}

export function createDegradedImpactDiagnostics({ dashboardResponse } = {}) {
  const snapshot = dashboardResponse?.data ?? {};
  const snapshotState = dashboardResponse?.meta?.snapshotState ?? "fallback";

  const areas = [];
  const healthyAreas = [];
  const modeMap = getModeMap(snapshot);

  const weatherSignals = [];
  if (isDegradedSource(snapshot?.headerStatus?.weather)) {
    weatherSignals.push(createSignal("Weather source", snapshot.headerStatus.weather));
  }
  if (isDegradedTrust(snapshot?.headerTrust?.weather)) {
    weatherSignals.push(createSignal("Weather trust", snapshot.headerTrust.weather));
  }
  const weatherArea = createArea({
    id: "weather",
    areaLabel: "Weather",
    signals: weatherSignals,
  });
  if (weatherArea) {
    appendArea(areas, weatherArea);
  } else {
    healthyAreas.push(createHealthyArea("Weather remains healthy."));
  }

  const mobilitySignals = [];
  if (isDegradedSource(snapshot?.headerStatus?.mobility)) {
    mobilitySignals.push(createSignal("Movement source", snapshot.headerStatus.mobility));
  }
  if (isDegradedTrust(snapshot?.headerTrust?.mobility)) {
    mobilitySignals.push(createSignal("Movement trust", snapshot.headerTrust.mobility));
  }
  const mobilityArea = createArea({
    id: "mobility",
    areaLabel: "Movement",
    signals: mobilitySignals,
  });
  if (mobilityArea) {
    appendArea(areas, mobilityArea);
  } else {
    healthyAreas.push(createHealthyArea("Movement remains healthy."));
  }

  const localMapSignals = [];
  if (isDegradedSource(snapshot?.localMap?.sourceStatus) || snapshot?.localMap?.state === "fallback") {
    localMapSignals.push(
      createSignal(
        "Local frame source",
        snapshot?.localMap?.sourceStatus,
        snapshot?.localMap?.fallbackCopy ?? "The local frame is carried forward while richer locality detail narrows.",
      ),
    );
  }
  const localMapArea = createArea({
    id: "local-frame",
    areaLabel: "Local frame",
    signals: localMapSignals.filter(Boolean),
  });
  if (localMapArea) {
    appendArea(areas, localMapArea);
  } else {
    healthyAreas.push(createHealthyArea("The local frame remains healthy."));
  }

  const nearbyModes = Array.isArray(snapshot?.nearbyModes) ? snapshot.nearbyModes : [];
  for (const mode of nearbyModes) {
    const signals = [];

    if (isDegradedSource(mode?.sourceStatus)) {
      signals.push(createSignal(`${mode.label} source`, mode.sourceStatus));
    }

    if (isDegradedTrust(mode?.trust)) {
      signals.push(createSignal(`${mode.label} trust`, mode.trust));
    }

    const area = createArea({
      id: mode.key,
      areaLabel: mode.label,
      scopeHint: mode.disruptionScope === "overall-disrupted" ? "overall" : "local",
      signals: signals.filter(Boolean),
    });

    if (area) {
      appendArea(areas, area);
      continue;
    }

    if (mode?.disruptionScope === "unaffected-readable") {
      healthyAreas.push(createModeHealthyArea(mode.label));
    }
  }

  addDisruptionEmphasisAreas({ areas, snapshot, modeMap });

  const impactScope = getGlobalImpactScope({ areas, snapshot, snapshotState });
  const canConfirmHealthyAreas = snapshotState !== "fallback" && impactScope !== "Overall departure-picture impact";
  const affectedAreas = freezeList(
    areas.map((area) => ({
      id: area.id,
      areaLabel: area.areaLabel,
      impactScope,
      signals: freezeList(area.signals),
    })),
  );

  return Object.freeze({
    summary: getSummary({
      impactScope,
      affectedCount: affectedAreas.length,
    }),
    affectedAreas,
    healthyAreas: Object.freeze(canConfirmHealthyAreas ? [...new Set(healthyAreas.filter(Boolean))] : []),
  });
}
