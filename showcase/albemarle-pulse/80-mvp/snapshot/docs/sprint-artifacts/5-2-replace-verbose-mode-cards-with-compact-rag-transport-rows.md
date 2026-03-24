# Story 5.2: Replace Verbose Mode Cards with Compact RAG Transport Rows

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visitor preparing to leave,
I want nearby transport modes shown as compact rows with explicit status emphasis,
so that I can compare them quickly like a public board rather than reading repeated prose.

## Acceptance Criteria

1. Given the public display shows nearby modes, when tube, rail, bus, roads, and any other enabled modes are rendered, then each mode uses compact row-style presentation with obvious red / amber / green emphasis, and long descriptive copy is replaced by concise labels and one bounded supporting line where needed.
2. Given a mode is degraded or stale, when confidence narrows, then the row shows that clearly without duplicating the same warning across the whole board.
3. Given the row redesign is applied to the existing public display path, when the board renders from the current dashboard snapshot and presenter flow, then the result stays fact-only, local, and non-interactive, and it does not introduce route-planner wording, ranking behavior, or dense departure-board sprawl.
4. Given the redesigned nearby mode field is reviewed against the approved Epic 5 direction and design input, when the board is read within the Story 5.1 shell, then the mode area reads as compact transport rows rather than card soup, and it preserves one-screen clarity for the status-first board.

## Tasks / Subtasks

- [x] Replace the current nearby-mode card treatment with compact transport rows in the canonical dashboard shell. (AC: 1, 4)
  - [x] Rework [ModeSummaryCard.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/ModeSummaryCard.tsx) into a row-oriented nearby-mode component that emphasizes mode label, state label, RAG cue, and one bounded supporting line. (AC: 1, 4)
  - [x] Update [ModeSummaryGrid.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/ModeSummaryGrid.tsx) so the nearby-mode field reads as a compact board section rather than a card grid. (AC: 1, 4)
  - [x] Preserve the Story 5.1 shell ordering in [DashboardScreen.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/DashboardScreen.tsx): header first, nearby rows second, map third. (AC: 4)
- [x] Tighten presenter output so rows carry concise fact-only content instead of repeated prose. (AC: 1, 2, 3)
  - [x] Update [dashboard-presenter.js](/home/codexuser/bmad-6-workshop/src/features/dashboard/presenters/dashboard-presenter.js) to emit row-friendly labels, bounded support text, and locally scoped trust or freshness cues. (AC: 1, 2, 3)
  - [x] Reuse the existing `nearbyModes`, `sourceStatus`, `trust`, `disruptionScope`, and canonical order model before adding any new contract fields. (AC: 2, 3)
  - [x] If a new row-specific field is truly required, extend [dashboard-snapshot.js](/home/codexuser/bmad-6-workshop/src/lib/contracts/dashboard-snapshot.js) narrowly and keep the snapshot contract fact-only and backward-compatible. (AC: 1, 3)
- [x] Apply the visual row grammar through the existing bespoke CSS system only. (AC: 1, 4)
  - [x] Update [globals.css](/home/codexuser/bmad-6-workshop/src/app/globals.css) so nearby-mode styling uses tonal layering, whitespace, and restrained separators instead of dashboard-style cards or heavy borders. (AC: 1, 4)
  - [x] Ensure state remains readable without color alone by combining RAG color with wording, chips, layout emphasis, or iconographic structure. (AC: 1, 2)
  - [x] Keep the row field compact enough to support the no-scroll board direction established in Story 5.1. (AC: 4)
- [x] Keep disruption, stale-data, and reduced-confidence communication local to each affected row. (AC: 2, 3)
  - [x] Show narrowed confidence through one local cue per affected row rather than repeating shell-level warning copy inside every mode. (AC: 2)
  - [x] Preserve calm degraded-state behavior by keeping unaffected rows readable and visually stable when one mode narrows in confidence. (AC: 2, 3)
  - [x] Avoid adding alert-banner, takeover, or ops-monitor behavior to the nearby-mode field. (AC: 2, 3)
