# External Adversarial Remediation Register

Date: 2026-03-19
Status: closed
Owner Story: 4.1
Purpose: provide one source of truth for externally evidenced adversarial review debt, story mapping, and closure status before any completed story is reopened or reclosed.

## Audit Scope

- Audit target: externally identified adversarial review debt plus any repo-level traceability gaps that prevent the team from proving closure.
- Evidence preference order:
  1. persisted external review artifacts and approved planning artifacts that reference them
  2. persisted story artifacts and sprint artifacts
  3. retrospectives and session logs as contextual evidence only
- Important boundary:
  - approved planning artifacts can establish a candidate impact set that must remain visible until disproved or re-reviewed
  - internal `Senior Developer Review (AI)` sections, internal story notes, and session logs are contextual evidence; by themselves they do not constitute separate external adversarial findings
  - where no standalone external finding text can be recovered, the audit must leave story-level impact unresolved or blocked rather than narrowing to reopened stories from internal BMAD traces alone

## Source Inventory

### SRC-001

- Source: `docs/sprint-change-proposal-2026-03-19.md`
- Evidence type: direct
- Outcome: actionable
- Notes:
  - records the governing audit trigger
  - states no persisted repo artifact was found for separate external adversarial review outputs and their closure state
  - identifies the highest-risk candidate story set as `2.2`, `2.4`, `2.5`, `3.2`, `3.3`, `3.4`, `3.5`, with `3.1` also called out for closeout risk

### SRC-002

- Source: `docs/sprint-artifacts/epic-2-retro-2026-03-19.md`
- Evidence type: contextual
- Outcome: supports internal closeout history only
- Notes:
  - confirms internal story records show resolved review cycles for Epic 2
  - identifies artifact-sync lag as a recurring process risk
  - does not itself prove separate external review closure

### SRC-003

- Source: `docs/sprint-artifacts/epic-3-retro-2026-03-19.md`
- Evidence type: contextual
- Outcome: supports internal closeout history plus one artifact-sync warning
- Notes:
  - confirms story `3.1` had a stale status mismatch corrected during retrospective closeout
  - identifies artifact and semantic drift at closeout as the highest recurring process risk
  - confirms `3.2` through `3.5` had internal review and fix cycles, which is useful context but not standalone external-review proof

### SRC-004

- Source: `docs/sprint-artifacts/*.md`
- Evidence type: contextual
- Outcome: supports internal BMAD closeout history only
- Notes:
  - some stories persist `Senior Developer Review (AI)` sections while others only preserve review traces in change logs or completion notes
  - that uneven structure matters for process hygiene, but it does not by itself establish or clear separate external adversarial debt

### SRC-005

- Source: `logs/ralph-20260318-171506.log`
- Evidence type: contextual
- Outcome: searched, no standalone external adversarial findings recovered
- Notes:
  - no story-specific external finding text recovered

### SRC-006

- Source: `logs/ralph-20260318-171623.log`
- Evidence type: contextual
- Outcome: searched, no standalone external adversarial findings recovered
- Notes:
  - no story-specific external finding text recovered

### SRC-007

- Source: `logs/ralph-20260318-171736.log`
- Evidence type: contextual
- Outcome: searched, no standalone external adversarial findings recovered
- Notes:
  - no story-specific external finding text recovered

### SRC-008

- Source: `logs/ralph-20260318-172105.log`
- Evidence type: contextual
- Outcome: searched, no standalone external adversarial findings recovered
- Notes:
  - no story-specific external finding text recovered

### SRC-009

- Source: `logs/ralph-20260318-172136.log`
- Evidence type: contextual
- Outcome: searched, no standalone external adversarial findings recovered
- Notes:
  - no story-specific external finding text recovered

### SRC-010

- Source: `logs/ralph-20260318-172151.log`
- Evidence type: contextual
- Outcome: searched, no standalone external adversarial findings recovered
- Notes:
  - no story-specific external finding text recovered

### SRC-011

- Source: `logs/ralph-20260318-172217.log`
- Evidence type: contextual
- Outcome: searched, internal BMAD review traces found
- Notes:
  - contains BMAD code-review workflow traces for stories `1.3` and `1.5`
  - no separate external adversarial findings artifact was recovered

### SRC-012

