# Test Design: Epic 1 - Foundation & Persistence

**Date:** 2025-12-03
**Author:** DICKY
**Status:** Draft

---

## Executive Summary
Scope: full test design for Epic 1 (Foundation & Persistence) covering storage, validation, last-updated, roster load/save.

**Risk Summary**
- Total risks: 6
- High-priority (≥6): 3 (data loss, invalid schema ingestion, deskId mismatch acceptance)
- Critical categories: DATA, TECH

**Coverage Summary**
- P0 scenarios: 6 (12 hours)
- P1 scenarios: 8 (8 hours)
- P2/P3 scenarios: 6 (3 hours)
- Total effort: 23 hours

---

## Risk Assessment

### High-Priority Risks (Score ≥6)
| Risk ID | Category | Description | Prob | Impact | Score | Mitigation | Owner | Timeline |
| ------- | -------- | ----------- | ---- | ------ | ----- | ---------- | ----- | -------- |
| R1-SEC-DATA | DATA | Backup/import accepts malformed schema and corrupts bookings/users | 3 | 3 | 9 | Strict schema validation + reject on fail; unit + API-level import tests | QA | 2025-12-05 |
| R1-DATA-LOSS | DATA | Write-through save fails silently leading to lost bookings/roster | 2 | 3 | 6 | Write returns {ok,error}; negative tests for fs failures; toast + console.error | Dev | 2025-12-06 |
| R1-TECH-DESKREF | TECH | DeskId mismatch not flagged causing orphan bookings | 2 | 3 | 6 | Validation against desks.json before write; regression tests with invalid deskId | QA | 2025-12-06 |

### Medium-Priority Risks (Score 3-4)
| Risk ID | Category | Description | Prob | Impact | Score | Mitigation | Owner |
| ------- | -------- | ----------- | ---- | ------ | ----- | ---------- | ----- |
| R1-OPS-BACKUPPATH | OPS | Backup path missing/permission denied | 2 | 2 | 4 | Ensure backup dir exists; fallback error toast; test permission errors | Dev |
| R1-TECH-RACE | TECH | Concurrent writes (fast double click) cause partial state | 2 | 2 | 4 | Serialize writes; test double-submit | Dev |
| R1-BUS-NOTICE | BUS | Missing notice when seeding empty roster causes confusion | 1 | 2 | 2 | Acceptance test for empty roster notice | PM |

### Low-Priority Risks (Score 1-2)
| Risk ID | Category | Description | Prob | Impact | Score | Action |
| ------- | -------- | ----------- | ---- | ------ | ----- | ------ |
| R1-UX-TS | BUS | Last-updated timestamp not visible | 1 | 1 | 1 | Monitor |

---

## Test Coverage Plan

### P0 (Critical)
| Requirement | Test Level | Risk Link | Test Count | Owner | Notes |
| ----------- | ---------- | --------- | ---------- | ----- | ----- |
| Import rejects invalid schema (users/bookings) | API | R1-SEC-DATA | 3 | QA | malformed json, missing fields, bad types |
| Backup/export writes full snapshot | API | R1-DATA-LOSS | 2 | QA | file exists, contains users/bookings/lastUpdated |
| Write-through saves update last-updated atomically | API | R1-DATA-LOSS | 1 | QA | simulate write fail path |
| DeskId validation blocks invalid booking writes | Unit | R1-TECH-DESKREF | 2 | Dev | invalid deskId, missing deskId |
| Import rejects deskId not in desks.json | API | R1-TECH-DESKREF | 1 | QA | negative import |
| Double-write collision handled (serialize) | Unit | R1-TECH-RACE | 1 | Dev | ensure single write in rapid calls |

### P1 (High)
| Requirement | Test Level | Risk Link | Test Count | Owner | Notes |
| Roster load from users.json; seed empty roster notice | Unit | R1-BUS-NOTICE | 2 | Dev | empty file, populated |
| Bookings.json load skips invalid records logs warning | Unit | R1-SEC-DATA | 2 | Dev | bad record dropped |
| Backup directory auto-created | Unit | R1-OPS-BACKUPPATH | 1 | Dev | mkdirp |
| Backup file naming format backup-YYYYMMDD-HHMMSS.json | Unit | R1-OPS-BACKUPPATH | 1 | Dev | regex |
| Last-updated displays near filters | Component | R1-UX-TS | 1 | QA | UI presence |
| Storage helpers return structured {ok,error} | Unit | R1-DATA-LOSS | 1 | Dev | error propagation |

### P2/P3 (Medium/Low)
| Requirement | Test Level | Test Count | Owner | Notes |
| ----------- | ---------- | ---------- | ----- | ----- |
| Logs on skip invalid records include deskId | Unit | 1 | Dev | traceability |
| Backup/import handles empty arrays | Unit | 1 | Dev | edge |
| .gitignore excludes backup files | Unit | 1 | Dev | config check |
| last-updated ISO string format validated | Unit | 1 | Dev | regex |
| notice text copy check | Component | 1 | QA | accessibility |
| backup import retains ordering (non-blocking) | Unit | 1 | Dev | P3 |

---

## Execution Order
- Smoke (<5 min): backup export success; import invalid schema rejected.
- P0 (<10 min): remaining P0 API/unit.
- P1 (<30 min): roster/last-updated/UI checks.
- P2/P3 (<60 min): edge cases & logging.

---

## Resource Estimates
| Priority | Count | Hours/Test | Total Hours | Notes |
| -------- | ----- | ---------- | ----------- | ----- |
| P0 | 6 | 2.0 | 12 | includes setup/cleanup |
| P1 | 8 | 1.0 | 8 |  |
| P2/P3 | 6 | 0.5 | 3 |  |
| **Total** | **20** | - | **23** | ~3 days equivalence |

---

## Quality Gate Criteria
- P0 pass rate 100%; P1 ≥95%; no high-risk (score ≥6) open.
- Coverage: P0/P1 mapped to all FR12–15; no untested critical paths.
- Evidence: backup files inspected; import rejects malformed.

---

## Mitigation Plans
- R1-SEC-DATA: enforce zod/ajv schema on import; add negative tests; owner QA.
- R1-DATA-LOSS: wrap fs writes with try/catch and surface toast; add write-fail test; owner Dev.
- R1-TECH-DESKREF: preload desks.json into validator; unit + API negative tests; owner QA.

---

## Assumptions and Dependencies
- File system writable; local single-user runtime; desks.json available and trusted.
- No concurrent multi-process writes; race tests simulate double-click only.

## Related Documents
- PRD: docs/prd.md
- Architecture: docs/architecture.md
- Epic: docs/epics.md (Epic 1)

