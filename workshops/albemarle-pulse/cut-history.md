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
- `workshop/albemarle-pulse/50-ready-for-dev` -> `4d9b3a1`
  - source commit: reconstructed from `adb5d00` (`phase four development started`)
  - branch meaning: sprint planning and first story handoff artifacts are present, but implementation code and runtime files have been stripped back out to preserve the pre-code participant boundary
- `workshop/albemarle-pulse/60-implementation` -> `c8f7dfa`
  - source commit: `feat(epic-2): implement 2-1-keep-the-departure-picture-current-during-normal-operation`
  - branch meaning: frozen in-progress implementation snapshot from the latest pushed authoring state as of 2026-03-19
- `workshop/albemarle-pulse/70-complete` -> `70ae7d5`
  - source commit: `Good looking app`
  - branch meaning: stabilized full implementation with completed design-parity work before final MVP polish
- `workshop/albemarle-pulse/80-mvp` -> `f37a179`
  - source commit: `working version`
  - branch meaning: final demoable MVP snapshot from the finished authoring branch

## Tags created

- `cut/albemarle-pulse/10-analysis-complete` -> `7df8ee6`
- `cut/albemarle-pulse/20-planning-complete` -> `40e3087`
- `cut/albemarle-pulse/30-solutioning-complete` -> `cdb0b2b`

## Reconstruction note

`workshop/albemarle-pulse/50-ready-for-dev` could not be cut by simply pointing
at an authoring commit because `adb5d00` introduced both sprint artifacts and
application code together.

That stage was therefore reconstructed as a branch-local cleanup cut:

- base commit: `adb5d00`
- cleanup commit: `4d9b3a1`
- removed from the frozen participant branch: `package.json`, `package-lock.json`,
  `src/`, `tests/`, TypeScript/Next.js config files, and `.nvmrc`

The rolling `authoring/albemarle-pulse` branch remains intact and unchanged.
