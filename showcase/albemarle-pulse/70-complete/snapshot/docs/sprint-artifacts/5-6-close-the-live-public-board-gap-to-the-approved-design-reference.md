# Story 5.6: Close the Live Public Board Gap to the Approved Design Reference

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a stakeholder reviewing the live public route,
I want the canonical public board to match the approved design reference closely,
so that the shipped screen looks like the intended Civic Editorial board rather than a looser adaptation.

## Acceptance Criteria

1. Given `docs/design-inputs/code.html` and `docs/design-inputs/screen.png` are the approved design baseline, when the live public route is reviewed at the target foyer viewport, then the masthead, status-first header, left/right section balance, nearby-mode treatment, nearby-stations layer, and passive local-map treatment align closely with that baseline, and any remaining differences are limited to truth-preserving content substitutions or implementation-safe adaptation rather than broad visual drift.
2. Given the public board is updated for parity, when the implementation is reviewed, then the work remains inside the canonical public route, presenter, component, and global-CSS seams, and no parallel prototype, alternate board runtime, or Tailwind-only screen is introduced.
3. Given the approved design system in `docs/design-inputs/DESIGN.md`, when board sections, cards, and panels are refined, then the implementation follows the Civic Editorial direction for tonal layering, serif/sans hierarchy, generous spacing, and restrained ambient depth, and explicit 1px section-divider styling is removed unless a ghost-border accessibility fallback is truly necessary.
4. Given parity work changes the live public board, when local verification runs, then the canonical public route remains fact-only, passive, no-scroll at the target desktop foyer viewport, and still passes the repo validation gate without breaking the presenter/snapshot truth model.

## Tasks / Subtasks

- [x] Rework the canonical board shell and section zoning to match the approved design-reference structure more closely. (AC: 1, 2, 3)
  - [x] Update [DashboardScreen.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/DashboardScreen.tsx) so the live public route preserves the current truth seams while moving the board toward the approved masthead, asymmetric left/right composition, section rhythm, and one-screen editorial hierarchy from `docs/design-inputs/code.html`. (AC: 1, 2, 4)
  - [x] Adjust [AtmosphericHeader.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/AtmosphericHeader.tsx) to match the design-reference masthead and status-first headline treatment more closely without changing the fact-only product doctrine. (AC: 1, 2, 4)
  - [x] Keep the public route anchored to [page.tsx](/home/codexuser/bmad-6-workshop/src/app/(public)/page.tsx) and [DashboardLiveScreen.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/DashboardLiveScreen.tsx); do not introduce a second public board, prototype route, or design-only runtime. (AC: 2, 4)
- [x] Bring nearby-mode, nearby-stations, and local-map surfaces into closer visual parity with the approved reference while preserving current product truth. (AC: 1, 2, 3, 4)
  - [x] Update [ModeSummaryGrid.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/ModeSummaryGrid.tsx) and [ModeSummaryCard.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/ModeSummaryCard.tsx) so the nearby-mode field reads closer to the approved compact editorial rows and status emphasis. (AC: 1, 3, 4)
  - [x] Update [LocalityReferencePanel.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/LocalityReferencePanel.tsx) so the nearby-stations treatment follows the approved right-column panel rhythm and support hierarchy. (AC: 1, 3, 4)
  - [x] Update [LocalMapFrame.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/LocalMapFrame.tsx) so the passive map treatment, anchor treatment, framing, and surrounding overlay better match the approved design-reference composition without adding interaction or route-planner behavior. (AC: 1, 2, 3, 4)
