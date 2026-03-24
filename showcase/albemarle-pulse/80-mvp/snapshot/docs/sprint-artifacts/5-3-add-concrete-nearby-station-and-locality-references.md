# Story 5.3: Add Concrete Nearby Station and Locality References

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visitor unfamiliar with the area,
I want the board to show concrete nearby stations, stops, and local corridors,
so that I can understand what "nearby" means without local knowledge or guesswork.

## Acceptance Criteria

1. Given the board is read at close range, when a visitor inspects the locality layer, then named nearby stations, stops, or corridors are visible, and abstract locality labels no longer carry the main comprehension burden.
2. Given a small group is sharing the screen, when they discuss what looks usable nearby, then they can refer to concrete local names rather than paraphrasing vague prose.
3. Given the locality layer is added to the existing Story 5.1 and 5.2 board shell, when the public screen renders from the current dashboard snapshot and presenter path, then the result remains fact-only, calm, local, and non-interactive, and it does not introduce route-planner wording or citywide sprawl.
4. Given the locality treatment is reviewed against the approved Epic 5 direction and UX component guidance, when the board is read within 5-10 seconds, then the named references work as a compact nearby-stations panel or equivalent explicit locality field, and they preserve one-screen readability ahead of the later map redesign in Story 5.4.

## Tasks / Subtasks

- [x] Add a dedicated concrete-locality layer to the canonical public board instead of relying on map narrative copy alone. (AC: 1, 2, 4)
  - [x] Update [DashboardScreen.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/DashboardScreen.tsx) and the lower-grid composition so a compact nearby-stations or locality panel can sit with the existing mode field and map without breaking the Story 5.1 one-screen shell. (AC: 1, 4)
  - [x] Introduce or repurpose a focused component under `src/features/dashboard/components/*` for concrete locality references rather than burying all names inside the map legend. (AC: 1, 2, 4)
  - [x] Keep the public screen passive and board-like: no expanders, route choices, map controls, tabs, or recommendation affordances. (AC: 2, 3)
- [x] Extend the snapshot and presenter seam so locality references are explicit, structured, and reusable by both the board and the later map redesign. (AC: 1, 2, 3)
  - [x] Update [dashboard-snapshot.js](/home/codexuser/bmad-6-workshop/src/lib/contracts/dashboard-snapshot.js) with a narrow normalized structure for named nearby references, such as stations, stops, or corridors, plus any short supporting locality labels required for plain-language reading. (AC: 1, 2, 3)
  - [x] Update [overall-departure-snapshot.js](/home/codexuser/bmad-6-workshop/src/features/dashboard/data/overall-departure-snapshot.js) so fixture data contains concrete nearby names that reflect the Royal Institution context and no longer relies mainly on abstract corridor phrasing. (AC: 1, 2, 3)
  - [x] Update [dashboard-presenter.js](/home/codexuser/bmad-6-workshop/src/features/dashboard/presenters/dashboard-presenter.js) so the UI receives concise display-ready locality references and plain-language captions instead of generic labels like `Nearby node`. (AC: 1, 2, 3)
- [x] Tighten locality copy so unfamiliar viewers can name what is nearby without drifting into route advice. (AC: 1, 2, 3, 4)
  - [x] Replace abstract copy that makes users decode phrases like `local corridor` as the primary meaning with concrete names such as stations, stops, or named streets where they aid comprehension. (AC: 1, 2)
  - [x] Keep locality wording factual and descriptive only; avoid `best route`, `take`, `switch to`, `recommended`, `head for`, or similar advisory phrasing. (AC: 3)
  - [x] Preserve the Story 5.2 compact row grammar and Story 5.1 hierarchy so named references support the board rather than turning it back into prose. (AC: 3, 4)
- [x] Keep Story 5.3 clearly separated from the map-overhaul work owned by Story 5.4. (AC: 3, 4)
  - [x] Limit map changes to small enabling adjustments needed to keep names and locality cues coherent with the new explicit panel or field. (AC: 3, 4)
  - [x] Do not introduce a new map library, remote tile dependency, route drawing, or a second map implementation path. (AC: 3, 4)
  - [x] Preserve the existing header-first, rows-second, map-third reading order unless a minor locality-panel insertion is required for one-screen clarity. (AC: 4)
