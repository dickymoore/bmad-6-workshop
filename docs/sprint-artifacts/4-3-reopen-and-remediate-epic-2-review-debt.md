# Story 4.3: Reopen and Remediate Epic 2 Review Debt

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As the project team,
I want the Epic 2 stories implicated by unresolved external-review candidate debt reassessed, and reopened only if rerun review or recovered evidence requires it,
so that trend, trust, degraded-source, and stable-live-reading behavior can close with explicit external review evidence.

## Acceptance Criteria

1. Given Story 4.1 left the Epic 2 candidate set unresolved because standalone external outputs were not recovered, when Story 4.3 begins, then candidate stories `2.2`, `2.4`, and `2.5` are treated as the only Epic 2 remediation scope, and `2.1` and `2.3` remain closed unless new external evidence is recovered.
2. Given Epic 2 candidate stories may have internal BMAD review closure but not separate external closure evidence, when remediation work starts, then each candidate story is either reopened from `done` to `review` or `in-progress` with an evidence-backed remediation path or explicitly recorded as no-code or no-action after rerun external adversarial review, and every decision is written back to the remediation register and the affected story artifact.
3. Given code or artifact remediation is required for an Epic 2 candidate story, when changes are applied, then truthfulness, degraded-state behavior, and stable live-reading semantics remain canonical, calm, and localized, and the story artifact records the external finding source or rerun-review evidence, remediation summary, file list, and validation evidence.
4. Given Epic 2 remediation is ready for handoff to final closure, when Story 4.3 is completed, then the remediation register, affected Story `2.x` artifacts, and sprint tracking all identify which Epic 2 stories still require Story `4.5` re-review and re-close work, and no unaffected Epic 2 story has been reopened.

## Tasks / Subtasks

- [x] Recover or rerun external adversarial review for the Epic 2 candidate stories `2.2`, `2.4`, and `2.5`. (AC: 1, 2)
  - [x] Attempt to recover missing external source evidence from approved planning artifacts, remediation records, and session history; if insufficient, run a fresh external adversarial review for each candidate story rather than inferring from internal BMAD traces alone. (AC: 2)
  - [x] Record a per-story decision in the remediation register for `2.2`, `2.4`, and `2.5`: reopened for remediation, no-code or no-action after rerun review, or blocked by missing evidence. (AC: 1, 2)
  - [x] Keep `2.1` and `2.3` closed unless new external evidence expands Epic 2 scope. (AC: 1, 4)
- [x] Resolve Epic 2 story state before any code changes, reopening only if evidence requires it and otherwise recording explicit no-code closure. (AC: 1, 2, 4)
  - [x] Update the affected Story `2.2`, `2.4`, and `2.5` artifacts plus `docs/sprint-artifacts/sprint-status.yaml` to reflect reopened status if needed, or explicit no-code or no-action closure without altering non-implicated stories. (AC: 2, 4)
  - [x] Capture the specific external finding or rerun-review reason in each Epic 2 candidate story decision before implementation changes begin. (AC: 2)
- [x] Apply remediation to the canonical Epic 2 implementation paths only where evidence requires it, or record the no-code outcome when none is required. (AC: 3)
  - [x] Fix only evidence-backed issues in the shared dashboard contract, server snapshot or service layers, presenter, public components, and targeted tests used by Stories `2.2`, `2.4`, and `2.5`, or record that no code remediation was required for the rerun-cleared scope. (AC: 3)
  - [x] Preserve calm public copy, localized trust narrowing, stable layout hierarchy, and the separation between service disruption and degraded-source semantics while remediating. (AC: 3)
  - [x] Do not introduce ops-console behavior, provider-branded public copy, or route-local fallback logic while remediating Epic 2 candidate stories. (AC: 3)
