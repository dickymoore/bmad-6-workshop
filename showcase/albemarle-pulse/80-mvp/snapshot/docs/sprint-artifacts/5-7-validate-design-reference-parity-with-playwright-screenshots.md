# Story 5.7: Validate Design-Reference Parity with Playwright Screenshots

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As the product team,
I want repeatable screenshot-based validation against the approved design reference,
so that final acceptance is evidence-backed on the live public route rather than inferred from source inspection.

## Acceptance Criteria

1. Given the required browser dependencies are available, when visual validation runs on the canonical public route, then Playwright captures the live public board at the approved viewport and screenshot evidence is stored in the sprint-artifact set for review.
2. Given screenshot evidence exists, when the live board is compared against `docs/design-inputs/code.html` and `docs/design-inputs/screen.png`, then acceptance passes only if the board achieves close visual parity in layout hierarchy, typography pairing, spacing rhythm, tonal layering, and major section placement, and fact-only product behavior plus passive-map constraints remain intact.
3. Given screenshot capture fails or parity remains materially off-target, when Epic 5 is reviewed, then Epic 5 remains open and product acceptance plus release handoff remain blocked.

## Tasks / Subtasks

- [x] Establish a repo-owned Playwright visual-validation harness for the canonical public board. (AC: 1, 3)
  - [x] Add a direct repo-owned Playwright dependency and scripts in [package.json](/home/codexuser/bmad-6-workshop/package.json), plus a root [playwright.config.ts](/home/codexuser/bmad-6-workshop/playwright.config.ts) that starts the app through Playwright `webServer`/`baseURL` rather than relying on a manually launched browser session. (AC: 1, 3)
  - [x] Add [public-board-visual.spec.ts](/home/codexuser/bmad-6-workshop/tests/e2e/public-board-visual.spec.ts) that opens the existing live public route from [page.tsx](/home/codexuser/bmad-6-workshop/src/app/(public)/page.tsx), waits for the board to settle, and captures screenshot evidence from the canonical runtime instead of a prototype or copied HTML shell. (AC: 1, 2)
  - [x] Keep any screenshot-only stabilization narrow and honest: if a stylesheet, reduced-motion rule, or targeted masking is needed for determinism, it must not hide material layout, typography, or content differences. (AC: 2)
- [x] Capture and store the visual-evidence set in sprint artifacts. (AC: 1, 2)
  - [x] Store the captured live-route screenshots under a Story `5.7` sprint-artifact evidence path rather than `tmp/`, a user desktop, or [docs/design-inputs](/home/codexuser/bmad-6-workshop/docs/design-inputs). (AC: 1)
  - [x] Cover the approved display-first review context from the existing UX/readability contract: the primary `1366px+` foyer layout, the `1024px+` supported desktop adaptation if it materially differs, and any compact-height fallback evidence needed to show the board still holds together without scroll. Document the exact viewport values used in the evidence notes. (AC: 1, 2)
  - [x] Produce a short evidence note in the sprint-artifact set that compares the captured board against [code.html](/home/codexuser/bmad-6-workshop/docs/design-inputs/code.html), [screen.png](/home/codexuser/bmad-6-workshop/docs/design-inputs/screen.png), and [DESIGN.md](/home/codexuser/bmad-6-workshop/docs/design-inputs/DESIGN.md), explicitly calling out pass/fail for hierarchy, typography, spacing rhythm, tonal layering, and major section placement. (AC: 2, 3)
- [x] Keep the acceptance outcome strict and rerunnable. (AC: 2, 3)
  - [x] Ensure the screenshot path is rerunnable from repo tooling, at minimum through `npm run test:e2e` and a targeted screenshot command for the public board. (AC: 1, 3)
  - [x] Preserve the fact-only and passive-map guardrails during validation by adding only narrow assertions or notes around the live board contract; do not convert this story into a second visual-refactor implementation pass unless the evidence exposes a specific blocking gap. (AC: 2, 3)
  - [x] Run `npm run validate` and the Playwright visual-validation command before handoff, and if parity still fails, leave Epic 5 blocked in the recorded evidence instead of soft-passing review. (AC: 3)

