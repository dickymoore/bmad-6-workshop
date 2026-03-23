---
stepsCompleted: ['step-01-init.md', 'step-02-discovery.md', 'step-02b-vision.md', 'step-02c-executive-summary.md', 'step-03-success.md', 'step-04-journeys.md', 'step-05-domain.md', 'step-06-innovation.md', 'step-07-project-type.md', 'step-08-scoping.md', 'step-09-functional.md', 'step-10-nonfunctional.md', 'step-11-polish.md']
inputDocuments:
  - /home/codexuser/bmad-6-workshop/docs/product-brief-bmad-6-workshop-migration-2026-03-17.md
  - /home/codexuser/bmad-6-workshop/docs/research/domain-public-apis-for-london-mobility-weather-and-civic-display-data-research-2026-03-17.md
  - /home/codexuser/bmad-6-workshop/docs/research/technical-api-integration-requirements-for-albemarle-pulse-research-2026-03-17.md
  - /home/codexuser/bmad-6-workshop/_bmad-output/brainstorming/brainstorming-session-2026-03-16.md
workflowType: 'prd'
workflow: 'edit'
date: 2026-03-18
author: Workshop
lastEdited: 2026-03-20
editHistory:
  - date: 2026-03-20
    changes: 'Tightened the public-display MVP bar around one-screen board readability, explicit public-signage status grammar, concrete nearby references, and map usefulness after stakeholder UX rejection of the live screen.'
  - date: 2026-03-18
    changes: 'Improved measurability and SMART quality across success criteria, functional requirements, and non-functional requirements; restored concise why-now rationale; tightened requirement language for laptop-run MVP use.'
  - date: 2026-03-18
    changes: 'Applied validation follow-up fixes to business success checks, operator-side functional requirements, and remaining non-functional verification wording.'
  - date: 2026-03-18
    changes: 'Reconciled web-app implementation wording with the approved architecture by removing SPA-specific language and making the server-rendered shell with selective client components the implementation source of truth.'
documentCounts:
  briefCount: 1
  researchCount: 2
  brainstormingCount: 1
  projectDocsCount: 0
  projectContextCount: 0
classification:
  projectType: web_app
  domain: general
  complexity: low
  projectContext: greenfield
---

# Product Requirements Document - bmad-6-workshop-migration

**Author:** Workshop
**Date:** 2026-03-18

## Executive Summary

Albemarle Pulse is a browser-based, Royal Institution-centered public display that gives visitors fast situational confidence at the point of departure. It is designed for people preparing to leave the building who need a quick, trustworthy understanding of what local onward travel conditions feel like right now without opening multiple apps or entering a route-planning task.

The product solves a specific coordination problem: today, visitors reconstruct the departure picture individually through fragmented private app-checking, quick observations, and guesswork. Albemarle Pulse replaces that with one calm, shared, location-specific source of truth that combines weather, nearby mobility conditions, and local relevance into a single glanceable view. Travel stress and attention drain are important consequences, but the primary problem is the absence of a shared situational view at the moment of departure.

The MVP is intentionally narrow. It provides a one-screen, always-on foyer experience centered on the Royal Institution, with an atmospheric conditions header, fact-only mode comparison, a fixed local map, honest disruption and freshness cues, and restrained live behavior. It explicitly does not become a route planner, recommendation engine, or dense operational dashboard.

The timing is practical because mature public APIs now expose the transport and weather signals this display needs, and BMAD makes it realistic for a small team to turn those signals into a disciplined venue product without expanding scope.

### What Makes This Special

Albemarle Pulse is differentiated less by transport depth than by composure, locality, and public shared use. It is designed to behave like part of the building rather than like an app placed on a monitor. Its strongest differentiator is the combination of a calm visual surface, a Royal Institution-specific point of view, and a shared foyer presence that allows individuals, groups, and staff to orient around the same facts at the same time.

