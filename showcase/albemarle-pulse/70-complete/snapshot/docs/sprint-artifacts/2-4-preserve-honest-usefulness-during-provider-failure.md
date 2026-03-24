# Story 2.4: Preserve Honest Usefulness During Provider Failure

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visitor,
I want the display to remain useful when one source fails or degrades,
so that I can still rely on the parts of the departure picture that remain trustworthy.

## Acceptance Criteria

1. Given one provider or signal becomes degraded, delayed, or unavailable, when the display updates, then the affected area is identified clearly as reduced-confidence or unavailable, and unaffected parts of the departure picture remain visible and usable.
2. Given provider failure affects only one component or mode, when a visitor reads the display, then they can tell which part of the picture is affected, and the display does not blank the whole screen or imply that all data is untrustworthy.
3. Given a provider failure triggers fallback behavior, when the public screen renders the degraded state, then the screen stays calm, honest, and location-specific, and the negative path is handled as a visible trust condition rather than as a raw technical error.

## Tasks / Subtasks

- [x] Extend the canonical dashboard snapshot and presenter so provider failure is modeled explicitly at the affected component level instead of collapsing to all-or-nothing fallback semantics. (AC: 1, 2, 3)
  - [x] Add explicit degraded and unavailable evidence to the shared dashboard contract in [dashboard-snapshot.js](/home/codexuser/bmad-6-workshop/src/lib/contracts/dashboard-snapshot.js) for the header, nearby modes, and local map so the public UI can localize failure honestly. (AC: 1, 2)
  - [x] Keep the contract fact-only, serializable, and backward-safe for persisted last-safe snapshots and existing live-route consumers. (AC: 1, 3)
  - [x] Preserve the distinction between service disruption from Story 2.3 and provider-failure trust narrowing from Story 2.4 so stale or unavailable evidence does not masquerade as service disruption. (AC: 2, 3)
- [x] Refine the server-side snapshot build and publication flow so partial provider failure degrades only the affected parts of the departure picture. (AC: 1, 2, 3)
  - [x] Update [build-dashboard-snapshot.js](/home/codexuser/bmad-6-workshop/src/lib/server/dashboard/build-dashboard-snapshot.js) to keep successful live inputs visible while failed inputs become reduced-confidence or unavailable at the correct scope. (AC: 1, 2)
  - [x] Update [dashboard-service.js](/home/codexuser/bmad-6-workshop/src/lib/server/dashboard/dashboard-service.js) and [publish-dashboard-snapshot.js](/home/codexuser/bmad-6-workshop/src/lib/server/dashboard/publish-dashboard-snapshot.js) so full-screen fallback is reserved for genuine whole-snapshot failure, while single-provider failure still produces a truthful mixed snapshot. (AC: 1, 2, 3)
  - [x] Reuse the existing file-backed last-safe snapshot and fallback local-map patterns only where they preserve an honest local read, and label any carried-forward value before it reaches the public surface. (AC: 1, 3)
- [x] Update the public UI so degraded-source states stay calm, visible, and localized. (AC: 1, 2, 3)
  - [x] Refine [AtmosphericHeader.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/AtmosphericHeader.tsx), [ModeSummaryCard.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/ModeSummaryCard.tsx), and any adjacent shell components so visitors can identify what remains trustworthy and what has narrowed or gone unavailable. (AC: 1, 2)
  - [x] Keep degraded-state wording plain, public, and non-technical; avoid provider names, stack traces, retry jargon, HTTP language, or operational alarms on the public route. (AC: 3)
  - [x] Preserve the existing public hierarchy from Stories 1.6, 2.1, 2.2, and 2.3: atmospheric header first, nearby modes second, fixed local map third, with no screen blanking or full-route takeover. (AC: 1, 2, 3)
