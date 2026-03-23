import { createFixtureDashboardSnapshot } from "../../../features/dashboard/data/overall-departure-snapshot.js";
import {
  createSourceStatus,
  createTrustSignal,
  buildTrustSignal,
} from "../../contracts/freshness.js";
import { createDashboardSnapshot } from "../../contracts/dashboard-snapshot.js";
import { readStoredDashboardHistory } from "../cache/snapshot-store.js";
import { fetchTflOverview } from "../providers/tfl/tfl-provider.js";
import { fetchWeatherOverview } from "../providers/weather/weatherapi-provider.js";

const STATE_WEIGHT = Object.freeze({
  calm: 0,
  watchful: 1,
  strained: 2,
  disrupted: 3,
  available: 0,
  caution: 1,
});

function deriveOverallState(nearbyModes, weatherState) {
  const transportScore = nearbyModes.reduce((highest, mode) => {
    if (mode.sourceStatus?.state === "unavailable") {
      return highest;
    }

    if (mode.state === "disrupted") {
      return Math.max(highest, STATE_WEIGHT.strained);
    }

    if (mode.state === "caution") {
      return Math.max(highest, STATE_WEIGHT.watchful);
    }

    return highest;
  }, STATE_WEIGHT.calm);
  const weatherScore = weatherState ? STATE_WEIGHT[weatherState] ?? STATE_WEIGHT.calm : STATE_WEIGHT.calm;
  const score = Math.max(transportScore, weatherScore);

  return (
    Object.keys(STATE_WEIGHT).find(
      (key) => STATE_WEIGHT[key] === score && key in { calm: 1, watchful: 1, strained: 1, disrupted: 1 },
    ) ?? "watchful"
  );
}

function createModeLookup(modes) {
  return new Map((modes ?? []).map((mode) => [mode.key, mode]));
}

function scoreSnapshotSummary(snapshot) {
  const baseScore = (STATE_WEIGHT[snapshot.overallState] ?? 0) * 10;
  const modeScore = (snapshot.nearbyModes ?? []).reduce(
    (total, mode) => total + (STATE_WEIGHT[mode.state] ?? STATE_WEIGHT.disrupted),
    0,
  );

  return baseScore + modeScore;
}

export function classifyOverallTrend({ history = [], currentSnapshot, now = new Date() } = {}) {
  const nowMs = now.getTime();
  const relevantHistory = history
    .filter((entry) => entry?.publishedAt && entry.publishedAt !== currentSnapshot.publishedAt)
    .filter((entry) => {
      const publishedAtMs = Date.parse(entry.publishedAt);
      return !Number.isNaN(publishedAtMs) && nowMs - publishedAtMs <= 15 * 60_000;
    })
    .sort((left, right) => Date.parse(left.publishedAt) - Date.parse(right.publishedAt));

  if (relevantHistory.length === 0) {
    return null;
  }

  const baseline = relevantHistory[0];
  const scoreDelta = scoreSnapshotSummary(currentSnapshot) - scoreSnapshotSummary(baseline);

  if (scoreDelta < 0) {
    return "improving";
  }

  if (scoreDelta > 0) {
    return "worsening";
  }

  return "steady";
}

function createUnavailableTrust(subject, detail) {
  return createTrustSignal({
    state: "unavailable",
    detail,
    subject,
  });
}

function createCarriedForwardTrust(subject, detail) {
  return createTrustSignal({
    state: "reduced-confidence",
    detail,
    subject,
  });
}

function createHeaderSegment({ segment, liveOverview, storedSummary, now, publishedAt }) {
  if (liveOverview) {
    return {
      summary: liveOverview.summary,
      trust: buildTrustSignal({
        now,
        observedAt: liveOverview.signalObservedAt,
        fallbackAt: publishedAt,
        missedRefreshes: liveOverview.missedRefreshes ?? 0,
        subject: segment.subject,
      }),
      sourceStatus: createSourceStatus({
        state: "live",
        subject: segment.subject,
      }),
    };
  }

  if (typeof storedSummary === "string" && storedSummary.trim().length > 0) {
    return {
      summary: storedSummary,
      trust: createCarriedForwardTrust(
        segment.subject,
        `${segment.subject} is showing the last available update.`,
      ),
      sourceStatus: createSourceStatus({
        state: "carried-forward",
        detail: `${segment.subject} is showing the last available update.`,
      }),
    };
  }

  return {
    summary: `${segment.subject} data is unavailable.`,
    trust: createUnavailableTrust(segment.subject, `${segment.subject} data is unavailable.`),
    sourceStatus: createSourceStatus({
      state: "unavailable",
      detail: `${segment.subject} data is unavailable.`,
    }),
  };
}