- [x] Add focused regression coverage that locks in concrete nearby references as part of the public-board contract. (AC: 1, 2, 3, 4)
  - [x] Extend [dashboard.presenter.test.mjs](/home/codexuser/bmad-6-workshop/tests/unit/dashboard.presenter.test.mjs) to cover structured nearby references, plain-language captions, and the absence of vague-only locality output. (AC: 1, 2, 3)
  - [x] Extend [startup-smoke.test.mjs](/home/codexuser/bmad-6-workshop/tests/smoke/startup-smoke.test.mjs) so the public route is required to surface concrete nearby names as part of the board, while staying passive and non-planner-like. (AC: 1, 2, 3, 4)
  - [x] Add any targeted component or source-inspection coverage needed to prevent regressions back toward map-legend-only locality, abstract-only corridor wording, or hidden station references. (AC: 1, 2, 4)
- [x] Verify the story through the standard local validation gate before handoff. (AC: 1, 2, 3, 4)
  - [x] Run `npm run lint`. (AC: 3, 4)
  - [x] Run `npm run typecheck`. (AC: 3, 4)
  - [x] Run `npm test`. (AC: 3, 4)
  - [x] Run `npm run build`. (AC: 3, 4)

## Dev Notes

### Developer Context

- Story `5.3` is the third implementation story in `Epic 5: Public Display Clarity and Visual Redesign`.
- Story `5.1` already reframed the public screen as a one-screen status-first board, and Story `5.2` already replaced verbose nearby-mode cards with compact RAG rows. Story `5.3` should solve the remaining locality-comprehension gap without reopening shell or row work.
- The approved Epic 5 planning artifacts make the gap explicit:
  - the board still needs concrete nearby stations, stops, or corridor references
  - abstract locality phrases should not do the main comprehension work
  - the screen should support group discussion using names people can point at and repeat
  - the map redesign itself is intentionally deferred to Story `5.4`
- Current implementation evidence shows why Story `5.3` is needed:
  - [LocalMapFrame.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/LocalMapFrame.tsx) currently carries most locality naming inside the map legend and a short narrative intro
  - [dashboard-presenter.js](/home/codexuser/bmad-6-workshop/src/features/dashboard/presenters/dashboard-presenter.js) currently labels map points generically as `Nearby node` and exposes `localityEmphasis` as one broad sentence
  - [overall-departure-snapshot.js](/home/codexuser/bmad-6-workshop/src/features/dashboard/data/overall-departure-snapshot.js) still leans on phrases such as `the clearest local corridor` rather than making concrete nearby references a first-class board element
  - [DashboardScreen.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/DashboardScreen.tsx) currently offers only two lower-body blocks: nearby modes and map, with no dedicated compact nearby-stations panel
- The UX spec now calls for a dedicated locality treatment:
  - two to five named nearby references
  - short supporting locality labels where needed
  - plain-language names that support close-read comprehension and group discussion
  - no route advice, expansion behavior, or citywide sprawl
- Success for Story `5.3` is:
  - unfamiliar viewers can name at least one nearby station, stop, or corridor quickly
  - the board exposes concrete locality references without depending on the map alone
  - the board stays one-screen, calm, and fact-only
  - Story `5.4` still owns the broader map-fidelity and orientation redesign

### Technical Requirements

- Treat this as a concrete-locality clarity story, not a full map rewrite.
  - add or expose explicit named nearby references in the board shell
  - keep map work narrow and enabling only
  - defer broader orientation, map visual treatment, and conventional-map redesign choices to Story `5.4`
- Prefer structured locality data over ad hoc UI strings.
  - first extend the canonical snapshot and presenter seam so named references are modeled explicitly
  - reuse those same normalized names across the board and map where appropriate
  - avoid scattering one-off hardcoded station labels through multiple components
- Keep locality content fact-only and readable.
  - prefer real station, stop, or named street or corridor references over abstract locality wording
  - use short captions only where they clarify what a name is
  - avoid recommendation, ranking, or navigation language
- Preserve one-screen clarity.
  - the new locality layer must fit inside the Story `5.1` board shell
  - do not reintroduce repeated sentences, tall card stacks, or decorative panel chrome
  - support the 5-10 second close-read goal without harming the 2-3 second far-read hierarchy
- Keep degraded and fallback behavior honest.
  - if locality detail narrows, preserve visible concrete names where possible
  - if a fallback state needs less detail, it should still carry usable named references rather than collapsing back into generic prose

