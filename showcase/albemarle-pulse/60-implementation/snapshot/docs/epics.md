---
stepsCompleted:
  - step-01-validate-prerequisites.md
  - step-02-design-epics.md
  - step-03-create-stories.md
  - step-04-final-validation.md
inputDocuments:
  - /home/codexuser/bmad-6-workshop/docs/prd.md
  - /home/codexuser/bmad-6-workshop/docs/architecture.md
  - /home/codexuser/bmad-6-workshop/docs/ux-design-specification.md
  - /home/codexuser/bmad-6-workshop/docs/ux-design-directions.html
  - /home/codexuser/bmad-6-workshop/docs/ux-color-themes.html
  - /home/codexuser/bmad-6-workshop/docs/validation-report-2026-03-18.md
  - /home/codexuser/bmad-6-workshop/docs/implementation-readiness-report-2026-03-18.md
---

# bmad-6-workshop-migration - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for bmad-6-workshop-migration, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

- FR1: Visitors can view a single shared departure display centered on the Royal Institution.
- FR2: Visitors can view an overall summary of current departure conditions from the Royal Institution.
- FR3: Visitors can understand the overall departure state through one of four display states: calm, watchful, strained, or disrupted.
- FR4: Visitors can understand trend through one of three display states: improving, steady, or worsening when the overall departure state or any core mode state has changed within the last 15 minutes.
- FR5: Visitors can use the display for first-orientation without needing to begin a route-planning task.
- FR6: Visitors can compare the current state of the core MVP mode set for departure from the Royal Institution: Tube or rail, bus, roads, and any enabled micromobility feed.
- FR7: Visitors can understand nearby mobility conditions without being required to inspect full-network detail.
- FR8: Visitors can view a location-specific map anchored to the Royal Institution.
- FR9: Visitors can use the map to understand nearby relevance and local spatial context for onward options.
- FR10: Visitors can identify the Royal Institution anchor plus the nearby stations, stops, and local nodes selected for the MVP venue map.
- FR11: Visitors can interpret the departure picture as a local, from-here-now view rather than as a generic citywide transport dashboard.
- FR12: Visitors can view current weather conditions as part of the departure picture.
- FR13: Visitors can understand how weather affects the practical feel of onward travel without receiving prescriptive advice.
- FR14: Visitors can interpret departure conditions through a combined weather-and-mobility view rather than through isolated widgets.
- FR15: Visitors can tell whether each displayed signal is current, aging, stale, or unavailable before relying on it for a departure decision.
- FR16: Visitors can tell when a displayed signal is stale, delayed, or carrying reduced confidence.
- FR17: Visitors can distinguish whether each displayed mode is in a normal, caution, or disrupted state.
- FR18: Visitors can recognize serious disruption immediately when the overall departure state is disrupted or when any core mode enters a disrupted state.
- FR19: Visitors can continue to use the display when one source is degraded or unavailable.
- FR20: Visitors can understand which part of the departure picture is affected when trust is reduced in one signal or source.
- FR21: Visitors can continue reading the shared departure display as conditions change without losing section position, reading order, or hierarchy.
- FR22: Visitors can perceive that the departure picture remains current through freshness labels, trend cues, or state changes while the shared layout remains stable during live updates.
- FR23: Two or more visitors can use the display as a shared situational reference at the same time.
- FR24: Groups of 2-4 visitors can use the display to discuss and reach the same broad departure read from the same visible facts.
- FR25: Visitors unfamiliar with London transport can understand the local departure picture without prior network expertise.
- FR26: The display can support both room-scale reading and closer factual inspection as part of the same experience.
- FR27: Front-of-house staff and event hosts can use the display as a shared factual reference when helping visitors.
- FR28: Staff can answer departure-related questions by referring to the same visible information available to attendees.
- FR29: Staff can rely on the display without needing to translate it into route-planning advice.
- FR30: Venue-side operators can confirm that the display is ready for public use by checking that the main layout is visible, the overall departure state is present, and any reduced-confidence signals are labeled.
- FR31: Venue-side operators can tell whether the display is currently in a current, reduced-confidence, or unavailable public state.
- FR32: Venue-side operators can identify which displayed signal is degraded and whether the effect is local to one component or affects the overall departure picture.
- FR33: Venue-side operators can return the display to an active public state after interruption or restart.
- FR34: Venue-side operators can keep the product in service in MVP using lightweight restart, refresh, and trust-check actions available to venue staff.
- FR35: The product can provide departure support without offering end-to-end route planning.
- FR36: The product can inform users without recommending a specific mode or next action.
- FR37: The main public display can remain focused on the departure picture without requiring secondary detail views in MVP.
- FR38: The product can deliver value as a calm public instrument by preserving a single-screen read, stable hierarchy, restrained live updates, and fact-only mode comparison even when no visitor interacts with it directly.

