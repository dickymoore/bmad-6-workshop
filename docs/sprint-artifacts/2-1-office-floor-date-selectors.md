# Story 2.1: Office/floor/date selectors

Status: ready-for-dev

## Story

As a user, I want to choose office, floor, and date so I can view relevant desks.

## Acceptance Criteria

1. Office and floor dropdowns populate from desks.json metadata (offices/floors); selected values drive current view. citedocs/epics.md  
2. Date picker is day-level only, defaults to today (local date, no timezone conversion). citedocs/epics.md  
3. Changing office, floor, or date immediately updates the floorplan view and per-day list state. citedocs/epics.mddocs/prd.md  

## Tasks / Subtasks

- [ ] Populate selectors (AC1)  
  - [ ] Parse offices/floors from desks.json metadata; handle missing/empty gracefully with notice.  
  - [ ] Set initial office/floor to first available entries; memoize lists for performance.  
- [ ] Date picker (AC2)  
  - [ ] Implement day-level picker defaulting to today; store as `YYYY-MM-DD` string; avoid TZ shifts.  
- [ ] Wire state -> views (AC3)  
  - [ ] On change, update shared state (store/context); trigger floorplan and list refresh.  
  - [ ] Ensure downstream selectors/listeners consume updated office/floor/date.  
- [ ] UX/accessibility (AC1–AC3)  
  - [ ] Add clear labels and keyboard navigation; role="status" update for selection confirmation.  
- [ ] Tests (AC1–AC3)  
  - [ ] Unit: offices/floors derived correctly from desks.json fixture.  
  - [ ] Component: date defaults to today; change events update state.  
  - [ ] Integration: filter change causes floorplan + list refresh mocks to fire.  

## Dev Notes

- Architecture: desks.json is the single source of truth for offices/floors; state should be shared so map/list react to selector changes. citedocs/architecture.md  
- PRD linkage: Supports FR1 (office/floor), FR2 (date), FR11 (filters refresh list), and sets up availability flows for Epic 2. citedocs/prd.md  
- Prereqs: Story 1.1 ensures data structure exists; Story 1.2 provides validated storage; story should consume state from those services where applicable. citedocs/epics.md  
- No timezone conversion—treat dates as local `YYYY-MM-DD` strings; store in state and persistence consistently.  
- Consider optional URL hash/state persistence later; keep interface for extension but do not block MVP.  

### Project Structure Notes

- Place selector component near FiltersBar; shared state via context/store (lightweight) consumed by FloorplanView and BookingList.  
- Keep desks.json reading in a reusable helper (e.g., `src/lib/desks/meta.ts`) to avoid duplicating parsing logic. citedocs/architecture.md  

### References

- docs/epics.md (Epic 2, Story 2.1 ACs and notes)  
- docs/prd.md (FR1, FR2, FR11 filter behaviors)  
- docs/architecture.md (desks.json as single source, state propagation)

## Dev Agent Record

### Context Reference

- docs/sprint-artifacts/2-1-office-floor-date-selectors.context.xml

### Agent Model Used

OpenAI GPT-5 (Codex SM mode)

### Debug Log References

### Completion Notes List

### File List

- NEW: docs/sprint-artifacts/2-1-office-floor-date-selectors.md
- NEW: docs/sprint-artifacts/2-1-office-floor-date-selectors.context.xml

## Change Log

- 2025-12-03: Initial draft created from epics, PRD, and architecture.
- 2025-12-03: Generated story context and marked ready-for-dev.