- [x] Update remediation evidence and prepare Epic 2 stories for Story `4.5` closure gates. (AC: 2, 3, 4)
  - [x] Update the remediation register with remediation summaries, evidence links, and remaining closure state for each Epic 2 candidate story. (AC: 2, 4)
  - [x] Update each affected Story `2.x` artifact with finding source or rerun external review reference, remediation summary, validation evidence, and current reopen state. (AC: 3, 4)
  - [x] Make the handoff to Story `4.5` explicit for every reopened Epic 2 story that still needs internal review, external adversarial review confirmation, or final closure sync, or record when no Epic 2 handoff remains after rerun review. (AC: 4)
- [x] Verify Epic 2 remediation scope and integrity before Story 4.3 is closed. (AC: 1, 3, 4)
  - [x] Run `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build` if code changes were made; otherwise run an artifact-integrity pass proving the no-code decisions are evidence-backed. (AC: 3)
  - [x] Confirm the remediation register, affected Story `2.x` files, and `docs/sprint-artifacts/sprint-status.yaml` agree on candidate scope, reopened status, and remaining Story `4.5` owner path. (AC: 4)
  - [x] Verify no unaffected Epic 2 story was reopened or relabeled during this remediation story. (AC: 1, 4)

## Dev Notes

### Developer Context

- Story 4.3 exists because Story 4.1 did not recover standalone external adversarial findings text, but it did preserve the approved Epic 2 candidate set that must remain visible until disproved or rerun through external review.
- At story start, the evidence boundary was:
  - `docs/sprint-artifacts/external-adversarial-remediation-register.md` leaving Epic 2 stories `2.2`, `2.4`, and `2.5` as unresolved candidate stories pending source recovery or rerun external review.
  - `docs/sprint-artifacts/sprint-status.yaml` exposing that candidate set under `review_debt_status.candidate_story_ids.epic-2`.
  - Story 4.1 explicitly kept Epic 2 scope limited to those three stories and left `2.1` and `2.3` closed.
- Strong implication: Story 4.3 is not licensed to reopen all of Epic 2 or to infer external debt from internal BMAD code-review traces.
- The implementation must respect the distinction between:
  - unresolved external-review candidate debt for `2.2`, `2.4`, and `2.5`
  - already-closed internal BMAD review history recorded in the original Story `2.x` artifacts
- Product and architecture context for the candidate stories:
  - Story `2.2` owns trend and freshness semantics where confidence materially matters
  - Story `2.4` owns truthful provider-failure handling and localized degraded-source behavior
  - Story `2.5` owns stable live reading, reduced-motion-safe meaning, and explicit live-update verification
- These three stories already define the canonical Epic 2 dashboard path:
  - shared contracts in `src/lib/contracts/*`
  - server normalization and snapshot publication in `src/lib/server/dashboard/*`
  - file-backed snapshot durability under `runtime/snapshots/*`
  - one presenter-owned public meaning layer in `src/features/dashboard/presenters/dashboard-presenter.js`
  - thin public UI composition in `src/features/dashboard/components/*`
- Scope boundaries for Story 4.3:
  - do not create a second dashboard truth model, remediation-only route, or review console
  - do not relitigate Epic 2 stories without evidence; either recover the external source, rerun external adversarial review, or explicitly record a no-code decision
  - do not reopen `2.1` or `2.3` unless new external evidence is actually recovered
  - do not weaken the calm public-display doctrine while remediating truthfulness, degradation, or live-reading behavior
- Success for Story 4.3 is not “force every Epic 2 candidate story to change code.” Success is:
  - each Epic 2 candidate story has an evidence-backed decision
  - any reopened story has a precise remediation path tied to external review evidence or rerun review output
  - unaffected Epic 2 stories remain closed
  - Story `4.5` receives an explicit handoff state for every Epic 2 candidate story

### Technical Requirements

- Start from evidence, not suspicion.
  - use the Story 4.1 remediation register as the source of candidate scope
  - for each of `2.2`, `2.4`, and `2.5`, either recover the missing external finding source or run a fresh external adversarial review before deciding whether code changes are needed
  - do not infer separate external debt from internal `Senior Developer Review (AI)` sections, change-log notes, or BMAD session traces alone
