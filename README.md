# BMAD BMM Stage 4 - Ready for Dev
## App locations (workshop note)
- Stages `workshop/desk-booking/10-analysis` through `workshop/desk-booking/50-ready-for-dev`: no runnable app in the repo root; the floorplan demo lives in `office-floorplans/` (Next.js).
- Stages `workshop/desk-booking/60-implementation`, `workshop/desk-booking/70-complete`, `workshop/desk-booking/80-mvp`: run the desk booking app from the repo root (Vite).

1. Inspect `docs/sprint-artifacts/sprint-status.yaml`.
2. Run Codex.
3. Load dev agent: `/bmad-agent-bmm-dev`.
4. Implement stories with `/bmad-bmm-dev-story`.
5. Run `/bmad-bmm-code-review` after each implemented story.
6. Load Scrum Master agent: `/bmad-agent-bmm-sm`.
7. Run epic retrospective when ready: `/bmad-bmm-retrospective`.
8. Exit Codex.
9. `git checkout workshop/desk-booking/60-implementation`