- Source: `logs/ralph-20260319-072518.log`
- Evidence type: contextual
- Outcome: searched, internal BMAD review traces found
- Notes:
  - contains BMAD code-review workflow traces for Epic 2 stories and story `3.1`
  - no separate external adversarial findings artifact was recovered

### SRC-013

- Source: `logs/ralph-20260319-100642.log`
- Evidence type: contextual
- Outcome: searched, internal BMAD review traces found
- Notes:
  - contains BMAD code-review workflow traces for stories `3.2` through `3.5`
  - no separate external adversarial findings artifact was recovered

### SRC-014

- Source:
  - `src/lib/contracts/freshness.js`
  - `src/lib/server/dashboard/build-dashboard-snapshot.js`
  - `src/features/dashboard/presenters/dashboard-presenter.js`
  - `tests/unit/dashboard.trust.test.mjs`
  - `tests/unit/dashboard.live-path.test.mjs`
  - `docs/sprint-artifacts/2-2-show-trend-and-freshness-where-confidence-matters.md`
- Evidence type: rerun external review
- Outcome: no new defect recovered for Story `2.2`
- Notes:
  - no standalone external findings text was recovered for Story `2.2` in this rerun pass
  - rerun review confirmed trend remains bound to recent state-history evidence and trust narrowing stays local
  - fallback paths do not invent optimistic freshness or synthetic trend cues

### SRC-015

- Source:
  - `src/lib/server/dashboard/build-dashboard-snapshot.js`
  - `src/lib/server/dashboard/dashboard-service.js`
  - `src/features/dashboard/presenters/dashboard-presenter.js`
  - `tests/unit/dashboard.live-path.test.mjs`
  - `tests/unit/dashboard.presenter.test.mjs`
  - `docs/sprint-artifacts/2-4-preserve-honest-usefulness-during-provider-failure.md`
- Evidence type: rerun external review
- Outcome: no new defect recovered for Story `2.4`
- Notes:
  - no standalone external findings text was recovered for Story `2.4` in this rerun pass
  - rerun review confirmed degraded and unavailable states stay localized and distinct from true disruption semantics
  - mixed live plus carried-forward behavior remains canonical in the shared snapshot and presenter path

### SRC-016

- Source:
  - `src/features/dashboard/components/DashboardLiveScreen.tsx`
  - `src/features/dashboard/hooks/useDashboardQuery.ts`
  - `src/features/dashboard/presenters/dashboard-presenter.js`
  - `src/app/globals.css`
  - `tests/unit/dashboard.live-path.test.mjs`
  - `tests/unit/dashboard.presenter.test.mjs`
  - `tests/smoke/startup-smoke.test.mjs`
  - `docs/sprint-artifacts/2-5-maintain-stable-live-reading-during-updates-and-motion-changes.md`
- Evidence type: rerun external review
- Outcome: no new defect recovered for Story `2.5`
- Notes:
  - no standalone external findings text was recovered for Story `2.5` in this rerun pass
  - rerun review confirmed delta-based live summaries, stable reading-order hooks, and reduced-motion-safe meaning remain explicit
  - the live path preserves the existing shell without loading-takeover behavior

## Findings Register

### EAR-001: Repo-level external review debt had no persisted register or closure matrix

- Evidence type: direct
- Source(s):
  - `docs/sprint-change-proposal-2026-03-19.md`
- Summary:
  - the repo had no dedicated source-of-truth artifact that tied external adversarial review outputs to story ownership and closure state
- Affected artifact(s):
  - `docs/sprint-artifacts/sprint-status.yaml`
  - completed story artifacts under `docs/sprint-artifacts/*.md`
- Affected completed story IDs:
  - `3.1`
  - `3.2`
  - `3.4`
  - `3.5`
- Epic 4 owner path:
  - `4.1` create and maintain the register
  - `4.5` enforce explicit re-review and re-close evidence
- Closure state: closed
- Rationale:
  - Story `4.1` created the register, and Story `4.5` synchronized explicit per-story closure evidence plus sprint tracking so repo status no longer outruns review proof

### EAR-002: Story-level external review impact remains unresolved for Epic 3 because standalone external outputs were not recovered

- Evidence type: direct plus inference from direct sources
- Source(s):
  - `docs/sprint-change-proposal-2026-03-19.md`
  - `docs/sprint-artifacts/epic-2-retro-2026-03-19.md`
  - `docs/sprint-artifacts/epic-3-retro-2026-03-19.md`
  - searched `logs/*` inventory in this register
