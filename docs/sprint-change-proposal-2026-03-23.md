# Sprint Change Proposal

Date: 2026-03-23
Project: bmad-6-workshop-migration
Workflow: Correct Course
Change Trigger: The current Epic 5 board only adapts `docs/design-inputs`, but the required acceptance target is now close visual parity with `docs/design-inputs/code.html` and `docs/design-inputs/screen.png` on the live public route, validated through a screenshot-based Playwright loop.
Mode: Batch
Recommended Scope Classification: Moderate

## 1. Issue Summary

### Problem Statement

Epic 5 closed successfully against a readability-and-beauty bar, but that is no longer the correct acceptance target. The live public board must now achieve close visual parity with the approved design-reference set in `docs/design-inputs/code.html` and `docs/design-inputs/screen.png`, while still preserving the canonical public route, fact-only product doctrine, and existing presenter/snapshot truth model.

The core issue is not broken functionality. The issue is that the repo's accepted Epic 5 scope proves:

- one-screen readability
- status-first hierarchy
- concrete nearby references
- practical map usefulness
- foyer-readability acceptance

but it does not prove:

- close visual parity to the approved design-reference layout
- screenshot-based visual evidence on the live public route
- final stakeholder acceptance against the stronger design-reference baseline

### Discovery Context

The issue was confirmed after Epic 5 closeout when the delivered live board was reviewed against the actual design-input artifacts. Existing Epic 5 planning and validation treated those artifacts as design guidance rather than as a parity baseline. That interpretation is now superseded by the stricter acceptance target.

### Evidence

- Story `5.1` explicitly framed the design-input files as authoritative visual guidance but not as literal runtime source or parity baseline.
- Story `5.5` accepted the board if it read like a clear public information board in the foyer context, with no-scroll, nearby-reference comprehension, and anti-prose constraints.
- Smoke tests enforce canonical shell order, no-scroll desktop layout, compact board language, and passive-map behavior, but they do not enforce screenshot parity with the approved design reference.
- The live route is implemented through bespoke Next.js components and global CSS rather than the prototype HTML directly, which is architecturally correct but leaves room for broader visual drift than is now acceptable.
- Functional health is green: `npm run validate` passes.
- Screenshot-based visual validation is now operational in this environment, and a Playwright capture of the live public route can be produced successfully.

### Trigger Classification

- Triggering epic and stories: Epic 5, especially Story `5.1` as the source of the weaker interpretation and Story `5.5` as the final acceptance gate that closed under that interpretation
- Issue type: new stakeholder acceptance requirement, with a secondary mismatch caused by the earlier interpretation of the design-input artifacts
- Core problem: the repo currently proves "good public board," but the required target is now "good public board with close design-reference parity"

## 2. Impact Analysis

### Epic Impact

- Epic 5 can no longer remain fully complete under the newly confirmed acceptance target.
- Epics 1-4 remain valid and do not need structural redesign.
- No Epic 6 is currently defined, and a separate new epic is not strictly required.
- The cleanest route is to reopen and extend Epic 5 rather than create a brand-new corrective epic.

### Story Impact

- Stories `5.1` through `5.4` remain historically valuable and technically valid, but they are no longer sufficient evidence for final Epic 5 acceptance.
- Story `5.5` remains valid as readability evidence only and should no longer be treated as the last word on Epic 5 acceptance.
- Epic 5 needs follow-up implementation and validation stories focused specifically on design-reference parity and screenshot evidence.

### Artifact Conflict Analysis

- PRD: directionally aligned, but missing explicit acceptance language for design-reference parity.
- UX specification: strongly aligned in spirit, but still qualitative rather than reference-baseline driven.
- Architecture: no fundamental conflict; the issue is tooling, workflow, and validation definition rather than rendering architecture.
- Sprint artifacts: current Epic 5 story artifacts and validation artifact preserve the weaker acceptance interpretation and need explicit supersession handling.
- Sprint tracking: currently overstates completion by keeping Epic 5 and product acceptance closed.

### Technical Impact

- No architecture reset is required.
- No rollback of completed Epic 5 UI work is recommended.
- The canonical public route, presenter, snapshot, and global-CSS seams remain the correct implementation surface.
- New technical work is required for:
  - tighter visual implementation against the design reference
  - Playwright-based screenshot capture as a repo-owned validation path
  - updated test/tooling and evidence artifacts

## 3. Recommended Approach

### Option 1: Direct Adjustment

Status: Recommended

