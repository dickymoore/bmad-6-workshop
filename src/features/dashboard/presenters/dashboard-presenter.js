import { createDashboardSnapshot } from "../../../lib/contracts/dashboard-snapshot.js";

const HEADLINES = Object.freeze({
  calm: "Calm across the Royal Institution threshold",
  watchful: "Watchful across the Royal Institution threshold",
  strained: "Strained across the Royal Institution threshold",
  disrupted: "Disrupted across the Royal Institution threshold",
});

const MODE_STATE_LABELS = Object.freeze({
  available: "Available",
  caution: "Caution",
  disrupted: "Disrupted",
});

const LOCAL_MAP_STATE_LABELS = Object.freeze({
  default: "Live local map",
  fallback: "Simplified local map",
});

const TREND_LABELS = Object.freeze({
  improving: "Improving",
  steady: "Steady",
  worsening: "Worsening",
});

const DASHBOARD_METADATA = Object.freeze({
  title: "Albemarle Pulse | Royal Institution departures",
  description: "Overall departure picture for the Royal Institution foyer.",
});

const DISRUPTION_LABELS = Object.freeze({
  none: null,
  local: "Local disruption",
  overall: "Serious disruption",
});

const MODE_DISRUPTION_LABELS = Object.freeze({
  "unaffected-readable": "Running nearby",
  "locally-disrupted": "Disrupted nearby",
  "overall-disrupted": "Wider disruption",
});

const LOCALITY_KIND_LABELS = Object.freeze({
  station: "Station",
  stop: "Stop",
  corridor: "Street",
});

const FALLBACK_LOCALITY_REFERENCE = Object.freeze({
  kind: "place",
  kindLabel: "Nearby place",
  caption: "Shown on the local frame",
});

const CANONICAL_MODE_ORDER = Object.freeze([
  "tube-rail",
  "bus",
  "roads",
  "cycles-scooters",
]);
const LONDON_SOURCE_TIME_FORMATTER = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "Europe/London",
});

function createTrendMessage(overallTrend) {
  if (overallTrend === "improving") {
    return "Conditions are improving.";
  }

  if (overallTrend === "worsening") {
    return "Conditions are getting worse.";
  }

  return "Conditions are stable.";
}

function createCurrentnessMessage() {
  return "Board refreshes in place.";
}

function formatConfirmedAt(confirmedAt) {
  if (typeof confirmedAt !== "string" || confirmedAt.trim().length === 0) {
    return null;
  }

  const parsedAt = new Date(confirmedAt);

  if (Number.isNaN(parsedAt.getTime())) {
    return null;
  }

  return LONDON_SOURCE_TIME_FORMATTER.format(parsedAt).replace(",", "");
}

function createDisplaySourceLabel(sourceStatus) {
  if (sourceStatus.state !== "carried-forward") {
    return sourceStatus.label;
  }

  const confirmedAtLabel = formatConfirmedAt(sourceStatus.confirmedAt);

  return confirmedAtLabel ? `Last confirmed ${confirmedAtLabel}` : "Last confirmed";
}

function createDisplaySourceDetail(sourceStatus) {
  if (sourceStatus.state !== "carried-forward") {
    return sourceStatus.detail;
  }

  const confirmedAtLabel = formatConfirmedAt(sourceStatus.confirmedAt);

  return confirmedAtLabel ? `Last confirmed ${confirmedAtLabel}.` : "Last confirmed update.";
}

function createLastConfirmedLine(subject, status) {
  const confirmedAtLabel = formatConfirmedAt(status.confirmedAt);

  return confirmedAtLabel ? `${subject} last confirmed ${confirmedAtLabel}.` : `${subject} last confirmed.`;
}

function createWeatherLead(weatherSummary, weatherStatus) {
  if (!weatherStatus.isLive) {
    return null;
  }

  const cue = createWeatherBoardCue(weatherSummary, weatherStatus);

  if (cue === "Dry") {
    return "Dry nearby.";
  }

  if (cue === "Clear") {
    return "Clear nearby.";
  }

  if (cue === "Cloudy") {
    return "Cloudy nearby.";
  }

  if (cue === "Rain") {
    return "Rain nearby.";
  }

  if (cue === "Wind") {
    return "Windy nearby.";
  }

  if (cue === "Mist") {
    return "Mist nearby.";
  }

  return null;
}

