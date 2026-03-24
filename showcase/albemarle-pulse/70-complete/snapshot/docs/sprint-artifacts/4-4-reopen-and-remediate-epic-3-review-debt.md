# Story 4.4: Reopen and Remediate Epic 3 Review Debt

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As the project team,
I want the Epic 3 stories implicated by unresolved external-review candidate debt reassessed, and reopened only if rerun review or recovered evidence requires it,
so that ops access, readiness, diagnostics, maintenance actions, and restart recovery can close with explicit external review evidence.

## Acceptance Criteria

1. Given Story 4.1 and the remediation register leave the Epic 3 candidate set unresolved because standalone external outputs were not recovered, when Story 4.4 begins, then candidate stories `3.1`, `3.2`, `3.3`, `3.4`, and `3.5` are treated as the only Epic 3 remediation scope, and no Epic 1 or Epic 2 story is reopened by this story.
2. Given Epic 3 candidate stories may have internal BMAD review closure but not separate external closure evidence, when remediation work starts, then each candidate story is either reopened from `done` to `review` or `in-progress` with an evidence-backed remediation path or explicitly recorded as no-code or no-action after rerun external adversarial review, and every decision is written back to the remediation register and the affected story artifact.
3. Given code or artifact remediation is required for an Epic 3 candidate story, when changes are applied, then local-only ops access, readiness honesty, degraded-impact scope clarity, maintenance-action boundedness, and restart-recovery semantics remain calm, server-owned, and free of public debug or admin leakage, and the story artifact records the external finding source or rerun-review evidence, remediation summary, file list, and validation evidence.
4. Given Epic 3 remediation is ready for handoff to final closure, when Story 4.4 is completed, then the remediation register, affected Story `3.x` artifacts, and sprint tracking all identify which Epic 3 stories still require Story `4.5` re-review and re-close work, and no unaffected story has been reopened.

## Tasks / Subtasks

- [x] Recover or rerun external adversarial review for the Epic 3 candidate stories `3.1`, `3.2`, `3.3`, `3.4`, and `3.5`. (AC: 1, 2)
  - [x] Attempt to recover missing external source evidence from approved planning artifacts, remediation records, and session history; if insufficient, run a fresh external adversarial review for each Epic 3 candidate story rather than inferring from internal BMAD traces alone. (AC: 2)
  - [x] Record a per-story decision in the remediation register for `3.1`, `3.2`, `3.3`, `3.4`, and `3.5`: reopened for remediation, no-code or no-action after rerun review, or blocked by missing evidence. (AC: 1, 2)
  - [x] Keep Epic 1 and Epic 2 outside Story 4.4 scope unless genuinely new external evidence expands the remediation set. (AC: 1, 4)
- [x] Resolve Epic 3 story state before any code changes, reopening only if evidence requires it and otherwise recording explicit no-code closure. (AC: 1, 2, 4)
  - [x] Update the affected Story `3.1`, `3.2`, `3.3`, `3.4`, and `3.5` artifacts plus `docs/sprint-artifacts/sprint-status.yaml` to reflect reopened status if needed, or explicit no-code or no-action closure without altering non-implicated stories. (AC: 2, 4)
  - [x] Capture the specific external finding or rerun-review reason in each Epic 3 candidate story decision before implementation changes begin. (AC: 2)
- [x] Apply remediation to the canonical Epic 3 implementation paths only where evidence requires it, or record the no-code outcome when none is required. (AC: 3)
  - [x] Fix only evidence-backed issues in the local-only ops boundary, readiness derivation, degraded-impact diagnostics, maintenance-action flow, restart-recovery path, and targeted tests used by Stories `3.1`, `3.2`, `3.3`, `3.4`, and `3.5`, or record that no code remediation was required for the rerun-cleared scope. (AC: 3)
  - [x] Preserve calm operational copy, same-origin internal API boundaries, keyboard-safe ops behavior, bounded maintenance actions, and truthful carried-forward recovery semantics while remediating. (AC: 3)
  - [x] Do not introduce public ops controls, process-manager UI, provider-payload leakage, route-local security decisions, or a second ops-health taxonomy while remediating Epic 3 candidate stories. (AC: 3)
- [x] Update remediation evidence and prepare Epic 3 stories for Story `4.5` closure gates. (AC: 2, 3, 4)
  - [x] Update the remediation register with remediation summaries, evidence links, and remaining closure state for each Epic 3 candidate story. (AC: 2, 4)
  - [x] Update each affected Story `3.x` artifact with finding source or rerun external review reference, remediation summary, validation evidence, and current reopen state. (AC: 3, 4)
  - [x] Make the handoff to Story `4.5` explicit for every reopened Epic 3 story that still needs internal review, external adversarial review confirmation, or final closure sync, or record when no Epic 3 handoff remains after rerun review. (AC: 4)
