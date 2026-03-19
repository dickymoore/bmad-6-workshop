# Story 2.5: Maintain Stable Live Reading During Updates and Motion Changes

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visitor,
I want live updates to preserve the same reading order and meaning,
so that I can continue reading the display comfortably even as conditions change.

## Acceptance Criteria

1. Given the display is already visible to visitors, when background updates occur, then the section order, reading hierarchy, and main layout remain stable, and visitors do not lose their place while reading.
2. Given the screen is operating in a reduced-motion or low-motion context, when live updates, trend changes, or degraded states occur, then the meaning of those changes remains fully understandable, and no critical interpretation depends on animation.
3. Given live-update behavior is verified directly, when the implemented display is checked on the target device and supported browser contexts, then calm live updates, reduced-motion-safe meaning, and stable trust signaling are tested explicitly, and UX verification is represented directly rather than assumed.

## Tasks / Subtasks

- [x] Harden the live refresh path so data updates change content inside the existing public shell instead of reordering or remounting key reading zones. (AC: 1)
  - [x] Keep the canonical section order fixed in [DashboardScreen.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/DashboardScreen.tsx): atmospheric header first, nearby modes second, fixed local map third, with no alternate live-update layout branch. (AC: 1)
  - [x] Refine [DashboardLiveScreen.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/DashboardLiveScreen.tsx) and [useDashboardQuery.ts](/home/codexuser/bmad-6-workshop/src/features/dashboard/hooks/useDashboardQuery.ts) so polling updates preserve the current shell, avoid first-load-style reset behavior after hydration, and keep background refresh behavior calm in the controlled venue browser. (AC: 1)
  - [x] Preserve stable mode ordering and stable React keys across update cycles in [dashboard-presenter.js](/home/codexuser/bmad-6-workshop/src/features/dashboard/presenters/dashboard-presenter.js) and [ModeSummaryGrid.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/ModeSummaryGrid.tsx) so visitors are not forced to rescan because cards reshuffle when trust or trend changes. (AC: 1)
- [x] Make update meaning explicit without relying on motion. (AC: 1, 2)
  - [x] Thread a lightweight, fact-only "what changed" layer through the presenter and header or mode components so trend, freshness, and degraded-source changes remain legible through wording and structural emphasis even if transitions are absent. (AC: 1, 2)
  - [x] Refine [AtmosphericHeader.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/AtmosphericHeader.tsx), [ModeSummaryCard.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/ModeSummaryCard.tsx), and [LocalMapFrame.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/LocalMapFrame.tsx) so updates read as calm continuity rather than flashing novelty, countdowns, or alert-surface behavior. (AC: 1, 2)
  - [x] Keep any live-region or announcement behavior narrowly scoped to meaningful currentness or trust updates and prevent repeated chatter that would make the public screen feel like an ops console. (AC: 1, 2)
- [x] Strengthen CSS-level motion guardrails and layout stability for live updates. (AC: 1, 2)
  - [x] Update [globals.css](/home/codexuser/bmad-6-workshop/src/app/globals.css) so any transition used for trend, trust, disruption, or map-state changes completes within the calm-motion envelope and does not shift the major layout pillars. (AC: 1, 2)
  - [x] Extend the existing `prefers-reduced-motion: reduce` handling so update meaning is preserved through copy, contrast, and structural emphasis rather than animation timing. (AC: 2)
  - [x] Avoid adding animation libraries, marquee behavior, auto-scrolling, blinking badges, or spinner-based refresh affordances. (AC: 1, 2)
- [x] Add explicit verification for stable live reading and reduced-motion-safe meaning. (AC: 2, 3)
  - [x] Add unit or presenter coverage proving stable ordering of header, nearby modes, and map context plus stable nearby-mode ordering across representative snapshot changes. (AC: 1)
  - [x] Add live-path or component coverage proving background refreshes preserve the existing public shell and do not degrade into first-load placeholders or full-screen reset behavior. (AC: 1)
  - [x] Extend [startup-smoke.test.mjs](/home/codexuser/bmad-6-workshop/tests/smoke/startup-smoke.test.mjs) to assert reduced-motion-safe CSS, stable reading-order hooks, and non-alerting live-update posture remain present in the public route. (AC: 2)
  - [x] Add a new verification note artifact, likely [2-5-live-reading-verification-notes.md](/home/codexuser/bmad-6-workshop/docs/sprint-artifacts/2-5-live-reading-verification-notes.md), capturing target-device review, supported desktop browser review, reduced-motion checks, and calm-update observations explicitly. (AC: 3)
  - [x] Keep the full verification path compatible with `npm run validate`. (AC: 1, 2, 3)

