import { createFixtureDashboardSnapshot } from "../../../features/dashboard/data/overall-departure-snapshot.js";
import { buildTrustSignal } from "../../contracts/freshness.js";
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

  return Object.keys(STATE_WEIGHT).find((key) => STATE_WEIGHT[key] === score && key in { calm: 1, watchful: 1, strained: 1, disrupted: 1 }) ?? "watchful";
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

function createHeaderTrust({ now, publishedAt, weatherOverview, tflOverview }) {
  return {
    weather: buildTrustSignal({
      now,
      observedAt: weatherOverview?.signalObservedAt,
      fallbackAt: publishedAt,
      missedRefreshes: weatherOverview?.missedRefreshes ?? 0,
      reducedConfidence: weatherOverview == null,
      subject: "Weather",
    }),
    mobility: buildTrustSignal({
      now,
      observedAt: tflOverview?.signalObservedAt,
      fallbackAt: publishedAt,
      missedRefreshes: tflOverview?.missedRefreshes ?? 0,
      reducedConfidence: tflOverview == null,
      subject: "Movement",
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
  const affectedModes = nearbyModes.filter((mode) => mode.state === "disrupted");

  if (overallState === "disrupted") {
    const affectedLabels = formatAffectedModeLabels(affectedModes);

    return {
      level: "overall",
      headline: "Disrupted across the Royal Institution threshold",
      detail:
        affectedLabels.length > 0
          ? `${affectedLabels} are under visible strain across the nearby departure picture.`
          : "The nearby departure picture is under visible strain while remaining readable.",
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
      detail: `${affectedLabels} ${affectedModes.length === 1 ? "is" : "are"} under the most strain nearby while the rest of the departure picture stays readable.`,
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

export async function buildDashboardSnapshot({
  now = new Date(),
  getFallbackSnapshot = createFixtureDashboardSnapshot,
  tflProvider = fetchTflOverview,
  weatherProvider = fetchWeatherOverview,
  readHistory = readStoredDashboardHistory,
} = {}) {
  const publishedAt = now.toISOString();
  const baseSnapshot = getFallbackSnapshot({ publishedAt });
  const [tflResult, weatherResult, history] = await Promise.all([
    Promise.allSettled([
      tflProvider({ now }),
      weatherProvider({ now }),
    ]),
    readHistory(),
  ]).then(([[tflSettled, weatherSettled], loadedHistory]) => [tflSettled, weatherSettled, loadedHistory]);
  const tflOverview = tflResult.status === "fulfilled" ? tflResult.value : null;
  const weatherOverview = weatherResult.status === "fulfilled" ? weatherResult.value : null;
  const liveModes = createModeLookup(tflOverview?.liveModes ?? []);
  const nearbyModes = baseSnapshot.nearbyModes.map((mode) => {
    const liveMode = liveModes.get(mode.key);
    const nextState = liveMode?.state ?? mode.state;

    return {
      ...mode,
      state: nextState,
      disruptionScope:
        nextState === "disrupted"
          ? "locally-disrupted"
          : "unaffected-readable",
      summary: liveMode?.summary ?? mode.summary,
      nuance: liveMode?.nuance ?? mode.nuance,
      trust: deriveModeTrust({
        now,
        publishedAt,
        baseMode: mode,
        liveMode,
        tflOverview,
      }),
    };
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
    weatherSummary: weatherOverview?.weatherSummary ?? baseSnapshot.weatherSummary,
    mobilitySummary: tflOverview?.mobilitySummary ?? baseSnapshot.mobilitySummary,
    supportLabel:
      tflOverview && weatherOverview
        ? "Weather and movement still reinforce the same local read."
        : "The stronger live signals are carrying the shared picture.",
    headerTrust: createHeaderTrust({
      now,
      publishedAt,
      weatherOverview,
      tflOverview,
    }),
    disruptionEmphasis,
    nearbyModes: nearbyModes.map((mode) => ({
      ...mode,
      disruptionScope:
        mode.state === "disrupted"
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
    snapshotState: tflOverview || weatherOverview ? "live" : "fallback",
  };
}
