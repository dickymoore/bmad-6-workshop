---
stepsCompleted: [1]
inputDocuments:
  - _bmad-output/brainstorming/brainstorming-session-2026-04-28-182912.md
workflowType: research
research_type: domain
research_topic: HarbourWatch Phase 1 public data sources for a local-only Seattle waterfront harbour conditions display
research_goals: Identify free/open credible public data sources for NOAA tides/currents/weather, Washington State Ferries and ferry information, Seattle open data, and civic/environmental feeds; assess licensing/terms, rate limits, freshness, reliability, implementation complexity, and fixture gaps.
user_name: Dicky
date: 2026-04-28
web_research_enabled: true
source_verification: true
---

# Research Report: HarbourWatch Phase 1 Data Sources

**Date:** 2026-04-28  
**Author:** Dicky  
**Research Type:** Domain research  

## Executive Summary

HarbourWatch Phase 1 can credibly use free public sources for the environmental and ferry context that matters to a calm Seattle waterfront display:

- **Use live:** NOAA CO-OPS Seattle station 9447130 for tide predictions, observed water level, water temperature, and barometric pressure; NWS API for forecast, observations, and alerts; WSDOT/WSF Schedule API for ferry schedules, route disruptions, and alerts.
- **Use carefully:** WSF vessel locations and ETA data are available, but they push the product toward live tracking. For Phase 1, derive a mild "service pattern" from schedules, alerts, and route disruptions instead of showing vessel positions.
- **Use as context, not operations:** Seattle Open Data/Socrata, King County CSO status, Ecology EIM, King County marine/beach water quality, Port of Seattle cruise schedule, and Waterfront Park pages can support civic/environmental awareness, but most are not real-time operational feeds.
- **Use fixtures:** berth availability, dock capacity, fuel dock hours, pier gate maintenance, local safety notices, kayak rental pauses, restroom/service closures, and staff-only notices should be fixtures with explicit provenance. Public open feeds do not provide reliable local harbour-office state for these items.

The product should expose source and freshness as part of the display, not as a diagnostics panel. A realistic Phase 1 refresh strategy is 5-15 minutes for weather/tide/ferry summary, 30+ seconds minimum for NWS alerts, cache-aware polling for WSF schedules, and fixture-first fallback when any live feed is unavailable.

## Scope From Brainstorming

The completed brainstorming artifact defines HarbourWatch as a Seattle waterfront conditions display, not a command or vessel traffic system. Data choices therefore need to support:

- A ten-second normality check for staff and visitors.
- A calm condition strip and harbour day summary.
- Role views for terminal, harbour office, and visitor audiences.
- Visible source/freshness metadata.
- Graceful staleness and workshop resilience.
- Explicit exclusion of AIS-style vessel maps, live control, dispatch, berth automation, trip planning, and raw feed surfaces.

## Recommended Phase 1 Source Stack

| Layer | Source | Use In HarbourWatch | Recommendation |
|---|---|---|---|
| Tide and water level | NOAA CO-OPS Data API and station 9447130 Seattle | Tide rising/falling, next high/low, observed water level, water temperature/barometer where available | **Primary live source** |
| Weather and alerts | NWS API `api.weather.gov` | Forecast phrases, wind/rain/visibility, active weather/marine alerts | **Primary live source** |
| Ferry service pattern | WSDOT/WSF Schedule API | Today's sailings, route disruption indicator, route/bulletin alerts | **Primary live source with access code** |
| Ferry public context | King County Water Taxi via regional transit/OneBusAway where needed | Pier 50 water taxi context, not route planning | **Optional; fixture is acceptable** |
| Local civic context | Seattle Open Data/Socrata | Street closures, special events, construction permits near waterfront if useful | **Secondary; keep low prominence** |
| Environmental awareness | King County CSO status, Ecology EIM, King County marine/beach water quality | "Recent CSO notice", seasonal water-quality context, environmental note | **Secondary; source freshness must be clear** |
| Waterfront visitor context | Seattle Waterfront Park pages, Port of Seattle cruise schedule | Visitor-facing hours/notices, cruise-day context | **Manual or fixture-backed unless API exists** |
| Harbour operations | Local fixture JSON | berth/dock notices, service closures, staff-facing maintenance | **Fixture-backed by design** |