### Architecture Compliance

- Stay inside the approved modular-monolith and BFF structure:
  - public route composition remains in [page.tsx](/home/codexuser/bmad-6-workshop/src/app/(public)/page.tsx)
  - public display UI remains under `src/features/dashboard/components/*`
  - presenter shaping remains under `src/features/dashboard/presenters/*`
  - snapshot contract ownership remains under `src/lib/contracts/*`
  - fixture or server-owned dashboard truth remains under `src/features/dashboard/data/*` and `src/lib/server/dashboard/*`
- Preserve one canonical public-display path.
  - do not create a second board implementation
  - do not create an experimental locality prototype under another route or feature
  - do not move locality business truth into route-local React logic
- Respect the public-display doctrine:
  - one passive public board
  - no ops controls or setup affordances on the public route
  - no provider calls from UI components
  - no route-planner, kiosk, or dashboard drift

### Library / Framework Requirements

- Stay aligned with the repo baseline in [package.json](/home/codexuser/bmad-6-workshop/package.json):
  - `next` `16.1.7`
  - `react` `19.2.3`
  - `react-dom` `19.2.3`
  - `@tanstack/react-query` `^5.0.0`
  - `zod` `^4.3.6`
  - `node` `24.x`
  - local `vitest` package via `tools/vitest-lite`
- Do not add Tailwind, a mapping SDK, a UI kit, an icon pack, or a second state or data layer for this story.
- Official-source checks completed on 2026-03-23:
  - Next.js `next/font` guidance remains current, which reinforces keeping any typography or shell refinements inside the existing App Router app rather than adding external font wiring or a separate runtime path: https://nextjs.org/docs/app/api-reference/components/font
  - React's `'use client'` reference still keeps the server/client boundary explicit, which supports continuing to keep locality truth in snapshot plus presenter seams instead of pushing it into ad hoc client state: https://react.dev/reference/rsc/use-client
  - TanStack Query's current React reference still documents `refetchInterval`, so Story `5.3` should keep the existing polling path and avoid inventing new client data plumbing just to expose nearby names: https://tanstack.com/query/latest/docs/framework/react/reference/useQuery
  - Node.js release information lists `v24` as `Active LTS` as of 2026-03-23, which remains aligned with the repo runtime contract: https://nodejs.org/en/about/previous-releases
- Inference from those sources: there is no stack-level reason to add new dependencies or runtime patterns. The safest implementation is to expose concrete nearby references within the existing Next.js, React, TanStack Query, presenter, contract, and CSS stack.

### File Structure Requirements

- Expected primary implementation files:
  - [DashboardScreen.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/DashboardScreen.tsx)
  - [LocalMapFrame.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/LocalMapFrame.tsx)
  - [dashboard-presenter.js](/home/codexuser/bmad-6-workshop/src/features/dashboard/presenters/dashboard-presenter.js)
  - [overall-departure-snapshot.js](/home/codexuser/bmad-6-workshop/src/features/dashboard/data/overall-departure-snapshot.js)
  - [dashboard-snapshot.js](/home/codexuser/bmad-6-workshop/src/lib/contracts/dashboard-snapshot.js)
  - [globals.css](/home/codexuser/bmad-6-workshop/src/app/globals.css)
- Supporting files that may need targeted updates:
  - [ModeSummaryGrid.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/ModeSummaryGrid.tsx) if the locality panel sits alongside or beneath the nearby rows
  - `src/features/dashboard/components/*` for a small dedicated nearby-stations or locality component if that yields the clearest board composition
  - [dashboard.presenter.test.mjs](/home/codexuser/bmad-6-workshop/tests/unit/dashboard.presenter.test.mjs)
  - [startup-smoke.test.mjs](/home/codexuser/bmad-6-workshop/tests/smoke/startup-smoke.test.mjs)
- Keep route and data-boundary files stable unless a small composition or typing update is strictly required:
  - [page.tsx](/home/codexuser/bmad-6-workshop/src/app/(public)/page.tsx)
  - [DashboardLiveScreen.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/DashboardLiveScreen.tsx)
  - [useDashboardQuery.ts](/home/codexuser/bmad-6-workshop/src/features/dashboard/hooks/useDashboardQuery.ts)
- Do not create:
  - a second public locality implementation
  - a new map rendering stack
  - a route-planner style drill-in panel
  - a hidden dependency on citywide transport references that weakens the Royal Institution framing