- [x] Replace border-heavy adaptation styling with Civic Editorial surface layering and typography treatment. (AC: 1, 2, 3, 4)
  - [x] Refactor [globals.css](/home/codexuser/bmad-6-workshop/src/app/globals.css) to remove broad 1px divider-driven sectioning and move the board toward the approved warm surface hierarchy, spacing rhythm, serif/sans pairing, and soft ambient depth described in `docs/design-inputs/DESIGN.md`. (AC: 1, 3, 4)
  - [x] If closer typography parity is needed, update [layout.tsx](/home/codexuser/bmad-6-workshop/src/app/layout.tsx) to adopt an implementation-safe `next/font` path rather than relying only on CSS fallbacks or remote font fetches. (AC: 1, 2, 3)
  - [x] Keep any truth-model changes narrow and presenter-owned by updating [dashboard-presenter.js](/home/codexuser/bmad-6-workshop/src/features/dashboard/presenters/dashboard-presenter.js) only where a small label or grouping adjustment is required to support the approved hierarchy. (AC: 1, 2, 4)
- [x] Extend regression coverage for parity-critical structure without absorbing screenshot automation from Story `5.7`. (AC: 2, 4)
  - [x] Extend [startup-smoke.test.mjs](/home/codexuser/bmad-6-workshop/tests/smoke/startup-smoke.test.mjs) to protect the canonical public-route structure, one-screen shell, passive-map posture, and absence of Tailwind/prototype drift after the parity refactor. (AC: 2, 4)
  - [x] Extend [dashboard.presenter.test.mjs](/home/codexuser/bmad-6-workshop/tests/unit/dashboard.presenter.test.mjs) only where parity work needs new presenter-owned labels or copy constraints; keep the fact-only guardrails intact. (AC: 2, 4)
  - [x] Do not add Playwright screenshot capture, screenshot artifact storage, or visual-comparison automation in this story; that evidence path belongs to Story `5.7`. (AC: 2, 4)
- [x] Verify the story through the standard local validation gate before handoff. (AC: 4)
  - [x] Run `npm run lint`. (AC: 4)
  - [x] Run `npm run typecheck`. (AC: 4)
  - [x] Run `npm test`. (AC: 4)
  - [x] Run `npm run build`. (AC: 4)

## Dev Notes

### Developer Context

- Story `5.6` exists because Epic 5 was originally closed against a readability-and-beauty bar, but the approved acceptance target is now stricter: the shipped live board must achieve close visual parity with the approved design-reference set in `docs/design-inputs/code.html` and `docs/design-inputs/screen.png`.
- This story is an implementation-parity story on the canonical live route, not a new prototype or validation-only story. Screenshot evidence and Playwright-driven acceptance belong to Story `5.7`; Story `5.6` should make the board look materially closer to the approved reference so `5.7` has a viable target to validate.
- Prior Epic 5 work already established the functional product shape:
  - Story `5.1` reframed the screen into a one-screen status-first board.
  - Story `5.2` replaced verbose mode cards with compact nearby-mode rows.
  - Story `5.3` added concrete nearby locality references.
  - Story `5.4` made the local map more practically useful.
  - Story `5.5` validated readability and acceptance against that earlier bar.
- The reopened gap is mostly visual and compositional rather than functional:
  - the design reference uses a Civic Editorial masthead, strong serif/sans pairing, intentional asymmetry, tonal layering, and generous spacing
  - the current app still reflects a looser adaptation with heavier border usage, weaker parity in masthead and section zoning, and fallback typography handled mainly through CSS rather than a deliberate font-loading path
  - `docs/design-inputs/DESIGN.md` explicitly rejects 1px line-based sectioning except as a low-opacity accessibility fallback, which the current board does not yet consistently honor
