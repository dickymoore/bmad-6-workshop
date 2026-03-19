# Story 3.4: Trigger Lightweight Refresh and Trust-Check Actions

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a venue operator,
I want lightweight refresh and trust-check actions,
so that I can keep the display in service during normal MVP operations.

## Acceptance Criteria

1. Given the ops surface is available, when the operator triggers a refresh or trust-check action, then the action runs through the maintenance-only path, and the public display remains isolated from direct operational control.
2. Given a refresh or trust-check succeeds, when the operator reviews the updated ops state, then the latest readiness and trust status is shown clearly, and the action result is visible without requiring backend inspection.
3. Given a refresh or trust-check fails, when the operator reviews the outcome, then the failure is reported in calm plain language, and the public display continues showing the last safe usable state if available.

## Tasks / Subtasks

- [x] Add a server-side maintenance action service that reuses the existing dashboard and ops-health pipelines instead of inventing a second recovery path. (AC: 1, 2, 3)
  - [x] Create a focused server helper under `src/lib/server/ops/` such as `run-ops-maintenance-action.js` that accepts exactly two actions: `refresh` and `trust-check`. (AC: 1)
  - [x] Implement `refresh` as a forced maintenance refresh that bypasses the normal cache-hold window, attempts a fresh dashboard build and publish cycle, and preserves the current last-safe fallback behavior if upstream sources fail. (AC: 1, 3)
  - [x] Implement `trust-check` as a non-destructive maintenance verification that re-runs the current readiness and degraded-impact derivation against the latest available dashboard response without exposing provider internals or mutating the public route tree. (AC: 1, 2)
  - [x] Return one calm action-result contract for both actions with fields for `action`, `status`, `summary`, `completedAt`, `readiness`, and `diagnostics`, plus optional plain-language issue details when attention is still needed. (AC: 2, 3)
- [x] Add the maintenance-only write boundary for ops actions and keep local-only access rules identical to Epic 3’s existing ops surface. (AC: 1, 2, 3)
  - [x] Add a thin POST route under `src/app/api/ops/actions/route.ts` that accepts only the supported action names and rejects everything else with a bounded calm error shape. (AC: 1, 3)
  - [x] Reuse `assertOpsAccess` in the action route so denied or non-local requests fail closed exactly like the current ops route and ops health endpoint. (AC: 1, 3)
  - [x] Keep all action execution same-origin and server-only. No public route, public component, or browser-side code may call providers directly or expose maintenance affordances on the foyer display. (AC: 1)
  - [x] After a successful action, return the latest readiness and diagnostics payload in the response so the ops UI can refresh from the same source of truth already used by `/api/ops/health`. (AC: 2)
- [x] Add a keyboard-safe ops action panel that surfaces refresh and trust-check controls without turning the page into a control-room dashboard. (AC: 1, 2, 3)
  - [x] Extend `src/features/ops/components/OpsShell.tsx` and supporting ops modules to replace the placeholder “later stories add live recovery controls” language with a real maintenance action area under the existing Recovery steps panel. (AC: 1, 2)
  - [x] Introduce a small client-side ops action component only where needed, for example `OpsActionPanel.tsx`, that submits actions to `/api/ops/actions`, keeps focus order stable, and leaves the main public route untouched. (AC: 1)
  - [x] Render two clearly labeled actions only: `Run refresh` and `Run trust check`. Keep labels plain, non-technical, and specific to venue maintenance. (AC: 1, 2)
  - [x] Show the latest action result inline in calm operational language, including whether the check succeeded, whether confidence remains reduced, and when the action completed. (AC: 2, 3)
  - [x] Prevent duplicate in-flight submissions and ensure failure states remain bounded, readable, and keyboard-safe rather than surfacing raw exceptions or hanging controls. (AC: 3)
- [x] Refresh the ops-read model after actions so operators can immediately see the newest readiness and trust picture from the existing Epic 3 surface. (AC: 2, 3)
  - [x] Add or reuse an ops-health query seam, such as `useOpsHealthQuery` with the `['ops', 'health']` key, so the action panel can refetch the current ops status after a completed action. (AC: 2)
  - [x] If a refresh succeeds, update the shell with the new readiness label, issue list, and signal-and-scope diagnostics from the latest payload instead of leaving the operator on stale pre-action data. (AC: 2)
  - [x] If a refresh or trust-check fails, keep the prior visible readiness context on screen and append the calm action result so the operator still has the last safe usable read. (AC: 3)
