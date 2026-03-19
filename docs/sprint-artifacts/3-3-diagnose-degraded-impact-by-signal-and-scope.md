# Story 3.3: Diagnose Degraded Impact by Signal and Scope

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a venue operator,
I want to understand which signal is degraded and how far the impact spreads,
so that I can judge whether the display can remain in service.

## Acceptance Criteria

1. Given one or more displayed signals are degraded, when a venue operator checks the ops diagnostics, then the affected signal or source is identified clearly, and the operator can tell whether the impact is local or affects the overall departure picture.
2. Given an optional feed fails while core display data remains usable, when the operator reviews the ops status, then the screen shows that unaffected parts remain healthy, and the display can still be judged honestly for continued public use.
3. Given degraded-state diagnostics are displayed, when the operator reads them, then they are expressed as operationally useful trust information, and they do not devolve into raw technical error output.

## Tasks / Subtasks

- [x] Extend the existing ops health read model to derive degraded-impact diagnostics from the public snapshot instead of inventing a parallel status system. (AC: 1, 2, 3)
  - [x] Add a dedicated server helper under `src/lib/server/ops/` that inspects `meta.snapshotState`, header trust and source signals, local-map status, nearby mode trust and source status, and `disruptionEmphasis` to produce a deterministic diagnostics payload. (AC: 1, 2)
  - [x] Classify each affected area by scope using plain operational categories that map to the public picture: local-only impact, multiple-local-signals impact, or overall departure-picture impact. Reuse `nearbyModes[].disruptionScope` and overall snapshot evidence wherever possible. (AC: 1, 2)
  - [x] Include explicit unaffected-area evidence in the payload so operators can see what remains healthy when one optional or non-core signal narrows trust. (AC: 2)
- [x] Surface the diagnostics through the local-only ops API boundary and keep the contract calm, small, and same-origin. (AC: 1, 2, 3)
  - [x] Extend `src/app/api/ops/health/route.ts` and its response builder, or add a tightly related ops-only read helper behind the same route, so the existing local-only endpoint returns readiness plus degraded-impact diagnostics. (AC: 1, 3)
  - [x] Preserve the Story 3.1 access gate by reusing `assertOpsAccess` and failing closed with no maintenance disclosure for denied contexts. (AC: 3)
  - [x] Return plain-language diagnostics only: affected signal or source label, current trust or source state, impact scope, and concise "what remains healthy" notes with no raw payloads, stack traces, exception strings, or credentials. (AC: 1, 2, 3)
- [x] Add a dedicated diagnostics area to the ops surface that makes scope obvious without turning the page into a control-room dashboard. (AC: 1, 2, 3)
  - [x] Extend `src/features/ops/components/OpsShell.tsx` and supporting ops view modules so the system-checks area shows degraded diagnostics in keyboard-safe order under the existing readiness summary. (AC: 1, 3)
  - [x] Present each degraded signal as a calm operational diagnostic card or list row with the affected area, its current trust state, and whether the impact is local or overall. (AC: 1)
  - [x] Include a clearly separated "still healthy" or "unaffected" summary when only one feed or component is narrowed, so operators can judge continued public service honestly. (AC: 2)
  - [x] Keep all copy fact-only and operationally useful. Do not expose provider names unless they are already safe public-facing source labels in the snapshot contract. (AC: 3)
- [x] Protect the feature with regression coverage grounded in current public snapshot contracts. (AC: 1, 2, 3)
  - [x] Add unit tests for diagnostics derivation covering single local degradation, multiple local degradations, optional-feed failure with healthy core signals, and overall-picture impact. (AC: 1, 2)
  - [x] Add endpoint coverage proving the local-only ops API returns the expected diagnostics shape and never exposes raw technical output on degraded or unavailable reads. (AC: 1, 3)
  - [x] Update ops-shell coverage so the UI renders the affected signal, impact scope, and unaffected-area summary in plain language and keyboard-safe structure. (AC: 1, 2, 3)
  - [x] Keep the verification path compatible with `npm run validate`. (AC: 1, 2, 3)

## Dev Notes

### Developer Context

- Story 3.3 extends the local-only ops path created in Story 3.1 and the readiness model created in Story 3.2. It should deepen operational clarity, not replace the current model.
- The implemented seam to build on already exists:
  - `src/lib/server/ops/get-ops-health.js` derives the current readiness payload from the public dashboard response.
  - `src/app/api/ops/health/route.ts` is the current local-only read endpoint.
  - `src/lib/server/ops/create-ops-health-route-response.js` already applies `assertOpsAccess`.
  - `src/features/ops/components/OpsShell.tsx` and `src/features/ops/ops-shell-view.js` already render the keyboard-safe ops summary.