### NonFunctional Requirements

- NFR1: From browser launch or manual refresh, the display must reach a usable public state within 10 seconds on the venue laptop under normal network conditions, as measured across 5 consecutive startup tests.
- NFR2: Core transport and weather signals must refresh at least once every 60 seconds under normal operation, as observed during a 30-minute steady-state run.
- NFR3: Once fresh source data is available, affected on-screen content must update within the next 60 seconds and without a full-screen redraw, as observed during live update testing.
- NFR4: During live updates, the atmospheric header, mode summaries, and local map must remain in the same screen order and primary positions, and any visual transition must complete within 1 second without obscuring critical information, as verified during normal and degraded-source update tests.
- NFR5: The display must remain in service for at least 8 consecutive hours of normal venue use without requiring manual restart, as verified by one continuous venue-day test.
- NFR6: Failure of one external data source must not remove unaffected modes, the overall state header, or the screen shell from public view, as verified during single-source failure testing.
- NFR7: If a source misses one planned refresh attempt, the affected signal must move to a reduced-confidence or unavailable state by the next display update, as verified during simulated missed-refresh testing.
- NFR8: Manual restart or recovery must return the display to a usable public state within 2 minutes, as measured from restart initiation to return of the public-ready display.
- NFR9: After restart, the display must return with the same section layout and without exposing debug or recovery tooling to public viewers, as verified during restart and degraded-source recovery tests.
- NFR10: The main display must be readable at a normal foyer viewing distance of 4-6 meters, as verified on the target display during venue testing.
- NFR11: Each status state must include a non-color indicator such as wording, iconography, or structural emphasis, as checked across all public state combinations.
- NFR12: Displayed text and essential status markers must meet WCAG AA contrast expectations where applicable to screen-based viewing, as checked with contrast tooling against the production palette.
- NFR13: If motion is reduced or absent, the screen must still communicate status, freshness, and degradation correctly, as verified with reduced-motion testing.
- NFR14: Any setup or recovery state used by staff must be operable using keyboard only, as verified by keyboard-only testing.
- NFR15: Labels that explain state, freshness, or disruption must use plain language that does not depend on London transport expertise, as checked in copy review against the mixed-audience personas.
- NFR16: Partial or missing external data must not blank the whole display or hide unaffected components, as verified during partial-feed and missing-feed testing.
- NFR17: When a displayed signal misses two planned refresh attempts, it must be marked as reduced-confidence or stale, as verified during simulated missed-refresh testing.
- NFR18: External failures must be indicated within one display update cycle and only on affected components unless the overall departure picture is impacted, as observed during feed-failure testing.
- NFR19: Any last-known value shown after source degradation must be labeled as reduced-confidence before it is presented on the public display, as checked in degraded-feed scenarios.
- NFR20: The display must continue to present a coherent departure picture when any single optional feed is delayed or unavailable, as verified during single-optional-feed outage testing.
- NFR21: The MVP must not collect or transmit personal data from public viewers during normal operation, as verified by deployed-feature review of the public display path.
- NFR22: The MVP must not use user accounts, personal profiles, or stored personal journey history, as verified by product-scope review of the MVP.
- NFR23: The MVP must not use cookies, identifiable client analytics, or persistent browser storage beyond temporary runtime data needed for the current public display session, as verified by browser storage review on the deployed MVP.
- NFR24: Credentials required for external services must not be visible on the public display, in public recovery states, or in publicly accessible logs, as verified during display, recovery, and log review.
- NFR25: Any externally usable credentials or tokens must be limited to the minimum scope and permissions required for MVP operation, as verified by credential configuration review.
- NFR26: Connections to external services must protect data and credential confidentiality in transit during normal operation, as verified by endpoint review confirming encrypted transport on every external request.
- NFR27: The venue deployment must not expose debug, diagnostic, or administrative surfaces during normal public use, as verified during normal public-use walkthroughs.
- NFR28: Recovery or restart procedures must return the display to public service without requiring secrets to be typed or displayed in view of visitors, as verified during restart and recovery drills in view of the public screen.

