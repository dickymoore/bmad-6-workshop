# Test Design: Epic 3 - Booking Actions & Rules

**Date:** 2025-12-03
**Author:** DICKY
**Status:** Draft

---

## Executive Summary
Scope: Epic 3 (user selection, booking create/confirm, conflict rule, cancel/release, desk validation).

**Risk Summary**
- Total risks: 7
- High-priority (≥6): 4 (double booking, conflict bypass, cancel failure, invalid desk validation)
- Critical categories: DATA, TECH, BUS

**Coverage Summary**
- P0 scenarios: 8 (16 hours)
- P1 scenarios: 6 (6 hours)
- P2/P3 scenarios: 5 (2.5 hours)
- Total effort: 24.5 hours

---

## Risk Assessment

### High-Priority Risks (Score ≥6)
| Risk ID | Category | Description | Prob | Impact | Score | Mitigation | Owner | Timeline |
| ------- | -------- | ----------- | ---- | ------ | ----- | ---------- | ----- | -------- |
| R3-DATA-DOUBLE | DATA | User can hold multiple bookings same day (rule not enforced) | 3 | 3 | 9 | Serverless validator + client pre-check; tests for same user/date conflict | QA | 2025-12-05 |
| R3-TECH-RACE | TECH | Rapid double-click writes duplicate booking before conflict check | 2 | 3 | 6 | Disable confirm on submit; serialize writes; race test | Dev | 2025-12-05 |
| R3-BUS-CANCEL | BUS | Cancel fails silently leaving stale booking | 2 | 3 | 6 | Negative test ensures toast + state update; idempotent delete | QA | 2025-12-06 |
| R3-TECH-DESKVAL | TECH | DeskId validation missing allowing orphan booking | 2 | 3 | 6 | Validation against desks.json; unit + API negative | QA | 2025-12-06 |

### Medium-Priority Risks (Score 3-4)
| Risk ID | Category | Description | Prob | Impact | Score | Mitigation | Owner |
| ------- | -------- | ----------- | ---- | ------ | ----- | ---------- | ----- |
| R3-BUS-UXCONFIRM | BUS | Confirmation dialog missing critical info (desk/date/user) | 2 | 2 | 4 | Component test content | QA |
| R3-OPS-IDGEN | OPS | Booking IDs not unique | 1 | 3 | 3 | UUID test | Dev |
| R3-DATA-VISITOR | DATA | Visitor bookings collide due to reused id | 2 | 2 | 4 | Generate visitor-uuid; test visitor flow | Dev |

### Low-Priority Risks (Score 1-2)
| Risk ID | Category | Description | Prob | Impact | Score | Action |
| ------- | -------- | ----------- | ---- | ------ | ----- | ------ |
| R3-UX-TOAST | BUS | Toast copy unclear | 1 | 1 | 1 | Monitor |
| R3-OPS-LOG | OPS | Missing audit log for actions | 1 | 1 | 1 | Monitor |

---

## Test Coverage Plan

### P0 (Critical)
| Requirement | Test Level | Risk Link | Test Count | Owner | Notes |
| ----------- | ---------- | --------- | ---------- | ----- | ----- |
| Conflict rule: same user/date second booking blocked with clear message | API | R3-DATA-DOUBLE | 2 | QA | create then re-attempt |
| Conflict rule enforced on cancel/restore path (no ghost record) | API | R3-DATA-DOUBLE | 1 | QA | cancel then recreate |
| Rapid double-click confirm produces single booking | E2E | R3-TECH-RACE | 1 | QA | debounce/disable |
| DeskId validation rejects invalid desk | Unit | R3-TECH-DESKVAL | 2 | Dev | missing desk, wrong office |
| Cancel removes booking, updates list/map, toast shown | E2E | R3-BUS-CANCEL | 2 | QA | happy + already-cancelled |
| Booking creation happy path writes booking + last-updated | E2E | R3-DATA-DOUBLE | 1 | QA | baseline |
| Visitor booking uses unique id; no collision | Unit | R3-DATA-VISITOR | 1 | Dev | visitor-uuid |
| Booking ID uniqueness (UUID v4) | Unit | R3-OPS-IDGEN | 1 | Dev | format |

### P1 (High)
| Requirement | Test Level | Risk Link | Test Count | Owner | Notes |
| Confirmation modal shows user/desk/date | Component | R3-BUS-UXCONFIRM | 1 | QA | content check |
| Toast messages present success/error | Component | R3-UX-TOAST | 1 | QA | copy |
| Booking list/map refresh after cancel when filters changed | E2E | R3-BUS-CANCEL | 1 | QA | cross-filter |
| Conflict check uses normalized date (no TZ drift) | Unit | R3-DATA-DOUBLE | 1 | Dev | date-only |
| Undo/redo (if present) does not bypass conflict | Unit | R3-DATA-DOUBLE | 1 | Dev | optional |
| Booking persisted even if toast fails to show | Unit | R3-UX-TOAST | 1 | Dev | resilience |

### P2/P3 (Medium/Low)
| Requirement | Test Level | Test Count | Owner | Notes |
| ----------- | ---------- | ---------- | ----- | ----- |
| Cancel confirmation copy & buttons | Component | 1 | QA | P2 |
| Booking list sorts newest first | Unit | 1 | Dev | P2 |
| Offline attempt shows friendly error (optional) | Component | 1 | QA | P3 |
| Logging on errors contains deskId/userId/date | Unit | 1 | Dev | P3 |
| Analytics hooks (if any) not blocking | Unit | 1 | Dev | P3 |

---

## Execution Order
- Smoke: happy path create/cancel, conflict rule block.
- P0: conflict, race, desk validation, cancel correctness.
- P1: confirmation content, toast presence, filter refresh.
- P2/P3: copy, ordering, offline/telemetry edges.

---

## Resource Estimates
| Priority | Count | Hours/Test | Total Hours |
| -------- | ----- | ---------- | ----------- |
| P0 | 8 | 2.0 | 16 |
| P1 | 6 | 1.0 | 6 |
| P2/P3 | 5 | 0.5 | 2.5 |
| **Total** | **19** | - | **24.5** |

---

## Quality Gate Criteria
- P0 = 100% pass; P1 ≥95%.
- No duplicate bookings for same user/date; cancel leaves map/list consistent.
- Desk validation enforced; visitor IDs unique; conflict logic timezone-safe.

---

## Mitigation Plans
- Double booking: conflict check at write + pre-check; disable confirm button while saving.
- Race: serialize writes; dedupe by user+date key; add unit for double-submit.
- Cancel reliability: idempotent delete; UI + state assertion; toast on failure.
- Desk validation: central validator using desks.json; negative tests.

---

## Assumptions and Dependencies
- Single-device runtime; storage sync immediate.
- desks.json is authoritative; visitor treated as unique id per booking.

## Related Documents
- PRD: docs/prd.md
- Architecture: docs/architecture.md
- Epic: docs/epics.md (Epic 3)

