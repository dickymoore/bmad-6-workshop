# Story 3.2: Create booking with confirmation

Status: done

## Story

As a user, I want to click a free desk and confirm booking for the selected date so my seat is reserved.

## Acceptance Criteria

1. Clicking a free desk opens a confirm UI showing user, desk, date; confirm creates booking saved to storage and updates map/list. citedocs/epics.md  
2. Booking saves with UUID, office, floor, deskId, date, userId; success toast shown; state refreshes immediately. citedocs/prd.md  
3. If booking cannot be created (validation or write error), user sees clear error toast/inline message and no partial state change. citedocs/epics.md  

## Tasks / Subtasks

- [x] Confirmation flow (AC1)  
  - [x] On hotspot click (free), open confirm card showing selected user/desk/date.  
  - [x] Confirm triggers booking creation via storage helper.  
- [x] Persist booking (AC2)  
  - [x] Generate UUID; include office/floor/deskId/date/userId; write through storage; update last-updated.  
  - [x] Refresh floorplan/list state after success; show success status.  
- [x] Error handling (AC3)  
  - [x] Surface validation errors inline; no partial state; rollback unnecessary (no optimistic write).  
- [x] Tests (AC1–AC3)  
  - [x] Component: confirm shows data; confirm calls booking create.  
  - [x] Integration: booking written and state refreshes.  
  - [x] Error path shows error and leaves state unchanged.  

## Dev Notes

- Depends on user selection (Story 3.1), filters (2.1), floorplan (2.2), and storage (1.x). citedocs/epics.md  
- PRD linkage: FR6 (create booking), FR18 (feedback), FR8/FR9 enforced by later stories. citedocs/prd.md  
- Architecture: use storage writeBooking helper with deskId validation and last-updated update. citedocs/architecture.md  
- UX: keep confirm UI concise; include desk name/id, office/floor, date, user.  

### Project Structure Notes

- Implement confirm UI in BookingConfirm component; reuse storage helpers from src/lib/storage.  
- Ensure booking state refresh is centralized (single source) to avoid divergence.  

### References

- docs/epics.md (Epic 3, Story 3.2)  
- docs/prd.md (FR6, FR18)  
- docs/architecture.md (write-through storage, validation)

## Dev Agent Record

### Context Reference

- docs/sprint-artifacts/3-2-create-booking-with-confirmation.context.xml

### Agent Model Used

OpenAI GPT-5 (Codex SM mode)

### Debug Log References

- Added BookingConfirm card wired to floorplan free-desk click; shows user/desk/date and calls createBooking.
- createBooking wraps storage read/write with conflict check, UUID, last-updated via storage helper side effects; overlay/list refresh via subscriptions.
- Error path surfaces inline alert without partial write; success sets status message.

### Completion Notes List

- Tests run: `npm run test:unit` (pass).

### File List

- MOD: docs/sprint-artifacts/3-2-create-booking-with-confirmation.md
- NEW: docs/sprint-artifacts/3-2-create-booking-with-confirmation.context.xml
- NEW: src/components/BookingConfirm.tsx
- MOD: src/components/Floorplan/FloorplanView.tsx
- MOD: src/App.tsx
- NEW: src/lib/booking/create.ts
- MOD: src/lib/booking/payload.ts
- MOD: src/lib/booking/selection.tsx
- NEW: src/lib/booking/useBookingPayload.ts
- NEW: tests/component/BookingConfirm.spec.tsx

## Change Log

- 2025-12-03: Initial draft created from epics, PRD, architecture.
- 2025-12-03: Generated story context and marked ready-for-dev.
- 2025-12-03: Senior Developer Review (AI) completed; approved.

## Senior Developer Review (AI)

Reviewer: DICKY  
Date: 2025-12-03  
Outcome: Approve  

Summary: Free-desk click selects desk; BookingConfirm shows user/desk/date and writes booking via storage helper with UUID, conflict checks, and last-updated update. Success and error messaging are present; tests cover success and conflict paths.

Key Findings:
- None.

Acceptance Criteria Coverage:
- AC1 Clicking a free desk opens confirm UI showing user/desk/date and creates booking: IMPLEMENTED — FloorplanView onFreeDeskClick propagates selection; BookingConfirm renders summary and confirm action. Evidence: src/components/Floorplan/FloorplanView.tsx:86-94,165-194; src/components/BookingConfirm.tsx:9-82.
- AC2 Booking saved with UUID, office/floor/deskId/date/userId; success message and state refresh: IMPLEMENTED — buildBookingPayload uses randomUUID; createBooking writes through storage and emits; BookingConfirm sets success message. Evidence: src/lib/booking/payload.ts:1-13; src/lib/booking/create.ts:15-57; BookingConfirm.tsx:56-76. Tests: tests/component/BookingConfirm.spec.tsx:11-36.
- AC3 Errors surface clearly and no partial state: IMPLEMENTED — createBooking returns error codes; BookingConfirm displays alert text; state unchanged on failure. Evidence: booking/create.ts:15-57; BookingConfirm.tsx:63-76,85-92; tests/component/BookingConfirm.conflict.spec.tsx:11-26.

Task Validation:
- Confirmation flow from hotspot click: VERIFIED — FloorplanView wiring and App integration. Evidence: src/App.tsx:41-55.
- Persist booking with UUID/fields and update last-updated: VERIFIED — booking/payload.ts; booking/create.ts; storage write. Evidence: src/lib/booking/create.ts:15-57.
- Error handling: VERIFIED — booking/create.ts codes; BookingConfirm inline alert; conflict test. Evidence: tests/component/BookingConfirm.conflict.spec.tsx:11-26.
- Tests AC1–AC3: VERIFIED — tests/component/BookingConfirm.spec.tsx; BookingConfirm.conflict.spec.tsx.

Test Coverage and Gaps:
- Happy path and conflict path covered. No gaps noted for stated ACs.

Architectural Alignment:
- Uses storage layer, localStorage persistence, conflict validation per architecture guidance.

Security Notes:
- N/A (local-only persistence).

Action Items:
- None.