- [x] Lock the negative path in with automated coverage focused on truthful degradation rather than happy-path field presence. (AC: 1, 2, 3)
  - [x] Add unit coverage proving one failed provider narrows confidence only in the affected area while successful components remain readable and available. (AC: 1, 2)
  - [x] Add route or live-path coverage proving last-safe snapshot fallback is used only when the entire rebuild cannot produce an honest mixed snapshot. (AC: 2, 3)
  - [x] Add smoke or component coverage proving degraded-source messaging stays calm, location-specific, and free of raw technical errors or ops-console language. (AC: 3)
  - [x] Keep the full verification path compatible with `npm run validate`. (AC: 1, 2, 3)

## Dev Notes

### Developer Context

- Story 2.1 established the request-time live dashboard route, same-origin API, memory cache, and file-backed last-safe snapshot path.
- Story 2.2 added trend, per-signal trust, and local confidence narrowing, but it intentionally stopped short of full provider-failure choreography.
- Story 2.3 added serious disruption emphasis and made an explicit scope distinction: disruption visibility is about real service strain, while Story 2.4 owns degraded or unavailable-source handling.
- Current repo shape already contains the main extension points for this story:
  - [build-dashboard-snapshot.js](/home/codexuser/bmad-6-workshop/src/lib/server/dashboard/build-dashboard-snapshot.js) already uses `Promise.allSettled()` and can preserve partial success instead of treating every miss as global failure.
  - [dashboard-service.js](/home/codexuser/bmad-6-workshop/src/lib/server/dashboard/dashboard-service.js) currently falls back to the last-safe or fixture snapshot when build publication fails wholesale.
  - [snapshot-store.js](/home/codexuser/bmad-6-workshop/src/lib/server/cache/snapshot-store.js) persists the last safe snapshot and 15-minute history window that must remain backward-safe.
  - [dashboard-presenter.js](/home/codexuser/bmad-6-workshop/src/features/dashboard/presenters/dashboard-presenter.js) already shapes trust and disruption copy into one canonical public view model.
  - [AtmosphericHeader.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/AtmosphericHeader.tsx), [ModeSummaryCard.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/ModeSummaryCard.tsx), and [LocalMapFrame.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/LocalMapFrame.tsx) are the visible public surfaces that must communicate degraded scope without becoming technical.
- Scope discipline matters:
  - Story 2.3 owns unmistakable disruption from real mode or overall state strain.
  - Story 2.4 owns truthful usefulness during provider degradation and unavailable inputs.
  - Story 2.5 owns broader stable reading under live updates and reduced-motion-safe meaning.

### Technical Requirements

- Keep provider failure localized whenever honest data still exists.
  - one failing source must not blank the whole display if the other signals remain valid
  - successful live values should remain visible
  - any carried-forward value must be explicitly marked reduced-confidence or unavailable before presentation
- Preserve one canonical snapshot and presenter path. Do not derive fallback semantics ad hoc inside individual React components.
- Distinguish the negative-path categories clearly:
  - `disrupted` remains service-state semantics from Story 2.3
  - degraded, delayed, stale, reduced-confidence, and unavailable remain trust semantics for Story 2.4
  - do not promote provider failure into service disruption unless the normalized service state evidence actually supports it
- Keep the public copy fact-only and venue-native.
  - good direction: "Weather is temporarily unavailable", "Roads remain readable while bus confidence is reduced", "The local frame stays simplified while richer locality detail reconnects"
  - avoid: provider brand names, "API error", "retrying", "500", "timeout", "reconnect in progress", or instructions telling visitors what to do next
- Respect the existing fallback primitives:
  - [overall-departure-snapshot.js](/home/codexuser/bmad-6-workshop/src/features/dashboard/data/overall-departure-snapshot.js) already contains a `fallback` local-map state and reduced-confidence fixture trust signals
  - [dashboard-service.js](/home/codexuser/bmad-6-workshop/src/lib/server/dashboard/dashboard-service.js) already produces `last-safe` and `fallback` response states
  - Story 2.4 should refine when and how these are used, not replace them with a new route or mode
- Preserve the public screen shell.
  - no raw error overlays
  - no full-screen loading or unavailable takeover
  - no public refresh controls
  - no operator diagnostics or maintenance hints on the public route

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
  - server orchestration in `src/lib/server/*`
  - client fetch and query utilities in `src/lib/client/*`
