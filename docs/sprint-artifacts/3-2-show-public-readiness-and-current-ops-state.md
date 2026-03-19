# Story 3.2: Show Public Readiness and Current Ops State

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a venue operator,
I want to see whether the display is current, reduced-confidence, or unavailable,
so that I can decide quickly whether it is fit for public use.

## Acceptance Criteria

1. Given the display and ops surface are running, when a venue operator checks the ops status view, then the current public state is shown as current, reduced-confidence, or unavailable, and the status reflects the same readiness model used by the public display.
2. Given the public display is fit for service, when the operator confirms readiness, then they can see that the main layout, overall departure state, and trust labeling are present, and the view does not require raw logs or implementation details to understand readiness.
3. Given the public state is not fully current, when the operator checks readiness, then the issue is described in plain operational language, and the screen does not expose secrets, stack traces, or raw provider payloads.

## Tasks / Subtasks

- [x] Add a server-side ops readiness read model that derives public readiness from the existing dashboard snapshot and response metadata. (AC: 1, 2, 3)
  - [x] Create a dedicated ops status module under `src/lib/server/ops/` that consumes the existing dashboard service or stored snapshot path instead of introducing a second source-of-truth contract. (AC: 1)
  - [x] Map the current public state into exactly three operator-facing readiness states: `current`, `reduced-confidence`, and `unavailable`, with deterministic rules tied to existing public-display evidence such as `meta.snapshotState`, `headerTrust`, `headerStatus`, mode trust, and presence of required public sections. (AC: 1, 2, 3)
  - [x] Reuse existing public plain-language trust and source-status labels wherever possible so the ops surface reflects the same trust model the foyer display already communicates. (AC: 1, 3)
- [x] Expose a local-only maintenance read endpoint for current ops status. (AC: 1, 3)
  - [x] Add `src/app/api/ops/health/route.ts` or the repo-equivalent maintenance endpoint path defined by the architecture. (AC: 1)
  - [x] Apply the same `assertOpsAccess` server gate used by Story 3.1 so non-local requests fail closed without leaking maintenance intent. (AC: 3)
  - [x] Return a small same-origin JSON contract for readiness summary, key readiness checks, and calm plain-language issues only. (AC: 1, 2, 3)
- [x] Replace the placeholder readiness area in the existing ops shell with a real read-only readiness view. (AC: 1, 2, 3)
  - [x] Extend `src/features/ops/components/OpsShell.tsx` and supporting ops view modules so the first panel shows the readiness state, readiness summary, and the specific public checks for layout visibility, overall departure state presence, and trust labeling presence. (AC: 1, 2)
  - [x] Keep the page keyboard-safe and structurally distinct from the public display, with no logs, stack traces, raw payloads, or provider internals rendered into the UI. (AC: 2, 3)
  - [x] Use restrained status styling with non-color cues and plain operational labels so the view reads like venue maintenance, not a control-room dashboard. (AC: 2, 3)
- [x] Add regression coverage for readiness mapping, the maintenance endpoint, and the ops UI. (AC: 1, 2, 3)
  - [x] Add unit tests for readiness classification covering `current`, `reduced-confidence`, and `unavailable` based on live, last-safe, and fallback dashboard states. (AC: 1, 3)
  - [x] Add endpoint coverage proving `/api/ops/health` stays local-only, returns the expected calm JSON summary, and never exposes raw provider errors or secrets. (AC: 1, 3)
  - [x] Update ops-shell coverage so the current maintenance view no longer stops at placeholder labels and instead renders the real readiness state plus required readiness checks in keyboard-safe order. (AC: 1, 2)
  - [x] Keep the full verification path compatible with `npm run validate`. (AC: 1, 2, 3)

## Dev Notes

### Developer Context

- Story 3.1 already created the local-only ops route and the server-side access gate:
  - [page.tsx](/home/codexuser/bmad-6-workshop/src/app/(ops)/ops/page.tsx)
  - [OpsShell.tsx](/home/codexuser/bmad-6-workshop/src/features/ops/components/OpsShell.tsx)
  - [ops-shell-content.js](/home/codexuser/bmad-6-workshop/src/features/ops/ops-shell-content.js)
  - [assert-ops-access.js](/home/codexuser/bmad-6-workshop/src/lib/server/security/assert-ops-access.js)
