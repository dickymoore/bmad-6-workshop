# BMAD BMM Workshop

Kick off the workshop quickly with the steps below. All commands are run from
a terminal.

## Quick Start

1) Verify Codex CLI

```bash
codex exec "Tell me a dad joke"
```

1) Clone this repo

```bash
git clone git@github.com:dickymoore/bmad-6-workshop.git
cd bmad-6-workshop
```

1) Install BMAD stable v6

```bash
npx bmad-method@latest install
```

- Choose `Codex` when prompted.
- In Codex, invoke the skill by name (for example: `Run bmad-help`) to see
  available agents and workflows. (`/bmad-help` may be unrecognized depending
  on Codex version/runtime.)

1) Checkout the workshop stage

```bash
git checkout workshop/10-analysis
```

- Legacy alias still supported for one cycle: `stage-1`.

1) Start the workshop

- Open `README.md` on the current stage.
- Follow stage instructions in order.

## Workshop Operations

For facilitators and operators preparing or delivering the workshop:

- [workshop-setup-runbook.md](workshop-setup-runbook.md): setup,
  troubleshooting, and reset workflow.
- [workshop-branch-strategy.md](workshop-branch-strategy.md): branch flow,
  merge order, and ownership.
- [workshop-dry-run-and-delivery-checklists.md](workshop-dry-run-and-delivery-checklists.md):
  dry-run and day-of delivery checklists.
- [`./scripts/workshop-preflight.sh`](scripts/workshop-preflight.sh): run
  readiness checks (`./scripts/workshop-preflight.sh --all`).
- [`./scripts/setup-workshop-session.ps1`](scripts/setup-workshop-session.ps1):
  create/open/teardown a single facilitator session with one folder per stage.
- [`./scripts/setup-workshop-session.sh`](scripts/setup-workshop-session.sh):
  bash parity for single-session setup and teardown.
- [workshop-video-script.md](workshop-video-script.md): facilitation script
  for demo recording or live delivery.

## Scripts

### `./scripts/workshop-preflight.sh`

- Purpose: one-command readiness check for workshop environment and branch
  setup.
- When to run: before a dry-run, before facilitation, or after pulling major
  changes.
- Example:

```bash
./scripts/workshop-preflight.sh --all
```

### `./scripts/audit-bmad-v6.sh`

- Purpose: audit branches for legacy BMAD markers and missing stable-v6
  structure.
- When to run: after migration updates or before merging workshop branch
  changes.
- Example:

```bash
./scripts/audit-bmad-v6.sh --all --show-hits
```

### `./scripts/verify-bmad-v6.sh`

- Purpose: verify stage contracts, including required and forbidden files plus
  stable-v6 config expectations.
- When to run: after editing stage artifacts or READMEs, and before release or
  merge.
- Example:

```bash
./scripts/verify-bmad-v6.sh --all --show-failures
```

### `./workshop-reviewer.sh`

- Purpose: facilitator review script with stage checks, guidance, and
  `--dev`/`--e2e` smoke paths.
- When to run: during workshop prep and final quality checks across branches.
- Example:

```bash
./workshop-reviewer.sh --all
```

### `./scripts/setup-workshop-session.ps1`

- Purpose: automate one workshop delivery session on Windows with
  `prepare`/`launch`/`all`/`teardown` modes.
- Includes: `main` plus all canonical `workshop/*` branches by default.
- Example:

```powershell
./scripts/setup-workshop-session.ps1 -Mode all -Session Wed-AM
```

### `./scripts/setup-workshop-session.sh`

- Purpose: bash parity for one-session setup and teardown.
- Example:

```bash
./scripts/setup-workshop-session.sh --mode all --session Wed-AM
```

## Branch Names

Canonical workshop branch progression:

`main -> workshop/10-analysis -> workshop/20-planning ->`
`workshop/30-solutioning -> workshop/40-implementation-setup ->`
`workshop/50-ready-for-dev -> workshop/60-implementation ->`
`workshop/70-complete -> workshop/80-mvp`

Legacy aliases are still accepted for one compatibility cycle:

- `stage-1` -> `workshop/10-analysis`
- `stage-2` -> `workshop/20-planning`
- `stage-3` -> `workshop/30-solutioning`
- `stage-4` -> `workshop/40-implementation-setup`
- `ready-for-dev` -> `workshop/50-ready-for-dev`
- `implementation-in-progress` -> `workshop/60-implementation`
- `complete` -> `workshop/70-complete`
- `mvp` -> `workshop/80-mvp`

## App Locations by Stage

- Stages `workshop/10-analysis` through `workshop/50-ready-for-dev` have no
  runnable app at repo root. The floorplan demo lives in
  `office-floorplans/` (Next.js).
- Stages `workshop/60-implementation`, `workshop/70-complete`, and
  `workshop/80-mvp` run the desk booking app from repo root (Vite).

## Office Floorplans Assets

The floorplan source files live in `office-floorplans/`.

- JSON data: `office-floorplans/assets/floorplans/offices.json`
- Render and demo code: `office-floorplans/src/` and
  `office-floorplans/scripts/`
- Generated PNGs: `office-floorplans/demo-*.png`

Run the demo locally:

```bash
cd office-floorplans
npm install
npm run dev
# open http://localhost:3000/demo-floorplans
```
