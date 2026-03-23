# Story 5.5: Revalidate the Public Screen Against Board-Readability Criteria

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As the product team,
I want the redesigned public display validated against explicit board-readability criteria,
so that the screen is only treated as acceptable when it is actually clear, beautiful, and usable in the foyer context.

## Acceptance Criteria

1. Given the redesigned public screen is ready for review, when it is tested on the target display context, then the default view is no-scroll, the overall status is legible at room scale, and concrete nearby references are understandable within 10 seconds.
2. Given the redesigned public screen is reviewed for clarity, when the board is read as a public information surface, then repeated explanatory prose no longer drives comprehension, and labels, hierarchy, and compact status language carry the main meaning.
3. Given stakeholder review is rerun, when the board is assessed for presentation readiness, then it is accepted only if it reads like a clear public information board, and any remaining clarity or beauty failure keeps Epic 5 open.
4. Given Epic 5.1 through 5.4 are already implemented on the canonical public route, when validation work is added, then it extends the existing board, presenter, and test seams rather than creating a parallel prototype, alternate route, or ad hoc acceptance checklist outside the repo.

## Tasks / Subtasks

- [x] Define the explicit board-readability validation rubric in repo-owned form. (AC: 1, 2, 3)
  - [x] Create or update a focused validation artifact under `docs/sprint-artifacts/` that records the target review conditions, the no-scroll rule, the `2-3 second` far-read expectation, the `5-10 second` nearby-reference comprehension expectation, and the anti-repetition copy rule. (AC: 1, 2, 3)
  - [x] Frame the rubric around foyer-readability acceptance, not generic UI polish or dashboard preference. (AC: 2, 3)
  - [x] Make the acceptance evidence explicit enough that Epic 5 can stay open if the board still misses the agreed clarity bar. (AC: 3)
- [x] Add regression guardrails that prove the current board still satisfies the canonical no-scroll public-board contract. (AC: 1, 2, 4)
  - [x] Extend [startup-smoke.test.mjs](/home/codexuser/bmad-6-workshop/tests/smoke/startup-smoke.test.mjs) so the public route is required to preserve the one-screen board shell, nearby locality references, passive map behavior, and anti-prose posture established by Stories `5.1` through `5.4`. (AC: 1, 2, 4)
  - [x] Add any narrowly scoped source-inspection checks needed to catch regressions toward repeated explanatory copy, board overflow, map dominance, or planner-like wording. (AC: 1, 2, 4)
  - [x] Keep the checks attached to the canonical route and component seams already used by Epic 5, not a second validation-only UI. (AC: 4)
- [x] Add presenter- or contract-level tests only where they protect the readability criteria directly. (AC: 1, 2, 4)
  - [x] Extend [dashboard.presenter.test.mjs](/home/codexuser/bmad-6-workshop/tests/unit/dashboard.presenter.test.mjs) to lock in concise board-facing copy, concrete nearby-reference output, and the continued absence of advisory or repeated explanatory language. (AC: 1, 2, 4)
  - [x] Reuse the existing snapshot, presenter, and public-copy guardrails before introducing any new view-model field. (AC: 2, 4)
  - [x] If a small new presenter field is unavoidable for acceptance evidence, keep it narrowly scoped to readability validation rather than widening the product truth model. (AC: 4)
- [x] Capture stakeholder-facing acceptance evidence for the finished Epic 5 board. (AC: 1, 2, 3)
  - [x] Record the final review against the target display context, including whether the board stays no-scroll, whether the overall state reads at room scale, and whether nearby references and map cues support comprehension within the required time window. (AC: 1, 2, 3)
  - [x] Call out any remaining beauty or clarity failure explicitly instead of silently closing Epic 5. (AC: 3)
  - [x] Keep the evidence repo-local and implementation-linked so future review does not depend on memory or informal commentary. (AC: 3, 4)
- [x] Verify the story through the standard local validation gate before handoff. (AC: 1, 2, 3, 4)
  - [x] Run `npm run lint`. (AC: 4)
  - [x] Run `npm run typecheck`. (AC: 4)
  - [x] Run `npm test`. (AC: 4)
  - [x] Run `npm run build`. (AC: 4)

## Dev Notes

### Developer Context

