## Desk Booking Application

# BMAD BMM Stage 3 (Solutioning)
## App locations (workshop note)
- Stages `workshop/desk-booking/10-analysis` through `workshop/desk-booking/50-ready-for-dev`: no runnable app in the repo root; the floorplan demo lives in `office-floorplans/` (Next.js).
- Stages `workshop/desk-booking/60-implementation`, `workshop/desk-booking/70-complete`, `workshop/desk-booking/80-mvp`: run the desk booking app from the repo root (Vite).

## Validation and reviewer helpers
- `./scripts/audit-bmad-v6.sh --all`
- `./scripts/verify-bmad-v6.sh --all --show-failures`
- `./workshop-reviewer.sh --all`
- See `scripts/README.md` for command details.

1. Run Codex.
2. Load architect agent: `/bmad-agent-bmm-architect`.
3. Create architecture: `/bmad-bmm-create-architecture`.
4. Create epics and stories: `/bmad-bmm-create-epics-and-stories`.
5. Validate implementation readiness: `/bmad-bmm-check-implementation-readiness`.
6. Optional QA planning support: `/bmad-agent-bmm-qa`.
7. Exit Codex.
8. `git stash`
9. `git checkout workshop/desk-booking/40-implementation-setup`
