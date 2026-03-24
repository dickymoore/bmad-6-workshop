# Story 2.2: Show Trend and Freshness Where Confidence Matters

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visitor,
I want to see whether conditions are changing and how current each signal is,
so that I can judge the departure picture with the right level of confidence.

## Acceptance Criteria

1. Given conditions have changed within the configured trend window, when a visitor reads the display, then the trend is shown as improving, steady, or worsening where it materially affects interpretation, and the screen stays calm and legible rather than becoming an alert feed.
2. Given multiple signals are visible on the display, when a visitor inspects the trust and freshness cues, then each relevant signal can be understood as current, aging, stale, delayed, or reduced-confidence before it is relied on, and the wording remains plain-language and non-technical.
3. Given one signal is older or less trustworthy than the rest, when a visitor reads the affected area, then confidence narrows locally rather than undermining the entire screen, and unaffected parts of the departure picture still read as trustworthy.

## Tasks / Subtasks

- [x] Extend the canonical dashboard snapshot and presenter model so trend and per-signal freshness are first-class public-display concepts. (AC: 1, 2, 3)
  - [x] Replace the current single global `freshnessLabel`-only approach in [dashboard-snapshot.js](/home/codexuser/bmad-6-workshop/src/lib/contracts/dashboard-snapshot.js) with explicit normalized fields for:
    `overallTrend`,
    story-approved freshness states,
    and local confidence or trust metadata for the header and each affected mode. (AC: 1, 2, 3)
  - [x] Keep internal contracts `camelCase`, fact-only, and serializable from the server route to the client live island. (AC: 2, 3)
  - [x] Preserve backward-safe presenter composition so the public route still reads through one canonical view model rather than route-local ad hoc props. (AC: 1, 2)
- [x] Add the server-side evidence needed to derive a real trend window instead of inventing trend from a single snapshot. (AC: 1)
  - [x] Introduce a lightweight recent-history mechanism under `runtime/snapshots/` or an adjacent server-only module so the app can compare the current overall state and core mode states against the previous 15 minutes of published values without introducing a database. (AC: 1)
  - [x] Keep the existing last-safe snapshot behavior intact while storing only the minimal history needed for trend classification. (AC: 1, 3)
  - [x] Define one project-local trend decision path for `improving`, `steady`, and `worsening` based on meaningful state changes in the overall picture or the affected core mode, not on cosmetic text differences. (AC: 1)
- [x] Derive freshness and confidence per signal where interpretation materially depends on them. (AC: 2, 3)
  - [x] Extend the live normalization path in `src/lib/server/dashboard/*` and the current provider adapters in `src/lib/server/providers/*` so each displayed signal carries enough timing and source state to classify it as `current`, `aging`, `stale`, `delayed`, or `reduced-confidence`. (AC: 2)
  - [x] Use provider timestamps where available; where they are not available, derive freshness from successful fetch or publication timing and missed refresh behavior already allowed by the architecture. (AC: 2, 3)
  - [x] Keep the confidence impact local to the affected header fragment or mode card. Do not let one weaker signal automatically degrade the whole dashboard when the rest of the picture remains trustworthy. (AC: 3)
- [x] Update the public UI so trend and trust cues are visible, calm, and selective. (AC: 1, 2, 3)
  - [x] Refine [AtmosphericHeader.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/AtmosphericHeader.tsx) so the overall departure picture can carry a subtle trend cue when it materially changes within the approved window. (AC: 1)
  - [x] Refine [ModeSummaryCard.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/ModeSummaryCard.tsx) and related dashboard components so affected modes can show their own freshness or confidence nuance without turning every card into a dense status panel. (AC: 2, 3)
  - [x] Keep all trust copy plain-language, non-technical, and non-alarmist. Avoid raw timestamps, provider names, polling jargon, counters, or operational phrasing on the public route. (AC: 1, 2)
  - [x] Preserve the current stable hierarchy from Story 2.1 and Story 1.6: atmospheric header first, nearby modes second, fixed local map third. (AC: 1, 3)
