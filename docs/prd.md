---
stepsCompleted:
  - step-01-init
  - step-02-discovery
  - step-02b-vision
  - step-02c-executive-summary
  - step-03-success
  - step-04-journeys
  - step-05-domain
  - step-06-innovation
  - step-07-project-type
  - step-08-scoping
  - step-09-functional
  - step-10-nonfunctional
  - step-11-polish
  - step-12-complete
inputDocuments:
  - docs/product-brief-harbourwatch-phase-1.md
  - docs/product-brief-harbourwatch-phase-1-distillate.md
  - _bmad-output/brainstorming/brainstorming-session-2026-04-28-182912.md
  - docs/research/domain-harbourwatch-phase-1-data-sources-research-2026-04-28.md
  - docs/research/technical-harbourwatch-phase-1-api-integration-notes-2026-04-28.md
documentCounts:
  briefCount: 2
  researchCount: 2
  brainstormingCount: 1
  projectDocsCount: 0
workflowType: prd
classification:
  projectType: web_app
  domain: public civic and maritime-awareness display
  complexity: medium
  projectContext: greenfield
releaseMode: single-release
---

# Product Requirements Document - HarbourWatch Phase 1

**Author:** Dicky  
**Date:** 2026-04-28

## Executive Summary

HarbourWatch Phase 1 is a local-only Seattle waterfront conditions display for ferry-terminal teams, marina and harbour-office staff, and visitors. It synthesizes tide, weather, visibility when available, ferry service pattern, local notices, and source freshness into a calm ten-second read of the harbour-side day. The display must feel like a Seattle harbour office or ferry-terminal conditions board, not a maritime control room, vessel traffic system, or emergency decision-support product.

Phase 1 proves product judgment through credible public data, transparent fixture-backed local signals, and graceful degraded states. Live sources should prioritize NOAA CO-OPS station `9447130` for Seattle tide and observed water level, the National Weather Service for weather and alerts near Colman Dock/Pier 50, and Washington State Ferries schedule and alert data when a WSDOT access code is available. Local harbour-office notices, dock notes, visitor service notices, environmental context, and workshop fallback data are fixture-backed and visibly labeled.

### What Makes This Special

HarbourWatch is differentiated by its restraint. It combines public APIs and realistic local fixtures without pretending every signal is live, hides provider awkwardness behind source-aware summaries, and treats stale or unavailable data as first-class display states. The product gives shared orientation without directing action, assigning operational meaning, tracking vessels, or implying control authority.

The core insight is that a useful harbour-side display does not need to become a command center. Terminal staff, harbour-office teams, and visitors need different reading hierarchies over the same waterfront day. HarbourWatch changes hierarchy and disclosure by role while preserving a single calm vocabulary: Observed, Forecast, Updated, Next tide, Service pattern, Notice, Source, Stale, Fixture, and Unavailable.

## Project Classification

- **Project type:** Local web app with a local backend-for-frontend/API route.
- **Domain:** Public civic and maritime-awareness display for Seattle waterfront context.
- **Complexity:** Medium. The product is not safety-critical, but it depends on external public APIs, source freshness, audience-specific disclosure, and strong scope boundaries.
- **Project context:** Greenfield Phase 1 product.
- **Primary downstream handoff:** `bmad-create-ux-design`, because value depends on visual hierarchy, tone, role-specific reading modes, and avoiding control-room cues.

## Success Criteria

### User Success

- Terminal users understand broad waterfront normality, ferry service pattern, weather/tide variance, and relevant passenger-facing notices within ten seconds.
- Harbour-office users understand tide window, wind direction/gusts, visibility or visibility unavailability, rain/temperature, and local dock/service notices within ten seconds.
- Visitors read a public-safe waterfront summary without seeing berth capacity, internal maintenance details, staff labels, raw provider state, or developer diagnostics.
- Every user can distinguish fresh, stale, unavailable, and fixture-backed information without opening a technical diagnostics view.
- Users never encounter copy or visuals that imply clearance, dispatch, vessel control, vessel tracking, safety certification, or operational authority.

### Business Success