The core insight is that users do not need another mobility optimization tool in this moment. They need the mental synthesis to be done for them without losing agency. Albemarle Pulse creates value by making weather, nearby mode health, trend, and local relevance readable in seconds while remaining strictly fact-only. The product succeeds when users can infer viable next options immediately without being told what to do.

## Project Classification

- **Project Type:** web_app
- **Domain:** general
- **Complexity:** low domain complexity
- **Project Context:** greenfield

This classification reflects that Albemarle Pulse is a new browser-based product in a non-regulated domain. While domain complexity is low in the BMAD taxonomy, the implementation still requires disciplined handling of real-time external data, trust signaling, and venue-specific interaction design.

## Success Criteria

### User Success

Users succeed when Albemarle Pulse works like a clear public information board rather than a verbose dashboard. For MVP validation:
- on the target venue screen, the default public view fits within one screen without scrolling at normal browser zoom
- after a 2-3 second room-scale read, users can identify the overall departure status, whether any warning is present, and which nearby option currently looks most usable
- after 5-10 seconds of closer reading, users can identify concrete nearby references such as named stations, stops, or local corridors without decoding long prose
- pairs or small groups can reach the same situational read from the shared screen without one person translating private app data
- staff can answer departure-related questions by referring to the screen rather than reconstructing the picture from separate tools

Ambient absorption remains the higher form of success: repeated users should treat the display as part of the foyer rather than as an app they must operate.

### Business Success

At 3 months, success means Albemarle Pulse is used and trusted during live departure moments at the Royal Institution. This should be verified through observed departure sessions from at least three live events and structured feedback showing that attendees notice the screen, staff use it as a shared reference, and comments consistently describe it as calm, useful, and quick to read.

At 12 months, success means the product has proven itself as a venue service rather than a novelty. This should be verified by repeat use across at least six Royal Institution events during the year, continued staff confidence in the screen as a hosting aid, and enough product confidence to treat Albemarle Pulse as a repeatable venue-centered mobility pattern beyond a single installation.

### Technical Success

Technical success means the screen stays live, trustworthy, and calm under real conditions. This should be verified by five checks:
- core transport and weather signals refresh on the normal display cadence defined in the NFRs, and any signal that misses that cadence moves to a reduced-confidence state rather than appearing current
- disruption and trend states remain legible when conditions worsen, including when one source is stale or unavailable
- the main screen remains readable from room scale and close range using the same stable layout
- a single degraded source does not remove unaffected parts of the departure picture
- the venue setup remains stable enough to behave like part of the building rather than like a fragile demo

### Measurable Outcomes

The most important outcomes remain architectural and ambient, but they should be tested through explicit checks:
- **overall-state comprehension:** in observed use, users can correctly name the displayed overall state after one far read
- **warning recognition:** in observed use, users can tell whether the board is broadly green / amber / red in public-signage terms, even when the underlying wording remains more nuanced
- **orientation time:** room-scale orientation happens within 2-3 seconds and close-up confirmation within 5-10 seconds without requiring stacked sentence reading
- **one-screen readability:** the default public view fits on the target display without scroll and preserves its primary hierarchy at normal browser zoom
- **local-reference comprehension:** unfamiliar users can name at least one nearby station, stop, or corridor shown on the board after a short close read
- **shared readability:** pairs or small groups can discuss the same departure state and viable nearby modes from a single screen
- **degraded-state comprehension:** when one source is stale or unavailable, users can identify what is degraded and what remains trustworthy
- **display adoption:** pilot observation shows regular glance behavior before exit and routine staff reference during departure moments
- **calm live behavior:** observed updates do not trigger full-screen redraws, flashing, or visible re-orientation of the layout

## Product Scope

### MVP - Minimum Viable Product