- [x] Lock the behavior in with automated coverage aimed at interpretation, not just field presence. (AC: 1, 2, 3)
  - [x] Add unit coverage for trend classification, freshness bucket classification, and presenter shaping of local confidence cues. (AC: 1, 2, 3)
  - [x] Add route or integration coverage proving the dashboard API returns contract-shaped trend and trust information without leaking provider internals. (AC: 2)
  - [x] Add component or smoke coverage proving one stale or delayed signal narrows confidence locally while unaffected areas of the screen remain readable and stable. (AC: 3)
  - [x] Keep the full verification path compatible with `npm run validate`. (AC: 1, 2, 3)

## Dev Notes

### Developer Context

- Story 2.1 already converted the public display from fixture-only composition into a live read path with:
  - request-time server rendering on [page.tsx](/home/codexuser/bmad-6-workshop/src/app/(public)/page.tsx)
  - one canonical same-origin dashboard API at [route.ts](/home/codexuser/bmad-6-workshop/src/app/api/dashboard/route.ts)
  - server snapshot orchestration under `src/lib/server/dashboard/*`
  - memory plus file-backed last-safe snapshot handling under `src/lib/server/cache/*`
  - a client polling island through [useDashboardQuery.ts](/home/codexuser/bmad-6-workshop/src/features/dashboard/hooks/useDashboardQuery.ts)
- The current Story 2.1 implementation is intentionally still shallow on trust semantics:
  - [build-dashboard-snapshot.js](/home/codexuser/bmad-6-workshop/src/lib/server/dashboard/build-dashboard-snapshot.js) produces only a global freshness phrase and current state synthesis.
  - [dashboard-presenter.js](/home/codexuser/bmad-6-workshop/src/features/dashboard/presenters/dashboard-presenter.js) passes that through as one calm header cue.
  - [ModeSummaryCard.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/ModeSummaryCard.tsx) has room for a nuanced line, but not a structured freshness or confidence model yet.
- Story 2.2 is the first point where the product must make confidence more explicit where it matters, but without crossing into Story 2.4's broader provider-failure choreography or Story 2.5's wider motion and live-reading verification work.
- Product doctrine remains fixed:
  - one calm, shared, venue-native, fact-only public instrument
  - no route-planner feel
  - no ops-console feel
  - no alert-feed behavior

### Technical Requirements

- Build on the existing canonical snapshot route and presenter path. Do not bypass shared contracts by deriving trend or freshness ad hoc inside React components.
- Extend the canonical dashboard contract to represent:
  - overall trend for the current picture
  - per-signal or per-mode freshness state where confidence materially matters
  - locally scoped confidence narrowing
- Keep trend meaningful and bounded:
  - only show `improving`, `steady`, or `worsening` when a real state change inside the configured 15-minute window materially affects interpretation
  - do not generate trend from text churn, random timing alternation, or cosmetic changes in copy
- Current code stores one latest safe snapshot at [snapshot-store.js](/home/codexuser/bmad-6-workshop/src/lib/server/cache/snapshot-store.js). That is not enough to support the approved trend window by itself.
  - Add the minimum recent-history support needed to compare current and prior state within the window.
  - Keep it server-only and file-backed under `runtime/snapshots/`; do not introduce a database.
- Freshness classification should be driven by actual timing evidence:
  - use provider timestamps if available
  - otherwise use publication time, successful fetch time, and missed refresh behavior from the live path
  - avoid magic strings hidden in UI components
- Confidence narrowing must remain local:
  - one delayed bus signal should not collapse trust in tube, weather, map, or the entire screen if those remain current
  - unaffected sections must keep their calm readable state