- Phase 1 demonstrates a credible local-only BMAD workshop product that remains useful when one or more live APIs fail.
- Stakeholders can explain the product boundary in one sentence: "HarbourWatch observes and summarizes the Seattle waterfront day; it does not manage vessels or operations."
- The PRD, UX design, architecture, and stories can trace each visible capability back to role needs, source honesty, or scope protection.
- The app can be demoed without WSDOT or Socrata credentials by using fixture-backed ferry and civic context.

### Technical Success

- The app normalizes live and fixture sources into a common signal envelope before UI rendering.
- The display renders useful fresh, stale, unavailable, and fixture states for each major panel.
- Missing WSDOT or Socrata credentials do not block startup.
- Fixture data is repository-visible, deterministic, audience-filtered, validity-bounded, and explicitly labeled.
- The system never exposes raw provider errors, stack traces, credentials, HTTP diagnostics, or raw API payloads in the user-facing display.

### Measurable Outcomes

- A first-time terminal user can answer "Is the waterfront broadly normal?" from the primary display in under ten seconds.
- A first-time harbour-office user can identify the tide trend, wind condition, and top local notice in under ten seconds.
- A first-time visitor can identify the waterfront condition and any public notice in under ten seconds.
- All displayed signals include source and freshness metadata.
- API failure tests show stale or unavailable states instead of blank panels or unhandled errors.
- Fixture-only mode produces a complete demo display for all three role views.

## Product Scope

### Phase 1 Complete Feature Set

Phase 1 includes the complete local-only display experience for three role views: `terminal`, `harbour-office`, and `visitor`. The primary interactions are role switching and optional refresh. The display includes a calm condition strip, harbour day summary, tide panel, weather panel, ferry service pattern, local notices, Seattle waterfront context, and quiet source/freshness line.

Live source scope includes NOAA CO-OPS tide predictions and observed water level for station `9447130`, NWS forecast and active alerts near `47.602,-122.337`, and WSDOT/WSF schedule, route alerts, and disruptions when an access code is present. A single Seattle Open Data/Socrata civic feed may be included only as low-prominence waterfront access context after the core display is stable.

Fixture scope includes harbour-office notices, berth/dock notes, public service notices, environmental context where live feeds are not stable, ferry fallback patterns, civic fallback context, and workshop resilience states. Fixtures must have provenance, audience rules, validity windows, severity, source labels, and public/private disclosure flags.

### Explicit Non-Goals

Phase 1 excludes vessel traffic management, AIS, live vessel maps, vessel positions, vessel ETA tracking, vessel names, route lines, live cameras, collision avoidance, occupancy prediction, dispatch, berth assignment, control workflows, ferry trip planning, route planning, historical analytics, accounts, authentication, admin configuration, raw API payload views, and operational command surfaces.

Phase 1 also excludes radar styling, glowing map pins, vessel icons, red/green clearance language, dense technical charting, and decision-authority copy such as Proceed, Hold, Clear, Safe, Unsafe, Dispatch, or Control.

### Optional Phase 1 Additions

- One low-prominence Seattle civic access feed, preferably street closures or special events, if schema filtering and freshness are reliable.
- Water temperature or barometer from NOAA CO-OPS only if current station inventory and data availability support it.
- Environmental context as manual or fixture-backed notices, not live health or safety advice.

### Future Considerations Outside Phase 1

Future work may add richer civic context, additional waterfront roles, broader route coverage, manual content workflows, analytics, authentication, or administrative tools only after the Phase 1 product boundary has been validated. Vessel tracking, AIS, vessel control, collision avoidance, and operational decision support remain out of bounds unless the product is intentionally redefined.

## User Journeys

### Terminal Duty Supervisor: Ten-Second Normality Check

Maya starts a morning shift near Colman Dock and glances at HarbourWatch before passenger volume builds. The condition strip states that Elliott Bay is breezy, tide is rising, ferry service is mostly typical, and one route notice is reported. She sees source freshness on each panel and a local notice that affects passenger communication. The display does not show vessel positions, dispatch controls, or raw WSF data, so Maya uses it as shared orientation rather than operational authority.