function deriveModeTrust({ now, publishedAt, baseMode, liveMode, tflOverview }) {
  const reducedConfidence = tflOverview == null || liveMode == null;

  return buildTrustSignal({
    now,
    observedAt: liveMode?.signalObservedAt ?? tflOverview?.signalObservedAt,
    fallbackAt: publishedAt,
    missedRefreshes: liveMode?.missedRefreshes ?? tflOverview?.missedRefreshes ?? 0,
    reducedConfidence,
    subject: baseMode.label,
  });
}

function createCarriedForwardMode(mode, storedMode) {
  return {
    ...mode,
    state: storedMode?.state ?? (mode.state === "disrupted" ? "caution" : mode.state),
    disruptionScope: "unaffected-readable",
    summary: storedMode?.summary ?? `${mode.label} is showing the last available update.`,
    nuance: storedMode?.nuance ?? "Other nearby data is still shown.",
    sourceStatus: createSourceStatus({
      state: "carried-forward",
      detail: `${mode.label} is showing the last available update.`,
    }),
    trust: createCarriedForwardTrust(mode.label, `${mode.label} is showing the last available update.`),
  };
}

function createUnavailableMode(mode) {
  return {
    ...mode,
    state: "caution",
    disruptionScope: "unaffected-readable",
    summary: `${mode.label} data is unavailable.`,
    nuance: "Other nearby data is still shown.",
    sourceStatus: createSourceStatus({
      state: "unavailable",
      detail: `${mode.label} data is unavailable.`,
    }),
    trust: createUnavailableTrust(mode.label, `${mode.label} data is unavailable.`),
  };
}

function formatAffectedModeLabels(modes) {
  if (modes.length === 0) {
    return "";
  }

  if (modes.length === 1) {
    return modes[0].label;
  }

  if (modes.length === 2) {
    return `${modes[0].label} and ${modes[1].label}`;
  }

  return `${modes.slice(0, -1).map((mode) => mode.label).join(", ")}, and ${modes.at(-1).label}`;
}

function deriveDisruptionEmphasis({ overallState, nearbyModes }) {
  const affectedModes = nearbyModes.filter(
    (mode) => mode.state === "disrupted" && mode.sourceStatus.state === "live",
  );

  if (overallState === "disrupted") {
    const affectedLabels = formatAffectedModeLabels(affectedModes);

    return {
      level: "overall",
      headline: "Disrupted across the Royal Institution threshold",
      detail:
        affectedLabels.length > 0
          ? `${affectedLabels} have the most disruption nearby.`
          : "There is serious disruption nearby.",
      affectedModeKeys: affectedModes.map((mode) => mode.key),
    };
  }

  if (affectedModes.length > 0) {
    const affectedLabels = formatAffectedModeLabels(affectedModes);

    return {
      level: "local",
      headline:
        affectedModes.length === 1
          ? `${affectedModes[0].label} is disrupted nearby`
          : "Multiple nearby modes are disrupted",
      detail: `${affectedLabels} ${affectedModes.length === 1 ? "has" : "have"} the most disruption nearby.`,
      affectedModeKeys: affectedModes.map((mode) => mode.key),
    };
  }

  return {
    level: "none",
    headline: null,
    detail: null,
    affectedModeKeys: [],
  };
}

function createMixedSupportLabel({ weatherStatus, mobilityStatus }) {
  if (weatherStatus.state === "live" && mobilityStatus.state === "live") {
    return "Transport and weather are live.";
  }

  if (weatherStatus.state === "live" && mobilityStatus.state !== "live") {
    return "Weather is live. Transport is delayed.";
  }

  if (weatherStatus.state !== "live" && mobilityStatus.state === "live") {
    return "Transport is live. Weather is delayed.";
  }

  return "Some live data is delayed.";
}

function createLocalMap({ baseSnapshot, storedSnapshot, tflOverview }) {
  if (tflOverview) {
    return {
      ...baseSnapshot.localMap,
      sourceStatus: createSourceStatus({
        state: "live",
        detail: "The local frame is reading live for this foyer.",
      }),
    };
  }

  if (storedSnapshot?.localMap) {
    return {
      ...storedSnapshot.localMap,
      state: "fallback",
      sourceStatus: createSourceStatus({
        state: "carried-forward",
        detail: "The local frame stays simplified while richer locality detail narrows.",
      }),
      fallbackCopy: "The local frame stays simplified while richer locality detail narrows.",
    };
  }

  return {
    ...baseSnapshot.localMap,
    state: "fallback",
    sourceStatus: createSourceStatus({
      state: "unavailable",
      detail: "The local frame stays simplified while richer locality detail is temporarily unavailable.",
    }),
    fallbackCopy: "The local frame stays simplified while richer locality detail is temporarily unavailable.",
  };
}

