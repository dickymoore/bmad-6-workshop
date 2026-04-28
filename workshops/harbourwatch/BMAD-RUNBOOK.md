# HarbourWatch BMAD Runbook

This track should be authored through BMAD rather than cloned from another
track's generated artifacts. Use this runbook to capture the outputs and decide
when each workshop stage is ready to cut.

## Product Seed

HarbourWatch is a calm harbour-side operations display for marina and
ferry-terminal teams. It combines weather, tide, ferry, berth, safety, and local
environmental signals so staff and visitors can understand current harbour
conditions at a glance without becoming a vessel traffic management system.

## Phase 1: Analysis

Run:

```text
$bmad-help I want to build an app called HarbourWatch. It should be a calm harbour-side operations display for marina and ferry-terminal teams, combining weather, tide, ferry, berth, safety, and local environmental signals so staff and visitors can understand current harbour conditions at a glance without turning it into a full vessel traffic management system.
```

Then run the optional analysis flow:

- `$bmad-brainstorming`
- `$bmad-bmm-domain-research`
- `$bmad-bmm-technical-research`
- `$bmad-bmm-create-product-brief`

Expected outputs before cutting `20-planning`:

- `_bmad-output/brainstorming/brainstorming-session-*.md`
- `docs/research/domain-*.md`
- `docs/research/technical-*.md`
- `docs/product-brief-*.md`

## Phase 2: Planning

Run:

- `$bmad-bmm-create-prd`
- `$bmad-bmm-create-ux-design`
- PRD validation if BMAD recommends it

Expected outputs before cutting `30-solutioning`:

- `docs/prd.md`
- `docs/ux-design-specification.md`
- optional `docs/ux-design-directions.html`
- optional `docs/ux-color-themes.html`
- optional `docs/validation-report-*.md`

## Phase 3: Solutioning

Run:

- `$bmad-bmm-create-architecture`
- `$bmad-bmm-create-epics-and-stories`
- `$bmad-bmm-check-implementation-readiness`

Expected outputs before cutting `40-implementation-setup`:

- `docs/architecture.md`
- `docs/epics.md`
- `docs/implementation-readiness-report-*.md`

## Phase 4: Implementation Setup

Run:

- `$bmad-bmm-sprint-planning`
- `$bmad-bmm-create-story`

Expected outputs before cutting `50-ready-for-dev`:

- `docs/sprint-artifacts/sprint-status.yaml`
- at least one `docs/sprint-artifacts/1-1-*.md`

## Phase 5: Implementation

Run BMAD dev and review loops:

- `$bmad-bmm-dev-story`
- `$bmad-bmm-code-review`
- `$bmad-bmm-correct-course` only when a meaningful pivot is needed

Expected outputs before cutting implementation stages:

- `package.json`
- `src/`
- `tests/`
- updated `docs/sprint-artifacts/sprint-status.yaml`

## Replay Capture

Do not script Agent Replay first. Capture the real BMAD conversation as the
source material, then distill it into:

- `../agent-replay/conversation_sets/harbourwatch/01-bmad-help-new-project.json`
- `../agent-replay/conversation_sets/harbourwatch/02-bmad-brainstorming.json`
- continued scenarios for the actual BMAD phases that were run

## HarbourWatch Doctrine

- Public/open data should be real where useful: weather, marine conditions,
  tide/flood context, maps, and environmental signals.
- Internal operational data can be fixture-backed: berth availability, terminal
  queue state, staff notices, equipment readiness, and local safety messages.
- The display gives situational confidence; it does not control vessel movement,
  issue navigation instructions, or replace harbour authority systems.
