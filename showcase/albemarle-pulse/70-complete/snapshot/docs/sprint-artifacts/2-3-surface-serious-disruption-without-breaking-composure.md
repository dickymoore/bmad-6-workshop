# Story 2.3: Surface Serious Disruption Without Breaking Composure

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visitor,
I want serious disruption to be unmistakable,
so that I can recognize worsening conditions immediately without the display becoming chaotic.

## Acceptance Criteria

1. Given the overall departure state is disrupted or a core mode enters a disrupted state, when a visitor sees the display from across the foyer, then the seriousness of the disruption is immediately legible, and the visual language remains composed rather than alarmist.
2. Given a visitor moves closer to inspect the disruption, when they read the affected portions of the display, then they can understand which area is under strain, and the rest of the departure picture remains readable.
3. Given disruption visibility is reviewed against product doctrine, when the UI is assessed, then it remains fact-only, venue-native, and ambient before interactive, and it does not drift into operational-board or control-room behavior.

## Tasks / Subtasks

- [x] Extend the canonical dashboard snapshot and presenter so serious disruption is a first-class public-display concept instead of an accidental side effect of existing caution/disrupted labels. (AC: 1, 2, 3)
  - [x] Add explicit disruption emphasis fields to the shared dashboard contract in [dashboard-snapshot.js](/home/codexuser/bmad-6-workshop/src/lib/contracts/dashboard-snapshot.js) so the header and affected nearby modes can present unmistakable disruption without inventing route-local flags. (AC: 1, 2)
  - [x] Keep the contract fact-only, serializable, and backward-safe for the existing route, polling island, and presenter path. (AC: 1, 3)
  - [x] Model disruption scope precisely: overall-disrupted, locally-disrupted, and unaffected-readable must stay distinguishable so Story 2.3 does not collapse the whole picture when only one core mode is disrupted. (AC: 2)
- [x] Derive disruption emphasis in the server normalization path from live state evidence already available in the snapshot builder. (AC: 1, 2)
  - [x] Extend [build-dashboard-snapshot.js](/home/codexuser/bmad-6-workshop/src/lib/server/dashboard/build-dashboard-snapshot.js) so serious disruption is derived from the approved triggers only: overall state `disrupted` or any core nearby mode entering `disrupted`. (AC: 1)
  - [x] Keep Story 2.3 scoped to real service disruption visibility, not provider-failure, stale-feed, or unavailable-source choreography; those remain in Story 2.4. (AC: 1, 3)
  - [x] Preserve the current trust and trend semantics from Story 2.2 so disruption emphasis composes with them rather than replacing them. (AC: 1, 2)
- [x] Update the public UI so disruption is unmistakable at room scale and precise at close range without turning the screen into an alert surface. (AC: 1, 2, 3)
  - [x] Refine [AtmosphericHeader.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/AtmosphericHeader.tsx), [dashboard-presenter.js](/home/codexuser/bmad-6-workshop/src/features/dashboard/presenters/dashboard-presenter.js), and any adjacent dashboard shell components so the header carries a composed disruption emphasis when the overall picture is disrupted. (AC: 1, 3)
  - [x] Refine [ModeSummaryCard.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/ModeSummaryCard.tsx) and related dashboard components so a disrupted mode is easy to identify at closer range while unaffected modes remain legible and visually secondary rather than drowned by the disrupted state. (AC: 2)
  - [x] Use wording, iconography, spacing, and restrained structural emphasis to communicate severity; do not rely on color alone and do not add siren-like motion, warning banners, debug copy, or operational jargon. (AC: 1, 3)
  - [x] Preserve the established layout order and public-shell composition from Stories 1.6, 2.1, and 2.2: atmospheric header first, nearby modes second, fixed local map third, with no full-screen takeover. (AC: 1, 2, 3)
- [x] Lock the behavior in with automated coverage focused on interpretation and calmness, not just raw state fields. (AC: 1, 2, 3)
  - [x] Add unit coverage for disruption classification and presenter shaping so overall disruption and local mode disruption produce the correct emphasis without leaking advisory language. (AC: 1, 2, 3)
  - [x] Add component or smoke coverage proving the screen remains readable when one core mode is disrupted and that unaffected sections still render calmly. (AC: 2)
  - [x] Add coverage proving disruption cues do not introduce full-screen alert states, route-planner affordances, or ops-console terminology on the public route. (AC: 3)
  - [x] Keep the full verification path compatible with `npm run validate`. (AC: 1, 2, 3)

