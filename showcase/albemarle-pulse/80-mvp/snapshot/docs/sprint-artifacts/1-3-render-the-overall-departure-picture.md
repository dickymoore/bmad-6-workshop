# Story 1.3: Render the Overall Departure Picture

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Royal Institution visitor,
I want to understand the overall departure state and weather-influenced mood at a glance,
so that I can orient myself in seconds without opening other apps.

## Acceptance Criteria

1. Given the public display is available with current source data, when a visitor looks at the screen from across the foyer, then the overall departure state is legible as calm, watchful, strained, or disrupted, and the atmospheric header gives a weather-aware first read without route advice.
2. Given a visitor moves closer to the display, when they inspect the overall departure picture, then the weather and mobility reading reinforce one coherent local story, and the screen remains fact-only rather than recommending a mode or next action.
3. Given the public display is reviewed against the product doctrine, when the main public shell is read, then it feels calm, shared, venue-native, and location-specific, and it does not read like a route planner, kiosk, or operational dashboard.

## Tasks / Subtasks

- [x] Replace the placeholder public shell with an Epic 1 dashboard structure centered on the overall departure picture. (AC: 1, 2, 3)
  - [x] Keep [page.tsx](/home/codexuser/bmad-6-workshop/src/app/(public)/page.tsx) thin and move feature logic into `src/features/dashboard/*`, following the architecture’s route and component boundaries. (AC: 1, 2, 3)
  - [x] Retire or absorb the temporary `display-shell` presenter into a dashboard-specific presenter shape so Story 1.3 establishes the long-term public-display pattern rather than extending the placeholder contract indefinitely. (AC: 1, 2, 3)
  - [x] Preserve the hidden ops route and keep the public route passive and non-interactive. (AC: 3)
- [x] Implement the atmospheric header as the first room-scale read of the public display. (AC: 1, 3)
  - [x] Render the overall departure state using the four approved labels: `calm`, `watchful`, `strained`, or `disrupted`. (AC: 1)
  - [x] Include weather-aware copy, a Royal Institution place anchor, and a restrained trust or freshness cue that support one coherent first impression without turning into advisory copy. (AC: 1, 2)
  - [x] Ensure meaning does not depend on color alone by pairing status color with explicit wording and structural emphasis. (AC: 1, 3)
- [x] Establish a presenter-backed snapshot contract for the overall departure picture without pulling in live provider integrations yet. (AC: 1, 2)
  - [x] Add the first shared dashboard snapshot contract in `src/lib/contracts/` and a presenter in `src/features/dashboard/presenters/` so later stories can extend the same normalized shape. (AC: 1, 2)
  - [x] Use a static or fixture-backed snapshot for this story’s implementation path; do not introduce external API clients, route handlers, polling, or maintenance actions yet. (AC: 1, 2)
  - [x] Model the overall state, weather summary, place label, and confidence or freshness wording in plain language suitable for mixed-audience public reading. (AC: 1, 2, 3)
- [x] Apply display-first styling that supports far-read orientation and close-read confirmation. (AC: 1, 2, 3)
  - [x] Replace the starter card layout with a strong atmospheric-header-led composition that feels architectural, calm, and venue-native. (AC: 1, 3)
  - [x] Use custom CSS only, with a light neutral base, restrained status grammar, large display typography, and generous whitespace. (AC: 1, 3)
  - [x] Protect the hierarchy expected by later stories: header first, then room for mode summaries and the fixed map, without making Story 1.3 depend on Story 1.4 or Story 1.5 being complete. (AC: 2, 3)
- [x] Add tests that lock in the doctrine and presenter contract for the overall departure picture. (AC: 1, 2, 3)
  - [x] Add or update unit coverage for the dashboard presenter contract, including supported overall-state values and non-advisory copy boundaries. (AC: 1, 2, 3)
  - [x] Extend smoke coverage to assert the public route no longer behaves like a generic placeholder and instead exposes the Royal Institution overall departure picture. (AC: 3)
  - [x] Keep tests lightweight and compatible with the existing baseline validation gate introduced in Story 1.2. (AC: 3)

## Dev Notes

### Developer Context