## Dev Notes

### Developer Context

- Story 1.6 already locked the canonical display structure and CSS breakpoints:
  - atmospheric header first
  - nearby modes second
  - fixed local map third
  - explicit `1366px+`, compact-height, and `1024px+` desktop adaptation rules
- Story 2.1 introduced the request-time live dashboard route and polling boundary through [DashboardLiveScreen.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/DashboardLiveScreen.tsx) and [useDashboardQuery.ts](/home/codexuser/bmad-6-workshop/src/features/dashboard/hooks/useDashboardQuery.ts), but it intentionally stopped short of wider motion or reading-stability guardrails.
- Story 2.2 added trend and freshness meaning. Story 2.3 added calm disruption emphasis. Story 2.4 added localized provider-failure trust narrowing. Story 2.5 must make those changing states readable over time without causing visitors to lose their place.
- Current repo seams most relevant to this story:
  - [DashboardScreen.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/DashboardScreen.tsx) already encodes the intended reading order and should remain the single shell owner.
  - [DashboardLiveScreen.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/DashboardLiveScreen.tsx) currently swaps in fresh query data directly; this is the likely seam for update-stability refinement.
  - [useDashboardQuery.ts](/home/codexuser/bmad-6-workshop/src/features/dashboard/hooks/useDashboardQuery.ts) currently uses `refetchInterval` but not `refetchIntervalInBackground`; this story should decide deliberately whether the venue browser should continue calm background polling.
  - [dashboard-presenter.js](/home/codexuser/bmad-6-workshop/src/features/dashboard/presenters/dashboard-presenter.js) already centralizes public wording and should stay the only place where update meaning is derived.
  - [AtmosphericHeader.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/AtmosphericHeader.tsx) already exposes a polite live region on the currentness line, so announcement behavior must be tightened carefully instead of duplicated elsewhere.
  - [globals.css](/home/codexuser/bmad-6-workshop/src/app/globals.css) already contains reduced-motion handling from Story 1.6; this story extends that rule from generic compliance to live-update-specific meaning preservation.
- Scope discipline matters:
  - Story 2.4 owns truthful degradation during provider failure.
  - Story 2.5 owns reading continuity during change, including trend shifts, trust changes, and reduced-motion-safe comprehension.
  - Epic 3 owns ops-facing restart, recovery, and maintenance behavior.

### Technical Requirements

- Preserve one canonical public-display shell during updates.
  - do not replace the page with a loading takeover after hydration
  - do not reorder header, mode summaries, or map when fresh data lands
  - do not remount cards in a way that resets the viewer's reading scan unless the underlying mode set truly changes
- Stable reading matters more than visual drama.
  - no blinking, pulsing alerts, countdowns, or animated state badges
  - no auto-scrolling, carousel rotation, or marquee treatment
  - any transition that remains must feel absorbed into the screen and complete within the NFR envelope
- Preserve meaning without motion.
  - trend, freshness, disruption, and degraded trust must remain understandable through wording, iconography, contrast, and structural emphasis alone
  - reduced-motion behavior must not hide the fact that a section became stale, worsened, or recovered
  - live updates should remain calm, not silent to the point of ambiguity
- Keep update semantics canonical.
  - derive update labels and any changed-state comparison from the existing snapshot or presenter path, not ad hoc component-local heuristics
  - preserve stable mode order using canonical mode keys already present in the snapshot
  - do not let provider-failure source status from Story 2.4 masquerade as service disruption from Story 2.3
- Keep the public route passive and fact-only.
  - no manual refresh control on the public screen
  - no provider names, retry language, or technical event feed
  - no advisory wording that tells visitors which mode to take

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
  - client query utilities in `src/lib/client/*` and `src/lib/vendor/*`
  - server snapshot orchestration in `src/lib/server/*`
- Do not move update-state logic into route files or introduce direct provider access in components.
- Keep the public shell server-rendered with selective client behavior for the live island; do not turn the whole route into a client-owned dashboard app.
- Preserve the modular-monolith structure and same-origin API posture already established in earlier stories.

### Library / Framework Requirements

