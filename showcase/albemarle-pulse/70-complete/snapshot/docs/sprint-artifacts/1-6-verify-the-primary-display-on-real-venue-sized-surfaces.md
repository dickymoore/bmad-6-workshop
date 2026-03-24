# Story 1.6: Verify the Primary Display on Real Venue-Sized Surfaces

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a venue operator,
I want the main display verified on the real laptop and supported desktop-sized layouts,
so that the public screen remains readable, calm, and usable in the actual venue context.

## Acceptance Criteria

1. Given the primary public display is implemented, when it is checked on the target laptop and display surface, then the main layout remains readable and coherent at the primary `1366px+` landscape target, and the room-scale and close-read hierarchy both remain intact.
2. Given height is constrained on the laptop or similar display surface, when the compact-height presentation is used, then the atmospheric header, mode summaries, and map still preserve reading order and calm hierarchy, and no critical information is pushed into an unusable or hidden state.
3. Given the display is viewed on a secondary desktop-sized layout around `1024px+`, when the public route adapts to that width, then the core departure picture remains usable and location-specific, and the design does not collapse into a mobile, touch-first, or route-planner pattern.
4. Given the implemented display is reviewed for UX verification obligations, when validation is run, then real-device display checks, contrast validation, and shared-readability expectations are represented directly in the work, and verification is not left implicit for a later phase.

## Tasks / Subtasks

- [x] Add explicit venue-sized responsive behavior to the existing public display without changing the product doctrine or route structure. (AC: 1, 2, 3)
  - [x] Keep [page.tsx](/home/codexuser/bmad-6-workshop/src/app/(public)/page.tsx) thin and continue composing the public route through `src/features/dashboard/*` rather than pushing verification logic into the route. (AC: 1, 2, 3)
  - [x] Update [DashboardScreen.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/DashboardScreen.tsx) and existing dashboard components only as needed to support stable display-first layout behavior at `1366px+`, compact-height fallback, and `1024px+` desktop adaptation. (AC: 1, 2, 3)
  - [x] Preserve one canonical public-screen composition: atmospheric header first, nearby modes second, fixed local map third; do not introduce alternate product modes, tabs, drawers, or mobile-first reflows. (AC: 1, 2, 3)
- [x] Implement CSS-level layout tuning for real venue-sized surfaces and constrained-height cases. (AC: 1, 2, 3)
  - [x] Extend [globals.css](/home/codexuser/bmad-6-workshop/src/app/globals.css) with display-first breakpoints for the primary `1366px+` landscape target, compact-height fallback, and a secondary desktop adaptation around `1024px+`. (AC: 1, 2, 3)
  - [x] Reduce support detail and spacing before reducing primary hierarchy so the far-read headline, mode-state labels, and local-map anchor remain legible under constrained height. (AC: 1, 2)
  - [x] Do not add a supported public MVP layout below `1024px`, and do not let the display collapse into stacked mobile cards, touch controls, or route-planner density. (AC: 3)
- [x] Verify public readability and calm shared interpretation directly in the codebase and artifact set. (AC: 1, 2, 3, 4)
  - [x] Extend [startup-smoke.test.mjs](/home/codexuser/bmad-6-workshop/tests/smoke/startup-smoke.test.mjs) to assert the public display still renders the atmospheric header, nearby-mode field, and fixed local map as the stable layout pillars. (AC: 1, 2, 3)
  - [x] Extend [dashboard.presenter.test.mjs](/home/codexuser/bmad-6-workshop/tests/unit/dashboard.presenter.test.mjs) only where presenter or copy changes are needed for compact-height or desktop adaptation support, while keeping fact-only doctrine intact. (AC: 2, 3)
  - [x] Add a concise verification artifact under `docs/sprint-artifacts/` capturing real-device checks, contrast review, and shared-readability observations so UX verification is explicit rather than implied. (AC: 4)
- [x] Validate accessibility and calm-display guardrails while preserving the current fixture-backed implementation scope. (AC: 2, 3, 4)
  - [x] Ensure status meaning still survives without color alone through wording, chip labels, and structural emphasis already present in the UI. (AC: 1, 4)
  - [x] Add or document reduced-motion-safe behavior for any existing visual transitions so meaning does not depend on motion. (AC: 4)
  - [x] Confirm contrast and typography remain suitable for room-scale reading and closer factual inspection using the current palette and hierarchy rather than adding a new theme system. (AC: 1, 4)