- [x] Verify Epic 3 remediation scope and integrity before Story 4.4 is closed. (AC: 1, 3, 4)
  - [x] Run `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build` if code changes were made; otherwise run an artifact-integrity pass proving the no-code decisions are evidence-backed. (AC: 3)
  - [x] Confirm the remediation register, affected Story `3.x` files, and `docs/sprint-artifacts/sprint-status.yaml` agree on candidate scope, reopened status, and remaining Story `4.5` owner path. (AC: 4)
  - [x] Verify no unaffected story was reopened or relabeled during this remediation story. (AC: 1, 4)

## Dev Notes

### Developer Context

- Story 4.4 exists because Story 4.1 and the remediation register did not recover standalone external adversarial findings text for Epic 3, but they did preserve the approved Epic 3 candidate set that must remain visible until disproved or rerun through external review.
- The current evidence boundary is already defined:
  - `docs/sprint-artifacts/external-adversarial-remediation-register.md` leaves Epic 3 stories `3.1`, `3.2`, `3.3`, `3.4`, and `3.5` as unresolved candidate stories pending source recovery or rerun external review.
  - `docs/sprint-artifacts/sprint-status.yaml` exposes that candidate set under `review_debt_status.candidate_story_ids.epic-3` and routes ownership to Story `4.4`, with Story `4.5` still required for any remaining re-close path.
  - Story `4.3` already cleared the Epic 2 candidate set through rerun external review, so Story 4.4 should treat Epic 3 as the remaining story-level remediation scope.
- Strong implication: Story 4.4 is not licensed to reopen all prior work or to infer separate external debt from internal BMAD code-review traces.
- The implementation must respect the distinction between:
  - unresolved external-review candidate debt for `3.1`, `3.2`, `3.3`, `3.4`, and `3.5`
  - already-closed internal BMAD review history recorded in the original Story `3.x` artifacts
- Product and architecture context for the candidate stories:
  - Story `3.1` owns the local-only ops boundary, keyboard-safe shell, and non-leaky denied-access behavior
  - Story `3.2` owns the operator-facing readiness model derived from the public snapshot
  - Story `3.3` owns degraded-impact diagnostics and healthy-area evidence
  - Story `3.4` owns the bounded `refresh` and `trust-check` maintenance path
  - Story `3.5` owns restart-aware carried-forward recovery semantics and operator confirmation after cold start
- These five stories already define the canonical Epic 3 ops and recovery path:
  - local-only ops route entry under `src/app/(ops)/ops/*`
  - local-only ops APIs under `src/app/api/ops/*`
  - server-only access and ops derivation under `src/lib/server/security/*` and `src/lib/server/ops/*`
  - restart and snapshot orchestration under `src/lib/server/dashboard/*` and `src/lib/server/cache/*`
  - thin ops UI composition under `src/features/ops/*`
- Scope boundaries for Story 4.4:
  - do not create a second ops console, public maintenance control, or remediation-only route tree
  - do not relitigate Epic 3 stories without evidence; either recover the external source, rerun external adversarial review, or explicitly record a no-code decision
  - do not reopen Epic 1 or Epic 2 stories unless genuinely new external evidence expands scope
  - do not weaken the calm venue-maintenance doctrine while remediating readiness, diagnostics, actions, or restart recovery
- Success for Story 4.4 is not “force every Epic 3 candidate story to change code.” Success is:
  - each Epic 3 candidate story has an evidence-backed decision
  - any reopened story has a precise remediation path tied to external review evidence or rerun review output
  - unaffected stories remain closed
  - Story `4.5` receives an explicit handoff state for every Epic 3 candidate story

### Technical Requirements

- Start from evidence, not suspicion.
  - use the Story 4.1 remediation register as the source of candidate scope
  - for each of `3.1`, `3.2`, `3.3`, `3.4`, and `3.5`, either recover the missing external finding source or run a fresh external adversarial review before deciding whether code changes are needed
  - do not infer separate external debt from internal `Senior Developer Review (AI)` sections, change-log notes, or BMAD session traces alone