- Reopen and extend Epic 5.
- Update acceptance artifacts so the design-input files become the approved parity baseline.
- Add new Epic 5 stories for implementation parity and screenshot-based validation.
- Preserve the canonical live route and current architecture.

Effort: Medium
Risk: Medium

### Option 2: Potential Rollback

Status: Not viable

- Rolling back Epic 5 would destroy valid technical work without solving the real problem.
- The product is working and the public-board direction is right; the gap is scope strictness and visual fidelity.

Effort: High
Risk: High

### Option 3: PRD MVP Review

Status: Not recommended

- Reducing or redefining MVP to avoid parity would contradict the now-confirmed stakeholder acceptance target.
- The product intent and architecture remain sound.

Effort: Low to defer
Risk: High

### Recommended Path

Selected approach: Direct Adjustment through Epic 5 reopen and extension

Rationale:

- preserves the working technical base
- keeps all work on the canonical public route
- aligns repo acceptance with the actual stakeholder requirement
- avoids needless rollback churn
- adds the missing evidence model: screenshot-based visual validation

Timeline impact:

- Moderate increase in design/implementation/validation effort
- Release or rollout handoff should remain blocked until the new Epic 5 parity stories are complete

## 4. Detailed Change Proposals

### 4.1 Epics and Stories

Artifact: `docs/epics.md`

Epic 5 summary

OLD:
```md
The public-facing display becomes a clear, beautiful, one-screen information board with obvious status hierarchy, concrete local references, practical map usefulness, and room-scale readability that meets the product's actual foyer-standard.
```

NEW:
```md
The public-facing display becomes a clear, beautiful, one-screen information board that also achieves close visual parity with the approved design-reference set on the canonical live public route, while preserving obvious status hierarchy, concrete local references, practical map usefulness, and room-scale readability at the target foyer viewport.
```

Rationale: Epic 5 currently closes on readability and beauty. The updated requirement needs explicit reference-parity language.

New story `5.6`

NEW:
```md
### Story 5.6: Close the Live Public Board Gap to the Approved Design Reference

As a stakeholder reviewing the live public route,
I want the canonical public board to match the approved design reference closely,
So that the shipped screen looks like the intended Civic Editorial board rather than a looser adaptation.

**FRs implemented:** Cross-cutting corrective delivery for visual hierarchy, tonal layering, masthead structure, section zoning, and map/panel parity on the canonical public route.

**Acceptance Criteria:**

**Given** `docs/design-inputs/code.html` and `docs/design-inputs/screen.png` are the approved design baseline
**When** the live public route is reviewed at the target foyer viewport
**Then** the masthead, status-first header, left/right section balance, nearby-mode treatment, nearby-stations layer, and passive local-map treatment align closely with that baseline
**And** any remaining differences are limited to truth-preserving content substitutions or implementation-safe adaptation rather than broad visual drift.

**Given** the public board is updated for parity
**When** the implementation is reviewed
**Then** the work remains inside the canonical public route, presenter, component, and global-CSS seams
**And** no parallel prototype, alternate board runtime, or Tailwind-only screen is introduced.
```

New story `5.7`

NEW:
```md
### Story 5.7: Validate Design-Reference Parity with Playwright Screenshots

As the product team,
I want repeatable screenshot-based validation against the approved design reference,
So that final acceptance is evidence-backed on the live public route rather than inferred from source inspection.

**FRs implemented:** Corrective delivery for visual-acceptance evidence and canonical-route screenshot validation.

**Acceptance Criteria:**

**Given** the required browser dependencies are available
**When** visual validation runs on the canonical public route
**Then** Playwright captures the live public board at the approved viewport
**And** screenshot evidence is stored in the sprint-artifact set for review.

**Given** screenshot evidence exists
**When** the live board is compared against `docs/design-inputs/code.html` and `docs/design-inputs/screen.png`
**Then** acceptance passes only if the board achieves close visual parity in layout hierarchy, typography pairing, spacing rhythm, tonal layering, and major section placement
**And** fact-only product behavior and passive-map constraints remain intact.

**Given** screenshot capture fails or parity remains materially off-target
**When** Epic 5 is reviewed
**Then** Epic 5 remains open
**And** product acceptance and release handoff remain blocked.
```

### 4.2 Product Requirements

Artifact: `docs/prd.md`

Section: `User Success` and `Measurable Outcomes`

OLD:
```md
Users succeed when Albemarle Pulse works like a clear public information board rather than a verbose dashboard.
...
- **one-screen readability:** the default public view fits on the target display without scroll and preserves its primary hierarchy at normal browser zoom
- **local-reference comprehension:** unfamiliar users can name at least one nearby station, stop, or corridor shown on the board after a short close read
```