The MVP is one calm foyer display centered on the Royal Institution that works like a clear public information board rather than a prose-heavy dashboard. It must fit within one screen at the target venue viewport and prioritize labels, symbols, compact status language, and obvious public-signage red / amber / green emphasis over explanatory sentences. It includes a status-first summary, compact fact-only nearby mode rows, concrete nearby station or stop references, a recognisable local orientation map, selective freshness cues, honest disruption handling, and calm live updates. It explicitly does not include route planning, prescriptive recommendations, dense operational detail, or anything that changes the main screen's role from composed public instrument to dashboard or planner.

### Growth Features (Post-MVP)

Growth means deeper inspection without changing the main screen's role. This includes a secondary detail view, richer local context, accessibility and walkability layers, deeper map inspection, and selective secondary data layers that sit behind the foyer display rather than inside it. Post-MVP capability should increase explanatory power without making the primary surface denser or more app-like.

### Vision (Future)

The long-term vision is a repeatable venue-centered mobility product that can be adapted for other institutions, conferences, cultural venues, and public spaces while preserving the same anti-planner contract, calm architectural identity, and location-first framing. Albemarle Pulse is the first instance; the broader opportunity is a family of venue-aware mobility displays and companion views that remain local, shared, calm, and fact-only.

## User Journeys

### Journey 1: Sarah Malik - Primary Success Path

Sarah Malik is attending a lecture or half-day conference at the Royal Institution. As the event ends, she starts thinking about the rest of her London day. Normally this is the moment where she unlocks her phone, opens weather, checks Citymapper or Google Maps, skims TfL status, and tries to combine all of that into one mental model before stepping outside.

This time, Albemarle Pulse is already present in the foyer. From across the room, Sarah can read the broad departure mood from the overall composition and color balance. As she gets closer, she reads the atmospheric conditions header first, then the nearby transport picture, then the map and supporting local details.

The turning point is that the display has already done the synthesis she usually has to do herself. She can see that conditions are generally manageable, one mode is a little strained, another remains viable, and the weather is influencing comfort without requiring her to enter a route-planning task. She does not receive a recommendation, but she immediately feels clear enough to act.

She leaves with confidence rather than with cognitive residue. The product has changed the final minute before departure from fragmented checking into calm confirmation.

### Journey 2: Sarah Malik - Edge Case Under Worsening Conditions

On another evening, Sarah is leaving just as conditions begin to deteriorate. Weather is worsening, a key transport signal is strained, and one volatile source is delayed or stale. This is the hardest moment for the product because calm presentation and operational honesty are in tension.

Sarah notices that the overall departure picture feels more serious from a distance. On closer inspection, the display makes deterioration legible without becoming chaotic. The overall state is visibly worse, the trend is clear, and the affected area carries an appropriate trust or freshness cue so she can see that one piece of the picture is less certain than the rest.

The critical moment here is not reassurance, but credibility. Albemarle Pulse succeeds because it does not hide disruption, does not pretend stale data is fresh, and does not collapse when one source degrades. Instead, it preserves a useful shared picture with reduced-confidence signals clearly marked.

Sarah may still need to make a difficult departure decision, but she does so with an honest read of conditions rather than a false sense of calm. The product proves its value by staying composed without becoming misleading.

### Journey 3: Daniel Weber - Secondary Visitor / Unfamiliar with London Transport

Daniel Weber is visiting London for an event and does not know the local transport network well. When he leaves the Royal Institution, his usual pattern is to open a route planner and immediately fall into too much detail: stations he does not recognize, multiple paths, and system-wide information that does not help him understand what matters here and now.

Albemarle Pulse changes the order of understanding. From the display, Daniel first absorbs whether conditions are broadly favorable, mixed, or strained. The red/amber/green status language, the local map, and the emphasis on nearby lines and nodes help him understand the situation before he understands the full system.

His moment of relief comes when he realizes he can read the local departure picture without already being fluent in London transport. The product has taught itself through composition rather than instructions. It has reduced the need for prior knowledge and made the city feel more legible.

Daniel leaves not because the product gave him a perfect route, but because it let him understand the local reality quickly enough to proceed with confidence.

### Journey 4: Front-of-House Staff or Event Host - Shared Reference Journey