- Preserve Epic 3’s canonical semantics while remediating:
  - Story `3.1` must keep ops access deny-by-default, local-only, keyboard-safe, and non-leaky
  - Story `3.2` must keep readiness derived from the public snapshot with only `current`, `reduced-confidence`, and `unavailable` as the operator-facing readiness states
  - Story `3.3` must keep diagnostics grounded in signal-level trust evidence and explicit healthy-area context rather than raw provider or exception output
  - Story `3.4` must keep maintenance actions bounded to `refresh` and `trust-check`, same-origin, and calm in both success and failure
  - Story `3.5` must keep carried-forward restart recovery explicit, truthful, and separate from a fully resumed live publish
- If remediation changes code, keep the change surface narrow and evidence-backed:
  - patch only the ops route, ops API, server ops helpers, dashboard recovery path, presenter or hook seams, and targeted tests directly implicated by the rerun external review output
  - reuse existing snapshot, readiness, diagnostics, and maintenance-action primitives instead of inventing remediation-specific abstractions
  - preserve the current calm ops shell and the unchanged public route posture
- Treat artifact traceability as part of the implementation:
  - every Epic 3 candidate story must end this story with a documented decision
  - reopened stories must record the external source or rerun-review evidence that justified reopening
  - no-code or no-action decisions must still be written back to the remediation register and story artifact with rationale
- Keep the operator experience fact-only and venue-native throughout remediation.
  - avoid provider payload dumps, stack traces, process-control jargon, admin leakage, route-local security guesses, or control-room density

### Architecture Compliance

- Stay within the existing modular-monolith and feature-first conventions:
  - local-only ops route entry under `src/app/(ops)/ops/*`
  - local-only ops APIs under `src/app/api/ops/*`
  - server-only ops and recovery derivation under `src/lib/server/ops/*`, `src/lib/server/dashboard/*`, and `src/lib/server/cache/*`
  - access control under `src/lib/server/security/*`
  - thin ops UI composition under `src/features/ops/*`
- Preserve one canonical ops and recovery truth model.
  - do not add a second readiness taxonomy
  - do not move security, readiness, diagnostics, or recovery semantics into route-local or client-only React code
  - do not create a remediation-only console, restart-only public route, or a second maintenance-action path
- Keep Story 4.4 focused on Epic 3 candidate behavior only.
  - do not drift into Epic 1 or Epic 2 concerns
  - do not add process-manager controls, provider toggles, or public-facing maintenance affordances
- Respect the architecture rule that runtime-generated data stays outside committed source structure.
  - committed planning and remediation artifacts belong under `docs/sprint-artifacts/*`
  - runtime snapshot files under `runtime/snapshots/*` may be read for context but should not become ad hoc planning artifacts

### Library / Framework Requirements

- Stay aligned with the repo-pinned baseline when executing remediation:
  - `next` `16.1.7`
  - `react` `19.2.3`
  - `react-dom` `19.2.3`
  - `@tanstack/react-query` `^5.0.0`
  - `zod` `^4.3.6`
  - `node` `24.x`
  - local `vitest` package under `tools/vitest-lite`
- Do not add new state, ops-console, retry orchestration, or runtime-management libraries for Story 4.4.
- Official-source checks completed on 2026-03-19:
  - Next.js route handlers remain the documented server boundary for internal app endpoints, reinforcing that Epic 3 remediation should stay inside the existing `app/**/route.ts` model rather than creating a new service boundary: https://nextjs.org/docs/app/getting-started/route-handlers
  - TanStack Query’s current React docs still provide the existing query and mutation primitives, which supports keeping the current ops query and maintenance-action pattern rather than introducing a different client state layer: https://tanstack.com/query/latest/docs/framework/react/reference/useMutation
  - React’s `'use client'` guidance still requires serializable props across the server/client boundary, which matters for the ops shell and confirms that access control plus readiness or recovery derivation should remain server-owned: https://react.dev/reference/rsc/use-client
  - Node’s official releases page still shows the `v24` line as available, and the repo remains pinned to `24.x`; Story 4.4 should preserve that runtime contract rather than folding in an upgrade: https://nodejs.org/en/about/previous-releases
  - Zod 4 remains the stable validation line for shared contracts: https://zod.dev/v4
  - Vitest’s current guide still supports `Node >= v20.0.0`, which remains compatible with the repo’s `24.x` engine contract for focused regression tests: https://vitest.dev/guide/
  - Playwright’s current writing-tests guide still emphasizes action-plus-assertion flows and user-facing outcomes, which remains relevant if later closure work expands browser-level checks, though Story 4.4 should stay mainly artifact and regression focused: https://playwright.dev/docs/writing-tests
