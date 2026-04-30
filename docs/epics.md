---
stepsCompleted: [1, 2, 3, 4]
workflowType: epics-and-stories
lastStep: 4
status: complete
completedAt: 2026-04-30
inputDocuments:
  - docs/prd.md
  - docs/product-brief-harbourwatch-phase-1.md
  - docs/product-brief-harbourwatch-phase-1-distillate.md
  - docs/research/domain-harbourwatch-phase-1-data-sources-research-2026-04-28.md
  - docs/research/technical-harbourwatch-phase-1-api-integration-notes-2026-04-28.md
  - docs/ux-design-specification.md
  - docs/ux-design-directions.html
  - docs/ux-color-themes.html
  - docs/architecture.md
---

# HarbourWatch - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for HarbourWatch, decomposing the requirements from the PRD, UX Design, and Architecture into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: Users can switch between `terminal`, `harbour-office`, and `visitor` role views.
FR2: The terminal view can prioritize ferry service pattern, tide/weather variance, and passenger-facing notices.
FR3: The harbour-office view can prioritize tide window, wind, visibility/weather, and local dock/service notices.
FR4: The visitor view can show a reduced public-safe waterfront summary and public notices only.
FR5: The system can filter notices and signals by audience before display.
FR6: The visitor view excludes berth capacity, internal maintenance details, staff-only labels, raw feed state, and diagnostics.
FR7: Users can read a calm condition strip summarizing waterfront status, ferry pattern, tide direction, wind/weather, visibility state, and notices.
FR8: Users can read a harbour day summary that synthesizes the current Seattle waterfront condition in plain language.
FR9: Users can see tide direction and next high/low tide for Seattle station `9447130`.
FR10: Users can see observed water-level context when NOAA observed data is available.
FR11: Users can see weather forecast phrases for wind, rain, temperature, and visibility when available.
FR12: Users can see active weather or marine alert summaries for the waterfront point.
FR13: Users can see ferry service pattern and route notice context without seeing vessel tracking or trip-planning UI.
FR14: Users can see Seattle waterfront anchors such as Elliott Bay, Colman Dock, Pier 50, and ferry route context.
FR15: Users can see source and freshness metadata for every displayed signal.
FR16: The system can represent each signal as `fresh`, `stale`, `unavailable`, or `fixture`.
FR17: Users can distinguish predicted, observed, forecast, notice, and fixture-backed signals.
FR18: The system can show last-known stale values when a previously working live source becomes stale.
FR19: The system can show calm unavailable wording when a source has no usable value.
FR20: The system can label fixtures as Local fixture or Demo fixture with visible validity.
FR21: The system can avoid silently mixing stale live data with fresh fixture data in a single unlabeled state.
FR22: The system can retrieve NOAA CO-OPS tide predictions for station `9447130`.
FR23: The system can retrieve NOAA CO-OPS observed water level for station `9447130`.
FR24: The system can retrieve NWS point metadata, hourly forecast, and active alerts for `47.602,-122.337`.
FR25: The system can retrieve WSDOT/WSF schedule, route alert, and disruption context when `WSDOT_API_ACCESS_CODE` is present.
FR26: The system can use fixture-backed ferry service patterns when WSDOT credentials or requests are unavailable.
FR27: The system can optionally retrieve one Seattle Open Data/Socrata civic context feed when configured.
FR28: The system can omit optional civic context without degrading the core display.
FR29: The system can normalize every live and fixture source into a common harbour signal envelope.
FR30: The system can load repository-visible fixture files for local notices, ferry fallback, civic context, environmental context, and workshop states.
FR31: Fixture notices can define `validFrom`, `validUntil`, `audiences`, `severity`, `sourceLabel`, and `isPublic`.
FR32: Harbour-office users can see staff/local notices such as guest dock capacity, fuel dock hours, pier gate maintenance, low-clearance reminders, and staff-only berth notes.
FR33: Visitors can see only experience-affecting public notices such as restroom/service closures, kayak rental pauses, waterfront access changes, or ferry delay pattern.
FR34: The system can suppress expired fixtures or mark them stale according to fixture validity rules.
FR35: Users can manually refresh the displayed harbour summary.
FR36: The system can generate a new aggregate harbour summary for the selected role.
FR37: The system can preserve the display layout when one panel is stale, unavailable, or fixture-backed.
FR38: The system can render a complete display in fixture-only mode.
FR39: The system excludes AIS, vessel positions, vessel ETA tracking, vessel names, route lines, vessel maps, and live camera feeds.
FR40: The system excludes dispatch, berth assignment, control workflows, clearance actions, route planning, trip planning, auth/admin, and historical analytics.
FR41: The UI copy excludes directive or authority-implying terms such as Proceed, Hold, Clear, Safe, Unsafe, Dispatch, and Control.
FR42: The UI excludes radar styling, glowing map pins, vessel icons, red/green clearance status, and dense technical charting.
FR43: The system excludes raw provider payloads, credentials, stack traces, HTTP diagnostics, and raw provider errors from user-facing display.

