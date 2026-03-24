# Story 4.5: Re-Review and Re-Close Only Green Stories

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As the project team,
I want every reopened story to pass internal code review, external adversarial review, validation, and artifact-sync checks again before closure,
so that the repo's done state matches real review completion.

## Acceptance Criteria

1. Given Story `4.4` left reopened Epic 3 stories pending final closure, when Story `4.5` begins, then only stories `3.1`, `3.2`, `3.4`, and `3.5` are in final closeout scope, and stories already cleared or never reopened remain untouched.
2. Given a pending reopened story is reviewed during final closeout, when the story is assessed, then its artifact records an explicit internal code review result, external adversarial review result, validation result, artifact-sync result, and closure decision, and any story with a failing or incomplete gate remains open.
3. Given a reopened story is ready to return to `done`, when sprint tracking and remediation artifacts are updated, then the story status, `docs/sprint-artifacts/sprint-status.yaml`, the remediation register, file list, and closure notes all agree, and the story is removed from the pending `4.5` closure set only after all gates are green.
4. Given Story `4.5` completes, when the remaining pending set is evaluated, then release-readiness moves forward only if every reopened story is green and closure evidence is complete; otherwise Epic 4 remains open and the unresolved story or stories stay out of `done`.

## Tasks / Subtasks

- [x] Lock the final closeout scope and baseline the current evidence state for reopened stories `3.1`, `3.2`, `3.4`, and `3.5`. (AC: 1, 3)
  - [x] Confirm `docs/sprint-artifacts/sprint-status.yaml` and `docs/sprint-artifacts/external-adversarial-remediation-register.md` agree that only `3.1`, `3.2`, `3.4`, and `3.5` remain pending for Story `4.5`. (AC: 1, 3)
  - [x] Verify `3.3` remains cleared as no-code-after-rerun and that Epic 2 has no remaining `4.5` handoff. (AC: 1)
  - [x] Record any pre-existing dirty-worktree context needed for accurate closure evidence without treating unrelated files as Story `4.5` implementation scope. (AC: 3)
- [x] Rerun the required review gates for each reopened Epic 3 story and keep any failing story open. (AC: 2, 4)
  - [x] Run internal code review for `3.1`, `3.2`, `3.4`, and `3.5`, capturing explicit pass or fail results in the affected story artifacts. (AC: 2)
  - [x] Run external adversarial review for `3.1`, `3.2`, `3.4`, and `3.5`, capturing explicit pass or fail results in the affected story artifacts and the remediation register. (AC: 2)
  - [x] If any review gate fails, reopen only the implicated story, record the blocking issue, and do not return it to `done` during Story `4.5`. (AC: 2, 4)
- [x] Run final validation and artifact-sync checks across the reopened Epic 3 closure set. (AC: 2, 3, 4)
  - [x] Run `npm run validate` as the repo-level validation gate, and capture any additional focused verification needed to support the reopened story set. (AC: 2)
  - [x] Confirm each reopened story artifact has a synchronized status, closure notes, file list, and verification record that matches the actual implementation and review state. (AC: 2, 3)
  - [x] Confirm no story is moved back to `done` while any review result, validation result, or artifact-sync evidence is missing. (AC: 2, 3, 4)
- [x] Close only the stories that are fully green and keep release-readiness evidence aligned. (AC: 3, 4)
  - [x] Update `docs/sprint-artifacts/sprint-status.yaml` so only fully green reopened stories return to `done`, and any unresolved story remains in `review` or `in-progress` as appropriate. (AC: 3, 4)
  - [x] Update `docs/sprint-artifacts/external-adversarial-remediation-register.md` with final closure evidence, remaining open items, and the release-readiness conclusion. (AC: 3, 4)
  - [x] If all reopened stories are green, mark Epic 4 release-readiness as evidence-backed; otherwise keep Epic 4 open and identify the exact remaining blocker path. (AC: 4)
