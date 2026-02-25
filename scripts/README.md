# Workshop Script Reference

This repo includes workshop support scripts for BMAD stable-v6 migration checks
and facilitator session setup.

## `scripts/audit-bmad-v6.sh`

- Purpose: detect legacy BMAD markers and branch-level alignment gaps.
- Typical use:
  - `./scripts/audit-bmad-v6.sh --all`
  - `./scripts/audit-bmad-v6.sh --branch workshop/20-planning --show-hits`
  - `./scripts/audit-bmad-v6.sh --branch stage-2 --show-hits` (legacy alias)
- Exit codes:
  - `0` = all audited branches clean
  - `1` = violations found
  - `2` = usage/runtime error

## `scripts/verify-bmad-v6.sh`

- Purpose: enforce workshop stage contracts (required/forbidden files +
  stable manifest/config checks).
- Typical use:
  - `./scripts/verify-bmad-v6.sh --all --show-failures`
  - `./scripts/verify-bmad-v6.sh --branch workshop/80-mvp`
  - `./scripts/verify-bmad-v6.sh --branch mvp` (legacy alias)
- Exit codes:
  - `0` = verification pass
  - `1` = branch verification failures
  - `2` = usage/runtime error

## `workshop-reviewer.sh`

- Purpose: facilitator script for stage checks and runnable app smoke checks.
- Typical use:
  - `./workshop-reviewer.sh --all` (stage contract + guidance)
  - `./workshop-reviewer.sh --dev --all` (dev server smoke check)
  - `./workshop-reviewer.sh --e2e --all` (Playwright e2e on app branches)
- Notes:
  - `--all` runs canonical `workshop/*` branch progression.
  - `--branch`/positional branch accepts canonical names and legacy aliases.
  - `--dev`/`--e2e` may switch branches; run from a clean tree.
  - App e2e is expected only on `workshop/60-implementation`,
    `workshop/70-complete`, and `workshop/80-mvp`.

## `scripts/setup-workshop-session.ps1`

- Purpose: one-command Windows facilitator setup for a single workshop session.
- Modes:
  - `prepare`: create a session folder with one worktree per branch.
  - `launch`: open VS Code windows for an existing session.
  - `all`: run `prepare` then `launch`.
  - `teardown`: close matching VS Code windows (best effort) and remove
    session folder.
- Typical use:
  - `./scripts/setup-workshop-session.ps1 -Mode all -Session Wed-AM`
  - `./scripts/setup-workshop-session.ps1 -Mode launch -Session Wed-AM`
  - `./scripts/setup-workshop-session.ps1 -Mode teardown -Session Wed-AM`
- Notes:
  - Includes `main` by default plus all canonical `workshop/*` branches.
  - `-UseVirtualDesktops` is optional and requires compatible PowerShell
    desktop commands (for example `New-Desktop`/`Switch-Desktop`).

## `scripts/setup-workshop-session.sh`

- Purpose: bash parity script for Linux/macOS facilitator setup.
- Modes: `prepare`, `launch`, `all`, `teardown`.
- Typical use:
  - `./scripts/setup-workshop-session.sh --mode all --session Wed-AM`
  - `./scripts/setup-workshop-session.sh --mode teardown --session Wed-AM`
- Notes:
  - Virtual desktop orchestration is PowerShell-only.