- Story 3.2 must fill the first ops panel with real readiness information. It should not add refresh actions or restart flows yet.
- The current public runtime already exposes the core evidence needed for readiness:
  - [dashboard-service.js](/home/codexuser/bmad-6-workshop/src/lib/server/dashboard/dashboard-service.js) returns `meta.snapshotState` values of `live`, `last-safe`, or `fallback`.
  - [dashboard-snapshot.js](/home/codexuser/bmad-6-workshop/src/lib/contracts/dashboard-snapshot.js) enforces trust labels, source-status labels, and fact-only copy for the public display contract.
  - [build-dashboard-snapshot.js](/home/codexuser/bmad-6-workshop/src/lib/server/dashboard/build-dashboard-snapshot.js) already models reduced-confidence and unavailable conditions via trust and source-status fields.
- Use those existing contracts as the only basis for readiness. Do not invent a second independent health taxonomy or bypass the snapshot service by querying providers directly.
- Scope discipline:
  - Story 3.2 owns read-only readiness state and plain-language current ops status.
  - Story 3.3 owns degraded impact by signal and scope.
  - Story 3.4 owns refresh and trust-check actions.
  - Story 3.5 owns recovery after interruption or restart.

### Technical Requirements

- Readiness must use one deterministic mapping that aligns with the public display:
  - `current`: the display is using a live snapshot and the required public-ready checks pass.
  - `reduced-confidence`: the display is still fit for service, but the current evidence is narrowed, carried forward, stale, delayed, or otherwise not fully current.
  - `unavailable`: the display is not fit for normal public trust because it is in fallback-only posture or missing required public-ready checks.
- Minimum public-ready checks must cover the requirements named in Epic 3.2 and FR30/FR31:
  - the main layout is present
  - the overall departure state is present
  - trust labeling is present for the displayed signals
- The ops view must express issues in calm venue language. Reuse public trust/source labels such as "carried forward", "temporarily unavailable", "stale", and "reduced-confidence" instead of inventing engineering phrasing.
- Do not render:
  - provider payloads
  - stack traces
  - raw exception text
  - secrets or token-bearing values
  - implementation-only diagnostics better suited to Story 3.3
- Keep the public route passive and unchanged. Story 3.2 belongs entirely in the ops route tree, ops APIs, and server ops helpers.
- Prefer a read-only ops status payload shaped for the shell, for example:
  - top-level readiness state
  - short summary line
  - checklist of public-ready checks with pass or attention-needed status
  - brief issue list using plain operational language

### Architecture Compliance

- Follow the modular-monolith boundaries defined in [architecture.md](/home/codexuser/bmad-6-workshop/docs/architecture.md):
  - ops UI in `src/features/ops/*`
  - ops route entry in `src/app/(ops)/ops/*`
  - operational endpoints in `src/app/api/ops/*`
  - ops-only server logic in `src/lib/server/ops/*`
  - access control in `src/lib/server/security/*`
- Keep the route file thin. Request gating and high-level composition belong in the route; readiness derivation belongs in server ops modules.
- Use the existing same-origin internal API posture. The ops shell can consume `/api/ops/health`, but external providers must remain server-only.
- Stay aligned with the architecture requirement for:
  - explicit public-readiness state modeling
  - health/status endpoints
  - source-freshness telemetry reuse
  - local-only maintenance access
- Preserve the product doctrine:
  - calm
  - shared
  - venue-native
  - fact-only
  - ambient before interactive
  - not a route planner

### Library / Framework Requirements

- Stay on the repo-pinned stack for this story unless a separate upgrade story is approved:
  - `next` `16.1.7`
  - `react` `19.2.3`
  - `react-dom` `19.2.3`
  - `@tanstack/react-query` `^5.0.0`
  - `zod` `^4.3.6`
  - `node` `24.x`