This journey reveals requirements for role-specific terminal hierarchy, ferry service pattern summaries, weather/tide synthesis, passenger-facing notice filtering, and visible source freshness.

### Harbour-Office Staff: Shape of the Harbour Day

Jon works in a marina office and needs the practical shape of the day before fielding calls. HarbourWatch foregrounds tide window, wind direction and gusts, rain/temperature, visibility state, and local notices such as guest dock capacity, fuel dock hours, pier gate maintenance, or kayak rental pause. Ferry context remains available but secondary. A fixture notice is labeled as a local fixture with validity dates, so Jon understands it is a prepared local signal, not a live sensor reading.

This journey reveals requirements for harbour-office hierarchy, staff-only notice visibility, fixture provenance, tide/wind emphasis, and concise environmental phrasing.

### Visitor or Ferry Passenger: Public-Safe Waterfront Read

Elena arrives near Pier 50 and checks the public display. She sees plain language: "Elliott Bay breezy", "rain later", "ferry delays reported" if applicable, the next tide or tide direction, and any public notice affecting her visit. She does not see berth capacity, internal maintenance detail, staff-only wording, provider diagnostics, or stale technical state beyond simple freshness. Seattle place names help her orient herself without turning the display into a route-planning map.

This journey reveals requirements for a reduced visitor view, public-only notice filtering, mild condition language, simple freshness disclosure, and practical Seattle orientation.

### Workshop Demo Operator: Live Source Failure

During a workshop, the WSDOT access code is absent and NWS returns slowly. HarbourWatch still loads because local fixtures provide ferry service pattern and notices while stale or unavailable states explain each missing live source calmly. The display remains coherent, demonstrates the intended UX, and never exposes stack traces or credentials.

This journey reveals requirements for fixture-first startup, per-source degradation, cache-backed last-known values, missing credential handling, and user-facing unavailable states.

### Journey Requirements Summary

The journeys require three reading modes, audience-filtered notices, synthesis-first display hierarchy, visible source/freshness metadata, fixture honesty, local-only resilience, and hard exclusions against vessel tracking, control metaphors, and public leakage of internal details.

## Domain-Specific Requirements

### Public Awareness Boundary

HarbourWatch provides public and staff awareness only. It must not present itself as safety-critical, regulatory, emergency, navigational, vessel traffic, dispatch, or operational control software. Copy must remain observational and avoid decision-authority terms.

### Source Credibility And Attribution

Live signals must cite their provider in source metadata. NOAA CO-OPS is the authoritative tide and observed water-level source for Seattle station `9447130`. NWS is the primary weather and active alert source for the Colman Dock/Pier 50 point. WSDOT/WSF schedule and alert data is the ferry source when credentials are present. Civic or environmental sources must be low-prominence unless their endpoint, freshness, and relevance are validated.

### Audience Disclosure Rules

Terminal and harbour-office views may show staff-relevant operational context, but visitor view must show only public-safe notices and simple freshness. Visitor view excludes berth capacity, internal maintenance detail, staff-only labels, raw feed state, and diagnostics.

### Risk Mitigations

- Mitigate generic dashboard drift by leading with synthesis, not equal-weight cards.
- Mitigate API awkwardness by normalizing provider data into product-facing signals.
- Mitigate hidden staleness by making freshness a visible state on every signal.
- Mitigate scope creep by excluding vessel endpoints, vessel maps, command copy, route planning, auth/admin, and analytics from Phase 1.
- Mitigate workshop fragility by implementing fixtures and graceful degraded states before optional civic feeds.

## Innovation & Novel Patterns

### Detected Innovation Areas

HarbourWatch's novelty is a product pattern, not a new algorithm. It combines official public feeds and explicitly labeled local fixtures into a calm place-specific display, treats source freshness as product content, and uses role views to change hierarchy and disclosure without becoming a configuration platform.

### Market Context And Competitive Landscape

Existing public sources are credible but fragmented: NOAA for tides, NWS for weather, WSDOT/WSF for ferry data, Seattle Open Data for civic context, and manual/local sources for harbour-office notices. HarbourWatch is not competing as a weather app, ferry trip planner, marina management system, or vessel tracking product. Its competitive position is a situated shared display for current waterfront context.

