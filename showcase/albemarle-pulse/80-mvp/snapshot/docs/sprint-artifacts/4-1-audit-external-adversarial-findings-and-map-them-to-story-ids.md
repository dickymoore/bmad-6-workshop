# Story 4.1: Audit External Adversarial Findings and Map Them to Story IDs

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As the project team,
I want every external adversarial finding collected and mapped to the exact affected story and artifact,
so that no review debt remains unowned or ambiguous.

## Acceptance Criteria

1. Given external adversarial review outputs exist or may exist outside the BMAD story loop, when the audit is performed, then every finding is captured in one remediation register with source, summary, affected artifact, and closure state, and each finding is mapped to an existing story or explicitly marked no-action with rationale.
2. Given a finding touches completed implementation work, when mapping is finalized, then the affected story IDs are identified before remediation begins, and stories not implicated by the audit remain closed.
3. Given the audit is complete, when the team reviews the result, then unresolved external review debt is visible in the backlog, and the sprint can no longer imply universal closure without evidence.

## Tasks / Subtasks

- [x] Create the external adversarial remediation register as the single source of truth for review-debt tracking. (AC: 1, 3)
  - [x] Add a durable audit artifact under `docs/sprint-artifacts/` that records each recovered external review finding with its source reference, summary, affected artifact, affected story ID(s), closure state, and evidence links. (AC: 1)
  - [x] If a recovered issue cannot be tied to a story, record either a no-action rationale or an explicit follow-up note for missing source evidence rather than guessing. (AC: 1, 3)
  - [x] Keep the register human-readable and diff-friendly so later Epic 4 remediation stories can update it without ambiguity. (AC: 1)
- [x] Inventory all external adversarial review sources and map them to concrete ownership before remediation begins. (AC: 1, 2)
  - [x] Search the repo artifacts, logs, and referenced review outputs for externally produced adversarial findings related to completed stories. (AC: 1)
  - [x] Normalize duplicate or overlapping findings so one issue is not counted multiple times while preserving source traceability. (AC: 1, 2)
  - [x] Produce an impacted-story map grouped by epic that identifies exactly which completed stories are implicated and which remain cleanly closed. (AC: 2)
- [x] Expose the audit result in sprint and backlog artifacts so review debt is visible and actionable. (AC: 2, 3)
  - [x] Update the Story 4.1 artifact with the audit summary, impacted story set, and any blocked or missing-source cases. (AC: 2, 3)
  - [x] Link every implicated story to the correct Epic 4 remediation path (`4.2`, `4.3`, `4.4`, or `4.5`) without reopening unrelated work. (AC: 2, 3)
  - [x] Ensure the sprint cannot be read as universally closed without consulting the new audit register and mapped Epic 4 remediation path. (AC: 3)
- [x] Verify traceability and artifact integrity before Story 4.1 is closed. (AC: 1, 2, 3)
  - [x] Confirm that every recovered finding has one clear owner path: mapped story ID, no-action rationale, or explicit follow-up record. (AC: 1, 2, 3)
  - [x] Verify that no non-implicated completed story is moved or relabeled during this audit-only phase. (AC: 2)
  - [x] Perform a focused artifact-consistency review across the remediation register, this story file, and sprint-status references so the backlog evidence is internally aligned. (AC: 3)

## Dev Notes

### Developer Context

- Story 4.1 is the first Epic 4 story and establishes the evidence boundary for the entire remediation epic. Its job is to make external review debt explicit, owned, and traceable before any remediation story starts changing code or reopening completed work.
- The repo currently proves only the internal BMAD closeout loop:
  - `docs/sprint-artifacts/sprint-status.yaml` now shows Epic 4 in progress, but Epics 1 through 3 and all sixteen implementation stories are still marked `done`.
  - `docs/sprint-artifacts/epic-2-retro-2026-03-19.md` and `docs/sprint-artifacts/epic-3-retro-2026-03-19.md` both report no unresolved story-level review findings inside the tracked story artifacts.
  - `docs/sprint-change-proposal-2026-03-19.md` explicitly records the missing source-of-truth gap: no persisted repo artifact was found for separate external adversarial review outputs and their closure state.