- Story 1.1 created the Next.js 16 App Router scaffold, separated the public and ops route trees, and hid `/ops` behind `notFound()` until the later ops-access story. Story 1.3 must preserve that split.
- Story 1.2 introduced the first presenter pattern through `src/features/display-shell/presenter.js`, the lightweight local Vitest-compatible test path, and the repo-wide `npm run validate` gate. Reuse those patterns where they help, but move the public experience onto the architecture-approved dashboard feature structure.
- The current public route is still a scaffold placeholder. This story is the first one that needs to make the product feel like Albemarle Pulse rather than a calm shell.
- Keep scope disciplined: this story renders the overall departure picture only. Nearby mode summaries belong to Story 1.4. The fixed Royal Institution map belongs to Story 1.5. Real-device verification and compact-height checks belong to Story 1.6.
- Even though Story 1.4 and Story 1.5 are separate, Story 1.3 must leave obvious structural room for them so the public screen starts to resemble the final composition rather than another temporary card.

### Technical Requirements

- Use the architecture’s server-rendered-shell direction for the public route. This story does not need live polling yet, but it should establish a shape that later client refresh logic can adopt without replacing the whole page.
- Create the first canonical dashboard contract under `src/lib/contracts/`, not inline in the route or component. At minimum, that contract should cover:
  - overall departure state
  - weather-aware summary or condition line
  - place anchor for the Royal Institution
  - trust or freshness wording
  - reserved supporting fields the presenter can expose without route-planner behavior
- Introduce a dashboard presenter under `src/features/dashboard/presenters/` so React components render display-ready copy instead of raw snapshot data.
- Prefer fixture-backed or module-local mock data for this story. Do not add:
  - `src/app/api/dashboard/route.ts`
  - provider adapters under `src/lib/server/providers/*`
  - TanStack Query hooks
  - live polling timers
  - ops actions or status endpoints
- Keep the implementation fact-only. Avoid phrases that rank modes, suggest actions, or imply route recommendations such as "best option", "take", "switch to", or "recommended".
- The overall-state vocabulary must align with the epics and PRD: `calm`, `watchful`, `strained`, `disrupted`.
- Any trust or freshness cue added here must be quiet and local. It should support the overall read without turning the screen into an incident banner.

### Architecture Compliance

- Runtime baseline remains `Next.js 16.x` on `Node.js 24.x`.
- Public UI belongs under `src/features/dashboard/*`; route files compose features rather than containing feature logic.
- Shared contracts belong under `src/lib/contracts/*`.
- No UI component may call external providers directly.
- Public route stays a single non-interactive display surface under `src/app/(public)/*`.
- Ops route remains separate and hidden; nothing from Story 1.3 should leak ops affordances onto the public surface.
- Styling stays on the custom CSS path; do not introduce Tailwind, a third-party design system, or a dashboard template.
- This story should establish the component direction implied by the architecture:
  - `AtmosphericHeader`
  - dashboard presenter
  - dashboard snapshot contract
  - later extension points for trust cues, mode summaries, and map framing

### Library / Framework Requirements

- Use the versions already present in the repo:
  - `next` `16.1.7`
  - `react` `19.2.3`
  - `react-dom` `19.2.3`
  - `typescript` `^5`
- Keep the current lightweight `vitest` compatibility package for unit coverage because that baseline is already committed and wired into `npm run validate`.
- Do not introduce new UI frameworks, state libraries, or mapping packages in this story.
- Latest technical sanity checks completed on 2026-03-18 against official sources:
  - Next.js official docs continue to position `create-next-app` and the App Router as the standard baseline: https://nextjs.org/docs/app
  - Node.js official release pages show the `v24` line as the current major runtime family: https://nodejs.org/en/blog/release
- TanStack Query v5 and Zod 4.x remain architecture requirements for later data and API stories, but they do not need to be installed or exercised yet for Story 1.3.

### File Structure Requirements

- Expected files to add or reshape:
  - [page.tsx](/home/codexuser/bmad-6-workshop/src/app/(public)/page.tsx)
  - [globals.css](/home/codexuser/bmad-6-workshop/src/app/globals.css)
  - `src/features/dashboard/components/AtmosphericHeader.tsx`
  - `src/features/dashboard/presenters/dashboard-presenter.(ts|js)`
  - `src/lib/contracts/dashboard-snapshot.(ts|js)`
  - `tests/unit/dashboard-presenter.test.mjs` or equivalent
  - [startup-smoke.test.mjs](/home/codexuser/bmad-6-workshop/tests/smoke/startup-smoke.test.mjs)
