# Story 3.3: Enforce one booking per user/day

Status: done

## Story

As the system, I must block conflicts so a user cannot hold multiple desks on the same day.

## Acceptance Criteria

1. When attempting to create a booking, if the user already has a booking for the selected date (any office/floor), the action is blocked with a clear message and no write occurs. citedocs/epics.md  
2. Conflict validation runs both client-side (before confirm) and server/storage-side (during write) to prevent race/edge cases. citedocs/epics.md  
3. Visitor bookings are treated as unique ids (e.g., visitor-uuid) and also prevented from double-booking the same date. citedocs/epics.md  

## Tasks / Subtasks

- [x] Conflict check (AC1, AC2)  
  - [x] Client-side: before confirm, check in-memory bookings for date/userId; show error message.  
  - [x] Storage-side: enforce unique (userId, date); reject write with error code.  
- [x] Visitor handling (AC3)  
  - [x] Visitor id participates in conflict rule; blocked from double-booking same date.  
- [x] Error UX (AC1)  
  - [x] Inline error message indicating existing booking; selection preserved.  
- [x] Tests (AC1–AC3)  
  - [x] Unit/API: storage conflict blocks write.  
  - [x] Component: client conflict blocks confirm, shows message.  
  - [x] Visitor scenario: double booking blocked.  

## Dev Notes

- Depends on booking create flow (3.2) and roster (3.1); uses storage validation. citedocs/epics.md  
- PRD linkage: FR8 (one booking per user/day) and FR18 (clear feedback). citedocs/prd.md  
- Architecture: conflict check belongs in storage layer as source of truth; UI pre-check for UX. citedocs/architecture.md  
- Avoid optimistic writes without confirming storage success; consider dedupe key userId+date.  

### Project Structure Notes

- Add conflict check helper in storage (shared by client and write path); expose error codes for UI.  
- Consider adding index/lookup structure in memory for fast conflict detection.  

### References

- docs/epics.md (Epic 3, Story 3.3)  
- docs/prd.md (FR8, FR18)  
- docs/architecture.md (validation responsibility)

## Dev Agent Record

### Context Reference

- docs/sprint-artifacts/3-3-enforce-one-booking-per-user-day.context.xml

### Agent Model Used

OpenAI GPT-5 (Codex SM mode)

### Debug Log References

- Added conflict enforcement: storage-side user/date unique check with error code; client pre-check in BookingConfirm before write.
- Visitor id participates in conflict detection; double booking same date blocked.
- Tests cover storage conflict, UI conflict flow, and booking payload remains unchanged on block.

### Completion Notes List

- Tests run: `npm run test:unit` (pass).

### File List

- MOD: docs/sprint-artifacts/3-3-enforce-one-booking-per-user-day.md
- NEW: docs/sprint-artifacts/3-3-enforce-one-booking-per-user-day.context.xml
- MOD: src/lib/booking/create.ts
- MOD: src/components/BookingConfirm.tsx
- NEW: tests/unit/booking-conflict.test.ts
- NEW: tests/component/BookingConfirm.conflict.spec.tsx

## Change Log

- 2025-12-03: Initial draft created from epics, PRD, architecture.
- 2025-12-03: Generated story context and marked ready-for-dev.
- 2025-12-03: Senior Developer Review (AI) completed; approved.

## Senior Developer Review (AI)

Reviewer: DICKY  
Date: 2025-12-03  
Outcome: Approve  

Summary: Conflict rule enforced both client and storage for user/date (including visitor). Booking creation blocks duplicates with clear error; UI pre-check prevents confirm; tests cover storage and UI conflict.

Key Findings:
- None.

Acceptance Criteria Coverage:
- AC1 Block booking if user already has booking on date; clear message: IMPLEMENTED — createBooking returns USER_DATE_CONFLICT; BookingConfirm pre-check shows error. Evidence: src/lib/booking/create.ts:15-40; src/components/BookingConfirm.tsx:56-76. Tests: tests/unit/booking-conflict.test.ts:6-36; tests/component/BookingConfirm.conflict.spec.tsx:11-26.
- AC2 Validation runs client-side and storage-side: IMPLEMENTED — client pre-check in BookingConfirm using checkUserDateConflict; storage enforcement in createBooking. Evidence: BookingConfirm.tsx:56-76; booking/create.ts:15-40.
- AC3 Visitor bookings treated as unique ids and also blocked: IMPLEMENTED — conflict logic uses userId; visitor id participates; test covers visitor conflict. Evidence: tests/unit/booking-conflict.test.ts:24-36.

Task Validation:
- Client conflict check before confirm: VERIFIED — BookingConfirm.tsx:56-76.
- Storage conflict unique user/date: VERIFIED — booking/create.ts:15-40; tests/unit/booking-conflict.test.ts:6-36.
- Visitor handling: VERIFIED — tests/unit/booking-conflict.test.ts:24-36.
- Error UX clear, state unchanged: VERIFIED — BookingConfirm.tsx:63-76; BookingConfirm.conflict.spec.tsx:11-26.
- Tests AC1–AC3: VERIFIED — booking-conflict.test.ts; BookingConfirm.conflict.spec.tsx.

Test Coverage and Gaps:
- Storage and UI conflict paths tested; no gaps noted.

Architectural Alignment:
- Conflict enforcement in storage as source of truth; aligns with architecture guidance.

Security Notes:
- N/A (local-only rules).

Action Items:
- None.