- Current implementation seams already provide the right place to close the gap:
  - [page.tsx](/home/codexuser/bmad-6-workshop/src/app/(public)/page.tsx) keeps the canonical public route server-rendered
  - [DashboardLiveScreen.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/DashboardLiveScreen.tsx) and [useDashboardQuery.ts](/home/codexuser/bmad-6-workshop/src/features/dashboard/hooks/useDashboardQuery.ts) handle the live polling boundary
  - [dashboard-presenter.js](/home/codexuser/bmad-6-workshop/src/features/dashboard/presenters/dashboard-presenter.js) remains the canonical source for public-display labels and grouping
  - [DashboardScreen.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/DashboardScreen.tsx), [AtmosphericHeader.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/AtmosphericHeader.tsx), [ModeSummaryGrid.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/ModeSummaryGrid.tsx), [LocalityReferencePanel.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/LocalityReferencePanel.tsx), [LocalMapFrame.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/LocalMapFrame.tsx), and [globals.css](/home/codexuser/bmad-6-workshop/src/app/globals.css) are the main parity-delivery surfaces
- Success for Story `5.6` is:
  - the live public route reads as the same board family as the approved design reference rather than a broad reinterpretation
  - the product still stays fact-only, passive, and one-screen
  - the existing presenter/snapshot truth model remains intact
  - Story `5.7` can validate parity with screenshots without reopening fundamental layout work again

### Technical Requirements

- Treat this as a live-route parity implementation story, not as a prototype translation exercise.
  - implement parity in the existing Next.js app and public route
  - do not copy `docs/design-inputs/code.html` into runtime source verbatim
  - do not introduce a second board implementation for “visual mode” or “review mode”
- Preserve the current product doctrine while changing the visual expression.
  - fact-only wording remains mandatory
  - no route-planner advice, recommended-path wording, or ops-console drift
  - the board remains passive and non-interactive
  - the default foyer view remains one-screen and no-scroll
- Use the approved design-reference set as the parity target.
  - [code.html](/home/codexuser/bmad-6-workshop/docs/design-inputs/code.html) defines the target masthead structure, asymmetry, section rhythm, nearby-mode presentation, nearby-stations paneling, and passive map placement
  - [screen.png](/home/codexuser/bmad-6-workshop/docs/design-inputs/screen.png) is the visual snapshot of the approved target board
  - [DESIGN.md](/home/codexuser/bmad-6-workshop/docs/design-inputs/DESIGN.md) defines the Civic Editorial rules that should drive implementation choices where `code.html` is ambiguous
- Prioritize the largest parity gaps first.
  - masthead and headline hierarchy
  - left/right zoning and section balance
  - surface layering, spacing rhythm, and reduced border reliance
  - typography treatment and the serif-first sense of place
  - nearby-mode and nearby-stations panel rhythm
  - passive local-map framing and overlay treatment
- Keep truth-model changes narrow.
  - prefer presentational refactors in components and CSS
  - only update the presenter if a small copy grouping, label, or hierarchy cue is required for parity
  - do not widen the snapshot contract or introduce visual-only source data unless absolutely necessary

### Architecture Compliance

- Stay inside the approved modular-monolith and BFF structure:
  - public route composition remains in [page.tsx](/home/codexuser/bmad-6-workshop/src/app/(public)/page.tsx)
  - the client polling boundary remains in [DashboardLiveScreen.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/DashboardLiveScreen.tsx)
  - query refresh behavior remains in [useDashboardQuery.ts](/home/codexuser/bmad-6-workshop/src/features/dashboard/hooks/useDashboardQuery.ts)
  - public-display UI remains under `src/features/dashboard/components/*`
  - presenter shaping remains under `src/features/dashboard/presenters/*`
  - shared contract ownership remains under `src/lib/contracts/*`
- Preserve one canonical public-display path.
  - do not add another route tree, review-only route, prototype component stack, or alternate board shell
  - do not move public-display truth into route-local React state or component-local hardcoded mock structures
  - do not introduce Tailwind as a runtime dependency just to mimic the prototype classes
- Respect the public-display doctrine already enforced by the architecture and smoke tests.
  - one passive public board
  - no clickable controls, tabs, filters, search, or drill-in affordances
  - no provider calls from UI components
  - no planner, recommendation, or operations language on the public route
