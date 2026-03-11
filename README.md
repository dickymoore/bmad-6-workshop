## Desk Booking Application

# BMAD BMM Stage 2 (Planning)
## App locations (workshop note)
- Stages `workshop/desk-booking/10-analysis` through `workshop/desk-booking/50-ready-for-dev`: no runnable app in the repo root; the floorplan demo lives in `office-floorplans/` (Next.js).
- Stages `workshop/desk-booking/60-implementation`, `workshop/desk-booking/70-complete`, `workshop/desk-booking/80-mvp`: run the desk booking app from the repo root (Vite).

## Validation and reviewer helpers
- `./scripts/audit-bmad-v6.sh --all`
- `./scripts/verify-bmad-v6.sh --all --show-failures`
- `./workshop-reviewer.sh --all`
- See `scripts/README.md` for command details.

1. Run Codex.
2. Load PM agent: `/bmad-agent-bmm-pm`.
3. Create PRD: `/bmad-bmm-create-prd`.
4. Create UX design spec: `/bmad-bmm-create-ux-design`.
5. Optional quality pass: `/bmad-bmm-validate-prd`.
6. Exit Codex.
7. `git stash`
8. `git checkout workshop/desk-booking/30-solutioning`
