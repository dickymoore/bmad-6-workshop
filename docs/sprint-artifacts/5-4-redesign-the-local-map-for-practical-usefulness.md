# Story 5.4: Redesign the Local Map for Practical Usefulness

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visitor preparing to leave,
I want the map to help me orient locally in seconds,
so that the map earns its space on the board instead of reading as a decorative abstraction.

## Acceptance Criteria

1. Given the map is rendered on the main public board, when a user inspects it, then it clearly supports nearby orientation around the Royal Institution, and a more conventional static-map treatment is preferred over bespoke framing if that is easier to read.
2. Given the map is present alongside status and mode information, when the board is read as a whole, then the map supports the locality story without dominating the composition.
3. Given the map is reviewed against the Epic 5 redesign direction, when nearby stations, stops, streets, and the Royal Institution anchor are shown, then the map uses calm, recognisable locality cues rather than abstract decorative geometry, and it stays passive and fact-only.
4. Given richer map detail narrows or a fallback state is required, when the board remains in service, then the map preserves the Royal Institution anchor and usable nearby context in a simplified state without blanking the whole area or contradicting the locality panel.

## Tasks / Subtasks

- [x] Redesign the canonical local-map surface around practical nearby orientation rather than decorative framing. (AC: 1, 2, 3)
  - [x] Update [LocalMapFrame.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/LocalMapFrame.tsx) so the map reads as a recognisable static orientation surface with a clear Royal Institution anchor and calmer nearby-place labeling. (AC: 1, 3)
  - [x] Replace or reduce purely decorative map treatment such as abstract corridor emphasis or over-stylized framing where it weakens fast locality comprehension. (AC: 1, 3)
  - [x] Keep the map visually secondary to the overall state and compact mode field while still legible within a 5-10 second close read. (AC: 2, 3)
- [x] Reuse the existing locality seam so the map and locality panel reinforce one another instead of duplicating or contradicting each other. (AC: 1, 2, 3, 4)
  - [x] Update [dashboard-presenter.js](/home/codexuser/bmad-6-workshop/src/features/dashboard/presenters/dashboard-presenter.js) so map labels, captions, and summaries use the same fact-only nearby references established in Story 5.3. (AC: 1, 3, 4)
  - [x] Adjust [dashboard-snapshot.js](/home/codexuser/bmad-6-workshop/src/lib/contracts/dashboard-snapshot.js) only where needed to support clearer map-oriented metadata without introducing a second locality truth model. (AC: 1, 4)
  - [x] Update [overall-departure-snapshot.js](/home/codexuser/bmad-6-workshop/src/features/dashboard/data/overall-departure-snapshot.js) so fixture data drives a visibly useful Royal Institution-centered map read. (AC: 1, 3, 4)
- [x] Tune the board composition so the revised map earns space without taking over the screen. (AC: 2, 3)
  - [x] Update [DashboardScreen.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/DashboardScreen.tsx) and [globals.css](/home/codexuser/bmad-6-workshop/src/app/globals.css) only as needed to improve the map-to-header and map-to-locality-panel relationship. (AC: 2, 3)
  - [x] Preserve the current one-screen board structure and keep the public route passive: no pan, zoom, route drawing, tabs, toggles, or drill-in affordances. (AC: 2, 3)
  - [x] Prefer conventional clarity, restrained labels, and calm emphasis over novelty if those goals conflict. (AC: 1, 2, 3)
- [x] Preserve honest fallback behavior for degraded or simplified map states. (AC: 4)
  - [x] Keep a simplified fallback-map treatment that still shows the Royal Institution anchor plus enough nearby context to remain useful. (AC: 4)
  - [x] Ensure fallback copy and map state remain consistent with locality-panel content and existing source-status or trust language. (AC: 4)
  - [x] Do not widen fallback behavior into a generic error panel, ops state, or full-screen degraded takeover. (AC: 4)
- [x] Add focused regression coverage for practical map usefulness and anti-regression guardrails. (AC: 1, 2, 3, 4)
  - [x] Extend [dashboard.presenter.test.mjs](/home/codexuser/bmad-6-workshop/tests/unit/dashboard.presenter.test.mjs) to lock in clearer map-facing labels, fact-only map summaries, and fallback consistency. (AC: 1, 3, 4)
  - [x] Extend [startup-smoke.test.mjs](/home/codexuser/bmad-6-workshop/tests/smoke/startup-smoke.test.mjs) so the public board must still expose a passive, recognisable Royal Institution map treatment rather than a decorative placeholder. (AC: 1, 2, 3, 4)
  - [x] Add any targeted component or source-inspection coverage needed to prevent regression to abstract framed-map styling, planner-like controls, or hidden local anchor cues. (AC: 1, 3, 4)
