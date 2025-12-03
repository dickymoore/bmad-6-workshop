# Story 4.2: Import/restore with validation

Status: ready-for-dev

## Story

As a user, I want to import a backup safely so I don’t corrupt data.

## Acceptance Criteria

1. Import validates backup schema (users, bookings, lastUpdated); on success, replaces current data and updates last-updated; success toast shown. citedocs/epics.md  
2. Invalid backup is rejected with clear error; current data remains unchanged. citedocs/prd.md  
3. A pre-import temp backup of current data is created when possible; rollback used if write fails. citedocs/epics.md  

## Tasks / Subtasks

- [ ] Validate and import (AC1)  
  - [ ] Validate schema/version; on success write users/bookings/lastUpdated atomically; refresh state.  
- [ ] Error handling and rollback (AC2, AC3)  
  - [ ] On invalid schema, reject and show error toast; no changes.  
  - [ ] Create pre-import backup; if write fails, restore original files.  
- [ ] UX (AC1–AC2)  
  - [ ] UI flow to select file; success/error toasts; inline errors if needed.  
- [ ] Tests (AC1–AC3)  
  - [ ] Valid import replaces data and updates last-updated.  
  - [ ] Invalid import rejected, no data change.  
  - [ ] Simulated write failure triggers rollback.  

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

### Completion Notes List

### File List

- NEW: docs/sprint-artifacts/4-2-import-restore-with-validation.md
- NEW: docs/sprint-artifacts/4-2-import-restore-with-validation.context.xml

## Change Log

- 2025-12-03: Initial draft created from epics, PRD, architecture.
- 2025-12-03: Generated story context and marked ready-for-dev.
