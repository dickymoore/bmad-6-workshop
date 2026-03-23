# Story 5.1: Reframe the Public Display Around a One-Screen Status-First Board

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visitor preparing to leave,
I want the public display to read as a one-screen status-first board,
so that I can understand the departure picture without scrolling or decoding paragraphs.

## Acceptance Criteria

1. Given the screen is shown on the target foyer display, when the default public view loads, then the core display fits within one screen without scrolling, and the overall status, one dominant warning or reassurance cue, nearby mode field, locality reference, and map are all visible in one coherent composition.
2. Given a user looks from across the room, when they scan the screen for 2-3 seconds, then the top summary makes the overall state immediately clear, and the hierarchy reads status-first rather than paragraph-first.
3. Given the public display is refreshed against the existing dashboard snapshot, when the new layout is rendered, then it preserves the product's fact-only contract, calm live-update behavior, and truthful degraded-state behavior without introducing route-planner or advisory language.
4. Given the redesign is implemented, when the team reviews the board against the approved Epic 5 design direction and external design input, then the new shell clearly moves toward the Civic Editorial / public-board target while staying implementable in the current Next.js, presenter, and snapshot architecture.

## Tasks / Subtasks

- [x] Reframe the public-screen shell around a one-screen, status-first composition. (AC: 1, 2)
  - [x] Replace the current tall, prose-heavy header-plus-lower-grid emphasis with a board-style shell that makes the first read status-first and keeps the primary zones visible without scroll at the target foyer viewport. (AC: 1, 2)
  - [x] Introduce a top summary / status bar pattern that surfaces the overall state, one dominant warning or reassurance cue, and compact live-status context before any paragraph-length explanation. (AC: 1, 2)
  - [x] Keep the nearby mode field, locality reference, and map present in the initial viewport while reducing vertical sprawl and duplicated explanatory copy. (AC: 1, 2)
- [x] Adapt the approved external design input into the existing product and codebase constraints. (AC: 2, 4)
  - [x] Use [DESIGN.md](/home/codexuser/bmad-6-workshop/docs/design-inputs/DESIGN.md), [code.html](/home/codexuser/bmad-6-workshop/docs/design-inputs/code.html), and [screen.png](/home/codexuser/bmad-6-workshop/docs/design-inputs/screen.png) as design references for hierarchy, typography pairing, tonal layering, and status prominence. (AC: 2, 4)
  - [x] Translate the external reference into the repo’s actual implementation stack rather than copying the Tailwind CDN prototype literally; keep the result in the existing Next.js app, global CSS, and dashboard component system. (AC: 4)
  - [x] Preserve the current fact-only doctrine by treating the mock’s "concierge" feel as visual direction only, not as permission to add recommendation or route-advice behavior. (AC: 3, 4)
- [x] Narrow the current public-display copy and emphasis so the shell behaves like a board instead of a narrative screen. (AC: 1, 2, 3)
  - [x] Collapse repeated trust, freshness, carried-forward, and currentness wording into one concise cue per affected area at the shell level. (AC: 1, 2, 3)
  - [x] Keep room-scale labels, status chips, and structural emphasis visually primary over sentence-length summaries. (AC: 2, 3)
  - [x] Leave deeper per-mode row redesign, expanded station naming, and map-specific overhaul to Stories `5.2`, `5.3`, and `5.4` unless a small enabling change is strictly required for shell coherence. (AC: 1, 4)
- [x] Implement the Story 5.1 shell changes in the canonical dashboard seams only. (AC: 1, 3, 4)
  - [x] Update the public display composition in `src/features/dashboard/components/DashboardScreen.tsx`, `src/features/dashboard/components/AtmosphericHeader.tsx`, and the related dashboard styling path without creating a second public screen implementation. (AC: 1, 3, 4)
  - [x] Adjust presenter-facing copy shaping only where needed to support status-first hierarchy and reduced duplication, while preserving the snapshot contract and existing data truth model for later Epic 5 stories. (AC: 2, 3)
  - [x] Keep `src/app/(public)/page.tsx` as a thin route and do not move data-derivation or security logic into the public component tree. (AC: 3)
