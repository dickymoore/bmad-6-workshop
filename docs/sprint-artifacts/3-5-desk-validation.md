# Story 3.5: Desk validation

Status: ready-for-dev

## Story

As the system, I want to ensure deskIds are valid before save so data stays consistent.

## Acceptance Criteria

1. Booking create/update rejects deskIds not present in desks.json for the current office/floor, with a clear error message. citedocs/epics.md  
2. On startup/import, invalid records in bookings are skipped/flagged and do not crash the app; errors are logged. citedocs/prd.md  
3. Validation runs both client-side (pre-write) and storage-side (authoritative) so no invalid deskIds persist. citedocs/architecture.md  

## Tasks / Subtasks

- [ ] Validation logic (AC1, AC3)  
  - [ ] Load desks.json metadata; validate deskId against office/floor on booking create/update.  
  - [ ] Return structured { ok:false, error } with code INVALID_DESK.  
- [ ] Load/import sanitation (AC2)  
  - [ ] During startup/import, drop invalid records, log warnings, and continue.  
- [ ] Client pre-check (AC3)  
  - [ ] Before confirm, check deskId against current desks; block with inline/toast on invalid.  
- [ ] Tests (AC1–AC3)  
  - [ ] Unit/API: invalid desk rejected on write; valid passes.  
  - [ ] Import/boot drops invalid rows, logs warning.  
  - [ ] Component: UI blocks invalid desk selection (e.g., stale hotspot).  

## Dev Notes

- Depends on desks.json as single source of truth; align with hotspots and storage. citedocs/architecture.md  
- PRD linkage: FR9 (desk validation) and FR15 (invalid records skipped on load). citedocs/prd.md  
- Integrate with storage layer used by booking create/cancel; use same validation in conflict and availability logic.  
- UX: error messages should mention deskId and office/floor; keep logs concise.  

### Project Structure Notes

- Implement validation helper in `src/lib/storage/validation.ts`; reused by write/import and UI pre-checks.  
- Keep desks.json loading cached; avoid repeated file reads.  

### References

- docs/epics.md (Epic 3, Story 3.5)  
- docs/prd.md (FR9, FR15)  
- docs/architecture.md (desk validation responsibility)

## Dev Agent Record

### Context Reference

- docs/sprint-artifacts/3-5-desk-validation.context.xml

### Agent Model Used

OpenAI GPT-5 (Codex SM mode)

### Debug Log References

### Completion Notes List

### File List

- NEW: docs/sprint-artifacts/3-5-desk-validation.md
- NEW: docs/sprint-artifacts/3-5-desk-validation.context.xml

## Change Log

- 2025-12-03: Initial draft created from epics, PRD, architecture.
- 2025-12-03: Generated story context and marked ready-for-dev.