- [x] Verify final closure integrity before Story `4.5` is closed. (AC: 2, 3, 4)
  - [x] Confirm reopened story artifacts, `docs/sprint-artifacts/sprint-status.yaml`, and the remediation register all agree on final story states and owner paths. (AC: 3)
  - [x] Verify no cleared story is accidentally reopened or relabeled during this closure-only pass. (AC: 1, 3)
  - [x] Ensure the repo-level done state cannot be interpreted as universally green without the supporting closure evidence now recorded in the story artifacts and remediation register. (AC: 2, 4)

## Dev Notes

### Developer Context

- Story `4.5` is the final Epic 4 closure gate. It exists to rerun review and validation on the reopened story set and to return stories to `done` only when closure evidence is complete and synchronized.
- The current scope boundary was established from the pre-closeout state:
  - at Story `4.5` start, `docs/sprint-artifacts/sprint-status.yaml` marked `3.1`, `3.2`, `3.4`, and `3.5` as `review` and listed the same four stories under `review_debt_status.pending_story_ids_for_4_5.epic-3`.
  - at Story `4.5` start, `docs/sprint-artifacts/external-adversarial-remediation-register.md` recorded Epic 2 as cleared, `3.3` as no-code-after-rerun, and `3.1`, `3.2`, `3.4`, and `3.5` as reopened-and-remediated stories that still required final internal review, external adversarial review, validation, and closure sync.
  - Story `4.4` is already complete and is the immediate continuity source for what changed and what must now be re-reviewed.
- Strong implication: Story `4.5` is not licensed to widen remediation scope, infer new external debt from internal traces, or treat validation alone as closure. Its job is final evidence-backed review and synchronization.
- The reopened Epic 3 stories each have a distinct closure concern that Story `4.5` must verify explicitly:
  - Story `3.1` owns the hardened local-only ops boundary, including mixed-host denial handling and standards-compliant `Forwarded` parsing.
  - Story `3.2` owns truthful operator readiness and the distinction between ordinary carried-forward runtime fallback and true restart-recovery state.
  - Story `3.4` owns bounded `refresh` and `trust-check` maintenance actions and the same-origin non-leaky denied-response behavior on ops-action routes.
  - Story `3.5` owns honest recovery framing after interruption or restart, including carried-forward versus resumed-live semantics in the ops shell.
- Scope boundaries for Story `4.5`:
  - do not invent a new remediation register, closure tracker, or release-readiness artifact outside `docs/sprint-artifacts/*`
  - do not reopen Epic 1 or Epic 2 work unless genuinely new external evidence appears, which is outside the current approved closure scope
  - do not silently return a reopened story to `done`; every closure decision must be backed by explicit review and validation evidence in the story artifact
  - do not collapse story-level closure evidence into one generic Epic 4 note; each reopened story must carry its own closure record
- Success for Story `4.5` is not “all reviewed stories close.” Success is:
  - every reopened story has explicit internal review, external adversarial review, validation, and artifact-sync outcomes
  - only fully green stories return to `done`
  - the remediation register and sprint tracking clearly show whether Epic 4 release-readiness is now evidence-backed or still blocked
  - the repo’s apparent completion state no longer outruns the documented closure evidence

### Technical Requirements

- Treat Story `4.5` as a closure-verification story, not as a speculative remediation pass.
  - use the reopened Epic 3 set already recorded in `sprint-status.yaml` and the remediation register
  - rerun review and validation against the actual current code and artifacts
  - do not invent new candidate scope from historical BMAD traces alone
- Every reopened story must satisfy four explicit gates before returning to `done`:
  - internal code review result
  - external adversarial review result
  - validation result
  - artifact-sync result
- Closure evidence must be story-local and explicit.
  - each of `3.1`, `3.2`, `3.4`, and `3.5` should record the review outcomes, validation evidence, closure decision, and any remaining blocker directly in its own story artifact
  - the remediation register should summarize the closure state, not replace the per-story record