- The public snapshot already contains the signal-level evidence this story needs:
  - `headerTrust.weather` and `headerTrust.mobility`
  - `headerStatus.weather` and `headerStatus.mobility`
  - `localMap.sourceStatus`
  - `nearbyModes[].trust`
  - `nearbyModes[].sourceStatus`
  - `nearbyModes[].disruptionScope`
  - `disruptionEmphasis.level`, `headline`, `detail`, and `affectedModeKeys`
- Scope discipline matters:
  - Story 3.2 owns current versus reduced-confidence versus unavailable readiness.
  - Story 3.3 owns signal-level degraded diagnostics and impact scope.
  - Story 3.4 owns refresh or trust-check actions.
  - Story 3.5 owns restart or interruption recovery.
- The diagnostics should therefore explain trust narrowing and blast radius, but should not trigger actions, restart flows, or expose implementation-only internals.

### Technical Requirements

- Derive diagnostics from the same public snapshot and response metadata already used for readiness.
  - do not query providers directly from the ops surface
  - do not create a second independent health taxonomy
  - do not duplicate freshness logic outside the existing contracts without a strong reason
- The operator needs three things from this story:
  - which signal or source is degraded
  - whether the impact is local or overall
  - what remains healthy enough for continued public use
- Treat the public snapshot as the source of truth for scope:
  - use `nearbyModes[].disruptionScope` to distinguish unaffected-readable, locally-disrupted, and overall-disrupted mode impact
  - use `disruptionEmphasis` when the overall departure picture is visibly under strain
  - use trust and source-status fields to distinguish carried-forward, stale, delayed, reduced-confidence, and unavailable evidence
- Optional-feed failure is a first-class negative path:
  - when one optional signal narrows or drops out, the diagnostics must show the affected area clearly
  - unaffected core areas must be listed as still healthy or still readable
  - the diagnostics must support an honest "remain in service" judgment instead of collapsing to a global failure message
- Keep all operator copy calm and plain:
  - acceptable language: "carried forward", "reduced confidence", "temporarily unavailable", "affects the overall picture", "other signals remain healthy"
  - unacceptable language: raw exception text, provider payload dumps, stack traces, token names, or engineering-only jargon
- The public route must remain unchanged and passive. This story belongs in ops modules, the ops route tree, and the ops API.

### Architecture Compliance

- Follow the approved architecture boundaries:
  - ops UI in `src/features/ops/*`
  - ops route entry in `src/app/(ops)/ops/*`
  - ops-only endpoint logic in `src/app/api/ops/*`
  - server derivation in `src/lib/server/ops/*`
  - access control in `src/lib/server/security/*`
- Reuse the modular-monolith contract-first pattern:
  - route files stay thin
  - server helpers derive calm JSON payloads
  - UI modules render presenter or view-model output
  - no UI code calls external providers
- Stay aligned with architecture decisions already in force:
  - same-origin internal APIs only
  - no public write endpoints
  - server-only secret handling
  - structured, fact-only degraded-state handling
  - public and ops route trees remain separate
- Preserve the product doctrine in the ops surface too:
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
  - Next.js App Router docs continue to support route handlers for internal endpoints, so extending the existing local-only ops route remains the right boundary: https://nextjs.org/docs/app/getting-started/route-handlers
  - React's official `'use client'` guidance still requires server-to-client boundaries to use serializable values, reinforcing that request-derived access decisions and diagnostics derivation stay on the server: https://react.dev/reference/rsc/use-client
  - TanStack Query's current React docs still support the same array query-key pattern already called out in architecture if a later client polling wrapper is needed for `['ops', 'health']`: https://tanstack.com/query/latest/docs/framework/react/overview
  - Node's official release page lists `v24` as Active LTS as of 2026-03-19, matching the repo engine contract: https://nodejs.org/en/about/previous-releases
  - Zod's official docs state that Zod 4 is stable, so any added ops diagnostics schema should stay on the current line instead of introducing a new validation library: https://zod.dev/
- Inference from those sources: implement Story 3.3 inside the existing Next.js 16 app-route and server-helper shape, with small typed JSON extensions rather than a new service or client-derived diagnostics layer.

### File Structure Requirements

- Expected files to update:
  - `src/lib/server/ops/get-ops-health.js`
  - `src/lib/server/ops/create-ops-health-route-response.js`
  - `src/app/api/ops/health/route.ts`
  - `src/features/ops/components/OpsShell.tsx`
  - `src/features/ops/ops-shell-view.js`
  - `src/features/ops/ops-shell-content.js`