- Strong implication: Story 4.1 must not assume the external debt is already represented in story artifacts. It needs to recover that evidence from available sources, normalize it, and create one durable register that later remediation work can trust.
- Scope boundaries for this story:
  - do not implement product or infrastructure fixes here unless a tiny artifact-supporting script is strictly needed to assemble or maintain the audit record
  - do not reopen completed stories during the audit just because they look risky; only map them as implicated or not implicated based on evidence
  - do not treat previously resolved internal review notes as external adversarial debt unless an external source independently identifies the same issue
  - do not guess when a source is incomplete; record missing-source evidence, blocked mapping, or no-action rationale explicitly
- The implementation should prefer one stable, human-readable remediation register under `docs/sprint-artifacts/` plus updates to this Story 4.1 artifact. The result needs to survive diff review and future remediation edits without requiring readers to reconstruct history from long terminal logs.
- Likely evidence inputs for the audit include:
  - the Epic 4 change proposal
  - sprint retrospectives for Epic 2 and Epic 3
  - completed story artifacts that already contain internal review cycles and artifact-sync fixes
  - any external review outputs or agent/session logs that mention adversarial findings, fixes, or unresolved closeout gaps
- Success for Story 4.1 is not “all findings fixed.” Success is:
  - every recovered external finding has a source trail
  - every finding has one owner path
  - every affected story is identified before remediation begins
  - every unaffected story remains closed without ambiguity

### Technical Requirements

- Treat the remediation register as a first-class artifact with a stable schema. At minimum, each finding entry should carry:
  - source artifact or log reference
  - short finding summary in plain language
  - affected artifact path(s)
  - affected story ID(s) or explicit no-action rationale
  - current closure state
  - evidence or follow-up references
- Normalize the audit around evidence, not suspicion.
  - wrong approach: reopen stories because they are historically risky or because an epic retrospective mentioned review churn
  - right approach: map only issues that can be tied to a specific external finding source, and record uncertainty explicitly where evidence is incomplete
- Preserve exact traceability between the register and the BMAD backlog model.
  - Every implicated story must map cleanly to Story `4.2`, `4.3`, `4.4`, or `4.5`.
  - The register should make it obvious whether a finding is awaiting remediation, already resolved historically, blocked by missing evidence, or intentionally no-action.
- Prefer documentation and light automation over heavy tooling.
  - If implementation adds code, it should only support artifact consistency, parsing, or validation of the audit record.
  - Do not add a database, API endpoint, or UI for this story.
- Keep output calm and precise.
  - The project doctrine is still fact-only and evidence-backed.
  - Findings should be summarized plainly without dramatizing, speculating, or mixing remediation claims into the audit.

### Architecture Compliance

- Stay within the existing modular-monolith and feature-first conventions even though this story is documentation-heavy. New implementation support should remain minimal and live in obvious utility locations rather than creating a parallel “review system.”
- Preserve the repo’s separation between public display behavior, ops behavior, and planning artifacts:
  - this story primarily touches `docs/sprint-artifacts/*`
  - it should not alter public route trees, ops routes, or server runtime contracts unless a narrowly scoped artifact-support helper is unavoidable
- Respect the architecture rule that runtime-generated artifacts remain outside committed source structure. This story should create committed documentation artifacts, not write ephemeral outputs into source directories.
- Reuse existing truth sources instead of inventing a parallel taxonomy.
  - Sprint tracking remains in `docs/sprint-artifacts/sprint-status.yaml`
  - Story-level closeout evidence remains in individual story artifacts
  - Epic retrospectives remain continuity references, not the new system of record for audit ownership
- Any helper introduced for audit support must preserve the repo’s thin-tooling posture:
  - no hidden side effects
  - no rewriting unrelated story files
  - no silent status mutation outside the explicit BMAD workflow steps

### Library / Framework Requirements

- Stay aligned with the repo-pinned baseline when executing any supporting scripts or validations:
  - `next` `16.1.7`
  - `react` `19.2.3`
  - `react-dom` `19.2.3`
  - `@tanstack/react-query` `^5.0.0`
  - `zod` `^4.3.6`
  - `node` `24.x`
  - local `vitest` package under `tools/vitest-lite`
- Official-source checks completed on 2026-03-19:
  - Next.js route handlers remain the documented server boundary for internal app endpoints, which reinforces that Story 4.1 should not create a new endpoint just to manage review debt: https://nextjs.org/docs/app/getting-started/route-handlers
  - Vitest’s current guide still positions Vitest as the test framework baseline and documents `Node >= v20.0.0`, which remains compatible with the repo’s `24.x` engine contract for any audit-support tests: https://vitest.dev/guide/
  - Playwright’s current writing-tests guide continues to emphasize action-plus-assertion flows with automatic waiting, which remains relevant if any later Epic 4 remediation work needs end-to-end regression coverage, but Story 4.1 itself should stay artifact-focused: https://playwright.dev/docs/writing-tests
