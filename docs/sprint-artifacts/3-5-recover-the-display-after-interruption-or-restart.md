# Story 3.5: Recover the Display After Interruption or Restart

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a venue operator,
I want the display to recover quickly after interruption or restart,
so that I can return it to public service without exposing recovery internals.

## Acceptance Criteria

1. Given the app process is interrupted or restarted, when recovery begins, then the system returns to a usable public state within the MVP recovery target, and the public display does not expose debug or recovery tooling while doing so.
2. Given the display restarts before all fresh source data is available, when the public route renders again, then the same section layout is preserved, and any last-known values shown are clearly marked reduced-confidence until freshness is restored.
3. Given a venue operator checks the system after restart, when the ops surface is used to confirm recovery, then they can determine whether public service has resumed successfully, and the workflow stays lightweight, local-only, and keyboard-safe.

## Tasks / Subtasks

- [x] Extend the dashboard recovery path so a cold start can restore the last safe public picture immediately without inventing a second boot-only render path. (AC: 1, 2)
  - [x] Reuse `src/lib/server/cache/snapshot-store.js` and the persisted `runtime/snapshots/dashboard-snapshot.json` artifact so startup recovery reads the latest safe snapshot before live providers succeed again. (AC: 1, 2)
  - [x] Add a small server-only recovery metadata seam under `src/lib/server/dashboard/` or `src/lib/server/cache/` that records recovery evidence such as `recoveredAt`, `recoverySource`, and whether fresh live publication has resumed, instead of inferring boot state from copy strings alone. (AC: 1, 3)
  - [x] Update `src/lib/server/dashboard/dashboard-service.js` so a cold start can distinguish `live`, carried-forward restart recovery, and fallback-unavailable states deterministically while still returning the same `{ data, meta }` dashboard contract to the public route. (AC: 1, 2, 3)
- [x] Preserve the public display shell during restart recovery and label carried-forward values honestly until fresh publication returns. (AC: 1, 2)
  - [x] Extend the canonical dashboard response metadata and any required shared contracts in `src/lib/contracts/` so the public route and ops surface can tell whether the current picture is a restart-recovery read or a fresh live publish without exposing raw internals. (AC: 2, 3)
  - [x] Keep the public layout unchanged in `src/app/(public)/page.tsx`, `src/features/dashboard/components/DashboardLiveScreen.tsx`, and the existing presenter path; recovery must preserve the atmospheric header, nearby modes, and fixed local map in the same order rather than introducing a boot screen, debug state, or full-screen takeover. (AC: 1, 2)
  - [x] Ensure carried-forward values remain visibly reduced-confidence through the existing trust and source-status language until a fresh publish replaces them. Do not let recovered last-known values read as fully current just because the app process has restarted. (AC: 2)
- [x] Extend the local-only ops read model so staff can confirm restart recovery from the existing maintenance surface. (AC: 3)
  - [x] Add recovery-specific evidence to `src/lib/server/ops/get-ops-health.js` and related ops view-model modules so operators can see whether the current picture is live again, still carried forward, or still unavailable after restart. (AC: 3)
  - [x] Reuse the existing Epic 3 ops shell in `src/features/ops/components/OpsShellClient.tsx` and `src/features/ops/ops-shell-content.js`; recovery confirmation belongs in the current local-only page, not in a new admin route or control-room workflow. (AC: 3)
  - [x] Keep Story 3.4's `refresh` and `trust-check` actions as the lightweight post-restart tools. If copy or result semantics need refinement after a restart-recovery read, update `src/lib/server/ops/run-ops-maintenance-action.js` and the ops action panel without adding process-control buttons or public recovery affordances. (AC: 3)
- [x] Protect restart recovery with automated coverage focused on cold-start behavior, public honesty, and operator confirmation. (AC: 1, 2, 3)
  - [x] Add unit coverage for `dashboard-service.js` and related cache helpers proving a cold start with a stored snapshot returns a usable carried-forward read, a cold start without a stored snapshot falls back calmly, and fresh publication clears the recovery state once live data resumes. (AC: 1, 2, 3)
  - [x] Add ops-health or route coverage proving restart recovery evidence is exposed only through the local-only ops path and never leaks debug strings, stack traces, credentials, or process internals. (AC: 1, 3)
  - [x] Extend smoke coverage in `tests/smoke/startup-smoke.test.mjs` or adjacent tests to represent restart resilience explicitly, including the requirement that the public route stays single-screen and the ops route remains local-only after recovery. (AC: 1, 2, 3)
  - [x] Keep the full verification path compatible with `npm run validate`. (AC: 1, 2, 3)