- Plain-language copy is mandatory:
  - use visitor-facing labels such as current, aging, stale, delayed, and reduced-confidence
  - avoid provider names, HTTP or cache language, raw ISO timestamps, or engineering jargon on the public route

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
- No UI component may call external providers directly.
- Keep public and ops surfaces separate. Story 2.2 must not add operator diagnostics, refresh controls, or health details to the public route.
- Snapshot durability remains file-backed operational state, not a domain database. Any added history for trend must stay lightweight and local-first.
- Continue using the repo's pragmatic mixed-module pattern:
  - React components in `.tsx`
  - current presenter and contract/server modules in `.js`
  - no broad migration work unless directly required by the story outcome

### Library / Framework Requirements

- Use the existing repo stack already established by Story 2.1:
  - `@tanstack/react-query` on the `v5` line
  - `zod` on the `v4` line
  - Next.js App Router with route handlers
- Do not add new client state libraries, animation systems, date libraries, charting packages, dashboard widgets, or provider-specific UI kits for this story.
- Latest official-source sanity checks completed on 2026-03-19:
  - Next.js App Router docs currently show `Latest Version 16.2.0`, which keeps the existing `16.1.7` repo baseline aligned on the same current major architecture direction: https://nextjs.org/docs/app
  - Next.js route-handler docs still describe `route.ts` files inside `app` as the correct internal API convention and note that route handlers are not cached by default: https://nextjs.org/docs/app/getting-started/route-handlers
  - React's `'use client'` guidance still requires serializable props across the server/client boundary, which matters for the dashboard API response passed into the live polling island: https://react.dev/reference/rsc/use-client
  - TanStack Query's current `useQuery` docs still support `refetchInterval` and `refetchIntervalInBackground` on the active docs path, which fits the existing polling model: https://tanstack.com/query/latest/docs/framework/react/reference/useQuery
  - Node's official releases page lists `v24.14.0` as the latest LTS on 2026-03-19, consistent with the repo's `24.x` engine contract: https://nodejs.org/en/about/previous-releases
  - Zod's official `v4` docs still describe Zod 4 as the current stable line, which matches the architecture requirement for schema validation: https://zod.dev/v4

### File Structure Requirements

- Expected files to add or reshape:
  - [dashboard-snapshot.js](/home/codexuser/bmad-6-workshop/src/lib/contracts/dashboard-snapshot.js)
  - `src/lib/contracts/freshness.js` or an adjacent shared contract helper if that keeps classification logic centralized
  - [build-dashboard-snapshot.js](/home/codexuser/bmad-6-workshop/src/lib/server/dashboard/build-dashboard-snapshot.js)
  - [publish-dashboard-snapshot.js](/home/codexuser/bmad-6-workshop/src/lib/server/dashboard/publish-dashboard-snapshot.js)
  - [dashboard-service.js](/home/codexuser/bmad-6-workshop/src/lib/server/dashboard/dashboard-service.js)
  - [snapshot-store.js](/home/codexuser/bmad-6-workshop/src/lib/server/cache/snapshot-store.js)
  - [dashboard-presenter.js](/home/codexuser/bmad-6-workshop/src/features/dashboard/presenters/dashboard-presenter.js)
  - [AtmosphericHeader.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/AtmosphericHeader.tsx)
  - [ModeSummaryCard.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/ModeSummaryCard.tsx)
  - [DashboardScreen.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/DashboardScreen.tsx) and/or [DashboardLiveScreen.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/DashboardLiveScreen.tsx) only if needed to thread new view-model fields without changing layout ownership
  - [tfl-provider.js](/home/codexuser/bmad-6-workshop/src/lib/server/providers/tfl/tfl-provider.js)
  - [weatherapi-provider.js](/home/codexuser/bmad-6-workshop/src/lib/server/providers/weather/weatherapi-provider.js)
  - [dashboard.live-path.test.mjs](/home/codexuser/bmad-6-workshop/tests/unit/dashboard.live-path.test.mjs)
  - [dashboard.presenter.test.mjs](/home/codexuser/bmad-6-workshop/tests/unit/dashboard.presenter.test.mjs)
  - [startup-smoke.test.mjs](/home/codexuser/bmad-6-workshop/tests/smoke/startup-smoke.test.mjs)