- [x] Verify one-screen readability and shell integrity before handoff. (AC: 1, 2, 3, 4)
  - [x] Run `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build`. (AC: 3, 4)
  - [x] Add or update focused tests so the public-screen composition still includes the canonical status-first shell, live screen path, and fact-only public wording expectations. (AC: 2, 3, 4)
  - [x] Record any remaining design gaps that are intentionally deferred to Stories `5.2`, `5.3`, `5.4`, or `5.5` so Story `5.1` closes as a shell reframe rather than an unfinished mega-redesign. (AC: 4)

## Dev Notes

### Developer Context

- Story `5.1` is the first implementation story in `Epic 5: Public Display Clarity and Visual Redesign`. Its job is to correct the board-level shell, first-read hierarchy, and no-scroll composition before the follow-on stories deepen mode rows, station naming, and map usefulness.
- The immediate trigger is direct stakeholder rejection of the live public display running at `http://localhost:3000/`. The approved Sprint Change Proposal records the key failures:
  - the page does not behave like a clear one-screen information board
  - the public view requires scrolling
  - the layout is too text-heavy and paragraph-driven
  - status is not obvious in public-signage terms
  - nearby stations, stops, and concrete locality are too weak
  - the map does not currently earn its space as a useful orientation aid
- Governing product and UX constraints already changed to reflect that rejection:
  - `docs/prd.md` now requires one-screen readability, compact public-signage emphasis, and concrete nearby references
  - `docs/ux-design-specification.md` now requires a status-first shell, strict copy budgets, compact alerting, and a no-scroll first impression
  - `docs/epics.md` places Story `5.1` before the more specific row, locality, and map corrections in Stories `5.2` through `5.4`
- Strong implication: Story `5.1` should solve shell-level comprehension and hierarchy first, not try to complete the whole Epic 5 redesign in one pass.
- The current public-display implementation seams are already narrow and explicit:
  - `src/app/(public)/page.tsx` is the route entry and should remain thin
  - `src/features/dashboard/components/DashboardLiveScreen.tsx` wires live query data into the presenter and screen
  - `src/features/dashboard/components/DashboardScreen.tsx` defines the top-level public shell
  - `src/features/dashboard/components/AtmosphericHeader.tsx`, `ModeSummaryGrid.tsx`, `ModeSummaryCard.tsx`, and `LocalMapFrame.tsx` are the current composition pieces that produce most of the prose-heavy surface
  - `src/features/dashboard/presenters/dashboard-presenter.js` shapes the view-model copy and labels
  - `src/app/globals.css` currently holds the public-display visual system
- Existing implementation evidence shows why the screen feels too verbose:
  - the presenter currently emits long narrative phrases like `Calm across the Royal Institution threshold`, `From here, now: the nearby departure modes are reading as follows.`, and repeated trust/currentness detail
  - `AtmosphericHeader.tsx` currently renders multiple sentence-length summaries and trust lines before the user reaches the nearby board content
  - `ModeSummaryCard.tsx` currently renders summary, nuance, source-status detail, trust detail, and change summary in every mode card
  - `LocalMapFrame.tsx` still presents the local frame as a narrative panel with a stylized SVG treatment rather than an obviously useful board element
- The external design input is now part of the approved implementation context:
  - `docs/design-inputs/DESIGN.md` defines the design-system intent as `The Civic Editorial`
  - `docs/design-inputs/code.html` provides a concrete reference for one-screen board layout, dual-voice typography, tonal layering, and compact status-led sections
  - `docs/design-inputs/screen.png` provides the visual target reference
- That external design input is authoritative as visual and layout guidance, but not as a literal code template.
  - It uses Tailwind CDN classes and external font links in a standalone HTML prototype
  - the real implementation must stay inside the repo’s Next.js app, global CSS, presenter layer, and dashboard component structure
  - use the design input for hierarchy, typography direction, tonal nesting, and board composition rather than copying the HTML wholesale