### Additional Requirements

- Epic 1 Story 1 must initialize the project from the approved empty `create-next-app` starter; this is an explicit architecture requirement.
- The MVP runtime baseline is `Next.js 16.x` on `Node.js 24.x Active LTS` with TypeScript and ESLint, using custom CSS rather than Tailwind.
- The application architecture is a modular monolith with built-in route handlers acting as a backend-for-frontend boundary and internal REST-style JSON endpoints only.
- MVP persistence is not database-backed; implementation must revolve around one canonical `DashboardSnapshot` plus in-memory caching and file-backed last-known snapshot fallback for restart resilience.
- Provider payloads and internal normalized contracts must be validated with shared `Zod 4.x` schemas before entering application core flows.
- Client-side server-state refresh should use `TanStack Query v5`, while the public product remains a server-rendered shell with selective client components for live display zones.
- Public and ops surfaces must remain separate route trees, with public users kept on one non-interactive display route and ops actions isolated to local venue-device use.
- The app must keep secrets server-side, use same-origin internal APIs, and expose no public write endpoints or public-facing auth/account model in MVP.
- Architecture requires structured logging, health/status endpoints, source-freshness telemetry, and maintenance-only refresh or recovery actions from the start.
- Deployment posture is local-first on the venue laptop, supervised by an OS-level service wrapper, with lightweight GitHub Actions validation for lint, typecheck, tests, and production build.
- Feature organization is feature-first, provider integrations are server-only, and no UI component may call external providers directly.
- The public experience must remain non-interactive; mouse and keyboard support exist only for setup, maintenance, and recovery.
- UX must support two reading distances: room-scale orientation in 2-3 seconds and close-up confirmation in 5-10 seconds.
- The chosen visual base is `Direction 01: Atmospheric Band`, refined with the civic readability of Direction 02, the locality framing of Direction 03, and only a light touch of Direction 05.
- The design must explicitly avoid Direction 04 report-like density, Direction 06 experimental ambient-field behavior, and any dashboard, kiosk, or route-planner feel.
- The visual system should use light architectural neutrals, restrained charcoal structure, muted green/amber/red status grammar, very large display typography, and generous whitespace as non-negotiable foundations.
- Core bespoke public-display components called out by UX are the Atmospheric Header, Mode Summary Block, Fixed Local Map Frame, Freshness or Trust Cue, Degraded-Source Confirmation, and Section Framing or Layout Shell.
- The main layout strategy is display-first: primary target at `1366px+` fixed landscape, compact-height fallback when height is constrained, usable desktop adaptation around `1024px+`, and no supported public MVP layout below `1024px`.
- Status must never rely on color alone; wording, iconography, or structural emphasis must carry meaning across calm, strained, disrupted, and degraded-confidence states.
- Motion must remain restrained and meaning-preserving; no critical information may depend on animation, and reduced-motion behavior must remain fully understandable.
- UX verification explicitly requires real-device testing on the laptop and target display, desktop browser checks in Chrome, Safari, and Edge where practical, contrast and color-blindness validation, reduced-motion validation, and keyboard-only testing for staff-only setup and recovery states.
- Public refresh behavior must preserve stable layout and reading order, with no full-screen redraw, no full-screen loading spinner during background polling, and calm degraded-state fallbacks.
- Architecture structure currently implies `Vitest` for unit or integration coverage and `Playwright` for end-to-end and recovery-flow validation, which affects story-level verification planning.
- The validation and readiness reports add an explicit planning requirement to represent greenfield CI/build validation and environment hardening early, rather than leaving them implicit.
- The same reports also require explicit story coverage for UX verification obligations, including compact-height handling and the `1024px+` secondary desktop adaptation, rather than treating them as implied implementation details.
- The product doctrine must remain explicit throughout epic and story design: calm, shared, venue-native, fact-only, ambient before interactive, location-specific, and not a route planner.
- The epic structure should stay simple and user-value centered, with a three-epic shape unless a later change is explicitly approved.
- Early implementation planning must include a visible story for CI/build quality gates rather than leaving greenfield environment hardening implicit.
- The most technical implementation work should be framed around visible user outcomes rather than standalone plumbing stories.
- Negative-path acceptance criteria must be represented directly for provider failure, fallback-map behavior, and denied or non-local ops access.