- Expected files to add:
  - a focused diagnostics helper under `src/lib/server/ops/` such as `get-degraded-impact-diagnostics.js` if `get-ops-health.js` becomes too large
  - targeted tests under `tests/unit` for diagnostics derivation, route response shape, and ops UI rendering
- Files to reuse rather than bypass:
  - `src/lib/contracts/dashboard-snapshot.js`
  - `src/lib/contracts/freshness.js`
  - `src/lib/server/dashboard/dashboard-service.js`
  - `src/lib/server/security/assert-ops-access.js`
- Naming rules already established in the repo still apply:
  - `PascalCase.tsx` for components
  - `kebab-case` for non-component modules
  - thin route files and server-only derivation helpers

### Testing Requirements

- Minimum verification for implementation:
  - `npm run lint`
  - `npm run typecheck`
  - `npm test`
  - `npm run build`
- Add focused tests for:
  - a single degraded signal with local-only impact
  - multiple degraded signals where unaffected areas still remain healthy
  - optional-feed failure that keeps core display evidence serviceable
  - an overall-picture impact state driven by disruption emphasis and broad signal degradation
  - local-only gating for the ops health endpoint after diagnostics are added
  - calm output with no raw technical leakage
  - keyboard-safe diagnostics rendering in the ops shell
- Keep fixtures grounded in the existing dashboard snapshot builders and contracts so the tests enforce the real product shape.
- Do not expand this story's tests into refresh execution or restart orchestration. Those belong to Stories 3.4 and 3.5.

### Previous Story Intelligence

- Story 3.1 established the non-negotiable access and separation rules:
  - server-side access check first
  - local-only allowlist reuse
  - non-leaky denial behavior
  - public route remains free of maintenance controls
- Story 3.2 established the current extension point:
  - `get-ops-health.js` already gathers attention-worthy trust and source signals
  - the ops shell already has a stable system-checks section and calm status styling
  - the route and response builder already centralize local-only access handling
- Strong implication for Story 3.3:
  - extend the existing payload and ops shell rather than creating a second diagnostics page
  - derive signal-level scope from current snapshot evidence instead of duplicating business rules
  - keep the output plain enough for venue staff but specific enough to show blast radius

### Git Intelligence Summary

- Recent Epic 3 commits show the implementation pattern to preserve:
  - `93e5912 feat(epic-3): implement 3-2-show-public-readiness-and-current-ops-state`
  - `9eb1adf feat(epic-3): implement 3-1-provide-a-separate-local-only-ops-access-surface`
- Actionable implications from those commits and artifacts:
  - continue using focused server helpers instead of overloading route files
  - keep ops work inside the existing route tree and feature modules
  - protect new behavior with unit and smoke-style coverage
  - treat the public snapshot as the only trustworthy read model for ops summaries

### Latest Tech Information

- Official-source checks on 2026-03-19 did not surface any stack change that would alter implementation direction:
  - Next.js route handlers remain the correct internal endpoint boundary.
  - React still favors server-derived security and request-context decisions.
  - TanStack Query still supports the repo's query-key conventions for future polling if needed.
  - Node `v24` remains Active LTS.
  - Zod 4 remains the stable schema line.
- Inference: the safest implementation is to add a compact diagnostics extension to the current ops health flow, not to introduce a new framework concern.

### Project Structure Notes

- No `project-context.md` file is present in this repo, so rely on the planning artifacts plus the implemented Epic 3 source files.
- The biggest implementation trap is conflating degraded evidence with service failure:
  - wrong approach: any narrowed signal forces a global unavailable state
  - right approach: show the affected signal, classify the impact scope, and explicitly preserve healthy areas when the overall picture remains serviceable
- The second trap is overexposing internal detail:
  - wrong approach: dump provider or exception information into ops diagnostics
  - right approach: render trust-and-scope language already supported by the snapshot contracts

### References