- Keep parity work architecture-light.
  - this story should mainly touch component structure, CSS tokens/rules, and narrowly scoped presenter labels
  - `5.6` should not alter the data-fetching topology, cache strategy, route-handler contract, or snapshot publication path

### Library / Framework Requirements

- Stay aligned with the repo baseline in [package.json](/home/codexuser/bmad-6-workshop/package.json):
  - `next` `16.1.7`
  - `react` `19.2.3`
  - `react-dom` `19.2.3`
  - `@tanstack/react-query` `^5.0.0`
  - `zod` `^4.3.6`
  - `node` `24.x`
  - local `vitest` package via `tools/vitest-lite`
- Keep the current implementation posture:
  - bespoke components plus repo-owned CSS
  - no Tailwind dependency
  - no UI framework swap
  - no second data/state library
- Official-source checks completed on 2026-03-23:
  - Next.js App Router docs still recommend `next/font` for optimized font loading and self-hosting in app-router projects, which makes `next/font` the correct path if typography parity requires a real font implementation in [layout.tsx](/home/codexuser/bmad-6-workshop/src/app/layout.tsx): https://nextjs.org/docs/app/getting-started/fonts
  - React’s `'use client'` reference still enforces the server/client module boundary used by the current public route and live board split: https://react.dev/reference/rsc/use-client
  - TanStack Query v5 docs still support `refetchInterval` and `refetchIntervalInBackground`, which aligns with the current calm polling path in [useDashboardQuery.ts](/home/codexuser/bmad-6-workshop/src/features/dashboard/hooks/useDashboardQuery.ts): https://tanstack.com/query/v5/docs/framework/react/reference/useQuery
  - TanStack Query’s important-defaults guide still describes stale-query refetch behavior consistent with the repo’s existing update model: https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults
  - Node’s official release page lists `v24` as an active supported line on 2026-03-23, which remains aligned with the repo runtime contract: https://nodejs.org/en/about/previous-releases
- Inference from those sources:
  - there is no stack-level reason to add another UI runtime, visual framework, or live-data mechanism
  - if typography parity needs stronger implementation than CSS fallbacks provide, `next/font` is the modern repo-aligned path
  - screenshot tooling should still remain in Story `5.7`; `5.6` only needs the implementation to be compatible with that later validation

### File Structure Requirements

- Expected primary implementation files:
  - [DashboardScreen.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/DashboardScreen.tsx)
  - [AtmosphericHeader.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/AtmosphericHeader.tsx)
  - [ModeSummaryGrid.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/ModeSummaryGrid.tsx)
  - [ModeSummaryCard.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/ModeSummaryCard.tsx)
  - [LocalityReferencePanel.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/LocalityReferencePanel.tsx)
  - [LocalMapFrame.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/LocalMapFrame.tsx)
  - [globals.css](/home/codexuser/bmad-6-workshop/src/app/globals.css)
- Supporting files that may need targeted updates:
  - [layout.tsx](/home/codexuser/bmad-6-workshop/src/app/layout.tsx) if `next/font` is used to close typography parity
  - [dashboard-presenter.js](/home/codexuser/bmad-6-workshop/src/features/dashboard/presenters/dashboard-presenter.js) only if a small label/grouping update is needed for hierarchy parity
  - [startup-smoke.test.mjs](/home/codexuser/bmad-6-workshop/tests/smoke/startup-smoke.test.mjs)
  - [dashboard.presenter.test.mjs](/home/codexuser/bmad-6-workshop/tests/unit/dashboard.presenter.test.mjs)
- Keep these boundary files stable unless a small type or composition fix is unavoidable:
  - [page.tsx](/home/codexuser/bmad-6-workshop/src/app/(public)/page.tsx)
  - [DashboardLiveScreen.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/DashboardLiveScreen.tsx)
  - [useDashboardQuery.ts](/home/codexuser/bmad-6-workshop/src/features/dashboard/hooks/useDashboardQuery.ts)