- Scope boundaries for Story `5.1`:
  - do not add route-planner behavior, recommendations, or advisory copy
  - do not create a second public screen implementation or bypass the presenter
  - do not widen into a full data-model rewrite if the shell can be improved using existing snapshot fields
  - do not treat Story `5.1` as the final solution for mode-row detail, named station density, or map fidelity; those are explicitly continued by Stories `5.2`, `5.3`, and `5.4`
- Success for Story `5.1` is:
  - the public display fits as a coherent no-scroll board at the target viewport
  - the first read is clearly status-first
  - the current screen’s repeated explanatory copy is materially reduced
  - the design moves visibly toward the approved Civic Editorial / information-board direction
  - the implementation remains aligned with the existing snapshot, presenter, and live-update architecture

### Technical Requirements

- Treat Story `5.1` as a shell and hierarchy correction, not as the whole Epic 5 redesign.
  - solve one-screen composition, first-read status emphasis, and copy-density reduction now
  - defer deeper row-level transport redesign to Story `5.2`
  - defer expanded concrete locality content to Story `5.3`
  - defer map-fidelity and orientation overhaul to Story `5.4`
- Use the external design input as implementation guidance, not as literal source code.
  - reuse the layout ideas, typography pairing, tonal layering, and status prominence from `docs/design-inputs/DESIGN.md`, `docs/design-inputs/code.html`, and `docs/design-inputs/screen.png`
  - do not paste the Tailwind CDN prototype into the app
  - translate the design into the repo’s CSS and component model
- Preserve the fact-only product contract.
  - no route-planner language
  - no recommendation copy
  - no `best option`, `take this`, or advisory phrasing
  - keep public status grammar obvious while leaving the underlying product model non-prescriptive
- Reduce shell-level repetition and prose burden.
  - collapse repeated trust and currentness copy where one bounded cue will do
  - make room-scale labels, chips, and structural hierarchy carry more meaning than stacked summaries
  - keep calm live-update behavior without adding flashing, animated board churn, or dense notification patterns
- Prefer shell-level reuse over schema expansion.
  - first ask whether the board can be reframed with existing presenter fields and component reshaping
  - only add new presenter fields if a shell requirement cannot be expressed cleanly with the current view model
  - if new view-model fields are added, keep them narrowly scoped to composition rather than changing the core snapshot truth model
- Maintain clear deferral notes.
  - if a necessary visual compromise remains because Story `5.2`, `5.3`, or `5.4` owns the next layer of work, record it explicitly instead of broadening Story `5.1` quietly

### Architecture Compliance

- Stay within the approved modular-monolith and BFF architecture:
  - `src/app/(public)/page.tsx` remains a thin route
  - live data continues to come through `DashboardLiveScreen` and `useDashboardQuery`
  - server-side snapshot generation and normalization stay in `src/lib/server/dashboard/*`
  - presenter shaping stays in `src/features/dashboard/presenters/dashboard-presenter.js`
  - public rendering stays in `src/features/dashboard/components/*`
- Preserve one canonical public-display implementation path.
  - do not create a second public route
  - do not create a parallel experimental shell outside the existing dashboard components
  - do not bypass the presenter by embedding hard-coded display content directly in the route
- Keep business truth server-owned and presentation transformation presenter-owned.
  - no movement of freshness, trust, disruption, or recovery decisions into route-local React logic
  - no client-only recomputation of canonical dashboard state
- Respect the architecture rule that the screen stays fact-only and non-interactive for visitors.
  - Story `5.1` may make the board feel more like premium wayfinding, but not more like a kiosk or planner
  - no public action controls, filters, toggles, or drill-in affordances

### Library / Framework Requirements

- Stay aligned with the repo baseline:
  - `next` `16.1.7`
  - `react` `19.2.3`
  - `react-dom` `19.2.3`
  - `@tanstack/react-query` `^5.0.0`
  - `zod` `^4.3.6`
  - `node` `24.x`
  - local `vitest` package under `tools/vitest-lite`