- Existing temporary files that may be absorbed or retired:
  - [presenter.js](/home/codexuser/bmad-6-workshop/src/features/display-shell/presenter.js)
- Keep file and folder naming aligned with the architecture:
  - directories and non-component files in `kebab-case`
  - React component files in `PascalCase`
  - route files limited to composition
- Do not add `src/app/api/*`, `src/lib/server/*`, or map/provider packages in this story unless they are strictly required to avoid a dead-end implementation. The current evidence says they are not needed yet.

### Testing Requirements

- Minimum verification for this story:
  - `npm run lint`
  - `npm run typecheck`
  - `npm test`
  - `npm run build`
- Unit tests should validate the presenter contract rather than fragile visual snapshots.
- Smoke tests should assert doctrine-level behavior on the public route:
  - Royal Institution-specific content is present
  - the overall departure picture is no longer described as a generic shell
  - no route-planner or dashboard-style copy appears
  - the route remains passive and non-interactive
- Keep testing honest about current scope. Story 1.3 does not need to prove:
  - live refresh behavior
  - degraded-source fallback logic
  - mode-summary completeness
  - fixed local map rendering
  - real-device compact-height behavior
- Those capabilities are covered by later Epic 1 and Epic 2 stories; this story only needs to establish the far-read and near-read thesis correctly.

### Previous Story Intelligence

- From Story 1.1:
  - Route separation and the hidden ops surface are already enforced and should not be revisited here.
  - The public page should stay venue-facing and free of scaffold or developer-facing copy.
  - The repo targets Node `24.x`, even though this shell may still run a different local Node version during development.
- From Story 1.2:
  - Presenter-backed rendering is already established as a pattern; continue it instead of hardcoding product copy inside the route.
  - The baseline validation gate and smoke/unit split are already in place; add Story 1.3 coverage into that existing system.
  - The repo currently uses a local `tools/vitest-lite` compatibility package, so test additions should stay straightforward and not assume external package installation.

### Git Intelligence Summary

- Recent implementation work in commit `7d4bafb` focused on:
  - presenter-backed public rendering
  - smoke tests that enforce doctrine and file-structure rules
  - lightweight unit coverage
  - no framework expansion beyond the approved baseline
- That pattern should continue here. Story 1.3 should feel like a feature story layered onto the existing app, not a structural reset.
- The current worktree is effectively clean for product code, with only an unrelated modified log file present. Do not treat that as story scope.

### Latest Tech Information

- Official source checks on 2026-03-18 confirmed the repo’s existing baseline decisions are still current enough for this story:
  - Next.js App Router remains the correct primary model for a server-rendered public route.
  - Node `24.x` remains the intended runtime family already encoded in the repo.
- No additional library research changes Story 1.3’s implementation plan because this story should not introduce new runtime dependencies.

### Project Structure Notes

- The architecture’s long-term tree points public-display work toward `src/features/dashboard/*`, shared contracts toward `src/lib/contracts/*`, and route files toward thin composition only. Story 1.3 is the right point to start matching that structure.
- UX expects the atmospheric header to be the first read from across the foyer, with later stories filling in mode summaries and map framing beneath it. Build the layout to support that sequence.
- The product doctrine remains non-negotiable: calm, shared, venue-native, fact-only, ambient before interactive, location-specific, and not a route planner.
- Avoid a regression where the UI looks like a centered app card or admin shell. This story should begin the real foyer-display composition, even if the data is still fixture-backed.

### References

- `docs/epics.md#Story 1.3: Render the Overall Departure Picture`
- `docs/epics.md` story sequencing for 1.4, 1.5, and 1.6
- `docs/prd.md#Executive Summary`
- `docs/prd.md#MVP - Minimum Viable Product`
- `docs/prd.md#Technical Success`
- `docs/prd.md` measurable outcomes and NFRs for room-scale readability, stable updates, and anti-planner scope
- `docs/ux-design-specification.md#Responsive Design & Accessibility`
- `docs/ux-design-specification.md#Custom Components`
- `docs/ux-design-specification.md` sections on emotional goals, design direction, atmospheric header, and trust cues
- `docs/architecture.md#Frontend Architecture`
- `docs/architecture.md#Implementation Patterns & Consistency Rules`
- `docs/architecture.md` project tree, dashboard contract, and presenter boundary sections
- `docs/sprint-artifacts/1-1-set-up-initial-project-from-approved-starter-template.md`
- `docs/sprint-artifacts/1-2-establish-baseline-quality-gates-and-build-readiness.md`
- `src/app/(public)/page.tsx`
- `src/app/globals.css`
- `src/features/display-shell/presenter.js`
- `tests/smoke/startup-smoke.test.mjs`
- Official source checked 2026-03-18: `https://nextjs.org/docs/app`
- Official source checked 2026-03-18: `https://nodejs.org/en/blog/release`