### FR Coverage Map

FR1: Epic 1 - Single shared departure display
FR2: Epic 1 - Overall departure summary
FR3: Epic 1 - Four-state overall condition read
FR4: Epic 2 - Visible trend handling
FR5: Epic 1 - First-orientation without route-planning
FR6: Epic 1 - Core mode comparison
FR7: Epic 1 - Nearby mobility understanding without network sprawl
FR8: Epic 1 - Royal Institution-anchored local map
FR9: Epic 1 - Local spatial context for onward options
FR10: Epic 1 - Nearby nodes and venue anchor visibility
FR11: Epic 1 - Local, from-here-now framing
FR12: Epic 1 - Weather in the departure picture
FR13: Epic 1 - Weather impact without prescriptive advice
FR14: Epic 1 - Combined weather-and-mobility reading
FR15: Epic 2 - Freshness visibility per signal
FR16: Epic 2 - Reduced-confidence and stale-state visibility
FR17: Epic 1 - Normal/caution/disrupted mode states
FR18: Epic 2 - Immediate serious disruption recognition
FR19: Epic 2 - Continued usefulness during degraded sources
FR20: Epic 2 - Localized degraded-impact understanding
FR21: Epic 2 - Stable live reading during updates
FR22: Epic 2 - Perception of currentness without layout churn
FR23: Epic 1 - Shared situational use by multiple visitors
FR24: Epic 1 - Group discussion from shared visible facts
FR25: Epic 1 - Accessibility for visitors unfamiliar with London transport
FR26: Epic 1 - Room-scale and close-read support in one experience
FR27: Epic 1 - Staff use as a shared factual reference
FR28: Epic 1 - Staff answering from the same visible information
FR29: Epic 1 - Staff support without planner translation
FR30: Epic 3 - Public-readiness confirmation for operators
FR31: Epic 3 - Current/reduced-confidence/unavailable ops state
FR32: Epic 3 - Degraded-signal impact diagnostics
FR33: Epic 3 - Restart recovery back to public service
FR34: Epic 3 - Lightweight staff refresh/recovery actions
FR35: Epic 1 - Departure support without route planning
FR36: Epic 1 - Fact-only information without recommendations
FR37: Epic 1 - Single-screen focus without secondary detail views
FR38: Epic 1 - Calm public instrument behavior without direct interaction

## Epic List

### Epic 1: Shared Departure Picture
Visitors and staff can use one calm, shared, venue-native public display to understand the current departure picture from the Royal Institution through overall state, mode comparison, weather context, and a fixed local map without route-planning behavior.
**FRs covered:** FR1, FR2, FR3, FR5, FR6, FR7, FR8, FR9, FR10, FR11, FR12, FR13, FR14, FR17, FR23, FR24, FR25, FR26, FR27, FR28, FR29, FR35, FR36, FR37, FR38

