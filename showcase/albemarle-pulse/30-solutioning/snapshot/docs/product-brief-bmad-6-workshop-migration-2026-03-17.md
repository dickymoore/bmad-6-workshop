---
stepsCompleted: [1, 2, 3, 4, 5, 6]
lastStep: 6
workflow_completed: true
inputDocuments:
  - /home/codexuser/bmad-6-workshop/_bmad-output/brainstorming/brainstorming-session-2026-03-16.md
  - /home/codexuser/bmad-6-workshop/docs/research/domain-public-apis-for-london-mobility-weather-and-civic-display-data-research-2026-03-17.md
  - /home/codexuser/bmad-6-workshop/docs/research/technical-api-integration-requirements-for-albemarle-pulse-research-2026-03-17.md
date: 2026-03-17
author: Workshop
---

# Product Brief: bmad-6-workshop-migration

<!-- Content will be appended sequentially through collaborative workflow steps -->

## Executive Summary

Albemarle Pulse is a calm, beautiful, fact-only mobility display for the Royal Institution that helps visitors understand local travel conditions at a glance before they leave the venue. Instead of forcing every visitor to repeatedly check their own phone for weather, disruption, and transport status, it creates one shared source of truth that reduces stress and keeps attention on the reason they came to the Institution in the first place.

The product is designed to make onward travel in London feel less mentally taxing without becoming a route planner or recommendation engine. It gives visitors an immediate sense of what the local outside environment looks like, whether conditions are generally favourable, somewhat disrupted, or significantly strained, so they can make their own decisions with confidence.

What makes the concept compelling is not only its utility, but its presentation. Albemarle Pulse aims to be genuinely beautiful: a venue-appropriate, glanceable experience that feels more like part of the Royal Institution than another generic software dashboard. It also acts as a strong demonstration of what can be built with BMAD and today's open API ecosystem when product thinking, design restraint, and technical execution are aligned.

---

## Core Vision

### Problem Statement

Travelling onward through London can be stressful, especially for people who are in the middle of a visit and do not want to keep interrupting their experience to monitor weather and transport conditions. Royal Institution visitors currently rely on fragmented individual behaviours such as checking Citymapper, TfL, weather apps, station boards, staff, or guesswork. This creates repeated effort and pulls attention away from the venue experience.

### Problem Impact

When visitors have to keep one eye on the outside world while they are inside the Royal Institution, they cannot fully immerse themselves in why they are there. The stress of onward travel planning leaks into the visit itself. This affects individual confidence, distracts from the venue experience, and creates unnecessary duplication as many people independently check the same information on their own devices.

### Why Existing Solutions Fall Short

Existing solutions are useful, but they are designed for individuals on personal devices rather than for a shared venue context. They require active checking, repeated switching between apps, and more focused attention than a visitor should need while enjoying the Royal Institution. They are also functional rather than atmospheric: they provide utility, but not a unified, beautiful, calm source of reassurance that belongs in the space itself.

### Proposed Solution

Albemarle Pulse is a shared, glanceable display that gives Royal Institution visitors a quick read of the local outside environment before they leave. The first version should show, at minimum, weather and overall travel disruption, while also helping visitors answer practical questions such as whether it is raining, whether the Tube is strained, whether buses look like a better bet, and whether conditions are generally fine. The product remains strictly fact-only, helping people interpret conditions for themselves rather than telling them what to do.

### Key Differentiators

- It is designed specifically for the Royal Institution context, not for generic city travel.
- It replaces fragmented individual checking with one shared point of reference.
- It is intentionally beautiful, calm, and venue-appropriate rather than app-like or utilitarian.
- It stays fact-only, preserving user agency instead of becoming a recommendation engine.
- It is enabled by the combination of open APIs and BMAD, making now the right moment to build it.

## Target Users

### Primary Users

Albemarle Pulse is primarily for Royal Institution visitors preparing to leave the building and make an immediate onward-travel decision. The core user is someone like Sarah Malik, a 38-year-old conference attendee or lecture visitor who is using the Royal Institution as one stop within a larger London day rather than as a final destination.

What matters to Sarah is not exhaustive transport detail, but a fast, calm read of what leaving the building will feel like right now. She wants to understand whether conditions are broadly calm, strained, or deteriorating before committing to a mode. She cares about weather because it changes how all onward options feel, not just what is technically possible. She wants enough local truth to judge her options, but not a full route-planning task.