A front-of-house staff member or event host is in the foyer as attendees begin to leave. In the current state, they may be asked informal questions about rain, Tube disruption, or whether local buses seem to be moving well, but they do not have one shared, visible reference point that everyone can orient around together.

With Albemarle Pulse in place, staff and attendees can look at the same screen and speak from the same facts. The display becomes part of departure conversation: a quiet, public reference that helps staff answer questions confidently without needing to interpret several private apps or improvise from partial knowledge.

The moment of value is social as much as informational. The staff member does not become a travel advisor; instead, they become a better host because the environment itself now carries trustworthy situational awareness.

The result is a calmer departure atmosphere in the foyer. The screen supports the venue's hosting role by making the departure picture shared, visible, and easy to discuss.

### Journey 5: Venue-Side Operator / Event Technician - Support and Trust Journey

A venue-side operator, event technician, or digital signage owner is responsible for making sure the screen is fit for use in the building. They are not acting as a deep engineering maintainer; their job is operational confidence: is the display live, stable, current enough, and safe to trust in front of visitors?

They approach the system as infrastructure rather than as software. They need to see that the screen has recovered cleanly, the layout is stable, the visual hierarchy is intact, and any reduced-confidence or stale-data states are legible rather than hidden. If a source has degraded, the screen should still appear trustworthy and useful rather than broken or confusing.

The critical moment for this user is deciding whether the display can remain in service without undermining confidence. Albemarle Pulse succeeds when this operator can confirm that the screen is still behaving like part of the building: calm, current enough, honest about uncertainty, and operationally boring.

This journey reveals that support in MVP should remain lightweight and venue-facing. The product does not need a heavy admin story in its first version, but it does need observable, reliable behavior that makes venue ownership practical.

### Journey Requirements Summary

These journeys reveal the following required capability areas:

- A one-screen, always-on foyer display that is readable from both a distance and close range.
- An atmospheric top-level conditions read that communicates overall departure mood immediately.
- Fact-only mode comparison that supports self-inference rather than recommendations.
- A fixed local map that anchors nearby relevance without becoming a route-planning surface.
- Selective freshness and trust cues that appear where confidence materially depends on them.
- Honest disruption handling that makes worsening conditions clearly visible without overwhelming the whole screen.
- Graceful degradation so one failing source does not collapse the product's usefulness.
- Shared readability that supports individual, group, and staff interpretation from the same surface.
- Lightweight venue-side operational confidence: the screen must remain stable, recoverable, and visibly trustworthy enough for public use.
- No API or integration user journey in MVP scope; technical integrations remain internal product concerns rather than first-class product interactions.

## Innovation & Novel Patterns

### Detected Innovation Areas

The innovation in Albemarle Pulse is product-form innovation rather than technical invention. It challenges the assumption that departure uncertainty must be resolved through personal route-planning tools on a phone. Instead, it proposes a different model for venue departure: a shared, location-specific, fact-only display that gives people fast situational confidence from here, now.

The novelty lies in the combination of:
- a shared foyer display instead of a personal utility app
- an architectural interaction model in which the screen behaves like part of the venue
- a fact-only, anti-planner product contract that informs without prescribing
- a two-stage reading model: ambient awareness at distance, clearer factual understanding up close

Together, these create a different interaction pattern for a web-based mobility product. The innovation is not more transport data, but a new way of presenting real-time mobility conditions in a public setting.

### Market Context & Competitive Landscape

Existing tools such as route planners, weather apps, and transport-status services are designed for personal, task-driven use. They require each individual to actively search, interpret, and reconstruct the departure picture for themselves. Albemarle Pulse addresses the same underlying need from a different angle: it makes the departure picture public, shared, and anchored to the Royal Institution.

Its point of difference is therefore not data breadth or algorithmic sophistication. It is the combination of locality, composure, and shared situational value. Albemarle Pulse treats venue departure as an ambient public-information problem rather than a private route-planning problem.