- Inference from those sources: Story 4.4 should reuse the existing Epic 3 codepaths and test stack rather than introducing any new runtime or tooling layer.

### File Structure Requirements

- Expected primary artifacts to add or update:
  - `docs/sprint-artifacts/4-4-reopen-and-remediate-epic-3-review-debt.md`
  - `docs/sprint-artifacts/external-adversarial-remediation-register.md`
  - `docs/sprint-artifacts/sprint-status.yaml`
  - affected Epic 3 story artifacts only if they are evidence-backed reopened candidates:
    - `docs/sprint-artifacts/3-1-provide-a-separate-local-only-ops-access-surface.md`
    - `docs/sprint-artifacts/3-2-show-public-readiness-and-current-ops-state.md`
    - `docs/sprint-artifacts/3-3-diagnose-degraded-impact-by-signal-and-scope.md`
    - `docs/sprint-artifacts/3-4-trigger-lightweight-refresh-and-trust-check-actions.md`
    - `docs/sprint-artifacts/3-5-recover-the-display-after-interruption-or-restart.md`
- Code files that may be legitimately touched only if rerun external review produces evidence-backed defects:
  - ops route and API files under `src/app/(ops)/ops/*` and `src/app/api/ops/*`
  - server-only ops and recovery modules under `src/lib/server/security/*`, `src/lib/server/ops/*`, `src/lib/server/dashboard/*`, and `src/lib/server/cache/*`
  - ops UI and dashboard seams under `src/features/ops/*` and the minimal public/dashboard hooks or presenter files already used by Epic 3
  - focused Epic 3 regression tests under `tests/unit/*` and `tests/smoke/*`
- Existing artifacts to inspect and reference:
  - `docs/sprint-change-proposal-2026-03-19.md`
  - `docs/sprint-artifacts/4-1-audit-external-adversarial-findings-and-map-them-to-story-ids.md`
  - `docs/sprint-artifacts/external-adversarial-remediation-register.md`
  - `docs/sprint-artifacts/epic-3-retro-2026-03-19.md`
  - `docs/sprint-artifacts/3-1-provide-a-separate-local-only-ops-access-surface.md`
  - `docs/sprint-artifacts/3-2-show-public-readiness-and-current-ops-state.md`
  - `docs/sprint-artifacts/3-3-diagnose-degraded-impact-by-signal-and-scope.md`
  - `docs/sprint-artifacts/3-4-trigger-lightweight-refresh-and-trust-check-actions.md`
  - `docs/sprint-artifacts/3-5-recover-the-display-after-interruption-or-restart.md`
- Do not create ambiguous new artifacts like `epic-3-review-notes.md`, a second remediation register, or a public recovery checklist outside the canonical Epic 4 artifact set.

### Testing Requirements

- Minimum verification if code changes are made:
  - `npm run lint`
  - `npm run typecheck`
  - `npm test`
  - `npm run build`
- Minimum verification if no code changes are made for one or more candidate stories:
  - prove the no-code or no-action decision came from recovered external evidence or rerun external adversarial review
  - update the remediation register and affected story artifacts so the decision path is explicit
  - confirm sprint tracking still matches the candidate scope and Story `4.5` handoff state
- If Story `3.1` is remediated, tests must protect:
  - deny-by-default local-only access
  - non-leaky denied responses
  - separation between public and ops route trees
- If Story `3.2` is remediated, tests must protect:
  - readiness staying bound to the public snapshot and required checks
  - calm issue reporting with no raw internals
  - no silent expansion beyond `current`, `reduced-confidence`, and `unavailable`
- If Story `3.3` is remediated, tests must protect:
  - diagnostics scope classification
  - explicit healthy-area evidence where appropriate
  - no misleading healthy claims during fallback or unavailable states
- If Story `3.4` is remediated, tests must protect:
  - only `refresh` and `trust-check` being accepted
  - duplicate in-flight action prevention
  - bounded calm action results and preserved last-known ops context on failure
- If Story `3.5` is remediated, tests must protect:
  - honest carried-forward recovery semantics on cold start
  - resumed-live clearing after fresh publication
  - unchanged public-shell composition with no recovery-tool leakage
- Treat artifact consistency as part of the acceptance bar:
  - remediation register, reopened Story `3.x` files, and `sprint-status.yaml` must agree on scope and current state
  - no unaffected story may be relabeled during this story

### Previous Story Intelligence

