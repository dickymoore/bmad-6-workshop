# Agent Repo Summary

## What this repo is

This is a staged BMAD workshop repository. It is not a normal product repo.

Participants move branch by branch through a controlled BMAD delivery sequence.
Each branch must stop at the correct artifact boundary so the participant can
create the next stage outputs themselves.

## Branch Model

Shared bootstrap:

- `main`

Current explicit demo track:

- `workshop/desk-booking/10-analysis`
- `workshop/desk-booking/20-planning`
- `workshop/desk-booking/30-solutioning`
- `workshop/desk-booking/40-implementation-setup`
- `workshop/desk-booking/50-ready-for-dev`
- `workshop/desk-booking/60-implementation`
- `workshop/desk-booking/70-complete`
- `workshop/desk-booking/80-mvp`

Compatibility names still exist:

- old canonical `workshop/10-*` style names
- legacy aliases like `stage-1`, `ready-for-dev`, `mvp`

Docs and live delivery should use the namespaced desk-booking branches first.

## Source of Truth for Tracks

Track metadata lives under `workshops/`.

- `workshops/index.json`
- `workshops/desk-booking/track.json`

That data drives:

- canonical branch order
- stage folders for facilitator worktrees
- branch guidance
- required and forbidden file patterns
- compatibility branch mappings

Shell automation reads the track data through:

- `scripts/lib/workshop_tracks.py`
- `scripts/lib/workshop_tracks.sh`

## What each branch is supposed to contain

- `main`
  - shared workshop bootstrap
  - facilitator scripts and docs
  - no stage artifacts
- early desk-booking stages
  - BMAD payload and progressively accumulating analysis/planning/solutioning outputs
  - no later-stage implementation artifacts
- implementation stages
  - runnable root app, tests, data, and sprint artifacts

The enforcement scripts are:

- `./scripts/audit-bmad-v6.sh`
- `./scripts/verify-bmad-v6.sh`
- `./workshop-reviewer.sh`

## BMAD and Session Bootstrap

This repo is aligned to BMAD stable v6.

Important distinction:

- committed branch content is the workshop truth
- facilitator session worktrees may receive injected `_bmad/`, `.agents/`,
  `.codex/`, `_bmad-output/`, and `.vscode/` files so live delivery stays smooth

Those injected files are session-only and intentionally excluded from Git status.

## Operational Modes

There are two kinds of work here:

1. maintain the workshop branches and docs
2. run workshop sessions safely and repeatably

Main session tools:

- `./scripts/setup-workshop-session.sh`
- `./scripts/setup-workshop-session.ps1`
- `./scripts/setup-workshop-session-windows.ps1`

These create one worktree per branch, bootstrap BMAD/Codex where needed, and
open VS Code with `codex --yolo` auto-started per worktree.

## Constraints Future Agents Must Respect

- Do not treat this like a single-branch app repo.
- A later-stage artifact appearing too early is a defect.
- Prefer namespaced `workshop/<track>/*` branches in new docs and tooling.
- Keep compatibility names working where they materially reduce delivery risk.
- When validating branch content, inspect the committed tree, not a prepared session worktree.
- Avoid destructive Git operations; workshop branches are live training assets.