## Dev Notes

### Developer Context

- Story `5.7` is the evidence-and-acceptance closure for reopened Epic 5. Story `5.6` already moved the live board materially closer to the approved Civic Editorial reference; `5.7` turns that into a repeatable, repo-owned screenshot validation path.
- The required native browser dependencies are already available in this environment. An ad hoc Playwright screenshot of the live public route has already succeeded locally, so the remaining gap is not screenshot tooling availability; it is repo-owned implementation, stored evidence, and formal acceptance alignment.
- Functional health is currently green from the latest repo state: `npm run validate` passed after Story `5.6`, and the board now fits the supported desktop viewport without the earlier clipped lower section.
- The acceptance target is the live canonical public route, not source inspection:
  - compare against [code.html](/home/codexuser/bmad-6-workshop/docs/design-inputs/code.html), [screen.png](/home/codexuser/bmad-6-workshop/docs/design-inputs/screen.png), and [DESIGN.md](/home/codexuser/bmad-6-workshop/docs/design-inputs/DESIGN.md)
  - capture evidence from [page.tsx](/home/codexuser/bmad-6-workshop/src/app/(public)/page.tsx) through the real app runtime
  - do not treat copied prototype HTML, isolated screenshots, or design-source inspection as acceptance evidence
- The approved review context is already defined by Story `5.5` and the UX spec:
  - primary foyer composition at `1366px+`
  - supported desktop adaptation around `1024px+`
  - compact-height fallback when the display height is constrained, including the existing `max-height: 820px` CSS path
- Product acceptance and release readiness remain intentionally blocked until this story produces evidence-backed parity on the live route. If the screenshot loop shows the board is still materially off-target, the correct outcome is to keep Epic 5 open.

### Technical Requirements

- Treat this as a validation-and-evidence story, not as a fresh UI redesign story.
  - the primary deliverable is a rerunnable Playwright harness plus sprint-artifact evidence
  - only make implementation changes outside the harness if the screenshots expose a specific parity blocker that must be fixed to satisfy acceptance
- Validate the existing canonical runtime.
  - drive the test through [page.tsx](/home/codexuser/bmad-6-workshop/src/app/(public)/page.tsx) and [DashboardLiveScreen.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/DashboardLiveScreen.tsx)
  - keep the presenter-owned truth model in [dashboard-presenter.js](/home/codexuser/bmad-6-workshop/src/features/dashboard/presenters/dashboard-presenter.js) intact
  - do not snapshot `docs/design-inputs/code.html` directly or render a design-only board under `src/`
- Make the viewport contract explicit in the evidence output.
  - use a primary fixed landscape viewport that exercises the `1366px+` foyer layout
  - if the supported desktop adaptation or compact-height fallback is materially different, capture those views too
  - record the exact viewport dimensions used so future reruns are comparable
- Keep the evidence durable and reviewable.
  - store screenshots and the comparison note in the sprint-artifact set under Story `5.7`
  - do not overwrite [screen.png](/home/codexuser/bmad-6-workshop/docs/design-inputs/screen.png) or store validation output in [docs/design-inputs](/home/codexuser/bmad-6-workshop/docs/design-inputs)
  - do not rely on a transient `/tmp` artifact as the final acceptance record

### Architecture Compliance

- Stay inside the documented modular-monolith boundaries from [architecture.md](/home/codexuser/bmad-6-workshop/docs/architecture.md):
  - public route composition remains under `src/app/(public)/*`
  - dashboard UI remains under `src/features/dashboard/*`
  - route files compose feature modules rather than hosting feature logic
  - Playwright validation belongs under `tests/e2e/*` with root-level [playwright.config.ts](/home/codexuser/bmad-6-workshop/playwright.config.ts)
- Preserve one canonical public board.
  - no review-only route
  - no cloned board shell for screenshot capture
  - no static export or copied design HTML as the acceptance target
