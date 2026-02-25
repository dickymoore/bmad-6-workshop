# Workshop Branch Strategy and Naming Convention

## 1. Goals
- Make branch purpose obvious without opening docs.
- Preserve workshop progression ordering.
- Reduce onboarding friction for facilitators and participants.

## 2. Proposed Convention
Use `workshop/<order>-<slug>` for stage branches.

Examples:
- `workshop/10-analysis`
- `workshop/20-planning`
- `workshop/30-solutioning`

Keep `main` unchanged as the workshop entry point.

## 3. Suggested Mapping
- `stage-1` -> `workshop/10-analysis`
- `stage-2` -> `workshop/20-planning`
- `stage-3` -> `workshop/30-solutioning`
- `stage-4` -> `workshop/40-implementation-setup`
- `ready-for-dev` -> `workshop/50-ready-for-dev`
- `implementation-in-progress` -> `workshop/60-implementation`
- `complete` -> `workshop/70-complete`
- `mvp` -> `workshop/80-mvp`

## 4. Migration Method
1. Create the new branch names from current source branches.
2. Update references in:
- `README.md`
- facilitator runbook
- automation scripts (`workshop-reviewer.sh`, verification helpers)
3. Keep compatibility aliases (old names) for one workshop cycle.
4. Remove old aliases only after all docs and facilitator habits are updated.

## 5. Safety Controls
- Protect `main` and all active workshop branches.
- Block force-push on facilitator-facing branches.
- Require at least one reviewer for branch-name migration PR.

## 6. Decision Record
Do not rename immediately before a live workshop. Apply rename in a dedicated maintenance window with full script/doc updates in the same PR.
