# Story 1.4: Show Nearby Mode Summaries for Shared Reading

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visitor or host,
I want to compare the nearby departure modes in plain language,
so that I can infer what still looks viable from one shared screen.

## Acceptance Criteria

1. Given current mode data is available, when a visitor or host reads the mode summary area, then the core nearby mode set is shown as a local, from-here-now comparison, and the summaries stay plain-language and fact-only rather than planner-like.
2. Given a small group reads the display together, when they compare the visible mode summaries, then they can reach the same broad departure read from the same facts, and the screen does not require London transport fluency to understand the main picture.
3. Given one or more mode summaries are present, when a staff member refers to the screen while helping attendees, then the same visible information supports the conversation, and the host does not need to translate the screen into route-planning advice.

## Tasks / Subtasks

- [x] Replace the reserved nearby-modes placeholder with a first implementation of the shared mode-summary field. (AC: 1, 2, 3)
  - [x] Keep [page.tsx](/home/codexuser/bmad-6-workshop/src/app/(public)/page.tsx) thin and continue composing the public display through `src/features/dashboard/*` rather than pushing feature logic back into the route. (AC: 1, 2, 3)
  - [x] Replace the `"Nearby modes"` reserved surface in [DashboardScreen.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/DashboardScreen.tsx) with real nearby-mode summary components while preserving the map placeholder for Story 1.5. (AC: 1, 2, 3)
  - [x] Keep the public route passive and non-interactive; no buttons, links, filters, ranking controls, or route-planner affordances should appear on the main display. (AC: 1, 2, 3)
- [x] Extend the dashboard snapshot contract and presenter to carry nearby-mode comparison data in plain language. (AC: 1, 2, 3)
  - [x] Add a normalized nearby-mode collection to [dashboard-snapshot.js](/home/codexuser/bmad-6-workshop/src/lib/contracts/dashboard-snapshot.js) with fields for mode label, state, concise factual summary, and optional quiet trust nuance. (AC: 1, 2, 3)
  - [x] Update [overall-departure-snapshot.js](/home/codexuser/bmad-6-workshop/src/features/dashboard/data/overall-departure-snapshot.js) to provide fixture-backed nearby-mode data for the core local modes without introducing external providers yet. (AC: 1, 2, 3)
  - [x] Update [dashboard-presenter.js](/home/codexuser/bmad-6-workshop/src/features/dashboard/presenters/dashboard-presenter.js) so components render display-ready copy and grouped mode summaries instead of raw snapshot values. (AC: 1, 2, 3)
- [x] Implement mode-summary components that support shared scanning at closer range without turning the product into a dashboard or planner. (AC: 1, 2, 3)
  - [x] Add a `ModeSummaryGrid` component to organize the nearby-mode comparison field as the main close-up confirmation layer beneath the atmospheric header. (AC: 1, 2, 3)
  - [x] Add a `ModeSummaryCard` or equivalent focused component that shows mode name, approved state wording, concise factual note, and non-color status reinforcement. (AC: 1, 2, 3)
  - [x] Keep the copy plain-language and local: emphasize broad viability from here, now; avoid station-board density, route ranking, exact planning logic, or prescriptive verbs such as `take`, `switch to`, `recommended`, or `best option`. (AC: 1, 2, 3)
- [x] Preserve the display-first visual hierarchy established in Story 1.3 while making nearby comparison legible for pairs, small groups, and hosts. (AC: 1, 2, 3)
  - [x] Use custom CSS only in [globals.css](/home/codexuser/bmad-6-workshop/src/app/globals.css) to give the mode field a clear second-read role beneath the atmospheric header and ahead of the future map. (AC: 1, 2, 3)
  - [x] Support quick group scanning through strong labels, restrained spacing, and concise summaries that remain understandable for visitors without London transport fluency. (AC: 2, 3)
  - [x] Preserve room-scale composure and screen order: atmospheric header first, nearby modes second, map frame third. (AC: 1, 2, 3)
