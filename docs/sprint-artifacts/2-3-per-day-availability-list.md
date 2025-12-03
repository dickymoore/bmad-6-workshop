# Story 2.3: Per-day availability list

Status: done

## Story

As a user, I want a per-day “who’s where” list so I can quickly see desk assignments.

## Acceptance Criteria

1. List shows user, deskId, office, and floor for the selected date; data comes from bookings filtered by office/floor/date. citedocs/epics.md  
2. Sorting by desk or user is available; defaults to desk sort. citedocs/epics.md  
3. Selecting a row highlights the corresponding desk on the floorplan (or displays details if highlight not implemented) without desync. citedocs/epics.md  

## Tasks / Subtasks

- [x] Build list component (AC1)  
  - [x] Derive data from current booking state filtered by office/floor/date.  
  - [x] Display columns: User, Desk, Office/Floor, Date.  
- [x] Sorting (AC2)  
  - [x] Implement sort toggle between desk and user; default desk.  
- [x] Row highlight/link (AC3)  
  - [x] On row select, trigger floorplan highlight; keep state in sync with floorplan selection.  
- [x] Empty/loading/error states  
  - [x] Friendly empty message; loading state; error surfaced via message.  
- [x] Tests (AC1–AC3)  
  - [x] Unit: filter logic for office/floor/date.  
  - [x] Component: sort behavior; row select triggers highlight callback.  
  - [x] Integration: selection state sync with floorplan highlight.  

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

- Built BookingList component sourced from localStorage bookings with filter context; columns user/desk/office/floor/date and sort toggle (desk default, user optional).
- Row selection highlights matching desk on floorplan via shared selectedDeskId state; aria-live announces highlight.
- Added empty/loading/error messaging; legend/floorplan selection remains synced.
- Tests added for filtering, sorting, selection callback, and empty state; all passing.

### Completion Notes List

- Tests run: `npm run test:unit` (pass).

### File List

- MOD: docs/sprint-artifacts/2-3-per-day-availability-list.md
- NEW: docs/sprint-artifacts/2-3-per-day-availability-list.context.xml
- NEW: src/components/BookingList/BookingList.tsx
- NEW: src/components/BookingList/index.ts
- MOD: src/App.tsx
- MOD: src/components/Floorplan/FloorplanView.tsx
- MOD: src/components/Floorplan/Legend.tsx
- MOD: src/index.css
- NEW: tests/component/BookingList.spec.tsx

## Change Log

- 2025-12-03: Initial draft created from epics, PRD, architecture.
- 2025-12-03: Generated story context and marked ready-for-dev.
- 2025-12-03: Implemented per-day availability list with sorting and floorplan highlight, plus tests; ready for review.
- 2025-12-03: Senior Developer Review (AI) completed; approved.

## Senior Developer Review (AI)

Reviewer: DICKY  
Date: 2025-12-03  
Outcome: Approve  

Summary: All ACs and completed tasks verified. BookingList filters bookings by office/floor/date, renders required columns, supports desk/user sort with desk default, and row selection stays in sync with floorplan highlight. Empty/loading/error states present. Tests cover filtering, sorting, selection, and empty-state; no gaps identified.

Key Findings:
- None.

Acceptance Criteria Coverage:
- AC1 List shows user/desk/office/floor for selected date from filtered bookings: IMPLEMENTED — filtering by office/floor/date and rendering columns. Evidence: src/components/BookingList/BookingList.tsx:43-99; tests/component/BookingList.spec.tsx:28-63.
- AC2 Sorting by desk (default) or user: IMPLEMENTED — sort state/toggle. Evidence: BookingList.tsx:49-57,118-144; tests/component/BookingList.spec.tsx:65-100.
- AC3 Row selection highlights desk on floorplan: IMPLEMENTED — row click triggers onSelectDesk; App wires selectedDeskId into FloorplanView selected state. Evidence: BookingList.tsx:59-114; src/App.tsx:41-51; src/components/Floorplan/FloorplanView.tsx:65-120.

Task Validation:
- Build list component and columns/filtering: VERIFIED — BookingList.tsx:43-99.
- Sorting toggle default desk: VERIFIED — BookingList.tsx:49-57,118-144.
- Row highlight/link sync: VERIFIED — BookingList.tsx:59-114; App.tsx:41-51.
- Empty/loading/error states: VERIFIED — BookingList.tsx:63-67.
- Tests for ACs: VERIFIED — tests/component/BookingList.spec.tsx:28-128.

Test Coverage and Gaps:
- Component tests cover filtering, sorting, selection, empty state. No additional gaps noted for stated ACs.

Architectural Alignment:
- Uses booking storage + filters; deskId/office/floor alignment preserved. No architecture violations found.

Security Notes:
- N/A (client-only state/list rendering).

Best-Practices and References:
- Maintains accessibility with column headers, aria-pressed rows, aria-live highlight text.

Action Items:
- None.
