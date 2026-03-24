import { z } from "zod";

const WEATHER_API_SCHEMA = z.object({
  current: z.object({
    temp_c: z.number(),
    wind_mph: z.number(),
    precip_mm: z.number(),
    is_day: z.union([z.literal(0), z.literal(1)]),
    last_updated_epoch: z.number().optional(),
    last_updated: z.string().optional(),
    condition: z.object({
      text: z.string(),
    }),
  }),
});

function summarizeWeather(current) {
  const condition = current.condition.text.toLowerCase();

  if (current.precip_mm >= 1.5) {
    return {
      overallState: "watchful",
      weatherSummary: "Rain is moving across Mayfair and the nearby street is reading a little slower.",
    };
  }

  if (current.wind_mph >= 18) {
    return {
      overallState: "watchful",
      weatherSummary: "A brisk wind is moving through Mayfair, though the local picture is still readable.",
    };
  }

  if (condition.includes("mist") || condition.includes("fog")) {
    return {
      overallState: "watchful",
      weatherSummary: "A softer, hazier light is sitting over Mayfair while the local picture stays readable.",
    };
  }

  return {
    overallState: "calm",
    weatherSummary:
      current.is_day === 1
        ? "The weather is staying open over Mayfair, keeping the foyer picture easy to read."
        : "A settled evening sky is keeping the Mayfair picture easy to read.",
  };
}

export async function fetchWeatherOverview({
  fetchImpl = fetch,
  apiBaseUrl = process.env.WEATHERAPI_BASE_URL ?? "https://api.weatherapi.com",
  apiKey = process.env.WEATHERAPI_KEY ?? "",
  query = process.env.WEATHERAPI_LOCATION ?? "51.5099,-0.1419",
  forceLive = process.env.WEATHERAPI_FORCE_LIVE === "1",
  now = new Date(),
} = {}) {
  if (!forceLive && !apiKey) {
    return null;
  }

  const url = new URL("/v1/current.json", apiBaseUrl);
  url.searchParams.set("key", apiKey);
  url.searchParams.set("q", query);

  const response = await fetchImpl(url, {
    headers: {
      accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Weather provider request failed with status ${response.status}`);
  }

  const payload = WEATHER_API_SCHEMA.parse(await response.json());
  return {
    ...summarizeWeather(payload.current),
    signalObservedAt:
      typeof payload.current.last_updated_epoch === "number"
        ? new Date(payload.current.last_updated_epoch * 1000).toISOString()
        : typeof payload.current.last_updated === "string"
          ? payload.current.last_updated
          : now.toISOString(),
    fetchedAt: now.toISOString(),
    missedRefreshes: 0,
  };
}