- [x] Add focused regression coverage for the row redesign without relying on brittle visual snapshots. (AC: 1, 2, 3, 4)
  - [x] Update [dashboard.presenter.test.mjs](/home/codexuser/bmad-6-workshop/tests/unit/dashboard.presenter.test.mjs) to cover compact row-facing copy, local trust narrowing, and fact-only wording guardrails. (AC: 1, 2, 3)
  - [x] Update [startup-smoke.test.mjs](/home/codexuser/bmad-6-workshop/tests/smoke/startup-smoke.test.mjs) so the public route is required to keep the nearby-mode field in the canonical shell while using compact row semantics rather than verbose cards. (AC: 1, 3, 4)
  - [x] Add or update any focused source-inspection tests needed to prevent regressions back toward repeated trust sentences, card soup, or route-planner copy. (AC: 2, 3, 4)
- [x] Verify implementation against the standard local validation gate before handoff. (AC: 1, 2, 3, 4)
  - [x] Run `npm run lint`. (AC: 3, 4)
  - [x] Run `npm run typecheck`. (AC: 3, 4)
  - [x] Run `npm test`. (AC: 3, 4)
  - [x] Run `npm run build`. (AC: 3, 4)

## Dev Notes

### Developer Context

- Story `5.2` is the second implementation story in `Epic 5: Public Display Clarity and Visual Redesign`.
- Story `5.1` already corrected the board-level shell, masthead, status-first hierarchy, and no-scroll composition. Story `5.2` should deepen only the nearby-mode field so it reads like compact public-board transport rows instead of a stack of editorial cards.
- The immediate product problem is already documented in the approved Sprint Change Proposal:
  - the live public display was rejected as too text-heavy and too hard to scan
  - the current nearby-mode area still behaves more like summarized cards than compact public-signage rows
  - the redesign direction explicitly calls for tube / rail, bus, roads, and other enabled modes to appear as compact RAG rows
- Story `5.1` intentionally deferred this row-level redesign. Its completion notes explicitly push line-level transport rows into Story `5.2`, while keeping the shell otherwise stable.
- Earlier story context matters:
  - Story `1.4` introduced the nearby-mode contract, presenter shaping, and the initial `ModeSummaryGrid` plus `ModeSummaryCard` components
  - Epic 2 stories introduced trust, freshness, disruption, and degraded-state behavior that must still read honestly after the row redesign
  - Story `5.1` reduced shell-level repetition, so Story `5.2` must not reintroduce duplicate warning prose inside each mode row
- Current implementation evidence shows the exact seam to fix:
  - [ModeSummaryCard.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/ModeSummaryCard.tsx) still renders an `article` card shape with header, summary, chips, and optional update text
  - [ModeSummaryGrid.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/ModeSummaryGrid.tsx) still frames the mode field as a panel feeding a grid of list items
  - [dashboard-presenter.js](/home/codexuser/bmad-6-workshop/src/features/dashboard/presenters/dashboard-presenter.js) still emits `summary`, optional `nuance`, meta labels, and `changeSummary` patterns that can easily drift back into prose-heavy rows if left unchanged
  - [overall-departure-snapshot.js](/home/codexuser/bmad-6-workshop/src/features/dashboard/data/overall-departure-snapshot.js) fixture data already covers tube and rail, bus, roads, and cycles or scooters, so Story `5.2` can iterate on the existing nearby-mode payload without inventing a new data source
- Success for Story `5.2` is:
  - visitors can compare nearby modes by scanning rows instead of reading cards
  - the state grammar is obvious in public-signage terms
  - confidence narrowing remains local and calm
  - the row area supports Story `5.1`'s no-scroll board direction instead of fighting it

### Technical Requirements

- Treat this as a row-language redesign, not a public-display rewrite.
  - preserve the Story `5.1` masthead and overall shell
  - preserve the current live query, presenter, and snapshot path
  - preserve the map section as a separate concern for Stories `5.3` and `5.4`
- Prefer re-shaping existing nearby-mode data over widening the contract.
  - current contract states are `available`, `caution`, and `disrupted`
  - current view-model fields already include `label`, `stateLabel`, `summary`, `nuance`, `sourceStatus`, `trust`, `disruptionScope`, and `changeSummary`
  - first try to express row behavior through those existing fields and more disciplined presentation logic
  - only extend the contract if a row requirement cannot be represented cleanly without ambiguity
- Replace open-ended card prose with bounded row content.
  - each row should lead with the mode name and explicit state cue
  - use one short factual support line where needed
  - trust or freshness should appear as one local cue when confidence narrows
  - avoid stacking summary, nuance, trust detail, source detail, and change copy all at once
