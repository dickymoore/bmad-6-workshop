# Workshop Dry-Run and Delivery Checklists

## A. Dry-Run Checklist

### A1. Environment
- [ ] Fresh clone performed on facilitator machine.
- [ ] `./scripts/workshop-preflight.sh --strict` passes.
- [ ] `npx bmad-method@latest install --modules bmm --tools codex --yes` succeeds.

### A2. Stage Progression
- [ ] All workshop branches are present and checkout works.
- [ ] Stage transitions execute in order with no missing artifacts.
- [ ] `./workshop-reviewer.sh --all` behavior is understood and expected.

### A3. Runtime Validation
- [ ] Early-stage floorplan demo launches from `office-floorplans/`.
- [ ] Later-stage root app launches where expected.
- [ ] E2E command path is validated for final stage.

### A4. Facilitation Quality
- [ ] Timing tested against agenda (target +/- 10 minutes).
- [ ] Known blocker playbook rehearsed.
- [ ] Verbal transitions between stages practiced.

## B. Delivery Pack Checklist

### B1. Participant-Facing
- [ ] Workshop invite with prerequisites.
- [ ] Quick-start setup commands.
- [ ] Branch progression map.
- [ ] Troubleshooting quick-reference.

### B2. Facilitator-Facing
- [ ] Runbook: `workshop-setup-runbook.md`
- [ ] Video/timing script: `workshop-video-script.md`
- [ ] Branch strategy note: `workshop-branch-strategy.md`
- [ ] Preflight script: `scripts/workshop-preflight.sh`

### B3. Final Readiness Gate
- [ ] Dry run completed within the past 48 hours.
- [ ] No unresolved critical blockers.
- [ ] Session owner and backup facilitator confirmed.
