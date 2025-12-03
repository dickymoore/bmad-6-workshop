## desk Booking Application

# BMAD BMM Stage 4 - One story left.
1. Inspect docs/sprint-artifacts/sprint-status.yaml. Just one more story.
2. Run Codex.
3. /prompts:bmad-bmm-agents-dev
4. *workflow-status 
5. *develop-story 4-4
6. *code-review 4-4
7. /prompts:bmad-bmm-agents-sm
8. *epic-retrospective epic-4
9. Mark Epic 4 as done in docs/sprint-artifacts/sprint-status.yaml
... Run the application!


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
- `.gitignore` already excludes backup artifacts, build output, and `node_modules`.
- Story and sprint tracking files are under `docs/sprint-artifacts/`.