### Testing Requirements

- Minimum verification:
  - `npm run lint`
  - `npm run typecheck`
  - `npm test`
  - `npm run build`
- Focused regression expectations for Story `5.3`:
  - the public route surfaces concrete nearby names as part of the board, not only as buried map detail
  - locality references remain fact-only and plain-language
  - group-readable concrete names exist without adding public interaction
  - one-screen board readability remains intact after the new locality layer is added
  - Story `5.4` map-overhaul scope is not accidentally pulled forward
- Add or update source-level tests where they protect the main failure modes:
  - presenter tests for named nearby references, captions, and anti-advisory wording
  - smoke tests for concrete station or locality references appearing in the canonical public shell
  - focused component or source-inspection tests only where they lock in anti-vagueness and anti-planner guardrails
- Do not rely on brittle visual snapshot or pixel-diff testing for this story.

### Previous Story Intelligence

- From Story `5.2`:
  - the nearby-mode field now reads as compact board rows and should stay that way
  - local trust narrowing should remain quiet and per-area, not duplicated everywhere
  - the shell should not regress toward repeated prose or card soup
- From Story `5.1`:
  - the one-screen status-first shell is already in place
  - named locality references are the next corrective layer and should fit inside that shell
  - Story `5.1` explicitly deferred expanded station naming to Story `5.3`
- From Story `1.5`:
  - the map and snapshot already model the Royal Institution anchor plus selected nearby nodes
  - the safest implementation path is to extend that contract and presenter seam rather than bypassing it
  - the map should explain locality quietly, not carry all locality comprehension alone
- Implementation implication:
  - build on the existing `localMap` and board seams
  - make concrete nearby names more explicit and more central
  - keep the later Story `5.4` map redesign cleanly separable

### Git Intelligence Summary

- Recent commits confirm Epic 5 is active and Story `5.2` is now the latest implemented corrective step:
  - `773df04 feat(epic-5): implement 5-2-replace-verbose-mode-cards-with-compact-rag-transport-rows`
  - `8332672 feat(epic-4): close review debt and sync release readiness`
  - `3cc4ef6 feat(epic-3): implement 3-5-recover-the-display-after-interruption-or-restart`
  - `3a6ec9f feat(epic-3): implement 3-4-trigger-lightweight-refresh-and-trust-check-actions`
  - `8a12ce8 feat(epic-3): implement 3-3-diagnose-degraded-impact-by-signal-and-scope`
- The current worktree is intentionally dirty from runtime snapshot artifacts and logs. Story `5.3` should work with the current Epic 5 codebase rather than reverting those unrelated generated files.
- Strong implementation implication:
  - continue from the Story `5.1` and `5.2` shell and row redesigns
  - keep Story `5.3` narrow and explicit so Story `5.4` can still focus on practical map usefulness

### Latest Tech Information

- Official-source checks on 2026-03-23 did not reveal any stack change that alters Story `5.3`'s implementation path.
  - Next.js App Router plus `next/font` remain compatible with the repo's current public-board architecture.
  - React's server/client boundary guidance still supports keeping locality truth outside client-only state.
  - TanStack Query still supports the existing polling model needed for calm refresh behavior.
  - Node `24` remains an `Active LTS` line.
- Inference: there is no technical justification to introduce a new mapping stack, alternate query path, or client-side locality data store for this story.

### Project Structure Notes

- The public-display implementation remains intentionally narrow:
  - route entry: [page.tsx](/home/codexuser/bmad-6-workshop/src/app/(public)/page.tsx)
  - live query boundary: [DashboardLiveScreen.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/DashboardLiveScreen.tsx)
  - shell and display components: `src/features/dashboard/components/*`
  - presenter shaping: [dashboard-presenter.js](/home/codexuser/bmad-6-workshop/src/features/dashboard/presenters/dashboard-presenter.js)
  - styling system: [globals.css](/home/codexuser/bmad-6-workshop/src/app/globals.css)
- The highest-risk structural mistakes for Story `5.3` are:
  - keeping locality comprehension trapped inside one map sentence or legend
  - widening Story `5.3` into the map-redesign work meant for Story `5.4`
  - introducing recommendation or route-planner copy while trying to make names more concrete
  - adding enough new panel chrome or prose to undermine the no-scroll board

### References