NEW:
```md
Users succeed when Albemarle Pulse works like a clear public information board rather than a verbose dashboard and when the live public route remains in close visual alignment with the approved design-reference baseline for the foyer board.
...
- **one-screen readability:** the default public view fits on the target display without scroll and preserves its primary hierarchy at normal browser zoom
- **local-reference comprehension:** unfamiliar users can name at least one nearby station, stop, or corridor shown on the board after a short close read
- **design-reference alignment:** stakeholder review and screenshot evidence confirm that the live public route remains in close visual parity with the approved design-reference set for masthead structure, status-first layout, compact mode rows, nearby-locality treatment, and passive local-map placement
```

Rationale: the new stakeholder requirement must live in the PRD as an acceptance bar, not just in informal review notes.

### 4.3 UX Specification

Artifact: `docs/ux-design-specification.md`

Section: `Public-Board Constraints`

OLD:
```md
The default target display view must be fully legible without scrolling at the approved public-screen viewport. The first read must be status-first rather than paragraph-first, and every major display zone should work to a strict copy budget so the screen behaves like an information board instead of a stack of explanatory cards.
```

NEW:
```md
The default target display view must be fully legible without scrolling at the approved public-screen viewport. The first read must be status-first rather than paragraph-first, and every major display zone should work to a strict copy budget so the screen behaves like an information board instead of a stack of explanatory cards.
The approved visual baseline for the canonical live public route is the design-reference set in `docs/design-inputs/code.html` and `docs/design-inputs/screen.png`. The implementation may translate the prototype into the repo's stack, but the shipped board must preserve the same masthead structure, status-card prominence, left/right zoning, compact section rhythm, nearby-stations treatment, and passive-map placement closely enough that stakeholder review reads it as the same board rather than a looser reinterpretation.
```

Section: `Testing Strategy`

OLD:
```md
Testing should focus on the actual operating context of the MVP rather than on broad consumer-device coverage.
```

NEW:
```md
Testing should focus on the actual operating context of the MVP rather than on broad consumer-device coverage.
Visual acceptance must also include repeatable screenshot capture of the canonical live public route at the approved viewport using Playwright, with comparison against `docs/design-inputs/code.html` and `docs/design-inputs/screen.png` as the approved design baseline.
```

Rationale: the UX spec already defines the right board direction, but it needs a concrete visual baseline and evidence method.

### 4.4 Architecture

Artifact: `docs/architecture.md`

Section: `Testing Framework`

OLD:
```md
**Testing Framework:**
- no test runner is included by default
- implementation should add unit/integration and end-to-end testing intentionally rather than inherit an opinionated starter setup
```

NEW:
```md
**Testing Framework:**
- no test runner is included by default
- implementation should add `Vitest` for unit/integration coverage and `Playwright` for end-to-end and screenshot-based visual validation intentionally rather than inherit an opinionated starter setup
- screenshot-based validation must run against the canonical live public route only and must not rely on a parallel prototype implementation
```

Section: project structure

OLD:
```md
tests/
├── e2e/
│   ├── dashboard.spec.ts
│   └── ops-recovery.spec.ts
└── smoke/
```

NEW:
```md
playwright.config.ts
tests/
├── e2e/
│   ├── dashboard.spec.ts
│   ├── public-board-visual.spec.ts
│   └── ops-recovery.spec.ts
└── smoke/
```

Rationale: no architecture reset is needed, but visual validation must become a first-class part of the documented implementation model.

### 4.5 Tooling

Artifact: `package.json`

OLD:
```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint .",
  "typecheck": "tsc --noEmit",
  "test": "npm run test:smoke && npm run test:unit",
  "test:smoke": "node --test tests/smoke/*.test.mjs",
  "test:unit": "vitest run",
  "validate": "npm run lint && npm run typecheck && npm test && npm run build"
},
"devDependencies": {
  "@types/node": "^24",
  "@types/react": "^19",
  "@types/react-dom": "^19",
  "eslint": "^9",
  "eslint-config-next": "16.1.7",
  "typescript": "^5",
  "vitest": "file:tools/vitest-lite"
}
```