### NonFunctional Requirements

NFR1: The local app shall render a fixture-backed complete display for the selected role within 2 seconds on a typical development laptop.
NFR2: The aggregate harbour summary endpoint shall return cached or fixture-backed data within 1 second for 95 percent of local requests.
NFR3: Manual refresh shall preserve visible stale or fixture content while live source refresh is pending.
NFR4: The app shall start and render all three role views without `WSDOT_API_ACCESS_CODE` or `SOCRATA_APP_TOKEN`.
NFR5: The app shall render a useful display when any single live provider is unavailable.
NFR6: The app shall render fixture-only mode without network access.
NFR7: Provider failures shall resolve to stale or unavailable product states, not blank screens or uncaught errors.
NFR8: Last-known live values shall remain labeled stale once their freshness threshold is exceeded.
NFR9: NOAA observed water level shall be fresh at 20 minutes or less, stale after 20 minutes, and unavailable after 60 minutes without usable value.
NFR10: NWS hourly forecast shall be fresh at 2 hours or less, stale after 2 hours, and unavailable after 6 hours without usable periods.
NFR11: NWS alerts shall be fresh at 10 minutes or less, stale after 10 minutes, and unavailable after 30 minutes or repeated failure.
NFR12: WSF alerts/disruptions shall be fresh at 10 minutes or less, stale after 10 minutes, and unavailable after 30 minutes or access/API failure.
NFR13: Seattle civic context shall be dataset-specific, low-prominence, and unavailable rather than misleading when token, query, or relevance filtering fails.
NFR14: WSDOT and Socrata credentials shall not be exposed to browser code or user-facing display.
NFR15: Provider errors, stack traces, access codes, raw JSON payloads, and HTTP diagnostics shall not appear in the UI.
NFR16: Phase 1 shall not require accounts, authentication, admin roles, or user profile data.
NFR17: The display shall maintain readable contrast for normal, stale, unavailable, and fixture states.
NFR18: The role views shall be usable without color alone conveying source or severity state.
NFR19: Display language shall remain plain, mild, and observational for visitor-facing content.
NFR20: Seattle locality shall appear in information hierarchy and sentence structure, not only in page title or navigation.
NFR21: UI components shall consume normalized harbour signals rather than provider-shaped payloads.
NFR22: Each adapter shall be testable with mocked provider payloads and fixture fallback cases.
NFR23: Fixture data shall be version-controlled and reviewable as product content.
NFR24: Source thresholds, audience rules, and fixture validity behavior shall be documented for downstream architecture and implementation.

### Additional Requirements

- Use the verified starter stack from architecture:
  - UI: `Vite 8.0.10 / create-vite 9.0.6`
  - Adapter: `Hono 4.12.15 / create-hono 0.19.4`
- No database in Phase 1.
- No authentication or authorization in Phase 1.
- Local-only runtime with no deployment target in Phase 1.
- Simple REST JSON endpoints from the Hono adapter.
- Main endpoint: `GET /api/harbour-summary?audience=terminal|harbour-office|visitor`.
- Supporting endpoints: `GET /api/health` and optional `POST /api/refresh`.
- Shared normalized harbour summary envelope with per-source metadata and per-panel state.
- In-memory cache backed by local JSON cache files.
- Raw provider payloads stay server-side.
- No streaming for Phase 1.
- Shared contract between UI and adapter to prevent drift.

