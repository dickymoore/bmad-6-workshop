# Test Design — Epic 3: Booking Actions & Rules
Date: 2025-12-02
Assessed By: DICKY
Mode: Epic-Level (Phase 4)
Scope: FR3, FR6, FR7, FR8, FR9, FR18 (booking create/cancel, conflict prevention, validation, messaging)

## Risk Assessment (probability × impact)
| Risk ID | Category | Description | Prob | Impact | Score | Mitigation/Test Focus |
| --- | --- | --- | --- | --- | --- | --- |
| R-1 | DATA | Double-booking not blocked → desk conflict | 2 | 3 | 6 | P0 E2E conflict test; unit guard on write path |
| R-2 | DATA | Invalid deskId saved (mapping drift) | 2 | 3 | 6 | P0 unit + E2E invalid desk; schema validation |
| R-3 | BUS | Booking not persisted due to write failure | 1 | 3 | 3 | P0 E2E assert last-updated, file write result; inject failure in unit |
| R-4 | UX | User not told outcome (missing toast/inline) | 2 | 2 | 4 | P1 E2E verifies toasts; component tests for states |
| R-5 | PERF | Large desks.json slows overlay (unlikely) | 1 | 1 | 1 | P2 component render perf smoke |

## Test Level Strategy
- E2E: Critical booking journeys (happy path, conflict, cancel, invalid desk). Tool: Playwright. 
- Component: Confirm modal, desk hotspot interactions, toast rendering. 
- Unit: Booking rule (one/user/day), desk validation, storage helpers.
- No API layer (local-only).

## Priority Matrix
- **P0**: Happy booking; conflict prevention; invalid desk blocked; cancel booking; booking list reflects change; persistence/last-updated updates.
- **P1**: Visitor booking; toast/error messaging; desk tooltip data; date change refresh; selected user retained.
- **P2**: Render performance smoke; color legend accuracy; optional history of released bookings.

## Coverage Matrix
| Requirement (FR) | Scenario | Level | Priority | Risk Link |
| --- | --- | --- | --- | --- |
| FR6 booking create | Happy path create (desk free) | E2E | P0 | R-3 |
| FR8 conflict rule | Same user already booked → block | E2E + Unit | P0 | R-1 |
| FR9 desk validation | Non-existent deskId → block | E2E + Unit | P0 | R-2 |
| FR7 cancel | Cancel existing booking | E2E | P0 | R-3 |
| FR18 feedback | Success/error toasts shown | E2E + Component | P1 | R-4 |
| FR3 user select | Visitor + named user flows | E2E | P1 | R-4 |
| FR10 list linkage | List updates after book/cancel | E2E | P0 | R-3 |
| FR11 filters | Changing date/office/floor refreshes view | E2E | P1 | R-4 |
| FR5 legend | Legend colors reflect state | Component | P2 | R-5 |

## Test Scenarios (Playwright)
- P0-E2E-1 Happy booking: select office/floor/date/user, click free desk, confirm, see toast, list shows user+desk, last-updated changes.
- P0-E2E-2 Conflict: same user tries second booking same date → blocked, toast contains “already has a booking,” no extra record.
- P0-E2E-3 Invalid desk: force desk testid not in desks.json → blocked with “invalid desk,” no record written.
- P0-E2E-4 Cancel: book, then cancel via list, toast “booking cancelled,” list and hotspot revert to free.
- P1-E2E-5 Visitor booking: select visitor, book, list shows visitor entry.
- P1-E2E-6 Filter refresh: change date → list/hotspots refresh to empty state; change office/floor reflects correct PNG/hotspots.
- P1-E2E-7 Feedback: verify success/error toasts appear and dismiss; role="status" present.

## Component / Unit Focus
- Unit: booking rule (one/user/day), deskId validator, storage helpers return {ok,error}, last-updated update on write/import.
- Component: BookingConfirm (states), BookingList render after mutation, DeskLegend colors, toast accessibility.

## Execution Order
1) Smoke (existing `smoke.spec.ts`).
2) P0 suite (booking, conflict, invalid desk, cancel, list/last-updated).
3) P1 suite (visitor, filters, feedback a11y).
4) P2 checks (legend render/perf smoke).

## Quality Gates
- P0: 100% pass required.
- P1: ≥95% pass.
- All risks score ≥6 must have passing tests (R-1, R-2).
- No new flaky tests (retries limited to CI default).

## Data/Env Needs
- BASE_URL running app; data-testids implemented per README.
- Seed: can operate on empty bookings/users (visitor allowed). If roster required, preload users.json.
- No external services; no auth.

## Tooling
- Playwright (configured); run with `E2E_RUN=1` to enable booking specs.
- Faker in unit/component tests for unique ids.

## Recommendations
- Add data-testid hooks as listed, then enable booking specs (`--grep "booking"`).
- After UI stable, add negative cases into CI P0 set; keep backup/import tests in separate job if slower.
- Monitor flakiness: keep deterministic waits (no hard timeouts), rely on response/locator states.