- Use framework-native solutions where they fit the design shift.
  - if bringing in the new font pairing, prefer `next/font` rather than raw external `<link>` tags in the route shell
  - keep route-handler and public-route structure consistent with current Next.js App Router patterns
  - keep live query behavior on the existing TanStack Query polling path instead of inventing a new live-update mechanism
- Official-source checks completed on 2026-03-20:
  - Next.js App Router continues to support route files for custom handlers and `next/font` for first-class font loading, which supports keeping the redesign inside the current app structure and font pipeline: https://nextjs.org/docs/app/api-reference/file-conventions/route and https://nextjs.org/docs/app/api-reference/components/font
  - React’s `'use client'` guidance still keeps server and client responsibilities explicit, reinforcing that Story `5.1` should keep the public route thin and presenter-driven: https://react.dev/reference/rsc/use-client
  - TanStack Query’s React reference continues to support the current polling pattern with `refetchInterval`, which means the redesign should not alter the live-refresh mechanism just to change the shell: https://tanstack.com/query/latest/docs/framework/react/reference/useQuery
- Inference from those sources: the safest implementation is to redesign the shell inside the current App Router, global CSS, component, and presenter setup without adding a new styling framework or a second runtime path.

### File Structure Requirements

- Expected primary implementation files:
  - `src/features/dashboard/components/DashboardScreen.tsx`
  - `src/features/dashboard/components/AtmosphericHeader.tsx`
  - `src/features/dashboard/components/ModeSummaryGrid.tsx`
  - `src/features/dashboard/components/ModeSummaryCard.tsx`
  - `src/features/dashboard/components/LocalMapFrame.tsx`
  - `src/features/dashboard/presenters/dashboard-presenter.js`
  - `src/app/globals.css`
- Supporting files that may be touched if required by the shell redesign:
  - `src/app/layout.tsx` if the new board direction requires font loading or global shell-level class wiring
  - `tests/unit/dashboard.presenter.test.mjs`
  - `tests/unit/dashboard.live-path.test.mjs`
  - `tests/smoke/startup-smoke.test.mjs`
- Design-input references to inspect and cite during implementation:
  - `docs/design-inputs/DESIGN.md`
  - `docs/design-inputs/code.html`
  - `docs/design-inputs/screen.png`
- Do not create:
  - a standalone public-board prototype under `src/` that duplicates the real screen
  - a Tailwind setup just to mirror the external prototype
  - a separate CSS framework or design-system dependency for Story `5.1`

### Testing Requirements

- Minimum verification:
  - `npm run lint`
  - `npm run typecheck`
  - `npm test`
  - `npm run build`
- Focused regression expectations for Story `5.1`:
  - public route still renders through `DashboardLiveScreen` and `DashboardScreen`
  - the public shell remains one canonical display path
  - the presenter and snapshot contract remain fact-only
  - the redesigned shell preserves calm live-update behavior and does not add planner language
- Add or update focused tests where the redesign changes public-shell expectations:
  - presenter tests if summary labels, hierarchy labels, or shell-facing copy are intentionally changed
  - smoke tests if the public-screen composition contract or required component presence changes
  - unit or source-inspection tests only where they protect the canonical shell composition and fact-only wording expectations
- Validation should also include a manual design-integrity pass against the external reference:
  - confirm the new shell is no-scroll at the target viewport
  - confirm the overall status is visually dominant within 2-3 seconds
  - confirm the board is materially less paragraph-driven than before
  - confirm any deferred gaps are explicitly noted for Stories `5.2` to `5.5`

### Project Structure Notes

- The public-display implementation already lives in a stable, narrow slice of the repo:
  - route entry: `src/app/(public)/page.tsx`
  - live query wrapper: `src/features/dashboard/components/DashboardLiveScreen.tsx`
  - shell and display components: `src/features/dashboard/components/*`
  - public presentation shaping: `src/features/dashboard/presenters/dashboard-presenter.js`
  - public visual system: `src/app/globals.css`