### Validation Approach

Validation depends on first-ten-second comprehension, visible source honesty, and boundary discipline. Users should identify the role-specific answer quickly: terminal normality, harbour-office day shape, or visitor waterfront summary. Reviewers should also confirm that the UI never implies vessel control, safety clearance, dispatch, AIS tracking, route planning, auth/admin, or analytics.

### Risk Mitigation

If the synthesis feels too vague, add credible numbers and timestamps where they improve trust. If the display drifts toward a dashboard, re-center the condition strip and harbour day summary. If live APIs fail, fixture mode and stale/unavailable states preserve the demo. If a feature implies control-room authority, remove or reword it before design or implementation.

## Web App Specific Requirements

### Project-Type Overview

HarbourWatch is a local web app with a local backend-for-frontend/API route. The browser consumes one aggregate harbour summary for the selected audience; provider-specific integration, credentials, caching, and stale handling stay server-side or local-runtime-side.

### Browser And Display Requirements

- The app supports desktop/lobby display and laptop workshop use as primary targets.
- The app supports responsive visitor-scale viewing without changing the product into a mobile-first trip planner.
- The first screen contains the primary product value; no landing page or marketing hero is required.
- The interface works in a local development/demo environment without external deployment.

### Endpoint Requirements

- The app exposes an aggregate local endpoint equivalent to `GET /api/harbour-summary?audience={terminal|harbour-office|visitor}`.
- The aggregate response includes generation time, audience, Seattle waterfront place anchors, condition strip signals, tide/weather/ferry/notice panels, optional civic context, and a source line.
- UI code consumes normalized harbour signals rather than provider-shaped NOAA, NWS, WSF, or Socrata payloads.

### Data And Credential Requirements

- NOAA and NWS need no API key, but NWS requests require a unique `User-Agent`.
- WSDOT/WSF live ferry data requires `WSDOT_API_ACCESS_CODE` stored outside browser exposure.
- Socrata civic context may use `SOCRATA_APP_TOKEN` and must remain optional.
- Missing optional credentials degrade to fixture-backed or omitted context, not startup failure.

### Implementation Considerations

Recommended build order is: signal types and adapter contract, cache/fixture store, LocalFixtureAdapter, NoaaTideAdapter, NwsWeatherAdapter, WsfServiceAdapter with fixture fallback, optional SocrataCivicAdapter. The LocalFixtureAdapter should be implemented first so all role views can render deterministically before live integrations are complete.

## Project Scoping

### Strategy And Philosophy

HarbourWatch Phase 1 is a single release scope focused on validating the product boundary and the display experience. The release is not a phased enterprise platform. Optional civic context may be added only after the core display is stable; it must not displace tide, weather, ferry pattern, local notices, or source freshness.

### Complete Feature Set

**Core user journeys supported:** terminal normality check, harbour-office day shape, visitor public-safe waterfront read, and workshop/live-source failure recovery.

**Must-have capabilities:** three role views, condition strip, harbour day summary, tide panel, weather panel, ferry service pattern, local notices, Seattle waterfront context, source/freshness metadata, normalized signal model, local fixtures, graceful stale/unavailable states, local cache, optional credential handling, and non-goal enforcement in copy and visuals.

**Nice-to-have capabilities:** one low-prominence Seattle civic access feed, optional water temperature/barometer if credible, additional fixture scenarios, and richer environmental context if framed as manual or fixture-backed.

### Risk Mitigation Strategy

**Technical risks:** External API schemas, timestamps, rate limits, credentials, and downtime can make the UI brittle. Mitigation: normalize all sources, cache responses, implement fixture-first rendering, and test fresh/stale/unavailable states.

**Product risks:** The app can become a generic dashboard or imply maritime control. Mitigation: lead with synthesis, enforce controlled vocabulary, avoid vessel visuals, and make non-goals part of acceptance criteria.

**Resource risks:** Live WSF and Socrata setup can consume time. Mitigation: ship deterministic fixtures and core NOAA/NWS integrations first; add WSF live mode behind optional credentials; keep Socrata optional.