- Summary:
  - the approved change proposal identified a highest-risk story set, but the repo does not preserve the standalone external adversarial output needed to prove which Epic 3 stories are clear or still affected
- Affected artifact(s):
  - `docs/sprint-artifacts/sprint-status.yaml`
  - candidate story artifacts under `docs/sprint-artifacts/*.md`
  - repo session logs under `logs/`
- Affected completed story IDs:
  - `3.1`
  - `3.2`
  - `3.3`
  - `3.4`
  - `3.5`
- Epic 4 owner path:
  - `4.4` recover or rerun external review for Epic 3 candidate stories
  - `4.5` require explicit internal review, external adversarial review, validation, and artifact-sync evidence before re-close
- Closure state: closed - Epic 3 rerun review and final closure evidence completed in Story `4.5`
- Rationale:
  - internal BMAD review sections and session logs remained contextual only throughout Epic 4
  - Story `4.4` reran external review and remediated the evidence-backed Epic 3 defects
  - Story `4.5` then recorded explicit internal review, external adversarial review, validation, and artifact-sync evidence before returning `3.1`, `3.2`, `3.4`, and `3.5` to `done`

### EAR-003: Stories 1.3 and 1.5 show internal BMAD review activity but no recovered external source

- Evidence type: direct
- Source(s):
  - `docs/sprint-artifacts/1-3-render-the-overall-departure-picture.md`
  - `docs/sprint-artifacts/1-5-anchor-the-display-with-a-fixed-local-map.md`
  - `logs/ralph-20260318-172217.log`
- Summary:
  - stories `1.3` and `1.5` preserve internal code-review activity and follow-up notes, but no separate external adversarial source identifies either story as outstanding external review debt
- Affected artifact(s):
  - `docs/sprint-artifacts/1-3-render-the-overall-departure-picture.md`
  - `docs/sprint-artifacts/1-5-anchor-the-display-with-a-fixed-local-map.md`
- Affected completed story IDs:
  - none for external-debt remediation
- Epic 4 owner path:
  - no-action for external-debt scope
- Closure state: no-action
- Rationale:
  - Story 4.1 must not convert internal BMAD review traces into pseudo-external findings

## Epic 2 Rerun Decisions

### E2-RERUN-2.2

- Story ID: `2.2`
- Recovery result:
  - no standalone external adversarial findings text was recovered from approved planning artifacts, remediation records, or repo session logs
- Rerun review evidence:
  - `src/lib/contracts/freshness.js`
  - `src/lib/server/dashboard/build-dashboard-snapshot.js`
  - `src/features/dashboard/presenters/dashboard-presenter.js`
  - `tests/unit/dashboard.trust.test.mjs`
  - `tests/unit/dashboard.live-path.test.mjs`
- Decision:
  - no-code / no-action after rerun external adversarial review
- Closure state:
  - cleared in Story `4.3`; Story `2.2` remains `done`
- Story `4.5` handoff:
  - no story-level re-close work required for `2.2`
- Rationale:
  - rerun review did not recover a new evidence-backed defect in trend gating, local trust narrowing, or fallback truthfulness

### E2-RERUN-2.4

- Story ID: `2.4`
- Recovery result:
  - no standalone external adversarial findings text was recovered from approved planning artifacts, remediation records, or repo session logs
- Rerun review evidence:
  - `src/lib/server/dashboard/build-dashboard-snapshot.js`
  - `src/lib/server/dashboard/dashboard-service.js`
  - `src/features/dashboard/presenters/dashboard-presenter.js`
  - `tests/unit/dashboard.live-path.test.mjs`
  - `tests/unit/dashboard.presenter.test.mjs`
- Decision:
  - no-code / no-action after rerun external adversarial review
- Closure state:
  - cleared in Story `4.3`; Story `2.4` remains `done`
- Story `4.5` handoff:
  - no story-level re-close work required for `2.4`
- Rationale:
  - rerun review did not recover a new evidence-backed defect in localized degraded-state handling, unavailable-path honesty, or mixed-snapshot semantics

### E2-RERUN-2.5

- Story ID: `2.5`
- Recovery result:
  - no standalone external adversarial findings text was recovered from approved planning artifacts, remediation records, or repo session logs