- Inference from those sources: the safest implementation is committed markdown or YAML artifacts plus, at most, a small Node-side helper or test. Do not build a browser-facing review console or route-handler-based review service for this story.

### File Structure Requirements

- Expected primary artifacts to add or update:
  - `docs/sprint-artifacts/4-1-audit-external-adversarial-findings-and-map-them-to-story-ids.md`
  - a new remediation register artifact under `docs/sprint-artifacts/` with a stable, reviewable name
  - `docs/sprint-artifacts/sprint-status.yaml` only if Story 4.1 workflow completion requires the status transition to `ready-for-dev` or later story-state updates
- Existing artifacts to inspect and reference:
  - `docs/sprint-change-proposal-2026-03-19.md`
  - `docs/sprint-artifacts/epic-2-retro-2026-03-19.md`
  - `docs/sprint-artifacts/epic-3-retro-2026-03-19.md`
  - completed story artifacts under `docs/sprint-artifacts/*.md`
  - any relevant agent or review logs under `logs/`
- If a helper script is added, keep it obviously non-runtime and isolated from product code. Suitable locations would be a small utility under `tools/` or an existing script area, not `src/app/*`, `src/features/*`, or `src/lib/server/*`.
- Naming expectations still apply:
  - markdown artifacts should use descriptive kebab-case names
  - helper modules should use `kebab-case`
  - do not create ambiguous filenames like `review.md` or `findings.txt`

### Testing Requirements

- Minimum verification for implementation:
  - `npm run lint`
  - `npm run typecheck`
  - `npm test`
  - `npm run build`
- If the story is implemented as documentation-only, verification still needs an artifact-integrity pass:
  - confirm every finding entry has the required fields
  - confirm every implicated story key exists in `sprint-status.yaml`
  - confirm stories not implicated remain untouched in tracking
  - confirm evidence links point to real repo artifacts or clearly identified log sources
- If a helper script or schema is added, cover it with focused unit tests rather than broad UI or route tests.
- Do not invent end-to-end coverage for Story 4.1 unless the implementation genuinely adds executable audit tooling.
- Treat artifact-sync validation as part of the acceptance bar. Epic 2 and Epic 3 retrospectives both called out closeout drift, so Story 4.1 should verify consistency across the new remediation register, this story artifact, and sprint tracking before it is closed.

### Git Intelligence Summary

- Recent commit history shows Epic 3 was the last completed implementation stream:
  - `3cc4ef6 feat(epic-3): implement 3-5-recover-the-display-after-interruption-or-restart`
  - `3a6ec9f feat(epic-3): implement 3-4-trigger-lightweight-refresh-and-trust-check-actions`
  - `8a12ce8 feat(epic-3): implement 3-3-diagnose-degraded-impact-by-signal-and-scope`
  - `93e5912 feat(epic-3): implement 3-2-show-public-readiness-and-current-ops-state`
  - `9eb1adf feat(epic-3): implement 3-1-provide-a-separate-local-only-ops-access-surface`
- Actionable implication: Story 4.1 is not extending a currently active feature branch pattern. It is correcting release-readiness traceability after feature delivery is already marked complete.
- The working tree already contains Epic 4 planning edits and one unrelated log artifact:
  - `docs/epics.md`
  - `docs/sprint-artifacts/sprint-status.yaml`
  - `docs/sprint-artifacts/3-1-provide-a-separate-local-only-ops-access-surface.md`
  - `logs/ralph-20260319-100642.log`
- Strong implication for implementation:
  - treat existing story artifacts as historical evidence, not as clean-room templates to rewrite wholesale
  - avoid reverting or “cleaning up” unrelated file changes while performing the audit
  - expect relevant external-review clues to appear in long logs and late-stage artifact updates rather than in one canonical existing register

### Latest Tech Information