- [x] Add tests that lock in the mode-summary contract, doctrine, and public-display boundaries. (AC: 1, 2, 3)
  - [x] Extend [dashboard.presenter.test.mjs](/home/codexuser/bmad-6-workshop/tests/unit/dashboard.presenter.test.mjs) to cover normalized nearby-mode data, supported mode-state vocabulary, and fact-only copy boundaries. (AC: 1, 2, 3)
  - [x] Extend [startup-smoke.test.mjs](/home/codexuser/bmad-6-workshop/tests/smoke/startup-smoke.test.mjs) so the public route is required to render nearby-mode summaries and remain passive, venue-specific, and non-planner-like. (AC: 1, 2, 3)
  - [x] Keep tests compatible with the existing `npm run validate` gate and avoid brittle visual-snapshot testing. (AC: 1, 2, 3)

## Dev Notes

### Developer Context

- Story 1.3 already established the dashboard feature path under `src/features/dashboard/*`, a fixture-backed dashboard snapshot, and the atmospheric-header-led public composition. Story 1.4 should extend that same architecture instead of introducing a parallel display model.
- The current screen intentionally leaves two reserved regions beneath the header: a nearby-modes summary area and a local-map placeholder. Story 1.4 should fully occupy the summary area but leave the map placeholder intact for Story 1.5.
- Scope discipline matters here:
  - Story 1.4 is the first close-up mode-comparison layer.
  - Story 1.5 owns the fixed Royal Institution map.
  - Epic 2 stories own live refresh, trend, freshness escalation, degraded-source handling, and stable update behavior under changing data.
- The story should make the public display more useful for shared reading without changing the product doctrine. It is still one calm foyer instrument, not a route planner, departure board, or ops dashboard.

### Technical Requirements

- Keep the implementation on the current server-rendered-shell path. This story can remain fixture-backed and should not add:
  - `src/app/api/dashboard/route.ts`
  - provider adapters under `src/lib/server/providers/*`
  - TanStack Query hooks
  - polling timers
  - ops actions or degraded-source system messaging
- Extend the shared dashboard snapshot contract rather than introducing mode data ad hoc inside components. At minimum, the nearby-mode structure should support:
  - a stable mode key
  - public-facing mode label
  - status/state label
  - concise factual summary
  - optional quiet support or trust nuance
- Keep nearby modes focused on the local core set called out by the PRD and epics:
  - Tube or rail
  - bus
  - roads
  - any enabled micromobility feed, if represented in the fixture
- Mode state vocabulary should stay simple and public-facing. Use wording that keeps the product legible for mixed audiences and consistent with the UX guidance around available / caution / disrupted style summaries; if a broader contract is added for future extension, it must still render plain-language labels on screen.
- Preserve the anti-planner contract in both contract validation and presenter output. The mode field should help people infer broad viability, not tell them what to do or simulate route ranking.

### Architecture Compliance

- Runtime baseline remains `Next.js 16.1.7` on `Node.js 24.x`.
- Public display UI stays under `src/features/dashboard/*`; route files compose features rather than containing feature logic.
- Shared contracts belong under `src/lib/contracts/*`.
- No component may call external providers directly.
- Styling remains custom CSS; do not introduce Tailwind, a UI library, or transport/map dependencies in this story.
- Preserve the architecture’s feature boundaries:
  - UI components under `src/features/dashboard/components/*`
  - presenter logic under `src/features/dashboard/presenters/*`
  - fixture-backed story data under `src/features/dashboard/data/*`
  - shared contracts under `src/lib/contracts/*`
- Keep the public route non-interactive and separate from the hidden ops route.

### Library / Framework Requirements

- Use the repo’s existing dependencies and versions:
  - `next` `16.1.7`
  - `react` `19.2.3`
  - `react-dom` `19.2.3`
  - `typescript` `^5`
  - `vitest` via the local compatibility package already wired into the repo
- Do not add new packages for cards, icons, state management, or mapping in this story.
- Latest technical sanity checks completed on 2026-03-18 against official sources:
  - Next.js docs continue to describe Next.js as the React framework for building full-stack applications and keep the App Router as the current path: https://nextjs.org/docs
  - React docs currently show `v19.2` and continue to recommend a full-stack framework such as Next.js for app development: https://react.dev/
  - Node.js official releases show `v24` as `Active LTS` as of February 24, 2026, which aligns with the repo’s runtime contract: https://nodejs.org/en/about/previous-releases
