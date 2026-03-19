import { createFixtureDashboardSnapshot } from "../../../features/dashboard/data/overall-departure-snapshot.js";
import { createDashboardSnapshot } from "../../contracts/dashboard-snapshot.js";
import { fetchTflOverview } from "../providers/tfl/tfl-provider.js";
import { fetchWeatherOverview } from "../providers/weather/weatherapi-provider.js";

const STATE_WEIGHT = Object.freeze({
  calm: 0,
  watchful: 1,
  strained: 2,
  disrupted: 3,
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

  return Object.keys(STATE_WEIGHT).find((key) => STATE_WEIGHT[key] === score) ?? "watchful";
}

function createSnapshotFreshnessLabel(publishedAt) {
  const publishedAtMs = Date.parse(publishedAt);

  if (Number.isNaN(publishedAtMs)) {
    return "Holding current across the foyer.";
  }

  return Math.floor(publishedAtMs / 30_000) % 2 === 0
    ? "Now refreshed for the foyer."
    : "Freshly settled across the foyer.";
}

export async function buildDashboardSnapshot({
  now = new Date(),
  getFallbackSnapshot = createFixtureDashboardSnapshot,
  tflProvider = fetchTflOverview,
  weatherProvider = fetchWeatherOverview,
} = {}) {
  const publishedAt = now.toISOString();
  const baseSnapshot = getFallbackSnapshot({ publishedAt });
  const [tflResult, weatherResult] = await Promise.allSettled([tflProvider(), weatherProvider()]);
  const tflOverview = tflResult.status === "fulfilled" ? tflResult.value : null;
  const weatherOverview = weatherResult.status === "fulfilled" ? weatherResult.value : null;
  const liveModes = new Map((tflOverview?.liveModes ?? []).map((mode) => [mode.key, mode]));
  const nearbyModes = baseSnapshot.nearbyModes.map((mode) => {
    const liveMode = liveModes.get(mode.key);

    if (!liveMode) {
      return mode;
    }

    return {
      ...mode,
      state: liveMode.state,
      summary: liveMode.summary,
      nuance: liveMode.nuance,
    };
  });
  const overallState = deriveOverallState(nearbyModes, weatherOverview?.overallState);
  const snapshot = createDashboardSnapshot({
    ...baseSnapshot,
    publishedAt,
    overallState,
    weatherSummary: weatherOverview?.weatherSummary ?? baseSnapshot.weatherSummary,
    mobilitySummary: tflOverview?.mobilitySummary ?? baseSnapshot.mobilitySummary,
    freshnessLabel: createSnapshotFreshnessLabel(publishedAt),
    supportLabel:
      tflOverview || weatherOverview
        ? "Fresh weather and movement are reinforcing the same local read."
        : baseSnapshot.supportLabel,
    nearbyModes,
  });

  return {
    snapshot,
    snapshotState: tflOverview || weatherOverview ? "live" : "fallback",
  };
}
