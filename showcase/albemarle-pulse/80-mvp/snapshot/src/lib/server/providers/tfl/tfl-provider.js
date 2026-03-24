import { z } from "zod";

const TFL_LINE_STATUSES_SCHEMA = z.array(
  z.object({
    id: z.union([z.string(), z.number()]).optional(),
    modeName: z.string().default(""),
    lineStatuses: z
      .array(
        z.object({
          statusSeverity: z.number().int().optional(),
          statusSeverityDescription: z.string().optional(),
          reason: z.string().optional(),
        }),
      )
      .default([]),
  }),
);

function mapSeverityToState(severity) {
  if (severity == null || severity <= 10) {
    return "available";
  }

  if (severity <= 14) {
    return "caution";
  }

  return "disrupted";
}

function summarizeModeState(modeKey, state, descriptions) {
  if (modeKey === "tube-rail") {
    if (state === "available") {
      return "Green Park and Piccadilly services are running normally.";
    }

    if (state === "caution") {
      return `Green Park and Piccadilly services have minor delays${descriptions ? `: ${descriptions}.` : "."}`;
    }

    return `Green Park and Piccadilly services are disrupted${descriptions ? `: ${descriptions}.` : "."}`;
  }

  if (state === "available") {
    return "Nearby buses are running normally.";
  }

  if (state === "caution") {
    return `Nearby buses are slower than normal${descriptions ? `: ${descriptions}.` : "."}`;
  }

  return `Nearby buses are disrupted${descriptions ? `: ${descriptions}.` : "."}`;
}

function normalizeTflLineGroup(lines, modeKey, fetchedAt) {
  if (lines.length === 0) {
    return null;
  }

  const severities = lines.flatMap((line) => line.lineStatuses.map((status) => status.statusSeverity ?? 10));
  const descriptions = lines
    .flatMap((line) => line.lineStatuses.map((status) => status.statusSeverityDescription).filter(Boolean))
    .slice(0, 2)
    .join(", ");
  const highestSeverity = severities.length > 0 ? Math.max(...severities) : 10;
  const state = mapSeverityToState(highestSeverity);

  return {
    key: modeKey,
    state,
    summary: summarizeModeState(modeKey, state, descriptions),
    nuance:
      state === "available"
        ? "No reported issue."
        : state === "caution"
          ? "Expect some delay."
          : "Check live service status.",
    signalObservedAt: fetchedAt,
    fetchedAt,
    missedRefreshes: 0,
  };
}

export async function fetchTflOverview({
  fetchImpl = fetch,
  apiBaseUrl = process.env.TFL_API_BASE_URL ?? "https://api.tfl.gov.uk",
  apiKey = process.env.TFL_API_KEY ?? "",
  appId = process.env.TFL_APP_ID ?? "",
  forceLive = process.env.TFL_FORCE_LIVE === "1",
  now = new Date(),
} = {}) {
  if (!forceLive && !apiKey && !appId) {
    return null;
  }

  const url = new URL("/Line/Mode/tube,elizabeth-line,overground,dlr,bus/Status", apiBaseUrl);

  if (appId) {
    url.searchParams.set("app_id", appId);
  }

  if (apiKey) {
    url.searchParams.set("app_key", apiKey);
  }

  const response = await fetchImpl(url, {
    headers: {
      accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`TfL provider request failed with status ${response.status}`);
  }

  const payload = TFL_LINE_STATUSES_SCHEMA.parse(await response.json());
  const fetchedAt = now.toISOString();
  const tubeLines = payload.filter((line) => line.modeName !== "bus");
  const busLines = payload.filter((line) => line.modeName === "bus");
  const tubeRail = normalizeTflLineGroup(tubeLines, "tube-rail", fetchedAt);
  const bus = normalizeTflLineGroup(busLines, "bus", fetchedAt);
  const liveModes = [tubeRail, bus].filter(Boolean);

  if (liveModes.length === 0) {
    return null;
  }

  const disruptedCount = liveModes.filter((mode) => mode.state === "disrupted").length;
  const cautionCount = liveModes.filter((mode) => mode.state === "caution").length;

  let mobilitySummary = "Nearby transport is running normally.";

  if (disruptedCount > 0) {
    mobilitySummary = "Some nearby services are disrupted.";
  } else if (cautionCount > 0) {
    mobilitySummary = "Some nearby services are slower than normal.";
  }

  return {
    liveModes,
    mobilitySummary,
    signalObservedAt: fetchedAt,
    fetchedAt,
    missedRefreshes: 0,
  };
}