## Dev Notes

### Developer Context

- Story 2.1 established the live request-time public read path, canonical dashboard API, and calm currentness updates.
- Story 2.2 extended that path with trend, per-signal freshness, local confidence narrowing, and plain-language trust cues.
- Story 2.3 sits directly on top of that work. It must make serious disruption unmistakable without undoing the calm, shared-display behavior already established.
- Current repo shape already contains the main extension points for this story:
  - [build-dashboard-snapshot.js](/home/codexuser/bmad-6-workshop/src/lib/server/dashboard/build-dashboard-snapshot.js) derives overall state and mode state from live inputs
  - [dashboard-snapshot.js](/home/codexuser/bmad-6-workshop/src/lib/contracts/dashboard-snapshot.js) validates the canonical public contract
  - [dashboard-presenter.js](/home/codexuser/bmad-6-workshop/src/features/dashboard/presenters/dashboard-presenter.js) shapes the room-scale and close-read copy
  - [AtmosphericHeader.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/AtmosphericHeader.tsx) owns the main across-the-foyer read
  - [ModeSummaryCard.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/ModeSummaryCard.tsx) owns the close-read mode-level confirmation layer
- Scope discipline matters:
  - Story 2.3 owns unmistakable disruption visibility and composed emphasis.
  - Story 2.4 owns provider failure, unavailable-source handling, and honest usefulness when feeds degrade.
  - Story 2.5 owns broader stable live-reading behavior under motion and update pressure.

### Technical Requirements

- Treat serious disruption as a separate public-display concern from generic freshness or reduced-confidence.
  - The approved triggers are narrow: overall state `disrupted`, or any core nearby mode entering `disrupted`.
  - Do not infer serious disruption from stale data, missed refreshes, reduced-confidence signals, or trend alone.
- Build on the existing canonical snapshot and presenter path. Do not derive disruption emphasis ad hoc inside React component branches that bypass shared contracts.
- Preserve compatibility with the current live route:
  - [page.tsx](/home/codexuser/bmad-6-workshop/src/app/(public)/page.tsx)
  - [route.ts](/home/codexuser/bmad-6-workshop/src/app/api/dashboard/route.ts)
  - [useDashboardQuery.ts](/home/codexuser/bmad-6-workshop/src/features/dashboard/hooks/useDashboardQuery.ts)
- Keep disruption scope precise:
  - if the overall picture is disrupted, the header should carry the strongest room-scale emphasis
  - if one core mode is disrupted, that affected mode needs unmistakable close-read emphasis
  - unaffected modes, the local map, and any still-trustworthy parts of the display must remain readable
- Public wording must remain plain, factual, and non-prescriptive.
  - good direction: "Disrupted across the Royal Institution threshold", "Tube is disrupted nearby"
  - avoid: "critical incident", "emergency", "take buses instead", "best option", "reroute now"
- Do not turn this into degraded-source handling.
  - trust cues from Story 2.2 still apply
  - reduced-confidence and unavailable states still belong to Story 2.4 unless they are already present as supporting trust metadata
- The visual outcome must remain ambient before interactive:
  - no full-screen warning overlay
  - no pager/ticker behavior
  - no countdowns, flashing states, or high-frequency motion
  - no public remediation actions

### Architecture Compliance

- Runtime baseline in the repo remains:
  - `next` `16.1.7`
  - `react` `19.2.3`
  - `react-dom` `19.2.3`
  - `node` `24.x`
- Preserve architecture boundaries:
  - public UI in `src/features/dashboard/*`
  - route handlers in `src/app/api/*`
  - shared contracts in `src/lib/contracts/*`
  - server orchestration in `src/lib/server/*`
  - client fetch and query utilities in `src/lib/client/*`
- No public UI component may call providers directly or own disruption business rules that belong in the canonical snapshot builder.
- Keep the current pragmatic module mix:
  - React components in `.tsx`
  - contract, presenter, and server modules in `.js`
  - no broad migration work unless directly required for this story outcome