- Story `4.3` is the immediate continuity source for Story `4.4`, and it establishes the corrected Epic 4 pattern to preserve:
  - rerun external review is valid when standalone external findings text cannot be recovered
  - internal BMAD review traces are contextual evidence only and must not be treated as standalone external findings
  - candidate scope must stay limited to the set preserved in the remediation register and sprint tracking
  - a no-code or no-action outcome is valid if rerun review clears the candidate story with evidence
- Critical carry-forward from Stories `4.1` and `4.3`:
  - Epic 3 scope is limited to candidate stories `3.1`, `3.2`, `3.3`, `3.4`, and `3.5`
  - Epic 2 has already been cleared through Story `4.3`
  - release readiness remains blocked on Epic 4 until the Epic 3 candidate set receives explicit evidence-backed closure
  - Story `4.5` remains the only valid story-level path for any remaining re-review and re-close work after Story `4.4`
- Implementation implication:
  - Story `4.4` must start by recovering the missing external source or rerunning external adversarial review
  - if rerun review clears a candidate story with no code change, that decision is valid, but it must be written back into the remediation register and story artifact
  - if rerun review finds a real defect, reopen only the implicated story and patch the established Epic 3 implementation path rather than broadly reworking the ops surface
- Epic 3’s original story artifacts already contain the strongest technical context for likely remediation surfaces:
  - `3.1` for local-only access and route separation
  - `3.2` for readiness classification and calm issue reporting
  - `3.3` for degraded-impact scope classification and healthy-area evidence
  - `3.4` for bounded maintenance-action semantics
  - `3.5` for restart-aware carried-forward recovery and resumed-live semantics

### Git Intelligence Summary

- Recent commit history shows Epic 3 was the last completed implementation stream:
  - `3cc4ef6 feat(epic-3): implement 3-5-recover-the-display-after-interruption-or-restart`
  - `3a6ec9f feat(epic-3): implement 3-4-trigger-lightweight-refresh-and-trust-check-actions`
  - `8a12ce8 feat(epic-3): implement 3-3-diagnose-degraded-impact-by-signal-and-scope`
  - `93e5912 feat(epic-3): implement 3-2-show-public-readiness-and-current-ops-state`
  - `9eb1adf feat(epic-3): implement 3-1-provide-a-separate-local-only-ops-access-surface`
- Actionable implication: Story `4.4` is remediation and evidence-restoration work after delivery, not a continuation of an unfinished Epic 3 branch.
- Current working-tree changes include Epic 4 planning artifacts plus unrelated runtime or log updates:
  - `docs/epics.md`
  - `docs/sprint-artifacts/2-2-show-trend-and-freshness-where-confidence-matters.md`
  - `docs/sprint-artifacts/2-4-preserve-honest-usefulness-during-provider-failure.md`
  - `docs/sprint-artifacts/2-5-maintain-stable-live-reading-during-updates-and-motion-changes.md`
  - `docs/sprint-artifacts/3-1-provide-a-separate-local-only-ops-access-surface.md`
  - `docs/sprint-artifacts/sprint-status.yaml`
  - `logs/ralph-20260319-100642.log`
  - `runtime/snapshots/dashboard-history.json`
  - `runtime/snapshots/dashboard-recovery.json`
- Strong implication for implementation:
  - treat the existing Story `3.x` artifacts, runtime files, and logs as historical evidence
  - do not revert unrelated working-tree changes while remediating Epic 3 review debt
  - expect any real code changes to be narrow follow-ups inside already-established Epic 3 files

### Latest Tech Information

- Official-source checks on 2026-03-19 did not surface any stack change that alters the remediation direction for Story `4.4`.
  - Next.js route handlers remain the correct boundary for internal app endpoints, so Epic 3 remediation should stay inside the existing route-handler plus server-module architecture.
  - TanStack Query still supports the existing query and mutation primitives already used by the ops shell, so Story `3.4` or `3.5` remediation should refine the current path rather than replace it.
  - React still requires serializable props across the server/client boundary, which matters if Epic 3 remediation touches ops-shell data crossing from server-owned derivation into client components.
  - Node `24.x`, Zod `v4`, and the repo’s local Vitest setup remain aligned with current official guidance.
  - Playwright remains relevant if later Story `4.5` closure work adds stronger browser-level regression checks, but Story `4.4` should remain focused on artifacts and targeted regression coverage.
- Inference: there is no technical justification to introduce new frameworks, alternate state models, or new service layers for Story `4.4`.

### Project Structure Notes

