# Sprint Change Proposal

Date: 2026-03-20
Project: bmad-6-workshop-migration
Workflow: Correct Course
Change Trigger: The live public display at `http://localhost:3000/` is not functioning like a clear one-screen information board. It is dull, text-heavy, scroll-dependent, unclear at a glance, weak in status grammar, and not beautiful or obviously useful in the way a foyer departure board should be.
Mode: Incremental
Recommended Scope Classification: Moderate

## 1. Issue Summary

### Problem Statement

The current public display implementation is technically complete but is not meeting the approved product and UX bar. In live use it reads as verbose, difficult to follow, and visually underpowered. It fails the intended `glance, orient, decide` behavior and does not behave like a clear, shared public information board.

The most important failures are:

- the default public view is not meaningfully readable in one screen at the target display context
- the screen relies on too much sentence-length copy
- status is not visually primary in clear public-signage terms
- concrete nearby stations, stops, or transport references are too weak or absent
- the current map treatment is not useful enough as a local orientation aid

### Discovery Context

The issue was identified during direct stakeholder review of the live app running at `http://localhost:3000/` after the review-debt remediation stream had already been completed.

### Evidence

- Live stakeholder feedback reported the screen as `quite dull`, `difficult to follow`, `not obvious how it’s working`, `not beautiful`, and `not clear like you’d expect an information board`.
- The current page requires scrolling and contains repeated explanatory sentences rather than a compact board-style read.
- The live selection dump shows repeated trust wording, repeated carried-forward wording, weak locality reference, and a lack of explicit red / amber / green emphasis.
- This conflicts directly with the PRD requirement for a one-screen foyer display readable in `2-3 seconds` at room scale and the UX requirement that the experience feel `beautiful, clear, calm, restrained, and architectural at first glance`.

### Trigger Classification

- Triggering epic and stories: Epic 1 public-display delivery, especially Stories `1.3`, `1.4`, `1.5`, and `1.6`
- Issue type: failed implementation approach relative to approved UX and MVP intent
- Core problem: the current public display is not yet a fit-for-purpose information board

## 2. Impact Analysis

### Epic Impact

- Epic 1 remains product-valid in intent, but its delivered output is not acceptable in current form.
- Epic 2 is secondarily affected because trust, freshness, and degraded-state cues are currently surfacing too verbosely.
- Epic 3 remains largely valid and unaffected.
- Epic 4 remains valid as the review-debt closure stream and should close independently of this stakeholder UX rejection.
- A new corrective epic is required for public-display clarity, hierarchy, visual redesign, and map usefulness.

### Story Impact

- Existing Epic 1 stories should remain historically complete, but they should no longer be treated as sufficient proof of stakeholder acceptance.
- The existing Story `4.2` review-debt path is not the right vehicle for this problem because the issue is not missing external-review closure; it is direct stakeholder rejection of the public-facing UX.
- New implementation work should start through a separate Epic 5 rather than by forcing this redesign into the completed review-debt stream.

### Artifact Conflict Analysis

- PRD conflict: the product direction remains valid, but success criteria need tighter interpretation around no-scroll readability, public-signage clarity, concrete locality, and map usefulness.
- Architecture conflict: none requiring reset. The issue is primarily at the presentation and validation layer.
- UX spec conflict: substantial. The current guidance is too open to interpretation and allowed a prose-heavy public screen to count as complete.
- Artifact updates required:
  - [docs/prd.md](/home/codexuser/bmad-6-workshop/docs/prd.md)
  - [docs/ux-design-specification.md](/home/codexuser/bmad-6-workshop/docs/ux-design-specification.md)
  - [docs/epics.md](/home/codexuser/bmad-6-workshop/docs/epics.md)
  - [docs/sprint-artifacts/sprint-status.yaml](/home/codexuser/bmad-6-workshop/docs/sprint-artifacts/sprint-status.yaml)
  - this change proposal document

### Technical Impact

- No architecture reset is required.
- No product-scope rollback is required.
- Existing data, trust, and ops foundations should be preserved.
- The corrective work is primarily UX, hierarchy, component, and validation redesign of the public display.

## 3. Path Forward Evaluation

### Option 1: Direct Adjustment

Status: Not preferred

- Small patching of the existing screen would likely tighten copy and styles without creating a coherent public-board redesign.
- Risk is high that the team would ship another technically complete but still confusing surface.

Effort: Medium to High
Risk: High

### Option 2: Potential Rollback

Status: Not viable