- Existing files to preserve, not redesign beyond this story's needs:
  - [LocalMapFrame.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/LocalMapFrame.tsx)
  - [ModeSummaryGrid.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/ModeSummaryGrid.tsx)
  - [page.tsx](/home/codexuser/bmad-6-workshop/src/app/(public)/page.tsx)
  - [route.ts](/home/codexuser/bmad-6-workshop/src/app/api/dashboard/route.ts)
- Keep naming aligned with architecture:
  - React components in `PascalCase`
  - directories and non-component files in `kebab-case`
  - route files limited to request handling

### Testing Requirements

- Minimum verification for implementation:
  - `npm run lint`
  - `npm run typecheck`
  - `npm test`
  - `npm run build`
- Add targeted coverage for:
  - trend window classification from meaningful state history
  - freshness bucket classification for current, aging, stale, delayed, and reduced-confidence
  - presenter output that keeps trust narrowing local and plain-language
  - dashboard API responses that remain `{ data, meta }` and avoid provider internals
  - public UI rendering that keeps the header, nearby modes, and fixed local map stable while only affected areas show narrowed confidence
- Tests must explicitly protect these behaviors:
  - trend appears only when the configured window and state evidence justify it
  - one weaker signal does not degrade the entire display
  - public trust copy remains non-technical and calm
  - no full-screen loading state or shell reset is introduced while adding richer trust semantics
- Keep testing honest about scope. Story 2.2 does not need to finish:
  - full provider-failure choreography across the product
  - ops diagnostics or operator trust tooling
  - broader reduced-motion and live-reading verification beyond what is required to keep these new cues understandable
- Those deeper concerns belong to Stories 2.4, 2.5, and Epic 3.

### Previous Story Intelligence

- From Story 2.1:
  - the public display now has a live request-time read path and a calm global currentness cue
  - the current implementation intentionally stops short of per-signal freshness ladders and real trend classification
  - the polling boundary and route architecture already exist and should be extended, not replaced
- From Story 1.6:
  - the header, nearby modes, and fixed local map are validated layout pillars on venue-sized and desktop-sized surfaces
  - Story 2.2 must not destabilize that composition to add richer trust semantics
- From Story 1.4:
  - nearby mode cards already carry fact-only comparison and a short nuance line, making them the right place for local trust narrowing
- From Story 1.3:
  - the atmospheric header remains the right place for the broad overall picture and any subtle overall trend cue
- From Story 1.5:
  - the local map is an anchor, not an interaction surface or a secondary status board; this story should not turn it into a new diagnostic area

### Git Intelligence Summary

- Recent commit `c8f7dfa` implemented Story 2.1 and established the live snapshot, API, and polling baseline that Story 2.2 must extend.
- Recent commits `ae50691`, `4aae924`, and `4499f97` hardened the public layout around venue-sized verification, a fixed local map, and nearby mode summaries.
- The repo has already chosen a pragmatic path:
  - grow the existing snapshot and presenter model
  - preserve the public shell
  - keep new logic in contracts, server modules, and thin feature components
- Story 2.2 should follow the same pattern instead of introducing a second dashboard model or a dashboard-widget architecture.

### Latest Tech Information

- Official-source checks on 2026-03-19 confirm the approved technical path remains current:
  - Next.js App Router and route handlers remain the correct internal API and server-rendered-shell model for this repo.
  - React still requires serializable values when the server route hands data into the client live island.
  - TanStack Query's current docs still support the polling configuration style already used here.
  - Node `24.x` remains aligned with the current LTS line.
  - Zod `v4` remains the stable validation line.
- No latest-doc signal justifies changing the project's core implementation direction for this story.

### Project Structure Notes