- The repo already centralizes planning, remediation, and story evidence under `docs/sprint-artifacts/`; Story `4.4` should extend that pattern rather than inventing a second remediation tracker.
- Epic 3 implementation already lives in stable, canonical paths:
  - local-only ops route and APIs under `src/app/(ops)/ops/*` and `src/app/api/ops/*`
  - access, readiness, diagnostics, maintenance, and recovery derivation under `src/lib/server/security/*`, `src/lib/server/ops/*`, `src/lib/server/dashboard/*`, and `src/lib/server/cache/*`
  - thin operator-facing UI composition under `src/features/ops/*`
- The highest-risk structural mistake would be widening Story `4.4` into a generic “re-audit operations” effort. The story should instead answer:
  - what external evidence was recovered or rerun
  - which of `3.1`, `3.2`, `3.3`, `3.4`, and `3.5` actually need remediation
  - what exact code or artifact changes were made
  - what remains for Story `4.5` to re-review and re-close

### References

- `docs/epics.md#Story 4.4: Reopen and Remediate Epic 3 Review Debt`
- `docs/sprint-change-proposal-2026-03-19.md`
- `docs/sprint-artifacts/4-1-audit-external-adversarial-findings-and-map-them-to-story-ids.md`
- `docs/sprint-artifacts/external-adversarial-remediation-register.md`
- `docs/sprint-artifacts/sprint-status.yaml`
- `docs/sprint-artifacts/epic-3-retro-2026-03-19.md`
- `docs/sprint-artifacts/3-1-provide-a-separate-local-only-ops-access-surface.md`
- `docs/sprint-artifacts/3-2-show-public-readiness-and-current-ops-state.md`
- `docs/sprint-artifacts/3-3-diagnose-degraded-impact-by-signal-and-scope.md`
- `docs/sprint-artifacts/3-4-trigger-lightweight-refresh-and-trust-check-actions.md`
- `docs/sprint-artifacts/3-5-recover-the-display-after-interruption-or-restart.md`
- `docs/architecture.md`
- `docs/ux-design-specification.md`
- `package.json`
- official source checked 2026-03-19: `https://nextjs.org/docs/app/getting-started/route-handlers`
- official source checked 2026-03-19: `https://tanstack.com/query/latest/docs/framework/react/reference/useMutation`
- official source checked 2026-03-19: `https://react.dev/reference/rsc/use-client`
- official source checked 2026-03-19: `https://nodejs.org/en/about/previous-releases`
- official source checked 2026-03-19: `https://zod.dev/v4`
- official source checked 2026-03-19: `https://vitest.dev/guide/`
- official source checked 2026-03-19: `https://playwright.dev/docs/writing-tests`

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- `cat _bmad/core/tasks/workflow.xml`
- `cat _bmad/bmm/workflows/4-implementation/create-story/workflow.yaml`
- `cat _bmad/bmm/workflows/4-implementation/create-story/instructions.xml`
- `cat _bmad/bmm/workflows/4-implementation/create-story/template.md`
- `cat _bmad/bmm/workflows/4-implementation/create-story/checklist.md`
- `cat _bmad/bmm/config.yaml`
- `cat docs/sprint-artifacts/sprint-status.yaml`
- `cat docs/epics.md`
- `cat docs/architecture.md`
- `cat docs/ux-design-specification.md`
- `cat docs/prd.md`
- `cat docs/sprint-artifacts/4-1-audit-external-adversarial-findings-and-map-them-to-story-ids.md`
- `cat docs/sprint-artifacts/external-adversarial-remediation-register.md`
- `cat docs/sprint-artifacts/4-3-reopen-and-remediate-epic-2-review-debt.md`
- `cat docs/sprint-artifacts/3-1-provide-a-separate-local-only-ops-access-surface.md`
- `cat docs/sprint-artifacts/3-2-show-public-readiness-and-current-ops-state.md`
- `cat docs/sprint-artifacts/3-3-diagnose-degraded-impact-by-signal-and-scope.md`
- `cat docs/sprint-artifacts/3-4-trigger-lightweight-refresh-and-trust-check-actions.md`
- `cat docs/sprint-artifacts/3-5-recover-the-display-after-interruption-or-restart.md`
- `cat package.json`
- `git log --oneline -5`
- `git diff --stat`
- `find logs -maxdepth 1 -type f | sort`
- `rg --files src/app src/features src/lib tests | rg 'ops|dashboard-service|recovery-state|snapshot-store|publish-dashboard-snapshot|assert-ops-access|dashboard-live|DashboardLiveScreen|useDashboardQuery|dashboard-presenter'`
- `rg -n "3-1-provide-a-separate-local-only-ops-access-surface|3-2-show-public-readiness-and-current-ops-state|3-3-diagnose-degraded-impact-by-signal-and-scope|3-4-trigger-lightweight-refresh-and-trust-check-actions|3-5-recover-the-display-after-interruption-or-restart" docs/sprint-artifacts/external-adversarial-remediation-register.md docs/sprint-artifacts/sprint-status.yaml`
- `sed -n '1,240p' docs/sprint-artifacts/4-4-reopen-and-remediate-epic-3-review-debt.md`
- `sed -n '1,260p' docs/sprint-artifacts/external-adversarial-remediation-register.md`
- `sed -n '1,220p' src/app/api/ops/health/route.ts`
- `sed -n '1,220p' src/app/api/ops/actions/route.ts`
- `sed -n '1,240p' src/lib/server/security/assert-ops-access.js`
- `sed -n '1,320p' src/lib/server/ops/get-ops-health.js`
- `sed -n '1,320p' src/lib/server/ops/get-degraded-impact-diagnostics.js`
- `sed -n '1,320p' src/lib/server/ops/run-ops-maintenance-action.js`
- `sed -n '1,320p' src/lib/server/dashboard/dashboard-service.js`
- `sed -n '1,320p' src/lib/server/dashboard/recovery-state.js`
- `sed -n '1,240p' src/lib/server/ops/create-ops-health-route-response.js`
- `sed -n '1,260p' src/lib/server/ops/create-ops-actions-route-response.js`
- `sed -n '1,260p' src/features/ops/hooks/useOpsHealthQuery.ts`
- `sed -n '1,260p' src/features/ops/hooks/useOpsMaintenanceActionMutation.ts`
- `sed -n '1,260p' tests/unit/ops-access.test.mjs`
- `sed -n '1,260p' tests/unit/ops-health.test.mjs`
- `sed -n '1,260p' tests/unit/ops-maintenance-action.test.mjs`
- `sed -n '1,320p' tests/unit/ops-shell.test.mjs`
- `sed -n '1,260p' tests/unit/ops-query-boundary.test.mjs`
- `sed -n '1,260p' tests/smoke/startup-smoke.test.mjs`
- `sed -n '1,120p' docs/sprint-artifacts/sprint-status.yaml`
- `sed -n '340,430p' docs/sprint-artifacts/external-adversarial-remediation-register.md`
- `node --input-type=module - <<'EOF' ... isAllowedOpsRequest mixed-host check ... EOF`
- `node --input-type=module - <<'EOF' ... getDashboardApiResponse runtime fallback check ... EOF`
- `node --input-type=module -e "import { isAllowedOpsRequest, resolveOpsAccessAllowlist } ... Forwarded header checks ..."`
- `node --input-type=module -e "import { createOpsShellViewModel } ... carried-forward recovery heading check ..."`
- `python3 - <<'PY' ... reopened Epic 3 story-state check in sprint-status.yaml ... PY`
- `npm run test:unit -- --run tests/unit/ops-access.test.mjs tests/unit/ops-health.test.mjs tests/unit/ops-maintenance-action.test.mjs tests/unit/ops-shell.test.mjs tests/unit/dashboard.live-path.test.mjs`
- `npm run validate`