- Latest official-source checks completed on 2026-03-19:
  - Next.js docs list App Router `16.2.0` as the latest docs version and continue to support route handlers for internal endpoints, so the architecture path remains current without changing this repo mid-story: https://nextjs.org/docs/app/getting-started/route-handlers
  - React's official `'use client'` guidance still requires client-component boundaries to use serializable inputs, reinforcing that readiness derivation and request-context access control stay on the server: https://react.dev/reference/rsc/use-client
  - TanStack Query's official React docs still support array query keys, matching the architecture's `['ops', 'health']` convention if a client query wrapper is added for the ops view: https://tanstack.com/query/latest/docs/framework/react/overview
  - Node's official release schedule lists `v24` as Active LTS as of 2026-03-19, consistent with the repo engine contract: https://nodejs.org/en/about/previous-releases
  - Zod's official docs continue to position Zod 4 as the stable line for schema validation: https://zod.dev/
- Inference from those sources: implement Story 3.2 inside the current Next.js 16 modular-monolith shape and repo-pinned dependencies, rather than introducing a separate service, an auth workflow, or a client-derived security model.

### File Structure Requirements

- Expected files to add:
  - `src/app/api/ops/health/route.ts`
  - one or more ops status helpers under `src/lib/server/ops/` such as `get-ops-status.js` and `ops-status.js`
  - optional response-contract helper under `src/lib/contracts/` only if the existing API-response pattern is extended cleanly
- Expected files to update:
  - [page.tsx](/home/codexuser/bmad-6-workshop/src/app/(ops)/ops/page.tsx) only if the route needs to pass initial ops data while staying thin
  - [OpsShell.tsx](/home/codexuser/bmad-6-workshop/src/features/ops/components/OpsShell.tsx)
  - [ops-shell-content.js](/home/codexuser/bmad-6-workshop/src/features/ops/ops-shell-content.js)
  - tests under `tests/unit` and `tests/smoke` for ops status behavior
- Files to reuse rather than bypass:
  - [dashboard-service.js](/home/codexuser/bmad-6-workshop/src/lib/server/dashboard/dashboard-service.js)
  - [api-response.js](/home/codexuser/bmad-6-workshop/src/lib/contracts/api-response.js)
  - [dashboard-snapshot.js](/home/codexuser/bmad-6-workshop/src/lib/contracts/dashboard-snapshot.js)
  - [build-dashboard-snapshot.js](/home/codexuser/bmad-6-workshop/src/lib/server/dashboard/build-dashboard-snapshot.js)
  - [publish-dashboard-snapshot.js](/home/codexuser/bmad-6-workshop/src/lib/server/dashboard/publish-dashboard-snapshot.js)
- Naming conventions already established in the repo still apply:
  - component files in `PascalCase.tsx`
  - non-component modules in `kebab-case`
  - route files limited to request handling and rendering composition

### Testing Requirements

- Minimum verification for implementation:
  - `npm run lint`
  - `npm run typecheck`
  - `npm test`
  - `npm run build`
- Add focused tests for:
  - readiness mapping from `live` to `current`
  - readiness mapping from `last-safe` or narrowed trust states to `reduced-confidence`
  - readiness mapping from `fallback` or missing required checks to `unavailable`
  - local-only gating for `/api/ops/health`
  - plain-language issue reporting with no raw provider payloads or stack traces
  - keyboard-safe rendering order in the ops shell after real readiness content replaces placeholder actions
- Keep test fixtures grounded in the existing dashboard snapshot builders and contracts. Avoid hand-rolled fake shapes that drift from the enforced snapshot schema.
- Do not expand Story 3.2 tests into refresh execution or restart orchestration; those belong to Stories 3.4 and 3.5.

### Previous Story Intelligence

- Story 3.1 established the core Epic 3 pattern to preserve:
  - server-side gating first, then render
  - thin route files
  - feature logic under `src/features/ops/*`
  - non-leaky denial behavior mapped to `notFound()`
  - keyboard-safe ops structure with plain operational labels
- The current ops shell already frames the exact area this story should replace:
  - "Open readiness status"
  - "Review data freshness"
