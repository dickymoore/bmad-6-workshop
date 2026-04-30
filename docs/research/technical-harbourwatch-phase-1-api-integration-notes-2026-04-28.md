---
inputDocuments:
  - _bmad-output/brainstorming/brainstorming-session-2026-04-28-182912.md
  - docs/research/domain-harbourwatch-phase-1-data-sources-research-2026-04-28.md
research_type: technical
research_topic: HarbourWatch Phase 1 API integration notes for Seattle waterfront data strategy
date: 2026-04-28
---

# HarbourWatch Phase 1 API Integration Notes

## Implementation Position

HarbourWatch Phase 1 should be a local-only Seattle waterfront conditions display backed by a small set of adapters. The live core is:

- NOAA CO-OPS station `9447130` for Seattle tide predictions and observed water level.
- NWS API for waterfront forecast, weather phrases, and active alerts.
- WSDOT/WSF Schedule API for ferry schedule, alerts, and service-disruption context, only after obtaining a Traveler API access code.
- Seattle Open Data/Socrata for one optional low-prominence civic context feed.
- Local JSON fixtures for berth, dock, staff, visitor, environmental, and workshop fallback notices.

Do not integrate AIS, live vessel maps, vessel positions, live camera feeds, collision avoidance, dispatch, berth assignment, or control-room workflows. WSF vessel endpoints exist, but they are outside the selected Phase 1 product boundary.

## Auth And Sign-Up Needs

| Source | Required for Phase 1 | Sign-up/auth | Where token lives | Browser exposure |
|---|---:|---|---|---|
| NOAA CO-OPS | Yes | No API key required | None | Safe, but fetch through local adapter for consistency |
| NWS API | Yes | No key; unique `User-Agent` required | App config value | Safe, but fetch through local adapter to normalize failures |
| WSDOT/WSF Schedule API | Yes if live ferry data is enabled | WSDOT Traveler API access code by email | Local `.env`, server only | Never expose |
| Seattle Open Data/Socrata | Optional | App token recommended; unauthenticated requests work at lower limits | Local `.env`, server only if used | Avoid exposing token |
| Local fixtures | Yes | None | Repository fixture files | Safe |

Recommended local env names:

```bash
HARBOURWATCH_USER_AGENT="HarbourWatchPhase1/0.1 (contact@example.com)"
WSDOT_API_ACCESS_CODE="..."
SOCRATA_APP_TOKEN="..."
HARBOURWATCH_FIXTURE_MODE="fallback"
```

For workshops, the app must run without `WSDOT_API_ACCESS_CODE` and `SOCRATA_APP_TOKEN`. Missing optional credentials should degrade to fixture-backed service pattern and omit civic context, not block startup.

## Endpoint Shapes

### NOAA CO-OPS Station 9447130

Use the CO-OPS Data Retrieval API. NOAA documents `predictions` and `water_level` products and supports JSON output through `datagetter`.

Base:

```text
https://api.tidesandcurrents.noaa.gov/api/prod/datagetter
```

Tide high/low predictions for the current Seattle date:

```text
GET /api/prod/datagetter
  ?date=today
  &station=9447130
  &product=predictions
  &datum=MLLW
  &time_zone=lst_ldt
  &interval=hilo
  &units=english
  &format=json
```

Observed water level:

```text
GET /api/prod/datagetter
  ?date=today
  &station=9447130
  &product=water_level
  &datum=MLLW
  &time_zone=lst_ldt
  &units=english
  &format=json
```

Example response shape:

```json
{
  "predictions": [
    { "t": "2026-04-28 03:31", "v": "11.277", "type": "H" },
    { "t": "2026-04-28 10:11", "v": "1.677", "type": "L" }
  ]
}
```

Adapter notes:

- Treat prediction timestamps as Seattle local civil time because `time_zone=lst_ldt`.
- Use `datum=MLLW` consistently in display metadata.
- Compute tide direction by comparing current time to surrounding high/low predictions and, when available, recent observed water-level trend.
- Show `predicted` and `observed` labels distinctly.
- Use NWS, not NOAA CO-OPS station `9447130`, for wind and visibility in Phase 1.

### NWS Forecast And Alerts

Use the waterfront point near Colman Dock/Pier 50:

```text
lat=47.602
lon=-122.337
```

NWS point lookup:

```text
GET https://api.weather.gov/points/47.602,-122.337
Accept: application/geo+json
User-Agent: <HARBOURWATCH_USER_AGENT>
```

Example point response fields from the verified request:

```json
{
  "properties": {
    "cwa": "SEW",
    "gridId": "SEW",
    "gridX": 124,
    "gridY": 68,
    "forecast": "https://api.weather.gov/gridpoints/SEW/124,68/forecast",
    "forecastHourly": "https://api.weather.gov/gridpoints/SEW/124,68/forecast/hourly",
    "forecastGridData": "https://api.weather.gov/gridpoints/SEW/124,68",
    "observationStations": "https://api.weather.gov/gridpoints/SEW/124,68/stations",
    "forecastZone": "https://api.weather.gov/zones/forecast/WAZ315",
    "county": "https://api.weather.gov/zones/county/WAC033",
    "timeZone": "America/Los_Angeles"
  }
}
```

Hourly forecast:

```text
GET {properties.forecastHourly}
Accept: application/geo+json
User-Agent: <HARBOURWATCH_USER_AGENT>
```

Active alerts for the point:

```text
GET https://api.weather.gov/alerts/active?point=47.602,-122.337
Accept: application/geo+json
User-Agent: <HARBOURWATCH_USER_AGENT>
```

Example no-alert response shape:

```json
{
  "type": "FeatureCollection",
  "features": [],
  "title": "Current watches, warnings, and advisories for 47.602 N, 122.337 W",
  "updated": "2026-04-26T17:00:00+00:00"
}
```

Adapter notes:

- Cache `/points/{lat},{lon}` but refresh periodically because NWS says grid mappings can change.
- Use `forecastHourly` for wind speed, wind direction, precipitation probability, temperature, and short forecast phrases.
- Use `observationStations` only if the app needs current observed conditions. Visibility may be absent or station-dependent; show `Visibility unavailable` rather than inventing it.
- Alert phrasing should remain mild and observational, for example `Weather advisory active` or `No active NWS alerts for waterfront point`.

### WSDOT/WSF Schedule And Alerts

Use WSF Schedule API only. The Schedule REST docs require `apiaccesscode={APIAccessCode}` for the relevant operations and repeatedly recommend `/cacheflushdate` for cache coordination.

Base:

```text
https://www.wsdot.wa.gov/Ferries/API/Schedule/rest
```

Startup/cache coordination:

```text
GET /cacheflushdate?apiaccesscode={WSDOT_API_ACCESS_CODE}
GET /validdaterange?apiaccesscode={WSDOT_API_ACCESS_CODE}
GET /terminals?apiaccesscode={WSDOT_API_ACCESS_CODE}
GET /routes/{TripDate}?apiaccesscode={WSDOT_API_ACCESS_CODE}
```

Service pattern inputs:

```text
GET /routeshavingservicedisruptions/{YYYY-MM-DD}?apiaccesscode={WSDOT_API_ACCESS_CODE}
GET /alerts?apiaccesscode={WSDOT_API_ACCESS_CODE}
GET /scheduletoday/{RouteID}/{OnlyRemainingTimes}?apiaccesscode={WSDOT_API_ACCESS_CODE}
```

Alternative schedule shape when terminal IDs are easier than route IDs:

```text
GET /scheduletoday/{DepartingTerminalID}/{ArrivingTerminalID}/{OnlyRemainingTimes}
  ?apiaccesscode={WSDOT_API_ACCESS_CODE}
```

