---
title: "Product Brief: HarbourWatch Phase 1"
status: "complete"
created: "2026-04-28"
updated: "2026-04-28"
inputs:
  - "_bmad-output/brainstorming/brainstorming-session-2026-04-28-182912.md"
  - "docs/research/domain-harbourwatch-phase-1-data-sources-research-2026-04-28.md"
  - "docs/research/technical-harbourwatch-phase-1-api-integration-notes-2026-04-28.md"
---

# Product Brief: HarbourWatch Phase 1

## Executive Summary

HarbourWatch is a local-only Seattle waterfront conditions display for ferry-terminal teams, marina and harbour-office staff, and visitors. It gives a calm, glanceable picture of the harbour-side day: tide direction, wind and weather, visibility where available, ferry service pattern, local notices, and source freshness. It should feel like something mounted in a harbour office or ferry-terminal lobby, not a maritime control room.

Phase 1 exists to prove the product judgment: combine credible public sources with transparent local fixtures, make current conditions legible in ten seconds, and stay intentionally outside vessel traffic management. HarbourWatch does not direct action, assign berths, track vessels, clear departures, or provide safety-critical decision support. It observes, summarizes, and labels uncertainty.

The first version should prefer open and public APIs where they are credible: NOAA CO-OPS for Seattle tide and water-level context, the National Weather Service for forecast and alerts, and Washington State Ferries schedule/alert data for ferry service pattern when a WSDOT access code is available. Local harbour-office notices, berth/dock notes, visitor service notices, and workshop fallbacks should be fixture-backed and explicitly labeled.

## The Problem

Waterfront staff and visitors often need quick situational awareness, but the relevant signals live in separate places: weather, tide tables, ferry service updates, civic notices, internal dock notes, and local service changes. Existing sources are credible but fragmented, technical, or too detailed for a shared display.

For ferry-terminal teams, the first question is whether waterfront conditions and ferry service are broadly normal, whether anything passenger-facing needs attention, and whether data is current. For marina and harbour-office staff, the day is shaped more by tide, wind, visibility, dock/service notices, and visitor-facing advisories. For visitors, the need is simpler: what kind of waterfront day is this, are ferry delays reported, and are there notices that affect their visit?

The cost of the status quo is not only time spent checking feeds. It is also ambiguity: stale data can look current, internal details can leak into public contexts, and visually dramatic maritime interfaces can imply authority the product does not have.

## Users and Value

**Ferry-terminal teams** need a ten-second normality check covering weather, tide, broad ferry service pattern, and visible notices. HarbourWatch helps them orient themselves and communicate calmly without becoming dispatch tooling.

**Marina and harbour-office staff** need the shape of the harbour day: tide window, wind direction and gusts, visibility, rain/temperature, and practical local notices such as guest dock capacity, fuel dock hours, pier gate maintenance, low-clearance reminders, kayak pauses, or service closures.

**Visitors and ferry passengers** need a reduced public display with plain language: typical, breezy, limited visibility, rain later, ferry delays reported, local notice. They should not see staff-only berth capacity, internal maintenance details, or provider diagnostics.

The value is shared orientation: HarbourWatch turns multiple public and fixture-backed signals into a situated Seattle waterfront summary that is calm, honest, and readable at a glance.

## Phase 1 Scope

Phase 1 should include three role views: `terminal`, `harbour-office`, and `visitor`. These are reading modes, not a configuration system. The primary interaction should be role switching, with optional refresh.

The display should include a calm condition strip, a short harbour day summary, tide and weather panels, ferry service pattern, local notices, and a quiet data confidence/source line. Seattle locality should be built into the information design through labels and sentence structure: Elliott Bay, Colman Dock, Pier 50, Seattle waterfront, ferry routes, and local notices.

The live data core should include NOAA CO-OPS station `9447130` for tide predictions and observed water level, NWS API for forecast and active alerts near Colman Dock/Pier 50, and WSDOT/WSF Schedule API for schedule, route alerts, and disruption context when credentials are available. One Seattle Open Data/Socrata civic feed may be added only as low-prominence waterfront access context after the core display is stable.

Fixture-backed data should cover harbour-office notices, berth/dock notes, public service notices, ferry fallback patterns, environmental context, and workshop resilience. Fixtures are not fake live data; they are local signals with visible provenance, validity windows, audience rules, and source labels.

## Non-Goals

HarbourWatch Phase 1 is not a vessel traffic management system, command center, emergency operations tool, dispatch interface, ferry trip planner, berth assignment system, or regulatory decision-support product.