- [x] Keep the story scoped to venue-size verification and layout hardening, not to live-data or ops expansion. (AC: 1, 2, 3, 4)
  - [x] Do not add provider adapters, polling, TanStack Query hooks, route handlers, ops actions, or recovery tooling in this story. (AC: 1, 2, 3, 4)
  - [x] Do not introduce mobile-first navigation, interactivity, or planner-like affordances while validating the public display. (AC: 2, 3, 4)
  - [x] Keep all automated checks compatible with the existing `npm run validate` gate. (AC: 4)

## Dev Notes

### Developer Context

- Story 1.3 established the atmospheric-header-led public thesis.
- Story 1.4 made the nearby-mode field the close-read comparison layer.
- Story 1.5 completed the fixed local-map pillar and preserved the intended screen order.
- Story 1.6 should harden and verify that whole composition in the real operating context rather than redesigning it.
- Scope discipline matters here:
  - Story 1.6 owns venue-sized verification, compact-height handling, and supported desktop adaptation.
  - Epic 2 owns live refresh, trend, freshness escalation, degraded-source choreography, and stable update behavior under changing data.
  - Epic 3 owns operator readiness, diagnostics, and recovery tooling.
- The product doctrine remains unchanged: one calm, shared, venue-native, fact-only public instrument, not a route planner, kiosk, dashboard, or mobile app.

### Technical Requirements

- Keep the implementation on the current fixture-backed, server-rendered-shell path. This story should not add:
  - `src/app/api/dashboard/route.ts`
  - provider adapters under `src/lib/server/providers/*`
  - TanStack Query hooks
  - polling timers
  - ops actions or local-only recovery controls
  - mobile navigation patterns or touch affordances
- Verification must be explicit in both code and documentation. The minimum outcome is:
  - stable layout behavior at `1366px+`
  - compact-height fallback that preserves reading order and hierarchy
  - usable desktop adaptation around `1024px+`
  - direct evidence of real-device and contrast review
- Prefer CSS and existing component structure over architectural churn. The safest path is to preserve the current component boundaries and refine spacing, sizing, grid behavior, and support-text density.
- If support text must compress under constrained height, remove or shorten secondary copy before shrinking the main headline, state chips, mode labels, or Royal Institution anchor cues.
- Reduced-motion handling should remain truthful. If motion exists, the display must still communicate the same status and trust meaning when motion is reduced or absent.

### Architecture Compliance

- Runtime baseline remains `Next.js 16.1.7` on `Node.js 24.x`.
- Public display UI stays under `src/features/dashboard/*`; route files compose features rather than containing feature logic.
- Shared contracts belong under `src/lib/contracts/*`.
- Styling remains custom CSS; do not introduce Tailwind, a design system, or a breakpoint framework for this story.
- Preserve the architecture's feature boundaries:
  - UI components under `src/features/dashboard/components/*`
  - presenter logic under `src/features/dashboard/presenters/*`
  - fixture-backed story data under `src/features/dashboard/data/*`
  - shared contracts under `src/lib/contracts/*`
- Keep the public route passive and separate from the hidden ops route.

### Library / Framework Requirements

- Use the repo's existing dependencies and versions:
  - `next` `16.1.7`
  - `react` `19.2.3`
  - `react-dom` `19.2.3`
  - `typescript` `^5`
  - `vitest` via the local compatibility package already wired into the repo
- Do not add new packages for responsive utilities, component libraries, animation systems, browser automation, or visual-diff tooling in this story unless a later approved change requires them.
- Latest technical sanity checks completed on 2026-03-18 against official sources:
  - Next.js App Router documentation lists `16.1.7` as the latest version and continues to treat the App Router plus route handlers as the standard path for this architecture: https://nextjs.org/docs/app
  - React documentation currently shows the `19.2` line, which matches the repo's current React major version: https://react.dev/
  - Node.js official release information lists `v24.14.0` as the latest LTS on the releases page, which supports the repo's `24.x` runtime contract: https://nodejs.org/en/about/previous-releases
- No newer official guidance changes this story's plan because Story 1.6 is about layout hardening and verification, not about changing the runtime stack.

### File Structure Requirements