function createRecoveryCurrentnessMessage(recovery) {
  if (recovery?.phase === "recovering") {
    return "Board is recovering. Last safe data is on screen.";
  }

  return createCurrentnessMessage();
}

function normalizeSentence(text) {
  if (typeof text !== "string") {
    return null;
  }

  const trimmed = text.trim();

  if (!trimmed) {
    return null;
  }

  const [firstSentence] = trimmed.split(/(?<=[.!?])\s+/);

  if (!firstSentence) {
    return null;
  }

  return firstSentence.replace(/[.!?]+$/, "").trim();
}

function toSentence(text) {
  const normalized = normalizeSentence(text);
  return normalized ? `${normalized}.` : null;
}

function createCompactModeSummary(mode) {
  const sentence = normalizeSentence(mode.summary);

  if (!sentence) {
    return mode.summary;
  }

  return `${sentence
    .replace(/\bare still reading open\b/gi, "are running normally")
    .replace(/\bis still reading open\b/gi, "is running normally")
    .replace(/\bstill reading open\b/gi, "running normally")
    .replace(/\bis still flowing, with slower turns around the wetter junctions\b/gi, "is slower than normal")
    .replace(/\bstill flowing\b/gi, "moving")
    .replace(/\btemporarily unavailable in this nearby read\b/gi, "data is unavailable")
    .replace(/\bremain readable nearby\b/gi, "are running normally")
    .replace(/\s{2,}/g, " ")
    .trim()}.`;
}

function createModeSupportLine(mode) {
  const supportFragments = [];

  if (mode.sourceStatus.state !== "live") {
    supportFragments.push(createDisplaySourceLabel(mode.sourceStatus));
  }

  if (mode.trust.confidence === "narrowed") {
    supportFragments.push(mode.trust.state === "unavailable" ? "Unavailable" : "Read with care");
  }

  if (supportFragments.length > 0) {
    return `${supportFragments.join(". ")}.`;
  }

  if (mode.disruptionScope !== "unaffected-readable") {
    return toSentence(mode.nuance);
  }

  return null;
}

function orderNearbyModesForReading(nearbyModes) {
  return [...nearbyModes].sort((left, right) => {
    const leftIndex = CANONICAL_MODE_ORDER.indexOf(left.key);
    const rightIndex = CANONICAL_MODE_ORDER.indexOf(right.key);
    const leftOrder = leftIndex === -1 ? Number.MAX_SAFE_INTEGER : leftIndex;
    const rightOrder = rightIndex === -1 ? Number.MAX_SAFE_INTEGER : rightIndex;

    if (leftOrder !== rightOrder) {
      return leftOrder - rightOrder;
    }

    return left.label.localeCompare(right.label);
  });
}

function joinChangeFragments(fragments) {
  const uniqueFragments = [...new Set(fragments.filter(Boolean))];

  if (uniqueFragments.length === 0) {
    return null;
  }

  return uniqueFragments.slice(0, 2).join(" ");
}

function createWeatherBoardCue(weatherSummary, weatherStatus) {
  if (!weatherStatus.isLive) {
    return weatherStatus.label;
  }

  const summary = weatherSummary.toLowerCase();

  if (summary.includes("rain")) {
    return "Rain";
  }

  if (summary.includes("dry")) {
    return "Dry";
  }

  if (summary.includes("cloud")) {
    return "Cloudy";
  }

  if (summary.includes("sun") || summary.includes("clear")) {
    return "Dry";
  }

  if (summary.includes("wind")) {
    return "Wind";
  }

  if (summary.includes("visibility") || summary.includes("fog") || summary.includes("mist")) {
    return "Mist";
  }

  return weatherStatus.label;
}

function formatTemperatureC(temperatureC) {
  if (typeof temperatureC !== "number" || Number.isNaN(temperatureC)) {
    return null;
  }

  return `${Math.round(temperatureC)}°C`;
}