- Official-source checks on 2026-03-19 did not surface any stack change that would alter the implementation direction for this story.
  - Next.js route handlers remain the right boundary for internal app endpoints, which is another reason not to build a route-based review-debt service for a documentation-first audit story.
  - Vitest remains compatible with the repo’s Node baseline for any small helper or schema tests.
  - Playwright remains relevant for later remediation stories, but Story 4.1 itself should stay artifact- and evidence-focused.
- Inference: there is no technical justification to expand Story 4.1 into runtime application work. The current stack supports keeping this story as traceability artifacts plus lightweight verification only.

### Project Structure Notes

- The repo already centralizes planning and story execution evidence under `docs/sprint-artifacts/`, so the remediation register should live there rather than in `docs/` root or under application source folders.
- One current project-structure wrinkle matters for the audit:
  - `docs/sprint-artifacts/1-6-display-verification-notes.md` and `docs/sprint-artifacts/2-5-live-reading-verification-notes.md` are supporting verification artifacts, not implementation stories
  - the audit should distinguish between story artifacts, epic retrospectives, sprint tracking, and auxiliary verification notes when mapping findings
- The highest-risk structural mistake would be creating a register that duplicates story closeout notes without adding ownership. The new artifact should complement the existing story files by answering:
  - what externally identified finding exists
  - where it came from
  - which story owns it now
  - whether it is unresolved, no-action, or already evidenced as closed

### References

- `docs/epics.md#Story 4.1: Audit External Adversarial Findings and Map Them to Story IDs`
- `docs/sprint-change-proposal-2026-03-19.md`
- `docs/sprint-artifacts/sprint-status.yaml`
- `docs/sprint-artifacts/epic-2-retro-2026-03-19.md`
- `docs/sprint-artifacts/epic-3-retro-2026-03-19.md`
- `_bmad/core/tasks/review-adversarial-general.xml`
- `package.json`
- official source checked 2026-03-19: `https://nextjs.org/docs/app/getting-started/route-handlers`
- official source checked 2026-03-19: `https://vitest.dev/guide/`
- official source checked 2026-03-19: `https://playwright.dev/docs/writing-tests`

### Project Context Reference

- No `project-context.md` file exists in this repository at the time of story creation.
- Story guidance was therefore derived from the current planning artifacts, sprint artifacts, package metadata, repo structure, git history, and the BMAD adversarial-review task definition.

### Completion Status

- Story context assembled from Epic 4 planning, sprint tracking, retrospectives, package metadata, repo artifact inventory, git history, and current official testing/framework documentation checked on 2026-03-19.
- Story 4.1 is implemented and code-reviewed as an audit-and-traceability story, not as a remediation or runtime feature story.
- The final audit outcome is evidence-disciplined: the repo proves a cross-story external-review traceability gap and an unresolved Epic 2 and Epic 3 candidate set, but it does not recover standalone external findings text for a narrower reopen list.
- The durable remediation register and sprint-tracking metadata now point Epic 4 follow-on work at source recovery or rerun review for the unresolved candidate set before any candidate story is reclosed.

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- `sed -n '1,260p' _bmad/core/tasks/workflow.xml`
- `sed -n '1,320p' _bmad/bmm/workflows/4-implementation/create-story/instructions.xml`
- `sed -n '1,260p' _bmad/bmm/workflows/4-implementation/create-story/template.md`
- `sed -n '1,220p' _bmad/bmm/workflows/4-implementation/create-story/checklist.md`
- `sed -n '1,260p' docs/sprint-artifacts/sprint-status.yaml`
- `sed -n '606,640p' docs/epics.md`
- `sed -n '1,240p' docs/sprint-change-proposal-2026-03-19.md`
- `sed -n '1,240p' docs/sprint-artifacts/epic-2-retro-2026-03-19.md`
- `sed -n '1,240p' docs/sprint-artifacts/epic-3-retro-2026-03-19.md`
- `sed -n '1,220p' package.json`
- `git log --oneline -5`
- `git diff --stat`
- `rg -n "adversarial|review|finding|findings|closure|external" logs docs/sprint-artifacts`
- `find logs -maxdepth 1 -type f | sort`
- `rg -n "Senior Developer Review \(AI\)" docs/sprint-artifacts/*.md`
- `sed -n '46690,46720p' logs/ralph-20260318-172217.log`
- `sed -n '116728,116742p' logs/ralph-20260318-172217.log`
- `sed -n '371838,371850p' logs/ralph-20260319-072518.log`
- `sed -n '229300,229312p' logs/ralph-20260319-100642.log`
- `sed -n '1,260p' docs/sprint-artifacts/external-adversarial-remediation-register.md`
- `rg -n "1-3-render-the-overall-departure-picture|1-5-anchor-the-display-with-a-fixed-local-map|3-1-provide-a-separate-local-only-ops-access-surface|3-5-recover-the-display-after-interruption-or-restart" docs/sprint-artifacts/sprint-status.yaml`
- `git status --porcelain`
- `git diff --name-only`
- `git diff --cached --name-only`
- `find logs -maxdepth 1 -type f | sort`
- `rg -n "\$bmad-bmm-code-review|code-review workflow|Senior Developer Review|review findings|review follow-up|Code review fixed" logs -S`
- `python3 -c 'import yaml; yaml.safe_load(open("docs/sprint-artifacts/sprint-status.yaml"))'`
- `npm run validate`