- Story `5.5` is the final implementation story in `Epic 5: Public Display Clarity and Visual Redesign`.
- Stories `5.1` through `5.4` already changed the product itself:
  - `5.1` reframed the screen as a one-screen status-first board
  - `5.2` converted nearby modes into compact RAG-style transport rows
  - `5.3` added concrete nearby station and locality references
  - `5.4` made the local map practically useful instead of decorative
- Story `5.5` should not reopen that redesign unless validation exposes a concrete remaining failure. Its main job is to prove whether the finished board actually meets the corrected acceptance bar.
- The approved Epic 5 planning artifacts define the final acceptance target:
  - the public screen must behave like a clear public information board rather than a verbose dashboard
  - the default public view must fit without scroll at the target foyer viewport
  - a `2-3 second` far read must make overall status, warning state, and strongest nearby read obvious
  - a `5-10 second` close read must make concrete nearby references understandable to unfamiliar viewers
  - labels, hierarchy, compact status language, and recognisable locality cues must carry more meaning than explanatory paragraphs
- Current implementation evidence makes Story `5.5` explicitly a validation-and-acceptance story:
  - [DashboardScreen.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/DashboardScreen.tsx) already contains the canonical header, nearby-mode, locality, and map zones
  - [LocalMapFrame.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/LocalMapFrame.tsx) already renders the passive Royal Institution-centered orientation surface that Story `5.4` corrected
  - [startup-smoke.test.mjs](/home/codexuser/bmad-6-workshop/tests/smoke/startup-smoke.test.mjs) already acts as the source-inspection regression gate for public-route promises
  - [dashboard.presenter.test.mjs](/home/codexuser/bmad-6-workshop/tests/unit/dashboard.presenter.test.mjs) already protects fact-only public copy and concrete locality data
- Success for Story `5.5` is:
  - the team has explicit evidence that the board meets the corrected foyer-standard
  - remaining readability failures, if any, are documented clearly enough to keep Epic 5 open
  - regression tests now protect the board-readability bar that prompted Epic 5 in the first place

### Technical Requirements

- Treat this as a validation story first, not another broad redesign story.
  - prefer acceptance evidence, targeted copy tightening, and regression guardrails
  - do not widen scope into a new shell, map system, or alternate layout unless validation shows a specific blocker
- Keep the readability criteria concrete and implementation-linked.
  - encode no-scroll board expectations in repo-owned docs and tests
  - verify the canonical public route rather than hand-waving about design intent
  - tie any acceptance notes back to the actual board seams in source
- Preserve the product doctrine while validating it.
  - one passive public board
  - fact-only wording
  - no route-planner, recommendation, or ops-console behavior
  - clear status hierarchy, concrete locality, and calm public readability
- Prefer reusing existing seams before adding new ones.
  - first extend smoke tests, presenter tests, and sprint-artifact evidence
  - only add a narrowly scoped new artifact or field when the current seams cannot express the acceptance evidence cleanly
- Keep failure handling honest.
  - if the board still misses beauty, clarity, no-scroll, or close-read comprehension standards, document that directly
  - do not treat Epic 5 as complete on the strength of implementation effort alone

### Architecture Compliance

- Stay inside the approved modular-monolith and BFF structure:
  - public route composition remains in [page.tsx](/home/codexuser/bmad-6-workshop/src/app/(public)/page.tsx)
  - public display UI remains under `src/features/dashboard/components/*`
  - presenter shaping remains under `src/features/dashboard/presenters/*`
  - snapshot contract ownership remains under `src/lib/contracts/*`
  - acceptance notes and implementation-linked evidence remain under `docs/sprint-artifacts/*`
- Preserve one canonical public-display path.
  - do not create a separate review-only route, prototype screen, or alternate board variant for validation
  - do not bypass the presenter with ad hoc route-local copy just to satisfy tests
- Keep validation attached to the same public-display structure that architecture already maps to shared readability:
  - `DashboardScreen.tsx`
  - `LocalityReferencePanel.tsx`
  - `ModeSummaryGrid.tsx`
  - `LocalMapFrame.tsx`
  - `dashboard-presenter.js`
  - `dashboard-snapshot.js`