### UX Design Requirements

UX-DR1: Implement the Vibrant Maritime design tokens from the UX spec, including the board-first palette, small-radius geometry, and 8px spacing rhythm.
UX-DR2: Build the compact app shell with HarbourWatch identity, role switcher, and refresh control.
UX-DR3: Implement the condition strip as the first content row.
UX-DR4: Implement the harbour day summary directly under the condition strip.
UX-DR5: Implement the role-prioritized panel grid for tide, weather, ferry service pattern, notices, and source context.
UX-DR6: Implement panel-attached source/freshness lines and state labels.
UX-DR7: Preserve the same core modules across Terminal, Harbour Office, and Visitor views while changing hierarchy, ordering, and disclosure.
UX-DR8: Keep the board stable during refresh and show pending state quietly.
UX-DR9: Preserve visible degraded-state layouts for stale, unavailable, and fixture-backed content.
UX-DR10: Keep visitor mode public-safe and reduced, without staff-only or diagnostic detail.
UX-DR11: Maintain strong contrast for all role labels, panel text, source lines, and degraded states.
UX-DR12: Do not rely on color alone to communicate fresh, stale, unavailable, fixture-backed, or selected role states.
UX-DR13: Keep interactive targets large enough for desktop, laptop, and occasional touch use.
UX-DR14: Avoid map-first or vessel-tracking visuals, including radar styling, glowing pins, or vessel icons.
UX-DR15: Avoid control-room semantics in copy, labels, and button wording.
UX-DR16: Support responsive layouts for desktop, laptop, tablet, and visitor-display widths.
UX-DR17: Keep sentence-first, glanceable typography that supports a ten-second waterfront read.
UX-DR18: Ensure the same board model supports role switching without deep navigation.

### FR Coverage Map

FR1: Epic 1 - Role switching and role-aware board hierarchy
FR2: Epic 1 - Terminal-prioritized ferry and waterfront variance
FR3: Epic 1 - Harbour-office-prioritized tide, wind, visibility, and local notices
FR4: Epic 1 - Visitor-safe reduced waterfront summary
FR5: Epic 1 - Audience-based filtering before display
FR6: Epic 1 - Visitor exclusion of staff-only and diagnostic detail
FR7: Epic 1 - Calm condition strip
FR8: Epic 1 - Plain-language harbour day summary
FR9: Epic 2 - Tide direction and next high/low tide data
FR10: Epic 2 - NOAA observed water-level context
FR11: Epic 2 - Weather forecast phrases for wind, rain, temperature, and visibility
FR12: Epic 2 - Weather or marine alert summaries
FR13: Epic 1 - Ferry service pattern without vessel tracking or trip-planning UI
FR14: Epic 1 - Seattle waterfront anchors and route context in the board
FR15: Epic 1 - Source and freshness metadata for every signal
FR16: Epic 2 - Fresh, stale, unavailable, and fixture signal states
FR17: Epic 2 - Predicted, observed, forecast, notice, and fixture signal distinction
FR18: Epic 2 - Last-known stale values after freshness degradation
FR19: Epic 2 - Calm unavailable wording
FR20: Epic 2 - Local fixture and Demo fixture labels with visible validity
FR21: Epic 2 - No silent mixing of stale live and fresh fixture data
FR22: Epic 2 - NOAA tide predictions for station 9447130
FR23: Epic 2 - NOAA observed water level for station 9447130
FR24: Epic 2 - NWS point metadata, hourly forecast, and active alerts
FR25: Epic 2 - WSDOT/WSF schedule and route alert retrieval when credentials exist
FR26: Epic 2 - Fixture-backed ferry fallback when WSDOT is unavailable
FR27: Epic 2 - Optional Seattle Open Data/Socrata civic context
FR28: Epic 2 - Optional civic context omission without core display degradation
FR29: Epic 2 - Normalize live and fixture sources into a common harbour signal envelope
FR30: Epic 2 - Load repository-visible fixture files for local notices and workshop states
FR31: Epic 2 - Fixture validity metadata and visibility rules
FR32: Epic 1 - Staff/local notices for harbour-office users
FR33: Epic 1 - Public notices only for visitor users
FR34: Epic 2 - Expire or stale fixture notices by validity rules
FR35: Epic 2 - Manual refresh of the harbour summary
FR36: Epic 2 - Generate a new aggregate summary for the selected role
FR37: Epic 2 - Preserve layout when panels are stale, unavailable, or fixture-backed
FR38: Epic 2 - Render a complete display in fixture-only mode
FR39: Epic 1 - Exclude AIS, vessel positions, ETA tracking, vessel names, route lines, vessel maps, and live cameras
FR40: Epic 1 - Exclude dispatch, berth assignment, control workflows, trip planning, auth/admin, and analytics
FR41: Epic 1 - Exclude directive or authority-implying UI copy
FR42: Epic 1 - Exclude radar styling, glowing pins, vessel icons, clearance status, and dense charting
FR43: Epic 1 - Exclude raw provider payloads, credentials, stack traces, diagnostics, and raw provider errors from the UI

