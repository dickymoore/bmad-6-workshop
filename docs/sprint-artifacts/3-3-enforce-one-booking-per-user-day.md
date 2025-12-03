# Story 3.3: Enforce one booking per user/day

Status: ready-for-dev

## Story

As the system, I must block conflicts so a user cannot hold multiple desks on the same day.

## Acceptance Criteria

1. When attempting to create a booking, if the user already has a booking for the selected date (any office/floor), the action is blocked with a clear message and no write occurs. citedocs/epics.md  
2. Conflict validation runs both client-side (before confirm) and server/storage-side (during write) to prevent race/edge cases. citedocs/epics.md  
3. Visitor bookings are treated as unique ids (e.g., visitor-uuid) and also prevented from double-booking the same date. citedocs/epics.md  

## Tasks / Subtasks

- [ ] Conflict check (AC1, AC2)  
  - [ ] Client-side: before confirm, check in-memory bookings for date/userId; show error message.  
  - [ ] Storage-side: enforce unique (userId, date); reject write and return structured error.  
- [ ] Visitor handling (AC3)  
  - [ ] Ensure visitor bookings use unique id; conflict check applies.  
- [ ] Error UX (AC1)  
  - [ ] Toast and inline message indicating existing booking; keep selection intact.  
- [ ] Tests (AC1–AC3)  
  - [ ] Unit/API: storage conflict blocks write.  
  - [ ] Component: client conflict blocks confirm, shows message.  
  - [ ] Visitor scenario: double booking blocked.  

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

### Completion Notes List

### File List

- NEW: docs/sprint-artifacts/3-3-enforce-one-booking-per-user-day.md
- NEW: docs/sprint-artifacts/3-3-enforce-one-booking-per-user-day.context.xml

## Change Log

- 2025-12-03: Initial draft created from epics, PRD, architecture.
- 2025-12-03: Generated story context and marked ready-for-dev.
