# BMAD Workshop Setup Runbook

## Purpose

This runbook standardizes workshop delivery so facilitators can run the same
session repeatedly without improvising branch flow or environment setup.

## Roles

- Workshop lead: owns agenda, pacing, and learning outcomes.
- Technical producer: owns environment health, branch transitions, and recovery.
- Support facilitator: optional; handles participant blockers.

## Pre-Session Timeline

### T-7 days

- Confirm date, duration, audience profile, and IDE/OS mix.
- Freeze the track branches you will deliver.
- Run `./scripts/workshop-preflight.sh --track desk-booking --strict`.

### T-2 days

- Do a full dry run from a fresh clone.
- Verify every branch transition and expected artifact boundary.
- Rehearse the facilitator script.

### T-60 minutes

- Open a clean terminal in the repo.
- Re-run `./scripts/workshop-preflight.sh --track desk-booking`.
- Pre-open:
  - `README.md`
  - `workshop-reviewer.sh`
  - `workshop-video-script.md`

## Participant Setup Flow

```bash
git clone git@github.com:dickymoore/bmad-6-workshop.git
cd bmad-6-workshop
npx bmad-method@latest install --modules bmm --tools codex --yes
git checkout workshop/desk-booking/10-analysis
```

Compatibility inputs still work, but facilitators should teach the namespaced
branch names.

## Facilitator Session Automation

Use the session setup scripts to create one worktree per stage:

- PowerShell:

```powershell
./scripts/setup-workshop-session.ps1 -Track desk-booking -Mode all -Session Wed-AM
```

- Bash:

```bash
./scripts/setup-workshop-session.sh --track desk-booking --mode all --session Wed-AM
```

Teardown after each run:

- PowerShell:

```powershell
./scripts/setup-workshop-session.ps1 -Track desk-booking -Mode teardown -Session Wed-AM
```

- Bash:

```bash
./scripts/setup-workshop-session.sh --track desk-booking --mode teardown --session Wed-AM
```

## Live Delivery Cadence

Target runtime: 2.5 to 3 hours.

1. `main`
   - orient participants to the repo and branch model
   - confirm Codex + BMAD setup
2. `workshop/desk-booking/10-analysis`
   - analyst flow, product brief, research setup
3. `workshop/desk-booking/20-planning`
   - planning outputs, ADR, workshop-level alignment
4. `workshop/desk-booking/30-solutioning`
   - PRD, UX, architecture direction
5. `workshop/desk-booking/40-implementation-setup`
   - architecture completion, epics, readiness
6. `workshop/desk-booking/50-ready-for-dev`
   - sprint artifacts and dev handoff
7. `workshop/desk-booking/60-implementation`
   - implementation
8. `workshop/desk-booking/70-complete`
   - stabilization and course correction
9. `workshop/desk-booking/80-mvp`
   - final demoable state

## Facilitation Guardrails

- Do not skip stage gates.
- Keep commands deterministic; avoid inventing alternate branch names live.
- If a participant is blocked, move them to support and keep the main flow moving.
- Time-box rabbit holes.

## Incident Playbook

### Install failures

- Run the preflight remediations first.
- If still blocked, pair the participant with support and continue.

### Branch mismatch

```bash
git fetch origin --prune
git checkout <target-branch>
```

Preferred target branches are the namespaced `workshop/desk-booking/*` ones.

### Runtime app issues

- Early stages: `office-floorplans/`
- Later stages: repo root app

## Success Criteria

- Participants understand the BMAD flow from analysis to MVP.
- Participants can identify what each stage branch should and should not contain.
- Participants can run the final app stages independently.

## Post-Session Actions

- Capture the top friction points.
- Convert repeat friction into script or documentation changes.
- Archive the exact delivery pack used for that cohort.