- Respect scope protection.
  - the test may observe the public board, but it must not introduce planner controls, debug overlays, ops-only affordances, or public interactivity that the product does not actually have
  - validation should confirm the passive map remains passive and the board remains fact-only
- Keep data and integration boundaries intact.
  - do not bypass the app runtime by reaching directly into provider clients from the Playwright test
  - if deterministic fixture setup is needed, use repo-owned test/runtime seams rather than mutating the public component tree into a special acceptance mode

### Library / Framework Requirements

- Remain aligned with the repo baseline in [package.json](/home/codexuser/bmad-6-workshop/package.json):
  - `next` `16.1.7`
  - `react` `19.2.3`
  - `react-dom` `19.2.3`
  - `node` `24.x`
  - existing repo test stack plus a direct `@playwright/test` dependency for `5.7`
- Playwright version handling must be deliberate.
  - the approved change proposal and current [package-lock.json](/home/codexuser/bmad-6-workshop/package-lock.json) already reference `@playwright/test` `^1.51.1`
  - official Playwright release notes list versions through `1.58` on 2026-03-23
  - safest implementation path: add a direct repo-owned Playwright dependency intentionally instead of relying on a transitive lockfile entry, and document the chosen version if you upgrade beyond the currently referenced `^1.51.1`
- Use Playwright in the officially supported way for this story:
  - root `playwright.config.ts`
  - `webServer` plus `baseURL` for starting the app
  - screenshot capture from Playwright test code, not from a manual browser workflow
- Do not expand scope into broad browser-matrix certification.
  - the PRD and UX spec target one controlled desktop browser environment on the venue laptop
  - `5.7` should prove the canonical desktop display path first; extra browser projects are optional only if they do not distract from the acceptance goal

### File Structure Requirements

- Expected new files for this story:
  - [playwright.config.ts](/home/codexuser/bmad-6-workshop/playwright.config.ts)
  - [public-board-visual.spec.ts](/home/codexuser/bmad-6-workshop/tests/e2e/public-board-visual.spec.ts)
- Expected existing files likely to change:
  - [package.json](/home/codexuser/bmad-6-workshop/package.json)
  - [package-lock.json](/home/codexuser/bmad-6-workshop/package-lock.json) if a direct Playwright dependency or scripts are added
  - [sprint-status.yaml](/home/codexuser/bmad-6-workshop/docs/sprint-artifacts/sprint-status.yaml) when the story moves through execution
- Expected evidence location:
  - create a Story `5.7` evidence location under [docs/sprint-artifacts](/home/codexuser/bmad-6-workshop/docs/sprint-artifacts), for example a story-owned markdown evidence note plus captured screenshot files
  - keep approved reference inputs in [docs/design-inputs](/home/codexuser/bmad-6-workshop/docs/design-inputs) read-only as the comparison baseline
- Keep these seams stable unless a targeted fix is unavoidable:
  - [page.tsx](/home/codexuser/bmad-6-workshop/src/app/(public)/page.tsx)
  - [DashboardLiveScreen.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/DashboardLiveScreen.tsx)
  - [useDashboardQuery.ts](/home/codexuser/bmad-6-workshop/src/features/dashboard/hooks/useDashboardQuery.ts)
  - the Story `5.6` board implementation files should only be touched if the new screenshot evidence exposes a concrete blocking parity defect

### Testing Requirements

- Minimum verification for this story:
  - `npm run lint`
  - `npm run typecheck`
  - `npm test`
  - `npm run build`
  - `npm run test:e2e`
  - targeted public-board screenshot command from repo scripts
- Use production-like app startup for the Playwright run.
  - Next.js official guidance recommends testing against production code
  - prefer a Playwright `webServer` that runs the built app and waits for readiness rather than pointing tests at an ad hoc manual server session
- The e2e test should prove more than “a file was written.”
  - confirm the canonical public route loads
  - capture the board at the approved desktop display context
  - if practical, assert core sections are present and the board remains one-screen/passive before writing the final evidence image
- The evidence note must record the acceptance decision.
  - pass only if the captured board stays close to the approved reference in hierarchy, typography, spacing, tonal layering, and section placement
  - if gaps remain, record them explicitly and leave Epic 5 blocked