- Rerun review evidence:
  - `src/features/dashboard/components/DashboardLiveScreen.tsx`
  - `src/features/dashboard/hooks/useDashboardQuery.ts`
  - `src/features/dashboard/presenters/dashboard-presenter.js`
  - `src/app/globals.css`
  - `tests/unit/dashboard.live-path.test.mjs`
  - `tests/unit/dashboard.presenter.test.mjs`
  - `tests/smoke/startup-smoke.test.mjs`
- Decision:
  - no-code / no-action after rerun external adversarial review
- Closure state:
  - cleared in Story `4.3`; Story `2.5` remains `done`
- Story `4.5` handoff:
  - no story-level re-close work required for `2.5`
- Rationale:
  - rerun review did not recover a new evidence-backed defect in live-shell stability, delta-based update meaning, or reduced-motion-safe presentation

## Epic 3 Rerun Decisions

### E3-RERUN-3.1

- Story ID: `3.1`
- Recovery result:
  - no standalone external adversarial findings text was recovered from approved planning artifacts, remediation records, or repo session logs
- Rerun review evidence:
  - `src/lib/server/security/assert-ops-access.js`
  - `src/lib/server/ops/create-ops-health-route-response.js`
  - `src/lib/server/ops/create-ops-actions-route-response.js`
  - `tests/unit/ops-access.test.mjs`
  - `tests/unit/ops-health.test.mjs`
  - `tests/unit/ops-maintenance-action.test.mjs`
- Decision:
  - reopened and remediated in Story `4.4`
- Closure state:
  - evidence-backed fix applied in Story `4.4`, and Story `4.5` completed final internal review, external adversarial review confirmation, validation, and closure sync; Story `3.1` is now `done` in sprint tracking
- Story `4.5` handoff:
  - completed; no further story-level closeout work remains for `3.1`
- Rationale:
  - rerun review showed the local-only gate accepted an allowlisted forwarded host alongside a denied direct host, denied ops responses were not returned with the same `no-store` plus host-varying headers used for allowed reads, and the hardening pass still needed standards-compliant `Forwarded` host parsing

### E3-RERUN-3.2

- Story ID: `3.2`
- Recovery result:
  - no standalone external adversarial findings text was recovered from approved planning artifacts, remediation records, or repo session logs
- Rerun review evidence:
  - `src/lib/server/ops/get-ops-health.js`
  - `src/lib/server/ops/create-ops-health-route-response.js`
  - `tests/unit/ops-health.test.mjs`
- Decision:
  - reopened and remediated in Story `4.4`
- Closure state:
  - evidence-backed fix applied in Story `4.4`, and Story `4.5` completed final internal review, external adversarial review confirmation, validation, and closure sync; Story `3.2` is now `done` in sprint tracking
- Story `4.5` handoff:
  - completed; no further story-level closeout work remains for `3.2`
- Rationale:
  - rerun review showed ops health recovery evidence could label an ordinary last-safe runtime fallback as restart recovery, and denied ops-health responses needed the same cache-isolation headers as successful local reads

### E3-RERUN-3.3

- Story ID: `3.3`
- Recovery result:
  - no standalone external adversarial findings text was recovered from approved planning artifacts, remediation records, or repo session logs
- Rerun review evidence:
  - `src/lib/server/ops/get-degraded-impact-diagnostics.js`
  - `tests/unit/ops-health.test.mjs`
- Decision:
  - no-code / no-action after rerun external adversarial review
- Closure state:
  - cleared in Story `4.4`; Story `3.3` remains `done`
- Story `4.5` handoff:
  - no story-level re-close work required for `3.3`
- Rationale:
  - rerun review did not recover a new evidence-backed defect in degraded-impact scope classification, affected-area summaries, or healthy-area evidence

### E3-RERUN-3.4

- Story ID: `3.4`
- Recovery result:
  - no standalone external adversarial findings text was recovered from approved planning artifacts, remediation records, or repo session logs
- Rerun review evidence:
  - `src/lib/server/ops/create-ops-actions-route-response.js`
  - `tests/unit/ops-maintenance-action.test.mjs`
- Decision:
  - reopened and remediated in Story `4.4`
- Closure state:
  - evidence-backed fix applied in Story `4.4`, and Story `4.5` completed final internal review, external adversarial review confirmation, validation, and closure sync; Story `3.4` is now `done` in sprint tracking