- Validation is not satisfied by a vague “repo looks green” claim.
  - at minimum, run the repo-level `npm run validate` gate
  - if story-specific follow-up checks are needed to support a closure decision, record them alongside the corresponding story
  - if validation fails, no implicated story returns to `done`
- Artifact synchronization is part of the acceptance bar.
  - `docs/sprint-artifacts/sprint-status.yaml`, the reopened story artifacts, and `docs/sprint-artifacts/external-adversarial-remediation-register.md` must agree on final state
  - file lists and closure notes must reflect the actual touched files and the actual review outcome
  - stories cleared earlier, such as Epic 2 and Story `3.3`, must remain unchanged unless new evidence appears
- Preserve the Epic 3 semantic fixes while closing the stories.
  - Story `3.1` must still deny non-local or mismatched-host ops access without leaking internals
  - Story `3.2` must still distinguish ordinary carried-forward runtime fallback from restart recovery in operator-facing readiness
  - Story `3.4` must still keep ops actions bounded to `refresh` and `trust-check` with non-cacheable denied responses
  - Story `3.5` must still frame carried-forward and resumed-live recovery honestly in the ops shell
- Keep closure output calm and factual.
  - acceptable: explicit pass/fail decisions, bounded blocker notes, concrete validation evidence, synchronized status updates
  - unacceptable: speculative release claims, generic “looks good” review summaries, or status flips without evidence

### Architecture Compliance

- Stay within the existing modular-monolith and feature-first boundaries while performing final closeout:
  - local-only ops route entry under `src/app/(ops)/ops/*`
  - local-only ops APIs under `src/app/api/ops/*`
  - server-owned access, readiness, maintenance, and recovery derivation under `src/lib/server/*`
  - thin operator-facing UI composition under `src/features/ops/*`
- Preserve one canonical truth model for Epic 3 behavior.
  - do not introduce a separate “closure mode” implementation path
  - do not move access-control, readiness, or recovery semantics into new route-local or client-only logic during final review
  - do not create a release-readiness dashboard, second remediation register, or closure-only route
- Keep Story `4.5` focused on verification and synchronization of the already-remediated Epic 3 surfaces:
  - Story `3.1` for access control
  - Story `3.2` for readiness derivation
  - Story `3.4` for maintenance actions
  - Story `3.5` for restart-recovery framing
- Respect the architecture rule that runtime-generated artifacts remain outside committed source structure.
  - committed closure evidence belongs under `docs/sprint-artifacts/*`
  - runtime snapshot files under `runtime/snapshots/*` may be inspected as evidence but should not become the new system of record for closure status
- Any code change discovered during Story `4.5` review must remain tightly scoped to the already-established Epic 3 paths and must not silently broaden into another remediation stream.

### Library / Framework Requirements

- Stay aligned with the repo-pinned baseline while rerunning review and validation:
  - `next` `16.1.7`
  - `react` `19.2.3`
  - `react-dom` `19.2.3`
  - `@tanstack/react-query` `^5.0.0`
  - `zod` `^4.3.6`
  - `node` `24.x`
  - local `vitest` package under `tools/vitest-lite`
- Do not introduce new runtime, review-dashboard, or validation-helper libraries for Story `4.5`.
- Official-source checks completed on 2026-03-19:
  - Next.js route handlers remain the documented server boundary for internal app endpoints, so final closeout should verify the existing `app/**/route.ts` behavior rather than inventing a new review service: https://nextjs.org/docs/app/getting-started/route-handlers
  - React’s `'use client'` guidance still keeps server-owned request and security decisions on the server side, which reinforces that Story `4.5` should validate the existing server-owned Epic 3 semantics instead of moving logic into client-only review flows: https://react.dev/reference/rsc/use-client
  - TanStack Query’s current React docs still expose the existing mutation primitives and options such as `mutationFn` and `networkMode`, which supports validating the current ops action path instead of replacing it during closeout: https://tanstack.com/query/latest/docs/framework/react/reference/useMutation
  - Node’s official previous-releases page still includes the `v24` line, matching the repo engine contract used for validation work in this repo: https://nodejs.org/en/about/previous-releases
  - Zod 4 remains the stable line and is documented as the latest version of Zod: https://zod.dev/v4
  - Vitest’s current guide remains the repo’s unit-test baseline for focused regression coverage: https://vitest.dev/guide/
  - Playwright’s current writing-tests guide continues to emphasize action-plus-assertion flows with auto-waiting and isolated test contexts, which remains relevant if final closure needs browser-level evidence beyond repo validation: https://playwright.dev/docs/writing-tests