- Expected files to add or reshape:
  - [DashboardScreen.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/DashboardScreen.tsx)
  - [AtmosphericHeader.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/AtmosphericHeader.tsx)
  - [ModeSummaryGrid.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/ModeSummaryGrid.tsx)
  - [LocalMapFrame.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/LocalMapFrame.tsx)
  - [globals.css](/home/codexuser/bmad-6-workshop/src/app/globals.css)
  - [startup-smoke.test.mjs](/home/codexuser/bmad-6-workshop/tests/smoke/startup-smoke.test.mjs)
  - [dashboard.presenter.test.mjs](/home/codexuser/bmad-6-workshop/tests/unit/dashboard.presenter.test.mjs)
  - `docs/sprint-artifacts/1-6-display-verification-notes.md` or equivalent evidence artifact
- Existing files to preserve, not rework beyond what this story needs:
  - [page.tsx](/home/codexuser/bmad-6-workshop/src/app/(public)/page.tsx)
  - [dashboard-presenter.js](/home/codexuser/bmad-6-workshop/src/features/dashboard/presenters/dashboard-presenter.js)
  - [overall-departure-snapshot.js](/home/codexuser/bmad-6-workshop/src/features/dashboard/data/overall-departure-snapshot.js)
  - [dashboard-snapshot.js](/home/codexuser/bmad-6-workshop/src/lib/contracts/dashboard-snapshot.js)
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
- Automated tests should lock in doctrine and structure, not pretend to replace venue verification.
- Smoke tests should assert:
  - the public route still renders the atmospheric header, nearby mode field, and fixed local map
  - the public route remains passive and venue-specific
  - route-planner or recommendation language does not appear
  - the supported display pillars stay present through layout hardening
- Manual or documented verification must explicitly cover:
  - target laptop and venue-sized surface review
  - compact-height behavior
  - `1024px+` secondary desktop adaptation
  - contrast validation
  - reduced-motion review
  - shared readability for room-scale and close-up confirmation
- Keep testing honest about scope. Story 1.6 does not need to prove:
  - live polling or provider refresh
  - trend handling
  - per-signal freshness escalation
  - degraded-source orchestration across the full dashboard
  - ops recovery or maintenance-only routes
- Those capabilities belong to Epic 2 and Epic 3.

### Previous Story Intelligence

- From Story 1.5:
  - The local map is now a real fixed Royal Institution component, so Story 1.6 should verify that it stays spatially useful under constrained space rather than rethinking how the map works.
  - The lower grid now contains real mode summaries and a real map panel; layout regressions will affect shared reading immediately if the grid collapses badly.
  - Tests already guard against public interactivity and planner language; verification work should extend those same guardrails rather than inventing a separate doctrine.
- From Story 1.4:
  - The dashboard route is intentionally split into three tiers: atmospheric header, nearby modes, and map.
  - Group readability and plain-language support already matter for mode summaries and should remain protected during responsive tuning.
- From Story 1.3:
  - The atmospheric header is the room-scale thesis and must remain visually dominant even when height gets tighter.
- From Stories 1.1 and 1.2:
  - The public and ops routes remain separate.
  - The repo already uses a clear `npm run validate` gate and lightweight smoke/unit coverage.

### Git Intelligence Summary

- Recent commit `4aae924` implemented Story 1.5 by:
  - replacing the map placeholder with a real fixed local-map frame
  - extending the snapshot contract and presenter for map states
  - preserving the header, modes, map reading order
  - expanding tests around passive rendering and doctrine boundaries
- Recent commit `4499f97` implemented Story 1.4 by:
  - replacing the nearby-mode placeholder with real shared-reading summaries
  - extending the same contract and presenter path
  - reinforcing the lower-grid structure that Story 1.6 now needs to validate under real display constraints
- Recent commit `f362a00` implemented Story 1.3 by:
  - establishing the atmospheric-header-led dashboard shell
  - creating the current feature structure and overall departure presenter path
- Story 1.6 should build directly on those patterns. The fastest safe path is to harden CSS and component layout behavior, extend smoke coverage, and add explicit manual verification evidence without introducing new platform dependencies.

### Latest Tech Information

- Official-source checks on 2026-03-18 confirmed the current repo baseline remains sound for this story:
  - Next.js docs show App Router on `16.1.7`, which matches the repo baseline and keeps route-group composition aligned with the architecture.
  - React docs show `19.2`, which keeps the current component model on the active React line used by the repo.
  - Node.js releases list `v24.14.0` as the latest LTS, which supports the repo's `24.x` engine contract.
- These checks support keeping the runtime and component model stable while focusing this story on venue-sized verification and layout hardening.

### Project Structure Notes

- UX expects one canonical public-display layout, not multiple product modes.
- The supported layout pillars remain:
  - atmospheric header
  - nearby mode summaries
  - fixed local map
