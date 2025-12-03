# Story 4.1: Backup/export snapshot

Status: done

## Story

As a user, I want to export users/bookings to a timestamped JSON so I can back up state.

## Acceptance Criteria

1. Export action writes `data/backup/backup-YYYYMMDD-HHMMSS.json` containing users, bookings, and lastUpdated. citedocs/epics.md  
2. Success toast shows the backup path; errors surface clearly and do not create partial files. citedocs/prd.md  
3. Backup directory is auto-created if missing; permission errors are handled with user-facing messaging. citedocs/epics.md  

## Tasks / Subtasks

- [x] Implement export helper (AC1, AC3)  
  - [x] mkdirp `data/backup/`; write atomic file with timestamped name; include users, bookings, lastUpdated.  
- [x] UX + feedback (AC2)  
  - [x] Trigger from UI; show success toast with path; show error toast on failure.  
- [x] Error handling (AC3)  
  - [x] Detect permission/missing dir errors; return { ok:false, error }; no partial files.  
- [x] Tests (AC1–AC3)  
  - [x] Unit: filename format and contents.  
  - [x] Unit: permission failure returns error, no file created.  
  - [x] Component/API: success toast path.  

## Dev Notes

- Relies on storage helpers (Epic 1) for users/bookings and lastUpdated. citedocs/architecture.md  
- PRD linkage: FR16 backup/export requirement and FR18 feedback. citedocs/prd.md  
- Use atomic write (temp + rename); keep backups outside git via .gitignore.  

### Project Structure Notes

- Add `exportBackup()` in `src/lib/storage/backup.ts`; UI button in BackupControls.  
- Ensure `.gitignore` already excludes `data/backup/*`.  

### References

- docs/epics.md (Epic 4, Story 4.1)  
- docs/prd.md (FR16, FR18)  
- docs/architecture.md (backup path, write-through)

## Dev Agent Record

### Context Reference

- docs/sprint-artifacts/4-1-backup-export-snapshot.context.xml

### Agent Model Used

OpenAI GPT-5 (Codex SM mode)

### Debug Log References

- 2025-12-03: Plan — implement fs-backed exportBackup (mkdirp data/backup, atomic write, return path), add BackupControls UI with success/error toast, cover filename/permission tests; sprint-status set to in-progress.

### Completion Notes List

- 2025-12-03: Added fs-backed exportBackup (mkdirp data/backup, atomic temp+rename, permission messaging), BackupControls UI with success/error toast, and `npm run test:unit` (pass). Ensured data/backup/.gitkeep persists.
- 2025-12-03: Fixed BackupControls import crash (removed undefined setToast), verified `npm run test:unit` passes; shared feedback stable across export/import.

### File List

- MOD: docs/sprint-artifacts/4-1-backup-export-snapshot.md
- MOD: docs/sprint-artifacts/sprint-status.yaml
- MOD: src/lib/storage/backup.ts
- NEW: src/components/BackupControls.tsx
- MOD: src/App.tsx
- MOD: src/index.css
- MOD: tests/unit/storage.backup.test.ts
- NEW: tests/component/BackupControls.spec.tsx
- NEW: data/backup/.gitkeep
- MOD: src/lib/feedback/context.tsx
- MOD: src/lib/feedback/messages.ts
- MOD: src/components/ToastViewport.tsx
- MOD: tests/unit/feedback.test.ts

## Change Log

- 2025-12-03: Initial draft created from epics, PRD, architecture.
- 2025-12-03: Generated story context and marked ready-for-dev.
- 2025-12-03: Implemented backup export helper + UI/toasts, added unit/component coverage, sprint-status updated to review.
- 2025-12-03: Fixed BackupControls feedback crash; unit suite passing.
- 2025-12-03: Senior Developer Review appended; status moved to done.

## Senior Developer Review (AI)

**Reviewer:** DICKY  
**Date:** 2025-12-03  
**Outcome:** Approve  
**Summary:** Export/feedback implementation meets ACs; atomic write, permission messaging, and toasts verified. No outstanding issues.

### Key Findings
- None (all checks passed).

### Acceptance Criteria Coverage
| AC | Description | Status | Evidence |
| --- | --- | --- | --- |
| 1 | Export writes backup-YYYYMMDD-HHMMSS.json with users/bookings/lastUpdated | IMPLEMENTED | src/lib/storage/backup.ts:42-85 (mkdirp + atomic temp/rename + payload); tests/unit/storage.backup.test.ts:22-37 |
| 2 | Success toast shows path; errors surfaced; no partial files | IMPLEMENTED | src/components/BackupControls.tsx:13-24,78-82 (toast + inline); tests/component/BackupControls.spec.tsx:13-46 |
| 3 | Backup dir auto-created; permission errors handled | IMPLEMENTED | src/lib/storage/backup.ts:42-85 (recursive mkdir, describeFsError); tests/unit/storage.backup.test.ts:39-55 |

Summary: 3/3 ACs implemented.

### Task Completion Validation
| Task | Marked As | Verified As | Evidence |
| --- | --- | --- | --- |
| Implement export helper (AC1, AC3) | Complete | VERIFIED COMPLETE | src/lib/storage/backup.ts:42-85 |
| UX + feedback (AC2) | Complete | VERIFIED COMPLETE | src/components/BackupControls.tsx:13-110; tests/component/BackupControls.spec.tsx:13-46 |
| Error handling (AC3) | Complete | VERIFIED COMPLETE | src/lib/storage/backup.ts:21-27,42-85; tests/unit/storage.backup.test.ts:39-55 |
| Tests (AC1–AC3) | Complete | VERIFIED COMPLETE | tests/unit/storage.backup.test.ts; tests/component/BackupControls.spec.tsx |

Summary: 4/4 completed tasks verified; 0 questionable; 0 false completions.

### Test Coverage and Gaps
- Unit: backup export payload, filename, permission failure, import rollback (tests/unit/storage.backup.test.ts).
- Component: export toasts path and error surfacing (tests/component/BackupControls.spec.tsx).
- No gaps noted for this story scope.

### Architectural Alignment
- Uses atomic temp+rename, respects data/backup path, and structured errors per architecture.md; no violations observed.

### Security Notes
- Local filesystem only; permission errors surfaced; no external I/O introduced.

### Best-Practices and References
- Atomic writes with temp file + rename.
- User-facing feedback via centralized toasts (role="status").

### Action Items
- None.
