# Story 1.5: Anchor the Display with a Fixed Local Map

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visitor,
I want a fixed Royal Institution map anchor,
so that I can understand nearby relevance and local spatial context without using an interactive map.

## Acceptance Criteria

1. Given the public display is rendering normally, when a visitor looks at the map area, then the Royal Institution anchor and selected nearby nodes are visible, and the map supports locality without becoming an exploratory city map.
2. Given the map is part of the one-screen departure picture, when a visitor reads it with the rest of the display, then it reinforces the local from-here-now understanding, and it does not introduce route lines, turn-by-turn behavior, or route-planning affordances.
3. Given the preferred map layer or enrichment cannot be shown, when the map area falls back to a simplified state, then a restrained fallback-map behavior preserves the Royal Institution anchor and local context, and the public screen remains usable and calm rather than blank or broken.

## Tasks / Subtasks

- [x] Replace the reserved map placeholder with a real fixed local-map frame inside the existing dashboard feature boundary. (AC: 1, 2, 3)
  - [x] Keep [page.tsx](/home/codexuser/bmad-6-workshop/src/app/(public)/page.tsx) thin and continue composing the public display through `src/features/dashboard/*` rather than moving feature logic into the route. (AC: 1, 2, 3)
  - [x] Replace the `"Local frame"` reserved region in [DashboardScreen.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/DashboardScreen.tsx) with a dedicated `LocalMapFrame` component while preserving the existing header-first, modes-second, map-third reading order. (AC: 1, 2, 3)
  - [x] Keep the public route passive and non-interactive; no pan, zoom, hover tools, buttons, links, route affordances, or planner-like controls may appear on the map surface. (AC: 1, 2)
- [x] Extend the dashboard snapshot contract, fixture, and presenter to carry explicit local-map data plus fallback-state information. (AC: 1, 2, 3)
  - [x] Add a normalized `localMap` structure to [dashboard-snapshot.js](/home/codexuser/bmad-6-workshop/src/lib/contracts/dashboard-snapshot.js) with fields for map title, venue anchor, selected nearby nodes, optional corridor or locality emphasis, and a map state such as `default` or `fallback`. (AC: 1, 2, 3)
  - [x] Update [overall-departure-snapshot.js](/home/codexuser/bmad-6-workshop/src/features/dashboard/data/overall-departure-snapshot.js) to provide fixture-backed Royal Institution map data and a calm fallback variant without depending on live providers yet. (AC: 1, 2, 3)
  - [x] Update [dashboard-presenter.js](/home/codexuser/bmad-6-workshop/src/features/dashboard/presenters/dashboard-presenter.js) so components receive display-ready locality labels and fallback copy rather than raw map data. (AC: 1, 2, 3)
- [x] Implement a restrained fixed local-map component that reads as architectural framing rather than interactive cartography. (AC: 1, 2, 3)
  - [x] Add `src/features/dashboard/components/LocalMapFrame.tsx` to render the Royal Institution anchor, selected nearby nodes, and any minimal locality-emphasis treatment approved by the UX spec. (AC: 1, 2)
  - [x] Use simple in-app rendering primitives such as semantic HTML, SVG, and custom CSS for the map frame instead of introducing a mapping library or external tile dependency. (AC: 1, 2, 3)
  - [x] Support both the default framed-map view and the simplified fallback-map view so the screen remains spatially useful even when enrichment is unavailable. (AC: 1, 3)
- [x] Preserve calm hierarchy and anti-planner doctrine while adding locality cues. (AC: 1, 2, 3)
  - [x] Keep the map visually secondary to the atmospheric header while still making the Royal Institution anchor and nearby nodes easy to identify at close reading distance. (AC: 1, 2)
  - [x] Avoid generic citywide treatment, dense cartographic labeling, route lines, turn-by-turn cues, or any suggestion that the display can be explored like a map application. (AC: 1, 2)
  - [x] Use custom CSS only in [globals.css](/home/codexuser/bmad-6-workshop/src/app/globals.css) to create the framed-map treatment, restrained overlays, and fallback-state styling that fit the established public-display palette. (AC: 1, 2, 3)