- Responsive behavior should compress and rebalance the same composition, not reinterpret it as a mobile page.
- Avoid regressions toward:
  - stacked mobile-card layouts
  - route-planner density
  - touch-first controls
  - hidden map or mode regions under constrained height
  - low-contrast or small-text compromises that break foyer readability

### References

- `docs/epics.md#Story 1.6: Verify the Primary Display on Real Venue-Sized Surfaces`
- `docs/prd.md#Success Criteria`
- `docs/prd.md#Measurable Outcomes`
- `docs/prd.md#MVP - Minimum Viable Product`
- `docs/prd.md` sections on display-first scope, orientation time, shared readability, and contrast or reduced-motion expectations
- `docs/ux-design-specification.md#Responsive Design & Accessibility`
- `docs/ux-design-specification.md#Responsive Strategy`
- `docs/ux-design-specification.md#Breakpoint Strategy`
- `docs/ux-design-specification.md#Testing Strategy`
- `docs/ux-design-specification.md#Implementation Guidelines`
- `docs/architecture.md#Frontend Architecture`
- `docs/architecture.md#Implementation Patterns & Consistency Rules`
- `docs/implementation-readiness-report-2026-03-18.md#UX Alignment Assessment`
- `docs/sprint-artifacts/1-3-render-the-overall-departure-picture.md`
- `docs/sprint-artifacts/1-4-show-nearby-mode-summaries-for-shared-reading.md`
- `docs/sprint-artifacts/1-5-anchor-the-display-with-a-fixed-local-map.md`
- `src/app/(public)/page.tsx`
- `src/features/dashboard/components/DashboardScreen.tsx`
- `src/features/dashboard/components/AtmosphericHeader.tsx`
- `src/features/dashboard/components/ModeSummaryGrid.tsx`
- `src/features/dashboard/components/LocalMapFrame.tsx`
- `src/app/globals.css`
- `tests/smoke/startup-smoke.test.mjs`
- `tests/unit/dashboard.presenter.test.mjs`
- Official source checked 2026-03-18: `https://nextjs.org/docs/app`
- Official source checked 2026-03-18: `https://react.dev/`
- Official source checked 2026-03-18: `https://nodejs.org/en/about/previous-releases`

### Project Context Reference

- No `project-context.md` file exists in this repository at the time of story creation.
- If broader repository guardrails are needed later, run the BMAD `generate-project-context` workflow separately.

### Completion Status

- Story context assembled from Epic 1, the PRD, the UX specification, the architecture, the implementation-readiness report, the current dashboard code, sprint status, prior story artifacts, recent git history, and official framework/runtime references checked on 2026-03-18.
- Previous-story learnings were incorporated from Stories 1.1 through 1.5, especially the stable route separation, validation gate, display-first component boundaries, and the completed three-part public layout.
- The story is intentionally scoped to venue-sized verification and responsive hardening only. Live refresh, trend, freshness escalation, degraded-source behavior, and ops recovery remain outside Story 1.6.
- This story is ready for a dev agent to implement as the public-display verification and layout-hardening pass for Epic 1.

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- `cat _bmad/bmm/config.yaml`
- `cat _bmad/core/tasks/workflow.xml`
- `cat _bmad/bmm/workflows/4-implementation/create-story/workflow.yaml`
- `cat _bmad/bmm/workflows/4-implementation/create-story/instructions.xml`
- `cat _bmad/bmm/workflows/4-implementation/create-story/template.md`
- `cat _bmad/bmm/workflows/4-implementation/create-story/checklist.md`
- `cat docs/sprint-artifacts/sprint-status.yaml`
- `cat docs/epics.md`
- `cat docs/architecture.md`
- `cat docs/sprint-artifacts/1-4-show-nearby-mode-summaries-for-shared-reading.md`
- `cat docs/sprint-artifacts/1-5-anchor-the-display-with-a-fixed-local-map.md`
- `cat src/features/dashboard/components/DashboardScreen.tsx`
- `cat src/features/dashboard/components/AtmosphericHeader.tsx`
- `cat src/features/dashboard/components/ModeSummaryGrid.tsx`
- `cat src/features/dashboard/components/LocalMapFrame.tsx`
- `cat src/features/dashboard/presenters/dashboard-presenter.js`
- `cat src/features/dashboard/data/overall-departure-snapshot.js`
- `cat src/lib/contracts/dashboard-snapshot.js`
- `cat src/app/globals.css`
- `cat tests/smoke/startup-smoke.test.mjs`
- `cat tests/unit/dashboard.presenter.test.mjs`
- `cat package.json`
- `rg -n "1366|1024|compact-height|real-device|contrast|reduced-motion|shared-readability|room-scale|close-read|venue-sized|desktop-sized|primary display|validation" docs/ux-design-specification.md docs/prd.md docs/architecture.md docs/validation-report-2026-03-18.md docs/implementation-readiness-report-2026-03-18.md`
- `sed -n '880,980p' docs/ux-design-specification.md`
- `sed -n '60,120p' docs/prd.md`
- `sed -n '220,290p' docs/implementation-readiness-report-2026-03-18.md`
- `sed -n '1,220p' 'src/app/(public)/page.tsx'`
- `git log --oneline -5`
- Official sources checked 2026-03-18:
  - `https://nextjs.org/docs/app`
  - `https://react.dev/`
  - `https://nodejs.org/en/about/previous-releases`

