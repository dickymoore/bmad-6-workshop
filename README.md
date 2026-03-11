## Desk Booking Application

# BMAD BMM Stage 4 (Implementation Setup)
## App locations (workshop note)
- Stages `workshop/desk-booking/10-analysis` through `workshop/desk-booking/50-ready-for-dev`: no runnable app in the repo root; the floorplan demo lives in `office-floorplans/` (Next.js).
- Stages `workshop/desk-booking/60-implementation`, `workshop/desk-booking/70-complete`, `workshop/desk-booking/80-mvp`: run the desk booking app from the repo root (Vite).

## Validation and reviewer helpers
- `./scripts/audit-bmad-v6.sh --all`
- `./scripts/verify-bmad-v6.sh --all --show-failures`
- `./workshop-reviewer.sh --all`
- See `scripts/README.md` for command details.

1. Run Codex.
2. Load Scrum Master agent: `/bmad-agent-bmm-sm`.
3. Create sprint status from epics: `/bmad-bmm-sprint-planning`.
4. Create implementation story files: `/bmad-bmm-create-story`.
5. Inspect `docs/sprint-artifacts/sprint-status.yaml` and created story files.
6. Exit Codex.
7. `git stash`
8. `git checkout workshop/desk-booking/50-ready-for-dev`