- [x] Add tests that lock in the map contract, fallback behavior, and doctrine boundaries. (AC: 1, 2, 3)
  - [x] Extend [dashboard.presenter.test.mjs](/home/codexuser/bmad-6-workshop/tests/unit/dashboard.presenter.test.mjs) to cover approved local-map states, normalized node data, and presenter output for both normal and fallback map variants. (AC: 1, 2, 3)
  - [x] Extend [startup-smoke.test.mjs](/home/codexuser/bmad-6-workshop/tests/smoke/startup-smoke.test.mjs) so the public route is required to render the Royal Institution map anchor, selected locality cues, and a passive non-interactive map region. (AC: 1, 2)
  - [x] Keep tests compatible with the existing `npm run validate` gate and avoid brittle visual snapshot testing or browser-only map assumptions. (AC: 1, 2, 3)

## Dev Notes

### Developer Context

- Story 1.3 established the atmospheric-header-led dashboard shell and Story 1.4 replaced the nearby-mode placeholder with a real mode-summary field. Story 1.5 should complete the third core Epic 1 layout pillar by replacing the remaining map placeholder rather than restructuring the whole screen again.
- The current public screen already encodes the intended reading order:
  - atmospheric header first
  - nearby modes second
  - fixed local map third
- Scope discipline matters here:
  - Story 1.5 owns the fixed Royal Institution map and fallback-map behavior.
  - Story 1.6 owns real-device and venue-sized verification.
  - Epic 2 owns live refresh, trend, freshness escalation, degraded-source messaging, and stable update behavior under changing data.
- The product doctrine remains unchanged: one calm foyer instrument, not a route planner, transit board, kiosk, or exploratory city map.

### Technical Requirements

- Keep the implementation on the current fixture-backed, server-rendered-shell path. This story should not add:
  - `src/app/api/dashboard/route.ts`
  - provider adapters under `src/lib/server/providers/*`
  - TanStack Query hooks
  - polling timers
  - external map SDKs or tile-rendering packages
  - ops actions or degraded-source system banners
- Extend the shared dashboard snapshot contract instead of hardcoding map data inside UI components. At minimum, the `localMap` shape should support:
  - a stable map state (`default`, `fallback`)
  - venue anchor label for the Royal Institution
  - selected nearby nodes with stable keys and human-readable labels
  - optional locality-emphasis copy or corridor labels
  - concise fallback wording that keeps the screen useful if richer framing is unavailable
- The safest implementation path is an in-app fixed map surface using semantic markup plus SVG and CSS. Do not introduce Leaflet, MapLibre, Google Maps, or any equivalent dependency unless a later approved change explicitly requires it.
- Keep the map fact-only and locality-specific. The map should help people understand place, not recommend action. Avoid phrases or UI patterns that imply:
  - best route
  - recommended mode
  - turn-by-turn movement
  - selectable destinations
  - citywide exploration
- Fallback behavior must preserve a visible Royal Institution anchor and enough nearby context to remain useful. The fallback must degrade calmly rather than blanking the map area or exposing provider internals.

### Architecture Compliance

- Runtime baseline remains `Next.js 16.1.7` on `Node.js 24.x`.
- Public display UI stays under `src/features/dashboard/*`; route files compose features rather than containing feature logic.
- Shared contracts belong under `src/lib/contracts/*`.
- No component may call external providers directly.
- Styling remains custom CSS; do not introduce Tailwind, a UI kit, or a map library for this story.
- Preserve the architecture's feature boundaries:
  - UI components under `src/features/dashboard/components/*`
  - presenter logic under `src/features/dashboard/presenters/*`
  - fixture-backed story data under `src/features/dashboard/data/*`
  - shared contracts under `src/lib/contracts/*`
- Keep the public route non-interactive and separate from the hidden ops route.

### Library / Framework Requirements

- Use the repo's existing dependencies and versions:
  - `next` `16.1.7`
  - `react` `19.2.3`
  - `react-dom` `19.2.3`
  - `typescript` `^5`
  - `vitest` via the local compatibility package already wired into the repo
- Do not add new packages for map rendering, icons, state management, or visualization in this story.
- Latest technical sanity checks completed on 2026-03-18 against official sources:
  - Next.js documentation continues to position the App Router path as the standard way to build React applications with server and client rendering support: https://nextjs.org/docs/app
  - React documentation currently reflects the `19.2` release line and continues to present framework-based application development as the normal path: https://react.dev/
  - Node.js official release information continues to list `v24` as `Active LTS`, which aligns with the repo's runtime contract: https://nodejs.org/en/about/previous-releases