## Functional Requirements

### Role Views And Audience Disclosure

- FR1: Users can switch between `terminal`, `harbour-office`, and `visitor` role views.
- FR2: The terminal view can prioritize ferry service pattern, tide/weather variance, and passenger-facing notices.
- FR3: The harbour-office view can prioritize tide window, wind, visibility/weather, and local dock/service notices.
- FR4: The visitor view can show a reduced public-safe waterfront summary and public notices only.
- FR5: The system can filter notices and signals by audience before display.
- FR6: The visitor view excludes berth capacity, internal maintenance details, staff-only labels, raw feed state, and diagnostics.

### Harbour Conditions Display

- FR7: Users can read a calm condition strip summarizing waterfront status, ferry pattern, tide direction, wind/weather, visibility state, and notices.
- FR8: Users can read a harbour day summary that synthesizes the current Seattle waterfront condition in plain language.
- FR9: Users can see tide direction and next high/low tide for Seattle station `9447130`.
- FR10: Users can see observed water-level context when NOAA observed data is available.
- FR11: Users can see weather forecast phrases for wind, rain, temperature, and visibility when available.
- FR12: Users can see active weather or marine alert summaries for the waterfront point.
- FR13: Users can see ferry service pattern and route notice context without seeing vessel tracking or trip-planning UI.
- FR14: Users can see Seattle waterfront anchors such as Elliott Bay, Colman Dock, Pier 50, and ferry route context.

### Source Freshness And Data Honesty

- FR15: Users can see source and freshness metadata for every displayed signal.
- FR16: The system can represent each signal as `fresh`, `stale`, `unavailable`, or `fixture`.
- FR17: Users can distinguish predicted, observed, forecast, notice, and fixture-backed signals.
- FR18: The system can show last-known stale values when a previously working live source becomes stale.
- FR19: The system can show calm unavailable wording when a source has no usable value.
- FR20: The system can label fixtures as Local fixture or Demo fixture with visible validity.
- FR21: The system can avoid silently mixing stale live data with fresh fixture data in a single unlabeled state.

### Data Sources And Adapters

- FR22: The system can retrieve NOAA CO-OPS tide predictions for station `9447130`.
- FR23: The system can retrieve NOAA CO-OPS observed water level for station `9447130`.
- FR24: The system can retrieve NWS point metadata, hourly forecast, and active alerts for `47.602,-122.337`.
- FR25: The system can retrieve WSDOT/WSF schedule, route alert, and disruption context when `WSDOT_API_ACCESS_CODE` is present.
- FR26: The system can use fixture-backed ferry service patterns when WSDOT credentials or requests are unavailable.
- FR27: The system can optionally retrieve one Seattle Open Data/Socrata civic context feed when configured.
- FR28: The system can omit optional civic context without degrading the core display.
- FR29: The system can normalize every live and fixture source into a common harbour signal envelope.

### Local Fixtures And Notices

- FR30: The system can load repository-visible fixture files for local notices, ferry fallback, civic context, environmental context, and workshop states.
- FR31: Fixture notices can define `validFrom`, `validUntil`, `audiences`, `severity`, `sourceLabel`, and `isPublic`.
- FR32: Harbour-office users can see staff/local notices such as guest dock capacity, fuel dock hours, pier gate maintenance, low-clearance reminders, and staff-only berth notes.
- FR33: Visitors can see only experience-affecting public notices such as restroom/service closures, kayak rental pauses, waterfront access changes, or ferry delay pattern.
- FR34: The system can suppress expired fixtures or mark them stale according to fixture validity rules.

### Interaction And Refresh

- FR35: Users can manually refresh the displayed harbour summary.
- FR36: The system can generate a new aggregate harbour summary for the selected role.
- FR37: The system can preserve the display layout when one panel is stale, unavailable, or fixture-backed.
- FR38: The system can render a complete display in fixture-only mode.

### Scope Boundary Enforcement