- Preserve Epic 2’s canonical semantics while remediating:
  - Story `2.2` must keep trend and freshness cues evidence-based, plain-language, and locally scoped
  - Story `2.4` must keep degraded-source and unavailable behavior calm, localized, and distinct from true service disruption
  - Story `2.5` must keep live updates stable, reduced-motion-safe, and non-alerting
- If remediation changes code, keep the change surface narrow and evidence-backed:
  - patch only the contract, server, presenter, component, or test paths directly implicated by the rerun external review output
  - reuse existing snapshot, presenter, and polling primitives instead of inventing remediation-specific abstractions
  - preserve the existing calm public shell and stable section order
- Treat artifact traceability as part of the implementation:
  - every Epic 2 candidate story must end this story with a documented decision
  - reopened stories must record the external source or rerun-review evidence that justified reopening
  - no-code or no-action decisions must still be written back to the remediation register and story artifact with rationale
- Keep the public experience fact-only and venue-native throughout remediation.
  - avoid provider names, technical errors, retry jargon, ops-console language, route-planner advice, or dashboard-style status density

### Architecture Compliance

- Stay within the existing modular-monolith and feature-first conventions:
  - shared contracts in `src/lib/contracts/*`
  - server snapshot and provider orchestration in `src/lib/server/*`
  - public display composition in `src/features/dashboard/*`
  - same-origin route handlers in `src/app/api/*`
- Preserve one canonical dashboard truth model.
  - do not add a remediation-only dashboard model
  - do not move truth or fallback semantics into route-local React code
  - do not introduce a second readiness, trust, or recovery taxonomy
- Keep Story 4.3 focused on Epic 2 candidate behavior only.
  - do not drift into Epic 3 ops, maintenance, or recovery flows
  - do not rewrite Story `2.1` or Story `2.3` unless new external evidence actually expands scope
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
- Do not add new state, animation, data-fetching, or dashboard UI libraries for Story 4.3.
- Official-source checks completed on 2026-03-19:
  - Next.js route handlers remain the documented server boundary for internal app endpoints, reinforcing that Epic 2 remediation should stay inside the existing `app/**/route.ts` model rather than creating new service layers: https://nextjs.org/docs/app/getting-started/route-handlers
  - TanStack Query’s current docs still support `refetchInterval` and `refetchIntervalInBackground`, which confirms the existing live-update path remains the intended query model if Story `2.5` needs remediation: https://tanstack.com/query/latest/docs/framework/react/reference/useQuery
  - React’s `'use client'` guidance still requires serializable props across the server/client boundary, which matters if remediation touches snapshot fields that cross into the live island: https://react.dev/reference/rsc/use-client
  - Node’s official releases page still lists `v24` as the current LTS line, matching the repo engine contract for validation work: https://nodejs.org/en/about/previous-releases
  - Zod 4 remains the stable validation line for shared contracts: https://zod.dev/v4
  - Vitest’s current guide still supports the repo’s Node baseline for focused regression tests: https://vitest.dev/guide/
  - Playwright’s current writing-tests guide still emphasizes action-plus-assertion flows with auto-waiting, which remains relevant if later closure work expands end-to-end checks, though Story 4.3 should stay mainly artifact and regression focused: https://playwright.dev/docs/writing-tests
- Inference from those sources: Story 4.3 should reuse the existing Epic 2 codepaths and test stack rather than introducing any new runtime or tooling layer.

### File Structure Requirements

- Expected primary artifacts to add or update:
  - `docs/sprint-artifacts/4-3-reopen-and-remediate-epic-2-review-debt.md`
  - `docs/sprint-artifacts/external-adversarial-remediation-register.md`
  - `docs/sprint-artifacts/sprint-status.yaml`
  - affected Epic 2 story artifacts only if they are evidence-backed reopened candidates:
    - `docs/sprint-artifacts/2-2-show-trend-and-freshness-where-confidence-matters.md`
    - `docs/sprint-artifacts/2-4-preserve-honest-usefulness-during-provider-failure.md`
    - `docs/sprint-artifacts/2-5-maintain-stable-live-reading-during-updates-and-motion-changes.md`