- Respect the architecture rule that the public display remains passive and non-interactive.
  - no review-time controls, tabs, overlays, or debug affordances may leak into the public board

### Library / Framework Requirements

- Stay aligned with the repo baseline:
  - `next` `16.1.7`
  - `react` `19.2.3`
  - `react-dom` `19.2.3`
  - `@tanstack/react-query` `^5.0.0`
  - `zod` `^4.3.6`
  - `node` `24.x`
  - local `vitest` package via `tools/vitest-lite`
- Use the existing repo validation stack:
  - smoke checks in `node --test`
  - unit checks in `vitest`
  - standard repo gates through `lint`, `typecheck`, `test`, and `build`
- Do not add a screenshot harness, visual-regression platform, third-party test runner, or alternate public-display runtime for this story unless validation reveals a real gap that the current stack cannot cover.
- Official-source checks completed on 2026-03-23:
  - Next.js docs continue to support `next/font` and App Router conventions, reinforcing that any last-mile board refinements should stay in the existing app structure rather than adding a second runtime path: https://nextjs.org/docs/app/api-reference/components/font
  - React's `'use client'` reference still reinforces a clear server/client boundary, supporting continued use of the current presenter-driven public route rather than moving acceptance logic into ad hoc client state: https://react.dev/reference/rsc/use-client
  - TanStack Query's latest React docs still document the current query model, so Story `5.5` should keep validation attached to the existing polling path rather than creating a separate live-data mechanism: https://tanstack.com/query/latest/docs/react/
  - Node.js release information still lists `v24` as an active supported line, which remains aligned with the repo runtime contract: https://nodejs.org/en/about/previous-releases
- Inference from those sources: there is no stack-level reason to introduce a new validation framework or alternate UI path. The safest implementation is to validate and tighten the existing board in place.

### File Structure Requirements

- Expected primary implementation files:
  - [tests/smoke/startup-smoke.test.mjs](/home/codexuser/bmad-6-workshop/tests/smoke/startup-smoke.test.mjs)
  - [tests/unit/dashboard.presenter.test.mjs](/home/codexuser/bmad-6-workshop/tests/unit/dashboard.presenter.test.mjs)
  - [docs/sprint-artifacts/5-5-revalidate-the-public-screen-against-board-readability-criteria.md](/home/codexuser/bmad-6-workshop/docs/sprint-artifacts/5-5-revalidate-the-public-screen-against-board-readability-criteria.md)
- Supporting files that may need targeted updates:
  - [src/features/dashboard/components/DashboardScreen.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/DashboardScreen.tsx)
  - [src/features/dashboard/components/ModeSummaryGrid.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/ModeSummaryGrid.tsx)
  - [src/features/dashboard/components/LocalityReferencePanel.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/LocalityReferencePanel.tsx)
  - [src/features/dashboard/components/LocalMapFrame.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/LocalMapFrame.tsx)
  - [src/features/dashboard/presenters/dashboard-presenter.js](/home/codexuser/bmad-6-workshop/src/features/dashboard/presenters/dashboard-presenter.js)
  - [src/lib/contracts/dashboard-snapshot.js](/home/codexuser/bmad-6-workshop/src/lib/contracts/dashboard-snapshot.js) only if a narrow readability-evidence field is truly unavoidable
  - [src/app/globals.css](/home/codexuser/bmad-6-workshop/src/app/globals.css) only if a small final readability correction is exposed by validation
  - a dedicated Epic 5 validation-notes artifact under `docs/sprint-artifacts/` if the acceptance evidence is clearer as a separate file
- Keep route and boundary files stable unless a small correction is strictly required:
  - [src/app/(public)/page.tsx](/home/codexuser/bmad-6-workshop/src/app/(public)/page.tsx)
  - [src/features/dashboard/components/DashboardLiveScreen.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/DashboardLiveScreen.tsx)
  - [src/features/dashboard/hooks/useDashboardQuery.ts](/home/codexuser/bmad-6-workshop/src/features/dashboard/hooks/useDashboardQuery.ts)
- Do not create:
  - a second public board implementation
  - a review-only route or design prototype under `src/`
  - a planner-style acceptance surface, screenshot dashboard, or ops-state overlay for public validation

### Testing Requirements