### Completion Notes List

- Created `docs/sprint-artifacts/external-adversarial-remediation-register.md` as the new source-of-truth register for external review debt, source inventory, impacted-story mapping, no-action rationale, and missing-source notes.
- Audited repo artifacts and every session log under `logs/`, then corrected the initial overreach during code review so internal BMAD review traces are treated as contextual evidence rather than pseudo-external findings.
- Left Epic 1 stories closed for external-debt scope, with `1.3` and `1.5` explicitly recorded as no-action/context-only because no separate external source identifies them.
- Left the approved Epic 2 candidate set `2.2`, `2.4`, `2.5` and Epic 3 candidate set `3.1`, `3.2`, `3.3`, `3.4`, `3.5` visible as unresolved until source recovery or rerun external adversarial review happens in follow-on Epic 4 work.
- Added explicit review-debt metadata to `sprint-status.yaml` so the sprint no longer reads as universally green without consulting the remediation register and candidate-story mapping.
- Verified artifact integrity by checking candidate story keys against `sprint-status.yaml`, validating YAML parsing, and rerunning the full repo gate with `npm run validate`.

### Change Log

- 2026-03-19: Implemented Story 4.1 by auditing repo artifacts and session logs, creating the external adversarial remediation register, mapping impacted stories to Epic 4 owner paths, and verifying the full validation gate.
- 2026-03-19: Senior code review corrected the audit boundary, restored the approved Epic 2 and Epic 3 candidate set, added sprint-level review-debt visibility, and reran validation.

### File List

- docs/sprint-artifacts/4-1-audit-external-adversarial-findings-and-map-them-to-story-ids.md
- docs/sprint-artifacts/external-adversarial-remediation-register.md
- docs/sprint-artifacts/sprint-status.yaml

## Senior Developer Review (AI)

### Reviewer

Workshop

### Date

2026-03-19

### Outcome

Approved after fixes

### Findings

1. High: The initial audit treated internal BMAD code-review traces as if they were standalone external adversarial findings, which violated the story boundary and incorrectly reopened stories from internal evidence alone.
2. High: The initial audit cleared the approved Epic 2 and Epic 3 candidate set with internal `Senior Developer Review (AI)` sections even though the governing change proposal said tracked story-loop closure does not prove separate external review closure.
3. High: Sprint tracking still let the delivered implementation stories read as universally closed because it exposed Epic 4 work but not the unresolved candidate-story mapping.
4. Medium: The remediation register did not enumerate the searched session-log set, so the audit could not be reproduced independently.

### Fixes Applied

- Reworked `docs/sprint-artifacts/external-adversarial-remediation-register.md` so governing external evidence, contextual internal evidence, the unresolved candidate set, and no-action Epic 1 observations are clearly separated.
- Corrected the impacted-story mapping so Epic 2 candidate stories `2.2`, `2.4`, `2.5` and Epic 3 candidate stories `3.1`, `3.2`, `3.3`, `3.4`, `3.5` remain visible pending source recovery or rerun external review, while `1.3` and `1.5` stay closed for external-debt scope.
- Added `review_debt_status` metadata to `docs/sprint-artifacts/sprint-status.yaml` so release readiness is visibly blocked on Epic 4 remediation without speculatively reopening stories during the audit-only phase.
- Updated this story artifact's completion notes, change log, and final status to match the corrected audit outcome.

### Validation

- `python3 -c 'import yaml; yaml.safe_load(open("docs/sprint-artifacts/sprint-status.yaml"))'`
- `npm run validate`
