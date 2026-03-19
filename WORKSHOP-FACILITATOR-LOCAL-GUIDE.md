# Workshop Facilitator Local Guide

This is the operator guide for running repeated BMAD workshop sessions from one machine.

## Core Idea

- `main` is the shared bootstrap branch.
- The current delivery track is `desk-booking`.
- Stage branches for that track live under `workshop/desk-booking/*`.
- Session setup scripts create one worktree/window per branch so you do not have to switch manually during delivery.
- For no-branch-switch delivery, generate and browse `showcase/<track>/` from `main`.

## Branch Order

1. `main`
2. `workshop/desk-booking/10-analysis`
3. `workshop/desk-booking/20-planning`
4. `workshop/desk-booking/30-solutioning`
5. `workshop/desk-booking/40-implementation-setup`
6. `workshop/desk-booking/50-ready-for-dev`
7. `workshop/desk-booking/60-implementation`
8. `workshop/desk-booking/70-complete`
9. `workshop/desk-booking/80-mvp`

## One-Session Setup

PowerShell:

```powershell
./scripts/setup-workshop-session.ps1 -Track desk-booking -Mode all -Session Wed-AM
```

Bash:

```bash
./scripts/setup-workshop-session.sh --track desk-booking --mode all --session Wed-AM
```

Notes:

- use `-UseVirtualDesktops` from PowerShell if you want one branch per desktop
- use `--reset` / `-Reset` to rebuild a session from scratch
- session setup provisions BMAD and Codex bootstrap files into each worktree when needed
- each VS Code window auto-starts `codex --yolo` with a per-worktree `CODEX_HOME`

## Daily Cycle

Per slot:

1. setup the session
2. run `./scripts/workshop-preflight.sh --track desk-booking`
3. run `./workshop-reviewer.sh --track desk-booking --all`
4. deliver the workshop
5. teardown the session

Teardown:

```powershell
./scripts/setup-workshop-session.ps1 -Track desk-booking -Mode teardown -Session Wed-AM
```

```bash
./scripts/setup-workshop-session.sh --track desk-booking --mode teardown --session Wed-AM
```

## Recovery Commands

Refresh repo state:

```bash
git fetch origin --prune
git checkout main
git pull --ff-only origin main
```

Rebuild a broken session:

```bash
./scripts/setup-workshop-session.sh --track desk-booking --mode all --session Wed-AM --reset
```

```powershell
./scripts/setup-workshop-session.ps1 -Track desk-booking -Mode all -Session Wed-AM -Reset
```

Refresh a facilitator showcase:

```bash
./scripts/export-workshop-showcase.sh --track albemarle-pulse
```

Create a clean external facilitator workspace:

```bash
./scripts/create-facilitator-workspace.sh --track albemarle-pulse --destination ../albemarle-pulse-facilitator --reset
```

Each generated phase folder includes `SPEAKER-GUIDE-LINKS.md` with relative links to the files called out in the speaker guide.
The generated workspace also includes `files/installation/` so you can show the BMAD install payload itself.

## Operator Rules

- Prefer the namespaced `workshop/desk-booking/*` branches in all live guidance.
- Treat old `workshop/10-*` and `stage-*` names as compatibility only.
- If you are checking correctness, inspect committed branch state; session worktrees include facilitator-only bootstrap files.