- No newer official guidance changes this story’s plan because Story 1.4 should extend the current dashboard feature structure, not introduce new runtime dependencies.

### File Structure Requirements

- Expected files to add or reshape:
  - [DashboardScreen.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/DashboardScreen.tsx)
  - `src/features/dashboard/components/ModeSummaryGrid.tsx`
  - `src/features/dashboard/components/ModeSummaryCard.tsx`
  - [dashboard-presenter.js](/home/codexuser/bmad-6-workshop/src/features/dashboard/presenters/dashboard-presenter.js)
  - [overall-departure-snapshot.js](/home/codexuser/bmad-6-workshop/src/features/dashboard/data/overall-departure-snapshot.js)
  - [dashboard-snapshot.js](/home/codexuser/bmad-6-workshop/src/lib/contracts/dashboard-snapshot.js)
  - [globals.css](/home/codexuser/bmad-6-workshop/src/app/globals.css)
  - [dashboard.presenter.test.mjs](/home/codexuser/bmad-6-workshop/tests/unit/dashboard.presenter.test.mjs)
  - [startup-smoke.test.mjs](/home/codexuser/bmad-6-workshop/tests/smoke/startup-smoke.test.mjs)
- Existing files to preserve, not rework beyond what this story needs:
  - [AtmosphericHeader.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/AtmosphericHeader.tsx)
  - [page.tsx](/home/codexuser/bmad-6-workshop/src/app/(public)/page.tsx)
- Keep naming aligned with the architecture:
  - React components in `PascalCase`
  - directories and non-component files in `kebab-case`
  - route files limited to composition

### Testing Requirements

- Minimum verification for implementation:
  - `npm run lint`
  - `npm run typecheck`
  - `npm test`
  - `npm run build`
- Unit tests should validate the shared contract and presenter output rather than styling snapshots.
- Smoke tests should assert:
  - nearby mode summaries render on the public route
  - the public route remains venue-specific and passive
  - route-planner or recommendation language does not appear
  - the map region remains a reserved future area rather than disappearing entirely
- Keep testing honest about scope. Story 1.4 does not need to prove:
  - live polling or provider refresh
  - trend handling
  - degraded-source fallbacks
  - trust escalation beyond quiet local phrasing
  - real-device validation on venue-sized screens
- Those capabilities belong to Story 1.5, Story 1.6, and Epic 2.

### Previous Story Intelligence

- From Story 1.3:
  - The dashboard route is now feature-based and should stay that way.
  - The atmospheric header already establishes the far-read thesis; Story 1.4 should become the close-up confirmation layer under it.
  - The screen currently includes reserved sections labeled `"Nearby modes"` and `"Local frame"`, which is a direct handoff into Stories 1.4 and 1.5.
  - The shared snapshot contract already enforces fact-only wording for several public-copy fields; extend that guardrail instead of creating a second validation path.
- From Stories 1.1 and 1.2, carried forward into Story 1.3:
  - The ops route remains hidden and separate.
  - The repo already has a clear `npm run validate` gate and lightweight unit/smoke split.
  - The project baseline is intentionally minimal and should not be expanded with unnecessary UI tooling.

### Git Intelligence Summary

- Recent commit `f362a00` implemented Story 1.3 by:
  - creating the dashboard feature structure
  - introducing the dashboard snapshot contract and presenter
  - adding reserved lower-grid regions specifically for nearby modes and the future map
  - extending smoke and unit coverage around doctrine and passive public rendering
- Story 1.4 should build directly on that pattern. The fastest safe path is to replace only the summary placeholder with real mode-summary components and keep the rest of the shell stable.
- Recent commit `7d4bafb` established the validation gate and test conventions that Story 1.4 should keep using unchanged.

### Latest Tech Information

- Official-source checks on 2026-03-18 confirmed the current repo baseline remains sound for this story:
  - Next.js continues to position the App Router path as the modern full-stack React application path.
  - React documentation continues to recommend using a framework such as Next.js for full applications.
  - Node.js `v24` is listed as `Active LTS`, so the repo’s `24.x` engine contract is still a reasonable production target.
