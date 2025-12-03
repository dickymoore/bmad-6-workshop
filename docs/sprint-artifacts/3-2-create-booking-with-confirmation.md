# Story 3.2: Create booking with confirmation

Status: ready-for-dev

## Story

As a user, I want to click a free desk and confirm booking for the selected date so my seat is reserved.

## Acceptance Criteria

1. Clicking a free desk opens a confirm UI showing user, desk, date; confirm creates booking saved to storage and updates map/list. citedocs/epics.md  
2. Booking saves with UUID, office, floor, deskId, date, userId; success toast shown; state refreshes immediately. citedocs/prd.md  
3. If booking cannot be created (validation or write error), user sees clear error toast/inline message and no partial state change. citedocs/epics.md  

## Tasks / Subtasks

- [ ] Confirmation flow (AC1)  
  - [ ] On hotspot click (free), open modal/card showing selected user/desk/date.  
  - [ ] Confirm triggers booking creation via storage helper.  
- [ ] Persist booking (AC2)  
  - [ ] Generate UUID; include office/floor/deskId/date/userId; write through storage; update last-updated.  
  - [ ] Refresh floorplan/list state after success; show success toast.  
- [ ] Error handling (AC3)  
  - [ ] Surface validation or fs errors via toast + inline; no partial UI state; rollback optimistic UI if used.  
- [ ] Tests (AC1–AC3)  
  - [ ] Component: modal shows correct data; confirm calls booking create.  
  - [ ] Integration: booking written and state refreshes; toast shown.  
  - [ ] Error path shows error and leaves state unchanged.  

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

### Completion Notes List

### File List

- NEW: docs/sprint-artifacts/3-2-create-booking-with-confirmation.md
- NEW: docs/sprint-artifacts/3-2-create-booking-with-confirmation.context.xml

## Change Log

- 2025-12-03: Initial draft created from epics, PRD, architecture.
- 2025-12-03: Generated story context and marked ready-for-dev.