- No new libraries are required for Story 2.5. Extend the current stack already in the repo:
  - `@tanstack/react-query` `^5.0.0`
  - `zod` `^4.3.6`
  - Next.js App Router with route handlers
- Latest official-source sanity checks completed on 2026-03-19:
  - Next.js App Router docs list `16.2.0` as the latest version, keeping the repo's `16.1.7` baseline on the current major path: https://nextjs.org/docs/app/getting-started
  - Next.js route-handler docs still confirm `app/**/route.ts` is the correct request-handler convention and that route handlers are not cached by default: https://nextjs.org/docs/app/getting-started/route-handlers
  - React's official `'use client'` docs still require serializable values across the server/client boundary, which matters if update-comparison metadata is passed into the live client island: https://react.dev/reference/rsc/use-client
  - TanStack Query's current `useQuery` docs still support both `refetchInterval` and `refetchIntervalInBackground`, which are the relevant polling controls for venue-browser update behavior: https://tanstack.com/query/latest/docs/framework/react/reference/useQuery
  - Node's official releases page lists `v24.14.0` as the latest LTS on 2026-03-19, consistent with the repo's `24.x` engine contract: https://nodejs.org/en/about/previous-releases
  - Zod's official docs still present Zod 4 as the stable validation line, matching the architecture requirement for shared schema validation: https://zod.dev/
- No latest-doc signal suggests changing the repo's current architecture direction for this story.

### File Structure Requirements

- Expected files to add or reshape:
  - [DashboardScreen.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/DashboardScreen.tsx)
  - [DashboardLiveScreen.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/DashboardLiveScreen.tsx)
  - [useDashboardQuery.ts](/home/codexuser/bmad-6-workshop/src/features/dashboard/hooks/useDashboardQuery.ts)
  - [dashboard-presenter.js](/home/codexuser/bmad-6-workshop/src/features/dashboard/presenters/dashboard-presenter.js)
  - [AtmosphericHeader.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/AtmosphericHeader.tsx)
  - [ModeSummaryGrid.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/ModeSummaryGrid.tsx)
  - [ModeSummaryCard.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/ModeSummaryCard.tsx)
  - [LocalMapFrame.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/LocalMapFrame.tsx)
  - [globals.css](/home/codexuser/bmad-6-workshop/src/app/globals.css)
  - [dashboard.presenter.test.mjs](/home/codexuser/bmad-6-workshop/tests/unit/dashboard.presenter.test.mjs)
  - a new live-update-focused unit or component test under [tests/unit](/home/codexuser/bmad-6-workshop/tests/unit)
  - [startup-smoke.test.mjs](/home/codexuser/bmad-6-workshop/tests/smoke/startup-smoke.test.mjs)
  - [2-5-live-reading-verification-notes.md](/home/codexuser/bmad-6-workshop/docs/sprint-artifacts/2-5-live-reading-verification-notes.md)
- Existing files to preserve, not redesign beyond this story's needs:
  - [page.tsx](/home/codexuser/bmad-6-workshop/src/app/(public)/page.tsx)
  - [route.ts](/home/codexuser/bmad-6-workshop/src/app/api/dashboard/route.ts)
  - [dashboard-snapshot.js](/home/codexuser/bmad-6-workshop/src/lib/contracts/dashboard-snapshot.js)
  - [dashboard-service.js](/home/codexuser/bmad-6-workshop/src/lib/server/dashboard/dashboard-service.js)
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
  - stable reading order and stable section ownership in the public shell
  - stable nearby-mode ordering across trend, trust, and degraded-state changes
  - live refresh behavior that preserves existing content instead of dropping back to initial placeholders
  - reduced-motion-safe status and trust meaning when transitions are suppressed
  - limited, non-repetitive live-region messaging for meaningful currentness or trust changes
  - explicit artifact evidence for target-device and supported-browser validation
- Tests must explicitly protect these behaviors:
  - background updates do not trigger a full-screen redraw
  - the public layout pillars remain header, modes, then map
  - trend and trust changes remain understandable without animation
  - provider degradation remains localized and calm during live change
  - the public route does not devolve into an alert feed, ticker, or ops console
- Keep testing honest about scope. Story 2.5 does not need to finish:
  - venue-operator recovery workflows from Epic 3
  - new provider integrations
  - mobile or touch-first layouts below the supported `1024px+` range

### Previous Story Intelligence

