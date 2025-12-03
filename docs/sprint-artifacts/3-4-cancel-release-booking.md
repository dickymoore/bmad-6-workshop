# Story 3.4: Cancel/release booking

Status: ready-for-dev

## Story

As a user, I want to release my booking so the desk becomes free.

## Acceptance Criteria

1. From floorplan or list, user can cancel a booking; confirmation is required before removal. citedocs/epics.md  
2. On cancel, booking is removed (or marked released), availability and list update immediately, and success toast displays. citedocs/prd.md  
3. Errors (missing booking, write failure) surface clear messages; no partial state left behind. citedocs/epics.md  

## Tasks / Subtasks

- [ ] Trigger cancel (AC1)  
  - [ ] Add cancel action from list row and floorplan selection; show confirm modal.  
- [ ] Persist removal (AC2)  
  - [ ] Remove or mark released in bookings file; update last-updated; refresh state; success toast.  
- [ ] Error handling (AC3)  
  - [ ] If booking not found or write fails, show error toast/inline; keep state unchanged.  
- [ ] Tests (AC1–AC3)  
  - [ ] Component: confirm flow; removal updates map/list.  
  - [ ] Integration: storage removal updates last-updated.  
  - [ ] Error path leaves state intact and shows error.  

## Dev Notes

- Depends on bookings storage (1.x) and booking create flow (3.2), conflict rule (3.3), and floorplan/list sync (2.x). citedocs/epics.md  
- PRD linkage: FR7 (cancel) and FR18 (feedback). citedocs/prd.md  
- Architecture: removal must honor desk validation and write-through semantics; use storage helper for consistency. citedocs/architecture.md  
- UX: confirm text includes desk/date/user; ensure idempotent cancel to avoid double-remove.  

### Project Structure Notes

- Implement cancel in BookingList and FloorplanView; use shared booking store to update both.  
- Consider keeping historical releasedAt flag if needed; minimal path can hard-delete.  

### References

- docs/epics.md (Epic 3, Story 3.4)  
- docs/prd.md (FR7, FR18)  
- docs/architecture.md (storage/write rules)

## Dev Agent Record

### Context Reference

- docs/sprint-artifacts/3-4-cancel-release-booking.context.xml

### Agent Model Used

OpenAI GPT-5 (Codex SM mode)

### Debug Log References

### Completion Notes List

### File List

- NEW: docs/sprint-artifacts/3-4-cancel-release-booking.md
- NEW: docs/sprint-artifacts/3-4-cancel-release-booking.context.xml

## Change Log

- 2025-12-03: Initial draft created from epics, PRD, architecture.
- 2025-12-03: Generated story context and marked ready-for-dev.