- Preserve the one-screen public-display shell. Disruption emphasis must fit inside the existing shell rather than creating a secondary alert mode.

### Library / Framework Requirements

- No new libraries are needed for Story 2.3. Extend the current stack already present in the repo:
  - `@tanstack/react-query` `^5.0.0`
  - `zod` `^4.3.6`
  - Next.js App Router with route handlers
- Latest official-source sanity checks completed on 2026-03-19:
  - Next.js App Router route-handler docs still support the existing `app/api/*/route.ts` internal API pattern: https://nextjs.org/docs/app/getting-started/route-handlers-and-middleware
  - React official docs show `react@19.2` and keep `'use client'` as the server/client boundary model for interactive dashboard islands: https://react.dev/reference/rsc/use-client
  - TanStack Query official docs still support `useQuery` polling options such as `refetchInterval` and `refetchIntervalInBackground`, which matches the existing live-refresh path: https://tanstack.com/query/latest/docs/framework/react/reference/useQuery
  - Node's official releases page lists `v24.14.0` as the latest LTS on 2026-03-19, which stays compatible with the repo's `24.x` contract: https://nodejs.org/en/about/previous-releases
  - Zod's official v4 docs remain the current validation line, matching the repo contract-validation approach: https://zod.dev/v4
- No latest-doc signal suggests changing the implementation direction for this story.

### File Structure Requirements

- Expected files to add or reshape:
  - [dashboard-snapshot.js](/home/codexuser/bmad-6-workshop/src/lib/contracts/dashboard-snapshot.js)
  - [build-dashboard-snapshot.js](/home/codexuser/bmad-6-workshop/src/lib/server/dashboard/build-dashboard-snapshot.js)
  - [dashboard-presenter.js](/home/codexuser/bmad-6-workshop/src/features/dashboard/presenters/dashboard-presenter.js)
  - [AtmosphericHeader.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/AtmosphericHeader.tsx)
  - [ModeSummaryCard.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/ModeSummaryCard.tsx)
  - [DashboardScreen.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/DashboardScreen.tsx) if needed to thread disruption emphasis through the existing shell
  - [dashboard.presenter.test.mjs](/home/codexuser/bmad-6-workshop/tests/unit/dashboard.presenter.test.mjs)
  - [dashboard.live-path.test.mjs](/home/codexuser/bmad-6-workshop/tests/unit/dashboard.live-path.test.mjs)
  - [startup-smoke.test.mjs](/home/codexuser/bmad-6-workshop/tests/smoke/startup-smoke.test.mjs)
- Existing files to preserve, not redesign beyond this story's needs:
  - [page.tsx](/home/codexuser/bmad-6-workshop/src/app/(public)/page.tsx)
  - [route.ts](/home/codexuser/bmad-6-workshop/src/app/api/dashboard/route.ts)
  - [ModeSummaryGrid.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/ModeSummaryGrid.tsx)
  - [LocalMapFrame.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/LocalMapFrame.tsx)
  - [freshness.js](/home/codexuser/bmad-6-workshop/src/lib/contracts/freshness.js) unless a small adjacent helper is genuinely needed
- Keep naming aligned with current repo conventions:
  - components in `PascalCase`
  - non-component modules in `kebab-case`
  - route files limited to request handling

### Testing Requirements

- Minimum verification for implementation:
  - `npm run lint`
  - `npm run typecheck`
  - `npm test`
  - `npm run build`
- Add targeted coverage for:
  - disruption classification from the live snapshot builder
  - presenter output for overall disruption versus one-mode disruption
  - header rendering that makes disruption room-scale visible without resorting to alarm copy
  - mode-card rendering that highlights the affected mode while preserving calm readability elsewhere
  - public-route stability while disruption cues update inside the same shell
- Tests must explicitly protect these behaviors:
  - disruption is unmistakable when the overall state or a core mode is disrupted
  - unaffected sections remain readable
  - no advisory or route-planning language leaks into disruption copy
  - no full-screen warning, shell takeover, or control-room behavior appears on the public route
- Keep testing honest about scope. Story 2.3 does not need to finish:
  - provider outage choreography
  - last-known-value fallback semantics
  - multiple-source degraded messaging
  - operator diagnostics or staff remediation actions