### Validation Approach

The innovation is working if the display becomes the first layer of orientation before people turn to personal apps, and if it improves the shared awareness of the foyer as people prepare to leave.

Key validation signals include:
- visitors glance at the display before exit as a normal behavior
- small groups use it as a shared factual reference when deciding what to do next
- users can correctly describe the overall departure state after a brief glance
- the display remains trusted during disruption because freshness and degradation are visible
- users rely less on fragmented phone-checking in the final minute before departure
- the screen is absorbed as part of the venue environment rather than experienced as "using an app"

The core validation question is whether the product changes the departure experience by creating shared situational confidence, not simply whether the interface is attractive.

### Risk Mitigation

The main innovation risk is under-realization rather than outright failure. If the ambient, architectural quality is too subtle, Albemarle Pulse may be experienced primarily as a very good local mobility dashboard rather than as a new public-display pattern.

That fallback is still valuable. The product can still succeed as a calm, trustworthy, venue-specific mobility display with stronger locality and composure than conventional transport tools.

To protect against innovation failure, the PRD should preserve two rules:
- the product must remain useful even if users treat it as a high-quality dashboard
- the main screen must not drift into denser planner behavior in an attempt to make the product feel more powerful

## Web App Specific Requirements

### Project-Type Overview

Albemarle Pulse is a browser-based public-display web application that behaves as a live, venue-based foyer instrument rather than a conventional navigational website. Its primary operating mode is a controlled browser on a venue laptop, where the application remains open as an always-on public surface for the Royal Institution.

This is a specialized screen-based web app with ambient public-display behavior, not a general-purpose consumer website. The platform posture prioritizes composure, stability, readability, and trust under live conditions over SEO, acquisition flows, or multi-device reach.

### Technical Architecture Considerations

The implementation source of truth for MVP is the approved architecture: a server-rendered shell with selective client components supporting live display behavior on one persistent public surface. It should maintain a stable structural frame while data updates are absorbed through calm polling or refresh behavior. Real-time behavior is required, but visual churn is not: the UI must feel current without looking like it is constantly refreshing.

For MVP, browser support should target a single controlled desktop browser environment running on the venue laptop. This allows the PRD to prioritize display integrity, layout stability, and public reliability over wide early browser compatibility. Broader browser support can be considered later if the product expands beyond the foyer-display use case.

SEO is not a requirement for this product. Albemarle Pulse is not a content-discovery or acquisition surface, so technical decisions should optimize for operational display quality rather than search visibility.

### Browser Matrix

- **MVP target:** one controlled desktop browser environment on the venue laptop
- **Primary use mode:** always-on public display in a stable foyer setting
- **Future expansion:** broader desktop browser compatibility only if the product evolves beyond the controlled venue-display context

### Responsive Design

The application should be display-first rather than mobile-first. The primary layout should be optimized for a fixed public screen, with strong hierarchy, distance readability, and stable composition. If responsive behavior exists in MVP at all, it should preserve usability on nearby desktop-sized surfaces rather than attempting full multi-device optimization.

### Performance Targets

Performance posture for this project is perceptual clarity and operational stability. The display should load and recover cleanly enough to behave like part of the venue, preserve a stable frame during live updates, and remain useful when one source degrades rather than failing as a whole. The measurable performance and reliability bars are defined in the Non-Functional Requirements section.

### SEO Strategy

No SEO strategy is required for MVP. Albemarle Pulse is not intended to compete for search discovery or public web traffic. Search optimization should be treated as out of scope unless a future public-facing informational layer is introduced.

### Accessibility Level

Accessibility combines public-display readability with baseline web accessibility expectations. The design must support distance reading, non-color status encoding, restrained motion, and keyboard-safe recovery states. Detailed accessibility bars are defined in the Non-Functional Requirements section.

### Implementation Considerations

Implementation should preserve the distinction between a live public-display web application and a noisy dashboard. The server-rendered shell and selective client refresh behavior should support calm polling, avoid decorative motion, and maintain layout consistency under both normal and degraded source conditions.