### Epic 2: Trustworthy Live Conditions
Visitors can trust the display as conditions change because freshness, trend, disruption, degraded-source handling, and stable live behavior are visible through user-facing outcomes rather than background plumbing.
**FRs covered:** FR4, FR15, FR16, FR18, FR19, FR20, FR21, FR22

### Epic 3: Venue Operations and Public Reliability
Venue-side operators can confirm readiness, understand degraded impact, and return the display to public service quickly without exposing internals to visitors.
**FRs covered:** FR30, FR31, FR32, FR33, FR34

## Epic 1: Shared Departure Picture

Visitors and staff can use one calm, shared, venue-native public display to understand the current departure picture from the Royal Institution through overall state, mode comparison, weather context, and a fixed local map without route-planning behavior.

### Story 1.1: Set Up Initial Project from Approved Starter Template

As a venue operator,
I want the public display application initialized from the approved starter with the right baseline structure,
So that the MVP starts from a reliable, architecture-aligned foundation for the foyer display.

**FRs implemented:** `FR35`, `FR37`, `FR38`

**Acceptance Criteria:**

**Given** the project has not yet been initialized
**When** the approved starter command is run and the baseline project is created
**Then** the app uses the approved Next.js, TypeScript, and ESLint foundation
**And** the project structure separates the future public and ops surfaces in line with the architecture.

**Given** the baseline project is created
**When** a developer starts the app locally
**Then** a single public display route can render a minimal placeholder shell
**And** the app does not expose planner-style flows, public admin surfaces, or generic starter content.

**Given** the baseline project is reviewed
**When** the public route is assessed against product doctrine
**Then** the implementation posture remains calm, shared, venue-native, fact-only, ambient before interactive, location-specific, and not a route planner
**And** no public interaction pattern requires visitors to click, scroll, search, or enter a destination.

### Story 1.2: Establish Baseline Quality Gates and Build Readiness

As a venue operator,
I want the display project to prove it can build and pass baseline checks from the start,
So that the product can be developed with confidence and remain operationally trustworthy.

**FRs implemented:** `FR37`, `FR38`

**Acceptance Criteria:**

**Given** the initialized project exists
**When** the baseline quality-gate workflow is added
**Then** lint, typecheck, test, and production build validation are represented explicitly in the project
**And** the build path is suitable for the local-first venue deployment model.

**Given** a change is made to the codebase
**When** the baseline validation workflow is run
**Then** failures in code quality or buildability are surfaced before venue deployment
**And** the project does not depend on manual ad hoc checks as its only quality control.

**Given** the project is prepared for MVP implementation
**When** the quality baseline is reviewed
**Then** it is clear how the public display will be verified before being promoted to the venue laptop
**And** the story remains framed as protecting public reliability rather than as standalone infrastructure work.

### Story 1.3: Render the Overall Departure Picture

As a Royal Institution visitor,
I want to understand the overall departure state and weather-influenced mood at a glance,
So that I can orient myself in seconds without opening other apps.

**FRs implemented:** `FR1`, `FR2`, `FR3`, `FR12`, `FR13`, `FR14`, `FR26`, `FR38`

**Acceptance Criteria:**

**Given** the public display is available with current source data
**When** a visitor looks at the screen from across the foyer
**Then** the overall departure state is legible as calm, watchful, strained, or disrupted
**And** the atmospheric header gives a weather-aware first read without route advice.

**Given** a visitor moves closer to the display
**When** they inspect the overall departure picture
**Then** the weather and mobility reading reinforce one coherent local story
**And** the screen remains fact-only rather than recommending a mode or next action.

**Given** the public display is reviewed against the product doctrine
**When** the main public shell is read
**Then** it feels calm, shared, venue-native, and location-specific
**And** it does not read like a route planner, kiosk, or operational dashboard.

### Story 1.4: Show Nearby Mode Summaries for Shared Reading

As a visitor or host,
I want to compare the nearby departure modes in plain language,
So that I can infer what still looks viable from one shared screen.

**FRs implemented:** `FR5`, `FR6`, `FR7`, `FR11`, `FR17`, `FR23`, `FR24`, `FR25`, `FR27`, `FR28`, `FR29`, `FR35`, `FR36`