- Rolling back completed public-display work would destroy useful technical foundations without solving the actual problem.
- The system works; the public display contract is what needs correction.

Effort: High
Risk: High

### Option 3: PRD MVP Review

Status: Viable but incomplete on its own

- Tightening the MVP bar is necessary.
- It still needs a dedicated implementation vehicle to produce the redesign.

Effort: Medium
Risk: Medium

### Recommended Path

Selected approach: controlled course correction combining PRD / UX tightening with a new corrective implementation epic

Rationale:

- preserves the technical base that already works
- closes the gap between abstract product language and real public-board behavior
- creates an explicit redesign stream instead of hiding the issue inside patch-level edits
- keeps Epic 4 closed as review-debt remediation while making it clear that product acceptance is still blocked

## 4. Detailed Change Proposals

### 4.1 Product Requirements

Artifact: [docs/prd.md](/home/codexuser/bmad-6-workshop/docs/prd.md)

Approved changes:

- strengthen user success so the screen must work like a clear public information board rather than a verbose dashboard
- require one-screen readability at the target public viewport with no scrolling
- require a `2-3 second` far read that answers overall status, warning state, and strongest nearby option
- require `5-10 second` close-read comprehension using concrete nearby references such as stations, stops, or corridors
- make clear that the public display should prefer labels, symbols, and compact status language over explanatory sentences
- require the map to behave as a recognisable local orientation aid rather than an abstract framed graphic

### 4.2 UX Specification

Artifact: [docs/ux-design-specification.md](/home/codexuser/bmad-6-workshop/docs/ux-design-specification.md)

Approved changes:

- add explicit no-scroll, status-first, copy-budget, and anti-repetition constraints for the public screen
- require public-signage clarity with obvious green / amber / red emphasis
- add explicit component constraints:
  - top summary / status bar
  - nearby stations panel
  - explicit tube / rail rows with compact RAG states
  - equivalent compact rows for bus, roads, and other enabled modes
  - `best-looking nearby option now` summary block that remains fact-only
  - compact alert blocks instead of open-ended prose cards
- update map guidance so conventional clarity is preferred over architectural abstraction when the current map is hard to understand
- add validation expectations for no-scroll composition and fast unfamiliar-viewer comprehension

### 4.3 Epics and Stories

Artifact: [docs/epics.md](/home/codexuser/bmad-6-workshop/docs/epics.md)

Approved changes:

- add `Epic 5: Public Display Clarity and Visual Redesign`
- add the following stories:
  - `5.1 Reframe the public display around a one-screen status-first board`
  - `5.2 Replace verbose mode cards with compact RAG transport rows`
  - `5.3 Add concrete nearby station and locality references`
  - `5.4 Redesign the local map for practical usefulness`
  - `5.5 Revalidate the public screen against board-readability criteria`

### 4.4 Sprint Tracking and Routing

Artifact: [docs/sprint-artifacts/sprint-status.yaml](/home/codexuser/bmad-6-workshop/docs/sprint-artifacts/sprint-status.yaml)

Approved changes:

- close Epic 4 as the review-debt stream
- keep Story `4.2` as optional rather than active, because Story `4.1` already established no evidence-backed Epic 1 external-review debt and the newly discovered problem is not review debt
- add Epic 5 as the new active backlog stream
- change release-readiness wording so it no longer implies that public-display acceptance is complete
- route the next implementation step to Story `5.1`

## 5. Implementation Handoff

### Scope Classification

Moderate

### Required Artifact Updates

- [docs/prd.md](/home/codexuser/bmad-6-workshop/docs/prd.md)
- [docs/ux-design-specification.md](/home/codexuser/bmad-6-workshop/docs/ux-design-specification.md)
- [docs/epics.md](/home/codexuser/bmad-6-workshop/docs/epics.md)
- [docs/sprint-artifacts/sprint-status.yaml](/home/codexuser/bmad-6-workshop/docs/sprint-artifacts/sprint-status.yaml)

### Recommended Routing

- Product Owner / Scrum Master: finalize the new Epic 5 backlog and prioritization
- Next implementation workflow: `/bmad-bmm-create-story` for `5-1-reframe-the-public-display-around-a-one-screen-status-first-board`
- Follow with the normal story creation, implementation, and review loop for the Epic 5 redesign stories

### Release Readiness Note

External review-debt closure remains complete, but product acceptance is not currently complete. Release readiness should therefore be treated as blocked on Epic 5 public-display correction rather than universally green.