- Those checks support continuing with the current architecture rather than reworking the runtime or dependency stack during Story 1.4.

### Project Structure Notes

- UX expects a deliberate reading order:
  - atmospheric header first
  - mode summaries second
  - fixed local map third
- The mode-summary field is a core bespoke component, not a generic card grid. It should feel like shared public signage: concise, architectural, and easy to scan.
- Group readability matters as much as individual readability. Labels and summaries must help hosts and small groups reach the same broad read from the same screen without insider transport fluency.
- Avoid regressions toward:
  - dashboard density
  - route-planner language
  - citywide network sprawl
  - interactive UI controls on the public display

### References

- `docs/epics.md#Story 1.4: Show Nearby Mode Summaries for Shared Reading`
- `docs/prd.md#Success Criteria`
- `docs/prd.md#MVP - Minimum Viable Product`
- `docs/prd.md` sections on user success, measurable outcomes, Royal Institution journeys, and fact-only mode summaries
- `docs/ux-design-specification.md#Mode Summary Block`
- `docs/ux-design-specification.md#Custom Components`
- `docs/ux-design-specification.md#Implementation Roadmap`
- `docs/ux-design-specification.md` sections on room-scale read, close-up confirmation, group readability, anti-planner behavior, and Direction 01
- `docs/architecture.md#Frontend Architecture`
- `docs/architecture.md#Implementation Patterns & Consistency Rules`
- `docs/architecture.md` project tree and contract-boundary sections
- `docs/sprint-artifacts/1-3-render-the-overall-departure-picture.md`
- `src/app/(public)/page.tsx`
- `src/features/dashboard/components/DashboardScreen.tsx`
- `src/features/dashboard/presenters/dashboard-presenter.js`
- `src/lib/contracts/dashboard-snapshot.js`
- `tests/smoke/startup-smoke.test.mjs`
- Official source checked 2026-03-18: `https://nextjs.org/docs`
- Official source checked 2026-03-18: `https://react.dev/`
- Official source checked 2026-03-18: `https://nodejs.org/en/about/previous-releases`

### Project Context Reference

- No `project-context.md` file exists in this repository at the time of story creation.
- If broader repository guardrails are needed later, run the BMAD `generate-project-context` workflow separately.

### Completion Status

- Story context assembled from Epic 1, the PRD, the UX specification, the architecture, the current dashboard code, sprint status, prior story artifacts, recent git history, and official framework/runtime references checked on 2026-03-18.
- Previous-story learnings were incorporated from Stories 1.1 through 1.3, especially route separation, the validation gate, the fixture-backed dashboard contract, and the reserved screen structure created for this story.
- The story is intentionally scoped to shared nearby-mode summaries only. Map anchoring, venue-sized verification, live updates, trend, and degraded-source behavior remain outside Story 1.4.
- This story is ready for a dev agent to implement as the first close-up mode-comparison layer of the Royal Institution departure picture.

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- `sed -n '1,220p' _bmad/bmm/agents/dev.md`
- `sed -n '1,320p' _bmad/bmm/workflows/4-implementation/dev-story/instructions.xml`
- `sed -n '1,320p' docs/sprint-artifacts/1-4-show-nearby-mode-summaries-for-shared-reading.md`
- `sed -n '1,260p' src/features/dashboard/components/DashboardScreen.tsx`
- `sed -n '1,220p' src/features/dashboard/components/AtmosphericHeader.tsx`
- `sed -n '1,260p' src/features/dashboard/presenters/dashboard-presenter.js`
- `sed -n '1,260p' src/features/dashboard/data/overall-departure-snapshot.js`
- `sed -n '1,260p' src/lib/contracts/dashboard-snapshot.js`
- `sed -n '1,260p' tests/unit/dashboard.presenter.test.mjs`
- `sed -n '1,260p' tests/smoke/startup-smoke.test.mjs`
- `sed -n '1,420p' src/app/globals.css`
- `npm run test:unit -- tests/unit/dashboard.presenter.test.mjs`
- `node --test tests/smoke/startup-smoke.test.mjs`
- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run build`
- `npm run validate`
- `sed -n '252,312p' docs/epics.md`
- `sed -n '236,330p' docs/architecture.md`
- `sed -n '430,530p' docs/architecture.md`
- `sed -n '560,690p' docs/ux-design-specification.md`
- `sed -n '740,780p' docs/ux-design-specification.md`
- `sed -n '60,110p' docs/prd.md`
- `sed -n '116,150p' docs/prd.md`
- `sed -n '1,260p' docs/sprint-artifacts/1-3-render-the-overall-departure-picture.md`
- `git log --oneline -5`
- `git show --stat --oneline --summary f362a00`
- `git show --stat --oneline --summary 7d4bafb`
- Official sources checked 2026-03-18:
  - `https://nextjs.org/docs`
  - `https://react.dev/`
  - `https://nodejs.org/en/about/previous-releases`

