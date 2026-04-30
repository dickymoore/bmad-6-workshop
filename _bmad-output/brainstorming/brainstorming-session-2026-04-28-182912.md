---
stepsCompleted: [1, 2, 3, 4]
inputDocuments: []
session_topic: "HarbourWatch, a local-only demo app for Seattle's waterfront"
session_goals: "Generate product, UX, data, and demo-scope ideas for a calm harbour-side operations display that combines weather, tide, ferry, berth, safety, and local environmental signals using free/open APIs where possible, while avoiding full vessel traffic management scope."
selected_approach: "ai-recommended"
techniques_used: ["Constraint Mapping", "Role Playing", "SCAMPER Method", "Reverse Brainstorming"]
ideas_generated: []
context_file: ""
session_active: false
workflow_completed: true
---

# Brainstorming Session Results

**Facilitator:** Dicky
**Date:** 2026-04-28

## Session Overview

**Topic:** HarbourWatch, a local-only demo app for Seattle's waterfront.

**Goals:** Generate product, UX, data, and demo-scope ideas for a calm harbour-side operations display that combines weather, tide, ferry, berth, safety, and local environmental signals using free/open APIs where possible, while avoiding full vessel traffic management scope.

### Context Guidance

No external context file was provided. The session should stay grounded in a local-only BMAD demonstration for Seattle's waterfront, with likely public-data sources such as NOAA tides and weather, public ferry information, City of Seattle open data, and fixture-backed berth or safety notices.

### Session Setup

The working concept is a calm, glanceable harbour operations display for marina and ferry-terminal teams, with visitor-friendly visibility into current harbour conditions. The session should explore the boundary between operational awareness and non-goals, especially avoiding vessel traffic management, live vessel control, collision avoidance, or regulatory decision support.

## Technique Selection

**Approach:** AI-Recommended Techniques

**Analysis Context:** HarbourWatch needs to combine multiple public and fixture-backed harbour signals into a calm Seattle waterfront display while staying local-only and demo-safe.

**Recommended Techniques:**

- **Constraint Mapping:** Establish product, technical, legal, and operational boundaries before adding features.
- **Role Playing:** Explore the needs of marina staff, ferry-terminal teams, safety coordinators, and visitors.
- **SCAMPER Method:** Transform ordinary dashboard concepts into stronger demo features.
- **Reverse Brainstorming:** Identify how the app could become noisy, misleading, over-authoritative, or too close to vessel traffic management.

**AI Rationale:** This sequence starts with scope control, then shifts into user perspectives, then generates feature variants, then stress-tests the result for failure modes and anti-requirements.

## Technique Execution

### Constraint Mapping

**User refinement:** HarbourWatch should feel like part of the harbour office or ferry-terminal environment, not a control room. It should make current conditions legible at a glance, but never tell anyone what to do. Open APIs are preferred where credible, especially NOAA tides and weather, while fixture-backed local operational signals are acceptable when clearly labeled. The demo must continue to look useful when external feeds are stale or unavailable.

**Captured Ideas:**