- Story `4.5` handoff:
  - completed; no further story-level closeout work remains for `3.4`
- Rationale:
  - rerun review showed denied ops-action responses needed the same `no-store` and host-varying headers as successful maintenance responses to keep the write surface fail-closed under host-based gating

### E3-RERUN-3.5

- Story ID: `3.5`
- Recovery result:
  - no standalone external adversarial findings text was recovered from approved planning artifacts, remediation records, or repo session logs
- Rerun review evidence:
  - `src/lib/server/dashboard/dashboard-service.js`
  - `src/lib/server/ops/get-ops-health.js`
  - `src/features/ops/ops-shell-view.js`
  - `tests/unit/dashboard.live-path.test.mjs`
  - `tests/unit/ops-health.test.mjs`
  - `tests/unit/ops-shell.test.mjs`
- Decision:
  - reopened and remediated in Story `4.4`
- Closure state:
  - evidence-backed fix applied in Story `4.4`, and Story `4.5` completed final internal review, external adversarial review confirmation, validation, and closure sync; Story `3.5` is now `done` in sprint tracking
- Story `4.5` handoff:
  - completed; no further story-level closeout work remains for `3.5`
- Rationale:
  - rerun review showed ordinary runtime build failures could be relabeled as restart recovery, so the restart path needed to stay distinct from carried-forward runtime narrowing all the way through the operator-facing ops shell

## Impacted Story Map

### Epic 1

- Candidate impacted stories from recovered external evidence:
  - none
- No-action rationale:
  - stories `1.3` and `1.5` show internal BMAD review activity in story artifacts and logs, but no separate external source identifies them as outstanding external-review debt

### Epic 2

- Candidate impacted stories pending external source recovery or rerun:
  - none
- Cleared after Story `4.3` rerun external review:
  - `2.2`
  - `2.4`
  - `2.5`
- Epic 4 owner path:
  - `4.3`
- Current state:
  - rerun external review completed in Story `4.3`
  - no evidence-backed Epic 2 defect was recovered, so the stories remain `done`
  - no Epic 2 story-level `4.5` re-close path is required

### Epic 3

- Candidate impacted stories pending external source recovery or rerun:
  - none
- Cleared after Story `4.4` rerun external review:
  - `3.3`
- Cleared after Story `4.5` final re-review and re-close:
  - `3.1`
  - `3.2`
  - `3.4`
  - `3.5`
- Epic 4 owner path:
  - `4.4`
  - `4.5`
- Current state:
  - rerun external review completed in Story `4.4`
  - Story `3.3` cleared with no evidence-backed defect recovered
  - Story `4.5` completed internal review, external adversarial review, validation, and artifact-sync closure evidence for `3.1`, `3.2`, `3.4`, and `3.5`
  - all previously reopened Epic 3 stories have now returned to `done` in sprint tracking

## Stories Left Closed For Now

- Epic 1:
  - `1.1`
  - `1.2`
  - `1.3`
  - `1.4`
  - `1.5`
  - `1.6`
- Epic 2:
  - `2.1`
  - `2.3`
- Rationale:
  - these stories are either outside the approved candidate set or only supported by internal BMAD review traces rather than recovered external adversarial evidence
  - keeping them closed during Story 4.1 preserved the audit-only boundary; Epic 3 remains the unresolved candidate set above, while Epic 2 is now explicitly cleared after Story `4.3`

## Missing-Source Cases

- No standalone external adversarial findings report was found in the repo for post-delivery review debt.
- All nine repo session logs under `logs/` were searched; none preserved a standalone external adversarial findings artifact or complete external finding list.
- Because of that limitation, Epic 3 was handled in Story `4.4` through rerun external review rather than source recovery; Story `4.5` then closed the remaining re-review path for the remediated stories.
- Epic 2 was cleared in Story `4.3` through rerun external review, not by recovering a standalone external findings artifact.

## Next Actions

1. Use this register as the historical source of truth for the Epic 4 remediation and closure path.
2. Treat Epic 2 stories `2.2`, `2.4`, and `2.5` as cleared by Story `4.3`, Story `3.3` as cleared by Story `4.4`, and Stories `3.1`, `3.2`, `3.4`, and `3.5` as re-closed by Story `4.5`.
3. Treat release readiness as evidence-backed from current repo evidence unless new external adversarial findings are recovered later.
