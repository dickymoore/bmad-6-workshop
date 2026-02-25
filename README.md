## Desk Booking Application

# BMAD BMM Stage 1 (Analysis)
## App locations (workshop note)
- Stages `stage-1` through `ready-for-dev`: no runnable app in the repo root; the floorplan demo lives in `office-floorplans/` (Next.js).
- Stages `implementation-in-progress`, `complete`, `mvp`: run the desk booking app from the repo root (Vite).

1. Run Codex.
2. Run `/bmad-help` to confirm the stable command set.
3. Load analyst agent: `/bmad-agent-bmm-analyst`.
4. Create product brief: `/bmad-bmm-create-product-brief`.
5. Run brainstorming: `/bmad-brainstorming`.
6. Run technical research: `/bmad-bmm-technical-research`.
7. Review created artifacts under `docs/`.
8. Exit Codex.
9. `git stash`
10. `git checkout stage-2`

# Office Floorplans Assets
The project files now live in `office-floorplans/`.

- JSON data: `office-floorplans/assets/floorplans/offices.json`
- Render code and demo: `office-floorplans/src/` + `office-floorplans/scripts/`
- Generated PNGs: `office-floorplans/demo-*.png`

To run the demo:
```bash
cd office-floorplans
npm install
npm run dev
# open http://localhost:3000/demo-floorplans
```