function createWeatherBoardValue(weatherSummary, weatherStatus, weatherTemperatureC) {
  const temperatureLabel = formatTemperatureC(weatherTemperatureC);

  if (!weatherStatus.isLive) {
    return temperatureLabel ?? weatherStatus.label;
  }

  const cue = createWeatherBoardCue(weatherSummary, weatherStatus);

  if (temperatureLabel && cue && cue !== weatherStatus.label) {
    return `${cue} ${temperatureLabel}`;
  }

  return temperatureLabel ?? cue;
}

function pickContextMode(nearbyModes, key, fallbackIndex) {
  return nearbyModes.find((mode) => mode.key === key) ?? nearbyModes.at(fallbackIndex) ?? null;
}

function createContextTiles(nearbyModes, weatherSummary, weatherStatus, weatherTemperatureC) {
  const busMode = pickContextMode(nearbyModes, "bus", 1);
  const roadsMode = pickContextMode(nearbyModes, "roads", 2);
  const weatherValue = createWeatherBoardValue(weatherSummary, weatherStatus, weatherTemperatureC);

  return Object.freeze([
    Object.freeze({
      key: "bus",
      label: busMode?.label ?? "Bus",
      value: busMode?.stateLabel ?? "Available",
      tone: busMode?.state ?? "available",
    }),
    Object.freeze({
      key: "roads",
      label: roadsMode?.label ?? "Roads",
      value: roadsMode?.stateLabel ?? "Readable",
      tone: roadsMode?.state ?? "caution",
    }),
    Object.freeze({
      key: "weather",
      label: "Weather",
      value: weatherValue,
      tone: weatherStatus.isLive ? "available" : "caution",
    }),
  ]);
}

function createBoardSummary(snapshot, weatherStatus, mobilityStatus) {
  const weatherLead = createWeatherLead(snapshot.weatherSummary, weatherStatus);
  const hasDisruptedMode = snapshot.nearbyModes.some((mode) => mode.state === "disrupted");
  const hasCautionMode = snapshot.nearbyModes.some((mode) => mode.state === "caution");
  const transportBullet =
    hasDisruptedMode
      ? "Services disrupted nearby."
      : hasCautionMode
        ? "Some delays nearby."
        : "Services steady.";

  if (!weatherStatus.isLive && !mobilityStatus.isLive) {
    return `Last update held. ${createLastConfirmedLine("Weather", weatherStatus)}`;
  }

  if (!mobilityStatus.isLive) {
    return weatherLead
      ? `${weatherLead} ${createLastConfirmedLine("Movement", mobilityStatus)}`
      : createLastConfirmedLine("Movement", mobilityStatus);
  }

  if (!weatherStatus.isLive) {
    return `${normalizeSentence(transportBullet)} ${createLastConfirmedLine("Weather", weatherStatus)}`;
  }

  if (hasDisruptedMode) {
    return weatherLead ? `${weatherLead} Services disrupted nearby.` : "Services disrupted nearby.";
  }

  if (hasCautionMode) {
    return weatherLead ? `${weatherLead} Some delays nearby.` : "Some delays nearby.";
  }

  return weatherLead ? `${weatherLead} Services steady.` : "Services steady nearby.";
}

function createModeChangeSummary(previousMode, nextMode) {
  if (!previousMode) {
    return null;
  }

  const changes = [];

  if (previousMode.state !== nextMode.state) {
    changes.push(`${nextMode.label} now reads ${MODE_STATE_LABELS[nextMode.state].toLowerCase()}.`);
  }

  if (previousMode.disruptionScope !== nextMode.disruptionScope) {
    changes.push(
      nextMode.disruptionScope === "unaffected-readable"
        ? `${nextMode.label} returns to a readable nearby state.`
        : `${nextMode.label} is now reading disrupted within the nearby picture.`,
    );
  }

  if (previousMode.sourceStatus.state !== nextMode.sourceStatus.state) {
    changes.push(nextMode.sourceStatus.detail);
  }

  if (
    previousMode.trust.state !== nextMode.trust.state ||
    previousMode.trust.confidence !== nextMode.trust.confidence
  ) {
    changes.push(nextMode.trust.detail);
  }

  return joinChangeFragments(changes);
}