- From Story 1.6:
  - the stable venue-sized layout pillars and reduced-motion CSS baseline already exist and must not be regressed
  - explicit verification artifacts were accepted as the right place to capture real-device review
- From Story 2.1:
  - request-time live rendering and polling already exist, so Story 2.5 should refine continuity rather than invent a new live-update architecture
- From Story 2.2:
  - trend and freshness cues already exist, but broader live-reading continuity under change was intentionally left for this story
- From Story 2.3:
  - disruption emphasis must remain calm and structural, not animated or alarm-like
- From Story 2.4:
  - localized provider-failure trust narrowing already exists; Story 2.5 should make those localized state changes easier to keep reading through over time

### Git Intelligence Summary

- Recent commit `7c59d10` implemented Story 2.4 and kept the established pattern:
  - derive meaning once in server or presenter modules
  - preserve the stable public shell
  - validate behavior through targeted unit and smoke tests
- Recent commits `5560765`, `c67b394`, and `c8f7dfa` show the Epic 2 direction clearly:
  - change meaning inside the existing layout rather than redesigning the route
  - keep public copy calm and fact-only
  - prefer structural emphasis and contract-driven state over ad hoc component logic
- Story 2.5 should follow the same pattern and resist introducing animation-first solutions or extra UI modes.

### Latest Tech Information

- Official-source checks on 2026-03-19 confirm the approved technical path remains current:
  - Next.js App Router and route handlers remain the right server-rendered-shell and internal API model for this repo.
  - React still requires serializable values across the server/client boundary for the live client island.
  - TanStack Query still exposes the polling controls needed for calm venue-browser refresh behavior.
  - Node `24.14.0` is the latest LTS listed on 2026-03-19 and stays compatible with the repo's `24.x` contract.
  - Zod 4 remains the active validation line.
- Inference: Story 2.5 should stay inside the current stack and improve update choreography, motion guardrails, and verification depth rather than introducing new state or animation tooling.

### Project Structure Notes

- The repo already contains the key structural prerequisites for this story:
  - one canonical public shell
  - a dedicated live client boundary
  - presenter-owned public wording
  - existing reduced-motion CSS
  - smoke coverage that already watches for venue-sized layout regressions
- What is still missing is a canonical way to prove that live updates preserve reading continuity and remain understandable when motion is reduced.
- Avoid regressions toward:
  - full-screen loading reset behavior during background refresh
  - mode-card reshuffling that forces rescanning
  - flashing or pulsing update treatments
  - duplicated live regions or noisy announcement behavior
  - route-planner, ticker, or ops-dashboard tone on the public screen

### References

- `docs/epics.md#Story 2.5: Maintain Stable Live Reading During Updates and Motion Changes`
- `docs/prd.md` sections covering FR21, FR22, NFR3, NFR4, NFR10, NFR11, NFR12, and NFR13
- `docs/ux-design-specification.md` sections covering glance-orient-decide, Atmospheric Header, Mode Summary Block, Freshness / Trust Cue, Responsive Design & Accessibility, and Testing Strategy
- `docs/architecture.md` sections covering stable public-display composition during live updates, TanStack Query polling, loading-state patterns, and reduced-motion-safe public behavior
- [1-6-verify-the-primary-display-on-real-venue-sized-surfaces.md](/home/codexuser/bmad-6-workshop/docs/sprint-artifacts/1-6-verify-the-primary-display-on-real-venue-sized-surfaces.md)
- [1-6-display-verification-notes.md](/home/codexuser/bmad-6-workshop/docs/sprint-artifacts/1-6-display-verification-notes.md)
- [2-1-keep-the-departure-picture-current-during-normal-operation.md](/home/codexuser/bmad-6-workshop/docs/sprint-artifacts/2-1-keep-the-departure-picture-current-during-normal-operation.md)
- [2-2-show-trend-and-freshness-where-confidence-matters.md](/home/codexuser/bmad-6-workshop/docs/sprint-artifacts/2-2-show-trend-and-freshness-where-confidence-matters.md)
- [2-3-surface-serious-disruption-without-breaking-composure.md](/home/codexuser/bmad-6-workshop/docs/sprint-artifacts/2-3-surface-serious-disruption-without-breaking-composure.md)
- [2-4-preserve-honest-usefulness-during-provider-failure.md](/home/codexuser/bmad-6-workshop/docs/sprint-artifacts/2-4-preserve-honest-usefulness-during-provider-failure.md)
- [DashboardScreen.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/DashboardScreen.tsx)
- [DashboardLiveScreen.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/DashboardLiveScreen.tsx)
- [useDashboardQuery.ts](/home/codexuser/bmad-6-workshop/src/features/dashboard/hooks/useDashboardQuery.ts)
- [dashboard-presenter.js](/home/codexuser/bmad-6-workshop/src/features/dashboard/presenters/dashboard-presenter.js)
- [AtmosphericHeader.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/AtmosphericHeader.tsx)
- [ModeSummaryGrid.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/ModeSummaryGrid.tsx)
- [ModeSummaryCard.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/ModeSummaryCard.tsx)
- [LocalMapFrame.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/LocalMapFrame.tsx)
- [globals.css](/home/codexuser/bmad-6-workshop/src/app/globals.css)
- [dashboard.presenter.test.mjs](/home/codexuser/bmad-6-workshop/tests/unit/dashboard.presenter.test.mjs)
- [startup-smoke.test.mjs](/home/codexuser/bmad-6-workshop/tests/smoke/startup-smoke.test.mjs)
- Official source checked 2026-03-19: `https://nextjs.org/docs/app/getting-started`
- Official source checked 2026-03-19: `https://nextjs.org/docs/app/getting-started/route-handlers`
- Official source checked 2026-03-19: `https://react.dev/reference/rsc/use-client`
- Official source checked 2026-03-19: `https://tanstack.com/query/latest/docs/framework/react/reference/useQuery`
- Official source checked 2026-03-19: `https://nodejs.org/en/about/previous-releases`
- Official source checked 2026-03-19: `https://zod.dev/`

