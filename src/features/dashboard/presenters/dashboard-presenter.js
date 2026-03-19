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
  default: "Default local frame",
  fallback: "Fallback local frame",
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
  "unaffected-readable": "Readable nearby",
  "locally-disrupted": "Disrupted nearby",
  "overall-disrupted": "Disrupted across the picture",
});

const CANONICAL_MODE_ORDER = Object.freeze([
  "tube-rail",
  "bus",
  "roads",
  "cycles-scooters",
]);

function createTrendMessage(overallTrend) {
  if (overallTrend === "improving") {
    return "The departure picture is improving.";
  }

  if (overallTrend === "worsening") {
    return "The departure picture is tightening.";
  }

  return "The departure picture is holding steady.";
}

function createCurrentnessMessage() {
  return "Current signals refresh inside the same calm shared view.";
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
        ? "Local frame stays fixed while richer locality detail narrows."
        : "Local frame returns to the fuller live locality read."
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
    const mapSummary = "Local frame stays fixed while richer locality detail narrows.";
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
        : "Current signals refreshed in place and kept the shared read stable.",
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
        ? "Current signals refreshed in place without moving the shared read."
        : "Current signals refreshed in place and kept the shared read stable.",
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
    label: sourceStatus.label,
    detail: sourceStatus.detail,
    isLive: sourceStatus.state === "live",
  });
}

export function presentDashboardSnapshot(snapshotInput, options = {}) {
  const snapshot = createDashboardSnapshot(snapshotInput);
  const previousSnapshot = options.previousSnapshot ? createDashboardSnapshot(options.previousSnapshot) : null;
  const updateSummary = createUpdateSummary(previousSnapshot, snapshot, options.hasUpdatedSinceLoad);
  const previousModesByKey = previousSnapshot
    ? new Map(previousSnapshot.nearbyModes.map((mode) => [mode.key, mode]))
    : new Map();
  const orderedNearbyModes = orderNearbyModesForReading(snapshot.nearbyModes);

  return Object.freeze({
    placeLabel: snapshot.placeLabel,
    overallState: snapshot.overallState,
    overallTrend: snapshot.overallTrend,
    overallTrendLabel: snapshot.overallTrend ? TREND_LABELS[snapshot.overallTrend] : null,
    trendMessage: snapshot.overallTrend ? createTrendMessage(snapshot.overallTrend) : null,
    currentnessMessage: updateSummary.currentnessMessage,
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
    mobilitySummary: snapshot.mobilitySummary,
    weatherTrust: presentTrust(snapshot.headerTrust.weather),
    mobilityTrust: presentTrust(snapshot.headerTrust.mobility),
    weatherStatus: presentSourceStatus(snapshot.headerStatus.weather),
    mobilityStatus: presentSourceStatus(snapshot.headerStatus.mobility),
    supportLabel: snapshot.supportLabel,
    nearbyModeHeading: "Nearby modes",
    nearbyModeIntro: "From here, now: the nearby departure modes are reading as follows.",
    nearbyModes: Object.freeze(
      orderedNearbyModes.map((mode) =>
        Object.freeze({
          ...mode,
          sourceStatus: presentSourceStatus(mode.sourceStatus),
          trust: presentTrust(mode.trust),
          stateLabel: MODE_STATE_LABELS[mode.state],
          disruptionScope: mode.disruptionScope,
          emphasisLabel: MODE_DISRUPTION_LABELS[mode.disruptionScope],
          isDisrupted: mode.disruptionScope !== "unaffected-readable",
          changeSummary: createModeChangeSummary(previousModesByKey.get(mode.key), mode),
        }),
      ),
    ),
    localMap: Object.freeze({
      title: snapshot.localMap.title,
      ariaLabel: "Fixed local map anchored to the Royal Institution",
      state: snapshot.localMap.state,
      stateLabel: LOCAL_MAP_STATE_LABELS[snapshot.localMap.state],
      sourceStatus: presentSourceStatus(snapshot.localMap.sourceStatus),
      venueAnchor: Object.freeze({
        ...snapshot.localMap.venueAnchor,
        caption: "Anchor",
      }),
      selectedNearbyNodes: Object.freeze(
        snapshot.localMap.selectedNearbyNodes.map((node) =>
          Object.freeze({
            ...node,
            caption: "Nearby node",
          }),
        ),
      ),
      localityEmphasis: snapshot.localMap.localityEmphasis?.label ?? null,
      fallbackCopy: snapshot.localMap.fallbackCopy,
      changeSummary: createMapChangeSummary(previousSnapshot, snapshot),
    }),
  });
}

export function getDashboardMetadata() {
  return DASHBOARD_METADATA;
}
