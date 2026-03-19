# Albemarle Pulse Cut History

This file records the frozen participant branch cuts that were reconstructed from
`authoring/albemarle-pulse` commit history.

## Canonical cuts

- `workshop/albemarle-pulse/10-analysis` -> `6d7af6c`
  - scaffold branch before Stage 1 outputs exist
- `workshop/albemarle-pulse/20-planning` -> `7df8ee6`
  - source commit: `Stage 1 commit`
  - branch meaning: analysis complete, planning not yet done
- `workshop/albemarle-pulse/30-solutioning` -> `40e3087`
  - source commit: `Stage 2 commit`
  - branch meaning: planning complete, solutioning not yet done
- `workshop/albemarle-pulse/40-implementation-setup` -> `cdb0b2b`
  - source commit: `Phase three complete`
  - branch meaning: architecture/epics/readiness complete, coding not yet shown
- `workshop/albemarle-pulse/60-implementation` -> `c8f7dfa`
  - source commit: `feat(epic-2): implement 2-1-keep-the-departure-picture-current-during-normal-operation`
  - branch meaning: frozen in-progress implementation snapshot from the latest pushed authoring state as of 2026-03-19

## Tags created

- `cut/albemarle-pulse/10-analysis-complete` -> `7df8ee6`
- `cut/albemarle-pulse/20-planning-complete` -> `40e3087`
- `cut/albemarle-pulse/30-solutioning-complete` -> `cdb0b2b`

## Current gap

`workshop/albemarle-pulse/50-ready-for-dev` has not been cut yet.

Reason:
- the first implementation commit (`adb5d00`) introduces both sprint artifacts and application code in the same commit
- that means there is no clean pre-code boundary in the current history for a true ready-for-dev checkpoint

If a clean ready-for-dev checkpoint is needed later, it should be created from a
future authoring commit that contains sprint planning artifacts without app code,
or reconstructed with an explicit history-editing pass.