### Completion Notes List

- Story context assembled from Epic 4 planning, sprint tracking, the corrected Story 4.1 audit, the completed Story 4.3 remediation pass, Epic 3 retrospectives and story artifacts, package metadata, repo source structure, git history, and current official framework/testing documentation checked on 2026-03-19.
- Story 4.4 is intentionally scoped to evidence recovery, rerun external review, evidence-backed remediation, and traceable closure decisions for the unresolved Epic 3 candidate set only.
- The story explicitly preserves the Epic 3 canonical ops and restart path and forbids speculative reopening from internal BMAD review traces alone.
- No `project-context.md` file was present during story creation, so planning artifacts, sprint artifacts, implemented story files, package metadata, repo structure, git history, and official docs were used as the governing context.
- Rerun external review did not recover a standalone external findings artifact for Epic 3, so Story 4.4 used evidence-backed rerun review against the actual Epic 3 codepaths and tests.
- Story `3.3` cleared with no code change required after rerun review; Stories `3.1`, `3.2`, `3.4`, and `3.5` required evidence-backed remediation.
- Remediation hardened the local-only host gate against mixed forwarded-host spoofing, preserved standards-compliant `Forwarded` host handling, returned denied ops responses with the same `no-store` and host-varying headers as successful local reads, and separated ordinary runtime carried-forward fallback from true restart recovery semantics all the way through the ops shell.
- Traceability was synced across the Epic 3 story artifacts, the external adversarial remediation register, and sprint tracking so Stories `3.1`, `3.2`, `3.4`, and `3.5` are explicitly reopened to `review` and remain queued for Story `4.5`.
- Focused Epic 3 regression coverage passed before the final repo-wide validation gate, and `npm run validate` then passed end to end.
- The earlier create-story metadata sections below remain as historical planning context; implementation-state truth now lives in the story `Status`, checked tasks, Dev Agent Record, remediation register, and `sprint-status.yaml` per the dev-story workflow edit boundary.
- The File List now includes both direct Story 4.4 writes and the pre-existing dirty worktree files that were intentionally left untouched, so later Story `4.5` review can reconcile the full working-tree context without ambiguity.