### Previous Story Intelligence

- From Story `5.6`:
  - the live board has already been refactored toward the approved Civic Editorial reference on the canonical route
  - screenshot-based evidence was intentionally deferred, so `5.7` should not duplicate `5.6` work by reopening broad layout implementation unless the screenshots reveal a specific remaining blocker
  - the `5.6` review rerun already removed an accidental screenshot artifact from [docs/design-inputs](/home/codexuser/bmad-6-workshop/docs/design-inputs), so `5.7` should keep generated evidence in a clean story-owned sprint-artifact location
- From Story `5.5`:
  - the approved viewing context is already documented: `1366px+` foyer layout, `1024px+` supported desktop adaptation, and compact-height fallback
  - readability validation already established the board as functionally acceptable; `5.7` exists to close the stricter visual-parity acceptance gap
- From Stories `5.2` through `5.4`:
  - nearby-mode rows, locality references, and passive map treatment were each intentionally redesigned during Epic 5
  - those surfaces are likely to be the primary screenshot comparison zones if parity is still off-target

### Git Intelligence Summary

- Recent Epic 5 commits confirm the implementation/evidence sequence:
  - `c3b6ff7 feat(epic-5): implement 5-5-revalidate-the-public-screen-against-board-readability-criteria`
  - `778daf9 feat(epic-5): implement 5-4-redesign-the-local-map-for-practical-usefulness`
  - `f9f2a9e feat(epic-5): implement 5-3-add-concrete-nearby-station-and-locality-references`
  - `773df04 feat(epic-5): implement 5-2-replace-verbose-mode-cards-with-compact-rag-transport-rows`
- Those commits repeatedly touched [DashboardScreen.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/DashboardScreen.tsx), [globals.css](/home/codexuser/bmad-6-workshop/src/app/globals.css), [dashboard-presenter.js](/home/codexuser/bmad-6-workshop/src/features/dashboard/presenters/dashboard-presenter.js), [LocalMapFrame.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/LocalMapFrame.tsx), and the smoke/presenter tests. That is strong evidence that the public board remains canonical in those seams and should be validated there rather than rebuilt elsewhere.
- [package-lock.json](/home/codexuser/bmad-6-workshop/package-lock.json) already contains `@playwright/test` references even though [package.json](/home/codexuser/bmad-6-workshop/package.json) does not expose a direct Playwright dependency or repo-owned e2e scripts. `5.7` should close that tooling inconsistency.
- The current worktree is dirty in docs, logs, runtime snapshots, and several Epic 5 source files. The dev story should work with that state and must not revert unrelated user or generated changes while adding the screenshot harness and evidence path.

### Latest Tech Information

- Official Playwright release notes list versions through `1.58` as of 2026-03-23: https://playwright.dev/docs/release-notes
- Official Playwright visual-comparison docs say:
  - `expect(page).toHaveScreenshot()` is the built-in stabilized screenshot assertion path
  - screenshot thresholds such as `maxDiffPixels` and optional `stylePath` belong in config when shared across tests
  - Playwright snapshot files live next to the test by default, which matters if you choose to formalize a baseline-snapshot assertion later
  - source: https://playwright.dev/docs/test-snapshots
- Official Next.js Playwright guidance says:
  - run Playwright against production code where practical
  - `webServer` can be used to start the app and wait for readiness
  - source: https://nextjs.org/docs/pages/guides/testing/playwright
- Inference from those sources:
  - the clean repo-owned solution for `5.7` is a root Playwright config with `webServer` and a spec under `tests/e2e/*`
  - storing final acceptance evidence in the sprint-artifact set is still necessary even if the spec also uses Playwright’s built-in snapshot mechanics internally
  - any screenshot-only style overrides must stay narrow, because the accepted baseline is the real board appearance, not a cosmetically simplified capture mode

### Project Structure Notes