- Inference from those sources: Story `4.5` should reuse the current Next.js, React, TanStack Query, Zod, Vitest, and Playwright stack exactly as implemented and focus on rerunning evidence-backed closure gates, not on stack churn.

### File Structure Requirements

- Expected primary artifacts to add or update:
  - `docs/sprint-artifacts/4-5-rerun-reviews-and-close-only-green-stories.md`
  - `docs/sprint-artifacts/external-adversarial-remediation-register.md`
  - `docs/sprint-artifacts/sprint-status.yaml`
  - affected reopened Epic 3 story artifacts only:
    - `docs/sprint-artifacts/3-1-provide-a-separate-local-only-ops-access-surface.md`
    - `docs/sprint-artifacts/3-2-show-public-readiness-and-current-ops-state.md`
    - `docs/sprint-artifacts/3-4-trigger-lightweight-refresh-and-trust-check-actions.md`
    - `docs/sprint-artifacts/3-5-recover-the-display-after-interruption-or-restart.md`
- Existing code paths to inspect and re-verify during final closeout:
  - access-control paths under `src/lib/server/security/*`
  - ops route and API files under `src/app/(ops)/ops/*` and `src/app/api/ops/*`
  - server-owned Epic 3 logic under `src/lib/server/ops/*`, `src/lib/server/dashboard/*`, and `src/lib/server/cache/*`
  - operator-facing Epic 3 UI seams under `src/features/ops/*`
  - focused Epic 3 regression tests under `tests/unit/*` and any relevant smoke coverage under `tests/smoke/*`
- Existing artifacts to inspect and reference:
  - `docs/sprint-change-proposal-2026-03-19.md`
  - `docs/sprint-artifacts/4-1-audit-external-adversarial-findings-and-map-them-to-story-ids.md`
  - `docs/sprint-artifacts/4-4-reopen-and-remediate-epic-3-review-debt.md`
  - `docs/sprint-artifacts/external-adversarial-remediation-register.md`
  - `docs/sprint-artifacts/sprint-status.yaml`
  - `docs/sprint-artifacts/3-1-provide-a-separate-local-only-ops-access-surface.md`
  - `docs/sprint-artifacts/3-2-show-public-readiness-and-current-ops-state.md`
  - `docs/sprint-artifacts/3-3-diagnose-degraded-impact-by-signal-and-scope.md`
  - `docs/sprint-artifacts/3-4-trigger-lightweight-refresh-and-trust-check-actions.md`
  - `docs/sprint-artifacts/3-5-recover-the-display-after-interruption-or-restart.md`
- Do not create ambiguous new artifacts like `epic-4-closeout-notes.md`, a second remediation register, or a release dashboard outside the canonical Epic 4 artifact set.
- If final review reveals a real defect, keep any code patch inside the already-established Epic 3 files and update the corresponding reopened story artifact immediately so file inventory and closure evidence do not drift.

### Testing Requirements

- Minimum verification for final closeout:
  - rerun internal code review for each reopened story in scope
  - rerun external adversarial review for each reopened story in scope
  - run `npm run validate`
  - perform an artifact-sync pass across reopened story artifacts, `docs/sprint-artifacts/sprint-status.yaml`, and `docs/sprint-artifacts/external-adversarial-remediation-register.md`
- No reopened story may return to `done` if any one of the following is missing or failing:
  - internal review result
  - external adversarial review result
  - validation result
  - artifact-sync result
