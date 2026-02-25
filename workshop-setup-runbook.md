# BMAD Workshop Setup Runbook (Stable v6)

## 1. Purpose
This runbook standardizes workshop delivery so facilitators can run the same high-quality session from setup through follow-up without improvising critical logistics.

## 2. Roles
- Workshop Lead: owns agenda timing, learning outcomes, and live facilitation.
- Technical Producer: owns environment health, branch transitions, and troubleshooting.
- Support Facilitator (optional): handles participant blockers and captures recurring issues.

## 3. Pre-Session Timeline
### T-7 days
- Confirm workshop date, duration, and audience profile (skill level, IDE preference, OS mix).
- Freeze the workshop baseline branch set for this cohort.
- Run `./scripts/workshop-preflight.sh --strict` on facilitator machine.

### T-2 days
- Do a full dry run from a fresh clone.
- Verify all stage transitions and expected artifacts.
- Finalize delivery pack links and facilitator notes.

### T-60 minutes
- Open a clean terminal in the workshop repo.
- Verify network access for `npm`/`npx`.
- Re-run `./scripts/workshop-preflight.sh`.
- Pre-open reference tabs/files:
  - `README.md`
  - `workshop-reviewer.sh`
  - `workshop-video-script.md` (timing aid)

## 4. Participant Setup Flow
Use this exact setup sequence:

```bash
git clone git@github.com:dickymoore/bmad-6-workshop.git
cd bmad-6-workshop
npx bmad-method@latest install --modules bmm --tools codex --yes
```

If participants are on managed machines, keep a fallback command ready:

```bash
npm cache clean --force
npx bmad-method@latest install --modules bmm --tools codex --yes
```

## 5. Live Delivery Cadence
Target runtime: 2.5 to 3 hours.

1. Orientation (`main`)
- Explain branch progression and expected artifacts.
- Confirm everyone can run the preflight script.

2. Analysis (`stage-1`)
- Activate analyst role and generate discovery outputs.
- Emphasize quality of assumptions and constraints.

3. Planning (`stage-2`)
- Produce product brief + research + ADR artifacts.
- Confirm clarity and completeness before moving on.

4. Solutioning (`stage-3`)
- Build PRD and UX spec.
- Validate traceability from requirements to solution intent.

5. Implementation Setup (`stage-4`, `ready-for-dev`)
- Generate architecture, epics, readiness docs, sprint artifacts.
- Verify dev handoff quality.

6. Build + Stabilize (`implementation-in-progress`, `complete`, `mvp`)
- Run app, fix issues, validate final MVP behavior.
- Ensure testing and story status are current.

## 6. Facilitation Guardrails
- Do not skip stage gates; validate branch state before advancing.
- Keep command inputs deterministic; avoid ad-hoc aliasing during live delivery.
- Record every blocker pattern once; convert repeated blockers into preflight checks.
- Time-box rabbit holes: 5 minutes, then park and continue.

## 7. Incident Playbook
### Install failures
- Run preflight output remediations first.
- If still blocked, pair participant with support facilitator and continue class.

### Branch mismatch
- Run:

```bash
git fetch origin --prune
git checkout <target-branch>
```

### Runtime app issues
- Check stage-specific app location:
  - early stages: `office-floorplans/`
  - later stages: repo root app

## 8. Success Criteria
By end of workshop:
- Participants can describe end-to-end BMAD flow from analysis to MVP.
- Participants can navigate and validate stage artifacts independently.
- Participants can run final app stage with confidence.

## 9. Post-Session Actions
Within 24 hours:
- Capture top 5 friction points.
- Convert friction points into script or documentation improvements.
- Version and archive the session delivery pack used for the cohort.