## Dev Notes

### Developer Context

- Story 3.5 is the final Epic 3 story and should build directly on the current seams established in Stories 3.1 through 3.4:
  - `src/app/(public)/page.tsx` already renders the live public route from `getDashboardApiResponse()`.
  - `src/lib/server/dashboard/dashboard-service.js` already falls back to a stored snapshot or a reduced-confidence fixture when live building fails.
  - `src/lib/server/cache/snapshot-store.js` already persists the latest safe snapshot and recent history under `runtime/snapshots/`.
  - `src/lib/server/ops/get-ops-health.js` already derives readiness from the dashboard response.
  - `src/features/ops/components/OpsShellClient.tsx` already provides the keyboard-safe local-only ops surface.
  - `src/lib/server/ops/run-ops-maintenance-action.js` already gives operators lightweight `refresh` and `trust-check` actions.
- The current codebase is close to restart resilience already, but it still lacks explicit recovery semantics:
  - on cold start, `getLatestAvailableDashboardApiResponse()` can serve the stored snapshot, but there is no first-class indication that the system is currently recovering from restart rather than fully current again
  - the ops surface can show readiness and degraded diagnostics, but it does not yet tell staff whether live publication has resumed after a restart
  - Story 3.4 intentionally stopped at maintenance actions and did not own restart orchestration or post-restart confirmation
- Scope discipline for Epic 3:
  - Story 3.1 owns local-only ops access
  - Story 3.2 owns current versus reduced-confidence versus unavailable readiness
  - Story 3.3 owns degraded signal and scope diagnostics
  - Story 3.4 owns lightweight refresh and trust-check actions
  - Story 3.5 owns interruption or restart recovery and the operator confirmation path after boot

### Technical Requirements

- Reuse the existing dashboard-service truth model. Do not add a second public boot page, a second snapshot contract, or a restart-only API route for the public display.
- Startup recovery must prefer the most recent safe stored snapshot when it exists.
  - acceptable: serve the last safe picture immediately with explicit reduced-confidence or carried-forward trust labeling while fresh publication reconnects
  - unacceptable: blank the whole screen, wait for all providers before rendering anything, or expose raw recovery mechanics to visitors
- Recovery semantics must stay honest and bounded:
  - a carried-forward snapshot after restart is not the same as a fresh live publish
  - once a new live publish succeeds, the system should clear or supersede the recovery marker so operators can see that normal service has resumed
  - if no safe snapshot exists, the current calm fallback behavior remains the right unavailable path
- Keep post-restart operator workflow lightweight:
  - operators should confirm recovery through the existing local-only ops shell
  - `refresh` and `trust-check` remain the only maintenance actions unless a small copy or evidence refinement is strictly required
  - do not add process-manager controls, restart buttons, provider toggles, or public recovery controls
- Public-facing copy must remain calm, plain-language, and non-technical.
  - acceptable language: `carried forward`, `reduced confidence`, `public view is recovering`, `fresh live detail has resumed`
  - unacceptable language: stack traces, restart logs, process IDs, cache dumps, provider request internals, or engineering-only boot terminology on the public route

### Architecture Compliance

- Preserve the approved modular-monolith boundaries:
  - public route entry in `src/app/(public)/*`
  - ops route entry in `src/app/(ops)/ops/*`
  - dashboard and recovery orchestration in `src/lib/server/dashboard/*`
  - persisted snapshot handling in `src/lib/server/cache/*`
  - ops readiness and maintenance logic in `src/lib/server/ops/*`
  - shared response and snapshot contracts in `src/lib/contracts/*`
- Keep route files thin and same-origin:
  - no public write endpoints
  - no browser-side provider access
  - no public route exposure of restart or recovery internals
- Stay aligned with architecture rules already established in `docs/architecture.md`:
  - file-backed last-known snapshot fallback for restart resilience
  - one canonical `DashboardSnapshot`
  - separate public and ops route trees
  - structured logging and health/status reporting
  - calm degraded-state behavior instead of technical failure leakage
- Preserve the product doctrine during recovery:
  - calm
  - shared
  - venue-native
  - fact-only
  - ambient before interactive
  - not a route planner

### Library / Framework Requirements