**Acceptance Criteria:**

**Given** current mode data is available
**When** a visitor or host reads the mode summary area
**Then** the core nearby mode set is shown as a local, from-here-now comparison
**And** the summaries stay plain-language and fact-only rather than planner-like.

**Given** a small group reads the display together
**When** they compare the visible mode summaries
**Then** they can reach the same broad departure read from the same facts
**And** the screen does not require London transport fluency to understand the main picture.

**Given** one or more mode summaries are present
**When** a staff member refers to the screen while helping attendees
**Then** the same visible information supports the conversation
**And** the host does not need to translate the screen into route-planning advice.

### Story 1.5: Anchor the Display with a Fixed Local Map

As a visitor,
I want a fixed Royal Institution map anchor,
So that I can understand nearby relevance and local spatial context without using an interactive map.

**FRs implemented:** `FR8`, `FR9`, `FR10`, `FR11`

**Acceptance Criteria:**

**Given** the public display is rendering normally
**When** a visitor looks at the map area
**Then** the Royal Institution anchor and selected nearby nodes are visible
**And** the map supports locality without becoming an exploratory city map.

**Given** the map is part of the one-screen departure picture
**When** a visitor reads it with the rest of the display
**Then** it reinforces the local from-here-now understanding
**And** it does not introduce route lines, turn-by-turn behavior, or route-planning affordances.

**Given** the preferred map layer or enrichment cannot be shown
**When** the map area falls back to a simplified state
**Then** a restrained fallback-map behavior preserves the Royal Institution anchor and local context
**And** the public screen remains usable and calm rather than blank or broken.

### Story 1.6: Verify the Primary Display on Real Venue-Sized Surfaces

As a venue operator,
I want the main display verified on the real laptop and supported desktop-sized layouts,
So that the public screen remains readable, calm, and usable in the actual venue context.

**FRs implemented:** `FR1`, `FR23`, `FR24`, `FR25`, `FR26`, `FR38`

**Acceptance Criteria:**

**Given** the primary public display is implemented
**When** it is checked on the target laptop and display surface
**Then** the main layout remains readable and coherent at the primary `1366px+` landscape target
**And** the room-scale and close-read hierarchy both remain intact.

**Given** height is constrained on the laptop or similar display surface
**When** the compact-height presentation is used
**Then** the atmospheric header, mode summaries, and map still preserve reading order and calm hierarchy
**And** no critical information is pushed into an unusable or hidden state.

**Given** the display is viewed on a secondary desktop-sized layout around `1024px+`
**When** the public route adapts to that width
**Then** the core departure picture remains usable and location-specific
**And** the design does not collapse into a mobile, touch-first, or route-planner pattern.

**Given** the implemented display is reviewed for UX verification obligations
**When** validation is run
**Then** real-device display checks, contrast validation, and shared-readability expectations are represented directly in the work
**And** verification is not left implicit for a later phase.

## Epic 2: Trustworthy Live Conditions

Visitors can trust the display as conditions change because freshness, trend, disruption, degraded-source handling, and stable live behavior are visible through user-facing outcomes rather than background plumbing.

### Story 2.1: Keep the Departure Picture Current During Normal Operation

As a visitor,
I want the public departure picture to stay current during normal operation,
So that I can trust the screen without wondering whether it has fallen behind.

**FRs implemented:** `FR22`

**Acceptance Criteria:**

**Given** the display is running under normal conditions
**When** source data refreshes successfully in the background
**Then** the public departure picture reflects current conditions within the expected update cycle
**And** the screen continues to feel like one live shared display rather than a manually refreshed page.

**Given** the display is being observed during live operation
**When** fresh data arrives
**Then** visitors can perceive that the picture remains current through visible state, freshness, or trend cues
**And** no full-screen redraw or disruptive reset of the public surface occurs.

**Given** the live display is reviewed as a public product experience
**When** update behavior is assessed
**Then** the currentness of the screen is visible through calm public outcomes
**And** the story remains framed around visitor trust rather than internal publication mechanics.