### Project Context Reference

- No `project-context.md` file exists in this repository at the time of story creation.
- If broader repository guardrails are needed later, run the BMAD `generate-project-context` workflow separately.

### Completion Status

- Story context assembled from Epic 1, the PRD, the UX specification, the architecture, current repo code, sprint status, prior story artifacts, and recent git history.
- Previous-story learnings were incorporated from Story 1.1 and Story 1.2, especially route separation, presenter-backed rendering, and the existing validation gate.
- Official Next.js and Node.js sources were sanity-checked on 2026-03-18; no newer platform constraint changes alter this story’s plan.
- This story is ready for a dev agent to implement as the first true public-display feature story for Epic 1.

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- `git log --oneline -5`
- `git show --stat --oneline --summary 7d4bafb`
- `sed -n '236,340p' docs/epics.md`
- `sed -n '560,670p' docs/ux-design-specification.md`
- `sed -n '880,970p' docs/ux-design-specification.md`
- `sed -n '220,340p' docs/architecture.md`
- `sed -n '500,620p' docs/architecture.md`
- `npm test`
- `npm run validate`

### Implementation Plan

- Replace the temporary public shell with a dashboard-oriented feature structure and atmospheric-header-led composition.
- Introduce the first dashboard snapshot contract and presenter so Story 1.3 establishes the long-term public-display data boundary without adding live integrations yet.
- Encode the story’s doctrine and state vocabulary in unit and smoke tests, then verify with the existing `npm run validate` gate when implementation begins.

### Completion Notes List

- Created comprehensive story context for `1-3-render-the-overall-departure-picture`.
- Scoped the story to far-read and near-read overall-picture work only, excluding mode-summary, map, degraded-source, and device-verification work reserved for later stories.
- Added explicit implementation guardrails around dashboard structure, presenter usage, contract placement, CSS direction, and test coverage.
- Incorporated learnings from Stories 1.1 and 1.2 plus recent git history so the dev agent inherits current repo conventions instead of restarting structure choices.
- Replaced the temporary public shell with a thin route, a dashboard presenter, a fixture-backed snapshot contract, and dedicated `AtmosphericHeader` and `DashboardScreen` components under `src/features/dashboard/*`.
- Retired `src/features/display-shell/presenter.js`, kept `/ops` hidden, and left the public surface passive while reserving structural space for later nearby-mode and map stories.
- Added doctrine-focused unit and smoke coverage for approved overall-state values, non-advisory copy boundaries, venue-specific content, and non-interactive rendering.
- Passed the full validation gate: `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build` via `npm run validate`.
- Review follow-up hardened the shared snapshot contract against advisory copy regressions and moved app-level metadata back to the root layout so the dashboard feature owns only public-route metadata.

### File List

- docs/sprint-artifacts/1-3-render-the-overall-departure-picture.md
- docs/sprint-artifacts/sprint-status.yaml
- src/app/(public)/page.tsx
- src/app/globals.css
- src/app/layout.tsx
- src/features/dashboard/components/AtmosphericHeader.tsx
- src/features/dashboard/components/DashboardScreen.tsx
- src/features/dashboard/data/overall-departure-snapshot.js
- src/features/dashboard/presenters/dashboard-presenter.js
- src/lib/contracts/dashboard-snapshot.js
- tests/smoke/startup-smoke.test.mjs
- tests/unit/dashboard.presenter.test.mjs
- src/features/display-shell/presenter.js (deleted)
- tests/unit/display-shell.presenter.test.mjs (deleted)

### Change Log

- 2026-03-18: Implemented Story 1.3 by replacing the placeholder shell with the first dashboard feature, fixture-backed overall-departure contract, atmospheric header UI, and updated smoke/unit coverage; story advanced to `review`.