NEW:
```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint .",
  "typecheck": "tsc --noEmit",
  "test": "npm run test:smoke && npm run test:unit",
  "test:smoke": "node --test tests/smoke/*.test.mjs",
  "test:unit": "vitest run",
  "test:e2e": "playwright test",
  "screenshot:public-board": "playwright test tests/e2e/public-board-visual.spec.ts",
  "validate": "npm run lint && npm run typecheck && npm test && npm run build"
},
"devDependencies": {
  "@playwright/test": "^1.51.1",
  "@types/node": "^24",
  "@types/react": "^19",
  "@types/react-dom": "^19",
  "eslint": "^9",
  "eslint-config-next": "16.1.7",
  "typescript": "^5",
  "vitest": "file:tools/vitest-lite"
}
```

Rationale: the screenshot loop must be reproducible from repo tooling, not only from ad hoc local commands.

### 4.6 Historical Sprint Artifacts

Artifact: `docs/sprint-artifacts/5-1-reframe-the-public-display-around-a-one-screen-status-first-board.md`

OLD:
```md
That external design input is authoritative as visual and layout guidance, but not as a literal code template.
```

NEW:
```md
That external design input remains non-runtime source code, but it is now the approved visual parity baseline for the canonical live public route. Translation into the repo's stack is still required; broad visual drift from the approved reference is no longer acceptable for final Epic 5 acceptance.
```

Artifact: `docs/sprint-artifacts/5-5-public-board-readability-validation.md`

OLD:
```md
Accepted only if the canonical public board reads like a clear public information board in the foyer context.
```

NEW:
```md
Accepted only if the canonical public board reads like a clear public information board in the foyer context.
Supersession note: this artifact remains valid as readability evidence only. Final Epic 5 acceptance under the updated scope also requires design-reference parity validation on the live public route through the follow-up visual-validation story and artifact.
```

Rationale: preserve history while making the earlier evidence insufficient for final closure under the updated target.

### 4.7 Sprint Tracking

Artifact: `docs/sprint-artifacts/sprint-status.yaml`

OLD:
```yaml
review_debt_status:
  release_readiness: evidence-backed
  product_acceptance: accepted
development_status:
  epic-5: done
  5-1-reframe-the-public-display-around-a-one-screen-status-first-board: done
  5-2-replace-verbose-mode-cards-with-compact-rag-transport-rows: done
  5-3-add-concrete-nearby-station-and-locality-references: done
  5-4-redesign-the-local-map-for-practical-usefulness: done
  5-5-revalidate-the-public-screen-against-board-readability-criteria: done
  epic-5-retrospective: done
```

NEW:
```yaml
review_debt_status:
  release_readiness: blocked-on-epic-5-design-parity
  product_acceptance: pending-design-parity
development_status:
  epic-5: in-progress
  5-1-reframe-the-public-display-around-a-one-screen-status-first-board: done
  5-2-replace-verbose-mode-cards-with-compact-rag-transport-rows: done
  5-3-add-concrete-nearby-station-and-locality-references: done
  5-4-redesign-the-local-map-for-practical-usefulness: done
  5-5-revalidate-the-public-screen-against-board-readability-criteria: done
  5-6-close-the-live-public-board-gap-to-the-approved-design-reference: backlog
  5-7-validate-design-reference-parity-with-playwright-screenshots: backlog
  epic-5-retrospective: optional
```

Rationale: the tracker should stop claiming final acceptance while the newly required parity work is still pending.

## 5. Implementation Handoff

### Scope Classification

Moderate

### Routing

- Product Owner / Scrum Master:
  - reopen and extend Epic 5 in planning artifacts
  - update sprint tracking and story ordering
- Architect:
  - formalize Playwright screenshot validation and canonical-route constraints
- Developer:
  - implement visual-parity changes on the live public route only
  - preserve current presenter/snapshot truth model and fact-only behavior
- QA / Validation:
  - add screenshot-based evidence capture and final parity validation

### Success Criteria for Handoff

- Epic 5 is explicitly reopened or extended rather than implicitly assumed complete
- Design-reference parity is written into planning and acceptance artifacts
- The live public route is the only implementation surface used for parity work
- Screenshot-based validation is reproducible from repo tooling
- Product acceptance and release handoff stay blocked until new Epic 5 parity validation passes

### Release Readiness Note

Review-debt closure remains complete, but product acceptance should no longer be treated as final until the updated Epic 5 parity requirement is satisfied.

## 6. Approval and Workflow Log

- Approval status: approved for implementation on `2026-03-23`
- Final scope classification: `Moderate`
- Routed to: Product Owner / Scrum Master for backlog reorganization, then Architect, Developer, and QA for execution and validation
- Recommended next workflow: finalize backlog/story ordering, then run `/bmad-bmm-create-story` for Story `5.6`, followed by Story `5.7`
- Execution note: this proposal file is the in-repo workflow execution record for the Correct Course run
