# Story 3.5: Desk validation

Status: done

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
- 2025-12-03: Implemented desk validation storage/client, drop-invalid-on-load, and tests; ready for review.
- 2025-12-03: Senior Developer Review (AI) completed; approved.

## Senior Developer Review (AI)

Reviewer: DICKY  
Date: 2025-12-03  
Outcome: Approve  

Summary: Desk validation centralized; storage rejects invalid deskIds with codes; client pre-check blocks invalid selections; read/import drops invalid records with warnings. Tests cover storage reject, load sanitation, and UI pre-check.

Key Findings:
- None.

Acceptance Criteria Coverage:
- AC1 Booking create/update rejects deskIds not in desks.json with clear error: IMPLEMENTED — validateDeskForBooking used in createBooking and BookingConfirm; returns INVALID_DESK/DESK_MISMATCH. Evidence: src/lib/storage/validation.ts:1-14; src/lib/booking/create.ts:1-32; src/components/BookingConfirm.tsx:52-77. Tests: tests/unit/desk-validation.test.ts:1-19; tests/component/BookingConfirm.invalid.spec.tsx:11-22.
- AC2 Startup/import skips invalid booking records and logs: IMPLEMENTED — readBookings parses with schema and logs warn; test ensures invalid dropped. Evidence: src/lib/storage/bookings.ts:17-42; tests/unit/desk-validation.test.ts:21-35.
- AC3 Validation client-side and storage-side: IMPLEMENTED — BookingConfirm pre-check + storage validation in createBooking/writeBookings; invalid desk never persists. Evidence: BookingConfirm.tsx:52-77; booking/create.ts:15-32; storage/schema.ts desk superRefine lines 4-20.

Task Validation:
- Validation logic w/ INVALID_DESK code: VERIFIED — storage/validation.ts; booking/create.ts.
- Load/import sanitation: VERIFIED — readBookings filter + warning; test desk-validation.test.ts.
- Client pre-check: VERIFIED — BookingConfirm invalid test; BookingConfirm.tsx pre-check.
- Tests AC1–AC3: VERIFIED — tests/unit/desk-validation.test.ts; tests/component/BookingConfirm.invalid.spec.tsx; existing storage schema tests.

Test Coverage and Gaps:
- Storage reject and load sanitation tested; UI invalid desk blocking tested. No gaps noted for stated ACs.

Architectural Alignment:
- Uses desks.json canonical mapping; validation at storage as source of truth; aligns with architecture doc.

Security Notes:
- N/A (local-only validation).

Action Items:
- None.