- That means Story 3.2 should evolve the existing shell instead of replacing it with a separate maintenance page or a second route.
- Preserve the repo-wide local access rule from Story 3.1: loopback plus `OPS_ALLOWED_HOSTS`. Do not introduce a second access mechanism for ops APIs.

### Git Intelligence Summary

- Recent commits show the repo pattern to follow:
  - `9eb1adf feat(epic-3): implement 3-1-provide-a-separate-local-only-ops-access-surface`
  - `a05a3b6 feat(epic-2): implement 2-5-maintain-stable-live-reading-during-updates-and-motion-changes`
  - `7c59d10 feat(epic-2): implement 2-4-preserve-honest-usefulness-during-provider-failure`
  - `5560765 feat(epic-2): implement 2-3-surface-serious-disruption-without-breaking-composure`
  - `c67b394 feat(epic-2): implement 2-2-show-trend-and-freshness-where-confidence-matters`
- Actionable implication:
  - derive ops readiness from the public snapshot logic already hardened in Epic 2
  - protect the new behavior with unit and smoke coverage
  - do not dilute the separation between public display code and maintenance code introduced in Story 3.1

### Latest Tech Information

- Official-source checks on 2026-03-19 confirm the approved approach is still current:
  - Next.js App Router route handlers remain the correct internal endpoint boundary for ops health reads.
  - React server/client guidance still favors server-derived request and readiness decisions.
  - TanStack Query still supports the array query-key pattern already called out by architecture.
  - Node `v24` remains Active LTS.
  - Zod 4 remains the stable validation line.
- Inference: Story 3.2 should add a small internal ops health API and server derivation logic, not a custom client polling stack or a new backend service.

### Project Structure Notes

- No `project-context.md` file is present in this repo, so the story should rely on the planning artifacts and the implemented Epic 1 and Epic 2 contracts already in source.
- The strongest implementation trap for this story is duplicating status logic:
  - wrong approach: invent a new ops-only readiness state based on ad hoc conditions
  - right approach: adapt the dashboard snapshot and response metadata into an operator-facing readiness summary
- The second trap is overexposing diagnostics too early:
  - Story 3.2 is an operational readiness read
  - Story 3.3 is where signal-level degraded impact should become explicit

### References

- `docs/epics.md#Story 3.2: Show Public Readiness and Current Ops State`
- `docs/prd.md` sections covering FR30, FR31, NFR14, NFR27, and NFR28
- `docs/architecture.md` sections covering public-readiness state modeling, health/status endpoints, local-only ops access, and the `src/app/api/ops/*` plus `src/lib/server/ops/*` structure
- `docs/ux-design-specification.md` sections covering secondary venue operators, keyboard-safe staff recovery views, plain operational labels, and restrained staff-only button hierarchy
- [page.tsx](/home/codexuser/bmad-6-workshop/src/app/(ops)/ops/page.tsx)
- [OpsShell.tsx](/home/codexuser/bmad-6-workshop/src/features/ops/components/OpsShell.tsx)
- [ops-shell-content.js](/home/codexuser/bmad-6-workshop/src/features/ops/ops-shell-content.js)
- [assert-ops-access.js](/home/codexuser/bmad-6-workshop/src/lib/server/security/assert-ops-access.js)
- [dashboard-service.js](/home/codexuser/bmad-6-workshop/src/lib/server/dashboard/dashboard-service.js)
- [api-response.js](/home/codexuser/bmad-6-workshop/src/lib/contracts/api-response.js)
- [dashboard-snapshot.js](/home/codexuser/bmad-6-workshop/src/lib/contracts/dashboard-snapshot.js)
- [build-dashboard-snapshot.js](/home/codexuser/bmad-6-workshop/src/lib/server/dashboard/build-dashboard-snapshot.js)
- [publish-dashboard-snapshot.js](/home/codexuser/bmad-6-workshop/src/lib/server/dashboard/publish-dashboard-snapshot.js)

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- Create-story workflow executed in autonomous mode on 2026-03-19.
- Story context derived from `docs/epics.md`, `docs/prd.md`, `docs/architecture.md`, `docs/ux-design-specification.md`, the completed Story 3.1 artifact, and current source files under `src/features/ops`, `src/lib/server/dashboard`, and `src/lib/contracts`.
- Implemented Story 3.2 in autonomous dev-story mode on 2026-03-19 with focused red/green runs for `tests/unit/ops-health.test.mjs` and `tests/unit/ops-shell.test.mjs`, then full `npm run validate`.