- Those concerns belong to Story 2.4 and Epic 3.

### Previous Story Intelligence

- From Story 2.2:
  - trend and trust semantics already exist and now shape the header and nearby modes
  - this story should compose with that work, not replace it with a new alert system
  - plain-language trust copy and local confidence narrowing are already guarded by tests and should stay intact
- From Story 2.1:
  - the public shell already supports live updates without full-screen redraw
  - request-time first paint and the same-origin dashboard API are in place and should remain unchanged
- From Story 1.6:
  - venue-sized verification already established the header, nearby modes, and local map as stable hierarchy pillars
  - disruption emphasis must strengthen that hierarchy, not reshuffle it
- From Story 1.4:
  - nearby mode cards are already the right close-read place for local viability information
  - one disrupted mode should become unmistakable there without turning the grid into a dense live board
- From Story 1.3:
  - the atmospheric header is the correct location for the strongest overall departure-state signal

### Git Intelligence Summary

- Recent commit `c67b394` implemented Story 2.2 and already hardened the live path around trend, trust, and local confidence narrowing.
- Recent commit `c8f7dfa` implemented Story 2.1 and established the request-time live dashboard path, same-origin API, and polling island.
- The repo pattern is consistent:
  - derive live meaning in server modules
  - validate it in shared contracts
  - shape it once in the presenter
  - keep UI components thin and display-focused
- Story 2.3 should follow that same path instead of introducing a parallel disruption-only view model or a route-local alert layer.

### Latest Tech Information

- Official-source checks on 2026-03-19 confirm the approved technical path remains current:
  - Next.js App Router route handlers remain the correct internal API pattern for the dashboard endpoint.
  - React's current `19.2` docs keep `'use client'` as the correct boundary for the existing live polling island.
  - TanStack Query's current React docs still support the polling configuration already used in this repo.
  - Node `24.14.0` is listed as the latest LTS on 2026-03-19, consistent with the repo's `24.x` engine contract.
  - Zod v4 remains the active validation line.
- Inference: because Story 2.3 is a presentation-and-contract refinement on top of the existing stack, the latest-doc check supports staying on the current architecture instead of introducing new libraries or transport mechanisms.

### Project Structure Notes

- The current repo already has the core ingredients for disruption visibility, but the emphasis is still mostly generic:
  - overall state headlines exist
  - disrupted mode states exist
  - trust and trend cues exist
  - explicit composed disruption emphasis does not yet exist as a dedicated public-display concept
- Preserve one canonical public-display surface. Do not add side panels, emergency drawers, alternate routes, or diagnostic overlays.
- Avoid regressions toward:
  - alert-console behavior
  - dense incident-board language
  - color-only severity communication
  - overpowering the unaffected parts of the screen when one area is disrupted
  - mixing feed-degradation messaging into true service-disruption emphasis

### References