Phase 1 excludes AIS, live vessel maps, vessel positions, vessel ETA tracking, route lines, live cameras, collision avoidance, occupancy prediction, historical analytics, accounts, admin configuration, raw API payloads, and control-style commands. The product should also avoid radar styling, glowing map pins, red/green clearance language, vessel icons, and dense technical charting.

Copy must remain observational. Use labels such as Observed, Forecast, Updated, Next tide, Service pattern, Notice, Source, Stale, Fixture, and Unavailable. Avoid directive language such as Proceed, Hold, Clear, Safe, Unsafe, Dispatch, or Control.

## Data Strategy and Seattle API Rationale

HarbourWatch should normalize every source into a common signal envelope with source name, source URL where useful, kind, summary, observed/applicable timestamp, fetched timestamp, freshness, confidence, audience, and stale reason. UI components should consume these normalized signals rather than provider-shaped data.

NOAA CO-OPS is the strongest live source for tide and water-level credibility on the Seattle waterfront. Station `9447130` supports Seattle tide predictions and observed water-level context, making it appropriate for phrases such as "Tide rising through midday" and "Next high tide 16:26." Wind and visibility should not come from this station in Phase 1; NWS is the primary weather source.

NWS is the appropriate source for weather phrases, forecast, wind, precipitation, and active alerts near the waterfront point around `47.602,-122.337`. The app should provide a unique User-Agent, respect cache behavior, and show missing visibility as unavailable rather than inventing it.

WSDOT/WSF Schedule API is the right ferry source because HarbourWatch needs service pattern and route notice context, not vessel tracking. The app should use schedules, alerts, route disruptions, and cache coordination. It should not call or display WSF vessel locations in Phase 1 because that pushes the product toward tracking and control-room expectations.

Seattle Open Data and environmental/civic sources should be secondary. Street closures or special events can support waterfront access context, but most civic and environmental feeds are not live harbour-office signals. King County CSO, water-quality, Port of Seattle cruise, and Waterfront Park information are better as manual or fixture-backed context unless a stable official endpoint is selected later.

## UX Tone

The UX should feel like a calm harbour office or terminal conditions board: quiet hierarchy, high legibility, practical place names, and selective emphasis only when variance matters. Calm does not mean low information or low contrast. Stale feeds, unavailable sources, unusual wind/visibility, material ferry disruption, and relevant local notices should be visually clear.

The first screen should answer "what kind of waterfront day is this?" before showing detail. Use phrase-first summaries with numbers where they add credibility. Source and freshness metadata should be present on each panel but visually secondary. Provider errors, stack traces, credentials, and raw diagnostics should never appear in the display.

## Success Criteria

- A terminal user can understand broad waterfront normality, ferry service pattern, weather/tide variance, and relevant notices within ten seconds.
- A harbour-office user can understand tide window, wind, visibility/weather, and local notices without ferry information dominating the display.
- A visitor can read a public-safe waterfront summary without seeing internal staff details or technical feed state.
- Every displayed signal clearly communicates whether it is fresh, stale, unavailable, or fixture-backed.
- The app remains useful when WSDOT or Socrata credentials are missing and when one or more live APIs fail.
- The UI avoids vessel tracking, command language, and control-room visual metaphors.
- Seattle locality is evident in content hierarchy and wording, not only in the page title.

## Key Risks

**Generic dashboard drift:** A grid of equal-weight cards would lose the product's reason to exist. Mitigation: lead with synthesis, condition strip, and harbour day summary.

**API awkwardness leaking into UX:** Public feeds have inconsistent schemas, timestamps, and freshness. Mitigation: normalize in local adapters and expose calm source states.

**Hidden staleness:** A polished display can damage trust if stale data looks current. Mitigation: freshness is a first-class product state.

**Scope creep into maritime operations:** Vessel APIs and map visuals are tempting. Mitigation: exclude vessel positions, AIS-style maps, command language, and control interactions from Phase 1.

**Workshop fragility:** A local demo that depends on live APIs can fail at the wrong moment. Mitigation: implement fixtures and graceful degradation before optional civic integrations.

## Recommended Next BMAD Step

Use `bmad-create-prd` next, with this brief and the detail pack as inputs. The PRD should make non-goals, user roles, data honesty, stale/unavailable states, and acceptance criteria explicit before feature expansion. After the PRD, run `bmad-create-ux-design` because HarbourWatch's value depends heavily on visual hierarchy, tone, and role-specific reading modes.