- Story-specific closure checks should protect the actual Epic 3 fixes:
  - Story `3.1`: deny-by-default local-only access, standards-compliant `Forwarded` handling, and non-leaky denied behavior
  - Story `3.2`: readiness remaining derived from the public snapshot and truthful distinction between ordinary carried-forward runtime fallback and true restart recovery
  - Story `3.4`: only `refresh` and `trust-check` being accepted, bounded calm action results, and non-cacheable denied responses
  - Story `3.5`: honest carried-forward versus resumed-live recovery framing in the ops shell and unchanged public-display recovery posture
- If Story `4.5` uncovers a defect and a follow-up patch is required, rerun the relevant focused tests and record that evidence directly in the affected story artifact before closure is reconsidered.
- Treat traceability as testable behavior:
  - pending `4.5` story IDs must shrink only when corresponding stories are fully green
  - cleared stories such as Epic 2 and Story `3.3` must remain cleared
  - Epic 4 release-readiness must stay blocked unless every reopened story closure gate is complete

### Previous Story Intelligence

- Story `4.4` is the immediate continuity source for Story `4.5` and defines the only reopened Epic 3 stories that may close here:
  - `3.1`, `3.2`, `3.4`, and `3.5` were remediated and moved to `review`
  - `3.3` was explicitly cleared as no-code-after-rerun and does not flow to Story `4.5`
  - Epic 2 was already cleared in Story `4.3` and is outside the current closure scope
- Critical carry-forward from Story `4.1`:
  - internal BMAD review traces are contextual evidence only and must not be treated as standalone external findings
  - the remediation register is the canonical cross-story summary, but closure evidence must still live in the individual story artifacts
  - release-readiness remains blocked on Epic 4 until reopened stories receive explicit re-review and re-close evidence
- Critical carry-forward from Story `4.3`:
  - rerun external review is an acceptable closure path when standalone external findings text could not be recovered
  - a no-code outcome is valid only when the story artifact and remediation register record the rerun-review evidence clearly
- Critical carry-forward from Story `4.4`:
  - Story `3.1` fix area: local-only host-gate hardening, including standards-compliant `Forwarded` parsing and denied-response cache isolation
  - Story `3.2` fix area: truthful readiness and operator-facing distinction between ordinary carried-forward fallback and true restart recovery
  - Story `3.4` fix area: bounded ops actions with non-cacheable, host-varying denied responses
  - Story `3.5` fix area: honest carried-forward versus restart-recovery framing in the ops shell and server payloads
- Implementation implication for Story `4.5`:
  - verify the remediated Epic 3 behavior as it currently exists
  - record explicit pass/fail outcomes and validation evidence per story
  - return only fully green stories to `done`
  - if any gate fails, keep the implicated story open and preserve the remaining blocker path rather than forcing sprint closure

### Git Intelligence Summary

- Recent commit history still shows Epic 3 as the latest completed implementation stream:
  - `3cc4ef6 feat(epic-3): implement 3-5-recover-the-display-after-interruption-or-restart`
  - `3a6ec9f feat(epic-3): implement 3-4-trigger-lightweight-refresh-and-trust-check-actions`
  - `8a12ce8 feat(epic-3): implement 3-3-diagnose-degraded-impact-by-signal-and-scope`
  - `93e5912 feat(epic-3): implement 3-2-show-public-readiness-and-current-ops-state`
  - `9eb1adf feat(epic-3): implement 3-1-provide-a-separate-local-only-ops-access-surface`