- `docs/epics.md#Epic 5: Public Display Clarity and Visual Redesign`
- `docs/epics.md#Story 5.3: Add Concrete Nearby Station and Locality References`
- `docs/prd.md#Success Criteria`
- `docs/prd.md#MVP - Minimum Viable Product`
- `docs/ux-design-specification.md` sections on nearby stations panel, fixed local map frame, implementation roadmap, and board-readability validation
- `docs/architecture.md` sections on public-display boundaries, component architecture, and implementation consistency
- `docs/sprint-change-proposal-2026-03-20.md`
- `docs/design-inputs/DESIGN.md`
- `docs/design-inputs/code.html`
- `docs/sprint-artifacts/1-5-anchor-the-display-with-a-fixed-local-map.md`
- `docs/sprint-artifacts/5-1-reframe-the-public-display-around-a-one-screen-status-first-board.md`
- `docs/sprint-artifacts/5-2-replace-verbose-mode-cards-with-compact-rag-transport-rows.md`
- `src/app/(public)/page.tsx`
- `src/app/globals.css`
- `src/features/dashboard/components/DashboardLiveScreen.tsx`
- `src/features/dashboard/components/DashboardScreen.tsx`
- `src/features/dashboard/components/ModeSummaryGrid.tsx`
- `src/features/dashboard/components/LocalMapFrame.tsx`
- `src/features/dashboard/presenters/dashboard-presenter.js`
- `src/features/dashboard/hooks/useDashboardQuery.ts`
- `src/features/dashboard/data/overall-departure-snapshot.js`
- `src/lib/contracts/dashboard-snapshot.js`
- `tests/unit/dashboard.presenter.test.mjs`
- `tests/smoke/startup-smoke.test.mjs`
- `package.json`
- official source checked 2026-03-23: `https://nextjs.org/docs/app/api-reference/components/font`
- official source checked 2026-03-23: `https://react.dev/reference/rsc/use-client`
- official source checked 2026-03-23: `https://tanstack.com/query/latest/docs/framework/react/reference/useQuery`
- official source checked 2026-03-23: `https://nodejs.org/en/about/previous-releases`

### Project Context Reference

- No `project-context.md` file exists in this repository at the time of story creation.
- If broader repository guardrails are needed later, run the BMAD `generate-project-context` workflow separately.

### Completion Status