- No public UI component may call providers directly or invent fallback semantics that bypass the canonical snapshot contract.
- Keep the modular-monolith boundary intact: provider adapters stay server-only, the public route stays same-origin, and no public write endpoints or staff-only diagnostics leak into the visitor surface.
- Snapshot durability remains local file-backed operational state, not a database. Preserve compatibility with persisted snapshots and history files already stored under `runtime/snapshots/`.
- Keep the current pragmatic module mix:
  - React components in `.tsx`
  - contract, presenter, and server modules in `.js`
  - no broad migration work unless directly required by this story outcome

### Library / Framework Requirements

- No new libraries are needed for Story 2.4. Extend the current stack already in the repo:
  - `@tanstack/react-query` `^5.0.0`
  - `zod` `^4.3.6`
  - Next.js App Router with route handlers
- Latest official-source sanity checks completed on 2026-03-19:
  - Next.js App Router docs list `16.2.0` as the latest version, which keeps the repo's `16.1.7` baseline on the current major path: https://nextjs.org/docs/app/getting-started
  - Next.js route-handler docs still confirm `app/**/route.ts` is the correct request-handler convention and that route handlers are not cached by default: https://nextjs.org/docs/app/getting-started/route-handlers
  - React's official `'use client'` docs still require serializable props across the server/client boundary, which matters for the dashboard snapshot handed into the live polling island: https://react.dev/reference/rsc/use-client
  - TanStack Query's current `useQuery` docs still support `refetchInterval` and `refetchIntervalInBackground`, which matches the existing polling model: https://tanstack.com/query/latest/docs/framework/react/reference/useQuery
  - Node's official releases page lists `v24.14.0` as the latest LTS on 2026-03-19, consistent with the repo's `24.x` engine contract: https://nodejs.org/en/about/previous-releases
  - Zod's official `v4` docs remain the active validation line, matching the architecture requirement for shared schema validation: https://zod.dev/v4
- No latest-doc signal suggests changing the repo's current architecture direction for this story.

### File Structure Requirements

- Expected files to add or reshape:
  - [dashboard-snapshot.js](/home/codexuser/bmad-6-workshop/src/lib/contracts/dashboard-snapshot.js)
  - [freshness.js](/home/codexuser/bmad-6-workshop/src/lib/contracts/freshness.js)
  - [build-dashboard-snapshot.js](/home/codexuser/bmad-6-workshop/src/lib/server/dashboard/build-dashboard-snapshot.js)
  - [dashboard-service.js](/home/codexuser/bmad-6-workshop/src/lib/server/dashboard/dashboard-service.js)
  - [publish-dashboard-snapshot.js](/home/codexuser/bmad-6-workshop/src/lib/server/dashboard/publish-dashboard-snapshot.js)
  - [snapshot-store.js](/home/codexuser/bmad-6-workshop/src/lib/server/cache/snapshot-store.js)
  - [overall-departure-snapshot.js](/home/codexuser/bmad-6-workshop/src/features/dashboard/data/overall-departure-snapshot.js)
  - [dashboard-presenter.js](/home/codexuser/bmad-6-workshop/src/features/dashboard/presenters/dashboard-presenter.js)
  - [AtmosphericHeader.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/AtmosphericHeader.tsx)
  - [ModeSummaryCard.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/ModeSummaryCard.tsx)
  - [LocalMapFrame.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/LocalMapFrame.tsx)
  - [DashboardScreen.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/DashboardScreen.tsx) and/or [DashboardLiveScreen.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/DashboardLiveScreen.tsx) only if needed to thread new trust fields without moving layout ownership
  - [tfl-provider.js](/home/codexuser/bmad-6-workshop/src/lib/server/providers/tfl/tfl-provider.js)
  - [weatherapi-provider.js](/home/codexuser/bmad-6-workshop/src/lib/server/providers/weather/weatherapi-provider.js)
  - [dashboard.live-path.test.mjs](/home/codexuser/bmad-6-workshop/tests/unit/dashboard.live-path.test.mjs)
  - [dashboard.presenter.test.mjs](/home/codexuser/bmad-6-workshop/tests/unit/dashboard.presenter.test.mjs)
  - [startup-smoke.test.mjs](/home/codexuser/bmad-6-workshop/tests/smoke/startup-smoke.test.mjs)