- [x] Verify the story through the standard local validation gate before handoff. (AC: 1, 2, 3, 4)
  - [x] Run `npm run lint`. (AC: 2, 3)
  - [x] Run `npm run typecheck`. (AC: 2, 3)
  - [x] Run `npm test`. (AC: 1, 2, 3, 4)
  - [x] Run `npm run build`. (AC: 2, 3)

## Dev Notes

### Developer Context

- Story `5.4` is the fourth implementation story in `Epic 5: Public Display Clarity and Visual Redesign`.
- Story `5.1` already established the one-screen status-first shell, Story `5.2` already converted nearby modes into compact RAG rows, and Story `5.3` already introduced a concrete nearby-references panel. Story `5.4` should make the map itself useful enough to justify its footprint inside that completed board.
- The approved Epic 5 artifacts and sprint change proposal define the exact gap:
  - the map must behave as a recognisable local orientation aid rather than an abstract framed graphic
  - conventional clarity should beat bespoke styling when the current map is hard to understand
  - the Royal Institution anchor plus nearby stations, stops, and local streets should support fast unfamiliar-viewer orientation
  - the map must stay calm, passive, fact-only, and subordinate to the overall board hierarchy
- Current implementation evidence explains why the story exists:
  - [LocalMapFrame.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/LocalMapFrame.tsx) still relies on stylised SVG streets, a corridor ellipse, and a legend-heavy presentation that reads more like a framed graphic than a practical local map
  - [DashboardScreen.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/DashboardScreen.tsx) now includes a dedicated locality panel, so the map no longer needs to carry all locality explanation through narrative copy or legend text
  - [dashboard-presenter.js](/home/codexuser/bmad-6-workshop/src/features/dashboard/presenters/dashboard-presenter.js) and [overall-departure-snapshot.js](/home/codexuser/bmad-6-workshop/src/features/dashboard/data/overall-departure-snapshot.js) already expose a narrow locality seam that should be reused rather than replaced
- Success for Story `5.4` is:
  - unfamiliar viewers can understand where the Royal Institution sits relative to the nearby named references in seconds
  - the map feels recognisable and useful rather than decorative
  - the map supports the locality story without overtaking the board
  - fallback behavior remains honest and locally informative
  - Story `5.5` can validate the finished board without reopening map basics again

### Technical Requirements

- Treat this as a practical-map clarity story, not a new mapping-platform story.
  - improve recognisability, labeling, hierarchy, and fallback usefulness now
  - do not introduce a map SDK, remote tile dependency, route drawing layer, or second map implementation path
  - prefer a clearer static SVG or equivalent built-in treatment over dependency churn
- Reuse the Story `5.3` locality model.
  - the map should consume the same nearby references and anchor truth already established for the locality panel
  - avoid inventing a parallel set of map-only labels or hardcoded one-off place names
  - if metadata must expand, keep it narrow and map-specific inside the existing snapshot and presenter seams
- Keep map copy fact-only and non-advisory.
  - no route instructions
  - no ranking language such as `best`, `take`, `switch to`, or `recommended`
  - labels and captions should identify nearby geography, not tell users what to do
- Improve practical orientation with restrained means.
  - clarify the Royal Institution anchor
  - make nearby stations, stops, and street or corridor cues easier to distinguish at a glance
  - reduce ambiguity caused by abstract shapes or unnecessary decorative emphasis
  - keep linework, labels, and markers calm enough for a public board rather than a detailed explorer map
- Preserve the current board behavior.
  - no public interaction
  - no fullscreen redraw or takeover behavior
  - no change to the live polling path, route boundaries, or ops/public separation

### Architecture Compliance

- Stay inside the approved modular-monolith and BFF structure:
  - public route composition remains in [page.tsx](/home/codexuser/bmad-6-workshop/src/app/(public)/page.tsx)
  - public display UI remains under `src/features/dashboard/components/*`
  - presenter shaping remains under `src/features/dashboard/presenters/*`
  - snapshot contract ownership remains under `src/lib/contracts/*`
  - fixture or server-owned dashboard truth remains under `src/features/dashboard/data/*` and `src/lib/server/dashboard/*`
- Preserve one canonical public-display path.
  - do not create a second map implementation under another route, feature, or prototype surface
  - do not move map business truth into route-local React logic
  - do not bypass the presenter with ad hoc component-local label construction