Today, Sarah handles this in a fragmented way. She checks a weather app, Citymapper or Google Maps, sometimes TfL status, and sometimes just looks outside. She then has to mentally combine rain, Tube status, buses, and local congestion into one picture. This often gives her either too much detail or the wrong level of detail for the moment.

Albemarle Pulse creates value when Sarah can glance up and get the answer before she has even opened anything. In a few seconds, she can understand the whole departure atmosphere: weather, nearby network condition, and whether things are worsening. It does not tell her what to do, but it makes the tradeoffs obvious enough that she can decide immediately. The product succeeds when she thinks, "this is exactly what I needed."

A second meaningful visitor type is the small group of attendees leaving together. For them, Albemarle Pulse acts as a shared decision surface that helps multiple people read the same facts, discuss tradeoffs, and make a quick collective departure decision without one person having to interpret several apps for everyone else.

### Secondary Users

A meaningful secondary user is the visitor who is unfamiliar with London transport, represented by someone like Daniel Weber, a 46-year-old conference visitor from outside London. Daniel is not confident navigating the transport network from memory and wants to understand the local mobility picture without needing London-specific expertise.

What matters to Daniel is clarity and reassurance. He needs the display to teach itself through composition, familiar red/amber/green status logic, and emphasis on the lines and nearby nodes that matter around the Royal Institution. Today he is likely to open a route planner and get dropped into too much detail too early, struggle to interpret whether a generic Underground summary affects him here and now, or ask staff basic questions. Albemarle Pulse succeeds for him when he can understand the situation before he understands the whole system.

Staff, event hosts, and venue operators are also important secondary users and stakeholders. They are not the primary audience, but they benefit from the display as a shared situational reference. It helps them answer attendee questions, understand the current departure picture, and support a calmer, more informed egress experience across the foyer.

### User Journey

The journey begins when a visitor notices Albemarle Pulse in the foyer as people begin to leave. They do not actively go searching for a tool; the display is already present as part of the departure environment. From across the room, the product already communicates the general mobility mood through its top-level composition and color balance.

On closer inspection, the visitor reads the overall conditions header first, then any trend cue showing whether conditions are stable, improving, or deteriorating. After that, they scan the most relevant nearby modes and lines, plus the immediate weather read. Only if needed do they inspect more local specifics such as nearby nodes or bike availability.

The key "aha" moment is realizing that the display has already combined the right facts into one calm, coherent read. Instead of calculating the whole picture themselves from multiple apps, users can infer the situation quickly from one composed surface. The product succeeds when the best next step becomes obvious enough to act on, without ever being explicitly recommended.

In the final minute before leaving, the visitor moves from fragmented app-checking to calm confirmation. They may decide to head for a nearby bus, walk toward a station, wait a few minutes, or simply confirm the plan they were already considering. Albemarle Pulse becomes part of a brief pre-departure ritual that lets people focus on leaving confidently rather than piecing together the outside world for themselves.

## Success Metrics

Users are trying to achieve fast situational confidence in the final minute before leaving the Royal Institution. They do not need Albemarle Pulse to plan an exact journey; they need it to tell them, quickly and calmly, what the current departure picture feels like from here and now. The product is working when users can understand conditions in seconds, infer viable options for themselves, and feel less need to check multiple apps before stepping outside.

Observable success looks like people glancing at the display before leaving, small groups using it as a shared decision surface, and staff referencing it as part of normal hosting. Even when nobody actively engages with it, the screen should raise foyer-wide situational awareness by communicating the overall mobility mood at a distance.

At 3 months, success means Albemarle Pulse is behaving like a credible part of the Royal Institution foyer: noticed, used, and trusted as a calm pre-departure reference. At 12 months, success means it has become an established venue service that improves departure confidence and proves the value of venue-centered mobility intelligence without drifting into route planning.

### Business Objectives

- Establish Albemarle Pulse as a trusted part of the Royal Institution departure experience rather than an obvious software demo.
- Reduce visitor stress and attention leakage during departure moments by providing one shared, calm source of local travel truth.
- Support staff and event hosts with a credible situational reference they can use when helping attendees.
- Prove that a venue-centered, fact-only mobility display can create value without expanding into route planning.
- Demonstrate a reusable product and design pattern for venue-based mobility intelligence that could later extend beyond the Royal Institution.

### Key Performance Indicators