- The current repo still lacks a dedicated shared freshness contract module and any persisted recent-history mechanism for trend. Story 2.2 is the right place to add those, because they are now required for real user-facing confidence semantics.
- Preserve one canonical public-display layout. Add richer trust meaning inside the existing shell rather than adding panels, legends, drawers, or alternate modes.
- Avoid regressions toward:
  - dashboard density
  - raw timestamps as public-facing primary cues
  - provider-branded status language
  - global panic styling because one signal is weak
  - ops-console terminology on the public route

### References

- `docs/epics.md#Story 2.2: Show Trend and Freshness Where Confidence Matters`
- `docs/prd.md` sections covering FR4, FR15, FR16, FR22, and the trust/freshness/disruption doctrine
- `docs/ux-design-specification.md` sections covering Atmospheric Header, Mode Summary Block, Freshness / Trust Cue, and local trust narrowing
- `docs/architecture.md` sections covering freshness and degraded-state modeling, `TanStack Query v5`, route handlers, and file-backed snapshot durability
- [2-1-keep-the-departure-picture-current-during-normal-operation.md](/home/codexuser/bmad-6-workshop/docs/sprint-artifacts/2-1-keep-the-departure-picture-current-during-normal-operation.md)
- [page.tsx](/home/codexuser/bmad-6-workshop/src/app/(public)/page.tsx)
- [route.ts](/home/codexuser/bmad-6-workshop/src/app/api/dashboard/route.ts)
- [dashboard-snapshot.js](/home/codexuser/bmad-6-workshop/src/lib/contracts/dashboard-snapshot.js)
- [dashboard-service.js](/home/codexuser/bmad-6-workshop/src/lib/server/dashboard/dashboard-service.js)
- [build-dashboard-snapshot.js](/home/codexuser/bmad-6-workshop/src/lib/server/dashboard/build-dashboard-snapshot.js)
- [publish-dashboard-snapshot.js](/home/codexuser/bmad-6-workshop/src/lib/server/dashboard/publish-dashboard-snapshot.js)
- [snapshot-store.js](/home/codexuser/bmad-6-workshop/src/lib/server/cache/snapshot-store.js)
- [dashboard-presenter.js](/home/codexuser/bmad-6-workshop/src/features/dashboard/presenters/dashboard-presenter.js)
- [AtmosphericHeader.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/AtmosphericHeader.tsx)
- [ModeSummaryCard.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/ModeSummaryCard.tsx)
- [dashboard.presenter.test.mjs](/home/codexuser/bmad-6-workshop/tests/unit/dashboard.presenter.test.mjs)
- [dashboard.live-path.test.mjs](/home/codexuser/bmad-6-workshop/tests/unit/dashboard.live-path.test.mjs)
- [startup-smoke.test.mjs](/home/codexuser/bmad-6-workshop/tests/smoke/startup-smoke.test.mjs)
- Official source checked 2026-03-19: `https://nextjs.org/docs/app`
- Official source checked 2026-03-19: `https://nextjs.org/docs/app/getting-started/route-handlers`
- Official source checked 2026-03-19: `https://react.dev/reference/rsc/use-client`
- Official source checked 2026-03-19: `https://tanstack.com/query/latest/docs/framework/react/reference/useQuery`
- Official source checked 2026-03-19: `https://nodejs.org/en/about/previous-releases`
- Official source checked 2026-03-19: `https://zod.dev/v4`

### Project Context Reference

- No `project-context.md` file exists in this repository at the time of story creation.
- If broader repository guardrails are needed later, run the BMAD `generate-project-context` workflow separately.

### Completion Status