### Completion Notes List

- Created comprehensive story context for `1-6-verify-the-primary-display-on-real-venue-sized-surfaces`.
- Scoped the story to display-first responsive hardening and direct UX verification evidence, excluding live data, trend, freshness, degraded-source orchestration, and ops work.
- Added explicit guardrails for `1366px+` primary layout, compact-height fallback, and `1024px+` desktop adaptation.
- Directed implementation toward CSS and component-layout refinement rather than architectural churn or new dependencies.
- Required explicit verification evidence for real-device review, contrast validation, reduced-motion review, and shared readability so UX verification is not deferred.
- Added venue-sized layout hooks to `DashboardScreen.tsx` while keeping the public route passive and preserving the header, nearby modes, and fixed local map order.
- Hardened `src/app/globals.css` for `1366px+`, `1024px+`, and compact-height display behavior, compressing secondary support text before primary hierarchy.
- Added smoke coverage for venue-sized layout pillars and explicit verification evidence in `tests/smoke/startup-smoke.test.mjs`.
- Added `docs/sprint-artifacts/1-6-display-verification-notes.md` to capture real-device, contrast, reduced-motion, and shared-readability checks directly in the artifact set.
- Kept `tests/unit/dashboard.presenter.test.mjs` unchanged because no presenter or copy changes were required; existing unit coverage still passes.
- `npm run validate` passed after implementation.

### File List

- docs/sprint-artifacts/1-6-verify-the-primary-display-on-real-venue-sized-surfaces.md
- docs/sprint-artifacts/1-6-display-verification-notes.md
- docs/sprint-artifacts/sprint-status.yaml
- src/app/globals.css
- src/features/dashboard/components/DashboardScreen.tsx
- tests/smoke/startup-smoke.test.mjs

### Change Log

- 2026-03-18: Added venue-sized layout hardening, compact-height guardrails, smoke verification, and explicit display verification notes for Story 1.6.
- 2026-03-18: Senior code review fixed the 1024px desktop overflow trap, preserved compact-height trust and fallback cues, tightened smoke coverage, and validated the full `npm run validate` gate.

## Senior Developer Review (AI)

### Reviewer

Workshop

### Date

2026-03-18

### Outcome

Approve

### Findings

- Medium: `src/app/globals.css` forced `width: max(100%, 1024px)` on `.dashboard-shell`, which overflowed the supported `1024px+` desktop target once page padding was applied.
- Medium: `src/app/globals.css` hid fallback local-map context in the compact-height rules, which risked suppressing factual map explanation under constrained-height conditions.
- Medium: `src/app/globals.css` hid the second atmospheric-header footer cue in compact-height mode, weakening the “meaning not by color alone” guardrail during shared-read fallback conditions.
- Medium: `tests/smoke/startup-smoke.test.mjs` did not lock in either the 1024px overflow constraint or the requirement to preserve compact-height trust and fallback cues, so the regressions above were not covered.

### Fixes Applied

- Replaced the fixed-width desktop shell behavior with a centered `width: 100%` and `max-width` venue shell in `src/app/globals.css`.
- Kept compact-height footer trust cues and fallback local-map copy visible while compressing their typography and spacing in `src/app/globals.css`.
- Extended `tests/smoke/startup-smoke.test.mjs` to reject the old overflow rule and to reject compact-height selector patterns that would hide footer or fallback context.
- Updated `docs/sprint-artifacts/1-6-display-verification-notes.md` to record the corrected desktop-overflow and compact-height verification expectations.

### Validation

- `npm run validate`