- Existing files to preserve, not redesign beyond this story's needs:
  - [page.tsx](/home/codexuser/bmad-6-workshop/src/app/(public)/page.tsx)
  - [route.ts](/home/codexuser/bmad-6-workshop/src/app/api/dashboard/route.ts)
  - [ModeSummaryGrid.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/ModeSummaryGrid.tsx)
  - [useDashboardQuery.ts](/home/codexuser/bmad-6-workshop/src/features/dashboard/hooks/useDashboardQuery.ts)
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
  - mixed-snapshot construction when one provider succeeds and another fails
  - truthful labeling of carried-forward last-safe values versus fully unavailable values
  - presenter output that keeps degradation local, plain-language, and distinct from disruption emphasis
  - dashboard API responses that preserve `{ data, meta }` shape while distinguishing `live`, `last-safe`, and `fallback`
  - public UI rendering that keeps unaffected areas visible and readable when one section is degraded
  - local-map fallback behavior that stays location-specific rather than collapsing to a generic blank panel
- Tests must explicitly protect these behaviors:
  - one failed provider does not imply all data is untrustworthy
  - the public route never renders raw technical errors or provider names
  - last-safe fallback is used only when a truthful partial live snapshot cannot be produced
  - degraded states remain calm and factual, not alert-like or operational
  - service disruption semantics from Story 2.3 are not triggered by trust degradation alone
- Keep testing honest about scope. Story 2.4 does not need to finish:
  - operator diagnostics and staff remediation surfaces
  - restart and recovery workflows from Epic 3
  - the broader reduced-motion and layout-stability verification reserved for Story 2.5

### Previous Story Intelligence

- From Story 2.3:
  - disruption emphasis now exists and must stay reserved for real service strain
  - stale or unavailable data must not accidentally reuse disruption styling as a shortcut
- From Story 2.2:
  - trust semantics already exist for `current`, `aging`, `stale`, `delayed`, and `reduced-confidence`
  - Story 2.4 should extend that system toward honest unavailable and mixed-fallback behavior rather than creating a second trust language
- From Story 2.1:
  - the same-origin API, request-time public read, cache path, and last-safe persistence are already in place
  - Story 2.4 should refine fallback decisions on top of that path instead of replacing it
- From Story 1.5:
  - the fixed local map is an anchor and can fall back to a simplified local frame without ceasing to be useful
- From Story 1.6:
  - the header, nearby modes, and map are verified hierarchy pillars that must remain visible under degraded conditions

### Git Intelligence Summary

- Recent commit `5560765` implemented Story 2.3 and reinforced the established pattern:
  - derive meaning in server modules
  - validate it in shared contracts
  - shape it once in the presenter
  - keep UI components thin and display-focused
- Recent commits `c67b394` and `c8f7dfa` already hardened the live path around trust semantics, the same-origin dashboard API, request-time rendering, and calm polling behavior.
- Story 2.4 should follow the same architecture path instead of introducing route-local fallback widgets, provider-specific UI branches, or a second dashboard model.

### Latest Tech Information

- Official-source checks on 2026-03-19 confirm the approved technical path remains current:
  - Next.js App Router and route handlers remain the right server-rendered-shell and internal API model for this repo.
  - React still requires serializable values when the server route hands snapshot data into the client live island.
  - TanStack Query still supports the polling options already used in this repo.
  - Node `24.14.0` is the latest LTS listed on 2026-03-19 and stays compatible with the repo's `24.x` contract.
  - Zod `v4` remains the stable validation line.
- Inference: Story 2.4 should stay inside the current stack and refine fallback semantics, not introduce new transport, state, or error-handling libraries.

### Project Structure Notes

- The current repo already contains the seeds of this story:
  - partial provider success is possible in the snapshot builder
  - whole-snapshot fallback is already available in the service layer
  - local-map fallback copy already exists in fixture data
  - trust labels already exist in the contract layer