- `docs/epics.md#Story 2.3: Surface Serious Disruption Without Breaking Composure`
- `docs/prd.md` sections covering FR18, NFR11, NFR15, and the calm disruption doctrine
- `docs/ux-design-specification.md#Atmospheric Header`
- `docs/ux-design-specification.md#Mode Summary Block`
- `docs/ux-design-specification.md#Freshness / Trust Cue`
- `docs/ux-design-specification.md#Degraded-Source Confirmation`
- `docs/ux-design-specification.md` sections covering honest composure under worsening conditions and trust narrowing without alarmism
- `docs/architecture.md` sections covering explicit state modeling, public UI component boundaries, live display behavior, and calm degraded-state handling
- [2-1-keep-the-departure-picture-current-during-normal-operation.md](/home/codexuser/bmad-6-workshop/docs/sprint-artifacts/2-1-keep-the-departure-picture-current-during-normal-operation.md)
- [2-2-show-trend-and-freshness-where-confidence-matters.md](/home/codexuser/bmad-6-workshop/docs/sprint-artifacts/2-2-show-trend-and-freshness-where-confidence-matters.md)
- [page.tsx](/home/codexuser/bmad-6-workshop/src/app/(public)/page.tsx)
- [route.ts](/home/codexuser/bmad-6-workshop/src/app/api/dashboard/route.ts)
- [dashboard-snapshot.js](/home/codexuser/bmad-6-workshop/src/lib/contracts/dashboard-snapshot.js)
- [build-dashboard-snapshot.js](/home/codexuser/bmad-6-workshop/src/lib/server/dashboard/build-dashboard-snapshot.js)
- [dashboard-presenter.js](/home/codexuser/bmad-6-workshop/src/features/dashboard/presenters/dashboard-presenter.js)
- [AtmosphericHeader.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/AtmosphericHeader.tsx)
- [ModeSummaryCard.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/ModeSummaryCard.tsx)
- [dashboard.live-path.test.mjs](/home/codexuser/bmad-6-workshop/tests/unit/dashboard.live-path.test.mjs)
- [dashboard.presenter.test.mjs](/home/codexuser/bmad-6-workshop/tests/unit/dashboard.presenter.test.mjs)
- [startup-smoke.test.mjs](/home/codexuser/bmad-6-workshop/tests/smoke/startup-smoke.test.mjs)
- Official source checked 2026-03-19: `https://nextjs.org/docs/app/getting-started/route-handlers-and-middleware`
- Official source checked 2026-03-19: `https://react.dev/reference/rsc/use-client`
- Official source checked 2026-03-19: `https://tanstack.com/query/latest/docs/framework/react/reference/useQuery`
- Official source checked 2026-03-19: `https://nodejs.org/en/about/previous-releases`
- Official source checked 2026-03-19: `https://zod.dev/v4`

### Project Context Reference

- No `project-context.md` file exists in this repository at the time of story creation.
- If broader repository guardrails are needed later, run the BMAD `generate-project-context` workflow separately.

### Completion Status

- Story context assembled from Epic 2, the PRD, the UX specification, the architecture, the current sprint status, Stories 2.1 and 2.2, the current live dashboard code, recent git history, and official framework/runtime documentation checked on 2026-03-19.
- The story is scoped to unmistakable but composed disruption visibility for the public display.
- Provider-failure choreography, unavailable-source handling, and broader degraded usefulness remain intentionally reserved for Story 2.4.
- This story is ready for a dev agent to implement as the disruption-visibility layer immediately after Story 2.2.

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- `cat _bmad/bmm/config.yaml`
- `cat _bmad/core/tasks/workflow.xml`
- `cat _bmad/bmm/workflows/4-implementation/create-story/workflow.yaml`
- `cat _bmad/bmm/workflows/4-implementation/create-story/instructions.xml`
- `cat docs/epics.md`
- `cat docs/architecture.md`
- `cat docs/prd.md`
- `cat docs/ux-design-specification.md`
- `cat docs/sprint-artifacts/sprint-status.yaml`
- `cat docs/sprint-artifacts/2-1-keep-the-departure-picture-current-during-normal-operation.md`
- `cat docs/sprint-artifacts/2-2-show-trend-and-freshness-where-confidence-matters.md`
- `git log --oneline -5`
- `git status --short`
- `sed -n '1,260p' package.json`
- `sed -n '1,320p' src/lib/contracts/dashboard-snapshot.js`
- `sed -n '1,320p' src/lib/contracts/freshness.js`
- `sed -n '1,320p' src/lib/server/dashboard/build-dashboard-snapshot.js`
- `sed -n '1,320p' src/features/dashboard/presenters/dashboard-presenter.js`
- `sed -n '1,260p' src/features/dashboard/components/AtmosphericHeader.tsx`
- `sed -n '1,260p' src/features/dashboard/components/ModeSummaryCard.tsx`
- `cat _bmad/bmm/workflows/4-implementation/dev-story/workflow.yaml`
- `cat _bmad/bmm/workflows/4-implementation/dev-story/instructions.xml`
- `cat _bmad/bmm/workflows/4-implementation/dev-story/checklist.md`
- `cat docs/sprint-artifacts/2-3-surface-serious-disruption-without-breaking-composure.md`
- `cat package.json`
- `cat src/lib/contracts/dashboard-snapshot.js`
- `cat src/lib/server/dashboard/build-dashboard-snapshot.js`
- `cat src/features/dashboard/data/overall-departure-snapshot.js`
- `cat src/features/dashboard/presenters/dashboard-presenter.js`
- `cat src/features/dashboard/components/AtmosphericHeader.tsx`
- `cat src/features/dashboard/components/DashboardScreen.tsx`
- `cat src/features/dashboard/components/ModeSummaryCard.tsx`
- `cat src/features/dashboard/components/ModeSummaryGrid.tsx`
- `cat src/app/globals.css`
- `cat tests/unit/dashboard.presenter.test.mjs`
- `cat tests/unit/dashboard.live-path.test.mjs`
- `cat tests/smoke/startup-smoke.test.mjs`
- `npm run test:unit -- tests/unit/dashboard.presenter.test.mjs tests/unit/dashboard.live-path.test.mjs`
- `npm run validate`

