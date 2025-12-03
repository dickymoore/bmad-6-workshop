# Test Framework Scaffold for Desk Booking Application

This repo currently has no E2E harness. Recommendation: start with **Playwright** (best for multi-browser, traces, parallelism) and keep it lightweight for the local-only scope. Below is the agreed structure and guardrails—files will be generated when you run the scaffold command.

## Planned Structure
```
tests/
  e2e/
    example.spec.ts
  support/
    fixtures/
      index.ts
      factories/
        user-factory.ts (stub; adjust to API/data needs)
    helpers/
    page-objects/      (optional)
  README.md            (this file)
playwright.config.ts   (to be generated)
.env.example           (to be generated)
.nvmrc                 (node 22.17.x recommended)
```

## Why Playwright (for this project)
- Multi-browser, traces, screenshots on failure, parallel workers.
- Strong network interception and API testing; good fit for Vite + React SPA.
- Small team friendly; deterministic if we apply network-first waits.

## Configuration Guardrails (to be enforced in scaffold)
- Timeouts: action 15s, navigation 30s, test 60s, expect 10–15s.
- Artifacts: HTML + JUnit to `test-results/`; traces/screens/video on failure only.
- env map: `TEST_ENV` with per-env configs; `BASE_URL` default `http://localhost:3000`.
- `.nvmrc`: 22.17.x (aligns with app stack).

## Fixture Architecture (from knowledge base)
- `tests/support/fixtures/index.ts` exports `test`/`expect`; extend with factories.
- Auto-cleanup in fixtures; avoid state leakage; no hard waits; no conditionals.
- Data factories use faker; track created entities for teardown.

## Selector Strategy
- Use `data-testid` on UI elements; avoid brittle CSS/XPath.

## Commands
```
npm install @playwright/test @faker-js/faker
npm run test:e2e         # all e2e tests
npm run test:e2e:smoke   # @smoke
npm run test:e2e:p0      # @p0
npm run test:e2e:p1      # @p0|@p1
npm run test:e2e:ui      # headed UI mode
npm run test:e2e:report  # open HTML report
```

## Next Steps to generate scaffold
1) Approve Playwright scaffold.
2) I’ll create `tests/`, configs, fixtures, sample test, `.env.example`, `.nvmrc`, and scripts in package.json.
3) Run `npm install` then `npx playwright install --with-deps` if browsers aren’t present.

If you prefer Cypress instead, say so before scaffold and I’ll switch plans.

## Scaffold Status
- Framework: Playwright (installed @playwright/test 1.48.2)
- Config: playwright.config.ts created
- Env: .env.example created (BASE_URL=http://localhost:3000)
- Node: .nvmrc set to 22.17.0
- Tests: tests/e2e/smoke.spec.ts (basic reachability)
- Fixtures: tests/support/fixtures/index.ts, user-factory stub

## Running
```bash
npm install                      # deps
npx playwright install chromium  # once
npm run test:e2e                 # all e2e
npm run test:e2e:smoke           # @smoke
npm run test:e2e:p0              # @p0
npm run test:e2e:p1              # @p0|@p1
npm run test:e2e:ui              # headed UI mode
npm run test:e2e:report          # open HTML report
npm run test:ct                  # component tests (Playwright CT)
npm run test:unit                # vitest unit tests
```

## If browsers complain about missing system deps
Run (needs sudo):
```bash
npx playwright install-deps chromium
```
Refer to Playwright docs for distro-specific packages.

## Next steps (project-specific)
- Start the app separately (e.g., run your Desk Booking app on http://localhost:3000) before executing tests.
- Add data-testid attributes to key elements (filters, hotspots, booking buttons) to stabilize selectors.
- Expand smoke into real journeys once UI stable: select office/floor/date, click desk, confirm booking, cancel booking, backup/export.

## Live booking E2E (gated)
- File: `tests/e2e/booking-flow.spec.ts`
- Gate: set `E2E_RUN=1` to enable. Defaults to skipped to avoid failures when app isn’t running.
- Env knobs: `E2E_OFFICE`, `E2E_FLOOR`, `E2E_DESK`, `E2E_USER`, `BASE_URL`.
- Expected data-testids (add to UI):
  - office-select, floor-select, date-picker, user-select
  - desk-<deskId> (e.g., desk-desk-1)
  - confirm-booking, booking-list
  - cancel-<deskId>
  - export-backup, import-backup-file, import-backup-submit
  - Toast texts: “booking confirmed”, “booking cancelled”, “backup saved”, “backup imported”
- Run:
```bash
E2E_RUN=1 BASE_URL=http://localhost:3000 npm run test:e2e -- --grep "booking"
```
- Update selectors/text to match the real UI once implemented.

## FR → data-testid map (proposed)
- FR1/FR2: `office-select`, `floor-select`, `date-picker`
- FR3: `user-select`
- FR4/FR5: `desk-<deskId>` hotspots; legend color states
- FR6: `confirm-booking`
- FR7: `cancel-<deskId>`
- FR8: Conflict toast contains “already has a booking”
- FR9: Validation toast contains “invalid desk”
- FR10/FR11: `booking-list` (per-day list shows user + desk; filters drive content)
- FR12–15: persistence validated indirectly; `last-updated` element shows ISO timestamp
- FR16: `export-backup`
- FR17: `import-backup-file`, `import-backup-submit`
- FR18: Toasts for success/error (booking confirmed/cancelled, backup saved/imported)

## Tags for CI (suggested)
- `@smoke` — reachability and selectors present
- `@booking` — book/cancel happy path
- `@backup` — export/import path

Add tags with `test.describe.configure({ tag: '@booking' })` and run with `--grep @booking`.

## Notes
- E2E specs are gated by `E2E_RUN=1` so CI doesn’t fail when the app isn’t running.
- Component specs are currently minimal and may remain skipped until real components are wired; CT config is ready (`playwright-ct.config.ts`).
- Unit/API placeholders are skipped until logic or endpoints exist; Vitest is configured for `tests/unit`.

## New test scaffolds status
- E2E: added availability, booking-rules, backup-import (gated by `E2E_RUN=1`).
- API/component/unit: placeholder files added and skipped until backend/CT/vitest are configured.
- Fixtures/factories: user, booking, desk, backup factories; merged fixtures exported from `tests/support/fixtures`.