Because the MVP runs in a controlled browser environment, implementation should also prioritize operational simplicity: reliable startup, stable long-running behavior, clean recovery after interruption, and a presentation model that remains trustworthy in front of visitors. This product should feel infrastructural in use, even though it is delivered as a web application.

## Project Scoping & Phased Development

### MVP Strategy & Philosophy

**MVP Approach:** hybrid problem-solving + experience MVP

The MVP must prove product value and product form at the same time. It must give visitors fast situational confidence at the point of departure and behave like a calm, venue-native foyer instrument rather than a generic transport dashboard. A purely functional MVP would miss the differentiator; a purely experiential MVP would miss the utility.

**Resource Requirements:** 1 developer plus part-time product/design input

The smallest credible MVP team is one developer supported by part-time product/design discipline. A dedicated designer would likely improve finish and presentation quality, but is not strictly required for the first credible version if the product/design bar is actively protected during implementation.

### MVP Feature Set (Phase 1)

**Core User Journeys Supported:**
- Sarah Malik primary success path: quick, calm departure orientation from the foyer screen
- Sarah Malik edge case: worsening conditions with degraded trust in one source, while the display remains honest and useful
- Daniel Weber orientation path: unfamiliar visitor understanding the local departure picture without needing London transport fluency
- Front-of-house staff / host shared-reference path: staff and attendees orienting around the same visible facts
- Venue-side operator trust path: lightweight operational confirmation that the screen is live, stable, and safe to trust in the building

**Must-Have Capabilities:**
- status-first overall summary bar
- compact nearby mode rows with clear public-signage status emphasis
- concrete nearby stations, stops, or corridor references
- recognisable local orientation map
- selective freshness cues
- honest disruption and trend handling
- compact alerts for degraded or worsening conditions
- calm live updates

These are day-1 deal-breakers for MVP. If any are missing, the product no longer proves its core value or its differentiating form.

**Intentional MVP Simplifications:**
- venue-side restart and recovery can be manual
- source monitoring can remain basic
- degraded-source handling can be simple, provided it is honest and legible
- secondary detail views are omitted entirely
- the map can use a restrained conventional treatment if that communicates nearby relevance more clearly than an abstract custom frame
- operational trust checks should be lightweight and visible rather than implemented as a full admin layer

### Post-MVP Features

**Phase 2 (Post-MVP):**
Growth should focus on deeper inspection without changing the main screen's role. This includes:
- secondary detail views behind the primary foyer display
- richer local context and explanatory depth
- accessibility and walkability layers
- deeper map inspection
- selective secondary data layers that improve understanding without making the main screen denser

**Phase 3 (Expansion):**
Expansion should turn the concept into a reusable venue-centered mobility product pattern:
- adaptation for additional institutions, cultural venues, conferences, and public spaces
- configurable venue-specific framing and local context
- broader deployment beyond a single controlled foyer setup
- optional companion views that extend the product without breaking the anti-planner contract

### Risk Mitigation Strategy

**Technical Risks:**  
The highest technical risk is proving calm, trustworthy live behavior under real source volatility. Mitigation for MVP is to keep the implementation narrow: one venue, one controlled browser environment, basic source monitoring, simple but honest degradation, and manual operational recovery where needed.

**Market Risks:**  
The primary market risk is that the ambient shared-screen behavior may be weaker than expected if visitors still default immediately to phones. MVP should therefore validate whether the screen becomes a first layer of orientation, a shared group reference, and part of the pre-departure ritual.

**Resource Risks:**  
The main resource risk is overbuilding secondary depth before the one-screen concept is proven. Mitigation is to hold the line on a single-screen MVP, omit secondary detail views, avoid a full admin layer, and defer deeper map styling or broader platform support until the core foyer instrument is validated.

## Functional Requirements

### Departure Situation Overview