- Keep the product fact-only and non-prescriptive.
  - no `best option`, `take`, `switch to`, `recommended`, or route-ranking language
  - no exact route-planning logic or citywide transport sprawl
  - no expansion controls, tabs, accordions, or row interaction on the public screen
- Keep degradation honest but quiet.
  - narrowed confidence should affect only the relevant row unless the broader shell already communicates a larger disruption
  - unchanged rows should stay legible and stable
  - do not duplicate shell-level disruption language inside every row
- Preserve one-screen readability.
  - the mode field must stay compact enough to support the Story `5.1` no-scroll composition
  - avoid returning to tall cards, repeated paragraphs, or multi-line chip stacks that expand vertically across the board

### Architecture Compliance

- Stay inside the approved modular-monolith and BFF structure:
  - public route composition remains in [page.tsx](/home/codexuser/bmad-6-workshop/src/app/(public)/page.tsx)
  - public display UI remains under `src/features/dashboard/components/*`
  - presenter shaping remains under `src/features/dashboard/presenters/*`
  - snapshot contract ownership remains under `src/lib/contracts/*`
  - server-side dashboard truth remains under `src/lib/server/dashboard/*`
- Preserve the single canonical public-display surface.
  - do not create a second board implementation
  - do not create a separate experimental row prototype under `src/`
  - do not move nearby-mode business truth into route-local React logic
- Respect the public-display product boundary:
  - public users get one passive display surface
  - no ops actions, maintenance controls, or public interaction affordances
  - no new provider calls from UI components
- Keep presenter-owned labels and client-owned rendering responsibilities explicit, consistent with current React Server Components and client-boundary guidance.

### Library / Framework Requirements

- Stay aligned with the repo baseline in [package.json](/home/codexuser/bmad-6-workshop/package.json):
  - `next` `16.1.7`
  - `react` `19.2.3`
  - `react-dom` `19.2.3`
  - `@tanstack/react-query` `^5.0.0`
  - `zod` `^4.3.6`
  - `node` `24.x`
  - local `vitest` package via `tools/vitest-lite`
- Do not add Tailwind, a UI kit, icon dependency, data-grid library, or transport-board package for this story.
- Official-source checks completed on 2026-03-23:
  - Next.js route-handler documentation remains current and was last updated on February 27, 2026, reinforcing that the app should keep its single App Router plus route-handler structure rather than introducing a new runtime path: https://nextjs.org/docs/app/building-your-application/routing/router-handlers
  - React's `'use client'` reference still defines an explicit server-client boundary, which supports keeping row presentation inside the existing component tree without moving snapshot logic into client-only state machinery: https://react.dev/reference/rsc/use-client
  - TanStack Query's current React reference still documents `refetchInterval`, so Story `5.2` should keep the existing polling path and avoid inventing a new live-update mechanism just to support row styling: https://tanstack.com/query/latest/docs/framework/react/reference/useQuery
- Inference from those sources: the safest implementation is to redesign the nearby-mode area inside the current Next.js, React, TanStack Query, presenter, and global CSS stack without adding a second styling or data-delivery system.

### File Structure Requirements

- Expected primary implementation files:
  - [ModeSummaryCard.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/ModeSummaryCard.tsx)
  - [ModeSummaryGrid.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/ModeSummaryGrid.tsx)
  - [DashboardScreen.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/DashboardScreen.tsx)
  - [dashboard-presenter.js](/home/codexuser/bmad-6-workshop/src/features/dashboard/presenters/dashboard-presenter.js)
  - [globals.css](/home/codexuser/bmad-6-workshop/src/app/globals.css)
- Supporting files that may need targeted updates:
  - [dashboard-snapshot.js](/home/codexuser/bmad-6-workshop/src/lib/contracts/dashboard-snapshot.js) if a narrowly scoped row field is genuinely required
  - [overall-departure-snapshot.js](/home/codexuser/bmad-6-workshop/src/features/dashboard/data/overall-departure-snapshot.js) if fixture content must be tightened to support the compact row grammar
  - [dashboard.presenter.test.mjs](/home/codexuser/bmad-6-workshop/tests/unit/dashboard.presenter.test.mjs)
  - [dashboard.header.test.mjs](/home/codexuser/bmad-6-workshop/tests/unit/dashboard.header.test.mjs) if shell-level row or trust assumptions need guardrail coverage
  - [startup-smoke.test.mjs](/home/codexuser/bmad-6-workshop/tests/smoke/startup-smoke.test.mjs)