### Project Context Reference

- No `project-context.md` file exists in this repository at the time of story creation.
- If broader repository guardrails are needed later, run the BMAD `generate-project-context` workflow separately.

### Completion Status

- Story context assembled from Epic 2, the PRD, the UX specification, the architecture, the current sprint status, Stories 1.6 and 2.1 through 2.4, the live dashboard code, recent git history, and official framework/runtime documentation checked on 2026-03-19.
- The story is scoped to preserving stable live reading during background updates and motion changes without changing the product's calm, shared, non-interactive public posture.
- Provider-failure truthfulness remains with Story 2.4; Story 2.5 adds the continuity and reduced-motion-safe verification layer on top of it.
- This story is ready for a dev agent to implement immediately after Story 2.4.

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- `cat _bmad/bmm/config.yaml`
- `cat _bmad/core/tasks/workflow.xml`
- `cat _bmad/bmm/workflows/4-implementation/create-story/workflow.yaml`
- `cat _bmad/bmm/workflows/4-implementation/create-story/instructions.xml`
- `cat docs/sprint-artifacts/sprint-status.yaml`
- `cat docs/epics.md`
- `cat docs/prd.md`
- `cat docs/architecture.md`
- `cat docs/ux-design-specification.md`
- `cat docs/sprint-artifacts/2-4-preserve-honest-usefulness-during-provider-failure.md`
- `git log --oneline -5`
- `cat package.json`
- `sed -n '1,260p' src/features/dashboard/components/DashboardScreen.tsx`
- `sed -n '1,260p' src/features/dashboard/components/DashboardLiveScreen.tsx`
- `sed -n '1,240p' src/features/dashboard/hooks/useDashboardQuery.ts`
- `sed -n '1,340p' src/features/dashboard/presenters/dashboard-presenter.js`
- `sed -n '1,260p' src/features/dashboard/components/AtmosphericHeader.tsx`
- `sed -n '1,260p' src/features/dashboard/components/ModeSummaryGrid.tsx`
- `sed -n '1,260p' src/features/dashboard/components/LocalMapFrame.tsx`
- `sed -n '1,340p' src/app/globals.css`
- `sed -n '1,260p' tests/unit/dashboard.presenter.test.mjs`
- `sed -n '1,260p' tests/smoke/startup-smoke.test.mjs`
- `rg -n "motion|prefers-reduced-motion|transition|animation|layout|reading order|aria-live|refetchIntervalInBackground" src tests docs/sprint-artifacts -g '!docs/sprint-artifacts/2-5-*'`
- official docs checks on 2026-03-19 via Next.js, React, TanStack Query, Node.js, and Zod
- `npm run test:unit -- tests/unit/dashboard.presenter.test.mjs tests/unit/dashboard.live-path.test.mjs`
- `node --test tests/smoke/startup-smoke.test.mjs`
- `npm run validate`