- FR1: Visitors can view a single shared departure display centered on the Royal Institution.
- FR2: Visitors can view an overall summary of current departure conditions from the Royal Institution.
- FR3: Visitors can understand the overall departure state through one of four display states: calm, watchful, strained, or disrupted.
- FR4: Visitors can understand trend through one of three display states: improving, steady, or worsening when the overall departure state or any core mode state has changed within the last 15 minutes.
- FR5: Visitors can use the display for first-orientation without needing to begin a route-planning task.

### Mobility Comparison & Local Orientation

- FR6: Visitors can compare the current state of the core MVP mode set for departure from the Royal Institution: Tube or rail, bus, roads, and any enabled micromobility feed.
- FR7: Visitors can understand nearby mobility conditions without being required to inspect full-network detail.
- FR8: Visitors can view a location-specific map anchored to the Royal Institution.
- FR9: Visitors can use the map to understand nearby relevance and local spatial context for onward options.
- FR10: Visitors can identify the Royal Institution anchor plus the nearby stations, stops, and local nodes selected for the MVP venue map.
- FR11: Visitors can interpret the departure picture as a local, from-here-now view rather than as a generic citywide transport dashboard.

### Weather & Human Context

- FR12: Visitors can view current weather conditions as part of the departure picture.
- FR13: Visitors can understand how weather affects the practical feel of onward travel without receiving prescriptive advice.
- FR14: Visitors can interpret departure conditions through a combined weather-and-mobility view rather than through isolated widgets.

### Trust, Freshness & Disruption Handling

- FR15: Visitors can tell whether each displayed signal is current, aging, stale, or unavailable before relying on it for a departure decision.
- FR16: Visitors can tell when a displayed signal is stale, delayed, or carrying reduced confidence.
- FR17: Visitors can distinguish whether each displayed mode is in a normal, caution, or disrupted state.
- FR18: Visitors can recognize serious disruption immediately when the overall departure state is disrupted or when any core mode enters a disrupted state.
- FR19: Visitors can continue to use the display when one source is degraded or unavailable.
- FR20: Visitors can understand which part of the departure picture is affected when trust is reduced in one signal or source.

### Live Display Behavior

- FR21: Visitors can continue reading the shared departure display as conditions change without losing section position, reading order, or hierarchy.
- FR22: Visitors can perceive that the departure picture remains current through freshness labels, trend cues, or state changes while the shared layout remains stable during live updates.

### Shared Use & Social Readability

- FR23: Two or more visitors can use the display as a shared situational reference at the same time.
- FR24: Groups of 2-4 visitors can use the display to discuss and reach the same broad departure read from the same visible facts.
- FR25: Visitors unfamiliar with London transport can understand the local departure picture without prior network expertise.
- FR26: The display can support both room-scale reading and closer factual inspection as part of the same experience.

### Staff & Venue Hosting Support

- FR27: Front-of-house staff and event hosts can use the display as a shared factual reference when helping visitors.
- FR28: Staff can answer departure-related questions by referring to the same visible information available to attendees.
- FR29: Staff can rely on the display without needing to translate it into route-planning advice.

### Venue Operation & Public Reliability

- FR30: Venue-side operators can confirm that the display is ready for public use by checking that the main layout is visible, the overall departure state is present, and any reduced-confidence signals are labeled.
- FR31: Venue-side operators can tell whether the display is currently in a current, reduced-confidence, or unavailable public state.
- FR32: Venue-side operators can identify which displayed signal is degraded and whether the effect is local to one component or affects the overall departure picture.
- FR33: Venue-side operators can return the display to an active public state after interruption or restart.
- FR34: Venue-side operators can keep the product in service in MVP using lightweight restart, refresh, and trust-check actions available to venue staff.

### Scope Protection & Product Contract

- FR35: The product can provide departure support without offering end-to-end route planning.
- FR36: The product can inform users without recommending a specific mode or next action.
- FR37: The main public display can remain focused on the departure picture without requiring secondary detail views in MVP.
- FR38: The product can deliver value as a calm public instrument by preserving a single-screen read, stable hierarchy, restrained live updates, and fact-only mode comparison even when no visitor interacts with it directly.