- Keep route and boundary files stable unless a small composition update is strictly necessary:
  - [page.tsx](/home/codexuser/bmad-6-workshop/src/app/(public)/page.tsx)
  - [DashboardLiveScreen.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/DashboardLiveScreen.tsx)
  - [useDashboardQuery.ts](/home/codexuser/bmad-6-workshop/src/features/dashboard/hooks/useDashboardQuery.ts)
- Do not create:
  - a second public-mode-row implementation
  - a transport-board dependency or alternate component library
  - a special-purpose public interaction surface for row expansion or drilling in

### Testing Requirements

- Minimum verification:
  - `npm run lint`
  - `npm run typecheck`
  - `npm test`
  - `npm run build`
- Focused regression expectations for Story `5.2`:
  - nearby modes still render through the canonical dashboard route, presenter, and screen
  - row content stays fact-only and local
  - row status remains readable without color alone
  - narrowed confidence appears locally without reintroducing repeated shell-level warning copy
  - the nearby-mode field supports the no-scroll status-first board rather than reverting to a tall card stack
- Add or update source-level tests where they protect the most important regressions:
  - presenter tests for compact row copy, canonical ordering, and local trust signaling
  - smoke tests for the continued presence of the nearby-mode field in the canonical public shell and the absence of planner language
  - focused source-inspection tests only where they lock in the anti-card, anti-repetition, and fact-only row behavior
- Do not rely on brittle screenshot or pixel-diff testing for this story.

### Previous Story Intelligence

- From Story `5.1`:
  - the shell has already been reframed around a one-screen status-first board
  - the nearby-mode field is explicitly the next corrective layer, not part of an unfinished shell task
  - avoid reintroducing duplicated visible status copy or expanding the board vertically
  - preserve the current Next.js, presenter, snapshot, and live-query seams
- From Story `1.4`:
  - the nearby-mode field is already a bespoke public-display component, not a generic app card grid
  - the canonical nearby-mode contract and tests already exist and should be extended rather than replaced
  - the public route must remain passive, venue-specific, and non-planner-like
- From Epic 2 stories:
  - freshness, trust, and degraded-state cues already have contract-level meaning
  - Story `5.2` should improve public readability of those cues without changing their truth model
  - local degraded-state behavior must stay honest and must not undermine unaffected parts of the picture

### Git Intelligence Summary

- Recent commit history still shows Epic 4 closeout as the most recent committed stream:
  - `8332672 feat(epic-4): close review debt and sync release readiness`
  - `3cc4ef6 feat(epic-3): implement 3-5-recover-the-display-after-interruption-or-restart`
  - `3a6ec9f feat(epic-3): implement 3-4-trigger-lightweight-refresh-and-trust-check-actions`
  - `8a12ce8 feat(epic-3): implement 3-3-diagnose-degraded-impact-by-signal-and-scope`
  - `93e5912 feat(epic-3): implement 3-2-show-public-readiness-and-current-ops-state`
- The current worktree is intentionally dirty and already contains the Story `5.1` redesign changes plus related planning and runtime artifacts.
- Strong implementation implication:
  - work with the existing Story `5.1` dashboard files rather than reverting or bypassing them
  - treat the design-input files and Epic 5 planning edits as active governing context
  - keep Story `5.2` narrow so Stories `5.3` through `5.5` can continue locality, map, and final validation work cleanly

### Latest Tech Information

- Official-source checks on 2026-03-23 did not reveal any stack change that alters Story `5.2`'s implementation path.
  - Next.js App Router plus route handlers remain the correct architectural fit for the repo's public-display and internal API structure.
  - React's current `'use client'` guidance still supports keeping display logic split cleanly between server and client boundaries.
  - TanStack Query still supports the existing polling model needed for calm live refresh.
- Inference: there is no technical justification to introduce a new UI framework, a second polling path, or a separate row-rendering runtime for this story.

### Project Structure Notes