- Story `5.1` should keep that structure intact and evolve the current shell rather than creating a separate prototype implementation inside `src/`.
- The external design assets are documentation inputs under `docs/design-inputs/`, not runtime source files.
- The highest-risk structural mistake would be introducing a parallel public-board implementation or slipping Tailwind-specific prototype code into the real app when the repo is already using global CSS and bespoke components.

### References

- `docs/epics.md#Story 5.1: Reframe the Public Display Around a One-Screen Status-First Board`
- `docs/prd.md`
- `docs/ux-design-specification.md`
- `docs/sprint-change-proposal-2026-03-20.md`
- `docs/sprint-artifacts/sprint-status.yaml`
- `docs/design-inputs/DESIGN.md`
- `docs/design-inputs/code.html`
- `docs/design-inputs/screen.png`
- `docs/architecture.md`
- `src/app/(public)/page.tsx`
- `src/app/layout.tsx`
- `src/app/globals.css`
- `src/features/dashboard/components/DashboardLiveScreen.tsx`
- `src/features/dashboard/components/DashboardScreen.tsx`
- `src/features/dashboard/components/AtmosphericHeader.tsx`
- `src/features/dashboard/components/ModeSummaryGrid.tsx`
- `src/features/dashboard/components/ModeSummaryCard.tsx`
- `src/features/dashboard/components/LocalMapFrame.tsx`
- `src/features/dashboard/presenters/dashboard-presenter.js`
- `src/features/dashboard/hooks/useDashboardQuery.ts`
- `src/lib/contracts/dashboard-snapshot.js`
- `src/features/dashboard/data/overall-departure-snapshot.js`
- `tests/unit/dashboard.presenter.test.mjs`
- `tests/unit/dashboard.live-path.test.mjs`
- `tests/smoke/startup-smoke.test.mjs`
- `package.json`
- official source checked 2026-03-20: `https://nextjs.org/docs/app/api-reference/file-conventions/route`
- official source checked 2026-03-20: `https://nextjs.org/docs/app/api-reference/components/font`
- official source checked 2026-03-20: `https://react.dev/reference/rsc/use-client`
- official source checked 2026-03-20: `https://tanstack.com/query/latest/docs/framework/react/reference/useQuery`

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- `sed -n '1,260p' _bmad/core/tasks/workflow.xml`
- `sed -n '1,260p' _bmad/bmm/workflows/4-implementation/create-story/workflow.yaml`
- `sed -n '1,360p' _bmad/bmm/workflows/4-implementation/create-story/instructions.xml`
- `sed -n '1,260p' _bmad/bmm/workflows/4-implementation/create-story/template.md`
- `sed -n '1,260p' _bmad/bmm/workflows/4-implementation/create-story/checklist.md`
- `sed -n '1,240p' _bmad/bmm/config.yaml`
- `sed -n '1,220p' docs/sprint-artifacts/sprint-status.yaml`
- `sed -n '740,860p' docs/epics.md`
- `sed -n '60,130p' docs/prd.md`
- `sed -n '60,160p' docs/ux-design-specification.md`
- `sed -n '520,820p' docs/ux-design-specification.md`
- `sed -n '1,260p' docs/sprint-change-proposal-2026-03-20.md`
- `sed -n '1,220p' docs/design-inputs/DESIGN.md`
- `sed -n '1,220p' docs/design-inputs/code.html`
- `ls -la docs/design-inputs`
- `sed -n '1,260p' package.json`
- `sed -n '1,220p' src/app/(public)/page.tsx`
- `sed -n '1,220p' src/app/layout.tsx`
- `sed -n '1,320p' src/app/globals.css`
- `sed -n '1,260p' src/features/dashboard/components/DashboardLiveScreen.tsx`
- `sed -n '1,320p' src/features/dashboard/components/DashboardScreen.tsx`
- `sed -n '1,260p' src/features/dashboard/components/AtmosphericHeader.tsx`
- `sed -n '1,260p' src/features/dashboard/components/ModeSummaryGrid.tsx`
- `sed -n '1,260p' src/features/dashboard/components/ModeSummaryCard.tsx`
- `sed -n '1,260p' src/features/dashboard/components/LocalMapFrame.tsx`
- `sed -n '1,520p' src/features/dashboard/presenters/dashboard-presenter.js`
- `sed -n '1,240p' src/features/dashboard/hooks/useDashboardQuery.ts`
- `sed -n '1,260p' src/lib/contracts/dashboard-snapshot.js`
- `sed -n '1,260p' src/features/dashboard/data/overall-departure-snapshot.js`
- `sed -n '1,260p' tests/unit/dashboard.presenter.test.mjs`
- `sed -n '1,220p' tests/unit/dashboard.header.test.mjs`
- `sed -n '1,260p' tests/unit/dashboard.live-path.test.mjs`
- `sed -n '1,420p' tests/smoke/startup-smoke.test.mjs`
- `git log --oneline -5`
- `git diff --stat`
- `git status --short`
- `find . -name 'project-context.md' -print`
- `test -f _bmad/core/tasks/validate-workflow.xml && echo __VALIDATE_EXISTS__ || echo __VALIDATE_MISSING__`
- `npm run lint`
- `npm run typecheck`
- `npm run test:smoke -- tests/smoke/startup-smoke.test.mjs`
- `npm run test:unit -- --run tests/unit/dashboard.presenter.test.mjs tests/unit/dashboard.live-path.test.mjs`
- `npm run test:unit -- --run tests/unit/dashboard.header.test.mjs`
- `npm run validate`