- Story context assembled from Epic 2, the PRD, the UX specification, the architecture, the current sprint status, the implemented Story 2.1 artifact, the current dashboard code, recent git history, and official framework/runtime documentation checked on 2026-03-19.
- The story is scoped to visible trend and confidence semantics where confidence materially matters.
- Real provider-failure choreography across the whole screen remains intentionally reserved for Story 2.4.
- This story is ready for a dev agent to implement as the trust-and-freshness layer immediately after Story 2.1.

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- `cat _bmad/bmm/config.yaml`
- `cat _bmad/core/tasks/workflow.xml`
- `cat _bmad/bmm/workflows/4-implementation/create-story/workflow.yaml`
- `cat _bmad/bmm/workflows/4-implementation/create-story/instructions.xml`
- `cat docs/epics.md`
- `cat docs/architecture.md`
- `cat docs/prd.md`
- `cat docs/sprint-artifacts/sprint-status.yaml`
- `cat docs/sprint-artifacts/2-1-keep-the-departure-picture-current-during-normal-operation.md`
- `git log --oneline -5`
- `sed -n '1,220p' package.json`
- `sed -n '1,220p' 'src/app/(public)/page.tsx'`
- `sed -n '1,260p' src/lib/server/dashboard/dashboard-service.js`
- `sed -n '1,260p' src/lib/server/dashboard/build-dashboard-snapshot.js`
- `sed -n '1,260p' src/lib/server/dashboard/publish-dashboard-snapshot.js`
- `sed -n '1,260p' src/lib/server/cache/snapshot-store.js`
- `sed -n '1,260p' src/lib/server/providers/tfl/tfl-provider.js`
- `sed -n '1,260p' src/lib/server/providers/weather/weatherapi-provider.js`
- `sed -n '1,260p' src/features/dashboard/presenters/dashboard-presenter.js`
- `sed -n '1,260p' src/features/dashboard/components/AtmosphericHeader.tsx`
- `sed -n '1,260p' src/features/dashboard/components/ModeSummaryCard.tsx`
- `sed -n '1,260p' src/features/dashboard/hooks/useDashboardQuery.ts`
- `sed -n '1,260p' tests/unit/dashboard.presenter.test.mjs`
- `sed -n '1,320p' _bmad/bmm/workflows/4-implementation/dev-story/instructions.xml`
- `sed -n '1,260p' docs/sprint-artifacts/2-2-show-trend-and-freshness-where-confidence-matters.md`
- `sed -n '1,320p' src/lib/contracts/dashboard-snapshot.js`
- `sed -n '1,320p' src/lib/server/dashboard/build-dashboard-snapshot.js`
- `sed -n '1,320p' src/lib/server/cache/snapshot-store.js`
- `sed -n '1,320p' src/lib/server/providers/tfl/tfl-provider.js`
- `sed -n '1,320p' src/lib/server/providers/weather/weatherapi-provider.js`
- `sed -n '1,260p' src/features/dashboard/presenters/dashboard-presenter.js`
- `sed -n '1,260p' src/app/globals.css`
- `npm run test:unit`
- `npm test`
- `npm run validate`

### Completion Notes List

- Created the Story 2.2 implementation-ready artifact with concrete tasks tied to the current live dashboard architecture.
- Included explicit guidance for trend-window storage, per-signal freshness classification, local confidence narrowing, and calm public-copy rules.
- Updated sprint tracking so Story 2.2 is now marked `ready-for-dev`.
- Replaced the single global freshness label with canonical trend and trust metadata for the header and each nearby mode.
- Added file-backed 15-minute snapshot history plus trend classification so `improving`, `steady`, and `worsening` come from recent state evidence instead of copy churn.
- Extended live provider normalization with timing evidence and plain-language `current`, `aging`, `stale`, `delayed`, and `reduced-confidence` states that stay local to affected header fragments and mode cards.
- Updated the public presenter, header, mode cards, and styling so trust cues remain calm, selective, and non-technical.
- Added targeted unit, integration-style, and smoke coverage for trend/freshness classification, API shape, and local confidence narrowing; `npm run validate` passed.
- Auto-fixed review findings so fixture fallback responses no longer invent trend evidence or optimistic trust states when live rebuilds fail.
- Replaced review-flagged pseudo-trend and contract-jargon copy with calmer plain-language currentness and reduced-confidence wording.
- Re-ran `npm run validate` after the review fixes and confirmed the full gate still passes.

### File List

