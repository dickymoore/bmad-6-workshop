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