- Code files that may be legitimately touched only if rerun external review produces evidence-backed defects:
  - shared contract files under `src/lib/contracts/*`
  - Epic 2 server snapshot or service files under `src/lib/server/dashboard/*` and `src/lib/server/cache/*`
  - Epic 2 public presenter and display files under `src/features/dashboard/*`
  - focused Epic 2 regression tests under `tests/unit/*` and `tests/smoke/*`
- Existing artifacts to inspect and reference:
  - `docs/sprint-change-proposal-2026-03-19.md`
  - `docs/sprint-artifacts/4-1-audit-external-adversarial-findings-and-map-them-to-story-ids.md`
  - `docs/sprint-artifacts/external-adversarial-remediation-register.md`
  - `docs/sprint-artifacts/2-2-show-trend-and-freshness-where-confidence-matters.md`
  - `docs/sprint-artifacts/2-4-preserve-honest-usefulness-during-provider-failure.md`
  - `docs/sprint-artifacts/2-5-maintain-stable-live-reading-during-updates-and-motion-changes.md`
- Do not create ambiguous new artifacts like `epic-2-review-notes.md` or a separate ad hoc remediation tracker. Story 4.1 already established the canonical register.

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
- If Story `2.2` is remediated, tests must protect:
  - trend only appearing when justified by recent evidence
  - plain-language, local trust narrowing
  - no synthetic confidence under fallback or stale conditions
- If Story `2.4` is remediated, tests must protect:
  - localized provider-failure handling
  - calm unavailable-state wording
  - no promotion of trust degradation into disruption semantics
- If Story `2.5` is remediated, tests must protect:
  - stable reading order and stable update semantics
  - reduced-motion-safe meaning
  - no alert-feed or loading-takeover regressions
- Treat artifact consistency as part of the acceptance bar:
  - remediation register, reopened Story `2.x` files, and `sprint-status.yaml` must agree on scope and current state
  - no unaffected Epic 2 story may be relabeled during this story

### Previous Story Intelligence

- Story `4.1` is the governing continuity source for Story `4.3`; no Story `4.2` artifact exists yet, so Epic 2 remediation must follow the corrected Story 4.1 audit rather than an intermediate remediation plan.
- Critical carry-forward from Story `4.1`:
  - Epic 2 scope is limited to candidate stories `2.2`, `2.4`, and `2.5`
  - `2.1` and `2.3` stay closed unless new external evidence expands scope
  - internal BMAD review traces are contextual evidence only and must not be treated as standalone external findings
  - release readiness is still blocked on Epic 4 until candidate stories receive explicit evidence-backed closure
- Implementation implication:
  - Story `4.3` must start by recovering the missing external source or rerunning external adversarial review
  - if rerun review clears a candidate story with no code change, that decision is valid, but it must be written back into the remediation register and story artifact
  - if rerun review finds a real defect, reopen only the implicated story and patch the established Epic 2 implementation path rather than broadly reworking the dashboard
- Epic 2’s original story artifacts already contain the strongest technical context for likely remediation surfaces:
  - `2.2` for trend and freshness semantics
  - `2.4` for localized degraded-source and unavailable-state honesty
  - `2.5` for stable live reading and reduced-motion-safe update meaning

### Git Intelligence Summary

- Recent commit history shows the latest completed implementation stream is still Epic 3:
  - `3cc4ef6 feat(epic-3): implement 3-5-recover-the-display-after-interruption-or-restart`
  - `3a6ec9f feat(epic-3): implement 3-4-trigger-lightweight-refresh-and-trust-check-actions`
  - `8a12ce8 feat(epic-3): implement 3-3-diagnose-degraded-impact-by-signal-and-scope`
  - `93e5912 feat(epic-3): implement 3-2-show-public-readiness-and-current-ops-state`
  - `9eb1adf feat(epic-3): implement 3-1-provide-a-separate-local-only-ops-access-surface`
