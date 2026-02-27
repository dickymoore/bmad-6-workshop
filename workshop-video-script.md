# BMAD BMM Workshop Video Script (Rough Timing)

## 00:00 - 00:45 | Hook + What Viewers Will Learn

- Headline: "From zero to MVP with BMAD BMM: a staged workshop."
- Show the repo tree and branches list:
  `git branch -a | sed -n '1,12p'`.
- One-liner outcome:
  "We'll walk stage-by-stage from analysis to MVP and show the expected
  artifacts at each stage."

## 00:45 - 02:30 | Repo Orientation + Workshop Flow

- Headline: "How this workshop is structured."
- Explain branch order:
  `main -> workshop/10-analysis -> workshop/20-planning ->`
  `workshop/30-solutioning -> workshop/40-implementation-setup ->`
  `workshop/50-ready-for-dev -> workshop/60-implementation ->`
  `workshop/70-complete -> workshop/80-mvp`.
- Show `README.md` on `main`.
- Mention app location split:
  - Early stages: no runnable app at repo root; demo lives in
    `office-floorplans/`.
  - Later stages: Vite app at repo root.
- Optional: run `./workshop-reviewer.sh --all` and point out how it validates
  stage state.

## 02:30 - 05:00 | Stage 1 (Analysis)

- Headline: "Stage 1: Analysis setup and elicitation."
- Command: `git checkout workshop/10-analysis`
- Open `README.md` and follow the stage instructions.
- In Codex:
  - `/skills` (confirm BMAD skills are visible)
  - `$bmad-help` (start with guided next-step routing)
  - `$bmad-agent-bmm-analyst`
  - `$bmad-bmm-create-product-brief`
  - choose advanced elicitation options as needed
- Highlight output artifacts to expect:
  - `_bmad/` and `.agents/skills/` exist
  - planning docs are not created yet
- Wrap: `git stash` then `git checkout workshop/20-planning`.

## 05:00 - 07:30 | Stage 2 (Planning)

- Headline: "Stage 2: Planning artifacts."
- Open `README.md` and show `docs/` expected files:
  - `docs/adr/ADR-001-tech-stack.md`
  - brainstorming, research, and product brief outputs
- Mention: PRD and UX spec are not created yet.
- Transition: `git stash` then `git checkout workshop/30-solutioning`.

## 07:30 - 11:00 | Stage 3 (Solutioning)

- Headline: "Stage 3: Architecture and epics."
- Show `README.md` instructions.
- Run in Codex:
  - `$bmad-agent-bmm-architect`
  - `$bmad-bmm-create-architecture`
  - `$bmad-bmm-create-epics-and-stories`
- Expected artifacts:
  - `docs/prd.md`
  - `docs/ux-design-specification.md`
  - no sprint artifacts yet
- Transition: `git stash` then `git checkout workshop/40-implementation-setup`.

## 11:00 - 13:30 | Stage 4 (Implementation Setup)

- Headline: "Stage 4: Sprint planning and story setup."
- Show `README.md` and the artifacts now expected:
  - `docs/architecture.md`
  - `docs/epics.md`
  - `docs/implementation-readiness-report-*.md`
  - `docs/test-design-epic-1.md`
- Run with PM and SM commands:
  - `$bmad-agent-bmm-pm`
  - `$bmad-bmm-sprint-planning`
  - `$bmad-agent-bmm-sm`
  - `$bmad-bmm-create-story`
- Transition: `git stash` then `git checkout workshop/50-ready-for-dev`.

## 13:30 - 16:00 | Ready-for-dev (Hand-off)

- Headline: "Ready-for-dev: stories in place, dev can start."
- Show `docs/sprint-artifacts/sprint-status.yaml`.
- Show a story file `docs/sprint-artifacts/1-1-*.md`.
- Emphasize: still no root app at this stage.
- Transition: `git checkout workshop/60-implementation`.

## 16:00 - 21:30 | Implementation-in-progress (Run the App)

- Headline: "Implementation-in-progress: run the Vite app."
- Commands:
  - `npm install`
  - `npm run dev`
  - open `http://localhost:5173`
- Walk the UI quickly:
  - Office, floor, and date filters
  - floorplan hotspots
  - booking confirmation
  - roster manager
  - backup export and import
- Mention data files under `data/` and backups under `data/backup/`.

## 21:30 - 25:00 | Complete (Bug Hunt / Correct Course)

- Headline: "Complete: find and fix a bug with Correct Course."
- Command: `git checkout workshop/70-complete`
- Run app again and reproduce the bug noted in `README.md`.
- Run Codex PM:
  - `$bmad-agent-bmm-pm`
  - `$bmad-bmm-correct-course`
- Fix and re-check app.

## 25:00 - 29:00 | MVP (Final State)

- Headline: "MVP: working app plus tests."
- Command: `git checkout workshop/80-mvp`
- Run `npm install` and `npm run dev` if needed.
- Optional: run e2e tests
  - `BASE_URL=http://localhost:5173 E2E_RUN=1 npm run test:e2e`
- Highlight the finished feature list in `README.md`.

## 29:00 - 30:00 | Wrap-up + Call to Action

- Headline: "What you get out of this workshop."
- Recap:
  - BMAD BMM process
  - concrete artifacts per stage
  - working MVP and tests
- Invite viewers to clone and follow along.

---

## Optional On-screen Commands (Quick Reference)

- `./workshop-reviewer.sh --all`
- `./workshop-reviewer.sh --dev workshop/10-analysis`
- `./workshop-reviewer.sh --dev workshop/60-implementation`
- `./workshop-reviewer.sh --e2e workshop/80-mvp`

## Notes to Self (Not for Screen)

- Keep the pace brisk; pause only when showing artifacts.
- For Codex steps, narrate what you expect to see and why it matters.
- If time runs short, skip deep UI walkthrough in `workshop/60-implementation`.
