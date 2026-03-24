## Albemarle Pulse

# BMAD Stage 1: Analysis

Albemarle Pulse is a live mobility dashboard centered on the Royal Institution.
It combines nearby TfL transport and weather data to show, at a glance, the
best options for getting around London from here, what disruption is building
next, and how conditions may affect onward journeys.

The goal of this stage is to frame the product clearly before any planning or
solution design artifacts exist.

## Workshop Goal For This Stage

Use BMAD to define:

- the real user problem
- the primary users around the Royal Institution
- what "best option" means in practice
- which live transport and weather signals matter most
- what the first useful dashboard view should and should not do

## Suggested Stage Flow

1. Run Codex.
2. Run `/skills` and confirm BMAD skills are available.
3. Run `$bmad-help`.
4. Use the BMAD analyst workflow to create the product brief.
5. Do the initial research work needed to sharpen the problem and scope.
6. Keep the scope tight:
   - Royal Institution centered
   - London only
   - public data only
   - calm decision dashboard, not full route planning
7. Inspect the files created or changed under `docs/`.
8. When you are done, stash any local changes and move to the next stage:

```bash
git stash
git checkout workshop/albemarle-pulse/20-planning
```

## Product Framing Prompts

Use these as pressure tests during analysis:

- Who is the dashboard really for: attendees leaving, attendees arriving, or both?
- What is the smallest high-value view someone can understand in under 10 seconds?
- Which nearby transport modes matter most around the Royal Institution?
- How should weather change recommendations without making the UI noisy?
- What disruption signals should be highlighted versus left in drill-down detail?
- What should be explicitly out of scope for MVP?

## Expected Output Boundary

At the end of this branch, analysis outputs should exist.
Planning outputs should not.