### File List

- docs/epics.md
- docs/sprint-artifacts/2-2-show-trend-and-freshness-where-confidence-matters.md
- docs/sprint-artifacts/2-4-preserve-honest-usefulness-during-provider-failure.md
- docs/sprint-artifacts/2-5-maintain-stable-live-reading-during-updates-and-motion-changes.md
- docs/sprint-artifacts/3-1-provide-a-separate-local-only-ops-access-surface.md
- docs/sprint-artifacts/3-2-show-public-readiness-and-current-ops-state.md
- docs/sprint-artifacts/3-3-diagnose-degraded-impact-by-signal-and-scope.md
- docs/sprint-artifacts/3-4-trigger-lightweight-refresh-and-trust-check-actions.md
- docs/sprint-artifacts/3-5-recover-the-display-after-interruption-or-restart.md
- docs/sprint-artifacts/4-1-audit-external-adversarial-findings-and-map-them-to-story-ids.md
- docs/sprint-artifacts/4-3-reopen-and-remediate-epic-2-review-debt.md
- docs/sprint-artifacts/4-4-reopen-and-remediate-epic-3-review-debt.md
- docs/sprint-artifacts/epic-3-retro-2026-03-19.md
- docs/sprint-artifacts/external-adversarial-remediation-register.md
- docs/sprint-artifacts/sprint-status.yaml
- docs/sprint-change-proposal-2026-03-19.md
- logs/ralph-20260319-100642.log
- runtime/snapshots/dashboard-history.json
- runtime/snapshots/dashboard-recovery.json
- src/features/ops/ops-shell-view.js
- src/lib/server/dashboard/dashboard-service.js
- src/lib/server/ops/create-ops-actions-route-response.js
- src/lib/server/ops/create-ops-health-route-response.js
- src/lib/server/ops/get-ops-health.js
- src/lib/server/security/assert-ops-access.js
- tests/unit/dashboard.live-path.test.mjs
- tests/unit/ops-access.test.mjs
- tests/unit/ops-health.test.mjs
- tests/unit/ops-maintenance-action.test.mjs
- tests/unit/ops-shell.test.mjs

### Project Context Reference

- No `project-context.md` file exists in this repository at the time of story creation.
- Story guidance was therefore derived from the current planning artifacts, sprint artifacts, implemented Epic 3 story files, package metadata, repo structure, git history, and the corrected Story 4.1 remediation audit plus Story 4.3 rerun pattern.

### Completion Status

- Story context assembled from Epic 4 planning, sprint tracking, the corrected Story 4.1 audit, the completed Story 4.3 remediation pass, Epic 3 retrospectives and story artifacts, package metadata, repo source structure, git history, and current official framework/testing documentation checked on 2026-03-19.
- This story is implemented with code-review fixes applied and is now complete for Story `4.4`; the remaining work is Story `4.5` re-review and re-close of the reopened Epic 3 stories.
- The resulting state is a per-story evidence-backed decision across the Epic 3 candidate set plus explicit Story `4.5` handoff state so release-readiness can only advance from documented closure evidence.

### Change Log

- 2026-03-19: Implemented Story 4.4 with evidence-backed Epic 3 rerun review, code fixes for Stories `3.1`, `3.2`, `3.4`, and `3.5`, a no-code rerun clearance for Story `3.3`, and synced the register plus sprint tracking for the Story `4.5` handoff.
- 2026-03-19: Code review fixed standards-compliant `Forwarded` host parsing, aligned the ops-shell carried-forward heading with non-restart fallback semantics, reopened the remediated Epic 3 stories to `review` in sprint tracking, and expanded the recorded file inventory to cover the full dirty worktree context.