Adapter notes:

- Resolve Colman Dock routes from `/terminals` and `/routes/{TripDate}` during setup instead of hardcoding route IDs in UI code.
- Target Bainbridge and Bremerton first unless product scope later adds more Colman Dock routes.
- Produce a service pattern phrase, not trip-planning UI: `mostly typical`, `minor delay pattern`, `route notice`, `schedule unavailable`.
- Store raw route/terminal IDs only inside the adapter cache.
- Do not call WSF Vessels API. Do not display vessel names, vessel positions, ETA tracking, route lines, or map markers.

### Seattle Open Data / Socrata

Use at most one dataset in Phase 1. The strongest fit is a quiet waterfront access context, such as Street Closures (`ium9-iqtc`) or Special Events Permits (`dm95-f8w5`).

Base resource pattern:

```text
https://data.seattle.gov/resource/{dataset_id}.json
```

Street closures sample:

```text
GET https://data.seattle.gov/resource/ium9-iqtc.json?$limit=25
X-App-Token: {SOCRATA_APP_TOKEN}
```

Example response shape from unauthenticated test request:

```json
[
  {
    "permit_number": "SUFUN0006134",
    "permit_type": "Farmers Market",
    "project_name": "Lake City Farmers Market 2026",
    "project_description": "...",
    "start_date": "2026-10-03T00:00:00.000",
    "end_date": "2026-12-19T00:00:00.000",
    "street_on": "28TH AVE NE",
    "line_string": {
      "type": "LineString",
      "coordinates": [[-122.297803219858, 47.7192917555059]]
    }
  }
]
```

Adapter notes:

- Use `X-App-Token` when available. Socrata documents higher throttling limits with an app token and `429` for throttled requests.
- Add geospatial or street-name filtering only after inspecting dataset schema. Do not assume every returned record is waterfront-relevant.
- Keep this panel lower prominence than tide, weather, ferry, and local notices.
- If token or query fails, omit civic context or show `Waterfront access context unavailable`.

## Normalized Adapter Contract

All adapters should return `HarbourSignal` envelopes so UI components never know provider quirks.

```ts
export type SignalFreshness = "fresh" | "stale" | "unavailable" | "fixture";
export type SignalKind = "observed" | "forecast" | "prediction" | "notice" | "fixture";
export type Audience = "terminal" | "harbour-office" | "visitor";

export interface HarbourSignal<TValue = unknown> {
  id: string;
  label: string;
  sourceName: string;
  sourceUrl?: string;
  kind: SignalKind;
  value: TValue | null;
  summary: string;
  observedAt?: string;
  validFrom?: string;
  validUntil?: string;
  fetchedAt: string;
  freshness: SignalFreshness;
  confidence: "high" | "medium" | "low";
  audiences: Audience[];
  staleReason?: string;
}

export interface HarbourAdapter<TValue = unknown> {
  id: string;
  read(now: Date): Promise<HarbourSignal<TValue>[]>;
}
```

Recommended adapter outputs:

| Adapter | Signal IDs | Summaries |
|---|---|---|
| `NoaaTideAdapter` | `tide.predictions`, `tide.observedWaterLevel` | `Tide rising through midday`, `Next high tide 16:26`, `Observed water level updated 08:12` |
| `NwsWeatherAdapter` | `weather.hourly`, `weather.alerts` | `Elliott Bay breezy`, `Rain later`, `No active NWS alerts` |
| `WsfServiceAdapter` | `ferry.servicePattern`, `ferry.alerts`, `ferry.scheduleAvailability` | `Ferry service mostly typical`, `1 route notice`, `Schedule source unavailable` |
| `SocrataCivicAdapter` | `civic.waterfrontAccess` | `Waterfront access context available`, `No current waterfront access notices found` |
| `LocalFixtureAdapter` | `local.notices`, `local.ferryFallback`, `local.environmentalContext` | `Guest dock capacity limited`, `Pier gate maintenance`, `Restroom hours changed` |

