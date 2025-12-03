# Story 1.2: JSON storage service with schema validation

Status: done

## Story

As a developer, I want a storage module that reads/writes JSON with schema validation so corrupted data doesn’t break the app.

## Acceptance Criteria

1. Reading valid `users.json` and `bookings.json` loads data into memory without errors. citedocs/epics.md  
2. Invalid records (missing required fields or unknown deskId) are skipped and logged; the app still loads. citedocs/epics.md  
3. Every write saves files atomically and updates `data/last-updated.json` with an ISO timestamp. citedocs/epics.md  
4. DeskId validation checks bookings against `desks.json` before writes; writes with invalid deskId are rejected. citedocs/architecture.md  
5. Storage functions return structured `{ ok, error }` results so calling code can surface toasts/inline errors. citedocs/sprint-artifacts/tech-spec-epic-1.md  

## Tasks / Subtasks

- [x] Define schemas (AC1, AC2, AC4)  
  - [x] Create zod schemas for users, bookings, backup payload.  
  - [x] Load and validate data on startup; drop/collect invalid rows; log warnings.  
- [x] Implement storage adapter (AC1, AC3, AC5)  
  - [x] Add read/write helpers using atomic write (temp + rename).  
  - [x] Update `last-updated.json` on every successful write/import.  
  - [x] Ensure helpers return `{ ok, data? } | { ok: false, error }`.  
- [x] Desk validation (AC2, AC4)  
  - [x] Load `desks.json`; on write, reject bookings whose deskId is missing/mismatched office/floor.  
  - [x] Add warning logs for dropped records on load.  
- [x] Tests (AC1–AC5)  
  - [x] Unit: valid load passes; invalid rows dropped; deskId validation blocks bad data.  
  - [x] Unit: write updates last-updated; atomic write leaves no partial file on failure.  
  - [x] API/unit: helpers return structured result and propagate errors.  
- [x] Integration hooks (AC5)  
  - [x] Expose helper signatures for booking flows; document error shapes for UI toasts.  

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

- 2025-12-03: Added zod schemas for users/bookings/backup; deskId office/floor validation via desks index.
- 2025-12-03: Storage helpers now log skipped invalid rows, enforce atomic writes, and return structured results.
- 2025-12-03: Tests cover validation, deskId rejection, last-updated touch, and error paths; build/tests passing (Node 20 run; engines expect Node 22).

### File List

- UPDATED: package.json
- UPDATED: package-lock.json
- UPDATED: vitest.config.ts
- NEW: src/lib/storage/fs-adapter.ts
- NEW: src/lib/storage/desks-index.ts
- NEW: src/lib/storage/schema.ts
- UPDATED: src/lib/storage/last-updated.ts
- UPDATED: src/lib/storage/users.ts
- UPDATED: src/lib/storage/bookings.ts
- UPDATED: src/App.tsx (providers)
- UPDATED: src/index.css
- UPDATED: tests/unit/seed.test.ts
- NEW: tests/unit/storage.bookings.test.ts
- UPDATED: tests/unit/storage.users.test.ts
- UPDATED: tests/unit/last-updated.test.ts
- UPDATED: tests/component/FiltersBar.spec.tsx
- UPDATED: tests/component/UserDropdown.spec.tsx
- UPDATED: tests/component/LastUpdatedBadge.spec.tsx
- UPDATED: docs/sprint-artifacts/1-2-json-storage-service-with-schema-validation.md
- UPDATED: docs/sprint-artifacts/1-2-json-storage-service-with-schema-validation.context.xml
- UPDATED: docs/sprint-artifacts/sprint-status.yaml

## Change Log

- 2025-12-03: Initial draft created from epics, PRD, architecture, and tech spec.
- 2025-12-03: Generated story context and marked ready-for-dev.