- Respect the public-display doctrine:
  - one passive public board
  - no public controls
  - no provider calls from UI components
  - no route-planner, kiosk, or exploratory-map drift

### Library / Framework Requirements

- Stay aligned with the repo baseline in [package.json](/home/codexuser/bmad-6-workshop/package.json):
  - `next` `16.1.7`
  - `react` `19.2.3`
  - `react-dom` `19.2.3`
  - `@tanstack/react-query` `^5.0.0`
  - `zod` `^4.3.6`
  - `node` `24.x`
  - local `vitest` package via `tools/vitest-lite`
- Do not add Tailwind, a mapping SDK, a GIS dependency, an icon pack, or a second state or data layer for this story.
- Official-source checks completed on 2026-03-23:
  - Next.js docs still show App Router `Font` support in the latest `16.2.1` docs, reinforcing that any visual refinement should stay inside the existing App Router app rather than adding an external UI runtime: https://nextjs.org/docs/app/api-reference/components/font
  - React's `'use client'` reference continues to enforce an explicit server/client boundary, which supports keeping map truth in the snapshot and presenter seam instead of inventing client-side map state: https://react.dev/reference/rsc/use-client
  - TanStack Query's React `useQuery` reference still includes `refetchInterval`, so the current calm polling path remains the right live-update mechanism for this story: https://tanstack.com/query/latest/docs/framework/react/reference/useQuery
  - Node.js release information still lists `v24` as `Active LTS` on 2026-03-23, which remains aligned with the repo runtime contract: https://nodejs.org/en/about/previous-releases
- Inference from those sources: there is no stack-level reason to introduce a new mapping library or runtime path. The safest implementation is to improve the existing static local-map component and its presenter-fed data.

### File Structure Requirements

- Expected primary implementation files:
  - [LocalMapFrame.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/LocalMapFrame.tsx)
  - [dashboard-presenter.js](/home/codexuser/bmad-6-workshop/src/features/dashboard/presenters/dashboard-presenter.js)
  - [overall-departure-snapshot.js](/home/codexuser/bmad-6-workshop/src/features/dashboard/data/overall-departure-snapshot.js)
  - [dashboard-snapshot.js](/home/codexuser/bmad-6-workshop/src/lib/contracts/dashboard-snapshot.js)
  - [globals.css](/home/codexuser/bmad-6-workshop/src/app/globals.css)
- Supporting files that may need targeted updates:
  - [DashboardScreen.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/DashboardScreen.tsx)
  - [LocalityReferencePanel.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/LocalityReferencePanel.tsx) only if map and locality labeling need a small consistency update
  - [dashboard.presenter.test.mjs](/home/codexuser/bmad-6-workshop/tests/unit/dashboard.presenter.test.mjs)
  - [startup-smoke.test.mjs](/home/codexuser/bmad-6-workshop/tests/smoke/startup-smoke.test.mjs)
- Keep route and data-boundary files stable unless a small composition or typing update is strictly required:
  - [page.tsx](/home/codexuser/bmad-6-workshop/src/app/(public)/page.tsx)
  - [DashboardLiveScreen.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/DashboardLiveScreen.tsx)
  - [useDashboardQuery.ts](/home/codexuser/bmad-6-workshop/src/features/dashboard/hooks/useDashboardQuery.ts)
- Do not create:
  - a second public map implementation
  - a dependency on remote tiles or a live third-party map runtime
  - route-planner style overlays, route lines, or turn-by-turn cues
  - a citywide transport view that weakens the Royal Institution framing

### Testing Requirements

- Minimum verification:
  - `npm run lint`
  - `npm run typecheck`
  - `npm test`
  - `npm run build`
- Focused regression expectations for Story `5.4`:
  - the public route still exposes one passive Royal Institution-centered map on the canonical board
  - the map looks recognisable and locality-supporting rather than placeholder-like or decorative-only
  - the map remains fact-only and non-interactive
  - fallback state preserves anchor plus usable nearby context instead of blanking the map area
  - the map does not overpower the existing status-first shell or duplicate the locality panel's job
- Add or update source-level tests where they protect the main failure modes:
  - presenter tests for map-facing summary text, fallback consistency, and fact-only language
  - smoke tests for Royal Institution anchor presence, passive SVG or static-map rendering, and anti-planner behavior
  - focused component or source-inspection tests only where they lock in anti-abstraction and anti-interaction guardrails
- Do not rely on brittle pixel-diff testing for this story.

### Previous Story Intelligence

