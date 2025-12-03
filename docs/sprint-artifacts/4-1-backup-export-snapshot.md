# Story 4.1: Backup/export snapshot

Status: review

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

## Change Log

- 2025-12-03: Initial draft created from epics, PRD, architecture.
- 2025-12-03: Generated story context and marked ready-for-dev.
- 2025-12-03: Implemented backup export helper + UI/toasts, added unit/component coverage, sprint-status updated to review.
