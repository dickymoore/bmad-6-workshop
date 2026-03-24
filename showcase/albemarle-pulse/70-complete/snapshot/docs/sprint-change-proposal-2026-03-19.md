# Sprint Change Proposal

Date: 2026-03-19
Project: bmad-6-workshop-migration
Workflow: Correct Course
Change Trigger: External adversarial review findings may exist outside the BMAD story review loop, so the sprint can report `done` while review debt still exists.
Mode: Batch
Recommended Scope Classification: Moderate

## 1. Issue Summary

### Problem Statement

The current BMAD implementation artifacts are internally consistent, but they only prove closure of the tracked story review loop. They do not prove that separately run external adversarial reviews were mapped, remediated, re-reviewed, and explicitly closed.

As a result, the repository can show a fully completed sprint while external review debt may still exist. That creates a release-readiness risk and a traceability gap between "artifact says done" and "all known findings were actually resolved."

### Discovery Context

The issue was identified after product delivery closeout while checking whether adversarial reviews had been followed through by the code agents.

### Evidence

- [sprint-status.yaml](/home/codexuser/bmad-6-workshop/docs/sprint-artifacts/sprint-status.yaml) shows all three epics and all sixteen implementation stories as `done`.
- [epic-2-retro-2026-03-19.md](/home/codexuser/bmad-6-workshop/docs/sprint-artifacts/epic-2-retro-2026-03-19.md) states that story records show `16 review findings resolved across implementation and follow-up review cycles`.
- [epic-3-retro-2026-03-19.md](/home/codexuser/bmad-6-workshop/docs/sprint-artifacts/epic-3-retro-2026-03-19.md) states that no unresolved review findings remain in Epic 3 story artifacts after closeout.
- Story artifacts contain many references to internal review fixes and follow-up review cycles, for example:
  - [2-2-show-trend-and-freshness-where-confidence-matters.md](/home/codexuser/bmad-6-workshop/docs/sprint-artifacts/2-2-show-trend-and-freshness-where-confidence-matters.md)
  - [2-4-preserve-honest-usefulness-during-provider-failure.md](/home/codexuser/bmad-6-workshop/docs/sprint-artifacts/2-4-preserve-honest-usefulness-during-provider-failure.md)
  - [2-5-maintain-stable-live-reading-during-updates-and-motion-changes.md](/home/codexuser/bmad-6-workshop/docs/sprint-artifacts/2-5-maintain-stable-live-reading-during-updates-and-motion-changes.md)
  - [3-2-show-public-readiness-and-current-ops-state.md](/home/codexuser/bmad-6-workshop/docs/sprint-artifacts/3-2-show-public-readiness-and-current-ops-state.md)
  - [3-3-diagnose-degraded-impact-by-signal-and-scope.md](/home/codexuser/bmad-6-workshop/docs/sprint-artifacts/3-3-diagnose-degraded-impact-by-signal-and-scope.md)
  - [3-4-trigger-lightweight-refresh-and-trust-check-actions.md](/home/codexuser/bmad-6-workshop/docs/sprint-artifacts/3-4-trigger-lightweight-refresh-and-trust-check-actions.md)
  - [3-5-recover-the-display-after-interruption-or-restart.md](/home/codexuser/bmad-6-workshop/docs/sprint-artifacts/3-5-recover-the-display-after-interruption-or-restart.md)
- No persisted repo artifact was found that acts as a source-of-truth register for separate external adversarial review outputs and their closure state.

### Trigger Classification

- Triggering story: cross-story closeout gap discovered after Epic 3 completion, not one isolated story failure
- Issue type: process and traceability gap revealed after implementation
- Core problem: external adversarial findings are not enforced as part of story closeout, so "done" can overstate actual review closure

## 2. Impact Analysis

### Epic Impact

- Epic 1, Epic 2, and Epic 3 remain product-valid. Their user-facing goals, FR coverage, and architecture alignment still hold.
- The issue does not require redefining existing epics.
- A new remediation epic is required to reconcile external adversarial review debt before release hardening or new roadmap work continues.
- New implementation or release work should not be treated as the next priority until review-debt closure is complete.