- Actionable implication: Story `4.5` is closure and evidence-synchronization work after Epic 3 remediation, not a continuation of a feature branch.
- Current working-tree changes span Epic 4 planning artifacts, reopened story artifacts, Epic 3 code and tests, and unrelated runtime or log artifacts:
  - `docs/epics.md`
  - `docs/sprint-artifacts/2-2-show-trend-and-freshness-where-confidence-matters.md`
  - `docs/sprint-artifacts/2-4-preserve-honest-usefulness-during-provider-failure.md`
  - `docs/sprint-artifacts/2-5-maintain-stable-live-reading-during-updates-and-motion-changes.md`
  - `docs/sprint-artifacts/3-1-provide-a-separate-local-only-ops-access-surface.md`
  - `docs/sprint-artifacts/3-2-show-public-readiness-and-current-ops-state.md`
  - `docs/sprint-artifacts/3-3-diagnose-degraded-impact-by-signal-and-scope.md`
  - `docs/sprint-artifacts/3-4-trigger-lightweight-refresh-and-trust-check-actions.md`
  - `docs/sprint-artifacts/3-5-recover-the-display-after-interruption-or-restart.md`
  - `docs/sprint-artifacts/sprint-status.yaml`
  - `logs/ralph-20260319-100642.log`
  - `runtime/snapshots/dashboard-history.json`
  - `runtime/snapshots/dashboard-recovery.json`
  - `src/features/ops/ops-shell-view.js`
  - `src/lib/server/dashboard/dashboard-service.js`
  - `src/lib/server/ops/create-ops-actions-route-response.js`
  - `src/lib/server/ops/create-ops-health-route-response.js`
  - `src/lib/server/ops/get-ops-health.js`
  - `src/lib/server/security/assert-ops-access.js`
  - `tests/unit/dashboard.live-path.test.mjs`
  - `tests/unit/ops-access.test.mjs`
  - `tests/unit/ops-health.test.mjs`
  - `tests/unit/ops-maintenance-action.test.mjs`
  - `tests/unit/ops-shell.test.mjs`
- Strong implication for Story `4.5`:
  - treat the current worktree as historical evidence and active remediation state, not as something to clean up wholesale
  - do not revert unrelated dirty files while closing the reopened stories
  - if final review requires another patch, keep it narrow and synchronize the file inventory immediately in the affected story artifact and Story `4.5`

### Latest Tech Information

- Official-source checks on 2026-03-19 did not surface any stack change that alters the implementation direction for Story `4.5`.
  - Next.js route handlers remain the correct boundary for internal app endpoints, so final closeout should verify the existing route-handler behavior rather than create a new review service.
  - React’s `'use client'` guidance still preserves a strict server/client boundary, which reinforces keeping Epic 3 access, readiness, and recovery decisions server-owned during closeout.
  - TanStack Query’s current mutation reference still documents the existing mutation path, including `mutationFn` and `networkMode`, which supports re-verifying the current ops-action flow rather than replacing it.
  - Node’s official previous-releases page still includes the `v24` line, matching the repo’s `24.x` engine contract for validation work.
  - Zod 4 is still documented as the latest version of Zod, so there is no schema-layer reason to alter the validation stack during final closure.
  - Vitest remains the repo’s unit-test baseline, and Playwright’s current writing-tests guide still emphasizes isolated browser contexts and action-plus-assertion flows for any browser-level closure evidence.
- Inference from those sources: Story `4.5` should reuse the existing Next.js, React, TanStack Query, Zod, Vitest, Playwright, and Node 24 stack exactly as-is and focus on evidence-backed rerun review, validation, and artifact synchronization rather than technology churn.

### Project Structure Notes

- The repo already centralizes planning, remediation, and closure evidence under `docs/sprint-artifacts/`; Story `4.5` should extend that pattern rather than introduce a second closeout tracker.
- Epic 3’s implementation and review surfaces already live in stable canonical paths:
  - access control under `src/lib/server/security/*`
  - ops routes and APIs under `src/app/(ops)/ops/*` and `src/app/api/ops/*`
  - readiness, maintenance, and recovery derivation under `src/lib/server/ops/*`, `src/lib/server/dashboard/*`, and `src/lib/server/cache/*`
  - operator-facing UI seams under `src/features/ops/*`
- The highest-risk structural mistake in Story `4.5` would be collapsing closure evidence into one Epic-level claim.
  - wrong approach: mark Epic 4 or the reopened stories `done` from a general green impression
  - right approach: record per-story review outcomes, validation evidence, and artifact-sync results, then update sprint tracking and the remediation register only after the story-local evidence is complete

