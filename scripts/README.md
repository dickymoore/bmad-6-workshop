# Workshop Script Reference

This repo includes three workshop support scripts for BMAD stable-v6 migration checks.

## `scripts/audit-bmad-v6.sh`
- Purpose: detect legacy BMAD markers and branch-level alignment gaps.
- Typical use:
  - `./scripts/audit-bmad-v6.sh --all`
  - `./scripts/audit-bmad-v6.sh --track desk-booking --branch workshop/desk-booking/20-planning --show-hits`
- Exit codes:
  - `0` = all audited branches clean
  - `1` = violations found
  - `2` = usage/runtime error

## `scripts/verify-bmad-v6.sh`
- Purpose: enforce workshop stage contracts (required/forbidden files + stable manifest/config checks).
- Typical use:
  - `./scripts/verify-bmad-v6.sh --all --show-failures`
  - `./scripts/verify-bmad-v6.sh --track desk-booking --branch workshop/desk-booking/80-mvp`
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
  - `--dev`/`--e2e` may switch branches; run from a clean tree.
  - App e2e is expected only on `workshop/desk-booking/60-implementation`, `workshop/desk-booking/70-complete`, and `workshop/desk-booking/80-mvp`.