- Do not create:
  - a second public board implementation
  - a Tailwind-based prototype under `src/`
  - a screenshot-harness feature or artifact generator in this story
  - an alternate design-only route or storybook-style acceptance surface

### Testing Requirements

- Minimum verification:
  - `npm run lint`
  - `npm run typecheck`
  - `npm test`
  - `npm run build`
- Focused regression expectations for Story `5.6`:
  - the public route remains the single live public board
  - the board stays one-screen and no-scroll at the target desktop foyer viewport
  - the public display remains passive and fact-only
  - presenter-owned copy does not regress into advisory or operational language
  - parity refactors do not reintroduce dashboard clutter, border-heavy sectioning, or route/prototype drift
- Add or update source-level tests where they protect the main failure modes:
  - smoke tests for canonical public-route structure, passive-map behavior, and absence of alternate runtime drift
  - presenter tests only where copy/grouping changes are necessary to support the approved hierarchy
  - keep `5.6` verification source-based and repo-native; screenshot-based acceptance is intentionally deferred to Story `5.7`
- Avoid brittle overreach:
  - do not add broad pixel-diff logic here
  - do not let tests force the component tree to imitate Tailwind class names instead of the approved visual outcome

### Previous Story Intelligence

- From Story `5.5`:
  - the repo already has explicit readability validation and acceptance evidence for the earlier Epic 5 target
  - `5.6` should not relitigate whether the board is generally usable; it should close the stricter design-parity gap
  - smoke and presenter tests already protect fact-only wording, one-screen structure, locality presence, and passive-map posture
- From Story `5.4`:
  - the map has already been moved toward practical local usefulness
  - `5.6` should refine the map’s framing and visual integration with the rest of the board, not replace it with a new map platform or interaction model
- From Story `5.3`:
  - concrete nearby names are already first-class content
  - parity work should make those references feel closer to the approved editorial panel treatment, not hide them again behind abstraction or legend-heavy framing
- From Story `5.2`:
  - the nearby-mode field already moved away from verbose cards
  - `5.6` should refine those rows toward the approved compact editorial rhythm rather than regress toward prose-heavy card soup
- From Story `5.1`:
  - the one-screen status-first shell is already the canonical product shape
  - the story should preserve that shell while bringing it into closer visual alignment with the approved design-reference set

### Git Intelligence Summary

- Recent commits confirm the Epic 5 sequence and show the likely implementation surfaces for parity work:
  - `c3b6ff7 feat(epic-5): implement 5-5-revalidate-the-public-screen-against-board-readability-criteria`
  - `778daf9 feat(epic-5): implement 5-4-redesign-the-local-map-for-practical-usefulness`
  - `f9f2a9e feat(epic-5): implement 5-3-add-concrete-nearby-station-and-locality-references`
  - `773df04 feat(epic-5): implement 5-2-replace-verbose-mode-cards-with-compact-rag-transport-rows`
- Those commits repeatedly touched [DashboardScreen.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/DashboardScreen.tsx), [globals.css](/home/codexuser/bmad-6-workshop/src/app/globals.css), [dashboard-presenter.js](/home/codexuser/bmad-6-workshop/src/features/dashboard/presenters/dashboard-presenter.js), [LocalMapFrame.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/LocalMapFrame.tsx), and the smoke/presenter test files. That is a strong signal that `5.6` should continue through those seams rather than reopen the route or server layer.
- The current worktree is already dirty in docs and runtime snapshot areas. The dev story should work with the current tree and must not revert unrelated user or generated changes.

### Latest Tech Information

- Official-source checks on 2026-03-23 do not change the implementation direction for Story `5.6`.
  - Next.js App Router remains the correct host for the canonical public board.
  - `next/font` remains the current official solution for stronger font parity if needed.
  - React still supports the current server/client boundary split used by the route and live screen.
  - TanStack Query still supports the current calm polling model.
  - Node `24` remains aligned with the runtime baseline.