## Epic List

### Epic 1: Read the harbour board in the right role
Users can open HarbourWatch and immediately get a calm, role-appropriate, public-safe read of the Seattle waterfront day, with the condition strip, harbour day summary, audience-filtered notices, source freshness, and the UX boundaries that keep it out of vessel-tracking or control-room territory.
**FRs covered:** FR1-FR21, FR32-FR34, FR39-FR43

### Epic 2: Keep the board current and trustworthy
Users can run HarbourWatch locally from fixtures, add optional live NOAA/NWS/WSF/Socrata data through adapters, preserve stale and unavailable states cleanly, refresh safely, and demonstrate fixture-only mode without losing the board.
**FRs covered:** FR22-FR31, FR35-FR38

## Epic 1: Read the harbour board in the right role

Users can open HarbourWatch and immediately get a calm, role-appropriate, public-safe read of the Seattle waterfront day, with the condition strip, harbour day summary, audience-filtered notices, source freshness, and the UX boundaries that keep it out of vessel-tracking or control-room territory.

**FRs covered:** FR1-FR21, FR32-FR34, FR39-FR43

### Story 1.1: Starter scaffold and shared harbour summary contract

As a developer,
I want the project scaffolded from the approved starter stack with a normalized harbour summary contract,
So that the UI and adapter can share one stable data shape without raw provider payloads leaking across the boundary.

**Acceptance Criteria:**

**Given** the project starts with the approved Vite UI and Hono adapter starter foundation
**When** the initial workspace is created
**Then** the UI and adapter packages exist in the approved local-only structure
**And** the starter setup supports the fixture-first demo boundary

**Given** the project starts with no database and no auth
**When** the shared contract is defined
**Then** the contract includes audience, summary, per-panel state, source metadata, and freshness fields
**And** all field names use camelCase
**And** the contract supports fresh, stale, unavailable, and fixture-backed states

**Given** a provider payload arrives from NOAA, NWS, WSF, or fixtures
**When** it is normalized
**Then** the adapter emits the shared harbour summary shape
**And** raw provider payload fields do not appear in the UI contract

### Story 1.2: Board shell with role switching and summary hierarchy

As a waterfront user,
I want HarbourWatch to present a compact board with role switching, a condition strip, and a harbour day summary,
So that I can get the right waterfront read without navigating deeper.

**Acceptance Criteria:**

**Given** a user opens the app
**When** the board loads
**Then** the shell shows HarbourWatch identity, selected role, role switcher, refresh control, condition strip, harbour day summary, and prioritized panels
**And** the layout follows the board-first order from the UX spec

**Given** the selected role changes between Terminal, Harbour Office, and Visitor
**When** the user switches roles
**Then** the same board updates hierarchy, wording, and disclosure
**And** the screen does not navigate to a different page or route

### Story 1.3: Audience-filtered public-safe panel rendering