- [x] Protect the feature with regression coverage across action execution, access control, and ops-shell rendering. (AC: 1, 2, 3)
  - [x] Add unit tests for `run-ops-maintenance-action.js` covering successful forced refresh, successful trust-check, failed refresh with a preserved last-safe read, and unsupported action rejection. (AC: 1, 2, 3)
  - [x] Add route tests proving `/api/ops/actions` is local-only, accepts only the supported action names, returns calm plain-language results, and never leaks raw provider payloads, stack traces, or secret-bearing values. (AC: 1, 3)
  - [x] Add UI tests covering keyboard-safe action rendering, disabled in-flight states, success result rendering, and failure result rendering while preserving the previous readiness context. (AC: 2, 3)
  - [x] Keep the full verification path compatible with `npm run validate`. (AC: 1, 2, 3)

## Dev Notes

### Developer Context

- Story 3.4 is the first Epic 3 story that adds write-side venue actions. It must build directly on the local-only ops surface from Story 3.1, the readiness read model from Story 3.2, and the degraded-impact diagnostics from Story 3.3.
- The existing seams to extend are already present:
  - `src/app/(ops)/ops/page.tsx` renders the local-only ops surface.
  - `src/app/api/ops/health/route.ts` exposes the current local-only read endpoint.
  - `src/lib/server/ops/get-ops-health.js` derives readiness and diagnostics from the dashboard response.
  - `src/lib/server/ops/create-ops-health-route-response.js` centralizes local-only route handling.
  - `src/lib/server/dashboard/dashboard-service.js` owns the current cache, build, last-safe, and fallback behavior.
  - `src/lib/server/dashboard/publish-dashboard-snapshot.js` writes the latest safe snapshot and updates in-memory cache.
- Scope discipline for Epic 3:
  - Story 3.2 owns read-only public readiness.
  - Story 3.3 owns degraded signal and scope diagnostics.
  - Story 3.4 owns lightweight maintenance actions only.
  - Story 3.5 owns interruption or restart recovery.
- Strong implication: Story 3.4 should add a compact maintenance action path that refreshes or re-checks the existing system. It should not introduce restart orchestration, process control, provider-specific control panels, or any public-display interaction.

### Technical Requirements

- Reuse the existing dashboard service and fallback model.
  - wrong approach: call providers directly from the ops route or client component
  - right approach: let a server-only maintenance helper force or re-check the same dashboard pipeline already used for the public snapshot
- Define action semantics narrowly and explicitly:
  - `refresh`: attempt a fresh snapshot build and publish cycle now, bypassing the normal cache reuse window
  - `trust-check`: re-evaluate current readiness and degraded-impact evidence without claiming a fresh publish when none occurred
- Preserve last-safe behavior on failure.
  - If a forced refresh cannot fetch live inputs, the system must still rely on the existing last-safe or fallback logic already implemented in `dashboard-service.js`.
  - The action result must tell the operator what happened in calm language, but must not erase or overstate the current public-read picture.
- Keep action result copy operational and fact-only.
  - acceptable language: `Refresh completed and the public view is current.`, `Trust check completed with reduced confidence.`, `Refresh could not confirm fresh live detail; the last safe picture remains in service.`
  - unacceptable language: raw exception text, provider stack traces, request dumps, token names, or action copy that reads like engineering tooling
- Keep the public display isolated.
  - No refresh button, retry button, or trust-check affordance may appear in the public route tree.
  - No public component may import the maintenance-action client or call the new ops action endpoint.
- Keep maintenance actions idempotent enough for normal venue use.
  - duplicate clicks while an action is in flight should be prevented in the UI
  - unsupported or malformed actions should fail clearly and safely on the server

### Architecture Compliance

- Follow the approved modular-monolith boundaries:
  - ops route entry in `src/app/(ops)/ops/*`
  - ops action endpoint in `src/app/api/ops/*`
  - server-only maintenance logic in `src/lib/server/ops/*`
  - dashboard rebuild and publish logic in `src/lib/server/dashboard/*`
  - access control in `src/lib/server/security/*`
- Keep route files thin.
  - parse request
  - apply local-only access gate
  - delegate to a server helper
  - return a calm JSON result
- Preserve the same source-of-truth model:
  - dashboard snapshot and response metadata remain authoritative
  - readiness and diagnostics remain derived from the same payload
  - maintenance actions must not create a parallel ops-only state system
