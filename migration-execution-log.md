# BMAD Stable-v6 Migration Execution Log

## Session Metadata
- Date: 2026-02-25
- Operator: Codex
- Repo: `dickymoore/bmad-6-workshop`
- Migration target: BMAD stable v6 (`bmad-method@latest`, currently `6.0.3`)

## Phase 0: Baseline and Commit Context
### Relevant recent commits observed
- `4c06df1`..`f981a50`: Add dev/e2e helpers to workshop reviewer across workshop branches
- `336ec44`, `048d213`, `d500c6b`, `adbf438`, `6f4df66`, `c383519`, `3b891cd`, `be18cbb`, `4b58912`: Clarify app location guidance across branches
- `8029066`: Add workshop video script
- `2fb9b51`: workshop stabilization plan (feature branch)

### Baseline branch state (pre-migration)
- Non-main workshop branches still contain `.bmad` with manifest version `6.0.0-alpha.12`.
- Legacy command markers present (`/prompts:bmad-*`, `*workflow-init`, `*workflow-status`, `@alpha`).

### Baseline automation results
- `./scripts/audit-bmad-v6.sh --all`: FAIL on all 9 workshop branches (expected pre-migration).
- `./scripts/verify-bmad-v6.sh --all`: FAIL on all 9 workshop branches (expected pre-migration).

## Phase 1: Automation Implementation
- Added `scripts/audit-bmad-v6.sh`
- Added `scripts/migrate-bmad-v6.sh`
- Added `scripts/verify-bmad-v6.sh`
- Hardened scripts to resolve local/remote refs (`branch` vs `origin/branch`) deterministically.
- Hardened verification script for missing `_bmad` config in pre-migration branches.

## Phase 2: Pilot (stage-1, stage-2)
- Executed pilot migration with `scripts/migrate-bmad-v6.sh` on `stage-1` and `stage-2`.
- Stable installer executed successfully and upgraded both branches to `_bmad` manifest version `6.0.3`.
- Pilot defects found:
  1. audit/verify originally assumed local branch refs only.
  2. migration script did not carry shared scripts into non-main branches.
  3. legacy marker regex over-reported due reviewer guard patterns.
  4. workshop reviewer and README transformations needed stable-v6 refresh.
- Fixes applied in automation:
  - Added local/remote ref resolution.
  - Added payload sync for scripts + reviewer per migrated branch.
  - Tightened legacy marker detection to command markers.
  - Upgraded migration replacements for stable agent/workflow commands.