function createMapChangeSummary(previousSnapshot, nextSnapshot) {
  if (!previousSnapshot) {
    return null;
  }

  if (previousSnapshot.localMap.state !== nextSnapshot.localMap.state) {
    return (
      nextSnapshot.localMap.state === "fallback"
        ? "Showing the simpler local map."
        : "Full local map restored."
    );
  }

  if (previousSnapshot.localMap.sourceStatus.state !== nextSnapshot.localMap.sourceStatus.state) {
    return nextSnapshot.localMap.sourceStatus.detail;
  }

  return null;
}

function createCurrentStateUpdateSummary(snapshot) {
  const changes = [];
  const announcementChanges = [];

  if (snapshot.overallTrend) {
    changes.push(createTrendMessage(snapshot.overallTrend));
  }

  for (const subject of ["weather", "mobility"]) {
    if (snapshot.headerStatus[subject].state !== "live") {
      changes.push(snapshot.headerStatus[subject].detail);
      announcementChanges.push(snapshot.headerStatus[subject].detail);
    }

    if (
      snapshot.headerTrust[subject].state !== "current" &&
      snapshot.headerTrust[subject].state !== "aging"
    ) {
      changes.push(snapshot.headerTrust[subject].detail);
      announcementChanges.push(snapshot.headerTrust[subject].detail);
    }
  }

  if (snapshot.disruptionEmphasis.headline) {
    changes.push(`${snapshot.disruptionEmphasis.headline}.`);
  }

  if (snapshot.localMap.state === "fallback") {
    const mapSummary = "Local orientation stays fixed while richer locality detail narrows.";
    changes.push(mapSummary);
    announcementChanges.push(mapSummary);
  } else if (snapshot.localMap.sourceStatus.state !== "live") {
    changes.push(snapshot.localMap.sourceStatus.detail);
    announcementChanges.push(snapshot.localMap.sourceStatus.detail);
  }

  const updateDetail = joinChangeFragments(changes);

  return Object.freeze({
    currentnessMessage:
      updateDetail == null
        ? createCurrentnessMessage()
        : "Data refreshed in place.",
    updateSummary:
      updateDetail == null
        ? null
        : Object.freeze({
            label: "Latest change",
            detail: updateDetail,
          }),
    liveAnnouncement:
      announcementChanges.length === 0
        ? null
        : `Live update. ${joinChangeFragments(announcementChanges)}`,
  });
}

function createUpdateSummary(previousSnapshot, nextSnapshot, hasUpdatedSinceLoad = false) {
  if (!previousSnapshot || previousSnapshot.publishedAt === nextSnapshot.publishedAt) {
    return hasUpdatedSinceLoad
      ? createCurrentStateUpdateSummary(nextSnapshot)
      : Object.freeze({
          currentnessMessage: createCurrentnessMessage(),
          updateSummary: null,
          liveAnnouncement: null,
        });
  }

  const changes = [];
  const announcementChanges = [];

  if (previousSnapshot.overallTrend !== nextSnapshot.overallTrend && nextSnapshot.overallTrend) {
    changes.push(createTrendMessage(nextSnapshot.overallTrend));
  }

  if (
    (previousSnapshot.disruptionEmphasis.level !== nextSnapshot.disruptionEmphasis.level ||
      previousSnapshot.disruptionEmphasis.headline !== nextSnapshot.disruptionEmphasis.headline) &&
    nextSnapshot.disruptionEmphasis.headline
  ) {
    changes.push(`${nextSnapshot.disruptionEmphasis.headline}.`);
  }

  for (const subject of ["weather", "mobility"]) {
    if (previousSnapshot.headerStatus[subject].state !== nextSnapshot.headerStatus[subject].state) {
      changes.push(nextSnapshot.headerStatus[subject].detail);
      announcementChanges.push(nextSnapshot.headerStatus[subject].detail);
    }

    if (
      previousSnapshot.headerTrust[subject].state !== nextSnapshot.headerTrust[subject].state ||
      previousSnapshot.headerTrust[subject].confidence !== nextSnapshot.headerTrust[subject].confidence
    ) {
      changes.push(nextSnapshot.headerTrust[subject].detail);
      announcementChanges.push(nextSnapshot.headerTrust[subject].detail);
    }
  }

  const mapChange = createMapChangeSummary(previousSnapshot, nextSnapshot);

  if (mapChange) {
    changes.push(mapChange);
    announcementChanges.push(mapChange);
  }

  const updateDetail = joinChangeFragments(changes);

  return Object.freeze({
    currentnessMessage:
      updateDetail == null
        ? "Data refreshed in place."
        : "Data refreshed in place.",
    updateSummary:
      updateDetail == null
        ? null
        : Object.freeze({
            label: "Latest change",
            detail: updateDetail,
          }),
    liveAnnouncement:
      announcementChanges.length === 0
        ? null
        : `Live update. ${joinChangeFragments(announcementChanges)}`,
  });
}