- No newer official guidance changes this story's plan because the correct move here is to use platform primitives for a fixed map frame, not to introduce an external mapping stack.

### File Structure Requirements

- Expected files to add or reshape:
  - [DashboardScreen.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/DashboardScreen.tsx)
  - `src/features/dashboard/components/LocalMapFrame.tsx`
  - [dashboard-presenter.js](/home/codexuser/bmad-6-workshop/src/features/dashboard/presenters/dashboard-presenter.js)
  - [overall-departure-snapshot.js](/home/codexuser/bmad-6-workshop/src/features/dashboard/data/overall-departure-snapshot.js)
  - [dashboard-snapshot.js](/home/codexuser/bmad-6-workshop/src/lib/contracts/dashboard-snapshot.js)
  - [globals.css](/home/codexuser/bmad-6-workshop/src/app/globals.css)
  - [dashboard.presenter.test.mjs](/home/codexuser/bmad-6-workshop/tests/unit/dashboard.presenter.test.mjs)
  - [startup-smoke.test.mjs](/home/codexuser/bmad-6-workshop/tests/smoke/startup-smoke.test.mjs)
- Existing files to preserve, not rework beyond what this story needs:
  - [page.tsx](/home/codexuser/bmad-6-workshop/src/app/(public)/page.tsx)
  - `src/features/dashboard/components/AtmosphericHeader.tsx`
  - `src/features/dashboard/components/ModeSummaryGrid.tsx`
- Keep naming aligned with the architecture:
  - React components in `PascalCase`
  - directories and non-component files in `kebab-case`
  - route files limited to composition

### Testing Requirements

- Minimum verification for implementation:
  - `npm run lint`
  - `npm run typecheck`
  - `npm test`
  - `npm run build`
- Unit tests should validate the shared contract and presenter output rather than visual snapshots.
- Smoke tests should assert:
  - the Royal Institution anchor appears on the public route
  - selected nearby locality cues or nodes render in the map area
  - the map remains passive and non-interactive
  - route-planner or exploration language does not appear
  - fallback-map copy or state handling preserves usable local context rather than leaving the map blank
- Keep testing honest about scope. Story 1.5 does not need to prove:
  - live polling or provider refresh
  - trend handling
  - per-signal freshness escalation
  - degraded-source alert choreography across the whole dashboard
  - real-device validation on venue-sized screens
- Those capabilities belong to Story 1.6 and Epic 2.

### Previous Story Intelligence

- From Story 1.4:
  - The dashboard route is now clearly split into three tiers: header, nearby modes, and reserved map area. Story 1.5 should fill the third tier without disturbing the first two.
  - The shared snapshot contract and presenter already carry the display doctrine and should be extended again rather than bypassed.
  - The public route remains intentionally passive; no interaction controls were introduced and none should appear now.
  - Tests already guard against route-planner language and public interactivity, so map work should extend those same constraints instead of inventing a separate quality bar.
- From Story 1.3:
  - The atmospheric header is the far-read thesis and should remain visually dominant.
  - The screen composition already reserves structural room for the local map, which is a direct handoff into this story.
- From Stories 1.1 and 1.2, carried forward into Story 1.3 and 1.4:
  - The ops route remains hidden and separate.
  - The repo already has a clear `npm run validate` gate and lightweight unit/smoke split.
  - The project baseline is intentionally minimal and should not be expanded with unnecessary UI or provider tooling.

### Git Intelligence Summary

- Recent commit `4499f97` implemented Story 1.4 by:
  - replacing the nearby-modes placeholder with real mode-summary components
  - extending the shared dashboard snapshot contract and presenter
  - preserving the map area as the final reserved lower-grid region for Story 1.5
  - expanding smoke and unit coverage around doctrine and passive public rendering
- Recent commit `f362a00` implemented Story 1.3 by:
  - creating the dashboard feature structure
  - introducing the dashboard snapshot contract and presenter
  - establishing the atmospheric-header-led shell and reserved lower-grid structure
