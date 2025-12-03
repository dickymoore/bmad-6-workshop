# Story 3.1: Select user for booking

Status: done

## Story

As a user, I want to pick myself (or a visitor) from a dropdown so the booking is attributed.

## Acceptance Criteria

1. User dropdown lists roster entries from `users.json`; visitor option is available. citedocs/epics.md  
2. Selected user is carried into booking confirmation and saved with booking record. citedocs/prd.md  
3. If roster is empty, dropdown shows disabled state with notice and prevents booking until roster populated. citedocs/epics.md  

## Tasks / Subtasks

- [x] Populate dropdown (AC1)  
  - [x] Load roster from storage (Story 1.4); include “Visitor” option.  
  - [x] Handle empty roster: disable confirm, show notice.  
- [x] Wire selection to booking flow (AC2)  
  - [x] Persist selected userId in booking create payload; selection context exposed for confirmation modal.  
- [x] Validation and UX (AC1–AC3)  
  - [x] Prevent booking when no user selected; throws on payload build; inline notice and disabled state when roster empty.  
  - [x] Accessible labels and keyboard navigation; aria-live for errors.  
- [x] Tests (AC1–AC3)  
  - [x] Component: roster renders options + visitor.  
  - [x] Integration: selection flows into booking payload.  
  - [x] Empty roster blocks booking with notice.  

## Dev Notes

- Depends on roster storage from Story 1.4; use storage helpers and last-updated updates. citedocs/epics.md  
- PRD linkage: FR3 (user dropdown) and FR6/FR8 rely on correct attribution. citedocs/prd.md  
- Architecture: user IDs come from `users.json`; ensure consistency with booking schema and visitor handling (unique id). citedocs/architecture.md  
- UX: keep dropdown near filters; visitor treated as unique id (e.g., visitor-uuid).  

### Project Structure Notes

- Implement in FiltersBar/UserSelect component; share selected user state with booking flow.  
- Visitor id should be generated and not collide with roster ids.  

### References

- docs/epics.md (Epic 3, Story 3.1)  
- docs/prd.md (FR3, booking attribution)  
- docs/architecture.md (roster/storage alignment)

## Dev Agent Record

### Context Reference

- docs/sprint-artifacts/3-1-select-user-for-booking.context.xml

### Agent Model Used

OpenAI GPT-5 (Codex SM mode)

### Debug Log References

- Added SelectedUserProvider shared state with visitor option; UserDropdown uses roster + visitor, disabled when roster empty with notices.
- Booking payload builder enforces selected user and generates booking ids/createdAt; selection flows through useBookingPayloadBuilder.
- Tests cover dropdown options, selection flow, empty roster behavior; all unit tests passing.

### Completion Notes List

- Tests run: `npm run test:unit` (pass).

### File List

- MOD: docs/sprint-artifacts/3-1-select-user-for-booking.md
- NEW: docs/sprint-artifacts/3-1-select-user-for-booking.context.xml
- NEW: src/lib/booking/selection.tsx
- NEW: src/lib/booking/payload.ts
- NEW: src/lib/booking/useBookingPayload.ts
- MOD: src/components/UserDropdown.tsx
- MOD: src/App.tsx
- NEW: tests/unit/booking.payload.test.ts
- NEW: tests/component/UserSelectionFlow.spec.tsx
- MOD: tests/component/UserDropdown.spec.tsx

## Change Log

- 2025-12-03: Initial draft created from epics, PRD, architecture.
- 2025-12-03: Generated story context and marked ready-for-dev.
- 2025-12-03: Senior Developer Review (AI) completed; approved.

## Senior Developer Review (AI)

Reviewer: DICKY  
Date: 2025-12-03  
Outcome: Approve  

Summary: User selection is sourced from roster storage with a visitor option; dropdown disables when roster empty; selected user propagates into booking payload builder. Tests cover options, selection flow, and empty roster.

Key Findings:
- None.

Acceptance Criteria Coverage:
- AC1 Dropdown lists roster entries and visitor: IMPLEMENTED — UserDropdown renders roster + visitor from selection context. Evidence: src/components/UserDropdown.tsx:4-33. Tests: tests/component/UserDropdown.spec.tsx:12-31.
- AC2 Selected user carried into booking confirmation/payload: IMPLEMENTED — selection context + useBookingPayloadBuilder injects selectedUserId. Evidence: src/lib/booking/useBookingPayload.ts:3-12; src/lib/booking/payload.ts:1-14; tests/component/UserSelectionFlow.spec.tsx:18-48.
- AC3 Empty roster disables dropdown and prevents booking: IMPLEMENTED — disabled when no users and shows notice. Evidence: src/components/UserDropdown.tsx:15-33; tests/component/UserDropdown.spec.tsx:22-28.

Task Validation:
- Populate dropdown with roster + visitor: VERIFIED — UserDropdown.tsx:4-33; selection.tsx:1-33.
- Handle empty roster disable/notice: VERIFIED — UserDropdown.tsx:15-33; tests/component/UserDropdown.spec.tsx:22-28.
- Wire selection to booking payload: VERIFIED — useBookingPayload.ts:3-12; booking/payload.ts:1-14.
- Validation/UX (prevent booking without user): VERIFIED — booking/create.ts pre-check; BookingConfirm uses selection. Evidence: src/lib/booking/create.ts:15-40.
- Tests: VERIFIED — tests/unit/booking.payload.test.ts; tests/component/UserSelectionFlow.spec.tsx; tests/component/UserDropdown.spec.tsx.

Test Coverage and Gaps:
- Component and unit tests cover selection, visitor option, payload injection, empty roster. No gaps noted for stated ACs.

Architectural Alignment:
- Uses roster storage, localStorage persistence; visitor id treated like normal id; aligns with architecture constraints.

Security Notes:
- N/A (client-only selection state).

Action Items:
- None.