**[Constraint #1] Harbour Office, Not Control Room**  
_Concept:_ The visual language should resemble a calm operational noticeboard or terminal conditions display rather than a command center. It can summarize harbour context, but should avoid radar-like interfaces, tactical maps, command verbs, or live control metaphors.  
_Novelty:_ This turns the product identity into a safety boundary, not just an aesthetic preference.

**[Constraint #2] Legibility Without Instruction**  
_Concept:_ HarbourWatch should make conditions easy to understand but should not tell users what action to take. Copy should use neutral labels such as "Observed", "Forecast", "Notice", "Stale", or "Unavailable" instead of directive labels such as "Proceed", "Hold", or "Clear".  
_Novelty:_ The app can still be operationally useful while refusing to become decision authority.

**[Constraint #3] Honest Mixed Data**  
_Concept:_ The display can combine credible open APIs with fixture-backed local signals, provided every signal makes its provenance and freshness obvious. Fixture data should feel like a realistic harbour-office feed, not a fake live system.  
_Novelty:_ This makes fixture-backed demo data a product feature: transparent locality rather than pretend integration.

**[Constraint #4] Graceful Staleness Mode**  
_Concept:_ HarbourWatch should have a useful degraded state when external feeds are stale or unavailable, showing last-known values, source status, fixture notices, and stable contextual guidance. The app should never collapse into a broken dashboard just because one live feed fails.  
_Novelty:_ Reliability is expressed through calm degradation, which matches the product personality.

**[Constraint #5] Deliberately Narrow v1**  
_Concept:_ v1 excludes AIS-style vessel maps, command language, trip planning, staff workflow systems, emergency operations, authentication, admin surfaces, and anything that makes fixture-backed berth or safety notices look live. Recent trend context is allowed only when it calmly explains present conditions, such as tide rising or wind easing.  
_Novelty:_ The exclusions are not missing features; they protect the demo from becoming the wrong product.

**[Constraint #6] Trends Are Context, Not Analytics**  
_Concept:_ Recent trends should be short, situational explanations rather than reporting or optimization tools. Examples include "tide rising for the next 2 hours" or "wind easing since last update", not charts designed for analysis.  
_Novelty:_ Time context supports glanceability without pulling the product into operational intelligence or analytics.

### Role Playing

**Role: Ferry terminal duty supervisor**

**User refinement:** In the first 10 seconds, the supervisor should understand whether the waterfront is running normally, whether ferry departures are broadly on time, whether tide/wind/visibility conditions are notable, and whether clearly labeled notices need attention. They would ignore decorative maps, raw feeds, and anything resembling dispatch tooling. Credible wording should be observational: "Service pattern", "Updated", "Observed wind", "Next tide", "Notice", and "Source". Visual emphasis should go to stale data, unusual wind or visibility, material ferry disruption, and fixture notices that affect passenger-facing communication.

**Captured Ideas:**

**[Role #1] Ten-Second Normality Check**  
_Concept:_ The top of the display should quickly answer whether the waterfront is broadly normal, with a concise status line backed by ferry pattern, weather, tide, visibility, and notices. This should be descriptive rather than directive, such as "Waterfront conditions: typical, ferry service: minor delay pattern".  
_Novelty:_ The primary unit of value is orientation, not data density.

**[Role #2] Observational Vocabulary System**  
_Concept:_ Use a controlled vocabulary for condition labels: "Service pattern", "Observed", "Forecast", "Updated", "Next tide", "Notice", and "Source". Avoid dispatch, command, or authorization language.  
_Novelty:_ Copy becomes part of the safety model and product identity.

**[Role #3] Emphasis Only for Material Variance**  
_Concept:_ Visual weight should be reserved for stale feeds, unusual wind or visibility, material ferry disruption, and fixture-backed notices that affect passenger-facing communication. Everything else should sit quietly.  
_Novelty:_ The display earns calmness by being selective about emphasis.

**[Role #4] No Raw Feed Surface**  
_Concept:_ The supervisor does not need raw API payloads, decorative maps, or dispatch-like panels. The app should translate feeds into credible human-readable summaries with visible freshness and source metadata.  
_Novelty:_ The demo demonstrates product judgment, not just integration capability.

**Role: Marina or harbour office staff**

**User refinement:** In the first 10 seconds, harbour office staff should see the shape of the day: tide window, wind direction and gusts, visibility, rain or temperature, a small set of berth or dock notices, and whether any visitor-facing advisory should be mentioned. Realistic fixture notices include guest dock capacity limited, fuel dock hours, pier gate maintenance, low-clearance reminder, kayak rental pause, and restroom or service closure. Tide and wind should be more prominent than ferry timing in this view, while still summarized as conditions rather than instructions. Local identity should come from Seattle waterfront geography, plain harbour-office labels, and source/freshness metadata tucked into each panel.

**[Role #5] Shape of the Day Panel**  
_Concept:_ A marina-facing layout should begin with the day shape: tide window, wind direction and gusts, visibility, precipitation or temperature, and a small cluster of local notices. The goal is to help staff answer "what kind of harbour day is this?" before drilling into any panel.  
_Novelty:_ The main status is temporal and environmental, not route or schedule oriented.

**[Role #6] Realistic Local Fixture Notices**  
_Concept:_ Fixture-backed notices should feel like practical harbour-office items: guest dock capacity limited, fuel dock hours, pier gate maintenance, low-clearance reminder, kayak rental pause, and restroom or service closure. These should be clearly labeled as local notices rather than live sensor outputs.  
_Novelty:_ The fixtures create realism without pretending to be operational integrations.

**[Role #7] Marina Signal Hierarchy**  
_Concept:_ In a marina or harbour office view, tide and wind should receive more prominence than ferry timing. Ferry status can remain visible as waterfront context, but not dominate the display.  
_Novelty:_ The same product can support role-sensitive hierarchy without becoming a configurable enterprise system.

**[Role #8] Seattle Harbour Office Locality**  
_Concept:_ Local feel should come from Seattle waterfront geography and plain harbour-office labels, such as Elliott Bay, Pier 50, Colman Dock, guest dock, fuel dock, and waterfront notices. Source and freshness metadata should be present but visually secondary.  
_Novelty:_ Locality is achieved through operational language and geography, not decorative branding.

**Role: Visitor or passenger**

**User refinement:** Visitors should not see berth capacity, non-public maintenance details, staff labels, or operational feed status beyond simple freshness. They should see a calm waterfront summary, ferry service pattern, next tide or tide direction, wind/rain/visibility in plain language, and only notices affecting their experience. Language should stay mild: "typical", "breezy", "limited visibility", "rain later", "ferry delays reported", and "local notice". Freshness and source names can appear in small text where helpful, but API provenance should not be part of the main read. Seattle context should be practical: Colman Dock, Pier 50, Elliott Bay, waterfront, nearby ferry routes, and a small note when data is fixture-backed.

**[Role #9] Reduced Public Mode**  
_Concept:_ The visitor-facing view should be a deliberately reduced display, not the staff dashboard with hidden controls. It should remove berth capacity, non-public maintenance details, staff labels, and detailed operational feed state.  
_Novelty:_ Public clarity comes from designing a separate reading experience, not simply redacting staff data.

**[Role #10] Mild Condition Language**  
_Concept:_ Visitor copy should use low-alarm terms such as "typical", "breezy", "limited visibility", "rain later", "ferry delays reported", and "local notice". It should avoid technical or operational language unless needed for comprehension.  
_Novelty:_ Tone management becomes part of the display's usefulness.

**[Role #11] Experience-Affecting Notices Only**  
_Concept:_ The public display should show only notices that affect visitor experience, such as ferry delays, restroom closures, kayak rental pause, or waterfront access changes. Internal berth, maintenance, and staff coordination details stay out of view.  
_Novelty:_ The same fixture system can feed different visibility layers.

**[Role #12] Practical Seattle Orientation**  
_Concept:_ Seattle context should help visitors locate themselves and understand nearby services: Colman Dock, Pier 50, Elliott Bay, waterfront, and nearby ferry routes. Source and freshness appear in small text, and fixture-backed data is noted plainly.  
_Novelty:_ Local references provide wayfinding value without requiring a full map-centric product.

### SCAMPER Method

**Lens: Substitute**

**User refinement:** HarbourWatch can substitute a calm condition strip for a KPI row, a harbour day summary for a dense status dashboard, tide and weather phrases for raw charts, source/freshness notes for developer-style API diagnostics, role-based views for a settings-heavy configuration surface, and a small waterfront context band for a full map.

**[SCAMPER #1] Calm Condition Strip**  
_Concept:_ Replace KPI rows with a condition strip that summarizes waterfront status, ferry pattern, tide direction, wind, visibility, and notices in calm language. The strip should read like an operational display, not a performance dashboard.  
_Novelty:_ It avoids the corporate dashboard trope and matches harbour-office use.

**[SCAMPER #2] Harbour Day Summary**  
_Concept:_ Replace a dense status dashboard with a short "day shape" summary that explains the overall waterfront condition. For example: "Breezy morning on Elliott Bay. Tide rising through midday. Ferry service mostly typical."  
_Novelty:_ It creates a human-readable synthesis layer over multiple feeds.

**[SCAMPER #3] Phrase-First Environmental Data**  
_Concept:_ Replace raw tide and weather charts with phrases and compact trend cues, with numbers available only where they improve credibility. Examples include "wind gusts notable", "tide rising", "visibility limited", and "rain later".  
_Novelty:_ Environmental data becomes readable at a glance without losing operational grounding.

**[SCAMPER #4] Source Notes, Not Diagnostics**  
_Concept:_ Replace developer-style API diagnostics with small source/freshness notes attached to panels. Users see "NOAA, updated 8:12" or "Local fixture, demo notice" rather than error logs or feed internals.  
_Novelty:_ Technical honesty is preserved without dominating the experience.

**[SCAMPER #5] Role Views Over Configuration**  
_Concept:_ Replace a settings-heavy configuration surface with a small number of role-based views: terminal, harbour office, visitor. Each view changes hierarchy and visibility without exposing admin complexity.  
_Novelty:_ The demo can feel adaptive without becoming a configurable platform.

**[SCAMPER #6] Waterfront Context Band**  
_Concept:_ Replace a full map with a small contextual band showing Seattle waterfront anchors such as Elliott Bay, Colman Dock, Pier 50, and ferry route labels. It orients the user while avoiding map-first expectations.  
_Novelty:_ Geographic context becomes a supporting layer rather than the product center.

**Lens: Combine**

**User refinement:** HarbourWatch should combine tide, wind, visibility, and rain into a Harbour Conditions summary without scoring or advice. Ferry status and visitor notices can combine into a public travel context panel. Source freshness, stale feed states, and fixture labels can combine into a quiet Data Confidence line. Seattle geography should combine with weather language, such as "Elliott Bay breezy", "Pier 50 departures typical", and "Colman Dock notice".

**[SCAMPER #7] Harbour Conditions Summary**  
_Concept:_ Combine tide, wind, visibility, and rain into one calm environmental summary. The summary should explain conditions without giving scores, ratings, or advice.  
_Novelty:_ It synthesizes environmental complexity while avoiding decision authority.

**[SCAMPER #8] Public Travel Context Panel**  
_Concept:_ Combine ferry status and visitor-facing notices into one public panel that answers "will my waterfront visit or ferry trip feel affected?" without turning into trip planning.  
_Novelty:_ It gives visitors practical context without becoming a transport app.

**[SCAMPER #9] Quiet Data Confidence Line**  
_Concept:_ Combine source freshness, stale states, and fixture labels into a compact line that is always visible but visually quiet. Example: "NOAA weather updated 8:12 | Tide updated 8:05 | Local notices are demo fixtures".  
_Novelty:_ Trust is maintained as an ambient layer, not a diagnostic panel.

**[SCAMPER #10] Situated Seattle Sentences**  
_Concept:_ Combine Seattle geography with condition language: "Elliott Bay breezy", "Pier 50 departures typical", "Colman Dock notice", "Waterfront visibility limited".  
_Novelty:_ The display feels local through sentence structure and place names, not ornament.

**Lens: Eliminate**

**User refinement:** Remove radar visuals, glowing map pins, red/green command status, vessel icons, route lines, dense charts, and big alert banners unless a feed is genuinely unavailable. Skip AIS, live camera feeds, vessel position, historical analytics, occupancy prediction, route planning, user accounts, and admin configuration. Interactions should be limited to switching role view and maybe refreshing data; no drill-down labyrinth. Hide API payloads, stack traces, credentials, and raw provider errors. Fake live operational control would make the demo less credible.

**[SCAMPER #11] Forbidden Control-Room Visuals**  
_Concept:_ Exclude radar styling, glowing map pins, vessel icons, route lines, red/green command statuses, and dense technical charting. The visual system should not imply surveillance, tracking, or command authority.  
_Novelty:_ Visual exclusions protect the product boundary as much as feature exclusions.

**[SCAMPER #12] No Tempting Maritime Scope Creep**  
_Concept:_ Exclude AIS, live cameras, vessel position, historical analytics, occupancy prediction, route planning, user accounts, and admin configuration from v1.  
_Novelty:_ The demo becomes stronger by refusing impressive but distracting features.

**[SCAMPER #13] Two-Interaction Limit**  
_Concept:_ Keep interactions to role view switching and optional data refresh. Avoid drill-down paths, settings panels, modal stacks, and investigative workflows.  
_Novelty:_ Interaction restraint reinforces the "display" identity.

**[SCAMPER #14] Technical Internals Stay Hidden**  
_Concept:_ Hide API payloads, stack traces, credentials, and raw provider errors. Translate data issues into calm unavailable, stale, or fixture-labeled states.  
_Novelty:_ Technical honesty is delivered through product language rather than exposing internals.

**[SCAMPER #15] No Fake Control**  
_Concept:_ Never include UI that suggests live operational control, such as assigning berths, clearing departures, dispatching incidents, or overriding service states.  
_Novelty:_ Credibility comes from honest limits, not simulated power.

### Reverse Brainstorming

**Prompt:** How could HarbourWatch fail or become the wrong product?

**User refinement:** Additional failure modes include becoming a generic operations dashboard with too many equal-weight cards, exposing implementation awkwardness because of API limitations, hiding stale data, making Seattle feel like a label instead of part of information design, making visitor and staff views confusingly similar, mistaking calmness for low contrast or low information, and depending so heavily on live APIs that the demo cannot be trusted in a workshop.

**[Risk #1] Generic Dashboard Drift**  
_Concept:_ HarbourWatch could fail by becoming a grid of equal-weight cards with no clear hierarchy or harbour-specific synthesis.  
_Novelty:_ The risk is not only bad visuals; it is losing the product's reason to exist.

**[Risk #2] API Awkwardness Leaking Into UX**  
_Concept:_ Public API limitations could force the UI to expose provider quirks, inconsistent timestamps, missing fields, raw errors, or implementation caveats.  
_Novelty:_ Integration complexity should be absorbed by the product layer, not handed to users.

**[Risk #3] Hidden Staleness**  
_Concept:_ The app could look current while underlying data is stale or unavailable, damaging trust.  
_Novelty:_ Staleness is a product state that must be legible, not an implementation edge case.

**[Risk #4] Locality as Label Only**  
_Concept:_ The Seattle waterfront setting could feel superficial if place names appear only in headings while the information architecture remains generic.  
_Novelty:_ Locality must shape the content model and sentence structure.

**[Risk #5] Blurred Staff and Visitor Views**  
_Concept:_ Staff and visitor modes could become too similar, either exposing internal details to visitors or oversimplifying staff context.  
_Novelty:_ Role separation is a core design requirement, not a nice-to-have.

**[Risk #6] Calmness Misread as Weak Information**  
_Concept:_ A calm UI could become too low contrast, too sparse, or too vague to be useful.  
_Novelty:_ Calm does not mean quiet to the point of ambiguity; important variance still needs visual weight.

**[Risk #7] Workshop Fragility**  
_Concept:_ If the demo depends too heavily on live APIs, it may fail or look empty during the BMAD workshop.  
_Novelty:_ Fixture-backed and stale-state behavior are essential demo features, not fallback polish.

## Idea Organization and Prioritization

### Theme 1: Product Identity and Safety Boundary

**Focus:** HarbourWatch should be a calm harbour-office display, not a command center or vessel traffic tool.

- Harbour Office, Not Control Room
- Legibility Without Instruction
- Deliberately Narrow v1
- Forbidden Control-Room Visuals
- No Fake Control

**Pattern Insight:** The product boundary is expressed through features, language, visuals, and interaction limits.

### Theme 2: Glanceable Harbour Conditions

**Focus:** The core experience should synthesize weather, tide, ferry, visibility, and notices into useful condition summaries.

- Ten-Second Normality Check
- Shape of the Day Panel
- Calm Condition Strip
- Harbour Day Summary
- Harbour Conditions Summary
- Phrase-First Environmental Data

**Pattern Insight:** HarbourWatch should prioritize synthesis over raw data display.

### Theme 3: Role-Specific Reading Modes

**Focus:** Terminal staff, marina staff, and visitors need different hierarchies and visibility rules.

- Marina Signal Hierarchy
- Reduced Public Mode
- Experience-Affecting Notices Only
- Role Views Over Configuration
- Blurred Staff and Visitor Views

**Pattern Insight:** Role views are essential, but should remain simple enough for a local-only demo.

### Theme 4: Honest Data and Demo Resilience

**Focus:** Public APIs and fixtures can coexist if provenance, freshness, stale states, and workshop reliability are explicit.

- Honest Mixed Data
- Graceful Staleness Mode
- Source Notes, Not Diagnostics
- Quiet Data Confidence Line
- Technical Internals Stay Hidden
- Hidden Staleness
- Workshop Fragility

**Pattern Insight:** Data honesty is part of the product experience, not a developer-only concern.

### Theme 5: Seattle Waterfront Locality

**Focus:** Locality should shape the content model, not just the title.

- Seattle Harbour Office Locality
- Practical Seattle Orientation
- Waterfront Context Band
- Situated Seattle Sentences
- Locality as Label Only

**Pattern Insight:** Place names, local facilities, and Seattle-specific phrasing should make the display feel situated.

## Prioritization Results

**Top Priority Ideas:**

1. **Harbour Conditions Summary:** The main synthesis layer combining tide, wind, visibility, and rain without scoring or advice.
2. **Role Views:** Terminal, harbour office, and visitor views with different hierarchy and visibility.
3. **Quiet Data Confidence Line:** Always-visible freshness, source, stale, and fixture labeling.
4. **Waterfront Context Band:** Small Seattle orientation layer using Elliott Bay, Colman Dock, Pier 50, ferry routes, and waterfront labels.
5. **Graceful Staleness Mode:** Useful and intentional degraded states for stale or unavailable external feeds.

**Quick Win Opportunities:**

- Use fixture-backed local notices with explicit "demo fixture" labeling.
- Use controlled vocabulary for observational labels.
- Limit interactions to role switching and refresh.
- Build the first screen around a calm condition strip and day summary.

**Breakthrough Concepts:**

- Product identity as a safety boundary: "harbour office, not control room".
- Honest mixed data as a feature rather than an apology.
- Seattle situated sentences as the local information design pattern.

## Action Planning

### Action Plan 1: Define the PRD Around Non-Goals

**Why This Matters:** HarbourWatch is easy to overbuild into a maritime operations platform. The PRD should make the v1 exclusions first-class requirements.

**Next Steps:**

1. Create PRD sections for goals, non-goals, user roles, and data honesty.
2. Add explicit exclusions: AIS, vessel map, routing, dispatch, berth automation, admin/auth, analytics.
3. Define acceptance criteria for language, visual tone, and stale data states.

**Success Indicators:** A reader can clearly explain what HarbourWatch is and what it deliberately refuses to be.

### Action Plan 2: Draft the UX Around Three Reading Modes

**Why This Matters:** Role-specific hierarchy is central to the product, but must stay simple.

**Next Steps:**

1. Design Terminal, Harbour Office, and Visitor views.
2. Keep the same visual system but vary hierarchy and visibility.
3. Use a simple role switcher as the primary interaction.

**Success Indicators:** Each role can answer its first-ten-second question without seeing irrelevant detail.

### Action Plan 3: Build the Demo Data Strategy Early

**Why This Matters:** Workshop reliability requires graceful API failure, fixture-backed notices, and visible source freshness.

**Next Steps:**

1. Identify live candidates: NOAA weather and tides, public ferry information, city open data where practical.
2. Create fixture data for berth, dock, safety, and public notices.
3. Implement stale/unavailable states as normal product states.

**Success Indicators:** The app still looks useful with live APIs unavailable.

## Session Summary and Insights

**Key Achievements:**

- Defined HarbourWatch as a Seattle waterfront conditions display, not a control system.
- Generated role-specific display requirements for terminal staff, marina staff, and visitors.
- Identified the main information architecture: Harbour Conditions, Travel Context, Data Confidence, and Waterfront Context.
- Established visual and interaction exclusions that protect the v1 scope.
- Turned demo resilience into a product requirement.

**Recommended Next BMad Step:** Create a PRD using `bmad-create-prd`, then follow with `bmad-create-ux-design` because the product's value is primarily visual and glanceable.