export async function buildDashboardSnapshot({
  now = new Date(),
  lastSafeSnapshot = null,
  getFallbackSnapshot = createFixtureDashboardSnapshot,
  tflProvider = fetchTflOverview,
  weatherProvider = fetchWeatherOverview,
  readHistory = readStoredDashboardHistory,
} = {}) {
  const publishedAt = now.toISOString();
  const baseSnapshot = getFallbackSnapshot({ publishedAt });
  const storedSnapshot = lastSafeSnapshot ? createDashboardSnapshot(lastSafeSnapshot) : null;
  const [[tflResult, weatherResult], history] = await Promise.all([
    Promise.allSettled([tflProvider({ now }), weatherProvider({ now })]),
    readHistory(),
  ]);

  const tflOverview = tflResult.status === "fulfilled" ? tflResult.value : null;
  const weatherOverview = weatherResult.status === "fulfilled" ? weatherResult.value : null;

  if (!tflOverview && !weatherOverview) {
    throw new Error("No live providers available for an honest mixed snapshot");
  }

  const storedModes = createModeLookup(storedSnapshot?.nearbyModes ?? []);
  const liveModes = createModeLookup(tflOverview?.liveModes ?? []);
  const nearbyModes = baseSnapshot.nearbyModes.map((mode) => {
    const liveMode = liveModes.get(mode.key);
    const storedMode = storedModes.get(mode.key);

    if (liveMode) {
      const nextState = liveMode.state ?? mode.state;

      return {
        ...mode,
        state: nextState,
        disruptionScope: nextState === "disrupted" ? "locally-disrupted" : "unaffected-readable",
        summary: liveMode.summary ?? mode.summary,
        nuance: liveMode.nuance ?? mode.nuance,
        sourceStatus: createSourceStatus({
          state: "live",
          detail: `${mode.label} is reading live nearby.`,
        }),
        trust: deriveModeTrust({
          now,
          publishedAt,
          baseMode: mode,
          liveMode,
          tflOverview,
        }),
      };
    }

    return storedMode ? createCarriedForwardMode(mode, storedMode) : createUnavailableMode(mode);
  });

  const weatherHeader = createHeaderSegment({
    segment: {
      subject: "Weather",
      summaryNoun: "weather detail",
    },
    liveOverview:
      weatherOverview == null
        ? null
        : {
            summary: weatherOverview.weatherSummary,
            temperatureC: weatherOverview.temperatureC,
            signalObservedAt: weatherOverview.signalObservedAt,
            missedRefreshes: weatherOverview.missedRefreshes ?? 0,
          },
    storedSummary: storedSnapshot?.weatherSummary ?? null,
    now,
    publishedAt,
  });
  const mobilityHeader = createHeaderSegment({
    segment: {
      subject: "Movement",
      summaryNoun: "movement detail",
    },
    liveOverview:
      tflOverview == null
        ? null
        : {
            summary: tflOverview.mobilitySummary,
            signalObservedAt: tflOverview.signalObservedAt,
            missedRefreshes: tflOverview.missedRefreshes ?? 0,
          },
    storedSummary: storedSnapshot?.mobilitySummary ?? null,
    now,
    publishedAt,
  });
  const localMap = createLocalMap({
    baseSnapshot,
    storedSnapshot,
    tflOverview,
  });
  const overallState = deriveOverallState(nearbyModes, weatherOverview?.overallState);
  const disruptionEmphasis = deriveDisruptionEmphasis({
    overallState,
    nearbyModes,
  });
  const draftSnapshot = {
    ...baseSnapshot,
    publishedAt,
    overallState,
    overallTrend: null,
    weatherSummary: weatherHeader.summary,
    weatherTemperatureC:
      typeof weatherOverview?.temperatureC === "number"
        ? weatherOverview.temperatureC
        : storedSnapshot?.weatherTemperatureC ?? baseSnapshot.weatherTemperatureC ?? null,
    mobilitySummary: mobilityHeader.summary,
    supportLabel: createMixedSupportLabel({
      weatherStatus: weatherHeader.sourceStatus,
      mobilityStatus: mobilityHeader.sourceStatus,
    }),
    headerTrust: {
      weather: weatherHeader.trust,
      mobility: mobilityHeader.trust,
    },
    headerStatus: {
      weather: weatherHeader.sourceStatus,
      mobility: mobilityHeader.sourceStatus,
    },
    localMap,
    disruptionEmphasis,
    nearbyModes: nearbyModes.map((mode) => ({
      ...mode,
      disruptionScope:
        mode.state === "disrupted" && mode.sourceStatus.state === "live"
          ? overallState === "disrupted"
            ? "overall-disrupted"
            : "locally-disrupted"
          : "unaffected-readable",
    })),
  };
  const overallTrend = classifyOverallTrend({
    history,
    currentSnapshot: draftSnapshot,
    now,
  });
  const snapshot = createDashboardSnapshot({
    ...draftSnapshot,
    overallTrend,
  });

  return {
    snapshot,
    snapshotState: "live",
  };
}