## Non-Functional Requirements

### Performance

- From browser launch or manual refresh, the display must reach a usable public state within 10 seconds on the venue laptop under normal network conditions, as measured across 5 consecutive startup tests.
- Core transport and weather signals must refresh at least once every 60 seconds under normal operation, as observed during a 30-minute steady-state run.
- Once fresh source data is available, affected on-screen content must update within the next 60 seconds and without a full-screen redraw, as observed during live update testing.
- During live updates, the atmospheric header, mode summaries, and local map must remain in the same screen order and primary positions, and any visual transition must complete within 1 second without obscuring critical information, as verified during normal and degraded-source update tests.

### Reliability

- The display must remain in service for at least 8 consecutive hours of normal venue use without requiring manual restart, as verified by one continuous venue-day test.
- Failure of one external data source must not remove unaffected modes, the overall state header, or the screen shell from public view, as verified during single-source failure testing.
- If a source misses one planned refresh attempt, the affected signal must move to a reduced-confidence or unavailable state by the next display update, as verified during simulated missed-refresh testing.
- Manual restart or recovery must return the display to a usable public state within 2 minutes, as measured from restart initiation to return of the public-ready display.
- After restart, the display must return with the same section layout and without exposing debug or recovery tooling to public viewers, as verified during restart and degraded-source recovery tests.

### Accessibility

- The main display must be readable at a normal foyer viewing distance of 4-6 meters, as verified on the target display during venue testing.
- Each status state must include a non-color indicator such as wording, iconography, or structural emphasis, as checked across all public state combinations.
- Displayed text and essential status markers must meet WCAG AA contrast expectations where applicable to screen-based viewing, as checked with contrast tooling against the production palette.
- If motion is reduced or absent, the screen must still communicate status, freshness, and degradation correctly, as verified with reduced-motion testing.
- Any setup or recovery state used by staff must be operable using keyboard only, as verified by keyboard-only testing.
- Labels that explain state, freshness, or disruption must use plain language that does not depend on London transport expertise, as checked in copy review against the mixed-audience personas.

### Integration

- Partial or missing external data must not blank the whole display or hide unaffected components, as verified during partial-feed and missing-feed testing.
- When a displayed signal misses two planned refresh attempts, it must be marked as reduced-confidence or stale, as verified during simulated missed-refresh testing.
- External failures must be indicated within one display update cycle and only on affected components unless the overall departure picture is impacted, as observed during feed-failure testing.
- Any last-known value shown after source degradation must be labeled as reduced-confidence before it is presented on the public display, as checked in degraded-feed scenarios.
- The display must continue to present a coherent departure picture when any single optional feed is delayed or unavailable, as verified during single-optional-feed outage testing.

### Security

- The MVP must not collect or transmit personal data from public viewers during normal operation, as verified by deployed-feature review of the public display path.
- The MVP must not use user accounts, personal profiles, or stored personal journey history, as verified by product-scope review of the MVP.
- The MVP must not use cookies, identifiable client analytics, or persistent browser storage beyond temporary runtime data needed for the current public display session, as verified by browser storage review on the deployed MVP.
- Credentials required for external services must not be visible on the public display, in public recovery states, or in publicly accessible logs, as verified during display, recovery, and log review.
- Any externally usable credentials or tokens must be limited to the minimum scope and permissions required for MVP operation, as verified by credential configuration review.
- Connections to external services must protect data and credential confidentiality in transit during normal operation, as verified by endpoint review confirming encrypted transport on every external request.
- The venue deployment must not expose debug, diagnostic, or administrative surfaces during normal public use, as verified during normal public-use walkthroughs.
- Recovery or restart procedures must return the display to public service without requiring secrets to be typed or displayed in view of visitors, as verified during restart and recovery drills in view of the public screen.
