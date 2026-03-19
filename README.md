# BMAD BMM Workshop

This repository is a staged workshop, not a normal single-state app repo.

`main` is the shared workshop bootstrap. The current demo track is the desk
booking app, delivered through namespaced stage branches under
`workshop/desk-booking/*`.

## Quick Start

1) Verify Codex CLI

```bash
codex exec "Tell me a dad joke"
```

2) Clone this repo

```bash
git clone git@github.com:dickymoore/bmad-6-workshop.git
cd bmad-6-workshop
```

3) Install BMAD stable v6

```bash
npx bmad-method@latest install
```

- Choose `Codex` when prompted.
- In Codex, run `/skills` first and confirm BMAD skills are listed.
- Then invoke `bmad-help` (for example `$bmad-help` or `Run bmad-help`) to
  get guided next steps across agents and workflows.
- Do not rely on `/bmad-help`; it may be unrecognized depending on Codex
  version/runtime.

4) Start the desk-booking workshop track

```bash
git checkout workshop/desk-booking/10-analysis
```

- Compatibility names still work while the refactor settles:
  - old canonical: `workshop/10-analysis`
  - legacy alias: `stage-1`

5) Start the workshop

- Open `README.md` on the current branch.
- Follow the stage instructions in order.

## Current Workshop Track

Desk-booking branch progression:

`main -> workshop/desk-booking/10-analysis -> workshop/desk-booking/20-planning ->`
`workshop/desk-booking/30-solutioning -> workshop/desk-booking/40-implementation-setup ->`
`workshop/desk-booking/50-ready-for-dev -> workshop/desk-booking/60-implementation ->`
`workshop/desk-booking/70-complete -> workshop/desk-booking/80-mvp`

Compatibility mappings still accepted by the helper scripts:

- `workshop/10-analysis` -> `workshop/desk-booking/10-analysis`
- `workshop/20-planning` -> `workshop/desk-booking/20-planning`
- `workshop/30-solutioning` -> `workshop/desk-booking/30-solutioning`
- `workshop/40-implementation-setup` -> `workshop/desk-booking/40-implementation-setup`
- `workshop/50-ready-for-dev` -> `workshop/desk-booking/50-ready-for-dev`
- `workshop/60-implementation` -> `workshop/desk-booking/60-implementation`
- `workshop/70-complete` -> `workshop/desk-booking/70-complete`
- `workshop/80-mvp` -> `workshop/desk-booking/80-mvp`
- `stage-1` -> `workshop/desk-booking/10-analysis`
- `stage-2` -> `workshop/desk-booking/20-planning`
- `stage-3` -> `workshop/desk-booking/30-solutioning`
- `stage-4` -> `workshop/desk-booking/40-implementation-setup`
- `ready-for-dev` -> `workshop/desk-booking/50-ready-for-dev`
- `implementation-in-progress` -> `workshop/desk-booking/60-implementation`
- `complete` -> `workshop/desk-booking/70-complete`
- `mvp` -> `workshop/desk-booking/80-mvp`

The track definitions now live under `workshops/`. The current default track is
`desk-booking`, which is defined in `workshops/desk-booking/track.json`.

Additional scaffolded track:

- `albemarle-pulse`
  - participant start: `workshop/albemarle-pulse/10-analysis`
  - rolling authoring branch: `authoring/albemarle-pulse`
  - track definition: `workshops/albemarle-pulse/track.json`
  - facilitator showcase on `main`: `showcase/albemarle-pulse/`

## Workshop Operations

For facilitators and operators preparing or delivering the workshop:

- `workshop-setup-runbook.md`: setup, troubleshooting, and reset workflow.
- `workshop-branch-strategy.md`: track model, branch flow, and compatibility policy.
- `workshop-dry-run-and-delivery-checklists.md`: dry-run and day-of delivery checklists.
- `scripts/workshop-preflight.sh`: readiness checks.
- `scripts/setup-workshop-session.ps1`: Windows session preparation and launch.
- `scripts/setup-workshop-session.sh`: bash session preparation and launch.
- `scripts/export-workshop-showcase.sh`: generate a no-branch-switch facilitator view on `main`.
- `workshop-video-script.md`: facilitation script for demo recording or live delivery.

## Scripts

### `./scripts/workshop-preflight.sh`

- Purpose: readiness check for the repo, environment, and track branches.
- When to run: before a dry-run, before facilitation, or after pulling major changes.
- Example:

```bash
./scripts/workshop-preflight.sh --track desk-booking --strict
```

### `./scripts/audit-bmad-v6.sh`

- Purpose: audit branches for legacy BMAD markers and missing stable-v6 structure.
- When to run: after migration changes or before merging workshop branch updates.
- Example:

```bash
./scripts/audit-bmad-v6.sh --track desk-booking --all --show-hits
```

### `./scripts/verify-bmad-v6.sh`

- Purpose: verify required and forbidden files for each stage in a track.
- When to run: after editing branch content, READMEs, or reviewer guidance.
- Example:

```bash
./scripts/verify-bmad-v6.sh --track desk-booking --all --show-failures
```

### `./workshop-reviewer.sh`

- Purpose: facilitator review script with stage checks, guidance, and `--dev`/`--e2e` smoke paths.
- When to run: during prep, branch QA, and final rehearsal.
- Example:

```bash
./workshop-reviewer.sh --track desk-booking --all
```

### `./scripts/setup-workshop-session.ps1`

- Purpose: automate one workshop delivery session on Windows with `prepare`/`launch`/`desktops`/`all`/`teardown` modes.
- When to run: before each rehearsal or live delivery slot.
- Example:

```powershell
./scripts/setup-workshop-session.ps1 -Track desk-booking -Mode all -Session Wed-AM
```

### `./scripts/setup-workshop-session.sh`

- Purpose: bash parity for one-session setup and teardown.
- When to run: from Linux/macOS/WSL when you want the same per-stage worktree layout.
- Example:

```bash
./scripts/setup-workshop-session.sh --track desk-booking --mode all --session Wed-AM
```

See `scripts/README.md` for more detail.

## App Locations by Stage

- `workshop/desk-booking/10-analysis` through `workshop/desk-booking/50-ready-for-dev`
  do not run the app from repo root. The floorplan demo lives in
  `office-floorplans/` (Next.js).
- `workshop/desk-booking/60-implementation`,
  `workshop/desk-booking/70-complete`, and
  `workshop/desk-booking/80-mvp` run the desk-booking app from repo root (Vite).

## Office Floorplans Assets

The floorplan source files live in `office-floorplans/`.

- JSON data: `office-floorplans/assets/floorplans/offices.json`
- Render and demo code: `office-floorplans/src/` and `office-floorplans/scripts/`
- Generated PNGs: `office-floorplans/demo-*.png`

Run the demo locally:

```bash
cd office-floorplans
npm install
npm run dev
# open http://localhost:3000/demo-floorplans
```