## Source Assessments

### 1. NOAA CO-OPS Tides, Water Levels, and Marine Measurements

**Primary value:** authoritative tide and water-level context for Elliott Bay/Seattle waterfront.

**Relevant source facts:**

- NOAA CO-OPS provides an API for observations and predictions, including water levels, predictions, currents, and meteorological observations. The Data API documentation lists products such as predictions, wind, visibility, currents, and water levels.
- The Seattle station is **9447130 Seattle, WA**. NOAA's station inventory shows preliminary 6-minute water level, verified water level, water temperature, and barometric pressure availability. Wind and air temperature appear historically available but not current at that station, so NWS should be the main wind/weather source.
- NOAA documents request length limits by interval: 1-minute data up to 4 days, 6-minute data up to 1 month, hourly up to 1 year, high/low up to 1 year, and longer ranges for daily/monthly products.
- NOAA also states CO-OPS throttles heavy load and recommends spacing calls and downloading only needed data.

**Licensing/terms:** U.S. government/public NOAA data; cite NOAA/NOS/CO-OPS as source. Use NOAA's own API/documentation links and avoid implying NOAA endorsement.

**Rate limits:** no fixed public numeric limit for CO-OPS; request volume and range are limited. Build client-side caching and backoff.

**Freshness:** observed water level can be near-real-time/6-minute style; predictions can be precomputed daily; verified data lags. Display "observed" vs "predicted" clearly.

**Reliability:** high for a public awareness display. It is the strongest source for tide/water-level credibility.

**Implementation complexity:** low to medium. Simple HTTP JSON/CSV calls, but product choices require unit/datum/time-zone consistency.

**Suggested Phase 1 implementation:**

- Use station `9447130`.
- Pull today's tide predictions using `product=predictions`, `datum=MLLW`, `interval=hilo`, `time_zone=lst_ldt`, `units=english`, `format=json`.
- Pull recent observed water level using `product=water_level`, short range/date, `datum=MLLW`.
- Pull water temperature/barometer from CO-OPS only if current inventory confirms recent readings; otherwise omit or fixture with label.
- Translate into phrases: "Tide rising", "Next high tide 12:42", "Observed water level updated 08:12".

**Gaps/fixture recommendation:** currents for central Elliott Bay may not be straightforward from the Seattle tide station. Avoid live current claims unless a NOAA current prediction station is selected and validated. If the UI needs "harbour current note", use a clearly labeled fixture or omit.