function presentTrust(trust) {
  return Object.freeze({
    state: trust.state,
    label: trust.label,
    detail: trust.detail,
    confidence: trust.confidence,
    isNarrowed: trust.confidence === "narrowed",
  });
}

function presentSourceStatus(sourceStatus) {
  return Object.freeze({
    state: sourceStatus.state,
    label: createDisplaySourceLabel(sourceStatus),
    detail: createDisplaySourceDetail(sourceStatus),
    confirmedAt: sourceStatus.confirmedAt ?? null,
    isLive: sourceStatus.state === "live",
  });
}

function createLocalitySummary(references, localityEmphasis) {
  if (localityEmphasis) {
    return localityEmphasis;
  }

  if (references.length === 0) {
    return null;
  }

  return `${references.map((reference) => reference.label).join(", ")} are shown on the map.`;
}

function createLocalityLineTokens(reference) {
  const lineTokens = [];
  const tokenSource = `${reference.label} ${reference.caption}`.toLowerCase();

  if (tokenSource.includes("victoria")) {
    lineTokens.push("victoria");
  }

  if (tokenSource.includes("jubilee")) {
    lineTokens.push("jubilee");
  }

  if (tokenSource.includes("piccadilly")) {
    lineTokens.push("piccadilly");
  }

  if (tokenSource.includes("bus stop")) {
    lineTokens.push("bus");
  }

  if (lineTokens.length > 0) {
    return Object.freeze([...new Set(lineTokens)]);
  }

  return Object.freeze([reference.kind === "stop" ? "bus" : "station"]);
}

function createLocalityReferences(localMap) {
  if (localMap.nearbyReferences.length > 0) {
    return localMap.nearbyReferences.map((reference) =>
      Object.freeze({
        ...reference,
        kindLabel: LOCALITY_KIND_LABELS[reference.kind],
        lineTokens: createLocalityLineTokens(reference),
      }),
    );
  }

  return localMap.selectedNearbyNodes.map((node) =>
    Object.freeze({
      key: node.key,
      label: node.label,
      kind: FALLBACK_LOCALITY_REFERENCE.kind,
      kindLabel: FALLBACK_LOCALITY_REFERENCE.kindLabel,
      caption: FALLBACK_LOCALITY_REFERENCE.caption,
      lineTokens: Object.freeze(["station"]),
    }),
  );
}