### Implementation Notes

- Added canonical `disruptionEmphasis` and per-mode `disruptionScope` modeling in the dashboard snapshot contract with backward-safe defaults for persisted snapshots.
- Derived serious disruption only from approved service-state triggers in the snapshot builder and preserved existing trend and trust semantics from Story 2.2.
- Shaped one presenter-level disruption view model and threaded it through the atmospheric header and nearby mode cards so severity is structural, factual, and non-operational.
- Neutralized fixture baseline disruption so Story 2.3 emphasis reflects explicit disruption evidence instead of inherited placeholder severity.
- Extended unit and smoke coverage to protect calm disruption copy, unaffected readability, and the absence of alert-surface or ops-console behavior.

### Completion Notes List

- Implemented first-class disruption emphasis in the canonical snapshot, live snapshot builder, fixture snapshot, and presenter so overall and local disruption remain distinguishable without ad hoc component logic.
- Updated the atmospheric header, nearby mode cards, shell typing, and venue-display styling to surface composed disruption cues without full-screen takeover, advisory copy, or operational jargon.
- Added unit and smoke coverage for disruption derivation, presenter shaping, calm readability, and the absence of route-planner or alert-surface behavior.
- Verified the complete story gate with `npm run validate`.
- Updated story and sprint tracking so Story 2.3 is now marked `review`.

### File List

- `docs/sprint-artifacts/2-3-surface-serious-disruption-without-breaking-composure.md`
- `docs/sprint-artifacts/sprint-status.yaml`
- `src/lib/contracts/dashboard-snapshot.js`
- `src/lib/server/dashboard/build-dashboard-snapshot.js`
- `src/features/dashboard/data/overall-departure-snapshot.js`
- `src/features/dashboard/presenters/dashboard-presenter.js`
- `src/features/dashboard/components/AtmosphericHeader.tsx`
- `src/features/dashboard/components/DashboardScreen.tsx`
- `src/features/dashboard/components/ModeSummaryCard.tsx`
- `src/features/dashboard/components/ModeSummaryGrid.tsx`
- `src/app/globals.css`
- `tests/unit/dashboard.live-path.test.mjs`
- `tests/unit/dashboard.presenter.test.mjs`
- `tests/smoke/startup-smoke.test.mjs`

### Change Log

- 2026-03-19: Implemented Story 2.3 disruption emphasis across the canonical contract, live snapshot builder, presenter, public UI, and automated coverage; validated with `npm run validate`.
- 2026-03-19: Senior dev review closed the remaining verification gaps around backward-safe disruption defaults, non-disruption stale/degraded evidence, and real component wiring; revalidated with `npm run validate`.

### Senior Developer Review (AI)

- Reviewer: Workshop
- Date: 2026-03-19
- Outcome: Approve
- Findings fixed:
  - `tests/unit/dashboard.presenter.test.mjs`: added regression coverage for backward-safe disruption defaults so legacy snapshots without explicit `disruptionEmphasis` and `disruptionScope` still normalize correctly.
  - `tests/unit/dashboard.live-path.test.mjs`: added regression coverage proving stale or reduced-confidence live evidence does not get promoted into serious disruption when no approved disruption trigger is present.
  - `tests/unit/dashboard.presenter.test.mjs`: strengthened screen-level verification by binding presenter semantics to the real public screen/header/card component sources instead of relying only on broader smoke regex checks.
- Validation:
  - `npm run validate`