Sources: [NOAA CO-OPS Data API](https://api.tidesandcurrents.noaa.gov/api/dev), [NOAA Seattle station inventory](https://tidesandcurrents.noaa.gov/inventory.html?id=9447130), [NOAA Seattle tide predictions](https://prod.tidesandcurrents.noaa.gov/noaatideannual.html?id=9447130), [NOAA tide/current overview](https://oceanservice.noaa.gov/facts/find-tides-currents.html)

### 2. National Weather Service API

**Primary value:** free official forecast, observations, and alerts for the Seattle waterfront.

**Relevant source facts:**

- NWS states the API gives access to forecasts, alerts, observations, and other weather data at `https://api.weather.gov`.
- NWS says the API is open data, free to use for any purpose, with reasonable but non-public rate limits.
- A unique `User-Agent` header is required and should identify the application, ideally with contact information.
- The API is designed to be cache-friendly.
- NWS alert documentation recommends requesting alerts no more than every 30 seconds and notes rate-limiting firewalls.

**Licensing/terms:** open/free public-service data. Attribute NWS/NOAA. Do not present as guaranteed operational decision support.

**Rate limits:** non-public for the main API; alerts should be polled no more often than every 30 seconds. Use HTTP cache headers, backoff, and a clear User-Agent.

**Freshness:** forecasts update by NWS issuance cycle; observations depend on reporting station; alerts are current enough for awareness but should not be the sole emergency source.

**Reliability:** high for weather/alerts, but the API can return 503/429 or stale/cache states. Build stale handling.

**Implementation complexity:** medium. The `/points/{lat},{lon}` lookup returns forecast endpoints; applications should cache but periodically refresh grid mappings because office/grid can change.

**Suggested Phase 1 implementation:**

- Use a waterfront point near Colman Dock/Pier 50, for example approximately `47.602,-122.337`.
- Initial lookup: `/points/{lat},{lon}`.
- Use returned `forecastHourly` for wind/rain/temperature phrases.
- Use observations via nearest station metadata from the point response, if available.
- Use `/alerts/active?point={lat},{lon}` or relevant zones for active weather/marine alerts.
- Poll forecast every 10-15 minutes; alerts no more often than 30 seconds and probably 5 minutes for this demo.

**Gaps/fixture recommendation:** visibility may be spotty depending on observation station. If visibility is absent, show "Visibility unavailable" or a fixture in demo mode; do not invent it.

Sources: [NWS API documentation](https://www.weather.gov/documentation/services-web-api), [NWS alerts documentation](https://www.weather.gov/documentation/services-web-alerts)

### 3. Washington State Ferries / WSDOT Traveler API

**Primary value:** official ferry schedule and service-disruption context for Colman Dock routes.

**Relevant source facts:**

- WSDOT's Traveler Information API is a gateway to WSDOT traveler information data, including WSF schedule, terminals, vessels, fares, and other travel data.
- WSF API documentation says a valid WSDOT Traveler API access code is required for most REST operations.
- WSF Schedule API exposes terminals, routes, route disruptions, scheduled routes, sailings, today's schedule, time adjustments, and alerts.
- Schedule operations recommend using `/cacheflushdate` to coordinate caching for data that changes infrequently.
- WSF Vessels API exposes vessel locations and ETA data and says this data can change very frequently, potentially every 5 seconds, and should not be cached for an extended period.

**Licensing/terms:** public WSDOT data with access-code requirement. Register an email for an access code. Attribute WSDOT/WSF. Review WSDOT disclaimers before public deployment.

**Rate limits:** no clear numeric public REST rate limit found in the WSF docs. Treat access-code use conservatively; cache schedule/static endpoints, use route alerts/disruptions at a low polling rate, and avoid frequent vessel polling in Phase 1.

**Freshness:** schedules and static route data are cacheable; alerts/disruptions are event-driven but exposed by polling; vessel locations can be very frequent.

**Reliability:** good official source, but the older API shape and access-code requirement add integration friction.

**Implementation complexity:** medium. The API has many route/terminal IDs and date-specific calls; build a small adapter that resolves relevant Colman Dock routes once and caches identifiers.

**Suggested Phase 1 implementation:**

- Use `/scheduletoday` or `/schedule` for Bainbridge/Bremerton route summaries if terminal/route IDs are known.
- Use `/routeshavingservicedisruptions/{TripDate}` and `/alerts` for "ferry service pattern".
- Use `/cacheflushdate` for schedule cache invalidation.
- Avoid `/vessellocations` in the main UI; it undermines the "not a control room" boundary.

**Gaps/fixture recommendation:** the product goal is not ferry trip planning. If WSDOT access-code setup is inconvenient for workshops, use fixture ferry patterns that mirror WSF concepts: "mostly typical", "minor delay pattern", "route notice", and "schedule data unavailable".

Sources: [WSDOT Traveler Information API](https://www.wsdot.wa.gov/traffic/api/), [WSF Schedule API REST documentation](https://www.wsdot.wa.gov/ferries/api/schedule/documentation/rest.html), [WSF Vessels API documentation](https://www.wsdot.wa.gov/ferries/api/vessels/documentation/), [WSF Vessels API REST documentation](https://www.wsdot.wa.gov/ferries/api/vessels/documentation/rest.html)

### 4. King County Water Taxi / Regional Transit Feeds

**Primary value:** visitor context for Pier 50 water taxi service, especially West Seattle/Vashon routes.

**Relevant source facts:**

- Sound Transit Open Transit Data points developers to Puget Sound OneBusAway for real-time regional data and requires requesting an API key by email.
- OneBusAway supports GTFS-realtime exports for alerts, trip updates, and vehicle positions per agency.

**Licensing/terms:** GTFS/GTFS-realtime public-transit ecosystem; API key required for the Puget Sound OneBusAway data engine. Confirm King County/Sound Transit terms before redistribution.

**Rate limits:** not clearly specified on the pages reviewed. Treat as API-key governed; cache and poll modestly.

**Freshness:** potentially real-time for transit, but less important to HarbourWatch than WSF and weather/tide.

**Reliability:** adequate for transit context, but it adds dependency and parsing cost.

**Implementation complexity:** medium to high if consuming raw GTFS-realtime protocol buffers; lower if using OneBusAway REST endpoints.

**Phase 1 recommendation:** fixture or omit. Show water taxi only as a static waterfront context item unless a later story needs live Pier 50 passenger-service status.

Sources: [Sound Transit Open Transit Data](https://www.soundtransit.org/help-contacts/business-information/open-transit-data-otd/otd-downloads), [OneBusAway GTFS-realtime export API](https://developer.onebusaway.org/api/gtfs-realtime)

### 5. Seattle Open Data / Socrata

**Primary value:** city context, not real-time harbour operations.

**Relevant source facts:**

- Seattle's Open Data Program makes city-generated data openly available for transparency, economic development, research, and public understanding.
- Data.seattle.gov runs on Socrata/SODA. Socrata allows unauthenticated public queries, but an application token provides higher throttling limits.
- Socrata states app-token requests are currently not throttled unless abusive or malicious, while unauthenticated requests share IP-based throttling and can receive 429 responses.

**Likely useful datasets:**

- `ium9-iqtc` Street Closures: possible waterfront access context.
- `dm95-f8w5` Special Events Permits: possible event-day visitor context.
- `kzjm-xkqj` Seattle Real Time Fire 911 Calls: technically available but likely too alarmist/noisy for Phase 1 unless heavily filtered and delayed/cautioned.
- `w3ip-ra4u` Rain Gages: possible local precipitation context, though NWS should be primary.
- Building/construction permit datasets: low-priority background only, not live notices.

**Licensing/terms:** open city data; dataset-specific license/metadata should be checked before public release. Cite City of Seattle and dataset names.

**Rate limits:** use a Socrata app token for reliable development; expect 429 if abusive or unauthenticated at volume.

**Freshness:** varies heavily by dataset. Some are near-real-time; many are administrative and updated daily/monthly or irregularly.

**Reliability:** good for low-priority civic context; weak for operational waterfront state.

**Implementation complexity:** low. SODA JSON endpoints are easy to query, but each dataset needs schema inspection and geospatial filtering.

**Phase 1 recommendation:** use one civic feed at most, probably street closures or special events, and show it quietly as "waterfront access context." Avoid fire 911 in public/staff displays unless the product explicitly needs safety awareness and can prevent over-alarming.

Sources: [Seattle Open Data program](https://www.seattle.gov/tech/reports-and-data/open-data), [Socrata app token and throttling documentation](https://dev.socrata.com/docs/app-tokens.html), [Street Closures dataset](https://data.seattle.gov/w/ium9-iqtc/2myu-6xk5), [Special Events Permits dataset](https://data.seattle.gov/w/dm95-f8w5/2myu-6xk5), [Seattle Real Time Fire 911 Calls dataset](https://data.seattle.gov/w/kzjm-xkqj/2myu-6xk5)

### 6. Civic and Environmental Feeds

#### King County CSO Status

**Use:** a calm environmental note after heavy rain, such as "CSO status source available; latest status not reviewed." This should not become health advice.

**Source facts:** King County's CSO status map gives current recent CSO information for Seattle-area overflow points and says real-time data has not yet been reviewed for accuracy; confirmed data appears in monthly and annual reports.

**Complexity:** medium. The public page is map-centric; an official machine-readable endpoint was not confirmed in this pass. If no stable endpoint is documented, treat as manual/fixture.

**Recommendation:** fixture for Phase 1 unless a stable official endpoint is identified.

Source: [King County CSO status](https://aqua.kingcounty.gov/dnrp/short-term/cso-status.html)

#### Washington Department of Ecology EIM

**Use:** background environmental credibility, not live display.

**Source facts:** Ecology's EIM contains monitoring data for air, water, soil, sediment, aquatic animals, and plants, with search/map/download access.

**Freshness:** long-term/monitoring data, not a live harbour condition feed.

**Complexity:** medium to high for targeted extraction.

**Recommendation:** use for later research or static environmental context; omit from Phase 1 live surface.

Source: [Washington Ecology EIM](https://ecology.wa.gov/Research-Data/Data-resources/Environmental-Information-Management-database)

#### King County Marine/Beach Water Quality

**Use:** seasonal visitor context only, especially Alki/nearby beaches, not central harbour operations.

**Source facts:** Ecology's King County BEACH report says sampling occurs weekly or bi-weekly during the season; King County's marine data catalog lists beach water quality data from 20 marine beaches, sampled monthly for temperature, salinity, nutrients, and bacteria.

**Freshness:** seasonal weekly/biweekly or monthly, depending on program. Not suitable for live water-quality claims at Colman Dock.

**Recommendation:** fixture or static "environmental program source" link for Phase 1.

Sources: [Ecology King County BEACH report](https://ecology.wa.gov/research-data/monitoring-assessment/beach-annual-report/king-county), [King County Marine Data Catalog](https://cdn.kingcounty.gov/zh-cn/dept/dnrp/nature-recreation/environment-ecology-conservation/science-services/puget-sound-marine-monitoring/marine-data-catalog)

#### Seattle Waterfront Park / Port of Seattle Cruise Schedule

**Use:** visitor awareness: park hours, restroom-hour context, cruise-day context.

**Source facts:** Seattle Waterfront visitor information lists Waterfront Park open hours and seasonal restroom hours; Port of Seattle cruise dashboard links to cruise schedules and says dashboard information is linked to internal data and updated monthly.

**Freshness:** web/manual, not API-grade operational feed.

**Recommendation:** encode as fixtures, refreshed manually before demos. Use "local fixture" label.

Sources: [Seattle Waterfront visitor information](https://www1.seattle.gov/waterfront/visitor-information), [Port of Seattle cruise activity dashboard](https://www.portseattle.org/cruisedashboard)

## Data Model Recommendations

Use a normalized source envelope for every live and fixture signal:

```json
{
  "id": "tide-seattle-9447130",
  "label": "Seattle tide",
  "sourceName": "NOAA CO-OPS",
  "sourceUrl": "https://api.tidesandcurrents.noaa.gov",
  "kind": "observed | forecast | prediction | notice | fixture",
  "value": {},
  "summary": "Tide rising through midday",
  "observedAt": "2026-04-28T08:12:00-07:00",
  "fetchedAt": "2026-04-28T08:15:00-07:00",
  "freshness": "fresh | stale | unavailable | fixture",
  "confidence": "high | medium | low",
  "audiences": ["terminal", "harbour-office", "visitor"]
}
```

Recommended stale thresholds:

| Signal | Fresh | Stale | Unavailable |
|---|---:|---:|---:|
| NOAA tide prediction | 24 hours | 48 hours | no prediction for current day |
| NOAA observed water level | 20 minutes | 60 minutes | no value after retries |
| NWS forecast | 2 hours | 6 hours | no forecast endpoint/value |
| NWS alerts | 10 minutes | 30 minutes | repeated API failure |
| WSF alerts/disruptions | 5-10 minutes | 30 minutes | access/API failure |
| Seattle civic feeds | 24 hours or dataset-specific | 72 hours | no dataset response |
| Fixtures | valid through fixture date | after fixture expiry | missing fixture file |

## Implementation Complexity Ranking

| Rank | Source | Complexity | Reason |
|---:|---|---|---|
| 1 | NOAA CO-OPS tide predictions | Low | Single station, simple JSON/CSV, stable source |
| 2 | NWS forecast/alerts | Medium | Requires point lookup, cache headers, User-Agent, occasional 429/503 handling |
| 3 | WSF schedule/alerts | Medium | Access code, IDs, date-specific routes, older docs |
| 4 | Seattle Open Data/Socrata | Low-medium | Easy API, but dataset schemas and freshness vary |
| 5 | WSF vessel locations | Medium | Easy endpoint but wrong product incentives; frequent data |
| 6 | King County/WA environmental feeds | Medium-high | Good public data, but often map/download oriented and not display-real-time |
| 7 | OneBusAway/GTFS-RT | Medium-high | API key and protocol buffer parsing if using GTFS-realtime |

## Phase 1 Fixture Strategy

Fixtures are better than live feeds for:

- Guest dock capacity limited.
- Fuel dock hours.
- Pier gate maintenance.
- Low-clearance reminder.
- Kayak rental pause.
- Restroom/service closure.
- Internal maintenance notices.
- Staff-only berth notes.
- Public-friendly waterfront notices when no official API exists.
- Workshop ferry fallback patterns.
- Environmental notices where the public source is map/manual and not API-stable.

Fixture rules:

- Label as `Local fixture` or `Demo fixture`.
- Include `validFrom`, `validUntil`, `audience`, `severity`, `sourceLabel`, and `isPublic`.
- Never mix fixtures into live source lines without marking them.
- Keep wording observational: "Local notice", "Reported", "Scheduled", "Unavailable", "Fixture".

## Phase 1 Data Product Recommendation

Build these adapters first:

1. **NOAA Tide Adapter**
   - Inputs: station `9447130`.
   - Outputs: tide direction, next high/low, observed water-level timestamp, optional water temperature/barometer.

2. **NWS Weather Adapter**
   - Inputs: waterfront lat/lon.
   - Outputs: wind phrase, precipitation/temperature phrase, visibility if available, active alerts summary.

3. **WSF Service Pattern Adapter**
   - Inputs: WSDOT access code, selected Colman Dock routes.
   - Outputs: service pattern phrase, route notice count, today's schedule availability.

4. **Local Notices Fixture Adapter**
   - Inputs: local JSON file.
   - Outputs: role-filtered notices with source/freshness metadata.

5. **Optional Civic Context Adapter**
   - Inputs: one Socrata dataset, likely street closures or special events.
   - Outputs: low-prominence "waterfront access context" item.

## Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| API awkwardness leaks into UI | Product feels like a developer demo | Normalize all feeds into phrases and source envelopes |
| NOAA station has incomplete current met data | Missing wind/visibility from CO-OPS | Use NWS as primary weather source |
| WSF access code setup blocks workshops | Ferry panel empty | Use fixture-backed ferry pattern fallback |
| Vessel location data tempts map/tracking UI | Scope creep into vessel traffic display | Do not include vessel map or vessel polling in Phase 1 |
| Civic feeds have inconsistent freshness | Misleading visitor notices | Show dataset freshness and keep civic context low prominence |
| Environmental feeds are not real-time | False precision | Use as contextual notices, not health/safety advice |
| Live API outage during BMAD workshop | Broken display | Cache last-known values and fixtures; show stale/unavailable states as designed UI |

## Open Questions

- Which exact Colman Dock WSF route IDs and terminal IDs should the adapter target first: Bainbridge, Bremerton, or both?
- Should Phase 1 include King County Water Taxi at all, or only mention Pier 50 as local context?
- Is the demo allowed to register and store a WSDOT access code locally, or should ferry data be fixture-only until later?
- Should environmental context appear in staff mode only, visitor mode only, or both with different wording?
- Do we want a single local JSON fixture file or separate fixtures by role/source?

## Bottom Line

For HarbourWatch Phase 1, the credible live core is **NOAA CO-OPS + NWS + WSF schedule/alerts**. Everything else should be either optional context or an explicitly labeled fixture. That combination supports the brainstorming goal: a calm Seattle waterfront awareness display that feels situated and useful without pretending to be a control system.