- Story context assembled from Epic 5 planning artifacts, sprint tracking, the approved sprint change proposal, the completed Stories `1.5`, `5.1`, and `5.2` artifacts, the current dashboard code, package metadata, git history, and official documentation checked on 2026-03-23.
- The story is intentionally scoped to concrete nearby references as a first-class board layer, not to a full map redesign.
- The developer should treat the explicit nearby-names seam as shared infrastructure for Story `5.3` now and Story `5.4` later, while preserving the existing board shell and fact-only product doctrine.
- This story is ready for a dev agent to implement as the locality-comprehension correction layer of Epic 5.

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- `sed -n '1,260p' _bmad/bmm/agents/sm.md`
- `sed -n '1,320p' _bmad/core/tasks/workflow.xml`
- `sed -n '1,260p' _bmad/bmm/workflows/4-implementation/create-story/workflow.yaml`
- `sed -n '1,460p' _bmad/bmm/workflows/4-implementation/create-story/instructions.xml`
- `sed -n '1,260p' _bmad/bmm/workflows/4-implementation/create-story/template.md`
- `sed -n '1,260p' _bmad/bmm/workflows/4-implementation/create-story/checklist.md`
- `sed -n '720,845p' docs/epics.md`
- `sed -n '120,180p' docs/sprint-change-proposal-2026-03-20.md`
- `sed -n '640,725p' docs/ux-design-specification.md`
- `sed -n '1,260p' docs/sprint-artifacts/5-1-reframe-the-public-display-around-a-one-screen-status-first-board.md`
- `sed -n '1,260p' docs/sprint-artifacts/5-2-replace-verbose-mode-cards-with-compact-rag-transport-rows.md`
- `sed -n '1,260p' docs/sprint-artifacts/1-5-anchor-the-display-with-a-fixed-local-map.md`
- `sed -n '1,260p' src/features/dashboard/components/DashboardScreen.tsx`
- `sed -n '1,240p' src/features/dashboard/components/LocalMapFrame.tsx`
- `sed -n '1,260p' src/features/dashboard/presenters/dashboard-presenter.js`
- `sed -n '380,470p' src/features/dashboard/presenters/dashboard-presenter.js`
- `sed -n '1,240p' src/features/dashboard/data/overall-departure-snapshot.js`
- `sed -n '150,290p' src/lib/contracts/dashboard-snapshot.js`
- `sed -n '1,220p' tests/unit/dashboard.presenter.test.mjs`
- `sed -n '1,220p' tests/smoke/startup-smoke.test.mjs`
- `git log --oneline -5`
- `git status --short`
- `cat _bmad/core/tasks/workflow.xml`
- `cat _bmad/bmm/workflows/4-implementation/dev-story/workflow.yaml`
- `cat _bmad/bmm/workflows/4-implementation/dev-story/instructions.xml`
- `cat _bmad/bmm/workflows/4-implementation/dev-story/checklist.md`
- `cat docs/sprint-artifacts/sprint-status.yaml`
- `find . -name project-context.md -print`
- `sed -n '1,320p' src/app/globals.css`
- `sed -n '1,220p' src/features/dashboard/hooks/useDashboardQuery.ts`
- `npx vitest run tests/unit/dashboard.presenter.test.mjs`
- `node --test tests/smoke/startup-smoke.test.mjs`
- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run build`

### Implementation Plan

- Extend the dashboard snapshot contract with structured `nearbyReferences` data that can be reused by the board and map without adding a second locality path.
- Add a dedicated locality panel to the canonical lower grid and keep the reading order calm: nearby modes, named nearby references, then the existing map.
- Update presenter and fixture copy to surface concrete nearby names and retire generic locality labels while preserving fact-only language and the existing validation gate.

### Completion Notes

- Added structured `localMap.nearbyReferences` normalization and populated the Royal Institution fixture with concrete station, stop, and street references.
- Introduced a dedicated `LocalityReferencePanel` and inserted it into the existing board shell between the compact nearby rows and the fixed local map.
- Updated the presenter to expose board-ready locality references, a compact summary, and calmer map captions without `Nearby node` wording.
- Extended regression coverage in unit and smoke tests to lock in the explicit locality panel, concrete names, and fact-only language guardrails.
- Validation complete: `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build`.

## File List

- `src/lib/contracts/dashboard-snapshot.js`
- `src/features/dashboard/data/overall-departure-snapshot.js`
- `src/features/dashboard/presenters/dashboard-presenter.js`
- `src/features/dashboard/components/DashboardScreen.tsx`
- `src/features/dashboard/components/LocalityReferencePanel.tsx`
- `src/features/dashboard/hooks/useDashboardQuery.ts`
- `src/app/globals.css`
- `tests/unit/dashboard.presenter.test.mjs`
- `tests/smoke/startup-smoke.test.mjs`
- `docs/sprint-artifacts/5-3-add-concrete-nearby-station-and-locality-references.md`
- `docs/sprint-artifacts/sprint-status.yaml`

## Change Log

- `2026-03-23`: Implemented Story 5.3 by adding a dedicated nearby references panel, extending the snapshot and presenter locality seam, refreshing fixture locality copy, and adding regression coverage for concrete nearby names.
- `2026-03-23`: Senior developer review fixed locality fallback coverage, bound the panel heading to presenter output, reran validation, and closed the story.

## Senior Developer Review (AI)

### Reviewer

Workshop

### Date

2026-03-23

### Outcome

Approved after fixes.

### Findings Fixed

1. `HIGH`: [dashboard-presenter.js](/home/codexuser/bmad-6-workshop/src/features/dashboard/presenters/dashboard-presenter.js) allowed the new locality panel to render with no named references whenever `localMap.nearbyReferences` narrowed to an empty array. The presenter now backfills calm named references from `selectedNearbyNodes`, preserving visible locality cues instead of empty panel chrome.
2. `MEDIUM`: [LocalityReferencePanel.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/LocalityReferencePanel.tsx) hardcoded the heading instead of using `viewModel.heading`, which broke the presenter-to-component seam Story 5.3 was supposed to formalize. The component now renders the heading from the supplied view model.
3. `MEDIUM`: The story artifact remained in `review` and had no required review record after validation had already passed. The story status, review notes, change log, and sprint tracker are now synchronized.

### Validation

- `npm run lint`
- `npm run typecheck`
- `npm test -- --runInBand`
- `npm run build`