### Implementation Plan

- Extend the dashboard snapshot contract with normalized nearby-mode items and presenter-facing state labels while keeping the public display fact-only.
- Replace the summary placeholder with dedicated shared-reading mode-summary components and preserve the map frame as a reserved Story 1.5 slot.
- Lock the work with unit and smoke assertions, then clear the repo validation gate (`lint`, `typecheck`, `test`, `build`, `validate`) before marking review-ready.

### Completion Notes List

- Replaced the generic nearby-modes placeholder with `ModeSummaryGrid` and `ModeSummaryCard`, keeping the public route passive and leaving the future map frame intact.
- Extended the shared snapshot contract with validated `nearbyModes` data and presenter-generated state labels for shared-reading mode summaries.
- Added fixture-backed nearby-mode summaries for tube and rail, bus, roads, and cycles and scooters using plain-language, local, fact-only copy.
- Updated `globals.css` to establish the intended read order: atmospheric header first, nearby mode comparison second, reserved map frame third.
- Extended unit and smoke coverage for nearby-mode contract vocabulary, fact-only doctrine, passive rendering, and the preserved future map slot.
- Cleared `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, and `npm run validate`.

### File List

- docs/sprint-artifacts/1-4-show-nearby-mode-summaries-for-shared-reading.md
- docs/sprint-artifacts/sprint-status.yaml
- src/app/globals.css
- src/features/dashboard/components/AtmosphericHeader.tsx
- src/features/dashboard/components/DashboardScreen.tsx
- src/features/dashboard/components/ModeSummaryGrid.tsx
- src/features/dashboard/components/ModeSummaryCard.tsx
- src/features/dashboard/data/overall-departure-snapshot.js
- src/features/dashboard/presenters/dashboard-presenter.js
- src/lib/contracts/dashboard-snapshot.js
- tests/smoke/startup-smoke.test.mjs
- tests/unit/dashboard.presenter.test.mjs

### Change Log

- 2026-03-18: Implemented Story 1.4 nearby-mode shared-reading summaries, added contract and presenter support, updated passive display styling, and passed the full validation gate.
- 2026-03-18: Senior developer code review fixed public placeholder copy, added unique nearby-mode key enforcement, expanded review coverage, and closed the story.

## Senior Developer Review (AI)

### Outcome

- Approved after fixes.

### Findings

1. High: The public map region rendered the literal copy `Map placeholder`, which exposed internal implementation wording on the visitor-facing screen and undercut the venue-native display doctrine in AC2 and AC3.
2. Medium: `createDashboardSnapshot` accepted duplicate nearby-mode keys after trimming, which could collapse cards behind duplicate React keys and break the stable local comparison required by AC1.
3. Medium: The story review workflow had not been closed out in the artifact itself; status, review notes, and sprint tracking were still left in the pre-review state despite the implementation being validated.

### Fixes Applied

- Replaced the map-region support copy with public-facing reserved-language that keeps the future map slot visible without exposing placeholder text.
- Added normalized unique-key validation for `nearbyModes` in the shared snapshot contract.
- Extended unit and smoke coverage for duplicate-key rejection and for preventing placeholder copy from reaching the public route.
- Updated the story status and review record to reflect the completed review workflow.