### Story 2.2: Show Trend and Freshness Where Confidence Matters

As a visitor,
I want to see whether conditions are changing and how current each signal is,
So that I can judge the departure picture with the right level of confidence.

**FRs implemented:** `FR4`, `FR15`, `FR16`

**Acceptance Criteria:**

**Given** conditions have changed within the configured trend window
**When** a visitor reads the display
**Then** the trend is shown as improving, steady, or worsening where it materially affects interpretation
**And** the screen stays calm and legible rather than becoming an alert feed.

**Given** multiple signals are visible on the display
**When** a visitor inspects the trust and freshness cues
**Then** each relevant signal can be understood as current, aging, stale, delayed, or reduced-confidence before it is relied on
**And** the wording remains plain-language and non-technical.

**Given** one signal is older or less trustworthy than the rest
**When** a visitor reads the affected area
**Then** confidence narrows locally rather than undermining the entire screen
**And** unaffected parts of the departure picture still read as trustworthy.

### Story 2.3: Surface Serious Disruption Without Breaking Composure

As a visitor,
I want serious disruption to be unmistakable,
So that I can recognize worsening conditions immediately without the display becoming chaotic.

**FRs implemented:** `FR18`

**Acceptance Criteria:**

**Given** the overall departure state is disrupted or a core mode enters a disrupted state
**When** a visitor sees the display from across the foyer
**Then** the seriousness of the disruption is immediately legible
**And** the visual language remains composed rather than alarmist.

**Given** a visitor moves closer to inspect the disruption
**When** they read the affected portions of the display
**Then** they can understand which area is under strain
**And** the rest of the departure picture remains readable.

**Given** disruption visibility is reviewed against product doctrine
**When** the UI is assessed
**Then** it remains fact-only, venue-native, and ambient before interactive
**And** it does not drift into operational-board or control-room behavior.

### Story 2.4: Preserve Honest Usefulness During Provider Failure

As a visitor,
I want the display to remain useful when one source fails or degrades,
So that I can still rely on the parts of the departure picture that remain trustworthy.

**FRs implemented:** `FR19`, `FR20`

**Acceptance Criteria:**

**Given** one provider or signal becomes degraded, delayed, or unavailable
**When** the display updates
**Then** the affected area is identified clearly as reduced-confidence or unavailable
**And** unaffected parts of the departure picture remain visible and usable.

**Given** provider failure affects only one component or mode
**When** a visitor reads the display
**Then** they can tell which part of the picture is affected
**And** the display does not blank the whole screen or imply that all data is untrustworthy.

**Given** a provider failure triggers fallback behavior
**When** the public screen renders the degraded state
**Then** the screen stays calm, honest, and location-specific
**And** the negative path is handled as a visible trust condition rather than as a raw technical error.

### Story 2.5: Maintain Stable Live Reading During Updates and Motion Changes

As a visitor,
I want live updates to preserve the same reading order and meaning,
So that I can continue reading the display comfortably even as conditions change.

**FRs implemented:** `FR21`, `FR22`

**Acceptance Criteria:**

**Given** the display is already visible to visitors
**When** background updates occur
**Then** the section order, reading hierarchy, and main layout remain stable
**And** visitors do not lose their place while reading.

**Given** the screen is operating in a reduced-motion or low-motion context
**When** live updates, trend changes, or degraded states occur
**Then** the meaning of those changes remains fully understandable
**And** no critical interpretation depends on animation.

**Given** live-update behavior is verified directly
**When** the implemented display is checked on the target device and supported browser contexts
**Then** calm live updates, reduced-motion-safe meaning, and stable trust signaling are tested explicitly
**And** UX verification is represented directly rather than assumed.

## Epic 3: Venue Operations and Public Reliability

Venue-side operators can confirm readiness, understand degraded impact, and return the display to public service quickly without exposing internals to visitors.

### Story 3.1: Provide a Separate Local-Only Ops Access Surface