- The public-display implementation remains intentionally narrow:
  - route entry: [page.tsx](/home/codexuser/bmad-6-workshop/src/app/(public)/page.tsx)
  - live query boundary: [DashboardLiveScreen.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/DashboardLiveScreen.tsx)
  - shell and nearby-mode components: `src/features/dashboard/components/*`
  - presenter shaping: [dashboard-presenter.js](/home/codexuser/bmad-6-workshop/src/features/dashboard/presenters/dashboard-presenter.js)
  - styling system: [globals.css](/home/codexuser/bmad-6-workshop/src/app/globals.css)
- The highest-risk structural mistakes for Story `5.2` are:
  - keeping the nearby-mode field as an over-tall card grid
  - duplicating shell-level warnings inside every row
  - widening the contract unnecessarily when presenter or component shaping would suffice
  - drifting into planner, dashboard, or ops-board semantics

### References

- `docs/epics.md#Story 5.2: Replace Verbose Mode Cards with Compact RAG Transport Rows`
- `docs/prd.md#Success Criteria`
- `docs/prd.md#MVP - Minimum Viable Product`
- `docs/ux-design-specification.md` sections on implementation approach, nearby mode rows, component implementation strategy, and no-scroll public-board clarity
- `docs/architecture.md` sections on technical constraints, architectural boundaries, and requirements-to-structure mapping
- `docs/sprint-change-proposal-2026-03-20.md`
- `docs/design-inputs/DESIGN.md`
- `docs/design-inputs/code.html`
- `docs/sprint-artifacts/1-4-show-nearby-mode-summaries-for-shared-reading.md`
- `docs/sprint-artifacts/5-1-reframe-the-public-display-around-a-one-screen-status-first-board.md`
- `src/app/(public)/page.tsx`
- `src/app/globals.css`
- `src/features/dashboard/components/DashboardLiveScreen.tsx`
- `src/features/dashboard/components/DashboardScreen.tsx`
- `src/features/dashboard/components/AtmosphericHeader.tsx`
- `src/features/dashboard/components/ModeSummaryGrid.tsx`
- `src/features/dashboard/components/ModeSummaryCard.tsx`
- `src/features/dashboard/components/LocalMapFrame.tsx`
- `src/features/dashboard/presenters/dashboard-presenter.js`
- `src/features/dashboard/hooks/useDashboardQuery.ts`
- `src/features/dashboard/data/overall-departure-snapshot.js`
- `src/lib/contracts/dashboard-snapshot.js`
- `tests/unit/dashboard.presenter.test.mjs`
- `tests/unit/dashboard.header.test.mjs`
- `tests/smoke/startup-smoke.test.mjs`
- `package.json`
- official source checked 2026-03-23: `https://nextjs.org/docs/app/building-your-application/routing/router-handlers`
- official source checked 2026-03-23: `https://react.dev/reference/rsc/use-client`
- official source checked 2026-03-23: `https://tanstack.com/query/latest/docs/framework/react/reference/useQuery`

### Project Context Reference

- No `project-context.md` file exists in this repository at the time of story creation.
- Story guidance was derived from the current planning artifacts, implementation files, design-input files, package metadata, git history, and official framework documentation.

### Completion Status