- Minimum verification:
  - `npm run lint`
  - `npm run typecheck`
  - `npm test`
  - `npm run build`
- Focused regression expectations for Story `5.5`:
  - the public board still fits the canonical one-screen shell contract
  - overall status remains visually primary in the board structure
  - concrete nearby references remain explicit and readable
  - the map remains passive, local, and subordinate to the board hierarchy
  - repeated explanatory prose does not retake control of comprehension
  - no planner-like or advisory language appears in public copy
- Add or update source-level tests where they protect the most important regressions:
  - smoke tests for one-screen board structure, locality presence, passive map behavior, and anti-prose guardrails
  - presenter tests for concrete named references, concise board-facing copy, and fact-only wording
  - targeted source-inspection checks only where they lock in the specific Epic 5 readability corrections
- Do not rely on brittle pixel-diff or screenshot-only acceptance for this story. The evidence should be readable, repeatable, and tied to the repo's normal verification path.

### Previous Story Intelligence

- From Story `5.4`:
  - the map has already been redesigned toward practical local orientation
  - Story `5.5` should validate whether that map now earns its space instead of reopening map fundamentals by default
  - the locality panel and map are already meant to reinforce one another rather than duplicate the same explanation
- From Story `5.3`:
  - concrete nearby names are now first-class board content
  - Story `5.5` should verify those names remain easy to notice and discuss, not collapse back into hidden legend detail or vague prose
- From Story `5.2`:
  - compact RAG rows already replaced verbose mode cards
  - Story `5.5` should guard against regressions back toward card soup, repeated warning prose, or dashboard density
- From Story `5.1`:
  - the shell is already one-screen and status-first by design intent
  - Story `5.5` is where that intent becomes explicit acceptance evidence against the real foyer-standard
- Implementation implication:
  - validate the finished Epic 5 board as a whole
  - keep changes narrow and evidence-driven
  - only make corrective UI or copy edits where the validation work exposes a specific gap

### Git Intelligence Summary

- Recent commits confirm the Epic 5 sequence and show that Story `5.5` is the validation closeout step rather than a fresh redesign stream:
  - `778daf9 feat(epic-5): implement 5-4-redesign-the-local-map-for-practical-usefulness`
  - `f9f2a9e feat(epic-5): implement 5-3-add-concrete-nearby-station-and-locality-references`
  - `773df04 feat(epic-5): implement 5-2-replace-verbose-mode-cards-with-compact-rag-transport-rows`
  - `8332672 feat(epic-4): close review debt and sync release readiness`
  - `3cc4ef6 feat(epic-3): implement 3-5-recover-the-display-after-interruption-or-restart`
- The current worktree is dirty only from a log artifact outside the Epic 5 source and docs area. Story `5.5` should work with the current codebase and must not revert unrelated generated files.
- Strong implementation implication:
  - treat the current board as the product under test
  - extend evidence and regression guardrails from the completed Epic 5 implementation
  - keep closure criteria explicit so release readiness does not drift back to assumption

### Latest Tech Information

- Official-source checks on 2026-03-23 did not reveal any stack change that alters Story `5.5`'s implementation path.
  - Next.js App Router remains compatible with the repo's public-route and component structure.
  - React's current client-boundary guidance still supports presenter-owned public-display logic.
  - TanStack Query still supports the existing calm polling path used by the board.
  - Node `24` remains aligned with the repo runtime contract.
- Inference: there is no technical justification to add a new visual-regression service, UI runtime, or validation stack for this story. The correct approach is to validate and, if needed, tighten the existing board in place.

### Project Structure Notes

- The public-display implementation remains intentionally narrow:
  - route entry: [page.tsx](/home/codexuser/bmad-6-workshop/src/app/(public)/page.tsx)
  - live query boundary: [DashboardLiveScreen.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/DashboardLiveScreen.tsx)
  - board shell and components: `src/features/dashboard/components/*`
  - presenter shaping: [dashboard-presenter.js](/home/codexuser/bmad-6-workshop/src/features/dashboard/presenters/dashboard-presenter.js)
  - styling system: [globals.css](/home/codexuser/bmad-6-workshop/src/app/globals.css)
  - acceptance and sprint evidence: `docs/sprint-artifacts/*`
