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
- After install, run `/bmad-help` in Codex to see available agents and
  workflows.

1) Checkout the workshop stage

```bash
git checkout stage-1
```

1) Start the workshop

- Open `README.md` on the current stage.
- Follow stage instructions in order.

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

## App Locations by Stage

- Stages `stage-1` through `ready-for-dev` have no runnable app at repo root.
  The floorplan demo lives in `office-floorplans/` (Next.js).
- Stages `implementation-in-progress`, `complete`, and `mvp` run the desk
  booking app from repo root (Vite).

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