- From Story `5.3`:
  - the board now has a dedicated locality panel with named nearby references
  - the map should reinforce those names spatially rather than re-explaining all locality in prose or legend form
  - Story `5.4` should not undo the clean separation between explicit locality references and the map surface
- From Story `5.2`:
  - the nearby-mode area now reads as compact board rows and should remain visually primary over decorative map treatment
  - narrowed-confidence messaging should stay local and quiet rather than duplicated across the board
- From Story `5.1`:
  - the shell is already one-screen and status-first
  - the map must earn its existing slot inside that shell, not demand a new layout regime
- From Story `1.5`:
  - the map contract already models the Royal Institution anchor, nearby nodes, and fallback behavior
  - the story should improve readability and orientation without abandoning the existing static-map path
- Implementation implication:
  - build on the current `localMap` snapshot and presenter seam
  - improve recognisability, labels, and hierarchy
  - keep the finished result cleanly compatible with the Epic 5 validation work in Story `5.5`

### Git Intelligence Summary

- Recent commits confirm Epic 5 progression and the immediate predecessor work:
  - `f9f2a9e feat(epic-5): implement 5-3-add-concrete-nearby-station-and-locality-references`
  - `773df04 feat(epic-5): implement 5-2-replace-verbose-mode-cards-with-compact-rag-transport-rows`
  - `8332672 feat(epic-4): close review debt and sync release readiness`
  - `3cc4ef6 feat(epic-3): implement 3-5-recover-the-display-after-interruption-or-restart`
  - `3a6ec9f feat(epic-3): implement 3-4-trigger-lightweight-refresh-and-trust-check-actions`
- The current worktree is dirty only from runtime snapshot and log artifacts outside the Epic 5 source area. Story `5.4` should work with the current codebase and must not revert unrelated generated files.
- Strong implementation implication:
  - continue directly from the Story `5.1` to `5.3` board
  - keep Story `5.4` scoped to practical map usefulness so Story `5.5` can focus on explicit validation rather than more redesign

### Latest Tech Information

- Official-source checks on 2026-03-23 did not reveal any stack change that alters Story `5.4`'s implementation path.
  - Next.js App Router remains current for the existing display shell.
  - React's server/client boundary guidance still supports presenter-owned map data.
  - TanStack Query still supports the existing polling model.
  - Node `24` remains an `Active LTS` line.
- Inference: there is no technical justification to introduce a map SDK, alternate refresh path, or client-side map state store for this story.

### Project Context Reference

- No `project-context.md` file exists in this repository at the time of story creation.
- If broader repository guardrails are needed later, run the BMAD `generate-project-context` workflow separately.

### Completion Status

- Story context assembled from Epic 5 planning artifacts, sprint tracking, the approved sprint change proposal, the completed Stories `1.5`, `5.1`, `5.2`, and `5.3` artifacts, the current dashboard code, package metadata, git history, and official documentation checked on 2026-03-23.
- The story is intentionally scoped to practical local-map usefulness inside the current public board, not to a new mapping platform or a broader layout reset.
- The developer should treat the locality panel as already solved supporting context and focus this story on recognisable orientation, calmer map hierarchy, and honest fallback behavior.
- This story is ready for a dev agent to implement as the map-usefulness correction layer of Epic 5.

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- `sed -n '1,220p' .codex/skills/bmad-agent-bmm-sm/SKILL.md`
- `sed -n '1,260p' .codex/skills/bmad-bmm-create-story/SKILL.md`
- `sed -n '1,260p' _bmad/bmm/agents/sm.md`
- `sed -n '1,320p' _bmad/core/tasks/workflow.xml`
- `sed -n '1,320p' _bmad/bmm/workflows/4-implementation/create-story/workflow.yaml`
- `sed -n '1,420p' _bmad/bmm/workflows/4-implementation/create-story/instructions.xml`
- `sed -n '1,260p' _bmad/bmm/workflows/4-implementation/create-story/template.md`
- `sed -n '1,260p' _bmad/bmm/workflows/4-implementation/create-story/checklist.md`
- `sed -n '1,260p' docs/sprint-artifacts/sprint-status.yaml`
- `sed -n '730,840p' docs/epics.md`
- `sed -n '120,200p' docs/sprint-change-proposal-2026-03-20.md`
- `sed -n '430,460p' docs/ux-design-specification.md`
- `sed -n '690,715p' docs/ux-design-specification.md`
- `sed -n '240,280p' docs/architecture.md`
- `sed -n '1,260p' docs/sprint-artifacts/5-1-reframe-the-public-display-around-a-one-screen-status-first-board.md`
- `sed -n '1,420p' docs/sprint-artifacts/5-3-add-concrete-nearby-station-and-locality-references.md`
- `sed -n '260,340p' docs/sprint-artifacts/1-5-anchor-the-display-with-a-fixed-local-map.md`
- `sed -n '1,260p' src/features/dashboard/components/DashboardScreen.tsx`
- `sed -n '1,260p' src/features/dashboard/components/LocalMapFrame.tsx`
- `sed -n '1,260p' src/features/dashboard/components/LocalityReferencePanel.tsx`
- `sed -n '1,320p' src/features/dashboard/presenters/dashboard-presenter.js`
- `sed -n '1,320p' src/features/dashboard/data/overall-departure-snapshot.js`
- `sed -n '1,320p' src/lib/contracts/dashboard-snapshot.js`
- `sed -n '1,420p' tests/unit/dashboard.presenter.test.mjs`
- `sed -n '1,260p' tests/smoke/startup-smoke.test.mjs`
- `rg -n "Epic 5|5-4-redesign-the-local-map-for-practical-usefulness|map|local map" docs/epics.md docs/prd.md docs/architecture.md docs/ux-design-specification.md docs/sprint-artifacts/5-3-add-concrete-nearby-station-and-locality-references.md`
- `git log --oneline -5`
- `git status --short`
- `rg --files . | rg 'project-context\\.md$'`