- The highest-risk structural mistakes for Story `5.5` are:
  - creating a validation-only screen instead of validating the real board
  - writing a vague acceptance note with no source-linked evidence
  - quietly accepting remaining readability failures instead of keeping Epic 5 open
  - weakening prior Epic 5 guardrails while trying to document final signoff

### References

- `docs/epics.md#Epic 5: Public Display Clarity and Visual Redesign`
- `docs/epics.md#Story 5.5: Revalidate the Public Screen Against Board-Readability Criteria`
- `docs/prd.md#Success Criteria`
- `docs/prd.md#MVP - Minimum Viable Product`
- `docs/ux-design-specification.md` sections on design rationale, implementation approach, fixed local map frame, and public readability
- `docs/architecture.md` sections on architectural boundaries, requirements-to-structure mapping, and implementation readiness
- `docs/sprint-change-proposal-2026-03-20.md`
- `docs/sprint-artifacts/5-1-reframe-the-public-display-around-a-one-screen-status-first-board.md`
- `docs/sprint-artifacts/5-2-replace-verbose-mode-cards-with-compact-rag-transport-rows.md`
- `docs/sprint-artifacts/5-3-add-concrete-nearby-station-and-locality-references.md`
- `docs/sprint-artifacts/5-4-redesign-the-local-map-for-practical-usefulness.md`
- `docs/sprint-artifacts/sprint-status.yaml`
- `src/app/(public)/page.tsx`
- `src/app/globals.css`
- `src/features/dashboard/components/DashboardLiveScreen.tsx`
- `src/features/dashboard/components/DashboardScreen.tsx`
- `src/features/dashboard/components/ModeSummaryGrid.tsx`
- `src/features/dashboard/components/LocalityReferencePanel.tsx`
- `src/features/dashboard/components/LocalMapFrame.tsx`
- `src/features/dashboard/presenters/dashboard-presenter.js`
- `src/features/dashboard/hooks/useDashboardQuery.ts`
- `src/lib/contracts/dashboard-snapshot.js`
- `src/features/dashboard/data/overall-departure-snapshot.js`
- `tests/unit/dashboard.presenter.test.mjs`
- `tests/smoke/startup-smoke.test.mjs`
- `package.json`
- official source checked 2026-03-23: `https://nextjs.org/docs/app/api-reference/components/font`
- official source checked 2026-03-23: `https://react.dev/reference/rsc/use-client`
- official source checked 2026-03-23: `https://tanstack.com/query/latest/docs/react/`
- official source checked 2026-03-23: `https://nodejs.org/en/about/previous-releases`

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- `sed -n '1,220p' .codex/skills/bmad-agent-bmm-sm/SKILL.md`
- `sed -n '1,260p' .codex/skills/bmad-bmm-create-story/SKILL.md`
- `sed -n '1,260p' _bmad/bmm/agents/sm.md`
- `sed -n '1,260p' _bmad/bmm/config.yaml`
- `sed -n '1,320p' _bmad/core/tasks/workflow.xml`
- `sed -n '1,320p' _bmad/bmm/workflows/4-implementation/create-story/workflow.yaml`
- `cat _bmad/bmm/workflows/4-implementation/create-story/instructions.xml`
- `cat _bmad/bmm/workflows/4-implementation/create-story/template.md`
- `cat _bmad/bmm/workflows/4-implementation/create-story/checklist.md`
- `sed -n '1,260p' docs/sprint-artifacts/sprint-status.yaml`
- `sed -n '810,860p' docs/epics.md`
- `sed -n '120,220p' docs/sprint-change-proposal-2026-03-20.md`
- `sed -n '430,470p' docs/ux-design-specification.md`
- `sed -n '680,740p' docs/ux-design-specification.md`
- `sed -n '540,720p' docs/architecture.md`
- `sed -n '1,260p' docs/sprint-artifacts/5-1-reframe-the-public-display-around-a-one-screen-status-first-board.md`
- `sed -n '1,260p' docs/sprint-artifacts/5-2-replace-verbose-mode-cards-with-compact-rag-transport-rows.md`
- `sed -n '1,260p' docs/sprint-artifacts/5-3-add-concrete-nearby-station-and-locality-references.md`
- `sed -n '1,260p' docs/sprint-artifacts/5-4-redesign-the-local-map-for-practical-usefulness.md`
- `sed -n '1,220p' package.json`
- `sed -n '1,260p' src/features/dashboard/components/DashboardScreen.tsx`
- `sed -n '1,260p' src/features/dashboard/components/LocalMapFrame.tsx`
- `sed -n '1,260p' tests/smoke/startup-smoke.test.mjs`
- `sed -n '1,260p' tests/unit/dashboard.presenter.test.mjs`
- `git log --oneline -5`
- `git status --short`
- `rg -n "project-context\\.md" -S .`
- `cat _bmad/bmm/workflows/4-implementation/dev-story/instructions.xml`
- `cat _bmad/bmm/workflows/4-implementation/dev-story/checklist.md`
- `cat docs/sprint-artifacts/5-5-revalidate-the-public-screen-against-board-readability-criteria.md`
- `cat docs/sprint-artifacts/1-6-display-verification-notes.md`
- `cat docs/sprint-artifacts/2-5-live-reading-verification-notes.md`
- `cat src/features/dashboard/components/AtmosphericHeader.tsx`
- `cat src/features/dashboard/data/overall-departure-snapshot.js`
- `node --test tests/smoke/startup-smoke.test.mjs`
- `npm run test:unit -- tests/unit/dashboard.presenter.test.mjs`
- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run build`

### Completion Notes List

- Story context assembled from Epic 5 planning artifacts, current sprint tracking, Epic 5 predecessor stories, the implemented public-board code seams, package metadata, git history, and official documentation checked on 2026-03-23.
- The story is intentionally scoped to validation evidence, regression guardrails, and explicit acceptance review for the finished Epic 5 board rather than another broad redesign pass.
- No `project-context.md` file exists in this repository at the time of story creation.
- The developer should treat any remaining UI edits as evidence-driven corrections discovered through validation, not as an excuse to reopen solved Epic 5 scope.
- Added `docs/sprint-artifacts/5-5-public-board-readability-validation.md` as the repo-owned foyer-readability rubric and final acceptance record for the canonical public board.
- Extended `tests/smoke/startup-smoke.test.mjs` to lock the Story 5.5 no-scroll board contract, anti-planner language, and repo-local validation evidence to the existing public route and component seams.
- Extended `tests/unit/dashboard.presenter.test.mjs` and tightened presenter support copy so the board-facing view model stays concise, concrete, and free of repeated explanatory language.
- Validation passed locally on 2026-03-23 with `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build`.
- The validation run refreshed `runtime/snapshots/dashboard-snapshot.json` and `runtime/snapshots/dashboard-history.json` as generated runtime artifacts.
- Code review rerun on 2026-03-23 tightened the supported-desktop no-scroll board contract in `src/app/globals.css` and replaced the permissive Story 5.5 smoke assertion with an explicit desktop-shell check.

### File List

- `docs/sprint-artifacts/5-5-revalidate-the-public-screen-against-board-readability-criteria.md`
- `docs/sprint-artifacts/5-5-public-board-readability-validation.md`
- `docs/sprint-artifacts/sprint-status.yaml`
- `src/app/globals.css`
- `src/features/dashboard/data/overall-departure-snapshot.js`
- `src/features/dashboard/presenters/dashboard-presenter.js`
- `tests/smoke/startup-smoke.test.mjs`
- `tests/unit/dashboard.header.test.mjs`
- `tests/unit/dashboard.presenter.test.mjs`
- `runtime/snapshots/dashboard-history.json`
- `runtime/snapshots/dashboard-snapshot.json`

### Change Log

- 2026-03-23: Added a repo-owned Story 5.5 foyer-readability rubric and acceptance record for the canonical public board.
- 2026-03-23: Added Story 5.5 smoke and presenter guardrails for the no-scroll board shell, concrete nearby references, concise board-facing copy, and anti-planner/anti-prose posture.
- 2026-03-23: Tightened the presenter support line to `Weather and movement align nearby.` and reran `lint`, `typecheck`, `test`, and `build` successfully.
- 2026-03-23: Code review closed the weak no-scroll guard by pinning the supported desktop board to a one-screen shell in `globals.css` and updating the Story 5.5 smoke/header tests to assert that exact contract.
