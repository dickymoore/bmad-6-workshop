# Story 3.1: Select user for booking

Status: ready-for-dev

## Story

As a user, I want to pick myself (or a visitor) from a dropdown so the booking is attributed.

## Acceptance Criteria

1. User dropdown lists roster entries from `users.json`; visitor option is available. citedocs/epics.md  
2. Selected user is carried into booking confirmation and saved with booking record. citedocs/prd.md  
3. If roster is empty, dropdown shows disabled state with notice and prevents booking until roster populated. citedocs/epics.md  

## Tasks / Subtasks

- [ ] Populate dropdown (AC1)  
  - [ ] Load roster from storage (Story 1.4); include “Visitor” option.  
  - [ ] Handle empty roster: disable confirm, show notice.  
- [ ] Wire selection to booking flow (AC2)  
  - [ ] Persist selected userId in booking create payload and confirmation modal.  
- [ ] Validation and UX (AC1–AC3)  
  - [ ] Prevent booking when no user selected; show inline + toast message.  
  - [ ] Accessible labels and keyboard navigation; aria-live for errors.  
- [ ] Tests (AC1–AC3)  
  - [ ] Component: roster renders options + visitor.  
  - [ ] Integration: selection flows into booking payload.  
  - [ ] Empty roster blocks booking with notice.  

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

### Completion Notes List

### File List

- NEW: docs/sprint-artifacts/3-1-select-user-for-booking.md
- NEW: docs/sprint-artifacts/3-1-select-user-for-booking.context.xml

## Change Log

- 2025-12-03: Initial draft created from epics, PRD, architecture.
- 2025-12-03: Generated story context and marked ready-for-dev.