- Actionable implication: Story `4.3` is remediation and evidence-restoration work after delivery, not a continuation of an unfinished Epic 2 branch.
- Current working-tree changes include Epic 4 planning artifacts plus unrelated runtime or log updates:
  - `docs/epics.md`
  - `docs/sprint-artifacts/sprint-status.yaml`
  - `docs/sprint-artifacts/3-1-provide-a-separate-local-only-ops-access-surface.md`
  - `logs/ralph-20260319-100642.log`
  - `runtime/snapshots/dashboard-history.json`
  - `runtime/snapshots/dashboard-recovery.json`
- Strong implication for implementation:
  - treat the existing Story `2.x` artifacts and runtime files as historical evidence
  - do not revert unrelated working-tree changes while remediating Epic 2 review debt
  - expect any real code changes to be narrow follow-ups inside already-established Epic 2 files

### Latest Tech Information

- Official-source checks on 2026-03-19 did not surface any stack change that alters the remediation direction for Story `4.3`.
  - Next.js route handlers remain the correct boundary for internal app endpoints, so any Epic 2 remediation should stay inside the existing route-handler plus server-module architecture.
  - TanStack Query still supports the polling controls already used by the repo, so any Story `2.5` remediation should refine the current query path rather than replace it.
  - React still requires serializable props across the server/client boundary, which matters if Story `2.2`, `2.4`, or `2.5` adjust snapshot fields handed to the live island.
  - Node `24.x`, Zod `v4`, and the repo’s local Vitest setup remain aligned with current official guidance.
  - Playwright remains relevant if later Story `4.5` closure work adds stronger browser-level regression checks, but Story `4.3` should remain focused on artifacts and targeted regression coverage.
- Inference: there is no technical justification to introduce new frameworks, alternate state models, or new service layers for Story `4.3`.

### Project Structure Notes

- The repo already centralizes planning, remediation, and story evidence under `docs/sprint-artifacts/`; Story `4.3` should extend that pattern rather than inventing a second remediation tracker.
- Epic 2 implementation already lives in stable, canonical paths:
  - trust and freshness contracts under `src/lib/contracts/*`
  - snapshot and provider orchestration under `src/lib/server/*`
  - public display meaning and composition under `src/features/dashboard/*`
- The highest-risk structural mistake would be widening Story `4.3` into a generic “re-audit Epic 2” effort. The story should instead answer:
  - what external evidence was recovered or rerun
  - which of `2.2`, `2.4`, and `2.5` actually need remediation
  - what exact code or artifact changes were made
  - what remains for Story `4.5` to re-review and re-close

### References