- Stay aligned with architecture requirements already established in `docs/architecture.md`:
  - same-origin internal APIs only
  - no public write endpoints
  - provider integrations remain server-only
  - route handlers are the BFF boundary
  - public and ops route trees stay separate
- Preserve the product doctrine even in the ops surface:
  - calm
  - venue-native
  - fact-only
  - operationally clear
  - not a control-room dashboard

### Library / Framework Requirements

- Stay on the repo-pinned stack for this story:
  - `next` `16.1.7`
  - `react` `19.2.3`
  - `react-dom` `19.2.3`
  - `@tanstack/react-query` `^5.0.0`
  - `zod` `^4.3.6`
  - `node` `24.x`
- Latest official-source checks completed on 2026-03-19:
  - Next.js App Router route handlers remain the correct boundary for internal maintenance endpoints, so adding a POST ops-action route fits the approved architecture: https://nextjs.org/docs/app/getting-started/route-handlers
  - React’s official server/client guidance still reinforces that request-derived access control and maintenance execution stay on the server, with only a minimal client boundary for the action controls: https://react.dev/reference/rsc/use-client
  - TanStack Query’s current React docs still support the existing array query-key pattern, making `['ops', 'health']` the correct default for post-action refetch behavior if a query hook is added: https://tanstack.com/query/latest/docs/framework/react/overview
  - Node’s official release page lists `v24` as Active LTS as of 2026-03-19, consistent with the repo engine contract for long-running venue operation: https://nodejs.org/en/about/previous-releases
  - Zod’s official docs continue to position Zod 4 as the stable line, so any new action request/response schema should stay on the current repo validation approach: https://zod.dev/
- Inference from those sources: the safest implementation is a small server-only action helper plus a focused client ops-control panel, not a new service, websocket control path, or browser-driven provider orchestration.

### File Structure Requirements

- Expected files to add:
  - `src/app/api/ops/actions/route.ts`
  - `src/lib/server/ops/run-ops-maintenance-action.js`
  - `src/features/ops/components/OpsActionPanel.tsx`
  - `src/features/ops/hooks/useOpsHealthQuery.ts`
  - `src/features/ops/hooks/useOpsMaintenanceActionMutation.ts`
- Expected files to update:
  - `src/app/(ops)/ops/page.tsx`
  - `src/features/ops/components/OpsShell.tsx`
  - `src/features/ops/ops-shell-content.js`
  - `src/features/ops/ops-shell-view.js`
  - `src/lib/server/ops/get-ops-health.js`
  - `src/lib/server/dashboard/dashboard-service.js`
  - `src/lib/server/security/assert-ops-access.js` only if a shared route helper signature needs reuse, not to change the access policy itself
  - tests under `tests/unit` and `tests/smoke`
- Files to reuse rather than bypass:
  - `src/lib/server/dashboard/build-dashboard-snapshot.js`
  - `src/lib/server/dashboard/publish-dashboard-snapshot.js`
  - `src/lib/server/cache/memory-cache.js`
  - `src/lib/server/cache/snapshot-store.js`
  - `src/lib/contracts/api-response.js`
  - `src/lib/contracts/dashboard-snapshot.js`
  - `src/lib/contracts/freshness.js`
  - `src/lib/server/ops/create-ops-health-route-response.js`
  - `src/lib/server/ops/get-degraded-impact-diagnostics.js`
- Naming conventions already in use still apply:
  - `PascalCase.tsx` for components
  - `kebab-case` for non-component modules
  - thin route handlers with server logic moved into helpers

### Testing Requirements

- Minimum verification for implementation:
  - `npm run lint`
  - `npm run typecheck`
  - `npm test`
  - `npm run build`
- Add focused tests for:
  - forced-refresh execution bypassing the cache-hold path
  - trust-check execution reusing the current health and diagnostics pipeline
  - local-only gating for `/api/ops/actions`
  - unsupported action rejection with calm bounded output
  - refresh failure preserving last-safe or fallback readability instead of blanking the ops picture
  - post-action ops-health refresh in the UI
  - keyboard-safe action controls and disabled in-flight states
  - plain-language action result rendering with no raw technical leakage
- Keep fixtures grounded in the current dashboard snapshot and ops-health contracts.
- Do not expand Story 3.4 into process restart or app boot recovery testing; that belongs to Story 3.5.

