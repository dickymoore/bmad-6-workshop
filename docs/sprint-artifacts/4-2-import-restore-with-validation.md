# Story 4.2: Import/restore with validation

Status: done

## Story

As a user, I want to import a backup safely so I don’t corrupt data.

## Acceptance Criteria

1. Import validates backup schema (users, bookings, lastUpdated); on success, replaces current data and updates last-updated; success toast shown. citedocs/epics.md  
2. Invalid backup is rejected with clear error; current data remains unchanged. citedocs/prd.md  
3. A pre-import temp backup of current data is created when possible; rollback used if write fails. citedocs/epics.md  

## Tasks / Subtasks

- [x] Validate and import (AC1)  
  - [x] Validate schema/version; on success write users/bookings/lastUpdated atomically; refresh state.  
- [x] Error handling and rollback (AC2, AC3)  
  - [x] On invalid schema, reject and show error toast; no changes.  
  - [x] Create pre-import backup; if write fails, restore original files.  
- [x] UX (AC1–AC2)  
  - [x] UI flow to select file; success/error toasts; inline errors if needed.  
- [x] Tests (AC1–AC3)  
  - [x] Valid import replaces data and updates last-updated.  
  - [x] Invalid import rejected, no data change.  
  - [x] Simulated write failure triggers rollback.  

## Dev Notes

- Relies on storage schemas from Epic 1; align with export format. citedocs/architecture.md  
- PRD linkage: FR17 import/restore and FR18 feedback. citedocs/prd.md  
- Consider backup file versioning (`schemaVersion`) to detect mismatches.  

### Project Structure Notes

- Implement in `src/lib/storage/backup.ts` alongside export; UI in BackupControls import flow.  
- Keep operations inside `data/`; block absolute external paths.  

### References

- docs/epics.md (Epic 4, Story 4.2)  
- docs/prd.md (FR17, FR18)  
- docs/architecture.md (import schema, rollback guidance)

## Dev Agent Record

### Context Reference

- docs/sprint-artifacts/4-2-import-restore-with-validation.context.xml

### Agent Model Used

OpenAI GPT-5 (Codex SM mode)

### Debug Log References

- Plan: add validated import flow with rollback snapshot, schema/version guard; surface toasts + inline errors; cover with unit & e2e tests. (2025-12-03)

### Completion Notes List

- Implemented validated import with snapshot rollback; schemaVersion-friendly; sets lastUpdated on success. (2025-12-03)
- Added BackupControls import UI with file chooser, inline error, and toast feedback paths. (2025-12-03)
- Expanded tests: rollback unit coverage; aligned e2e fixtures to new schema; all unit tests passing. (2025-12-03)
- Verified shared feedback fix (import flow no longer crashes); re-ran `npm run test:unit` (pass). (2025-12-03)

### File List

- MOD: docs/sprint-artifacts/4-2-import-restore-with-validation.md
- MOD: docs/sprint-artifacts/sprint-status.yaml
- MOD: src/lib/storage/backup.ts
- MOD: src/lib/storage/last-updated.ts
- MOD: src/lib/storage/schema.ts
- MOD: src/components/BackupControls.tsx
- MOD: src/lib/feedback/context.tsx
- MOD: src/lib/feedback/messages.ts
- MOD: src/components/ToastViewport.tsx
- MOD: tests/unit/storage.backup.test.ts
- MOD: tests/e2e/booking-flow.spec.ts
- MOD: tests/support/fixtures/factories/backup-factory.ts

## Change Log

- 2025-12-03: Initial draft created from epics, PRD, architecture.
- 2025-12-03: Generated story context and marked ready-for-dev.
- 2025-12-03: Implemented import with validation, rollback, UI feedback, and tests; marked story ready for review.
- 2025-12-03: Fixed shared feedback crash affecting import; unit suite passing.
- 2025-12-03: Senior Developer Review appended; status moved to done.

## Senior Developer Review (AI)

**Reviewer:** DICKY  
**Date:** 2025-12-03  
**Outcome:** Approve  
**Summary:** Import flow now validates schema/version, writes users/bookings/lastUpdated atomically with rollback on failure, and surfaces toasts + inline errors. Tests cover valid import, invalid payload, rollback failure, and UI toasts.

### Key Findings
- None (all ACs satisfied; no defects found).

### Acceptance Criteria Coverage
| AC | Description | Status | Evidence |
| --- | --- | --- | --- |
| 1 | Validate backup schema; on success replace data, update last-updated, show success toast | IMPLEMENTED | src/lib/storage/backup.ts:116-148 (schema parse, writes, lastUpdated); src/components/BackupControls.tsx:33-63,13-24; tests/unit/storage.backup.test.ts:57-66; tests/e2e/booking-flow.spec.ts:30-57 |
| 2 | Invalid backup rejected with clear error; no data change | IMPLEMENTED | src/lib/storage/backup.ts:116-151 (safeParse + rollback); src/components/BackupControls.tsx:33-63 (inline + toast errors); tests/unit/storage.backup.test.ts:68-97; tests/e2e/booking-flow.spec.ts:58-75 |
| 3 | Pre-import temp backup created; rollback on write failure | IMPLEMENTED | src/lib/storage/backup.ts:88-111,122-151 (snapshot + restore); tests/unit/storage.backup.test.ts:68-97 |

Summary: 3/3 ACs implemented.

### Task Completion Validation
| Task | Marked As | Verified As | Evidence |
| --- | --- | --- | --- |
| Validate and import (AC1) | Complete | VERIFIED COMPLETE | src/lib/storage/backup.ts:116-148; tests/unit/storage.backup.test.ts:57-66 |
| Error handling and rollback (AC2, AC3) | Complete | VERIFIED COMPLETE | src/lib/storage/backup.ts:88-151; tests/unit/storage.backup.test.ts:68-97 |
| UX (AC1–AC2) | Complete | VERIFIED COMPLETE | src/components/BackupControls.tsx:13-110; src/components/ToastViewport.tsx:10-22; tests/component/BackupControls.spec.tsx:13-46 |
| Tests (AC1–AC3) | Complete | VERIFIED COMPLETE | tests/unit/storage.backup.test.ts; tests/e2e/booking-flow.spec.ts |

Summary: 4/4 completed tasks verified; 0 questionable; 0 false completions.

### Test Coverage and Gaps
- Unit: import validation, rollback, payload shape (tests/unit/storage.backup.test.ts).
- Component: export/import toasts + inline errors (tests/component/BackupControls.spec.tsx).
- E2E: export/import happy path and malformed backup rejection (tests/e2e/booking-flow.spec.ts).
- No coverage gaps noted for scope.

### Architectural Alignment
- Uses local snapshot/restore for atomicity; respects data/ paths; schema validation via zod consistent with architecture.md.

### Security Notes
- Restricts to JSON payload; errors surfaced; no external paths used.

### Best-Practices and References
- Snapshot + rollback pattern to avoid partial writes.
- Centralized feedback via FeedbackProvider/ToastViewport with role="status".

### Action Items
- None.