- `docs/sprint-artifacts/2-2-show-trend-and-freshness-where-confidence-matters.md`
- `docs/sprint-artifacts/sprint-status.yaml`
- `src/app/globals.css`
- `src/features/dashboard/components/AtmosphericHeader.tsx`
- `src/features/dashboard/components/DashboardScreen.tsx`
- `src/features/dashboard/components/ModeSummaryCard.tsx`
- `src/features/dashboard/components/ModeSummaryGrid.tsx`
- `src/features/dashboard/data/overall-departure-snapshot.js`
- `src/features/dashboard/hooks/useDashboardQuery.ts`
- `src/features/dashboard/presenters/dashboard-presenter.js`
- `src/lib/contracts/dashboard-snapshot.js`
- `src/lib/contracts/freshness.js`
- `src/lib/server/cache/snapshot-store.js`
- `src/lib/server/dashboard/build-dashboard-snapshot.js`
- `src/lib/server/dashboard/publish-dashboard-snapshot.js`
- `src/lib/server/providers/tfl/tfl-provider.js`
- `src/lib/server/providers/weather/weatherapi-provider.js`
- `tests/smoke/startup-smoke.test.mjs`
- `tests/unit/dashboard.live-path.test.mjs`
- `tests/unit/dashboard.presenter.test.mjs`
- `tests/unit/dashboard.trust.test.mjs`

## Senior Developer Review (AI)

### Reviewer

Workshop

### Date

2026-03-19

### Outcome

Approve

### Findings

- High: Fixture fallback responses exposed a synthetic `steady` trend without any 15-minute evidence, which violated AC1's requirement that trend only appear when justified. Fixed in `src/features/dashboard/data/overall-departure-snapshot.js`, `src/lib/server/dashboard/dashboard-service.js`, and `tests/unit/dashboard.live-path.test.mjs`.
- Medium: The presenter still rendered "Trend is still settling across the foyer." when no trend existed, which leaked a trend cue even when the approved window had no evidence. Fixed in `src/features/dashboard/presenters/dashboard-presenter.js`, `src/features/dashboard/components/AtmosphericHeader.tsx`, `src/features/dashboard/components/DashboardScreen.tsx`, and `tests/unit/dashboard.presenter.test.mjs`.
- Medium: Default reduced-confidence detail used contract jargon and fallback trust stayed too optimistic after live rebuild failure, which weakened AC2's plain-language requirement. Fixed in `src/lib/contracts/freshness.js`, `src/lib/server/dashboard/dashboard-service.js`, and `tests/unit/dashboard.live-path.test.mjs`.

### Validation

- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run build`
- `npm run validate`

### Change Log

- 2026-03-19: Ran the Story 2.2 code-review workflow, auto-fixed three findings, reran the full validation gate, and marked the story done.

## Epic 4 External Review Rerun

### Date

2026-03-19

### Source Recovery

- Story 4.3 did not recover a standalone external adversarial findings artifact for Story `2.2` from approved planning artifacts, remediation records, or repo session logs.

### Rerun Review Evidence

- Inspected `src/lib/contracts/freshness.js`, `src/lib/server/dashboard/build-dashboard-snapshot.js`, `src/features/dashboard/presenters/dashboard-presenter.js`, `tests/unit/dashboard.trust.test.mjs`, and `tests/unit/dashboard.live-path.test.mjs`.
- Confirmed trend remains bound to recent state-history evidence, local trust narrowing remains localized, and fallback responses do not invent synthetic trend or optimistic freshness cues.

### Decision

- No-code / no-action after rerun external adversarial review.
- Story `2.2` remains `done`; no reopen was required.
- No story-level `4.5` re-close work is required for Story `2.2`.

### Validation Evidence

- Story 4.3 traceability synced in `docs/sprint-artifacts/external-adversarial-remediation-register.md` and `docs/sprint-artifacts/sprint-status.yaml`.
- Story 4.3 final verification reran `npm run validate`.