### Implementation Plan

- Derive a single ops-readiness payload from `getDashboardApiResponse()` so the ops surface reuses the public display’s snapshot and trust model.
- Expose the payload through a thin local-only `/api/ops/health` route plus a small JS route helper that stays testable under the repo’s `vitest-lite` runner.
- Replace placeholder ops actions with a read-only readiness panel and add targeted unit coverage plus smoke assertions for the new route composition.

### Completion Notes List

- Added `src/lib/server/ops/get-ops-health.js` to classify public readiness as `current`, `reduced-confidence`, or `unavailable` from `meta.snapshotState`, required public sections, and existing trust/source labels.
- Added `src/app/api/ops/health/route.ts` plus `src/lib/server/ops/create-ops-health-route-response.js` to expose a local-only calm JSON readiness contract guarded by `assertOpsAccess`.
- Replaced placeholder ops actions with a real readiness panel in `src/features/ops/components/OpsShell.tsx`, backed by `src/features/ops/ops-shell-view.js`, updated copy in `src/features/ops/ops-shell-content.js`, and restrained non-color status styling in `src/app/globals.css`.
- Added regression coverage in `tests/unit/ops-health.test.mjs`, `tests/unit/ops-shell.test.mjs`, and updated `tests/smoke/startup-smoke.test.mjs` for the server-derived ops shell contract.
- Verified `npm run validate` passes end to end on 2026-03-19.
- Senior review fixes now treat `aging` trust evidence as reduced-confidence, surface calm issue copy whenever required readiness checks fail, and format published timestamps as operator-facing local time instead of raw ISO output.

### File List

- docs/sprint-artifacts/3-2-show-public-readiness-and-current-ops-state.md
- docs/sprint-artifacts/sprint-status.yaml
- src/app/(ops)/ops/page.tsx
- src/app/api/ops/health/route.ts
- src/app/globals.css
- src/features/ops/components/OpsShell.tsx
- src/features/ops/ops-shell-content.js
- src/features/ops/ops-shell-view.js
- src/lib/server/ops/create-ops-health-route-response.js
- src/lib/server/ops/get-ops-health.js
- tests/smoke/startup-smoke.test.mjs
- tests/unit/ops-health.test.mjs
- tests/unit/ops-shell.test.mjs

## Change Log

- 2026-03-19: Implemented Story 3.2 public readiness modeling, local-only ops health endpoint, real ops readiness UI, and regression coverage.
- 2026-03-19: Applied senior review fixes for aging readiness handling, missing-check issue reporting, accessible checklist status copy, and calm local timestamp formatting.

## Senior Developer Review (AI)

### Findings

1. High: `src/lib/server/ops/get-ops-health.js` ignored `aging` trust signals, so a live snapshot with aged evidence could still be reported as `current` instead of `reduced-confidence`. Fixed by treating `aging` as attention-worthy readiness evidence and adding regression coverage in `tests/unit/ops-health.test.mjs`.
2. High: `src/lib/server/ops/get-ops-health.js` could return an `unavailable` readiness state with an empty issue list, which made the ops shell claim there were no active issues even when required public checks had failed. Fixed by folding failed readiness-check detail into the plain-language issues list and adding regression coverage in `tests/unit/ops-health.test.mjs`.
3. Medium: `src/features/ops/ops-shell-view.js` surfaced raw ISO timestamps and `src/features/ops/components/OpsShell.tsx` exposed the non-color checklist cue only visually. Fixed by formatting the published timestamp into calm local operator time and adding screen-reader-visible pass/attention text, with coverage in `tests/unit/ops-shell.test.mjs`.

### Review Outcome

- All high and medium findings were fixed.
- `npm run validate` now passes with the review fixes applied.
- Story status moved to `done`.