### Completion Notes List

- Added a practical static-orientation treatment in `LocalMapFrame.tsx`, replacing the decorative corridor framing with calmer street blocks, named street labels, a clearer Royal Institution anchor, and legend entries tied to the presenter-fed locality seam.
- Added `localMap.orientationSummary` in `dashboard-snapshot.js`, aligned fixture map nodes and fallback copy in `overall-departure-snapshot.js`, and updated `dashboard-presenter.js` so map summaries, captions, and fallback messaging reuse the same fact-only nearby references as the locality panel.
- Kept the one-screen board structure intact while tightening map sizing and legend styling through `DashboardScreen.tsx` and `globals.css`, preserving a passive public route with no planner or interaction affordances.
- Extended unit and smoke coverage to lock in the passive Royal Institution orientation map, the anti-corridor/source-inspection guardrails, and fallback consistency around the shared locality truth.
- Ran `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build` successfully on 2026-03-23.

### File List

- `docs/sprint-artifacts/5-4-redesign-the-local-map-for-practical-usefulness.md`
- `docs/sprint-artifacts/sprint-status.yaml`
- `src/app/globals.css`
- `src/features/dashboard/components/DashboardScreen.tsx`
- `src/features/dashboard/components/LocalMapFrame.tsx`
- `src/features/dashboard/data/overall-departure-snapshot.js`
- `src/features/dashboard/presenters/dashboard-presenter.js`
- `src/lib/contracts/dashboard-snapshot.js`
- `tests/smoke/startup-smoke.test.mjs`
- `tests/unit/dashboard.presenter.test.mjs`

### Change Log

- 2026-03-23: Reworked the Royal Institution local map into a calmer passive orientation surface, aligned map and locality references through the presenter/snapshot seam, added fallback-specific orientation copy, and expanded regression coverage for anti-decorative and anti-interaction guardrails.
- 2026-03-23: Senior developer review fixed the fallback-detail mismatch, added a regression test for narrowed fallback locality, reran validation, and closed the story.

## Senior Developer Review (AI)

### Reviewer

Workshop

### Date

2026-03-23

### Outcome

Approved after fixes.

### Findings Fixed

1. `HIGH`: [overall-departure-snapshot.js](/home/codexuser/bmad-6-workshop/src/features/dashboard/data/overall-departure-snapshot.js) claimed the fallback map "narrows" richer detail, but the fallback fixture still exposed the same full nearby-reference set as the live map. The fallback fixture now drops the extra street reference and renders a genuinely simplified nearby read while preserving the Royal Institution anchor.
2. `MEDIUM`: [dashboard.presenter.test.mjs](/home/codexuser/bmad-6-workshop/tests/unit/dashboard.presenter.test.mjs) did not verify that fallback locality is actually narrower than the live map. Regression coverage now asserts the live/fallback difference directly through the real fixture presenter path.
3. `MEDIUM`: The story artifact remained in `review` and lacked the required review record after the implementation gates passed. The story status, review notes, change log, and sprint tracker are now synchronized.

### Validation

- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run build`