### Previous Story Intelligence

- Story 3.1 established the non-negotiable local-only access and route-separation rule.
- Story 3.2 established the server-derived readiness payload and the calm ops-shell status language.
- Story 3.3 established the richer diagnostics model and the expectation that operators see blast radius plus still-healthy evidence without technical leakage.
- Strong implication for Story 3.4:
  - actions should write back into the same readiness-and-diagnostics surface operators already understand
  - the controls should live in the existing ops shell, not on a new maintenance page
  - the result should look like a calm venue maintenance update, not a raw “job runner” log

### Git Intelligence Summary

- Recent Epic 3 commits show the implementation pattern to preserve:
  - `8a12ce8 feat(epic-3): implement 3-3-diagnose-degraded-impact-by-signal-and-scope`
  - `93e5912 feat(epic-3): implement 3-2-show-public-readiness-and-current-ops-state`
  - `9eb1adf feat(epic-3): implement 3-1-provide-a-separate-local-only-ops-access-surface`
- Actionable implications from those commits and artifacts:
  - keep server derivation helpers focused and testable
  - extend the existing ops shell instead of branching into a second ops route
  - protect new ops behavior with unit coverage and smoke assertions
  - preserve the repo’s plain-language, calm-copy discipline even when adding write actions

### Latest Tech Information

- Official-source checks on 2026-03-19 did not surface any stack change that would alter the implementation direction for this story.
  - Next.js route handlers remain the right boundary for maintenance POST actions.
  - React still favors server-owned security and request-context decisions.
  - TanStack Query still supports the repo’s query-key conventions for action follow-up refetches.
  - Node `v24` remains Active LTS.
  - Zod 4 remains the stable schema line.
- Inference: implement Story 3.4 inside the current Next.js 16 route-handler model with a compact client action panel, not a new service or framework layer.

### Project Structure Notes

- No `project-context.md` file is present in this repo, so rely on the planning artifacts plus the implemented Epic 3 source files.
- The biggest implementation trap is bypassing the existing dashboard-service truth model.
  - wrong approach: a refresh button directly hits providers or clears state without going through the normal snapshot publication flow
  - right approach: a maintenance action helper forces or re-checks the existing pipeline and then returns the same calm readiness and diagnostics model the ops shell already understands
- The second trap is surfacing action mechanics instead of venue-facing outcomes.
  - wrong approach: show request payloads, stack traces, or action logs
  - right approach: show whether the display is current, reduced-confidence, or unavailable after the action and what the operator should infer from that

### References

- `docs/epics.md#Story 3.4: Trigger Lightweight Refresh and Trust-Check Actions`
- `docs/prd.md` sections covering FR34, NFR8, NFR16, NFR18, NFR19, NFR24, NFR27, and NFR28
- `docs/architecture.md` sections covering route handlers as the internal API boundary, local-only maintenance access, health/status endpoints, file-backed last-safe snapshots, and separate public versus ops route trees
- `docs/ux-design-specification.md` sections covering venue operators, restrained staff-only button hierarchy, calm feedback patterns, keyboard-safe maintenance views, and public-display isolation
- `docs/sprint-artifacts/3-1-provide-a-separate-local-only-ops-access-surface.md`
- `docs/sprint-artifacts/3-2-show-public-readiness-and-current-ops-state.md`
- `docs/sprint-artifacts/3-3-diagnose-degraded-impact-by-signal-and-scope.md`
- `src/app/(ops)/ops/page.tsx`
- `src/app/api/ops/health/route.ts`
- `src/features/ops/components/OpsShell.tsx`
- `src/features/ops/ops-shell-content.js`
- `src/features/ops/ops-shell-view.js`
- `src/lib/server/ops/get-ops-health.js`
- `src/lib/server/ops/create-ops-health-route-response.js`
- `src/lib/server/ops/get-degraded-impact-diagnostics.js`
- `src/lib/server/dashboard/dashboard-service.js`
- `src/lib/server/dashboard/build-dashboard-snapshot.js`
- `src/lib/server/dashboard/publish-dashboard-snapshot.js`
- `src/lib/server/cache/memory-cache.js`
- `src/lib/server/cache/snapshot-store.js`
- `src/lib/server/security/assert-ops-access.js`
- `package.json`

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- Create-story workflow executed in autonomous mode on 2026-03-19.
- Implemented Story 3.4 in autonomous mode on 2026-03-19 with a server-only maintenance action path, local-only POST route, ops query/mutation boundary, and inline ops action result rendering.
- Validation completed on 2026-03-19 with `npm run validate`.
- Story context derived from `docs/epics.md`, `docs/prd.md`, `docs/architecture.md`, `docs/ux-design-specification.md`, `docs/sprint-artifacts/3-1-provide-a-separate-local-only-ops-access-surface.md`, `docs/sprint-artifacts/3-2-show-public-readiness-and-current-ops-state.md`, `docs/sprint-artifacts/3-3-diagnose-degraded-impact-by-signal-and-scope.md`, and the current Epic 3 source files under `src/app/api/ops`, `src/features/ops`, `src/lib/server/ops`, `src/lib/server/dashboard`, and `src/lib/server/cache`.
- Official-source checks refreshed on 2026-03-19 against Next.js, React, TanStack Query, Node.js, and Zod documentation to confirm the current implementation boundary and library guidance.