As a venue operator,
I want a separate local ops surface for maintenance and recovery,
So that I can manage the display without exposing operational controls to visitors.

**FRs implemented:** `FR34`

**Acceptance Criteria:**

**Given** the app is running on the venue device
**When** a venue operator opens the ops surface
**Then** it is clearly separate from the public display route
**And** no ops controls appear on the public-facing screen.

**Given** the ops surface is available
**When** a venue operator navigates it with keyboard only
**Then** the controls are usable in a keyboard-safe order
**And** the labels remain plain and operationally clear.

**Given** an access attempt is made from a denied or non-local context
**When** the ops surface is requested
**Then** maintenance functionality is not exposed
**And** the public display remains unchanged and free of debug or admin leakage.

### Story 3.2: Show Public Readiness and Current Ops State

As a venue operator,
I want to see whether the display is current, reduced-confidence, or unavailable,
So that I can decide quickly whether it is fit for public use.

**FRs implemented:** `FR30`, `FR31`

**Acceptance Criteria:**

**Given** the display and ops surface are running
**When** a venue operator checks the ops status view
**Then** the current public state is shown as current, reduced-confidence, or unavailable
**And** the status reflects the same readiness model used by the public display.

**Given** the public display is fit for service
**When** the operator confirms readiness
**Then** they can see that the main layout, overall departure state, and trust labeling are present
**And** the view does not require raw logs or implementation details to understand readiness.

**Given** the public state is not fully current
**When** the operator checks readiness
**Then** the issue is described in plain operational language
**And** the screen does not expose secrets, stack traces, or raw provider payloads.

### Story 3.3: Diagnose Degraded Impact by Signal and Scope

As a venue operator,
I want to understand which signal is degraded and how far the impact spreads,
So that I can judge whether the display can remain in service.

**FRs implemented:** `FR32`

**Acceptance Criteria:**

**Given** one or more displayed signals are degraded
**When** a venue operator checks the ops diagnostics
**Then** the affected signal or source is identified clearly
**And** the operator can tell whether the impact is local or affects the overall departure picture.

**Given** an optional feed fails while core display data remains usable
**When** the operator reviews the ops status
**Then** the screen shows that unaffected parts remain healthy
**And** the display can still be judged honestly for continued public use.

**Given** degraded-state diagnostics are displayed
**When** the operator reads them
**Then** they are expressed as operationally useful trust information
**And** they do not devolve into raw technical error output.

### Story 3.4: Trigger Lightweight Refresh and Trust-Check Actions

As a venue operator,
I want lightweight refresh and trust-check actions,
So that I can keep the display in service during normal MVP operations.

**FRs implemented:** `FR34`

**Acceptance Criteria:**

**Given** the ops surface is available
**When** the operator triggers a refresh or trust-check action
**Then** the action runs through the maintenance-only path
**And** the public display remains isolated from direct operational control.

**Given** a refresh or trust-check succeeds
**When** the operator reviews the updated ops state
**Then** the latest readiness and trust status is shown clearly
**And** the action result is visible without requiring backend inspection.

**Given** a refresh or trust-check fails
**When** the operator reviews the outcome
**Then** the failure is reported in calm plain language
**And** the public display continues showing the last safe usable state if available.

### Story 3.5: Recover the Display After Interruption or Restart

As a venue operator,
I want the display to recover quickly after interruption or restart,
So that I can return it to public service without exposing recovery internals.

**FRs implemented:** `FR33`, `FR34`

**Acceptance Criteria:**

**Given** the app process is interrupted or restarted
**When** recovery begins
**Then** the system returns to a usable public state within the MVP recovery target
**And** the public display does not expose debug or recovery tooling while doing so.

**Given** the display restarts before all fresh source data is available
**When** the public route renders again
**Then** the same section layout is preserved
**And** any last-known values shown are clearly marked reduced-confidence until freshness is restored.

**Given** a venue operator checks the system after restart
**When** the ops surface is used to confirm recovery
**Then** they can determine whether public service has resumed successfully
**And** the workflow stays lightweight, local-only, and keyboard-safe.