- `docs/epics.md#Story 3.3: Diagnose Degraded Impact by Signal and Scope`
- `docs/prd.md` sections covering FR32, NFR16, NFR18, NFR19, NFR20, NFR27, and NFR28
- `docs/architecture.md` sections covering health and status endpoints, source-freshness telemetry, contract-first server derivation, and separate public versus ops route trees
- `docs/ux-design-specification.md` sections covering venue operators, calm feedback patterns, plain-language trust cues, and keyboard-safe staff-only views
- `docs/sprint-artifacts/3-1-provide-a-separate-local-only-ops-access-surface.md`
- `docs/sprint-artifacts/3-2-show-public-readiness-and-current-ops-state.md`
- `src/lib/server/ops/get-ops-health.js`
- `src/lib/server/ops/create-ops-health-route-response.js`
- `src/app/api/ops/health/route.ts`
- `src/features/ops/components/OpsShell.tsx`
- `src/features/ops/ops-shell-view.js`
- `src/features/ops/ops-shell-content.js`
- `src/lib/contracts/dashboard-snapshot.js`
- `src/lib/contracts/freshness.js`
- `src/lib/server/dashboard/dashboard-service.js`

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- Create-story workflow executed in autonomous mode on 2026-03-19.
- Story context derived from `docs/epics.md`, `docs/prd.md`, `docs/architecture.md`, `docs/ux-design-specification.md`, `docs/sprint-artifacts/3-1-provide-a-separate-local-only-ops-access-surface.md`, `docs/sprint-artifacts/3-2-show-public-readiness-and-current-ops-state.md`, and the current Epic 3 source files under `src/lib/server/ops`, `src/features/ops`, and `src/lib/contracts`.
- Implemented diagnostics derivation in `src/lib/server/ops/get-degraded-impact-diagnostics.js`, extended the ops health payload and ops shell presentation, and verified the repo with `npm run validate` on 2026-03-19.

### Completion Notes List

- Added deterministic degraded-impact diagnostics derived from the public snapshot, including scope classification and explicit healthy-area evidence for partial failures.
- Extended the local-only ops health payload to return calm diagnostics alongside readiness without changing the existing same-origin access boundary or leaking raw technical detail.
- Added a dedicated ops-shell diagnostics block that shows affected areas, impact scope, and still-healthy evidence directly under the readiness summary in keyboard-safe order.
- Added regression coverage for single-signal, multiple-local, optional-feed, and overall-picture degradation scenarios plus route and ops-shell contract coverage.
- Verified the implementation with `npm run validate`.
- Code review fixes now ensure `disruptionEmphasis.affectedModeKeys` can surface impact diagnostics even before trust labels narrow, fallback reads no longer over-claim healthy areas, and the ops-shell view model tolerates partial diagnostics payloads safely.

### File List

- docs/sprint-artifacts/3-3-diagnose-degraded-impact-by-signal-and-scope.md
- docs/sprint-artifacts/sprint-status.yaml
- src/app/globals.css
- src/features/ops/components/OpsShell.tsx
- src/features/ops/ops-shell-view.js
- src/lib/server/ops/get-degraded-impact-diagnostics.js
- src/lib/server/ops/get-ops-health.js
- tests/unit/ops-health.test.mjs
- tests/unit/ops-shell.test.mjs

## Change Log

- 2026-03-19: Implemented degraded-impact diagnostics across the ops health payload and shell, added healthy-area evidence, and expanded regression coverage for the local-only ops surface.
- 2026-03-19: Senior code review fixed disruption-emphasis coverage gaps, removed misleading fallback healthy-area claims, hardened diagnostics normalization in the ops shell, and re-verified with `npm run validate`.

## Senior Developer Review (AI)

### Outcome

Approve

### Findings Fixed

- Medium: `src/lib/server/ops/get-degraded-impact-diagnostics.js` ignored `disruptionEmphasis.affectedModeKeys` unless trust or source labels had already degraded, so affected modes could disappear from diagnostics even when the public picture already flagged them as strained.
- Medium: `src/lib/server/ops/get-degraded-impact-diagnostics.js` still emitted "healthy" confirmations when `meta.snapshotState` was `fallback`, which overstated operator confidence on reads the system itself could not fully confirm.
- Medium: `src/features/ops/ops-shell-view.js` only defaulted when `diagnostics` was entirely absent; partial payloads could leak blank labels/details into the UI instead of staying calm and bounded.

### Verification

- `npm run validate`

## Epic 4 External Review Rerun

### Date

2026-03-19

### Source Recovery

- Story 4.4 did not recover a standalone external adversarial findings artifact for Story `3.3` from approved planning artifacts, remediation records, or repo session logs.

### Rerun Review Evidence

- Inspected `src/lib/server/ops/get-degraded-impact-diagnostics.js` and the degraded-impact coverage in `tests/unit/ops-health.test.mjs`.
- Confirmed diagnostics scope classification, affected-area summaries, and healthy-area evidence remain evidence-backed and free of new external-review defects.

### Decision

- No-code / no-action after rerun external adversarial review.
- Story `3.3` remains `done`; no story-level `4.5` re-close work is required for Story `3.3`.

### Validation Evidence

- Story 4.4 traceability synced in `docs/sprint-artifacts/external-adversarial-remediation-register.md` and `docs/sprint-artifacts/sprint-status.yaml`.
- Story 4.4 verification reran the focused Epic 3 unit suite and then `npm run validate`.