### Implementation Plan

- Stabilize the live polling boundary so fresh dashboard data updates in place inside the existing public shell with stable section ordering and stable nearby-mode ordering.
- Add presenter-driven, fact-only update cues and CSS guardrails so trend, trust, and degraded-state changes remain understandable without depending on animation.
- Extend unit, live-path, smoke, and manual verification evidence so stable live reading and reduced-motion-safe meaning are explicitly protected.

### Completion Notes List

- Locked the public shell to one explicit reading order with `data-reading-zone` markers and kept the live boundary route-local without any loading takeover or alternate layout branch.
- Extended the presenter with canonical nearby-mode ordering plus fact-only header, mode-card, and local-map update summaries so change meaning stays readable without relying on motion.
- Tightened the live-region posture to one narrowly scoped polite announcement and added calm-motion CSS plus reduced-motion structural emphasis instead of animated novelty.
- Added explicit verification coverage in presenter, live-path, and smoke suites, documented the story-specific verification artifact, and cleared `npm run validate`.
- Review fixes now preserve the previous published snapshot in the local query shim so live change copy reflects real deltas instead of repeating current-state summaries after the first refresh.
- Review fixes also surface calm recovery wording when a nearby mode returns to a readable state, keeping reduced-motion meaning explicit in both worsening and improving cycles.

### File List

- `docs/sprint-artifacts/2-5-live-reading-verification-notes.md`
- `docs/sprint-artifacts/2-5-maintain-stable-live-reading-during-updates-and-motion-changes.md`
- `docs/sprint-artifacts/sprint-status.yaml`
- `src/app/globals.css`
- `src/features/dashboard/components/AtmosphericHeader.tsx`
- `src/features/dashboard/components/DashboardLiveScreen.tsx`
- `src/features/dashboard/components/DashboardScreen.tsx`
- `src/features/dashboard/components/LocalMapFrame.tsx`
- `src/features/dashboard/components/ModeSummaryCard.tsx`
- `src/features/dashboard/components/ModeSummaryGrid.tsx`
- `src/features/dashboard/hooks/useDashboardQuery.ts`
- `src/features/dashboard/presenters/dashboard-presenter.js`
- `src/lib/vendor/tanstack-react-query.tsx`
- `tests/smoke/startup-smoke.test.mjs`
- `tests/unit/dashboard.live-path.test.mjs`
- `tests/unit/dashboard.presenter.test.mjs`

## Senior Developer Review (AI)

### Findings

1. High: `DashboardLiveScreen.tsx` only passed `hasUpdatedSinceLoad`, not the previous snapshot, so the presenter could not compare actual refresh deltas. That made the "Latest change" copy describe the current state instead of the newest change. Fixed by exposing `previousData` from `src/lib/vendor/tanstack-react-query.tsx` and passing the prior snapshot into `src/features/dashboard/components/DashboardLiveScreen.tsx`.
2. High: because the live boundary had no previous snapshot, the polite live-region path could keep surfacing the same non-live conditions after the first refresh instead of announcing only newly changed meaning. Fixed by deriving announcements from real snapshot-to-snapshot deltas in `src/features/dashboard/components/DashboardLiveScreen.tsx` and `src/features/dashboard/presenters/dashboard-presenter.js`.
3. Medium: `createModeChangeSummary()` only described worsening disruption and never stated when a mode became readable again, which weakened reduced-motion comprehension during recovery. Fixed in `src/features/dashboard/presenters/dashboard-presenter.js` with explicit calm recovery wording and regression coverage in `tests/unit/dashboard.presenter.test.mjs`.

### Review Outcome

- All high and medium findings were fixed.
- Regression coverage now checks real delta-based live summaries, non-repeating post-refresh copy, and readable recovery wording.
- Story status moved to `done`.

### Change Log

- 2026-03-19: Preserved the live public shell during refreshes, added fact-only reduced-motion-safe change cues, extended the local TanStack Query shim for calm venue polling controls, and added story-specific verification evidence for stable live reading.
- 2026-03-19: Applied senior review fixes so live change summaries compare real snapshot deltas, announcements do not repeat stale current-state meaning, and nearby recovery remains explicit without relying on motion.
