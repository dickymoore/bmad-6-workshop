# Plan: Build HarbourWatch as a BMAD-Native Track

## Decision

Do not clone Albemarle Pulse generated content into the new track. Use
Albemarle Pulse only as a reference for workshop structure, stage boundaries,
and final delivery expectations.

HarbourWatch should be authored through BMAD so the product brief, research,
PRD, UX, architecture, epics, stories, implementation, and replay conversations
come from a real BMAD flow.

## Track Concept

HarbourWatch is a calm harbour-side operations display for marina and
ferry-terminal teams. It combines weather, tide, ferry, berth, safety, and local
environmental signals so staff and visitors can understand current harbour
conditions at a glance without becoming a full vessel traffic management system.

## Initial Implementation

- Create `workshops/harbourwatch/track.json`.
- Create `workshops/harbourwatch/demo-start-prompt.md`.
- Create `workshops/harbourwatch/BMAD-RUNBOOK.md`.
- Register `harbourwatch` in `workshops/index.json`.
- Do not create showcase snapshots until BMAD outputs exist.
- Do not script Agent Replay until the real BMAD conversation exists.

## BMAD Authoring Flow

### 1. Analysis

Run:

- `$bmad-help`
- `$bmad-brainstorming`
- `$bmad-bmm-domain-research`
- `$bmad-bmm-technical-research`
- `$bmad-bmm-create-product-brief`

Capture:

- brainstorming output
- domain research
- technical research
- product brief

Cut:

- `workshop/harbourwatch/20-planning`

### 2. Planning

Run:

- `$bmad-bmm-create-prd`
- `$bmad-bmm-create-ux-design`
- validation as recommended by BMAD

Capture:

- PRD
- UX specification
- optional UX direction/theme files
- validation report

Cut:

- `workshop/harbourwatch/30-solutioning`

### 3. Solutioning

Run:

- `$bmad-bmm-create-architecture`
- `$bmad-bmm-create-epics-and-stories`
- `$bmad-bmm-check-implementation-readiness`

Capture:

- architecture
- epics
- readiness report

Cut:

- `workshop/harbourwatch/40-implementation-setup`

### 4. Ready for Dev

Run:

- `$bmad-bmm-sprint-planning`
- `$bmad-bmm-create-story`

Capture:

- sprint status
- first story

Cut:

- `workshop/harbourwatch/50-ready-for-dev`

### 5. Implementation

Run:

- `$bmad-bmm-dev-story`
- `$bmad-bmm-code-review`
- correction loops only where needed

Capture:

- app source
- tests
- story updates
- sprint status updates

Cut:

- `workshop/harbourwatch/60-implementation`
- `workshop/harbourwatch/70-complete`
- `workshop/harbourwatch/80-mvp`

## Replay Strategy

Create `../agent-replay/conversation_sets/harbourwatch/` after the real BMAD
conversation exists. Distill the actual turns into replay scenarios rather than
inventing them upfront.

## Validation

Before any generated branch or showcase becomes delivery material:

```bash
rg -n "Albemarle|Royal Institution|Albemarle Street|TfL" \
  workshops/harbourwatch \
  showcase/harbourwatch \
  ../agent-replay/conversation_sets/harbourwatch

./scripts/audit-bmad-v6.sh --track harbourwatch --branch workshop/harbourwatch/10-analysis
./scripts/verify-bmad-v6.sh --track harbourwatch --branch workshop/harbourwatch/10-analysis
```

Run equivalent validation for each later staged branch once it exists.