## Cache And Freshness Policy

Use two timestamps:

- `observedAt`: when the provider says the condition applies.
- `fetchedAt`: when the local adapter fetched or refreshed it.

Recommended thresholds:

| Signal | Refresh cadence | Fresh | Stale | Unavailable |
|---|---:|---:|---:|---|
| NOAA tide predictions | 6-12 hours | prediction covers current day | older than 48 hours | no current-day prediction |
| NOAA observed water level | 5-10 minutes | <= 20 minutes | > 20 and <= 60 minutes | > 60 minutes or no usable value |
| NWS `/points` mapping | 24 hours | <= 7 days | > 7 days | no cached mapping and request fails |
| NWS hourly forecast | 10-15 minutes | <= 2 hours | > 2 and <= 6 hours | > 6 hours or no periods |
| NWS alerts | 2-5 minutes | <= 10 minutes | > 10 and <= 30 minutes | > 30 minutes or repeated failure |
| WSF schedule/static metadata | `/cacheflushdate` guided; otherwise 12 hours | cache flush unchanged | unknown age > 24 hours | no access code and no fixture |
| WSF alerts/disruptions | 5-10 minutes | <= 10 minutes | > 10 and <= 30 minutes | > 30 minutes or access/API failure |
| Socrata civic context | 30-60 minutes | dataset-specific, usually <= 24 hours | > 72 hours | token/query failure and no cached result |
| Local fixtures | app startup/file watch | within `validUntil` | expired fixture still available | missing fixture file |

Implementation rules:

- Prefer stale last-known data over an empty panel when the source previously worked.
- Never silently mix stale live data with fresh fixture data. Each signal keeps its own freshness.
- Use exponential backoff after `429`, `503`, network timeout, or malformed payload.
- Store cache files under a local ignored path such as `.harbourwatch-cache/`.
- Keep cache values provider-shaped plus normalized-shaped if useful for debugging, but expose only normalized envelopes to UI.

## Local JSON Fixture Strategy

Fixtures are a first-class Phase 1 source, not fake live data. Keep them in repository-visible JSON so workshops are deterministic.

Recommended layout:

```text
fixtures/
  harbourwatch/
    local-notices.json
    ferry-service-patterns.json
    civic-context.json
    environmental-context.json
```

Notice fixture shape:

```json
{
  "id": "notice-guest-dock-limited",
  "title": "Guest dock capacity limited",
  "body": "Guest dock space is limited this afternoon.",
  "severity": "info",
  "sourceLabel": "Local fixture",
  "audiences": ["harbour-office"],
  "isPublic": false,
  "validFrom": "2026-04-28T06:00:00-07:00",
  "validUntil": "2026-04-28T20:00:00-07:00"
}
```

Fixture categories:

- Staff/local: guest dock capacity limited, fuel dock hours, pier gate maintenance, low-clearance reminder, internal berth notes.
- Visitor: restroom/service closure, kayak rental pause, waterfront access notice, ferry delay pattern.
- Environmental: CSO context, beach/water-quality context, cruise-day context, only when clearly labeled as fixture/manual context.
- Workshop fallback: ferry service pattern, civic access context, and one weather/tide stale-state demonstration.

Fixture wording rules:

- Use `Local notice`, `Demo fixture`, `Scheduled`, `Reported`, `Unavailable`, and `Updated`.
- Avoid `Proceed`, `Hold`, `Clear`, `Safe`, `Unsafe`, `Dispatch`, `Control`, and similar instruction language.
- Keep fixture provenance visible in the source line.

## Graceful Degradation

Every panel should render one of four states:

| State | UI behavior | Example wording |
|---|---|---|
| Fresh | Normal display with quiet source line | `NOAA CO-OPS, updated 08:12` |
| Stale | Keep last-known value, add stale marker | `Last NOAA water-level update 42 minutes ago` |
| Unavailable | Replace numbers with calm source status | `Ferry schedule source unavailable` |
| Fixture | Show fixture label as provenance | `Local fixture, valid today` |

Degradation priorities:

1. Tide predictions can usually remain useful from cache for the current day.
2. NWS forecast can remain visible as stale for up to 6 hours, but alerts should degrade faster.
3. WSF live data falls back to `ferry-service-patterns.json` when the access code is missing or requests fail.
4. Socrata civic context can disappear entirely if it is unavailable.
5. Local notices should remain available even when every live source fails.

Never show raw provider errors, stack traces, access codes, JSON payloads, or HTTP diagnostics in the user-facing display.

## Recommended Local-Only Architecture

Use a local backend-for-frontend, even if the app is otherwise static. This keeps WSDOT/Socrata credentials out of the browser and gives every source the same cache, stale, and fixture behavior.

```text
Browser UI
  -> GET /api/harbour-summary?audience=terminal
Local BFF/API route
  -> HarbourSummaryService
     -> NoaaTideAdapter
     -> NwsWeatherAdapter
     -> WsfServiceAdapter
     -> SocrataCivicAdapter
     -> LocalFixtureAdapter
  -> LocalCacheStore
  -> FixtureStore
```

Recommended runtime:

- Node/TypeScript local server or framework API routes.
- File-backed cache, no database for Phase 1.
- `.env.local` for credentials.
- `fixtures/` for deterministic fallback data.
- One aggregate endpoint consumed by the UI.

Aggregate response shape:

```ts
export interface HarbourSummary {
  generatedAt: string;
  audience: Audience;
  place: {
    label: "Seattle waterfront";
    anchors: ["Elliott Bay", "Colman Dock", "Pier 50"];
  };
  conditionStrip: HarbourSignal[];
  panels: {
    tide: HarbourSignal[];
    weather: HarbourSignal[];
    ferry: HarbourSignal[];
    notices: HarbourSignal[];
    civic?: HarbourSignal[];
  };
  sourceLine: string;
}
```

Audience filtering:

- `terminal`: ferry service pattern, tide/weather, active notices that affect passenger-facing operation.
- `harbour-office`: tide and wind prominence, staff/local notices, ferry as secondary context.
- `visitor`: reduced view, public notices only, no berth capacity, no staff maintenance details, no provider diagnostics.

## Build Order

1. Implement `HarbourSignal`, adapter interface, cache store, and fixture store.
2. Implement `LocalFixtureAdapter` first so the UI always has deterministic data.
3. Implement `NoaaTideAdapter` for `9447130` predictions and observed water level.
4. Implement `NwsWeatherAdapter` with `/points`, `forecastHourly`, and `/alerts/active?point=...`.
5. Implement `WsfServiceAdapter` behind an optional `WSDOT_API_ACCESS_CODE`; fallback to fixtures when absent.
6. Add optional `SocrataCivicAdapter` only after the core display is stable.
7. Add integration tests with mocked provider payloads and fixture fallback tests before relying on live calls.

## Source Links Verified

- NOAA CO-OPS Data Retrieval API: https://api.tidesandcurrents.noaa.gov/api/dev
- NOAA station inventory for `9447130`: https://tidesandcurrents.noaa.gov/inventory.html?id=9447130
- NWS API documentation: https://www.weather.gov/documentation/services-web-api
- NWS alerts documentation: https://www.weather.gov/documentation/services-web-alerts
- WSDOT Traveler Information API: https://www.wsdot.wa.gov/traffic/api/
- WSF Schedule API REST documentation: https://www.wsdot.wa.gov/ferries/api/schedule/documentation/rest.html
- Socrata app token documentation: https://dev.socrata.com/docs/app-tokens.html
- Seattle Open Data program: https://www.seattle.gov/tech/reports-and-data/open-data