### Completion Notes List

- Added `run-ops-maintenance-action.js` and `create-ops-actions-route-response.js` so `refresh` forces the existing dashboard publish path, `trust-check` reuses the latest available dashboard response without publishing, and both return one calm maintenance result contract.
- Added the local-only `POST /api/ops/actions` route with bounded unsupported-action and failure responses while preserving the same `assertOpsAccess` gate used by the existing ops page and ops-health endpoint.
- Replaced the recovery-step placeholder with a client-side ops maintenance area that exposes only `Run refresh` and `Run trust check`, disables duplicate in-flight submissions, and renders calm inline action outcomes without touching the public route tree.
- Added `useOpsHealthQuery`, `useOpsMaintenanceActionMutation`, and an `OpsShellClient` query boundary so the ops shell refetches the existing health source of truth after completed actions and preserves the last visible readiness context during failures.
- Extended regression coverage for action execution, local-only route handling, and keyboard-safe ops action rendering states, then passed the full `npm run validate` gate.
- Senior review fixes now block duplicate in-flight maintenance submissions at the hook boundary, clear stale action results before a new request, make fallback failure copy action-specific, and restore reconnect/focus refetch behavior for non-polling query consumers.

### File List

- docs/sprint-artifacts/3-4-trigger-lightweight-refresh-and-trust-check-actions.md
- docs/sprint-artifacts/sprint-status.yaml
- src/app/api/ops/actions/route.ts
- src/app/globals.css
- src/features/ops/components/OpsActionPanel.tsx
- src/features/ops/components/OpsShell.tsx
- src/features/ops/components/OpsShellClient.tsx
- src/features/ops/hooks/useOpsHealthQuery.ts
- src/features/ops/hooks/useOpsMaintenanceActionMutation.ts
- src/features/ops/ops-shell-content.js
- src/features/ops/ops-shell-view.js
- src/lib/server/dashboard/dashboard-service.js
- src/lib/server/ops/create-ops-actions-route-response.js
- src/lib/server/ops/run-ops-maintenance-action.js
- src/lib/vendor/tanstack-react-query.tsx
- tests/unit/ops-maintenance-action.test.mjs
- tests/unit/ops-query-boundary.test.mjs
- tests/unit/ops-shell.test.mjs

## Change Log

- 2026-03-19: Implemented Story 3.4 with server-only maintenance actions, a local-only ops action route, a keyboard-safe ops action panel, and regression coverage across route, helper, and ops-shell behavior.
- 2026-03-19: Senior code review fixed duplicate in-flight action submission, removed stale action-result carryover on failed retries, restored reconnect/focus refetch support for non-polling query consumers, and re-verified with lint, typecheck, tests, and build.

## Senior Developer Review (AI)

### Outcome

Approve

### Findings Fixed

- Medium: `src/features/ops/hooks/useOpsMaintenanceActionMutation.ts` only relied on button disabled state to prevent duplicate submissions, so two rapid triggers could still fire multiple POSTs before React committed the pending state.
- Medium: `src/features/ops/hooks/useOpsMaintenanceActionMutation.ts` preserved the previous successful action result when a later action failed, which could show a stale success message alongside the newest failure and misstate the latest maintenance outcome.
- Medium: `src/lib/vendor/tanstack-react-query.tsx` only attached `focus` and `online` listeners when polling was enabled, so `refetchOnReconnect: true` was inert for the ops health query’s non-polling configuration.

### Verification

- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run build`