- What is still missing is a single canonical way to express partial unavailability and labeled carried-forward values without collapsing into a global fallback or technical error state.
- Avoid regressions toward:
  - global panic styling because one provider fails
  - provider-branded or engineering-jargon public copy
  - blanking unaffected content
  - mixing degraded-source trust messaging into service disruption messaging
  - exposing ops-only status or retry mechanics on the public route

### References

- `docs/epics.md#Story 2.4: Preserve Honest Usefulness During Provider Failure`
- `docs/prd.md` sections covering FR19, FR20, NFR6, NFR7, NFR16, NFR17, NFR18, NFR19, NFR20, NFR24, NFR27, and NFR28
- `docs/ux-design-specification.md` sections covering Atmospheric Header, Mode Summary Block, Fixed Local Map Frame, Freshness / Trust Cue, and Degraded-Source Confirmation
- `docs/architecture.md` sections covering freshness and degraded-state modeling, file-backed last-known snapshot fallback, route handlers, and local-first reliability
- [2-1-keep-the-departure-picture-current-during-normal-operation.md](/home/codexuser/bmad-6-workshop/docs/sprint-artifacts/2-1-keep-the-departure-picture-current-during-normal-operation.md)
- [2-2-show-trend-and-freshness-where-confidence-matters.md](/home/codexuser/bmad-6-workshop/docs/sprint-artifacts/2-2-show-trend-and-freshness-where-confidence-matters.md)
- [2-3-surface-serious-disruption-without-breaking-composure.md](/home/codexuser/bmad-6-workshop/docs/sprint-artifacts/2-3-surface-serious-disruption-without-breaking-composure.md)
- [page.tsx](/home/codexuser/bmad-6-workshop/src/app/(public)/page.tsx)
- [route.ts](/home/codexuser/bmad-6-workshop/src/app/api/dashboard/route.ts)
- [dashboard-snapshot.js](/home/codexuser/bmad-6-workshop/src/lib/contracts/dashboard-snapshot.js)
- [freshness.js](/home/codexuser/bmad-6-workshop/src/lib/contracts/freshness.js)
- [snapshot-store.js](/home/codexuser/bmad-6-workshop/src/lib/server/cache/snapshot-store.js)
- [build-dashboard-snapshot.js](/home/codexuser/bmad-6-workshop/src/lib/server/dashboard/build-dashboard-snapshot.js)
- [dashboard-service.js](/home/codexuser/bmad-6-workshop/src/lib/server/dashboard/dashboard-service.js)
- [publish-dashboard-snapshot.js](/home/codexuser/bmad-6-workshop/src/lib/server/dashboard/publish-dashboard-snapshot.js)
- [overall-departure-snapshot.js](/home/codexuser/bmad-6-workshop/src/features/dashboard/data/overall-departure-snapshot.js)
- [dashboard-presenter.js](/home/codexuser/bmad-6-workshop/src/features/dashboard/presenters/dashboard-presenter.js)
- [AtmosphericHeader.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/AtmosphericHeader.tsx)
- [ModeSummaryCard.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/ModeSummaryCard.tsx)
- [LocalMapFrame.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/LocalMapFrame.tsx)
- [dashboard.live-path.test.mjs](/home/codexuser/bmad-6-workshop/tests/unit/dashboard.live-path.test.mjs)
- [dashboard.presenter.test.mjs](/home/codexuser/bmad-6-workshop/tests/unit/dashboard.presenter.test.mjs)
- [startup-smoke.test.mjs](/home/codexuser/bmad-6-workshop/tests/smoke/startup-smoke.test.mjs)
- Official source checked 2026-03-19: `https://nextjs.org/docs/app/getting-started`
- Official source checked 2026-03-19: `https://nextjs.org/docs/app/getting-started/route-handlers`
- Official source checked 2026-03-19: `https://react.dev/reference/rsc/use-client`
- Official source checked 2026-03-19: `https://tanstack.com/query/latest/docs/framework/react/reference/useQuery`
- Official source checked 2026-03-19: `https://nodejs.org/en/about/previous-releases`
- Official source checked 2026-03-19: `https://zod.dev/v4`