- The story aligns cleanly with the documented project structure:
  - public board route under `src/app/(public)/*`
  - board UI under `src/features/dashboard/*`
  - repo-owned end-to-end validation under `tests/e2e/*`
  - root-level tool config in [playwright.config.ts](/home/codexuser/bmad-6-workshop/playwright.config.ts)
- The main variance to resolve is tooling, not architecture:
  - the architecture already anticipates Playwright, but the current repo does not yet expose the public-board screenshot workflow as first-class tooling in [package.json](/home/codexuser/bmad-6-workshop/package.json)
  - `5.7` should close that gap without creating a parallel board implementation

### Project Context Reference

- No `project-context.md` file exists in this repository at the time of story creation.
- Story guardrails were derived from the active BMAD workflow, Epic 5 artifacts, the approved sprint change proposal, the architecture, the UX specification, and the current repo structure.

### References

- [Source: docs/epics.md#Epic 5: Public Display Clarity and Visual Redesign](/home/codexuser/bmad-6-workshop/docs/epics.md#L735)
- [Source: docs/prd.md](/home/codexuser/bmad-6-workshop/docs/prd.md)
- [Source: docs/ux-design-specification.md](/home/codexuser/bmad-6-workshop/docs/ux-design-specification.md)
- [Source: docs/architecture.md](/home/codexuser/bmad-6-workshop/docs/architecture.md)
- [Source: docs/design-inputs/DESIGN.md](/home/codexuser/bmad-6-workshop/docs/design-inputs/DESIGN.md)
- [Source: docs/design-inputs/code.html](/home/codexuser/bmad-6-workshop/docs/design-inputs/code.html)
- [Source: docs/design-inputs/screen.png](/home/codexuser/bmad-6-workshop/docs/design-inputs/screen.png)
- [Source: docs/sprint-change-proposal-2026-03-23.md](/home/codexuser/bmad-6-workshop/docs/sprint-change-proposal-2026-03-23.md)
- [Source: docs/sprint-artifacts/5-5-public-board-readability-validation.md](/home/codexuser/bmad-6-workshop/docs/sprint-artifacts/5-5-public-board-readability-validation.md)
- [Source: docs/sprint-artifacts/5-6-close-the-live-public-board-gap-to-the-approved-design-reference.md](/home/codexuser/bmad-6-workshop/docs/sprint-artifacts/5-6-close-the-live-public-board-gap-to-the-approved-design-reference.md)
- [Source: docs/sprint-artifacts/sprint-status.yaml](/home/codexuser/bmad-6-workshop/docs/sprint-artifacts/sprint-status.yaml)
- [Source: package.json](/home/codexuser/bmad-6-workshop/package.json)
- [Source: package-lock.json](/home/codexuser/bmad-6-workshop/package-lock.json)
- [Source: src/app/(public)/page.tsx](/home/codexuser/bmad-6-workshop/src/app/(public)/page.tsx)
- [Source: src/features/dashboard/components/DashboardLiveScreen.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/DashboardLiveScreen.tsx)
- [Source: src/features/dashboard/hooks/useDashboardQuery.ts](/home/codexuser/bmad-6-workshop/src/features/dashboard/hooks/useDashboardQuery.ts)
- [Source: src/features/dashboard/components/DashboardScreen.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/DashboardScreen.tsx)
- [Source: src/features/dashboard/components/LocalMapFrame.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/LocalMapFrame.tsx)
- [Source: src/features/dashboard/components/LocalityReferencePanel.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/LocalityReferencePanel.tsx)
- [Source: src/features/dashboard/presenters/dashboard-presenter.js](/home/codexuser/bmad-6-workshop/src/features/dashboard/presenters/dashboard-presenter.js)
- Official source: https://playwright.dev/docs/release-notes
- Official source: https://playwright.dev/docs/test-snapshots
- Official source: https://playwright.dev/docs/best-practices
- Official source: https://nextjs.org/docs/pages/guides/testing/playwright

### Completion Status

- Story context assembled from Epic 5 planning artifacts, the approved sprint change proposal, the completed Story `5.6` implementation record, the Story `5.5` validation artifact, the architecture, the UX specification, current package metadata, git history, and official documentation checked on 2026-03-23.
- Screenshot-based visual validation is operational in this environment; the remaining work for `5.7` is to make that capability repo-owned, store formal evidence in the sprint-artifact set, and record a hard pass/fail acceptance decision.
- This story is intentionally scoped to screenshot validation, evidence storage, and acceptance closure on the canonical live route.
- If the evidence shows parity still misses the approved reference, Epic 5 must stay open and the gap should be recorded rather than softened in review.
- Ultimate context engine analysis completed: comprehensive developer guide created for Story `5.7`.

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- `npm install`
- `npm run test:smoke -- tests/smoke/public-board-visual-harness.test.mjs`
- `npm run screenshot:public-board`
- `npm run test:e2e`
- `npm run validate`
- `npx playwright install chromium` (failed under TLS certificate trust, so the repo-owned dependency was pinned to `1.51.1` to reuse the already-working local browser cache)

### Completion Notes List

- Added a repo-owned Playwright harness with `start:e2e`, `test:e2e`, and `screenshot:public-board`, plus a root [playwright.config.ts](/home/codexuser/bmad-6-workshop/playwright.config.ts) that runs the production app on a dedicated port for deterministic capture. `test:e2e` now writes only transient rerun artifacts under `test-results/public-board-visual`, while `screenshot:public-board` promotes the official sprint-artifact evidence set.
- Added [public-board-visual.spec.ts](/home/codexuser/bmad-6-workshop/tests/e2e/public-board-visual.spec.ts) and [public-board-visual-harness.test.mjs](/home/codexuser/bmad-6-workshop/tests/smoke/public-board-visual-harness.test.mjs) so the canonical public route is now guarded by both repo smoke coverage and an end-to-end screenshot path with stable-state waiting, a `code.html`-derived editorial contract, and a normalized `screen.png` foyer fingerprint check.
- Generated the sprint-artifact evidence set in [5-7-design-parity-evidence](/home/codexuser/bmad-6-workshop/docs/sprint-artifacts/5-7-design-parity-evidence) and updated [5-7-playwright-visual-validation-evidence.md](/home/codexuser/bmad-6-workshop/docs/sprint-artifacts/5-7-playwright-visual-validation-evidence.md) so the acceptance note cites actual runtime metrics rather than manual-only visual claims.
- No additional board implementation changes were required for Story `5.7`; the current Story `5.6` live-route parity work passed the screenshot-based validation gate.
- Passed `npm run test:e2e` and `npm run validate` after pinning the direct Playwright dependency to `1.51.1`, which matches the working local browser cache and avoids the newer CDN download TLS failure in this environment.

### Change Log

- 2026-03-23: Added repo-owned Playwright public-board validation tooling, generated screenshot evidence plus runtime metrics, and recorded a passing visual-acceptance note for Epic 5 closure.
- 2026-03-23: Review fixes tightened the rerunnable parity gate, separated transient rerun artifacts from the official evidence pack, and refreshed the evidence note from the final automated metrics.

### File List

- `docs/sprint-artifacts/5-7-validate-design-reference-parity-with-playwright-screenshots.md`
- `docs/sprint-artifacts/5-7-playwright-visual-validation-evidence.md`
- `docs/sprint-artifacts/5-7-design-parity-evidence/compact-height-1366x800.json`
- `docs/sprint-artifacts/5-7-design-parity-evidence/compact-height-1366x800.png`
- `docs/sprint-artifacts/5-7-design-parity-evidence/desktop-1024x768.json`
- `docs/sprint-artifacts/5-7-design-parity-evidence/desktop-1024x768.png`
- `docs/sprint-artifacts/5-7-design-parity-evidence/foyer-1366x900.json`
- `docs/sprint-artifacts/5-7-design-parity-evidence/foyer-1366x900.png`
- `docs/sprint-artifacts/sprint-status.yaml`
- `package-lock.json`
- `package.json`
- `playwright.config.ts`
- `tests/e2e/public-board-visual.spec.ts`
- `tests/smoke/public-board-visual-harness.test.mjs`