- Stay on the repo-pinned stack for this story:
  - `next` `16.1.7`
  - `react` `19.2.3`
  - `react-dom` `19.2.3`
  - `@tanstack/react-query` `^5.0.0`
  - `zod` `^4.3.6`
  - `node` `24.x`
- Official-source checks refreshed on 2026-03-19:
  - Next.js route handlers remain the correct internal boundary for app-owned APIs and recovery/status endpoints, so Story 3.5 should stay inside the current App Router architecture: https://nextjs.org/docs/app/getting-started/route-handlers
  - React’s official `'use client'` guidance still requires serializable server-to-client boundaries, reinforcing that recovery classification belongs in server-derived response metadata rather than ad hoc client reconstruction: https://react.dev/reference/rsc/use-client
  - TanStack Query’s current React overview still supports the existing query-key and refetch model already used by the ops shell and live dashboard polling, so recovery confirmation should reuse that path rather than add a new client state layer: https://tanstack.com/query/latest/docs/framework/react/overview
  - Node.js official release pages now show the `v24.x` line as Maintenance LTS as of 2026-03-19, while this repo is still pinned to `24.x`; for this story, preserve the repo runtime contract and do not fold a runtime upgrade into restart recovery work: https://nodejs.org/en/download/archive/v24.11.1
  - Zod 4 remains the stable validation line in the official docs, so any new recovery metadata or ops evidence contract should stay on the current validation approach: https://zod.dev/packages/core
- Inference from those sources: Story 3.5 should refine the existing Next.js + persisted-snapshot recovery path, not introduce a separate process-control service or a new frontend state framework.

### File Structure Requirements

- Expected files to update:
  - `src/lib/server/dashboard/dashboard-service.js`
  - `src/lib/server/dashboard/publish-dashboard-snapshot.js`
  - `src/lib/server/cache/snapshot-store.js`
  - `src/lib/server/ops/get-ops-health.js`
  - `src/lib/server/ops/run-ops-maintenance-action.js`
  - `src/features/ops/components/OpsShellClient.tsx`
  - `src/features/ops/ops-shell-content.js`
  - `src/features/ops/ops-shell-view.js`
  - `src/features/dashboard/presenters/dashboard-presenter.js`
  - `src/features/dashboard/hooks/useDashboardQuery.ts`
  - `src/features/dashboard/components/DashboardLiveScreen.tsx`
  - `src/lib/contracts/api-response.js`
  - `src/lib/contracts/dashboard-snapshot.js`
- Expected files to add if needed:
  - a focused recovery-state helper under `src/lib/server/dashboard/` or `src/lib/server/cache/`
  - targeted tests under `tests/unit` for recovery-state derivation and cold-start behavior
- Files to reuse rather than bypass:
  - `src/app/(public)/page.tsx`
  - `src/app/api/dashboard/route.ts`
  - `src/app/api/ops/health/route.ts`
  - `src/app/api/ops/actions/route.ts`
  - `src/lib/server/security/assert-ops-access.js`
  - `src/features/ops/components/OpsActionPanel.tsx`
  - `tests/smoke/startup-smoke.test.mjs`

### Testing Requirements

- Minimum verification for implementation:
  - `npm run lint`
  - `npm run typecheck`
  - `npm test`
  - `npm run build`
- Add focused tests for:
  - cold start with a previously stored safe snapshot
  - cold start with no stored snapshot
  - fresh publish replacing a carried-forward recovery read
  - recovery evidence appearing in the local-only ops payload
  - ops action summaries staying calm and bounded when run during recovery
  - public route preservation of the same header, modes, and map composition during restart recovery
  - no exposure of debug, process, or secret-bearing details on either the public route or local ops route
- Keep tests honest about scope:
  - this story is about application recovery after interruption or restart
  - it is not a systemd packaging story
  - it is not a runtime-upgrade story
  - it is not a new provider-resilience story beyond the existing last-safe and fallback model

### Previous Story Intelligence

- Story 3.1 established the local-only ops boundary and the requirement that denied contexts fail closed.
- Story 3.2 established readiness derivation from the current dashboard response and the calm ops status language.
- Story 3.3 established degraded-impact diagnostics and the expectation that operators can judge scope without reading technical errors.
- Story 3.4 established lightweight `refresh` and `trust-check` actions and explicitly left restart or interruption recovery for Story 3.5.
- Strong implication for Story 3.5:
  - restart recovery should reuse the same dashboard snapshot, ops health, and ops action seams already in place
  - the new work should add recovery evidence and honest carried-forward behavior, not a parallel recovery subsystem