- **Perceived usefulness:** strong positive response to statements such as "This helped me decide what to do next."
- **Confidence after viewing:** strong positive response to statements such as "I felt clearer about my onward options after seeing the screen."
- **Glance usefulness:** percentage of users who report that the display was useful without requiring interaction.
- **Glance rate before exit:** percentage of departing attendees who visibly look at the display.
- **Average glance time:** short, seconds-based viewing time that confirms fast orientation rather than prolonged study.
- **Group consultation rate:** percentage of departures where two or more people use the display together.
- **Phone-check reduction:** self-reported or observed reduction in multi-app checking before leaving.
- **Staff reference rate:** frequency with which staff or hosts use the display when helping attendees.
- **Main-screen comprehension:** percentage of users who can correctly describe the overall conditions state and any visible trend after viewing.
- **Trust score:** user feedback indicating that the display feels current, believable, and dependable.
- **Calmness / composure score:** user feedback indicating that the screen feels useful without feeling noisy, stressful, or overbuilt.
- **Route-planner drift:** negative KPI tracking pressure or demand to add detailed journey-planning behavior to the main experience.

## MVP Scope

### Core Features

The MVP should deliver a single calm, always-on departure screen centered on the Royal Institution. It must work as a public foyer display rather than as a personal app, and it should already create value from across the room without depending on user interaction.

The main feature of the experience is an atmospheric conditions header that combines weather and overall mobility into one immediate read of what leaving feels like right now. This is the fastest orientation layer and the main thesis of the screen.

Below that, the MVP should present a small set of fact-only mobility signals side by side in a glanceable form. The core set should cover the most relevant nearby modes, likely including Tube or rail, bus, roads, and micromobility. The purpose is comparison and situational understanding, not recommendation.

The MVP should also include a fixed local map centered on the Royal Institution. This map should provide a stable, simplified vicinity view that anchors the rest of the screen spatially and explains local relevance once. It should orient nearby nodes and options without becoming a navigable route-planning canvas.

Trust and calm both matter in MVP, but trust comes first. The product must show honest disruption and freshness cues where confidence depends on them. If conditions are worsening materially, that should be visible immediately.

Finally, the MVP should have restrained live update behavior. The screen should feel live through soft fades and gentle state changes while keeping the layout stable. It should avoid flashing, restless animation, or any kind of dashboard theatre.

### Out of Scope for MVP

- No end-to-end route planning, route permutations, turn-by-turn logic, or exact onward journey execution.
- No recommendations or advisory language such as telling users which mode they should take.
- No interactive main-screen map behaviors such as pan, zoom, route drawing, or exploratory map interactions.
- No dense operational detail on the primary view, including scrolling disruption feeds, full departure boards, heavy analytics, or detailed traffic metrics.
- No metropolitan completeness or distant signals that do not materially affect the immediate departure moment from the Royal Institution.
- No mobile-first or multi-surface expansion in MVP; the product should remain desktop/display-first and behave like part of the building.
- No CI/CD, cloud hosting, or high-availability infrastructure as part of MVP scope; the app should be designed to run locally on this laptop without ongoing operational support requirements.

### MVP Success Criteria

The MVP is successful enough to continue when people can understand the overall departure mood from across the room, get the key picture in a few seconds without touching anything, and compare modes without feeling like they are using a planner.

It must also prove that the Royal Institution-centered map and local signals are genuinely useful rather than decorative, that serious disruption is visible immediately without breaking the screen's composure, and that the product feels like part of the venue rather than a generic dashboard dropped onto a monitor.

In short, the project should continue beyond MVP if the one-screen display is clearly useful, visibly calmer than typical transport tools, and strong enough to feel like a permanent Royal Institution foyer instrument rather than a prototype.

### Future Vision

If Albemarle Pulse succeeds, it should evolve from a single Royal Institution foyer display into a repeatable venue-centered mobility product for conferences, cultural venues, and public spaces. The long-term opportunity is not to keep adding features to one screen, but to prove a reusable pattern for calm, location-specific, fact-only mobility intelligence.

Later versions could add secondary detail views for users who want to inspect conditions more closely after the main screen has done its job. They could also introduce optional venue-specific context layers such as accessibility information, step-free relevance, walking comfort, crowd-sensitive departure context, weather-exposure cues, and other locally meaningful signals.

Additional data sources may be added over time, but only where they materially improve trust, relevance, or local decision confidence. The mature product should become a family of venue-aware mobility displays and optional companion views that can be configured for different places and audiences while preserving the core doctrine of a calm, local, fact-only main screen that does not become a route planner.
