# Automation Summary — Desk Booking Application

**Date:** 2025-12-03
**Mode:** BMad-Integrated (PRD + epics + test-design)
**Coverage Target:** critical-paths first, expand with P1 regression

## Current State
- Framework: Playwright (`playwright.config.ts`), scripts: `npm run test:e2e`, `test:e2e:ui`, `test:e2e:report`.
- Existing E2E: `tests/e2e/booking-flow.spec.ts` (happy path booking + backup/import), `tests/e2e/smoke.spec.ts` (serve check).
- Fixtures: minimal factory-based user fixture; no merged fixture composition yet; no API seeding helpers.
- Gaps: No priority tags, no API/component/unit layers, no negative/edge paths, limited fixtures/factories, no selective execution scripts.

## Planned Additions (by Epic)
### Epic 1 — Foundation & Persistence
- API/unit tests for import schema rejection, backup naming/permission errors, deskId validation, last-updated write-through.
- Component test for last-updated visibility and empty-roster notice.

### Epic 2 — Availability View & Navigation
- Component tests: hotspot focus/aria, legend presence/contrast, tooltip content, filter defaults/reset.
- E2E: map/list sync on create/cancel, filter change updates both, availability coloring.
- Unit: filter pipeline (office/floor/date), stable sort.

### Epic 3 — Booking Actions & Rules
- API/unit: conflict rule (user+date), double-submit serialization, desk validation, visitor IDs unique.
- E2E: double-click confirm yields single booking; cancel keeps map/list in sync; booking happy path with last-updated.
- Component: confirm modal content, toast presence.

### Epic 4 — Data Safety & Admin
- API: export success/error, import schema/version validation, rollback on failure, pre-import temp backup.
- Component/E2E: toasts/inline feedback, roster edit validation (if UI present).

## Test Assets to Add
- **Fixtures:** merged fixtures (auth/state, network-first interception, temp backup path). Auto-cleanup per test.
- **Factories:** booking, desk, user, backup payload factories (faker-based, overrides). Parallel-safe IDs.
- **Helpers:** `waitForResponse` wrappers, deterministic date helper (local YYYY-MM-DD), backup file helper.
- **Priority tags:** `[P0]`, `[P1]`, `[P2]` in test names; grep-friendly.

## Proposed File Layout
```
tests/
  e2e/
    availability.spec.ts          # Epic 2 P0/P1
    booking-rules.spec.ts         # Epic 3 P0/P1
    backup-import.spec.ts         # Epic 4 P0
  api/
    storage.api.spec.ts           # Epic 1 (import/export, validation)
    booking-rules.api.spec.ts     # Epic 3 conflict/validation
  component/
    floorplan-hotspots.test.tsx   # Epic 2 a11y/legend/tooltip
    booking-confirm.test.tsx      # Epic 3 modal/toasts
    roster-notice.test.tsx        # Epic 1 empty roster
  unit/
    filter-pipeline.test.ts       # Epic 2 availability calc
    conflict-rule.test.ts         # Epic 3 logic
    backup-versioning.test.ts     # Epic 4 version/rollback
```

## Execution Plan (priority-driven)
- **Smoke (CI quick):** `npm run test:e2e -- --grep "@smoke|@p0"`
- **Pre-merge:** `npm run test:e2e -- --grep "@p0|@p1"`
- **Nightly:** full suite (`playwright test` all) + unit via `vitest` (to be added).

## Script Updates (proposed)
Add to `package.json`:
```
"test:e2e:p0": "playwright test --grep '@p0'",
"test:e2e:p1": "playwright test --grep '@p0|@p1'",
"test:e2e:smoke": "playwright test --grep '@smoke'"
```

## Quality Guardrails
- Network-first: intercept before navigate; no `waitForTimeout`.
- Deterministic selectors: prefer `data-testid` (already in app) over text.
- Self-cleaning fixtures (no leftover bookings/users/backups). Track created IDs and remove.
- File/time limits: <300 lines per test file; <90s per test.
- No page objects; use pure helpers + fixtures (per fixture-architecture guidelines).

## Immediate Next Steps
1) Implement fixtures/factories skeleton under `tests/support/fixtures` and `tests/support/factories` (booking, desk, backup).
2) Add priority-tagged E2E files for Epic 2 map/list sync and Epic 3 conflict rule.
3) Add API/unit coverage for import/export/validation (Epic 1 & 4).
4) Update package scripts with priority grep commands.
5) Run smoke: `npm run test:e2e -- --grep '@smoke|@p0'` and iterate.

## Traceability
- Aligns with PRD FR1–FR18 and test-design docs per epic (docs/test-design-epic-1..4.md).
- Uses knowledge fragments: test-levels, test-priorities, fixture-architecture, data-factories, selective-testing, test-quality, network-first.

