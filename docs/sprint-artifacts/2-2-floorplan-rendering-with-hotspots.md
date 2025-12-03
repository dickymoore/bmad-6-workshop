# Story 2.2: Floorplan rendering with hotspots

Status: done

## Story

As a user, I want to see the floorplan PNG with clickable desk hotspots so I can inspect desks.

## Acceptance Criteria

1. Floorplan PNG loads per selected office/floor; overlay renders hotspots positioned from desks.json coordinates. citedocs/epics.md  
2. Hotspots show deskId tooltip on hover/focus; keyboard focus ring visible; ARIA labels include deskId and status. citedocs/epics.md  
3. Legend displays Free/Booked/Selected colors matching design tokens and updates with state. citedocs/epics.md  
4. Rendering handles missing or invalid desk coordinates gracefully (logs and skips) without breaking the view. citedocs/architecture.md  

## Tasks / Subtasks

- [x] Render floorplan image (AC1)  
  - [x] Load PNG for current office/floor; fallback/error state if asset missing.  
  - [x] Position hotspots via desks.json coordinates (e.g., percentage or px); handle out-of-bounds gracefully.  
- [x] Hotspot accessibility (AC2)  
  - [x] Add tooltip/label with deskId; keyboard focus styles; aria-label includes status/user when available.  
- [x] Legend (AC3)  
  - [x] Show Free/Booked/Selected colors; bind to booking state; ensure WCAG AA contrast.  
- [x] Error handling (AC4)  
  - [x] Validate coordinates; log and skip invalid entries; do not crash render.  
- [x] Tests (AC1–AC4)  
  - [x] Component: renders PNG and hotspots from fixture.  
  - [x] Accessibility: keyboard focus & tooltip presence.  
  - [x] Legend updates when state changes.  
  - [x] Invalid coordinate skipped with warning, render still mounts.  

## Dev Notes

- Depends on Story 2.1 filter state and Story 1.2/1.5 validation (deskId alignment with desks.json). citedocs/epics.md  
- Architecture: desks.json and PNGs are authoritative; ensure overlay uses same IDs used by booking validation. citedocs/architecture.md  
- PRD linkage: Supports FR4 (floorplan view), FR5 (availability colors), FR10/FR11 (per-day list sync relies on same state). citedocs/prd.md  
- Keep rendering lightweight (no heavy pan/zoom); overlay via SVG over image; consider pointer + keyboard parity.  
- Colors: use design tokens; ensure legend and hotspots respect contrast; selected state distinct.  

### Project Structure Notes

- Implement in `src/components/FloorplanView`; reuse shared filter state; read desk meta via helper.  
- Keep asset loading paths relative (`/assets/floorplans/{office}-{floor}.png}`); document expected naming.  

### References

- docs/epics.md (Epic 2, Story 2.2)  
- docs/prd.md (FR4, FR5, FR10, FR11)  
- docs/architecture.md (desk mapping, assets, validation alignment)

## Dev Agent Record

### Context Reference

- docs/sprint-artifacts/2-2-floorplan-rendering-with-hotspots.context.xml

### Agent Model Used

OpenAI GPT-5 (Codex SM mode)

### Debug Log References

- Plan: add bookings-aware hotspot statuses (free/booked/selected), aria labels with user, and legend counts bound to state.
- Add image error fallback + logging; validate desk coords with warnings and skip invalid entries.
- Expand tests for tooltip/accessibility, legend updates, and invalid coordinate handling under localStorage persistence.

### Completion Notes List

- Implemented bookings-aware hotspot overlay with ARIA labels that include status/user, tooltip parity, and hover/focus selection color.
- Added floorplan asset error fallback, desk coordinate validation with warnings, and legend counts bound to live booking state (localStorage-backed).
- Updated component tests to cover booking state, legend updates, and invalid coordinate handling.
- Tests run: `npm run test:unit` (pass).

### Completion Notes List

### File List

- MOD: docs/sprint-artifacts/2-2-floorplan-rendering-with-hotspots.md
- NEW: docs/sprint-artifacts/2-2-floorplan-rendering-with-hotspots.context.xml
- MOD: src/components/Floorplan/FloorplanView.tsx
- MOD: src/components/Floorplan/Legend.tsx
- MOD: src/index.css
- MOD: tests/component/FloorplanView.spec.tsx

## Change Log

- 2025-12-03: Initial draft created from epics, PRD, architecture.
- 2025-12-03: Generated story context and marked ready-for-dev.
- 2025-12-03: Implemented floorplan hotspots with booking status, legend binding, error handling, and tests; ready for review.
- 2025-12-03: Senior Developer Review (AI) completed; approved.

## Senior Developer Review (AI)

Reviewer: DICKY  
Date: 2025-12-03  
Outcome: Approve  

Summary: All ACs and completed tasks verified. Floorplan renders PNG with validated hotspots, booking-aware statuses, accessible labels/tooltips, legend bound to live state, and graceful handling of missing assets/invalid coords. Tests cover bookings, legend, and invalid coordinate handling; no regressions observed.

Key Findings:
- None (no blocking or advisory issues found).

Acceptance Criteria Coverage:
- AC1 (Floorplan loads with hotspots from desks.json): IMPLEMENTED — image src built per office/floor with onError fallback; hotspots positioned via normalized coords; desk validation applied. Evidence: src/components/Floorplan/FloorplanView.tsx:132-194.
- AC2 (Tooltips, focus, ARIA labels include deskId/status): IMPLEMENTED — aria-label reflects status/user; Radix tooltip shows same label; focus-visible outline present. Evidence: FloorplanView.tsx:138-199; src/index.css:93-119.
- AC3 (Legend colors synced to state): IMPLEMENTED — counts derived from desk statuses and rendered with token colors. Evidence: FloorplanView.tsx:122-130,26-36; src/components/Floorplan/Legend.tsx:9-21; src/lib/style/tokens.ts.
- AC4 (Invalid/missing coords handled gracefully): IMPLEMENTED — coords validated/bounded, warnings logged, fallback overlay on missing image; tests cover skip behavior. Evidence: FloorplanView.tsx:38-63,111-164; tests/component/FloorplanView.spec.tsx:64-77.

Task Validation:
- Render floorplan image + fallback: VERIFIED — FloorplanView.tsx:132-164.
- Position hotspots via desks.json with bounds check: VERIFIED — FloorplanView.tsx:38-63,165-194.
- Hotspot accessibility labels/tooltips/focus: VERIFIED — FloorplanView.tsx:138-199; src/index.css:93-119.
- Legend free/booked/selected bound to state and tokens: VERIFIED — FloorplanView.tsx:122-130; Legend.tsx:9-21; tokens.ts; index.css:121-138.
- Error handling for invalid coords: VERIFIED — FloorplanView.tsx:38-63; warning emission 111-113; test coverage tests/component/FloorplanView.spec.tsx:64-77.
- Tests for AC1–AC4: VERIFIED — tests/component/FloorplanView.spec.tsx:28-77 (image/hotspots, booked state, invalid coords).

Test Coverage and Gaps:
- Unit/component tests cover bookings status coloring, legend counts, invalid coord skip. No gaps noted for stated ACs.

Architectural Alignment:
- Uses desks.json as source of truth and localStorage state; colors via tokens; aligns with architecture doc requirements.

Security Notes:
- N/A (client-only rendering; no new attack surface).

Best-Practices and References:
- Booking state wired through storage listeners; warns instead of throwing on bad data; accessible labels maintained.

Action Items:
- None.