### Story Impact

- Any completed story that is referenced by unresolved external adversarial findings may need to be reopened from `done` back to `review`.
- The highest-risk stories are those already showing repeated internal review corrections around truthfulness, degraded states, action-result honesty, or artifact sync:
  - Story 2.2
  - Story 2.4
  - Story 2.5
  - Story 3.2
  - Story 3.3
  - Story 3.4
  - Story 3.5
- Story 3.1 also demonstrates the closeout-risk pattern because the Epic 3 retrospective had to correct a stale artifact status after the story had effectively closed.

### Artifact Conflict Analysis

- PRD conflict: none identified
- Architecture conflict: none identified
- UI/UX conflict: none identified
- Artifact updates required:
  - [epics.md](/home/codexuser/bmad-6-workshop/docs/epics.md)
  - [sprint-status.yaml](/home/codexuser/bmad-6-workshop/docs/sprint-artifacts/sprint-status.yaml)
  - affected story artifacts in [docs/sprint-artifacts](/home/codexuser/bmad-6-workshop/docs/sprint-artifacts)
  - this change proposal document

### Technical Impact

- No architecture reset is required.
- No PRD scope reduction is required.
- The work is operationally significant because it may trigger code remediation across public-display, degraded-state, and ops/recovery stories.
- The main risk is false release confidence: the repo can look green while separate review debt is still unresolved.

## 3. Path Forward Evaluation

### Option 1: Direct Adjustment

Status: Viable

- Add a remediation epic and backlog entries without rewriting product scope.
- Audit all external adversarial findings first.
- Reopen only the stories actually implicated by the audit.
- Re-run internal code review and external adversarial review before re-closing each reopened story.

Effort: Medium
Risk: Low to Medium

### Option 2: Potential Rollback

Status: Not viable

- Rolling back completed epics would not solve the traceability problem.
- The architecture and implemented feature set are not the issue.
- This would destroy valid progress and create unnecessary churn.

Effort: High
Risk: High

### Option 3: PRD MVP Review

Status: Not viable

- The issue is not that MVP is unachievable.
- The product definition, UX direction, and architecture are still coherent.
- Reducing scope would not close unknown review debt.

Effort: Medium
Risk: Medium

### Recommended Path

Selected approach: Option 1, Direct Adjustment with backlog reorganization

Rationale:

- It corrects the real problem, which is missing closure traceability.
- It preserves the validated product and architecture work already completed.
- It gives the team a controlled audit-first way to reopen only the stories that actually need remediation.
- It creates an explicit green-gate rule so stories cannot be considered closed again until both internal and external review evidence are present.

## 4. Detailed Change Proposals

### 4.1 Stories and Epics

#### Proposal A: Add a remediation epic to `epics.md`

Artifact: [epics.md](/home/codexuser/bmad-6-workshop/docs/epics.md)
Section: Epic List

OLD:

```md
### Epic 3: Venue Operations and Public Reliability
Venue-side operators can confirm readiness, understand degraded impact, and return the display to public service quickly without exposing internals to visitors.
```

NEW:

```md
### Epic 4: Review Debt Closure and Release Readiness
The product team can prove that all externally identified adversarial review findings are traced, remediated, re-reviewed, and explicitly closed before the release state is treated as complete.
**FRs covered:** Cross-cutting verification for FR15-FR22, FR30-FR34, FR38 and supporting reliability, degraded-state, and recovery NFRs.
```

Rationale:

- Existing epics remain feature-complete.
- The gap is cross-cutting remediation and release confidence.
- A separate remediation epic keeps the correction visible without corrupting the original feature breakdown.

#### Proposal B: Add five remediation stories under Epic 4

Artifact: [epics.md](/home/codexuser/bmad-6-workshop/docs/epics.md)
Section: New Epic 4 stories

OLD:

```md
No remediation epic or stories exist after Epic 3.
```

NEW:

```md
### Story 4.1: Audit External Adversarial Findings and Map Them to Story IDs
As the project team,
I want every external adversarial finding collected and mapped to the exact affected story and artifact,
So that no review debt remains unowned or ambiguous.

### Story 4.2: Reopen and Remediate Epic 1 Review Debt
As the project team,
I want any Epic 1 stories implicated by the audit reopened and corrected,
So that the shared departure display closes with explicit review evidence.

### Story 4.3: Reopen and Remediate Epic 2 Review Debt
As the project team,
I want any Epic 2 stories implicated by the audit reopened and corrected,
So that live-truthfulness and degraded-state behavior close with explicit review evidence.

### Story 4.4: Reopen and Remediate Epic 3 Review Debt
As the project team,
I want any Epic 3 stories implicated by the audit reopened and corrected,
So that ops, readiness, maintenance, and recovery behavior close with explicit review evidence.

### Story 4.5: Re-Review and Re-Close Only Green Stories
As the project team,
I want every reopened story to pass internal code review, external adversarial review, and validation again before closure,
So that the repo's done state matches real review completion.
```

Rationale:

- Story 4.1 prevents guessing which completed stories are actually affected.
- Stories 4.2 to 4.4 group remediation by the existing epic boundaries.
- Story 4.5 prevents the same closeout gap from recurring during the cleanup itself.

### 4.2 Sprint Tracking

#### Proposal C: Add Epic 4 and remediation backlog entries to `sprint-status.yaml`

Artifact: [sprint-status.yaml](/home/codexuser/bmad-6-workshop/docs/sprint-artifacts/sprint-status.yaml)
Section: `development_status`

OLD:

```yaml
  epic-3: done
  3-1-provide-a-separate-local-only-ops-access-surface: done
  3-2-show-public-readiness-and-current-ops-state: done
  3-3-diagnose-degraded-impact-by-signal-and-scope: done
  3-4-trigger-lightweight-refresh-and-trust-check-actions: done
  3-5-recover-the-display-after-interruption-or-restart: done
  epic-3-retrospective: done
```

NEW:

```yaml
  epic-3: done
  3-1-provide-a-separate-local-only-ops-access-surface: done
  3-2-show-public-readiness-and-current-ops-state: done
  3-3-diagnose-degraded-impact-by-signal-and-scope: done
  3-4-trigger-lightweight-refresh-and-trust-check-actions: done
  3-5-recover-the-display-after-interruption-or-restart: done
  epic-3-retrospective: done
  epic-4: backlog
  4-1-audit-external-adversarial-findings-and-map-them-to-story-ids: backlog
  4-2-reopen-and-remediate-epic-1-review-debt: backlog
  4-3-reopen-and-remediate-epic-2-review-debt: backlog
  4-4-reopen-and-remediate-epic-3-review-debt: backlog
  4-5-rerun-reviews-and-close-only-green-stories: backlog
  epic-4-retrospective: optional
```

Rationale:

- The sprint needs a first-class tracked remediation workstream.
- This keeps the completed feature epics intact while surfacing remaining quality work honestly.
- The next BMAD implementation recommendation will route into create-story for the remediation epic instead of falsely implying nothing remains.

#### Proposal D: Reopen affected completed stories only after Story 4.1 maps them

Artifact: [sprint-status.yaml](/home/codexuser/bmad-6-workshop/docs/sprint-artifacts/sprint-status.yaml) and affected story files
Section: story status transitions

OLD:

```md
Completed stories remain `done` unless a developer manually discovers and edits them later.
```

NEW:

```md
After Story 4.1 completes, every story named in the audit moves from `done` back to `review` before remediation begins.
It returns to `done` only when:
- remediation changes are implemented
- internal code review is green
- external adversarial review is green
- validation is rerun successfully
- the story artifact records the closure evidence
```

Rationale:

- This prevents reopening stories based on guesswork.
- It still enforces the user's requirement that every affected story be corrected and re-reviewed before closure.

### 4.3 Story Artifact Closeout Rule

#### Proposal E: Add a required review-evidence section to every reopened story artifact

Artifact: affected files in [docs/sprint-artifacts](/home/codexuser/bmad-6-workshop/docs/sprint-artifacts)
Section: story closeout notes

OLD:

```md
Story closeout can cite review fixes and validation success, but there is no required matrix tying external adversarial findings to closure.
```

NEW:

```md
## Review Debt Closure

- External finding source:
- Finding IDs or summary:
- Reopened from status:
- Remediation summary:
- Internal code review result:
- External adversarial review result:
- Validation rerun:
- Closure decision:
```

Rationale:

- This creates one visible closure contract per reopened story.
- It turns review debt from an implied state into an auditable one.

### 4.4 PRD, Architecture, and UX

#### Proposal F: No changes to PRD, architecture, or UX specifications

Artifacts:

- [prd.md](/home/codexuser/bmad-6-workshop/docs/prd.md)
- [architecture.md](/home/codexuser/bmad-6-workshop/docs/architecture.md)
- [ux-design-specification.md](/home/codexuser/bmad-6-workshop/docs/ux-design-specification.md)

Decision:

- No text changes recommended.

Rationale:

- The issue is not product scope, architecture coherence, or UX direction.
- The issue is release-governance and story-closeout traceability.

## 5. Implementation Handoff

### Scope Classification

Moderate

This is not a fundamental replan, but it does require backlog reorganization, new tracked stories, and coordinated remediation across completed implementation artifacts.

### Handoff Recipients

- Scrum Master / Product coordination
  - add Epic 4 and remediation stories
  - update sprint tracking
  - drive story reopening and closure discipline
- Development team
  - implement code and artifact remediation for each reopened story
- QA / review owner
  - rerun validation and external adversarial review
  - confirm that each reopened story has full closure evidence
- Architect
  - engage only if audit findings reveal a real architecture defect rather than a story-level implementation or review-gap issue

### Success Criteria

- Every external adversarial finding is either mapped to a story or explicitly closed as non-actionable.
- Every affected story is reopened from `done` before remediation starts.
- Every reopened story is re-reviewed internally and externally before being closed again.
- Every reopened story records closure evidence directly in its story artifact.
- `sprint-status.yaml` no longer implies full completion while unresolved external review debt exists.
- New roadmap or release work begins only after Epic 4 is complete or explicitly waived.

## 6. Checklist Summary

### Section 1: Understand the Trigger and Context

- 1.1 Triggering story: [x] Done
- 1.2 Core problem defined: [x] Done
- 1.3 Evidence gathered: [x] Done

### Section 2: Epic Impact Assessment

- 2.1 Current epic impact: [x] Done
- 2.2 Epic-level changes required: [x] Done
- 2.3 Future epic impact reviewed: [x] Done
- 2.4 Need for new epic assessed: [x] Done
- 2.5 Priority and order reviewed: [x] Done

### Section 3: Artifact Conflict and Impact Analysis

- 3.1 PRD conflict check: [N/A] No PRD scope conflict
- 3.2 Architecture conflict check: [N/A] No architecture conflict
- 3.3 UX conflict check: [N/A] No UX conflict
- 3.4 Other artifact impact: [x] Done

### Section 4: Path Forward Evaluation

- 4.1 Direct adjustment: [x] Viable
- 4.2 Rollback: [x] Not viable
- 4.3 PRD MVP review: [x] Not viable
- 4.4 Recommended path selected: [x] Done

### Section 5: Sprint Change Proposal Components

- 5.1 Issue summary: [x] Done
- 5.2 Epic and artifact impact: [x] Done
- 5.3 Recommended path with rationale: [x] Done
- 5.4 MVP impact and action plan: [x] Done
- 5.5 Agent handoff plan: [x] Done

### Section 6: Final Review and Handoff

- 6.1 Checklist completion: [x] Done
- 6.2 Proposal accuracy review: [x] Done
- 6.3 User approval: [!] Action-needed
- 6.4 Sprint status update after approval: [!] Action-needed
- 6.5 Next-step handoff confirmation: [!] Action-needed

## Recommendation

Approve this proposal, then make Epic 4 the active remediation workstream. Do not treat the current repo as fully review-closed until Story 4.1 has audited external adversarial findings and every affected story has been reopened, corrected, re-reviewed, and reclosed with explicit evidence.
