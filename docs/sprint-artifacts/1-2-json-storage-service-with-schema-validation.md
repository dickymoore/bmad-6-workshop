# Story 1.2: JSON storage service with schema validation

Status: ready-for-dev

## Story

As a developer, I want a storage module that reads/writes JSON with schema validation so corrupted data doesn’t break the app.

## Acceptance Criteria

1. Reading valid `users.json` and `bookings.json` loads data into memory without errors. citedocs/epics.md  
2. Invalid records (missing required fields or unknown deskId) are skipped and logged; the app still loads. citedocs/epics.md  
3. Every write saves files atomically and updates `data/last-updated.json` with an ISO timestamp. citedocs/epics.md  
4. DeskId validation checks bookings against `desks.json` before writes; writes with invalid deskId are rejected. citedocs/architecture.md  
5. Storage functions return structured `{ ok, error }` results so calling code can surface toasts/inline errors. citedocs/sprint-artifacts/tech-spec-epic-1.md  

## Tasks / Subtasks

- [ ] Define schemas (AC1, AC2, AC4)  
  - [ ] Create zod/ajv schemas for users, bookings, backup payload.  
  - [ ] Load and validate data on startup; drop/collect invalid rows; log warnings.  
- [ ] Implement storage adapter (AC1, AC3, AC5)  
  - [ ] Add read/write helpers using atomic write (temp + rename).  
  - [ ] Update `last-updated.json` on every successful write/import.  
  - [ ] Ensure helpers return `{ ok, data? } | { ok: false, error }`.  
- [ ] Desk validation (AC2, AC4)  
  - [ ] Load `desks.json`; on write, reject bookings whose deskId is missing/mismatched office/floor.  
  - [ ] Add warning logs for dropped records on load.  
- [ ] Tests (AC1–AC5)  
  - [ ] Unit: valid load passes; invalid rows dropped; deskId validation blocks bad data.  
  - [ ] Unit: write updates last-updated; atomic write leaves no partial file on failure.  
  - [ ] API/unit: helpers return structured result and propagate errors.  
- [ ] Integration hooks (AC5)  
  - [ ] Expose helper signatures for booking flows; document error shapes for UI toasts.  

## Dev Notes

- Architecture: Client-only SPA; storage layer is single source of truth for bookings/users with synchronous JSON writes and last-updated tracking. citedocs/architecture.md  
- Tech spec alignment: Implement `storage/fs-adapter`, `storage/schema`, `bookings-service`, `users-service`, and `last-updated` helpers exactly as scoped in the Epic 1 tech spec; enforce deskId validation and atomic writes. citedocs/sprint-artifacts/tech-spec-epic-1.md  
- PRD linkage: Supports FR12–FR15 reliability requirements (write-through persistence, validation, import safety). citedocs/prd.md  
- Error handling: No silent failures—return `{ ok:false, error }`, log via console.error, and let UI surface toasts.  
- Data safety: Keep all file operations inside `data/`; reject absolute paths outside project root.  

### Project Structure Notes

- Place schemas and helpers under `src/lib/storage/`; keep data files in `data/` with backups in `data/backup/`. citedocs/architecture.md  
- Ensure future booking features call these helpers instead of direct fs access to keep validation centralized.  

### References

- docs/epics.md (Epic 1, Story 1.2 ACs)  
- docs/architecture.md (data layout, deskId validation, write-through pattern)  
- docs/sprint-artifacts/tech-spec-epic-1.md (storage services contracts, atomic write guidance)  
- docs/prd.md (FR12–FR15 persistence and validation)

## Dev Agent Record

### Context Reference

- docs/sprint-artifacts/1-2-json-storage-service-with-schema-validation.context.xml

### Agent Model Used

OpenAI GPT-5 (Codex SM mode)

### Debug Log References

### Completion Notes List

### File List

- NEW: docs/sprint-artifacts/1-2-json-storage-service-with-schema-validation.md
- NEW: docs/sprint-artifacts/1-2-json-storage-service-with-schema-validation.context.xml

## Change Log

- 2025-12-03: Initial draft created from epics, PRD, architecture, and tech spec.
- 2025-12-03: Generated story context and marked ready-for-dev.