- Story context assembled from Epic 5 planning artifacts, sprint tracking, the approved sprint change proposal, the completed Story `5.1` artifact, the original nearby-mode Story `1.4` artifact, the current dashboard implementation, package metadata, git history, and official documentation checked on 2026-03-23.
- The story is intentionally scoped to the nearby-mode field only. Concrete locality enrichment remains centered on Story `5.3`, map usefulness remains centered on Story `5.4`, and final board-readability acceptance remains centered on Story `5.5`.
- This story is ready for a dev agent to implement as the compact public-board row redesign for the nearby transport field.

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- `cat _bmad/bmm/config.yaml`
- `cat _bmad/core/tasks/workflow.xml`
- `cat _bmad/bmm/agents/dev.md`
- `cat _bmad/bmm/workflows/4-implementation/dev-story/workflow.yaml`
- `cat _bmad/bmm/workflows/4-implementation/dev-story/instructions.xml`
- `cat _bmad/bmm/workflows/4-implementation/dev-story/checklist.md`
- `cat docs/sprint-artifacts/sprint-status.yaml`
- `cat docs/sprint-artifacts/5-2-replace-verbose-mode-cards-with-compact-rag-transport-rows.md`
- `sed -n '1,260p' src/features/dashboard/components/ModeSummaryCard.tsx`
- `sed -n '1,260p' src/features/dashboard/components/ModeSummaryGrid.tsx`
- `sed -n '1,260p' src/features/dashboard/components/DashboardScreen.tsx`
- `sed -n '1,420p' src/features/dashboard/presenters/dashboard-presenter.js`
- `sed -n '1,320p' src/lib/contracts/dashboard-snapshot.js`
- `sed -n '1,260p' src/features/dashboard/data/overall-departure-snapshot.js`
- `sed -n '1,320p' src/app/globals.css`
- `sed -n '1,220p' src/app/layout.tsx`
- `sed -n '1,320p' tests/unit/dashboard.presenter.test.mjs`
- `sed -n '1,320p' tests/smoke/startup-smoke.test.mjs`
- `git diff -- src/features/dashboard/presenters/dashboard-presenter.js src/features/dashboard/components/ModeSummaryCard.tsx src/features/dashboard/components/ModeSummaryGrid.tsx src/app/globals.css src/app/layout.tsx tests/unit/dashboard.presenter.test.mjs tests/smoke/startup-smoke.test.mjs`
- `git status --short`
- `npx vitest run tests/unit/dashboard.presenter.test.mjs`
- `node --test tests/smoke/startup-smoke.test.mjs`
- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run build`

### Completion Notes List

- Reworked the nearby-mode field from verbose cards into compact transport rows with explicit RAG wording, restrained support cues, and shell-preserving row layout inside the existing Story `5.1` board.
- Tightened presenter output to emit one bounded summary line plus one local support cue per affected row using the existing `nearbyModes`, `sourceStatus`, `trust`, and canonical ordering contract rather than widening the snapshot schema or hardcoding transport copy that could drift from snapshot truth.
- Added focused Story `5.2` regression coverage for compact row copy, canonical shell ordering, anti-planner wording, and row-specific CSS/source semantics.
- Full validation passed with `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build`.
- Build stability required one narrow infrastructure fix: preserve the Inter / Noto Serif pairing as CSS fallbacks in `layout.tsx` because `next/font/google` fetches are not available in this network-restricted workspace.
- No `project-context.md` file exists in this repository at implementation time, so planning artifacts, implementation files, design inputs, package metadata, repo structure, git history, and the current codebase were used as the governing context.
- Code review follow-up fixed three review issues before closeout: removed presenter-level hardcoded mode summaries, stabilized nearby-row meta-chip keys and deduping, and aligned smoke coverage with the actual CSS font-fallback approach.

### File List

- docs/sprint-artifacts/5-2-replace-verbose-mode-cards-with-compact-rag-transport-rows.md
- docs/sprint-artifacts/sprint-status.yaml
- src/app/globals.css
- src/app/layout.tsx
- src/features/dashboard/components/ModeSummaryCard.tsx
- src/features/dashboard/components/ModeSummaryGrid.tsx
- src/features/dashboard/presenters/dashboard-presenter.js
- tests/smoke/startup-smoke.test.mjs
- tests/unit/dashboard.presenter.test.mjs
Out-of-scope dirty worktree context observed during Story `5.2` implementation and left untouched:
- README.md
- docs/epics.md
- docs/prd.md
- docs/ux-design-specification.md
- env.local.example
- package-lock.json
- runtime/snapshots/dashboard-history.json
- runtime/snapshots/dashboard-recovery.json
- runtime/snapshots/dashboard-snapshot.json
- src/features/dashboard/components/AtmosphericHeader.tsx
- src/features/dashboard/components/DashboardScreen.tsx
- src/features/dashboard/components/LocalMapFrame.tsx
- docs/design-inputs/
- docs/sprint-artifacts/5-1-reframe-the-public-display-around-a-one-screen-status-first-board.md
- docs/sprint-change-proposal-2026-03-20.md
- tests/unit/dashboard.header.test.mjs

### Change Log

- 2026-03-23: Implemented Story 5.2 as a compact nearby-mode row redesign by reshaping presenter copy, row markup, and row styling; added Story 5.2 presenter and smoke guardrails; and passed `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build`.
- 2026-03-23: Completed DEV code review workflow, fixed the presenter hardcoding and row-meta key stability issues, corrected the font-fallback smoke assertion, and revalidated with `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build`.
