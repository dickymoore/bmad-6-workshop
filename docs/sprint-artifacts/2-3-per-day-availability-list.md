# Story 2.3: Per-day availability list

Status: ready-for-dev

## Story

As a user, I want a per-day “who’s where” list so I can quickly see desk assignments.

## Acceptance Criteria

1. List shows user, deskId, office, and floor for the selected date; data comes from bookings filtered by office/floor/date. citedocs/epics.md  
2. Sorting by desk or user is available; defaults to desk sort. citedocs/epics.md  
3. Selecting a row highlights the corresponding desk on the floorplan (or displays details if highlight not implemented) without desync. citedocs/epics.md  

## Tasks / Subtasks

- [ ] Build list component (AC1)  
  - [ ] Derive data from current booking state filtered by office/floor/date.  
  - [ ] Display columns: User, Desk, Office/Floor, Date.  
- [ ] Sorting (AC2)  
  - [ ] Implement sort toggle between desk and user; default desk.  
- [ ] Row highlight/link (AC3)  
  - [ ] On row select, trigger floorplan highlight or show desk details panel; keep state in sync.  
- [ ] Empty/loading/error states  
  - [ ] Friendly empty message; loading skeleton; error toast/log.  
- [ ] Tests (AC1–AC3)  
  - [ ] Unit: filter logic for office/floor/date.  
  - [ ] Component: sort behavior; row select triggers highlight callback.  
  - [ ] Integration: state sync with floorplan mock.  

## Dev Notes

- Depends on filter state (Story 2.1) and floorplan render (Story 2.2); ensure shared state bus triggers updates both ways. citedocs/epics.md  
 - PRD linkage: Supports FR10 (per-day list) and FR11 (filters update list). citedocs/prd.md  
- Architecture: Keep data source consistent with booking storage; use deskId and office/floor keys aligned to desks.json. citedocs/architecture.md  
- Accessibility: rows keyboard-selectable; aria-live status for “highlighted desk”; maintain focus state.  

### Project Structure Notes

- Place component under `src/components/BookingList`; share state from filters/booking store; accept callbacks to floorplan highlight.  
- Keep list rendering pure; highlight handled by parent via props.  

### References

- docs/epics.md (Epic 2, Story 2.3)  
- docs/prd.md (FR10, FR11)  
- docs/architecture.md (deskId alignment, state consistency)

## Dev Agent Record

### Context Reference

- docs/sprint-artifacts/2-3-per-day-availability-list.context.xml

### Agent Model Used

OpenAI GPT-5 (Codex SM mode)

### Debug Log References

### Completion Notes List

### File List

- NEW: docs/sprint-artifacts/2-3-per-day-availability-list.md
- NEW: docs/sprint-artifacts/2-3-per-day-availability-list.context.xml

## Change Log

- 2025-12-03: Initial draft created from epics, PRD, architecture.
- 2025-12-03: Generated story context and marked ready-for-dev.