### References

- `docs/epics.md#Story 4.5: Re-Review and Re-Close Only Green Stories`
- `docs/sprint-change-proposal-2026-03-19.md`
- `docs/sprint-artifacts/4-1-audit-external-adversarial-findings-and-map-them-to-story-ids.md`
- `docs/sprint-artifacts/4-3-reopen-and-remediate-epic-2-review-debt.md`
- `docs/sprint-artifacts/4-4-reopen-and-remediate-epic-3-review-debt.md`
- `docs/sprint-artifacts/external-adversarial-remediation-register.md`
- `docs/sprint-artifacts/sprint-status.yaml`
- `docs/sprint-artifacts/3-1-provide-a-separate-local-only-ops-access-surface.md`
- `docs/sprint-artifacts/3-2-show-public-readiness-and-current-ops-state.md`
- `docs/sprint-artifacts/3-3-diagnose-degraded-impact-by-signal-and-scope.md`
- `docs/sprint-artifacts/3-4-trigger-lightweight-refresh-and-trust-check-actions.md`
- `docs/sprint-artifacts/3-5-recover-the-display-after-interruption-or-restart.md`
- `docs/architecture.md`
- `docs/prd.md`
- `docs/ux-design-specification.md`
- `package.json`
- official source checked 2026-03-19: `https://nextjs.org/docs/app/getting-started/route-handlers`
- official source checked 2026-03-19: `https://react.dev/reference/rsc/use-client`
- official source checked 2026-03-19: `https://tanstack.com/query/latest/docs/framework/react/reference/useMutation`
- official source checked 2026-03-19: `https://nodejs.org/en/about/previous-releases`
- official source checked 2026-03-19: `https://zod.dev/v4`
- official source checked 2026-03-19: `https://vitest.dev/guide/`
- official source checked 2026-03-19: `https://playwright.dev/docs/writing-tests`

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- `sed -n '1,260p' _bmad/core/tasks/workflow.xml`
- `sed -n '1,260p' _bmad/bmm/workflows/4-implementation/dev-story/workflow.yaml`
- `sed -n '1,340p' _bmad/bmm/workflows/4-implementation/dev-story/instructions.xml`
- `sed -n '1,260p' _bmad/bmm/workflows/4-implementation/dev-story/checklist.md`
- `sed -n '1,220p' _bmad/bmm/config.yaml`
- `sed -n '1,220p' docs/sprint-artifacts/sprint-status.yaml`
- `sed -n '1,320p' docs/sprint-artifacts/4-5-rerun-reviews-and-close-only-green-stories.md`
- `sed -n '1,260p' docs/sprint-artifacts/external-adversarial-remediation-register.md`
- `sed -n '1,260p' docs/sprint-artifacts/3-1-provide-a-separate-local-only-ops-access-surface.md`
- `sed -n '1,260p' docs/sprint-artifacts/3-2-show-public-readiness-and-current-ops-state.md`
- `sed -n '1,260p' docs/sprint-artifacts/3-4-trigger-lightweight-refresh-and-trust-check-actions.md`
- `sed -n '1,260p' docs/sprint-artifacts/3-5-recover-the-display-after-interruption-or-restart.md`
- `sed -n '1,320p' src/lib/server/security/assert-ops-access.js`
- `sed -n '1,320p' src/lib/server/ops/get-ops-health.js`
- `sed -n '1,320p' src/lib/server/ops/run-ops-maintenance-action.js`
- `sed -n '1,320p' src/lib/server/dashboard/dashboard-service.js`
- `sed -n '1,220p' src/features/ops/ops-shell-view.js`
- `sed -n '1,260p' tests/unit/ops-access.test.mjs`
- `sed -n '1,320p' tests/unit/ops-health.test.mjs`
- `sed -n '1,320p' tests/unit/ops-maintenance-action.test.mjs`
- `sed -n '1,320p' tests/unit/ops-shell.test.mjs`
- `sed -n '1,280p' tests/unit/dashboard.live-path.test.mjs`
- `sed -n '1,260p' tests/smoke/startup-smoke.test.mjs`
- `git log --oneline -5`
- `git diff --stat`
- `find logs -maxdepth 1 -type f | sort`
- `npm run test:unit -- --run tests/unit/ops-access.test.mjs tests/unit/ops-health.test.mjs tests/unit/ops-maintenance-action.test.mjs tests/unit/ops-shell.test.mjs tests/unit/dashboard.live-path.test.mjs`
- `npm run test:smoke -- tests/smoke/startup-smoke.test.mjs`
- `npm run validate`

