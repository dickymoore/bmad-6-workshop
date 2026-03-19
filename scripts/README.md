# Workshop Script Reference

The workshop automation now runs off track definitions in `workshops/`.

Current default track: `desk-booking`

## `scripts/audit-bmad-v6.sh`

- Purpose: detect legacy BMAD markers and missing stable-v6 structure.
- When to run: after migration work, after branch-content edits, or before merge.
- Example:

```bash
./scripts/audit-bmad-v6.sh --track desk-booking --all --show-hits
./scripts/audit-bmad-v6.sh --track desk-booking --branch workshop/desk-booking/20-planning
./scripts/audit-bmad-v6.sh --track desk-booking --branch stage-2
```

## `scripts/verify-bmad-v6.sh`

- Purpose: enforce required/forbidden file rules for each branch in a track.
- When to run: after updating workshop content, READMEs, or reviewer logic.
- Example:

```bash
./scripts/verify-bmad-v6.sh --track desk-booking --all --show-failures
./scripts/verify-bmad-v6.sh --track desk-booking --branch workshop/desk-booking/80-mvp
./scripts/verify-bmad-v6.sh --track desk-booking --branch mvp
```

## `workshop-reviewer.sh`

- Purpose: facilitator branch checker plus dev/e2e smoke runner.
- When to run: during workshop QA, dry-runs, and final rehearsal.
- Example:

```bash
./workshop-reviewer.sh --track desk-booking --all
./workshop-reviewer.sh --track desk-booking --dev --all
./workshop-reviewer.sh --track desk-booking --e2e --all
```

- Notes:
  - `--all` walks the namespaced canonical track branches.
  - positional branch arguments still accept compatibility names.
  - app e2e is expected only on the desk-booking app stages:
    `workshop/desk-booking/60-implementation`,
    `workshop/desk-booking/70-complete`,
    `workshop/desk-booking/80-mvp`

## `scripts/workshop-preflight.sh`

- Purpose: facilitator machine and repo readiness check.
- When to run: before every rehearsal or live session.
- Example:

```bash
./scripts/workshop-preflight.sh --track desk-booking --strict
```

## `scripts/setup-workshop-session.ps1`

- Purpose: Windows facilitator setup for a single session.
- Modes: `prepare`, `launch`, `desktops`, `all`, `teardown`.
- When to run: before each rehearsal or delivery slot.
- Example:

```powershell
./scripts/setup-workshop-session.ps1 -Track desk-booking -Mode all -Session Wed-AM
./scripts/setup-workshop-session.ps1 -Track desk-booking -Mode desktops -Session Wed-AM
./scripts/setup-workshop-session.ps1 -Track desk-booking -Mode teardown -Session Wed-AM
```

- Notes:
  - includes `main` plus the selected track by default
  - `-MaxBranches <n>` limits the stage set for smoke tests
  - if a branch does not track `_bmad` and `.agents/skills`, the script provisions a stable bundle into the session worktree
  - session worktrees get `.codex`, `.vscode/settings.json`, and a folder-open task that starts `codex --yolo`

## `scripts/setup-workshop-session.sh`

- Purpose: bash parity for facilitator session setup.
- Modes: `prepare`, `launch`, `all`, `teardown`.
- When to run: from Linux/macOS/WSL.
- Example:

```bash
./scripts/setup-workshop-session.sh --track desk-booking --mode all --session Wed-AM
./scripts/setup-workshop-session.sh --track desk-booking --mode all --session Wed-AM --max-branches 2
./scripts/setup-workshop-session.sh --track desk-booking --mode teardown --session Wed-AM
```

- Notes:
  - virtual desktop control is PowerShell-only
  - includes `main` plus the selected track by default
  - session worktrees get the same BMAD/Codex bootstrap as the PowerShell version

## `scripts/cut-workshop-stage.sh`

- Purpose: create the next frozen participant branch from `authoring/<track>`.
- When to run: immediately after completing a stage on the rolling authoring branch.
- Example:

```bash
./scripts/cut-workshop-stage.sh --track albemarle-pulse --completed-stage 10-analysis
```

- Notes:
  - requires a clean working tree
  - expects to run from `authoring/<track>` by default
  - creates an annotated tag, the next `workshop/<track>/*` branch, and appends to `workshop-logs/<track>/cuts.md`
  - pushes the branch and tag unless `--no-push` is supplied

## `scripts/start-workshop-authoring-log.sh`

- Purpose: start a local transcript for one workshop authoring stage using the Unix `script` command.
- When to run: at the start of each BMAD stage authoring session.
- Example:

```bash
./scripts/start-workshop-authoring-log.sh --track albemarle-pulse --stage 10-analysis
```

## `scripts/export-workshop-showcase.sh`

- Purpose: generate a facilitator-friendly folder view from the frozen `workshop/<track>/*` branches.
- When to run: after cutting stage branches, or any time the facilitator showcase needs refreshing.
- Example:

```bash
./scripts/export-workshop-showcase.sh --track albemarle-pulse
```

- Notes:
  - writes to `showcase/<track>/` on the current branch
  - exports each stage into `showcase/<track>/<stage>/snapshot/`
  - leaves a placeholder folder for stages that have not been cut yet

## `scripts/create-facilitator-workspace.sh`

- Purpose: create a clean facilitator workspace outside this repo with `files/`, an empty `.codex/`, and a checkout of `agent-replay/`.
- When to run: when you want a no-branch-switch delivery folder on another machine.
- Example:

```bash
./scripts/create-facilitator-workspace.sh --track albemarle-pulse --destination ../albemarle-pulse-facilitator --reset
```

- Batch example for multiple sessions:

```bash
mkdir -p ../facilitator-workspaces

for session in \
  test-runthrough \
  deep-dive \
  test-2 \
  Wed-1 Wed-2 Wed-3 Wed-4 \
  Thu-1 Thu-2 Thu-3 Thu-4
do
  ./scripts/create-facilitator-workspace.sh \
    --track albemarle-pulse \
    --destination "../facilitator-workspaces/${session}" \
    --reset
done
```

- Notes:
  - destination must be outside the repo
  - `files/installation/` shows the BMAD install payload from `main`, including `.agents/skills` and selected `_bmad` config files
  - `files/` contains phase folders like `phase-1-analysis/` and `phase-6-implementation/`
  - `files/phase-1-analysis/DEMO-START-PROMPT.md` contains the track-specific opening prompt for the live demo
  - `START-HERE.md` gives you one top-level page linking to the prompt, installation view, phase folders, and `agent-replay/`
  - phases without a frozen branch yet still get placeholder folders
  - clones `https://github.com/dickymoore/agent-replay` into `agent-replay/`
  - generates `SPEAKER-GUIDE-LINKS.md` inside each facilitator folder with relative links to the files referenced in the speaker guide
  - optional BMB export support:

```bash
./scripts/create-facilitator-workspace.sh \
  --track albemarle-pulse \
  --destination ../albemarle-pulse-facilitator \
  --bmb-repo /home/codexuser/transforming_for_success \
  --bmb-module evidence-blueprint \
  --reset
```
