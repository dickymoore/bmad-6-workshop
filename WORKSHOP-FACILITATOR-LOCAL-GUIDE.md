# Workshop Facilitator Local Guide (Untracked)

This is a local operator guide for running BMAD workshops quickly and
consistently.

## 1. What This Covers

- How to spin up one workshop session with one folder/window per branch
- How to use the video script during delivery/recording
- Which scripts to run before, during, and after each session
- Fast recovery commands if anything goes wrong

## 2. Key Files

- Core workshop: `README.md`
- Facilitation runbook: `workshop-setup-runbook.md`
- Video timeline/script: `workshop-video-script.md`
- Branch strategy: `workshop-branch-strategy.md`
- Stage checks + smoke tests: `workshop-reviewer.sh`
- Preflight: `scripts/workshop-preflight.sh`
- Session setup (Windows/PowerShell): `scripts/setup-workshop-session.ps1`
- Session setup (bash): `scripts/setup-workshop-session.sh`

## 3. Branch Order (Canonical)

1. `main`
2. `workshop/10-analysis`
3. `workshop/20-planning`
4. `workshop/30-solutioning`
5. `workshop/40-implementation-setup`
6. `workshop/50-ready-for-dev`
7. `workshop/60-implementation`
8. `workshop/70-complete`
9. `workshop/80-mvp`

## 4. One-Session Setup (Recommended)

Run this per session (for example `Wed-AM`).

### PowerShell (Windows)

```powershell
./scripts/setup-workshop-session.ps1 -Mode all -Session Wed-AM
```

Optional virtual desktops (best effort):

```powershell
./scripts/setup-workshop-session.ps1 -Mode all -Session Wed-AM -UseVirtualDesktops
```

Notes:
- Includes `main` by default.
- Use `-ExcludeMain` if needed.
- Use `-NoCode` for prepare-only.

### Bash (Linux/macOS or WSL)

```bash
./scripts/setup-workshop-session.sh --mode all --session Wed-AM
```

Notes:
- `--use-virtual-desktops` is a no-op in bash.
- Use `--exclude-main` if needed.
- Use `--no-code` for prepare-only.

## 5. Mode-by-Mode Commands

### Prepare only

PowerShell:

```powershell
./scripts/setup-workshop-session.ps1 -Mode prepare -Session Wed-AM
```

Bash:

```bash
./scripts/setup-workshop-session.sh --mode prepare --session Wed-AM
```

### Launch only

PowerShell:

```powershell
./scripts/setup-workshop-session.ps1 -Mode launch -Session Wed-AM
```

Bash:

```bash
./scripts/setup-workshop-session.sh --mode launch --session Wed-AM
```

### Teardown after session

PowerShell:

```powershell
./scripts/setup-workshop-session.ps1 -Mode teardown -Session Wed-AM
```

Bash:

```bash
./scripts/setup-workshop-session.sh --mode teardown --session Wed-AM
```

## 6. Running Four Sessions in a Day

Repeat this cycle:

1. `Wed-AM`: setup -> deliver -> teardown
2. `Wed-PM`: setup -> deliver -> teardown
3. `Thu-AM`: setup -> deliver -> teardown
4. `Thu-PM`: setup -> deliver -> teardown

Example (PowerShell):

```powershell
./scripts/setup-workshop-session.ps1 -Mode all -Session Wed-AM -UseVirtualDesktops
# run workshop
./scripts/setup-workshop-session.ps1 -Mode teardown -Session Wed-AM
```

## 7. Pre-Workshop Checks

```bash
./scripts/workshop-preflight.sh --strict
./workshop-reviewer.sh --all
```

Optional smoke checks:

```bash
./workshop-reviewer.sh --dev --all
./workshop-reviewer.sh --e2e --all
```

## 8. Using The Video Script Live

Use `workshop-video-script.md` as the live timeline.

Suggested operator flow:

1. Keep `workshop-video-script.md` open in one fixed window.
2. Keep stage branch windows pre-opened (from setup script).
3. Follow the timeline markers and branch transitions exactly.
4. Use `README.md` in each branch as the source of stage-specific instructions.
5. If time slips, skip deep implementation UI walkthrough before MVP (as the
   script notes).

## 9. Quality Gate Before You Start

```bash
bash -n scripts/*.sh workshop-reviewer.sh
npx markdownlint-cli README.md scripts/README.md workshop-setup-runbook.md
./scripts/setup-workshop-session.sh --help
```

PowerShell parse check:

```powershell
[System.Management.Automation.Language.Parser]::ParseFile(
  'scripts/setup-workshop-session.ps1',
  [ref]$null,
  [ref]$null
) | Out-Null
```

## 10. Quick Recovery Commands

If local repo gets messy:

```bash
git fetch origin --prune
git checkout main
git pull --ff-only origin main
```

If session folder needs rebuild:

PowerShell:

```powershell
./scripts/setup-workshop-session.ps1 -Mode all -Session Wed-AM -Reset
```

Bash:

```bash
./scripts/setup-workshop-session.sh --mode all --session Wed-AM --reset
```

If virtual desktop automation fails, rerun without desktop option and continue.

## 11. Known Behavior Notes

- Session setup scripts use a local mirror + worktrees for speed.
- PowerShell script can attempt VS Code window cleanup on teardown.
- `-UseVirtualDesktops` requires compatible desktop commands in PowerShell.
- Workshop branch aliases still exist for compatibility, but canonical
  `workshop/*` names should be used in facilitation.

## 12. Session Operator Checklist

1. Run `setup-workshop-session` in `all` mode for current slot.
2. Confirm all expected branch folders/windows exist.
3. Run `workshop-preflight` and `workshop-reviewer --all`.
4. Deliver with `workshop-video-script.md` timeline + branch windows.
5. Run teardown for the slot.
6. Repeat for next slot.