### Project Context Reference

- No `project-context.md` file exists in this repository at the time of story creation.
- If broader repository guardrails are needed later, run the BMAD `generate-project-context` workflow separately.

### Completion Status

- Story context assembled from Epic 2, the PRD, the UX specification, the architecture, the current sprint status, Stories 2.1 through 2.3, the current live dashboard code, recent git history, and official framework/runtime documentation checked on 2026-03-19.
- The story is scoped to truthful degraded-source behavior and localized unavailable-state handling on the public display.
- Serious disruption styling remains intentionally reserved for Story 2.3, while broader layout and motion stability remain reserved for Story 2.5.
- This story is ready for a dev agent to implement as the provider-failure trust layer immediately after Story 2.3.

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- `sed -n '1,220p' _bmad/bmm/config.yaml`
- `sed -n '1,320p' _bmad/core/tasks/workflow.xml`
- `cat _bmad/bmm/workflows/4-implementation/dev-story/instructions.xml`
- `cat _bmad/bmm/workflows/4-implementation/dev-story/checklist.md`
- `sed -n '1,260p' docs/sprint-artifacts/sprint-status.yaml`
- `sed -n '1,520p' src/lib/contracts/dashboard-snapshot.js`
- `sed -n '1,220p' src/lib/contracts/freshness.js`
- `sed -n '1,260p' src/lib/server/cache/snapshot-store.js`
- `sed -n '1,340p' src/lib/server/dashboard/build-dashboard-snapshot.js`
- `sed -n '1,260p' src/lib/server/dashboard/dashboard-service.js`
- `sed -n '1,260p' src/features/dashboard/data/overall-departure-snapshot.js`
- `sed -n '1,260p' src/features/dashboard/presenters/dashboard-presenter.js`
- `sed -n '1,260p' src/features/dashboard/components/AtmosphericHeader.tsx`
- `sed -n '1,260p' src/features/dashboard/components/ModeSummaryCard.tsx`
- `sed -n '1,260p' src/features/dashboard/components/LocalMapFrame.tsx`
- `sed -n '1,220p' src/features/dashboard/hooks/useDashboardQuery.ts`
- `sed -n '1,260p' tests/unit/dashboard.presenter.test.mjs`
- `sed -n '1,260p' tests/unit/dashboard.live-path.test.mjs`
- `sed -n '1,220p' tests/unit/dashboard.trust.test.mjs`
- `sed -n '1,240p' tests/smoke/startup-smoke.test.mjs`
- `npm run test:unit -- tests/unit/dashboard.trust.test.mjs tests/unit/dashboard.presenter.test.mjs tests/unit/dashboard.live-path.test.mjs`
- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run build`
- `npm run validate`

### Implementation Plan

- Add first-class `sourceStatus` evidence and `unavailable` freshness semantics in the shared dashboard contract so header, mode, and map degradation stay canonical and serializable.
- Rebuild provider-failure handling around mixed snapshots: keep live provider output visible, mark carried-forward last-safe sections explicitly, and reserve route-level fallback for total snapshot failure.
- Thread the canonical source-status view model through the presenter and public components, then lock behavior with unit, live-path, and smoke coverage plus the full validation gate.

### Completion Notes List

- Extended the dashboard snapshot contract with canonical `headerStatus`, per-mode `sourceStatus`, local-map `sourceStatus`, and `unavailable` trust semantics while keeping the payload serializable and fact-only.
- Reworked mixed-snapshot assembly so one failed provider now yields a truthful blend of live, carried-forward, and unavailable sections instead of collapsing the whole route to fallback.
- Kept disruption emphasis scoped to real service strain by stripping provider-failure trust narrowing out of the Story 2.3 disruption path.
- Updated the header, nearby-mode cards, local map, and typed query contract to surface calm, non-technical degraded-source copy without route takeover behavior.
- Added targeted regression coverage for mixed provider failure, last-safe labeling, unavailable fallback messaging, and canonical source-status wiring.
- Verified the story with `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, and `npm run validate`.

### File List