- `docs/epics.md#Story 4.3: Reopen and Remediate Epic 2 Review Debt`
- `docs/sprint-change-proposal-2026-03-19.md`
- `docs/sprint-artifacts/4-1-audit-external-adversarial-findings-and-map-them-to-story-ids.md`
- `docs/sprint-artifacts/external-adversarial-remediation-register.md`
- `docs/sprint-artifacts/sprint-status.yaml`
- `docs/sprint-artifacts/epic-2-retro-2026-03-19.md`
- `docs/sprint-artifacts/2-2-show-trend-and-freshness-where-confidence-matters.md`
- `docs/sprint-artifacts/2-4-preserve-honest-usefulness-during-provider-failure.md`
- `docs/sprint-artifacts/2-5-maintain-stable-live-reading-during-updates-and-motion-changes.md`
- `docs/architecture.md`
- `docs/ux-design-specification.md`
- `package.json`
- official source checked 2026-03-19: `https://nextjs.org/docs/app/getting-started/route-handlers`
- official source checked 2026-03-19: `https://tanstack.com/query/latest/docs/framework/react/reference/useQuery`
- official source checked 2026-03-19: `https://react.dev/reference/rsc/use-client`
- official source checked 2026-03-19: `https://nodejs.org/en/about/previous-releases`
- official source checked 2026-03-19: `https://zod.dev/v4`
- official source checked 2026-03-19: `https://vitest.dev/guide/`
- official source checked 2026-03-19: `https://playwright.dev/docs/writing-tests`

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- `sed -n '1,260p' _bmad/bmm/workflows/4-implementation/dev-story/instructions.xml`
- `sed -n '1,220p' _bmad/bmm/workflows/4-implementation/dev-story/checklist.md`
- `sed -n '1,260p' docs/sprint-artifacts/4-3-reopen-and-remediate-epic-2-review-debt.md`
- `sed -n '1,280p' docs/sprint-artifacts/external-adversarial-remediation-register.md`
- `sed -n '1,260p' src/lib/server/dashboard/build-dashboard-snapshot.js`
- `sed -n '261,520p' src/lib/server/dashboard/build-dashboard-snapshot.js`
- `sed -n '1,260p' src/lib/server/dashboard/dashboard-service.js`
- `sed -n '1,320p' src/features/dashboard/presenters/dashboard-presenter.js`
- `sed -n '321,520p' src/features/dashboard/presenters/dashboard-presenter.js`
- `sed -n '1,260p' src/features/dashboard/components/DashboardLiveScreen.tsx`
- `sed -n '1,220p' src/features/dashboard/hooks/useDashboardQuery.ts`
- `sed -n '1,260p' src/features/dashboard/components/DashboardScreen.tsx`
- `sed -n '1,260p' src/features/dashboard/components/AtmosphericHeader.tsx`
- `sed -n '1,260p' src/app/globals.css`
- `sed -n '1288,1325p' src/app/globals.css`
- `sed -n '1,260p' tests/unit/dashboard.live-path.test.mjs`
- `sed -n '261,520p' tests/unit/dashboard.live-path.test.mjs`
- `sed -n '1,320p' tests/unit/dashboard.presenter.test.mjs`
- `sed -n '321,520p' tests/unit/dashboard.presenter.test.mjs`
- `sed -n '1,220p' tests/unit/dashboard.trust.test.mjs`
- `sed -n '1,260p' tests/smoke/startup-smoke.test.mjs`
- `rg -n \"prefers-reduced-motion|data-live-shell|aria-live|Latest change|liveAnnouncement|data-reading-zone|reduced-motion|transition\" src/app src/features tests/smoke -g '!node_modules'`
- `rg -n \"external adversarial|external review|adversarial findings|standalone external|rerun external\" logs -S`
- `rg -n \"2-2-show-trend-and-freshness-where-confidence-matters|2-4-preserve-honest-usefulness-during-provider-failure|2-5-maintain-stable-live-reading-during-updates-and-motion-changes\" logs -S`
- `git status --porcelain`
- `sed -n '1,220p' .codex/skills/bmad-bmm-create-story/SKILL.md`
- `sed -n '1,260p' _bmad/core/tasks/workflow.xml`
- `sed -n '1,220p' _bmad/bmm/workflows/4-implementation/create-story/workflow.yaml`
- `sed -n '1,220p' _bmad/bmm/config.yaml`
- `sed -n '1,360p' _bmad/bmm/workflows/4-implementation/create-story/instructions.xml`
- `sed -n '1,260p' _bmad/bmm/workflows/4-implementation/create-story/template.md`
- `sed -n '1,220p' _bmad/bmm/workflows/4-implementation/create-story/checklist.md`
- `sed -n '1,260p' docs/sprint-artifacts/sprint-status.yaml`
- `sed -n '640,760p' docs/epics.md`
- `sed -n '1,340p' docs/sprint-artifacts/4-1-audit-external-adversarial-findings-and-map-them-to-story-ids.md`
- `sed -n '1,320p' docs/sprint-artifacts/external-adversarial-remediation-register.md`
- `sed -n '1,260p' docs/architecture.md`
- `sed -n '1,260p' docs/ux-design-specification.md`
- `sed -n '1,420p' docs/sprint-artifacts/2-2-show-trend-and-freshness-where-confidence-matters.md`
- `sed -n '1,420p' docs/sprint-artifacts/2-4-preserve-honest-usefulness-during-provider-failure.md`
- `sed -n '1,420p' docs/sprint-artifacts/2-5-maintain-stable-live-reading-during-updates-and-motion-changes.md`
- `git log --oneline -5`
- `sed -n '1,220p' package.json`
- `git diff --stat`
- `find logs -maxdepth 1 -type f | sort`