### Git Intelligence Summary

- Recent Epic 3 commits show the implementation path to preserve:
  - `3a6ec9f feat(epic-3): implement 3-4-trigger-lightweight-refresh-and-trust-check-actions`
  - `8a12ce8 feat(epic-3): implement 3-3-diagnose-degraded-impact-by-signal-and-scope`
  - `93e5912 feat(epic-3): implement 3-2-show-public-readiness-and-current-ops-state`
  - `9eb1adf feat(epic-3): implement 3-1-provide-a-separate-local-only-ops-access-surface`
- Actionable implications from those commits and the current code:
  - keep server derivation helpers focused
  - keep the existing ops shell as the only venue-maintenance page
  - protect recovery behavior with unit and smoke coverage
  - preserve the calm plain-language discipline already established across Epic 3

### Latest Tech Information

- Official-source checks on 2026-03-19 did not reveal any framework change that should alter the implementation direction for this story.
  - Next.js App Router route handlers remain the right internal endpoint boundary.
  - React still favors server-owned request and status derivation for app state that crosses the server/client boundary.
  - TanStack Query still supports the existing refetch model for live and ops follow-up checks.
  - Node `24.x` is no longer the newest LTS line, but the repo engine contract remains `24.x` and should stay stable during this story.
  - Zod 4 remains the stable schema line.
- Inference: use the current stack and focus the story on restart semantics, stored-snapshot recovery, and ops confirmation rather than technology churn.

### Project Structure Notes

- No `project-context.md` file is present in this repository, so rely on the planning artifacts plus the implemented Epic 3 source files.
- The biggest implementation trap is mistaking `last-safe` persistence for complete restart recovery.
  - wrong approach: serve the stored snapshot after restart and treat it as fully current with no recovery evidence
  - right approach: keep the public display usable immediately, mark carried-forward values honestly, and let the ops surface show when fresh live service has resumed
- The second trap is introducing a second recovery workflow outside the existing ops and dashboard seams.
  - wrong approach: add a restart-only page, new public recovery route, or process-control buttons
  - right approach: extend the current snapshot, readiness, and maintenance-action model with recovery-specific evidence

### References

- `docs/epics.md#Story 3.5: Recover the Display After Interruption or Restart`
- `docs/prd.md` sections covering FR33, FR34, NFR8, NFR9, NFR24, NFR27, and NFR28
- `docs/architecture.md` sections covering file-backed last-known snapshot fallback, health/status endpoints, local-first deployment, and separate public versus ops route trees
- `docs/ux-design-specification.md` sections covering calm feedback patterns, loading and fallback behavior, keyboard-safe staff-only flows, and public-display isolation
- `docs/sprint-artifacts/3-1-provide-a-separate-local-only-ops-access-surface.md`
- `docs/sprint-artifacts/3-2-show-public-readiness-and-current-ops-state.md`
- `docs/sprint-artifacts/3-3-diagnose-degraded-impact-by-signal-and-scope.md`
- `docs/sprint-artifacts/3-4-trigger-lightweight-refresh-and-trust-check-actions.md`
- `src/app/(public)/page.tsx`
- `src/app/api/dashboard/route.ts`
- `src/app/api/ops/health/route.ts`
- `src/app/api/ops/actions/route.ts`
- `src/features/ops/components/OpsShellClient.tsx`
- `src/features/ops/components/OpsActionPanel.tsx`
- `src/features/ops/ops-shell-content.js`
- `src/features/ops/ops-shell-view.js`
- `src/lib/server/dashboard/dashboard-service.js`
- `src/lib/server/dashboard/publish-dashboard-snapshot.js`
- `src/lib/server/cache/snapshot-store.js`
- `src/lib/server/ops/get-ops-health.js`
- `src/lib/server/ops/run-ops-maintenance-action.js`
- `tests/smoke/startup-smoke.test.mjs`
- Official source checked 2026-03-19: `https://nextjs.org/docs/app/getting-started/route-handlers`
- Official source checked 2026-03-19: `https://react.dev/reference/rsc/use-client`
- Official source checked 2026-03-19: `https://tanstack.com/query/latest/docs/framework/react/overview`
- Official source checked 2026-03-19: `https://nodejs.org/en/download/archive/v24.11.1`
- Official source checked 2026-03-19: `https://zod.dev/packages/core`

### Project Context Reference

- No `project-context.md` file exists in this repository at the time of story creation.
- If broader repository guardrails are needed later, run the BMAD `generate-project-context` workflow separately.