### Completion Notes List

- Story context assembled from the new Epic 5 planning artifacts, current sprint tracking, the approved Sprint Change Proposal, the current public-display implementation, the external design-input files, package metadata, repo structure, git history, and current official framework documentation checked on 2026-03-20.
- Implemented a compact editorial shell with a new board masthead, a status-first header card, condensed mode summaries, and a clearer nearby-stations locality panel while keeping the same public route, live query boundary, and snapshot truth model.
- Adapted the approved external design direction with `next/font` loading for `Noto Serif` plus `Inter` and translated the prototype’s tonal layering and hierarchy into the repo’s existing global CSS rather than importing Tailwind or copying the HTML directly.
- Added focused Story `5.1` smoke coverage for the new shell contract and updated the presenter/source-inspection assertion to match the more compact card semantics; full validation passed with `npm run validate`.
- Code review fixes removed duplicated visible board-status copy in the header, restored safe vertical overflow handling outside the target foyer viewport, and added focused header regression coverage for compact signal-note behavior.
- Deferred explicit line-by-line transport rows, richer named-station detail, practical map fidelity, and final board-readability validation to Stories `5.2`, `5.3`, `5.4`, and `5.5`.
- No `project-context.md` file exists in this repository at implementation time, so planning artifacts, implementation files, design inputs, package metadata, repo structure, git history, and official docs were used as the governing context.

### File List

- docs/sprint-artifacts/5-1-reframe-the-public-display-around-a-one-screen-status-first-board.md
- docs/sprint-artifacts/sprint-status.yaml
- src/app/layout.tsx
- src/app/globals.css
- src/features/dashboard/components/DashboardScreen.tsx
- src/features/dashboard/components/AtmosphericHeader.tsx
- src/features/dashboard/components/ModeSummaryGrid.tsx
- src/features/dashboard/components/ModeSummaryCard.tsx
- src/features/dashboard/components/LocalMapFrame.tsx
- tests/smoke/startup-smoke.test.mjs
- tests/unit/dashboard.presenter.test.mjs
- tests/unit/dashboard.header.test.mjs
Out-of-scope dirty worktree context observed during Story `5.1` review and left untouched:
- README.md
- docs/epics.md
- docs/prd.md
- docs/ux-design-specification.md
- env.local.example
- package-lock.json
- runtime/snapshots/dashboard-history.json
- runtime/snapshots/dashboard-recovery.json
- runtime/snapshots/dashboard-snapshot.json
- docs/design-inputs/
- docs/sprint-change-proposal-2026-03-20.md