- FR39: The system excludes AIS, vessel positions, vessel ETA tracking, vessel names, route lines, vessel maps, and live camera feeds.
- FR40: The system excludes dispatch, berth assignment, control workflows, clearance actions, route planning, trip planning, auth/admin, and historical analytics.
- FR41: The UI copy excludes directive or authority-implying terms such as Proceed, Hold, Clear, Safe, Unsafe, Dispatch, and Control.
- FR42: The UI excludes radar styling, glowing map pins, vessel icons, red/green clearance status, and dense technical charting.
- FR43: The system excludes raw provider payloads, credentials, stack traces, HTTP diagnostics, and raw provider errors from user-facing display.

## Non-Functional Requirements

### Performance

- NFR1: The local app shall render a fixture-backed complete display for the selected role within 2 seconds on a typical development laptop.
- NFR2: The aggregate harbour summary endpoint shall return cached or fixture-backed data within 1 second for 95 percent of local requests.
- NFR3: Manual refresh shall preserve visible stale or fixture content while live source refresh is pending.

### Reliability And Degradation

- NFR4: The app shall start and render all three role views without `WSDOT_API_ACCESS_CODE` or `SOCRATA_APP_TOKEN`.
- NFR5: The app shall render a useful display when any single live provider is unavailable.
- NFR6: The app shall render fixture-only mode without network access.
- NFR7: Provider failures shall resolve to stale or unavailable product states, not blank screens or uncaught errors.
- NFR8: Last-known live values shall remain labeled stale once their freshness threshold is exceeded.

### Integration And Freshness

- NFR9: NOAA observed water level shall be fresh at 20 minutes or less, stale after 20 minutes, and unavailable after 60 minutes without usable value.
- NFR10: NWS hourly forecast shall be fresh at 2 hours or less, stale after 2 hours, and unavailable after 6 hours without usable periods.
- NFR11: NWS alerts shall be fresh at 10 minutes or less, stale after 10 minutes, and unavailable after 30 minutes or repeated failure.
- NFR12: WSF alerts/disruptions shall be fresh at 10 minutes or less, stale after 10 minutes, and unavailable after 30 minutes or access/API failure.
- NFR13: Seattle civic context shall be dataset-specific, low-prominence, and unavailable rather than misleading when token, query, or relevance filtering fails.

### Security And Privacy

- NFR14: WSDOT and Socrata credentials shall not be exposed to browser code or user-facing display.
- NFR15: Provider errors, stack traces, access codes, raw JSON payloads, and HTTP diagnostics shall not appear in the UI.
- NFR16: Phase 1 shall not require accounts, authentication, admin roles, or user profile data.

### Accessibility And Legibility

- NFR17: The display shall maintain readable contrast for normal, stale, unavailable, and fixture states.
- NFR18: The role views shall be usable without color alone conveying source or severity state.
- NFR19: Display language shall remain plain, mild, and observational for visitor-facing content.
- NFR20: Seattle locality shall appear in information hierarchy and sentence structure, not only in page title or navigation.

### Maintainability

- NFR21: UI components shall consume normalized harbour signals rather than provider-shaped payloads.
- NFR22: Each adapter shall be testable with mocked provider payloads and fixture fallback cases.
- NFR23: Fixture data shall be version-controlled and reviewable as product content.
- NFR24: Source thresholds, audience rules, and fixture validity behavior shall be documented for downstream architecture and implementation.

## Traceability Summary

- Terminal normality check traces to FR1-FR5, FR7-FR14, FR15-FR21, and NFR1-NFR13.
- Harbour-office day shape traces to FR1-FR5, FR7-FR12, FR30-FR34, and NFR17-NFR24.
- Visitor public-safe read traces to FR1, FR4-FR6, FR7-FR8, FR11-FR14, FR15-FR21, FR33, and NFR17-NFR20.
- Workshop resilience traces to FR18-FR21, FR26-FR30, FR34-FR38, and NFR1-NFR8.
- Scope protection traces to FR39-FR43, NFR14-NFR16, and the explicit non-goals.

## Next Handoff

The PRD is complete and ready for `bmad-create-ux-design`. The UX handoff should focus on visual hierarchy, calm Seattle harbour-office positioning, role-specific reading modes, fixture/source labeling, stale/unavailable states, and avoiding vessel traffic management or control-room cues.