- Inference:
  - there is no technical reason to solve parity by adding a second runtime or framework
  - the safe implementation is a targeted visual refactor of the existing live route and components

### Project Structure Notes

- The story aligns with the unified structure already described in [architecture.md](/home/codexuser/bmad-6-workshop/docs/architecture.md): public route under `src/app/(public)/*`, board UI under `src/features/dashboard/components/*`, presenter shaping under `src/features/dashboard/presenters/*`, and contracts under `src/lib/contracts/*`.
- The design input remains documentation-owned and non-runtime source. The variance from the original Story `5.1` interpretation is now intentional and approved: the design inputs are still not copied directly into runtime, but they are now the acceptance baseline for visual parity.
- No structure conflict needs to be introduced for this story. The parity work should fit the current module layout cleanly.

### Project Context Reference

- No `project-context.md` file exists in this repository at the time of story creation.
- Repository-level implementation guardrails for this story were derived from the active BMAD workflow, the architecture, the Epic 5 artifacts, the sprint change proposal, and current source/test seams.

### References

- [Source: docs/epics.md#Epic 5: Public Display Clarity and Visual Redesign](/home/codexuser/bmad-6-workshop/docs/epics.md#L735)
- [Source: docs/sprint-change-proposal-2026-03-23.md](/home/codexuser/bmad-6-workshop/docs/sprint-change-proposal-2026-03-23.md)
- [Source: docs/design-inputs/code.html](/home/codexuser/bmad-6-workshop/docs/design-inputs/code.html)
- [Source: docs/design-inputs/DESIGN.md](/home/codexuser/bmad-6-workshop/docs/design-inputs/DESIGN.md)
- [Source: docs/architecture.md](/home/codexuser/bmad-6-workshop/docs/architecture.md)
- [Source: docs/ux-design-specification.md](/home/codexuser/bmad-6-workshop/docs/ux-design-specification.md)
- [Source: docs/sprint-artifacts/5-5-revalidate-the-public-screen-against-board-readability-criteria.md](/home/codexuser/bmad-6-workshop/docs/sprint-artifacts/5-5-revalidate-the-public-screen-against-board-readability-criteria.md)
- [Source: src/app/(public)/page.tsx](/home/codexuser/bmad-6-workshop/src/app/(public)/page.tsx)
- [Source: src/app/layout.tsx](/home/codexuser/bmad-6-workshop/src/app/layout.tsx)
- [Source: src/app/globals.css](/home/codexuser/bmad-6-workshop/src/app/globals.css)
- [Source: src/features/dashboard/components/DashboardLiveScreen.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/DashboardLiveScreen.tsx)
- [Source: src/features/dashboard/components/DashboardScreen.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/DashboardScreen.tsx)
- [Source: src/features/dashboard/components/AtmosphericHeader.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/AtmosphericHeader.tsx)
- [Source: src/features/dashboard/components/ModeSummaryGrid.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/ModeSummaryGrid.tsx)
- [Source: src/features/dashboard/components/ModeSummaryCard.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/ModeSummaryCard.tsx)
- [Source: src/features/dashboard/components/LocalityReferencePanel.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/LocalityReferencePanel.tsx)
- [Source: src/features/dashboard/components/LocalMapFrame.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/LocalMapFrame.tsx)
- [Source: src/features/dashboard/presenters/dashboard-presenter.js](/home/codexuser/bmad-6-workshop/src/features/dashboard/presenters/dashboard-presenter.js)
- [Source: src/features/dashboard/hooks/useDashboardQuery.ts](/home/codexuser/bmad-6-workshop/src/features/dashboard/hooks/useDashboardQuery.ts)
- [Source: tests/smoke/startup-smoke.test.mjs](/home/codexuser/bmad-6-workshop/tests/smoke/startup-smoke.test.mjs)
- [Source: tests/unit/dashboard.presenter.test.mjs](/home/codexuser/bmad-6-workshop/tests/unit/dashboard.presenter.test.mjs)
- Official source: https://nextjs.org/docs/app/getting-started/fonts
- Official source: https://react.dev/reference/rsc/use-client
- Official source: https://tanstack.com/query/v5/docs/framework/react/reference/useQuery
- Official source: https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults
- Official source: https://nodejs.org/en/about/previous-releases

### Completion Status

- Story context assembled from the reopened Epic 5 planning artifacts, the approved sprint change proposal, the completed Epic 5 story artifacts, the current dashboard code, package metadata, git history, and official documentation checked on 2026-03-23.
- The story is intentionally scoped to live-route visual parity implementation only.
- Screenshot-based validation, artifact capture, and final evidence closure remain the responsibility of Story `5.7`.
- This story is ready for a dev agent to implement as the parity-delivery step before screenshot validation.
- Ultimate context engine analysis completed: comprehensive developer guide created for Story `5.6`.

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- `curl -s http://127.0.0.1:3000/api/dashboard | head -c 16000`
- `node --test tests/smoke/startup-smoke.test.mjs`
- `npm run test:unit -- tests/unit/dashboard.presenter.test.mjs tests/unit/dashboard.header.test.mjs`
- `npm run validate`

### Completion Notes List

- Reworked the canonical public board into a closer Civic Editorial composition by moving the status headline into the left reading column, tightening the masthead, and turning the right side into a map, stations, and context stack without introducing a second runtime.
- Adopted `next/font` for the approved Inter / Noto Serif pairing and moved secondary context cues plus locality line-token derivation back into [dashboard-presenter.js](/home/codexuser/bmad-6-workshop/src/features/dashboard/presenters/dashboard-presenter.js) so the canonical board remains presenter-owned.
- Tightened the supported-desktop and compact-height shell so the live route stays one-screen without clipping the lower context rail at the supported desktop viewport.
- Refreshed the parity-focused smoke and unit tests around the viewport-height shell, next/font usage, presenter-owned context tiles, and locality line tokens, and passed `npm run validate`.
- Screenshot-based evidence remains the responsibility of Story `5.7`; no Playwright screenshot artifact is stored with Story `5.6`.
- Unrelated repo dirt remained in docs, logs, and runtime snapshot files outside this story write-set and was left untouched.

### File List

- `/home/codexuser/bmad-6-workshop/docs/sprint-artifacts/5-6-close-the-live-public-board-gap-to-the-approved-design-reference.md`
- `/home/codexuser/bmad-6-workshop/docs/sprint-artifacts/sprint-status.yaml`
- `/home/codexuser/bmad-6-workshop/src/app/globals.css`
- `/home/codexuser/bmad-6-workshop/src/app/layout.tsx`
- `/home/codexuser/bmad-6-workshop/src/features/dashboard/components/AtmosphericHeader.tsx`
- `/home/codexuser/bmad-6-workshop/src/features/dashboard/components/DashboardScreen.tsx`
- `/home/codexuser/bmad-6-workshop/src/features/dashboard/components/LocalMapFrame.tsx`
- `/home/codexuser/bmad-6-workshop/src/features/dashboard/components/LocalityReferencePanel.tsx`
- `/home/codexuser/bmad-6-workshop/src/features/dashboard/components/ModeSummaryCard.tsx`
- `/home/codexuser/bmad-6-workshop/src/features/dashboard/components/ModeSummaryGrid.tsx`
- `/home/codexuser/bmad-6-workshop/src/features/dashboard/presenters/dashboard-presenter.js`
- `/home/codexuser/bmad-6-workshop/tests/smoke/startup-smoke.test.mjs`
- `/home/codexuser/bmad-6-workshop/tests/unit/dashboard.header.test.mjs`
- `/home/codexuser/bmad-6-workshop/tests/unit/dashboard.presenter.test.mjs`
