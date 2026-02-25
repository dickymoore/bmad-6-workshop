## Desk Booking Application

# BMAD BMM Stage 4 - One story left

1. Inspect `docs/sprint-artifacts/sprint-status.yaml`.
2. Run Codex.
3. Load dev agent: `/bmad-agent-bmm-dev`.
4. Implement remaining story with `/bmad-bmm-dev-story`.
5. Validate with `/bmad-bmm-code-review`.
6. Load Scrum Master agent: `/bmad-agent-bmm-sm`.
7. Run epic retrospective: `/bmad-bmm-retrospective`.
8. Mark epic completion in `docs/sprint-artifacts/sprint-status.yaml`.

## App location (workshop note)
- From this stage onward, run the app from the repo root (Vite).
- `office-floorplans/` is the floorplan demo/asset source used by the app.

### Quickstart (Node 22.x)
1. `npm install`
2. `npm run dev`
3. Data lives under `data/`:
   - `users.json`
   - `bookings.json`
   - `last-updated.json`
   - `data/backup/` (snapshots)

Notes:
- Stack: React 19.2, Vite 6.2.x, Radix UI 1.2.x primitives.
- Story and sprint tracking files are under `docs/sprint-artifacts/`.
