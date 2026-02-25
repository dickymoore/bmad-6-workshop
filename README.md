# BMAD BMM Workshop

Kick off the workshop quickly with the steps below. All commands are run from a terminal.

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
   - After install, run `/bmad-help` in Codex to see available agents/workflows.

4) Checkout the workshop stage
   ```bash
   git checkout stage-1
   ```

5) Start the workshop
   - Open `README.md` on the current stage.
   - Follow stage instructions in order.

## Validation and Reviewer Scripts
- `scripts/audit-bmad-v6.sh`: scans branches for legacy BMAD markers and missing stable-v6 structure.
- `scripts/verify-bmad-v6.sh`: enforces stage contracts (expected files/artifacts per branch).
- `workshop-reviewer.sh`: workshop facilitator checker with stage guidance plus `--dev`/`--e2e` smoke helpers.
- Usage examples are documented in `scripts/README.md`.

## App Locations By Stage
- Stages `stage-1` through `ready-for-dev`: no runnable app at repo root; floorplan demo lives in `office-floorplans/` (Next.js).
- Stages `implementation-in-progress`, `complete`, `mvp`: run desk booking app from repo root (Vite).

## Office Floorplans Assets
The floorplan source files live in `office-floorplans/`.

- JSON data: `office-floorplans/assets/floorplans/offices.json`
- Render/demo code: `office-floorplans/src/` and `office-floorplans/scripts/`
- Generated PNGs: `office-floorplans/demo-*.png`

Run the demo locally:
```bash
cd office-floorplans
npm install
npm run dev
# open http://localhost:3000/demo-floorplans
```