- `src/lib/contracts/freshness.js`
- `src/lib/contracts/dashboard-snapshot.js`
- `src/lib/server/dashboard/build-dashboard-snapshot.js`
- `src/lib/server/dashboard/dashboard-service.js`
- `src/features/dashboard/data/overall-departure-snapshot.js`
- `src/features/dashboard/presenters/dashboard-presenter.js`
- `src/features/dashboard/components/AtmosphericHeader.tsx`
- `src/features/dashboard/components/ModeSummaryCard.tsx`
- `src/features/dashboard/components/ModeSummaryGrid.tsx`
- `src/features/dashboard/components/LocalMapFrame.tsx`
- `src/features/dashboard/components/DashboardScreen.tsx`
- `src/features/dashboard/hooks/useDashboardQuery.ts`
- `tests/unit/dashboard.trust.test.mjs`
- `tests/unit/dashboard.presenter.test.mjs`
- `tests/unit/dashboard.live-path.test.mjs`
- `tests/smoke/startup-smoke.test.mjs`
- `docs/sprint-artifacts/2-4-preserve-honest-usefulness-during-provider-failure.md`
- `docs/sprint-artifacts/sprint-status.yaml`

### Change Log

- 2026-03-19: Implemented Story 2.4 with canonical source-status modeling, mixed provider-failure snapshot handling, calm public degraded-state messaging, and regression coverage for live, last-safe, and fallback paths.
- 2026-03-19: Senior dev review fixed unavailable-path honesty gaps so fixture fallback no longer implies live service states, mode badges now follow source status when live detail is missing, and the story file list was reconciled with the actual change set.

## Epic 4 External Review Rerun

### Date

2026-03-19

### Source Recovery

- Story 4.3 did not recover a standalone external adversarial findings artifact for Story `2.4` from approved planning artifacts, remediation records, or repo session logs.

### Rerun Review Evidence

- Inspected `src/lib/server/dashboard/build-dashboard-snapshot.js`, `src/lib/server/dashboard/dashboard-service.js`, `src/features/dashboard/presenters/dashboard-presenter.js`, `tests/unit/dashboard.live-path.test.mjs`, and `tests/unit/dashboard.presenter.test.mjs`.
- Confirmed degraded and unavailable states remain localized, mixed live plus carried-forward snapshots stay honest, and provider-failure semantics do not broaden into true disruption semantics.

### Decision

- No-code / no-action after rerun external adversarial review.
- Story `2.4` remains `done`; no reopen was required.
- No story-level `4.5` re-close work is required for Story `2.4`.

### Validation Evidence

- Story 4.3 traceability synced in `docs/sprint-artifacts/external-adversarial-remediation-register.md` and `docs/sprint-artifacts/sprint-status.yaml`.
- Story 4.3 final verification reran `npm run validate`.

## Senior Developer Review (AI)

### Findings

1. High: unavailable nearby modes inherited fixture service states, so a no-storage TfL failure could still surface prefilled caution signals that were never observed. Fixed in `src/lib/server/dashboard/build-dashboard-snapshot.js` by neutralizing unavailable modes and excluding them from overall-state escalation.
2. High: whole-route fixture fallback kept the fixture `watchful` headline and mode-state mix even when every provider was unavailable, which overstated certainty during total provider failure. Fixed in `src/lib/server/dashboard/dashboard-service.js` by forcing a calm fallback shell and unavailable source labels throughout the fallback snapshot.
3. Medium: `ModeSummaryCard` continued to print `Open` or `Watch` from the service-state chip even when the canonical source status was `carried-forward` or `unavailable`. Fixed in `src/features/dashboard/components/ModeSummaryCard.tsx` so the badge follows the source-status label whenever live detail is missing.
4. Medium: the story file list claimed `publish-dashboard-snapshot.js` changed, but the actual review surface did not include a diff there. Fixed by reconciling the file list in this story artifact with the real change set.

### Review Outcome

- All high and medium findings were fixed.
- Added regression coverage for unavailable mixed snapshots and whole-route fallback honesty in `tests/unit/dashboard.live-path.test.mjs`.
- Story status moved to `done`.