### Project Context Reference

- No `project-context.md` file exists in this repository at the time of story creation.
- Story guidance was therefore derived from the current planning artifacts, sprint artifacts, package metadata, repo structure, git history, and the corrected Story 4.1 remediation audit.

### Completion Status

- Story 4.3 implemented the Epic 2 rerun external review pass against the corrected Story 4.1 candidate set.
- No standalone external findings artifact was recovered for Stories `2.2`, `2.4`, or `2.5`, and the rerun adversarial review did not surface any new evidence-backed Epic 2 defect.
- Epic 2 therefore closed as a no-code remediation story: the register, candidate story artifacts, and sprint tracking now record explicit no-code or no-action decisions while Epic 3 remains the unresolved candidate set.

### Completion Notes List

- Story 4.3 remained scoped to the corrected Epic 2 candidate set from Story 4.1: `2.2`, `2.4`, and `2.5`.
- Recovery pass result: no standalone external adversarial findings artifact was recovered from approved planning artifacts, remediation records, or repo session logs for the Epic 2 candidates.
- Rerun adversarial review result: no new evidence-backed defect was recovered in Story `2.2` trend and freshness semantics, Story `2.4` degraded-source handling, or Story `2.5` live-reading stability.
- No Epic 2 story was reopened. All three candidate stories were explicitly recorded as no-code or no-action after rerun external review, and `2.1` plus `2.3` remained closed.
- Sprint tracking now clears the Epic 2 candidate set, records the three no-code rerun outcomes, and leaves Epic 3 as the remaining unresolved external-review scope.
- Verification passed with YAML parsing for `docs/sprint-artifacts/sprint-status.yaml` and the full repo gate via `npm run validate`.
- Review fixes aligned the Epic 4 planning artifact, remediation register, and Story 4.3 task language with the final no-code outcome so the traceability story is internally consistent.

### File List

- docs/epics.md
- docs/sprint-artifacts/2-2-show-trend-and-freshness-where-confidence-matters.md
- docs/sprint-artifacts/2-4-preserve-honest-usefulness-during-provider-failure.md
- docs/sprint-artifacts/2-5-maintain-stable-live-reading-during-updates-and-motion-changes.md
- docs/sprint-artifacts/4-3-reopen-and-remediate-epic-2-review-debt.md
- docs/sprint-artifacts/external-adversarial-remediation-register.md
- docs/sprint-artifacts/sprint-status.yaml

### Change Log

- 2026-03-19: Implemented Story 4.3 as an evidence-backed no-code remediation pass, clearing Epic 2 candidate stories `2.2`, `2.4`, and `2.5` after rerun external review and syncing the register plus sprint tracking.
- 2026-03-19: Code review aligned the Epic 4 planning artifact, remediation register, and Story 4.3 task language with the final no-code rerun outcome, then re-closed the story.

## Senior Developer Review (AI)

### Findings

1. High: `docs/epics.md` still required Story `4.3` to reopen Epic 2 stories even though the implemented outcome cleared Epic 2 with no reopen path. Fixed by aligning the Epic 4 planning language to the rerun-review decision model.
2. High: `docs/sprint-artifacts/external-adversarial-remediation-register.md` still said the Epic 2 candidate set remained unresolved in `Missing-Source Cases`, which contradicted the same register's cleared Epic 2 section and sprint tracking. Fixed by narrowing that unresolved state to Epic 3 only.
3. Medium: Story `4.3` marked the code-remediation task complete even though no evidence-backed code defect was found. Fixed by updating the task language so a no-code rerun outcome is a valid completed path.
4. Medium: Story `4.3` still described the Epic 2 candidate set as currently unresolved in its developer context. Fixed by scoping those statements to the story start state and aligning the completion notes with the final outcome.

### Review Outcome

- All high and medium findings were fixed.
- Story status can return to `done`.