### Change Log

- 2026-03-20: Implemented Story 5.1 as a shell-level public-board redesign with a new masthead, status-first header, condensed nearby mode field, clearer nearby-stations locality panel, `next/font` typography, focused Story 5.1 shell tests, and a full `npm run validate` pass.
- 2026-03-20: Closed code review findings by removing duplicated header status copy, restoring vertical overflow fallback, adding focused header regression coverage, and reconciling the story artifact with the current dirty worktree context.

### Git Intelligence Summary

- Recent commit history shows Epic 4 closeout was the last completed stream:
  - `8332672 feat(epic-4): close review debt and sync release readiness`
  - `3cc4ef6 feat(epic-3): implement 3-5-recover-the-display-after-interruption-or-restart`
  - `3a6ec9f feat(epic-3): implement 3-4-trigger-lightweight-refresh-and-trust-check-actions`
  - `8a12ce8 feat(epic-3): implement 3-3-diagnose-degraded-impact-by-signal-and-scope`
  - `93e5912 feat(epic-3): implement 3-2-show-public-readiness-and-current-ops-state`
- Actionable implication: Story `5.1` is the first new implementation stream after review-debt closure, so it should preserve the now-validated live-data and degraded-state foundations while correcting the public shell.
- Current worktree state includes planning edits, design-input files, and unrelated local artifacts:
  - `README.md`
  - `docs/epics.md`
  - `docs/prd.md`
  - `docs/ux-design-specification.md`
  - `docs/sprint-artifacts/sprint-status.yaml`
  - `docs/sprint-change-proposal-2026-03-20.md`
  - `docs/design-inputs/`
  - `env.local.example`
  - `package-lock.json`
  - `runtime/snapshots/dashboard-history.json`
  - `runtime/snapshots/dashboard-recovery.json`
  - `runtime/snapshots/dashboard-snapshot.json`
- Strong implication for implementation:
  - treat the design-input files as newly approved guidance, not noise
  - do not revert unrelated dirty worktree files while implementing Story `5.1`
  - keep shell-level work narrow and explicit so later Epic 5 stories can build on it cleanly

### Latest Tech Information

- Official-source checks on 2026-03-20 did not surface any stack change that alters the implementation direction for Story `5.1`.
  - Next.js App Router still supports route files for internal handlers and `next/font` for first-class font loading, which aligns with keeping the redesign inside the current app structure rather than layering in raw CDN font links.
  - React’s `'use client'` guidance still reinforces explicit client/server boundaries, so Story `5.1` should continue to keep the public route thin and the live shell fed by the existing presenter and query boundary.
  - TanStack Query’s current React reference still supports `refetchInterval`, which confirms the current polling path remains the right live-update mechanism while the shell is redesigned.
  - Node `24.x`, Zod `v4`, and the repo’s local Vitest setup remain aligned with current official guidance.
- Inference: there is no technical justification to add a new UI framework, a second styling system, or a separate live-update path for Story `5.1`. The right move is to redesign the board inside the current Next.js, React, global CSS, presenter, and TanStack Query setup.

### Project Context Reference

- No `project-context.md` file exists in this repository at the time of story creation.
- Story guidance was therefore derived from the current planning artifacts, implementation source files, design-input files, package metadata, repo structure, git history, and the current official documentation for the active stack.

### Completion Status

- Story `5.1` is implemented, code reviewed, and closed as a shell-level public-board redesign.
- The current public shell now uses a one-screen, status-first composition with materially less paragraph-driven copy while preserving the existing live-data and degraded-state architecture, removing duplicated visible status cues, and restoring safe vertical overflow fallback outside the target foyer viewport.
- Remaining Epic 5 gaps are explicitly deferred to Stories `5.2` through `5.5`: line-level transport rows, richer nearby-station detail, a more practical map treatment, and final board-readability closure.
