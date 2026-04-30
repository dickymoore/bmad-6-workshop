---
title: "Product Brief Distillate: HarbourWatch Phase 1"
type: llm-distillate
source: "product-brief-harbourwatch-phase-1.md"
created: "2026-04-28"
purpose: "Token-efficient context for downstream PRD creation"
---

# Product Brief Distillate: HarbourWatch Phase 1

## Product Intent

- HarbourWatch Phase 1 is a local-only Seattle waterfront harbour-side conditions display for ferry-terminal teams, marina/harbour-office staff, and visitors.
- Positioning must remain "calm harbour office / ferry terminal display," not vessel traffic management, maritime surveillance, operational control, or emergency decision support.
- The product's job is shared orientation: synthesize tide, weather, visibility when available, ferry service pattern, local notices, and source freshness into a ten-second waterfront read.

## Users and First-Ten-Second Needs

- Ferry-terminal teams need broad normality, ferry service pattern, tide/wind/visibility variance, and passenger-facing notices without dispatch tooling.
- Marina/harbour-office staff need tide window, wind direction/gusts, visibility/weather, dock/service notices, and visitor-facing advisories; tide and wind are more prominent than ferry status.
- Visitors need a reduced public display with calm waterfront summary, ferry service pattern, tide direction/next tide, simple weather language, and only experience-affecting notices.

## Scope Signals

- In scope: role views for `terminal`, `harbour-office`, and `visitor`; calm condition strip; harbour day summary; tide panel; weather panel; ferry service pattern; local notices; source/freshness line; graceful stale/unavailable states.
- In scope: local-only runtime; local backend-for-frontend/API route; file-backed cache; repository-visible fixtures; optional `.env.local` credentials.
- In scope: fixture-backed local notices with `validFrom`, `validUntil`, `audiences`, `severity`, `sourceLabel`, and `isPublic`.
- Optional in Phase 1: one low-prominence Seattle Open Data/Socrata civic feed such as street closures or special events, after the core display is stable.

## Non-Goals and Rejected Ideas

- Reject AIS, live vessel maps, vessel positions, vessel ETA tracking, vessel names, route lines, live cameras, collision avoidance, dispatch, berth assignment, trip planning, occupancy prediction, historical analytics, accounts, admin configuration, and control workflows.
- Reject radar styling, glowing map pins, red/green clearance language, vessel icons, dense technical charts, and command-center visual metaphors.
- Reject exposing raw API payloads, stack traces, credentials, raw provider errors, and developer diagnostics in the UI.
- Reject decision-authority copy such as `Proceed`, `Hold`, `Clear`, `Safe`, `Unsafe`, `Dispatch`, or `Control`.

## Data Strategy

- Normalize all live and fixture sources into a `HarbourSignal` envelope: `id`, `label`, `sourceName`, `sourceUrl`, `kind`, `value`, `summary`, `observedAt`, `validFrom`, `validUntil`, `fetchedAt`, `freshness`, `confidence`, `audiences`, and optional `staleReason`.
- Freshness states are `fresh`, `stale`, `unavailable`, and `fixture`; each signal keeps its own state so stale live data is never silently mixed with fresh fixtures.
- Prefer stale last-known data over blank panels when a provider previously worked; show calm stale wording such as `Last NOAA water-level update 42 minutes ago`.
- Local fixtures are first-class demo/product sources, not fake live integrations; label them as `Local fixture` or `Demo fixture`.

## Recommended Live Sources

- NOAA CO-OPS station `9447130` is the primary tide/water-level source for Seattle: use predictions and observed water level with `datum=MLLW`, `time_zone=lst_ldt`, `units=english`, `format=json`.
- NWS API near `47.602,-122.337` is the primary weather source: use `/points`, returned `forecastHourly`, and `/alerts/active?point=47.602,-122.337`; include unique User-Agent.
- WSDOT/WSF Schedule API is the ferry source when access code is available: use schedule, alerts, route disruptions, `/cacheflushdate`; do not use WSF vessel endpoints.
- Seattle Open Data/Socrata is secondary civic context only; use app token if available and keep low prominence.
- King County CSO, Ecology EIM, beach water quality, Port cruise schedule, and Waterfront Park information are not reliable live harbour-office feeds for Phase 1; use as fixture/manual context unless stable endpoints are later validated.

## Adapter and Architecture Hints

- Build local BFF/API route: `Browser UI -> GET /api/harbour-summary?audience=terminal -> HarbourSummaryService -> adapters -> cache/fixtures`.
- Implement `LocalFixtureAdapter` first so the UI always has deterministic data.
- Build order: signal types and adapter interface; cache/fixture store; LocalFixtureAdapter; NoaaTideAdapter; NwsWeatherAdapter; WsfServiceAdapter with fixture fallback; optional SocrataCivicAdapter.
- Recommended env vars: `HARBOURWATCH_USER_AGENT`, `WSDOT_API_ACCESS_CODE`, `SOCRATA_APP_TOKEN`, `HARBOURWATCH_FIXTURE_MODE`.
- Workshop must run without WSDOT and Socrata credentials; missing credentials should degrade to fixture ferry pattern and omitted civic context, not startup failure.

## UX and Copy Rules

- Tone: calm, situated, observational, high legibility; emphasis only for stale feeds, unavailable feeds, unusual wind/visibility, material ferry disruption, and relevant notices.
- Use controlled vocabulary: `Observed`, `Forecast`, `Updated`, `Next tide`, `Service pattern`, `Notice`, `Source`, `Stale`, `Fixture`, `Unavailable`, `Local notice`, `Reported`, `Scheduled`.
- Use Seattle-situated sentences: `Elliott Bay breezy`, `Pier 50 departures typical`, `Colman Dock notice`, `Waterfront visibility limited`.
- Staff and visitor views must differ by hierarchy and visibility, not just hidden fields; visitor view excludes berth capacity, non-public maintenance, staff labels, and detailed feed state.

## Success Criteria for PRD

- Terminal role answers broad normality and ferry/weather/tide/notices in ten seconds.
- Harbour-office role foregrounds tide/wind/local notices and keeps ferry context secondary.
- Visitor role is public-safe, mild, and free of internal or diagnostic details.
- Every displayed signal shows source and freshness.
- Demo remains useful with live APIs unavailable.
- No vessel tracking/control impression appears in copy, visuals, or interactions.

## Risks to Carry Forward

- Generic dashboard drift: equal-weight cards with no synthesis would undermine the product.
- API awkwardness: provider quirks should be absorbed by adapters and normalized summaries.
- Hidden staleness: freshness must be visible and testable.
- Scope creep: WSF vessel endpoints and maritime maps are tempting but out of bounds.
- Workshop fragility: fixture and degraded states must be implemented early.
- Calmness failure mode: calm UI must still have enough contrast, specificity, and information density to be useful.

## Open Questions

- Which Colman Dock WSF routes are Phase 1 targets first: Bainbridge, Bremerton, or both?
- Should King County Water Taxi appear at all, or should Pier 50 remain only local context?
- Should Phase 1 register/store WSDOT access code, or use fixture-only ferry data until a later story?
- Should environmental context appear in staff mode, visitor mode, or both with different wording?
- Should fixtures be one local JSON file or separate files by source/category?

## Next BMAD Step

- Run `bmad-create-prd` using `docs/product-brief-harbourwatch-phase-1.md`, this distillate, and the three source artifacts.
- Follow with `bmad-create-ux-design` because the product value depends on visual hierarchy, tone, role-specific reading modes, and avoiding control-room cues.
