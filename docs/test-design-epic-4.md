# Test Design: Epic 4 - Data Safety & Admin

**Date:** 2025-12-03
**Author:** DICKY
**Status:** Draft

---

## Executive Summary
Scope: Epic 4 (backup/export, import/restore validation, toasts/inline feedback, optional roster edit UI).

**Risk Summary**
- Total risks: 6
- High-priority (≥6): 3 (corrupt import, backup failure, silent errors)
- Critical categories: DATA, OPS, BUS

**Coverage Summary**
- P0 scenarios: 6 (12 hours)
- P1 scenarios: 6 (6 hours)
- P2/P3 scenarios: 4 (2 hours)
- Total effort: 20 hours

---

## Risk Assessment

### High-Priority Risks (Score ≥6)
| Risk ID | Category | Description | Prob | Impact | Score | Mitigation | Owner | Timeline |
| ------- | -------- | ----------- | ---- | ------ | ----- | ---------- | ----- | -------- |
| R4-DATA-IMPORT | DATA | Import accepts invalid backup, corrupts users/bookings | 3 | 3 | 9 | Strict schema validation; fail-fast with toast; negative tests | QA | 2025-12-06 |
| R4-OPS-BACKUPFAIL | OPS | Backup write fails (permissions/missing dir) without user notice | 2 | 3 | 6 | Pre-create dir; surface error toast; unit negative | Dev | 2025-12-05 |
| R4-BUS-SILENT | BUS | Actions (export/import) fail silently, no feedback | 2 | 3 | 6 | Toast + inline status; tests assert feedback | QA | 2025-12-05 |

### Medium-Priority Risks (Score 3-4)
| Risk ID | Category | Description | Prob | Impact | Score | Mitigation | Owner |
| ------- | -------- | ----------- | ---- | ------ | ----- | ---------- | ----- |
| R4-DATA-VERSION | DATA | Backup schema version mismatch not detected | 2 | 2 | 4 | version field + validation | Dev |
| R4-TECH-UNDO | TECH | Import overwrites current data without undo/backup | 2 | 2 | 4 | create pre-import temp backup; test rollback | Dev |
| R4-DATA-ROSTEREDIT | DATA | Roster edit UI allows duplicates/empties | 2 | 2 | 4 | form validation tests | QA |

### Low-Priority Risks (Score 1-2)
| Risk ID | Category | Description | Prob | Impact | Score | Action |
| ------- | -------- | ----------- | ---- | ------ | ----- | ------ |
| R4-UX-TOASTCOPY | BUS | Toast copy unclear | 1 | 1 | 1 | Monitor |
| R4-OPS-LOG | OPS | Missing audit trail of backup/import paths | 1 | 1 | 1 | Monitor |

---

## Test Coverage Plan

### P0 (Critical)
| Requirement | Test Level | Risk Link | Test Count | Owner | Notes |
| ----------- | ---------- | --------- | ---------- | ----- | ----- |
| Export creates timestamped file with users/bookings/lastUpdated | API | R4-OPS-BACKUPFAIL | 2 | QA | happy path |
| Export surfaces error when path unwritable | API | R4-OPS-BACKUPFAIL | 1 | QA | permission denied |
| Import validates schema & rejects invalid backup | API | R4-DATA-IMPORT | 2 | QA | malformed JSON, missing fields |
| Import success replaces data and updates last-updated | E2E | R4-DATA-IMPORT | 1 | QA | end-to-end |
| Feedback: success/error toasts shown for export/import | Component | R4-BUS-SILENT | 1 | QA | role="status" |
| Pre-import backup taken (if feature implemented) | API | R4-TECH-UNDO | 1 | Dev | optional but critical when enabled |

### P1 (High)
| Requirement | Test Level | Risk Link | Test Count | Owner | Notes |
| Version field enforced on import | Unit | R4-DATA-VERSION | 1 | Dev | semver check |
| Import rollback on failure restores previous data | API | R4-TECH-UNDO | 1 | QA | simulate failure mid-import |
| Roster edit prevents duplicates/empty names | Component | R4-DATA-ROSTEREDIT | 2 | QA | form validation |
| Roster edit saves to users.json | E2E | R4-DATA-ROSTEREDIT | 1 | QA | persistence |
| Toast copy matches UX spec | Component | R4-UX-TOASTCOPY | 1 | QA | accessibility |
| Audit log (console/info) includes path + result | Unit | R4-OPS-LOG | 1 | Dev | logging contract |

### P2/P3 (Medium/Low)
| Requirement | Test Level | Test Count | Owner | Notes |
| ----------- | ---------- | ---------- | ----- | ----- |
| Import handles empty backup gracefully | Unit | 1 | Dev | P2 |
| Export excludes transient UI state | Unit | 1 | Dev | P2 |
| Roster edit optional fields trimmed | Component | 1 | QA | P3 |
| Import preserves ordering (non-blocking) | Unit | 1 | Dev | P3 |

---

## Execution Order
- Smoke: export happy path + toast; import invalid rejected.
- P0: export error path, import success, feedback assertions, pre-import backup.
- P1: version/rollback, roster edit validation/persistence, audit log.
- P2/P3: empty/ordering/copy edges.

---

## Resource Estimates
| Priority | Count | Hours/Test | Total Hours |
| -------- | ----- | ---------- | ----------- |
| P0 | 6 | 2.0 | 12 |
| P1 | 6 | 1.0 | 6 |
| P2/P3 | 4 | 0.5 | 2 |
| **Total** | **16** | - | **20** |

---

## Quality Gate Criteria
- P0 100% pass; P1 ≥95%.
- No data corruption on import; exports always acknowledged; rollbacks succeed on failure.
- Roster edits validated; backups timestamped and readable.

---

## Mitigation Plans
- Schema versioning: include version + validate; reject mismatches with clear toast.
- Backup robustness: mkdirp backup dir; surface errors; add unit for permission denial.
- Feedback: central toast utility; ensure role="status"; tests assert shown for success/fail.

---

## Assumptions and Dependencies
- File system accessible; single user; backups stored under data/backup/.
- Roster edit UI optional; if absent, related tests skipped.

## Related Documents
- PRD: docs/prd.md
- Architecture: docs/architecture.md
- Epic: docs/epics.md (Epic 4)