- Story 1.5 should build directly on those patterns. The fastest safe path is to replace only the map placeholder, extend the same contract and fixture path, and keep the rest of the shell stable.

### Latest Tech Information

- Official-source checks on 2026-03-18 confirmed the current repo baseline remains sound for this story:
  - Next.js App Router remains the correct primary model for a server-rendered public route.
  - React remains on the `19.2` documentation line, and the repo's `19.2.3` version stays within the current major line.
  - Node.js `v24` is listed as `Active LTS`, so the repo's `24.x` engine contract is still a reasonable production target.
- Those checks support continuing with the current architecture rather than reworking runtime or dependency choices during Story 1.5.

### Project Structure Notes

- UX expects the map to feel architecturally framed rather than cartographic or exploratory.
- The map is a core bespoke public-display component, not a generic embedded map widget.
- The public display should still read in this order:
  - atmospheric header
  - nearby modes
  - fixed local map
- The map should explain locality once and then quietly support the rest of the departure picture.
- Avoid regressions toward:
  - dashboard density
  - route-planner behavior
  - interactive map conventions
  - citywide network sprawl
  - a blank or visibly broken map region when fallback is needed

### References

- `docs/epics.md#Story 1.5: Anchor the Display with a Fixed Local Map`
- `docs/prd.md#Executive Summary`
- `docs/prd.md#MVP - Minimum Viable Product`
- `docs/prd.md` sections on local spatial context, user journeys, and fixed-map scope
- `docs/ux-design-specification.md#Fixed Local Map Frame`
- `docs/ux-design-specification.md#Custom Components`
- `docs/ux-design-specification.md#Implementation Roadmap`
- `docs/ux-design-specification.md` sections on locality framing, component hierarchy, and anti-planner behavior
- `docs/architecture.md#Project Context Analysis`
- `docs/architecture.md#Frontend Architecture`
- `docs/architecture.md#Implementation Patterns & Consistency Rules`
- `docs/sprint-artifacts/1-3-render-the-overall-departure-picture.md`
- `docs/sprint-artifacts/1-4-show-nearby-mode-summaries-for-shared-reading.md`
- `src/app/(public)/page.tsx`
- `src/features/dashboard/components/DashboardScreen.tsx`
- `src/features/dashboard/presenters/dashboard-presenter.js`
- `src/features/dashboard/data/overall-departure-snapshot.js`
- `src/lib/contracts/dashboard-snapshot.js`
- `tests/smoke/startup-smoke.test.mjs`
- Official source checked 2026-03-18: `https://nextjs.org/docs/app`
- Official source checked 2026-03-18: `https://react.dev/`
- Official source checked 2026-03-18: `https://nodejs.org/en/about/previous-releases`

### Project Context Reference

- No `project-context.md` file exists in this repository at the time of story creation.
- If broader repository guardrails are needed later, run the BMAD `generate-project-context` workflow separately.

### Completion Status