### Completion Notes List

- Confirmed the Story `4.5` closure scope remained limited to reopened Epic 3 stories `3.1`, `3.2`, `3.4`, and `3.5`, while Epic 2 and Story `3.3` stayed cleared.
- Re-ran internal code review and adversarial review against the remediated Epic 3 access, readiness, maintenance-action, and restart-recovery seams and did not recover any new evidence-backed defects.
- Verified the focused Epic 3 regression set with `tests/unit/ops-access.test.mjs`, `tests/unit/ops-health.test.mjs`, `tests/unit/ops-maintenance-action.test.mjs`, `tests/unit/ops-shell.test.mjs`, `tests/unit/dashboard.live-path.test.mjs`, and `tests/smoke/startup-smoke.test.mjs`.
- Passed the full repo gate with `npm run validate`.
- Returned Stories `3.1`, `3.2`, `3.4`, and `3.5` to `done`, marked release readiness as evidence-backed in sprint tracking, and synchronized closure evidence across the reopened story artifacts and the remediation register.
- Code review follow-up marked Story `4.5` itself `done`, reconciled the recorded dirty-worktree context against the full active worktree, and aligned the reopened Epic 3 story artifacts plus the remediation register with the final closed state.

### File List

- docs/sprint-artifacts/3-1-provide-a-separate-local-only-ops-access-surface.md
- docs/sprint-artifacts/3-2-show-public-readiness-and-current-ops-state.md
- docs/sprint-artifacts/3-4-trigger-lightweight-refresh-and-trust-check-actions.md
- docs/sprint-artifacts/3-5-recover-the-display-after-interruption-or-restart.md
- docs/sprint-artifacts/external-adversarial-remediation-register.md
- docs/sprint-artifacts/sprint-status.yaml
- docs/sprint-artifacts/4-5-rerun-reviews-and-close-only-green-stories.md
- docs/epics.md
- docs/sprint-artifacts/2-2-show-trend-and-freshness-where-confidence-matters.md
- docs/sprint-artifacts/2-4-preserve-honest-usefulness-during-provider-failure.md
- docs/sprint-artifacts/2-5-maintain-stable-live-reading-during-updates-and-motion-changes.md
- docs/sprint-artifacts/3-3-diagnose-degraded-impact-by-signal-and-scope.md
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
- docs/sprint-artifacts/4-1-audit-external-adversarial-findings-and-map-them-to-story-ids.md
- docs/sprint-artifacts/4-3-reopen-and-remediate-epic-2-review-debt.md
- docs/sprint-artifacts/4-4-reopen-and-remediate-epic-3-review-debt.md
- docs/sprint-artifacts/epic-3-retro-2026-03-19.md
- docs/sprint-change-proposal-2026-03-19.md

## Change Log

- 2026-03-19: Implemented Story 4.5 by rerunning review and validation across reopened Epic 3 stories, re-closing `3.1`, `3.2`, `3.4`, and `3.5`, and synchronizing closure evidence across story artifacts, sprint tracking, and the remediation register.
- 2026-03-19: Code review synchronized Story `4.5` to `done`, reconciled dirty-worktree context in the recorded file inventory, and aligned reopened Epic 3 rerun notes with the final closed state.