As a Terminal, Harbour Office, or Visitor user,
I want the board panels to show only the signals relevant to my audience,
So that I see the waterfront information I need without staff-only or diagnostic detail.

**Acceptance Criteria:**

**Given** the shared summary contains role-specific signals and notices
**When** the board renders for a selected audience
**Then** the terminal view prioritizes ferry pattern, tide/weather variance, and passenger-facing notices
**And** the harbour-office view prioritizes tide, wind, visibility, and local notices
**And** the visitor view shows only public-safe summary and public notices

**Given** a notice or signal is not appropriate for the selected audience
**When** the board renders
**Then** the signal is suppressed or downgraded according to audience rules
**And** berth capacity, internal maintenance, raw feed state, and diagnostics do not appear in visitor mode

### Story 1.4: Calm presentation boundaries and accessibility

As a public-facing user,
I want the board to stay readable, calm, and non-authoritative,
So that I can trust it without mistaking it for a control-room or vessel-tracking display.

**Acceptance Criteria:**

**Given** the board renders in any role
**When** the user reads labels, copy, and state indicators
**Then** the UI does not use vessel tracking, dispatch, control, or directive language
**And** the display does not use radar styling, glowing map pins, vessel icons, or dense technical charting

**Given** the board is rendered in normal, stale, unavailable, or fixture-backed states
**When** the user scans the panel set
**Then** the state remains understandable without color alone
**And** contrast remains readable across all states

## Epic 2: Keep the board current and trustworthy

Users can run HarbourWatch locally from fixtures, add optional live NOAA/NWS/WSF/Socrata data through adapters, preserve stale and unavailable states cleanly, refresh safely, and demonstrate fixture-only mode without losing the board.

**FRs covered:** FR22-FR31, FR35-FR38

### Story 2.1: Local adapter pipeline with fixture-first fallback

As a developer,
I want the Hono adapter to normalize live and fixture sources into one harbour summary envelope,
So that the app can run locally and fall back cleanly when live providers are unavailable.

**Acceptance Criteria:**

**Given** NOAA, NWS, WSF, or optional Socrata data is available
**When** the adapter fetches and normalizes it
**Then** it emits a single harbour summary envelope with per-source metadata and per-panel state
**And** the UI receives normalized data instead of raw provider payloads

**Given** a live source is unavailable or credentials are missing
**When** the adapter resolves the summary
**Then** it falls back to repository-visible fixtures or cached values
**And** the summary marks the affected state as stale, unavailable, or fixture-backed

### Story 2.2: Source freshness and degraded-state handling

As a waterfront user,
I want stale and unavailable data to be labeled clearly,
So that I can judge whether the board still reflects a trustworthy read.

**Acceptance Criteria:**

**Given** a signal has exceeded its freshness threshold
**When** the summary is generated
**Then** the signal is labeled stale
**And** the last-known value remains visible if it is still safe to show

**Given** a signal cannot be obtained at all
**When** the summary is generated
**Then** the signal is labeled unavailable
**And** the board keeps its layout and calm presentation

### Story 2.3: Manual refresh and local cache resilience

As a user,
I want to refresh the board without losing the current read,
So that the display stays calm while new data is being fetched.

**Acceptance Criteria:**

**Given** the board already has a readable summary
**When** the user triggers refresh
**Then** the current board remains visible while refresh is pending
**And** the updated summary replaces it only when the new response is ready

**Given** the app restarts
**When** the summary is requested again
**Then** the in-memory cache can be repopulated from local JSON cache files
**And** stale labeling remains explicit after restart

### Story 2.4: Demo health and fixture-only mode

As a workshop operator,
I want HarbourWatch to show demo health and work without network access,
So that I can prove the BMAD demo even when live APIs are down.

**Acceptance Criteria:**

**Given** no network access or no live credentials
**When** the app starts
**Then** it still renders a complete fixture-backed display
**And** the `/api/health` endpoint reports the demo/source state

**Given** the display is running in fixture-only mode
**When** the user opens any role view
**Then** the board remains usable and correctly labeled
**And** no raw provider errors or diagnostics appear in the UI