- Story context assembled from Epic 1, the PRD, the UX specification, the architecture, the current dashboard code, sprint status, prior story artifacts, recent git history, and official framework/runtime references checked on 2026-03-18.
- Previous-story learnings were incorporated from Stories 1.1 through 1.4, especially route separation, the validation gate, the fixture-backed dashboard contract, and the reserved screen structure created for this story.
- The story is intentionally scoped to a fixed, non-interactive Royal Institution map plus calm fallback behavior only. Venue-sized verification, live updates, trend, freshness escalation, and degraded-source messaging remain outside Story 1.5.
- This story is ready for a dev agent to implement as the locality-anchoring layer of the Royal Institution departure picture.

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- `sed -n '1,260p' _bmad/bmm/agents/sm.md`
- `sed -n '1,260p' _bmad/core/tasks/workflow.xml`
- `sed -n '1,260p' _bmad/bmm/workflows/4-implementation/create-story/workflow.yaml`
- `sed -n '1,320p' _bmad/bmm/workflows/4-implementation/create-story/instructions.xml`
- `sed -n '1,260p' _bmad/bmm/workflows/4-implementation/create-story/template.md`
- `sed -n '1,260p' _bmad/bmm/workflows/4-implementation/create-story/checklist.md`
- `sed -n '230,330p' docs/epics.md`
- `sed -n '620,690p' docs/ux-design-specification.md`
- `sed -n '740,780p' docs/ux-design-specification.md`
- `sed -n '20,80p' docs/architecture.md`
- `sed -n '236,290p' docs/architecture.md`
- `sed -n '430,530p' docs/architecture.md`
- `sed -n '1,260p' docs/sprint-artifacts/1-4-show-nearby-mode-summaries-for-shared-reading.md`
- `sed -n '1,260p' docs/sprint-artifacts/1-3-render-the-overall-departure-picture.md`
- `sed -n '1,260p' src/features/dashboard/components/DashboardScreen.tsx`
- `sed -n '1,260p' src/features/dashboard/presenters/dashboard-presenter.js`
- `sed -n '1,260p' src/features/dashboard/data/overall-departure-snapshot.js`
- `sed -n '1,260p' src/lib/contracts/dashboard-snapshot.js`
- `sed -n '1,260p' tests/smoke/startup-smoke.test.mjs`
- `sed -n '1,260p' tests/unit/dashboard.presenter.test.mjs`
- `sed -n '1,260p' src/app/globals.css`
- `sed -n '1,220p' src/features/dashboard/components/ModeSummaryGrid.tsx`
- `sed -n '1,220p' src/features/dashboard/components/AtmosphericHeader.tsx`
- `sed -n '630,710p' docs/ux-design-specification.md`
- `sed -n '712,770p' docs/ux-design-specification.md`
- `node -e "import('./tests/unit/dashboard.presenter.test.mjs')"`
- `node --test --test-reporter=spec tests/smoke/startup-smoke.test.mjs`
- `npm run typecheck`
- `npm run validate`
- `git log --oneline -5`
- `git show --stat --oneline --summary 4499f97`
- `git show --stat --oneline --summary f362a00`

### Completion Notes List

- Created comprehensive story context for `1-5-anchor-the-display-with-a-fixed-local-map`.
- Scoped the story to fixed-map framing and fallback behavior only, excluding real-device validation, live refresh, trend, and broader degraded-state handling reserved for later stories.
- Added explicit guardrails around route thinness, dashboard feature boundaries, snapshot contract extension, passive public behavior, and in-app SVG/CSS rendering.
- Directed implementation away from map SDK churn and toward a calm, architecture-aligned fixed map surface that preserves locality without route-planner behavior.
- Carried forward learnings from Stories 1.1 through 1.4 plus recent git history so the dev agent inherits current repo conventions and layout sequencing.
- Replaced the reserved map placeholder with a dedicated `LocalMapFrame` component that keeps the route passive and preserves the header, modes, map reading order.
- Extended the shared dashboard snapshot contract, fixture data, and presenter with explicit `localMap` state, normalized venue and nearby-node markers, and calm fallback copy.
- Added custom SVG and CSS map framing that keeps the Royal Institution anchor legible, uses restrained locality cues, and supports both default and fallback map variants.
- Expanded unit and smoke coverage around fixed-map contract validation, fallback presentation, locality cues, and non-interactive doctrine boundaries.
- Code review fixed fallback-state gaps by requiring fallback copy in the snapshot contract, prioritizing fallback narrative in the rendered map intro, and simplifying the fallback graphic treatment.
- Ran `npm run validate` successfully after the review fixes and updated sprint tracking so the story is complete.

### Change Log

- 2026-03-18: Implemented Story 1.5 fixed local map frame, added fallback-aware map contract and presenter support, and extended unit/smoke validation coverage.
- 2026-03-18: Code review fixed fallback-state enforcement and simplified fallback map rendering, then re-ran the full validation gate.

### File List

- docs/sprint-artifacts/1-5-anchor-the-display-with-a-fixed-local-map.md
- docs/sprint-artifacts/sprint-status.yaml
- src/app/globals.css
- src/features/dashboard/components/DashboardScreen.tsx
- src/features/dashboard/components/LocalMapFrame.tsx
- src/features/dashboard/data/overall-departure-snapshot.js
- src/features/dashboard/presenters/dashboard-presenter.js
- src/lib/contracts/dashboard-snapshot.js
- tests/smoke/startup-smoke.test.mjs
- tests/unit/dashboard.presenter.test.mjs