### Completion Status

- Story context assembled from Epic 3, the PRD, the architecture, the UX specification, the current sprint status, Story 3.4, the implemented public-dashboard and ops code, recent git history, and official framework/runtime documentation checked on 2026-03-19.
- The story is scoped to restart-aware recovery semantics, honest carried-forward public rendering, and lightweight ops confirmation after boot.
- Runtime upgrades, OS-level service management changes, and new maintenance surfaces remain intentionally out of scope.
- This story is ready for a dev agent to implement immediately after Story 3.4.

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- `cat _bmad/bmm/config.yaml`
- `cat _bmad/core/tasks/workflow.xml`
- `cat _bmad/bmm/workflows/4-implementation/dev-story/workflow.yaml`
- `cat _bmad/bmm/workflows/4-implementation/dev-story/instructions.xml`
- `cat docs/epics.md`
- `cat docs/architecture.md`
- `cat docs/ux-design-specification.md`
- `cat docs/sprint-artifacts/sprint-status.yaml`
- `cat docs/sprint-artifacts/3-4-trigger-lightweight-refresh-and-trust-check-actions.md`
- `cat package.json`
- `cat src/app/(public)/page.tsx`
- `cat src/lib/server/dashboard/dashboard-service.js`
- `cat src/lib/server/dashboard/publish-dashboard-snapshot.js`
- `cat src/lib/server/cache/snapshot-store.js`
- `cat src/lib/server/ops/get-ops-health.js`
- `cat src/lib/server/ops/run-ops-maintenance-action.js`
- `cat src/features/ops/components/OpsShellClient.tsx`
- `cat src/features/ops/ops-shell-content.js`
- `cat tests/smoke/startup-smoke.test.mjs`
- `git log --oneline -5`
- `npm test`
- `npm run validate`

### Completion Notes List

- Added `src/lib/server/dashboard/recovery-state.js` and threaded canonical recovery metadata through `dashboard-service`, `publish-dashboard-snapshot`, and the API-response contract so cold starts can serve the last safe picture immediately and later mark fresh live publication as resumed.
- Preserved the single public display shell while making restart recovery explicit through existing trust/source language and the live presenter path, without adding a boot screen, debug affordances, or a second public route.
- Extended the local-only ops read model and maintenance summaries so staff can verify `recovering`, `live resumed`, or `unavailable` states from the existing ops shell while keeping actions limited to `refresh` and `trust-check`.
- Added focused unit and smoke coverage for cold-start recovery, recovery-state clearing after live publish, local-only ops evidence, and restart-resilient public-shell composition.
- Verified the full gate with `npm run validate`.

### File List

- `docs/sprint-artifacts/3-5-recover-the-display-after-interruption-or-restart.md`
- `docs/sprint-artifacts/sprint-status.yaml`
- `runtime/snapshots/dashboard-history.json`
- `runtime/snapshots/dashboard-snapshot.json`
- `runtime/snapshots/dashboard-recovery.json`
- `src/features/dashboard/components/DashboardLiveScreen.tsx`
- `src/features/dashboard/hooks/useDashboardQuery.ts`
- `src/features/dashboard/presenters/dashboard-presenter.js`
- `src/features/ops/components/OpsShellClient.tsx`
- `src/features/ops/hooks/useOpsHealthQuery.ts`
- `src/features/ops/ops-shell-content.js`
- `src/features/ops/ops-shell-view.js`
- `src/lib/contracts/api-response.js`
- `src/lib/server/dashboard/dashboard-service.js`
- `src/lib/server/dashboard/publish-dashboard-snapshot.js`
- `src/lib/server/dashboard/recovery-state.js`
- `src/lib/server/ops/get-ops-health.js`
- `src/lib/server/ops/run-ops-maintenance-action.js`
- `tests/smoke/startup-smoke.test.mjs`
- `tests/unit/dashboard.live-path.test.mjs`
- `tests/unit/ops-health.test.mjs`
- `tests/unit/ops-maintenance-action.test.mjs`
- `tests/unit/ops-shell.test.mjs`

### Change Log

- 2026-03-19: Implemented restart-aware cold-start recovery, explicit recovery metadata, local-only ops recovery evidence, and validating unit/smoke coverage for Story 3.5.
- 2026-03-19: Code review fixed the public presenter so restart messaging only appears during active recovery, then synced the persisted recovery artifact to the resumed live snapshot state.
