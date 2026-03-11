# Agent Repo Summary

## What this repo is

This repository is a staged workshop for teaching the BMAD BMM process.

It is not a normal single-state application repo. The point is to let a user
move branch-by-branch through a controlled progression and see how BMAD is used
at each stage of delivery.

The expected participant flow is:

1. check out `main`
2. follow the `README.md`
3. move to the next workshop branch
4. repeat until the final branch

The repo therefore behaves more like a training timeline than a standard
software project.

## Core idea of the branch model

Each branch represents a point in the BMAD workflow. A branch should contain
only the artifacts that exist up to that stage, and should not contain
artifacts from later stages.

That rule matters. The workshop depends on users creating the next stage's
artifacts themselves. If a branch already contains the outputs for that stage
or a later one, the workshop is broken.

Canonical branch order:

- `main`
- `workshop/10-analysis`
- `workshop/20-planning`
- `workshop/30-solutioning`
- `workshop/40-implementation-setup`
- `workshop/50-ready-for-dev`
- `workshop/60-implementation`
- `workshop/70-complete`
- `workshop/80-mvp`

Legacy aliases still exist for compatibility:

- `stage-1` -> `workshop/10-analysis`
- `stage-2` -> `workshop/20-planning`
- `stage-3` -> `workshop/30-solutioning`
- `stage-4` -> `workshop/40-implementation-setup`
- `ready-for-dev` -> `workshop/50-ready-for-dev`
- `implementation-in-progress` -> `workshop/60-implementation`
- `complete` -> `workshop/70-complete`
- `mvp` -> `workshop/80-mvp`

## What each branch is supposed to contain

- `main`
  - workshop entry point
  - facilitator scripts and guidance
  - no workshop-stage deliverables
  - no app-at-root implementation
- `workshop/10-analysis`
  - BMAD stable v6 payload
  - office floorplan demo assets
  - no planning or implementation outputs yet
- `workshop/20-planning`
  - analysis outputs present
  - no PRD or UX spec yet
- `workshop/30-solutioning`
  - PRD and UX spec present
  - no architecture, epics, or sprint artifacts yet
- `workshop/40-implementation-setup`
  - architecture and implementation-readiness outputs present
  - no dev implementation yet
- `workshop/50-ready-for-dev`
  - sprint artifacts exist
  - still no app-at-root implementation yet
- `workshop/60-implementation`
  - runnable app at repo root
  - tests, data, and sprint status
- `workshop/70-complete`
  - fuller implementation / complete state
- `workshop/80-mvp`
  - final demoable MVP state

The exact stage contracts are enforced by:

- `./scripts/verify-bmad-v6.sh`
- `./workshop-reviewer.sh`

## BMAD state in this repo

This workshop has been migrated to BMAD stable v6 conventions.

Important consequences:

- stable BMAD payload uses `_bmad/` and `.agents/skills/`
- legacy `.bmad/` should not appear in the migrated workshop branches
- workshop checks validate stable-v6 structure and artifact expectations

However, the source branches do not all physically track BMAD files in Git in
the same way. To keep the workshop usable, the session setup scripts now
provision a BMAD Codex bundle into session worktrees when needed.

This means:

- normal raw branch checkouts reflect the committed branch state
- session worktrees are facilitator-oriented and may receive session-only
  injected `_bmad/`, `.agents/`, `.codex/`, `_bmad-output/`, and `.vscode/`
  files
- those injected files are intentionally excluded from Git status in the
  session worktrees

Do not confuse session-only bootstrap files with committed branch content.

## What we are doing in this repo operationally

There are two distinct activities in this repository:

1. maintain the workshop branch progression itself
2. operate live workshop sessions safely and repeatably

### 1. Maintaining the workshop

Typical maintenance work includes:

- keeping each branch in the correct pre-artifact state
- aligning BMAD content and prompts to stable v6
- updating workshop docs and reviewer logic
- validating branch contracts across the full progression
- checking app branches with dev server and e2e runs

The main maintenance scripts are:

- `./scripts/audit-bmad-v6.sh`
  - audits branches for stable-v6 alignment problems
- `./scripts/verify-bmad-v6.sh`
  - enforces required/forbidden files by stage
- `./workshop-reviewer.sh`
  - reviewer guidance plus stage checks and dev/e2e smoke paths

### 2. Operating workshop sessions

Facilitators should prefer the session setup scripts over manual branch
checkout.

Main scripts:

- `./scripts/setup-workshop-session.sh`
- `./scripts/setup-workshop-session.ps1`
- `./scripts/setup-workshop-session-windows.ps1`

These scripts create a per-session worktree layout with one folder per stage.

Current session bootstrap behavior:

- creates worktrees from canonical workshop branches
- resolves legacy local branch names where necessary
- provisions BMAD stable v6 payload into session worktrees if missing
- mirrors BMAD skills into `.codex/skills`
- writes session-local `.vscode/settings.json`
- writes session-local `.vscode/tasks.json`
- auto-starts `codex --yolo` on folder open in VS Code
- keeps the terminal visible in a right-docked panel
- writes explicit Codex trust entries so the trust prompt should not appear
- excludes session-only bootstrap files from Git status

These changes are for workshop delivery convenience and should not be mistaken
for source-branch content changes.

## App structure

There are two different app contexts in this repo:

- `office-floorplans/`
  - Next.js demo / floorplan assets used in earlier stages
- repo root app on later branches
  - Vite desk-booking app used in implementation, complete, and MVP stages

Only later branches (`workshop/60-implementation` onward) are expected to run
the main app from the repo root.

## Important constraints for future agents

- Do not treat this repo like a single branch product repo.
- Always reason in terms of branch progression and stage contracts.
- A later-stage artifact appearing too early is a defect.
- Session worktrees are allowed to differ from committed branch state because
  they are facilitator bootstrap environments.
- If checking correctness of branch contents, inspect the committed branch tree,
  not the session worktree.
- Prefer canonical `workshop/*` names in docs and scripts.
- Keep legacy aliases working only where compatibility still matters.
- Avoid destructive Git operations; workshop branches may be actively used.

## First files to read if you are new here

- `README.md`
- `workshop-branch-strategy.md`
- `WORKSHOP-FACILITATOR-LOCAL-GUIDE.md`
- `workshop-reviewer.sh`
- `scripts/README.md`

That set is enough to understand the workshop purpose, branch model, and
operator workflow.