export function presentDashboardSnapshot(snapshotInput, options = {}) {
  const snapshot = createDashboardSnapshot(snapshotInput);
  const previousSnapshot = options.previousSnapshot ? createDashboardSnapshot(options.previousSnapshot) : null;
  const updateSummary = createUpdateSummary(previousSnapshot, snapshot, options.hasUpdatedSinceLoad);
  const recovery = options.recovery ?? null;
  const previousModesByKey = previousSnapshot
    ? new Map(previousSnapshot.nearbyModes.map((mode) => [mode.key, mode]))
    : new Map();
  const orderedNearbyModes = orderNearbyModesForReading(snapshot.nearbyModes);
  const presentedWeatherStatus = presentSourceStatus(snapshot.headerStatus.weather);
  const presentedMobilityStatus = presentSourceStatus(snapshot.headerStatus.mobility);
  const nearbyReferences = createLocalityReferences(snapshot.localMap);
  const nearbyReferenceByLabel = new Map(nearbyReferences.map((reference) => [reference.label, reference]));
  const presentedNearbyModes = Object.freeze(
    orderedNearbyModes.map((mode) =>
      Object.freeze({
        ...mode,
        summary: createCompactModeSummary(mode),
        nuance: createModeSupportLine(mode),
        sourceStatus: presentSourceStatus(mode.sourceStatus),
        trust: presentTrust(mode.trust),
        stateLabel: MODE_STATE_LABELS[mode.state],
        disruptionScope: mode.disruptionScope,
        emphasisLabel: MODE_DISRUPTION_LABELS[mode.disruptionScope],
        isDisrupted: mode.disruptionScope !== "unaffected-readable",
        changeSummary: createModeChangeSummary(previousModesByKey.get(mode.key), mode),
      }),
    ),
  );

  return Object.freeze({
    placeLabel: snapshot.placeLabel,
    overallState: snapshot.overallState,
    overallTrend: snapshot.overallTrend,
    overallTrendLabel: snapshot.overallTrend ? TREND_LABELS[snapshot.overallTrend] : null,
    trendMessage: snapshot.overallTrend ? createTrendMessage(snapshot.overallTrend) : null,
    currentnessMessage:
      updateSummary.currentnessMessage === createCurrentnessMessage()
        ? createRecoveryCurrentnessMessage(recovery)
        : updateSummary.currentnessMessage,
    updateSummary: updateSummary.updateSummary,
    liveAnnouncement: updateSummary.liveAnnouncement,
    stateKicker: "Overall departure picture",
    stateHeadline: HEADLINES[snapshot.overallState],
    disruption: Object.freeze({
      level: snapshot.disruptionEmphasis.level,
      label: DISRUPTION_LABELS[snapshot.disruptionEmphasis.level],
      title: snapshot.disruptionEmphasis.headline,
      detail: snapshot.disruptionEmphasis.detail,
      affectedModeKeys: snapshot.disruptionEmphasis.affectedModeKeys,
      hasSeriousDisruption: snapshot.disruptionEmphasis.level !== "none",
    }),
    weatherSummary: snapshot.weatherSummary,
    weatherTemperatureC: snapshot.weatherTemperatureC,
    mobilitySummary: snapshot.mobilitySummary,
    weatherTrust: presentTrust(snapshot.headerTrust.weather),
    mobilityTrust: presentTrust(snapshot.headerTrust.mobility),
    weatherStatus: presentedWeatherStatus,
    mobilityStatus: presentedMobilityStatus,
    supportLabel: createBoardSummary(snapshot, presentedWeatherStatus, presentedMobilityStatus),
    nearbyModeHeading: "Nearby modes",
    nearbyModeIntro: "Use these rows to check each nearby mode.",
    nearbyModes: presentedNearbyModes,
    contextTiles: createContextTiles(
      presentedNearbyModes,
      snapshot.weatherSummary,
      presentedWeatherStatus,
      snapshot.weatherTemperatureC,
    ),
    locality: Object.freeze({
      title: "Nearby",
      heading: "Nearby stations",
      summary: createLocalitySummary(
        nearbyReferences,
        snapshot.localMap.orientationSummary ?? snapshot.localMap.localityEmphasis?.label ?? null,
      ),
      references: Object.freeze(nearbyReferences),
    }),
    localMap: Object.freeze({
      title: snapshot.localMap.title,
      ariaLabel: "Passive local orientation map anchored to the Royal Institution",
      state: snapshot.localMap.state,
      stateLabel: LOCAL_MAP_STATE_LABELS[snapshot.localMap.state],
      sourceStatus: presentSourceStatus(snapshot.localMap.sourceStatus),
      venueAnchor: Object.freeze({
        ...snapshot.localMap.venueAnchor,
        caption: "Royal Institution anchor",
      }),
      selectedNearbyNodes: Object.freeze(
        snapshot.localMap.selectedNearbyNodes.map((node) =>
          Object.freeze({
            ...node,
            caption: nearbyReferenceByLabel.get(node.label)?.kindLabel ?? "Nearby place",
          }),
        ),
      ),
      nearbyReferences: Object.freeze(nearbyReferences),
      localityEmphasis:
        snapshot.localMap.orientationSummary ?? snapshot.localMap.localityEmphasis?.label ?? null,
      fallbackCopy: snapshot.localMap.fallbackCopy,
      changeSummary: createMapChangeSummary(previousSnapshot, snapshot),
    }),
  });
}

export function getDashboardMetadata() {
  return DASHBOARD_METADATA;
}
