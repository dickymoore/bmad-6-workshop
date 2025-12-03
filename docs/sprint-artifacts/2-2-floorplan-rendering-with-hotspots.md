# Story 2.2: Floorplan rendering with hotspots

Status: ready-for-dev

## Story

As a user, I want to see the floorplan PNG with clickable desk hotspots so I can inspect desks.

## Acceptance Criteria

1. Floorplan PNG loads per selected office/floor; overlay renders hotspots positioned from desks.json coordinates. citedocs/epics.md  
2. Hotspots show deskId tooltip on hover/focus; keyboard focus ring visible; ARIA labels include deskId and status. citedocs/epics.md  
3. Legend displays Free/Booked/Selected colors matching design tokens and updates with state. citedocs/epics.md  
4. Rendering handles missing or invalid desk coordinates gracefully (logs and skips) without breaking the view. citedocs/architecture.md  

## Tasks / Subtasks

- [ ] Render floorplan image (AC1)  
  - [ ] Load PNG for current office/floor; fallback/error state if asset missing.  
  - [ ] Position hotspots via desks.json coordinates (e.g., percentage or px); handle out-of-bounds gracefully.  
- [ ] Hotspot accessibility (AC2)  
  - [ ] Add tooltip/label with deskId; keyboard focus styles; aria-label includes status/user when available.  
- [ ] Legend (AC3)  
  - [ ] Show Free/Booked/Selected colors; bind to booking state; ensure WCAG AA contrast.  
- [ ] Error handling (AC4)  
  - [ ] Validate coordinates; log and skip invalid entries; do not crash render.  
- [ ] Tests (AC1–AC4)  
  - [ ] Component: renders PNG and hotspots from fixture.  
  - [ ] Accessibility: keyboard focus & tooltip presence.  
  - [ ] Legend updates when state changes.  
  - [ ] Invalid coordinate skipped with warning, render still mounts.  

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

### Completion Notes List

### File List

- NEW: docs/sprint-artifacts/2-2-floorplan-rendering-with-hotspots.md
- NEW: docs/sprint-artifacts/2-2-floorplan-rendering-with-hotspots.context.xml

## Change Log

- 2025-12-03: Initial draft created from epics, PRD, architecture.
- 2025-12-03: Generated story context and marked ready-for-dev.
