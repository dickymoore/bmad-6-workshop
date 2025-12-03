# Story 2.4: Availability coloring

Status: ready-for-dev

## Story

As a user, I want to see booked vs free desks visually so I can choose an open desk.

## Acceptance Criteria

1. Booked desks render in booked color; free desks in free color; selected desk uses distinct state; colors match design tokens and pass contrast checks. citedocs/epics.md  
2. Legend reflects the same colors/states and stays in sync with the floorplan. citedocs/epics.md  
3. Color changes respond immediately to booking create/cancel operations and filter changes (office/floor/date). citedocs/prd.md  

## Tasks / Subtasks

- [ ] Define color tokens/states (AC1)  
  - [ ] Set tokens for free/booked/selected consistent with design system; ensure WCAG AA contrast.  
- [ ] Apply to hotspots and legend (AC1, AC2)  
  - [ ] Bind hotspot fill/stroke to booking state and selected desk; update legend accordingly.  
- [ ] State sync (AC3)  
  - [ ] Recompute availability on booking create/cancel and filter change; rerender overlay/legend.  
- [ ] Tests (AC1–AC3)  
  - [ ] Component: colors render per state; legend matches.  
  - [ ] Interaction: create/cancel mock updates colors immediately.  
  - [ ] Filter change recalculates availability.  

## Dev Notes

- Relies on booking data from storage (Stories 1.x) and filter state (Story 2.1); overlay from Story 2.2. citedocs/epics.md  
- PRD linkage: Supports FR5 (availability coloring) and reinforces FR6/FR7 via visual feedback. citedocs/prd.md  
- Architecture: Keep color tokens centralized (e.g., `src/styles/tokens.ts`); ensure deskId validation/availability uses desks.json. citedocs/architecture.md  
- Accessibility: Maintain contrast; provide text/tooltip labels for colorblind users where possible.  

### Project Structure Notes

- Tokens in `src/styles/tokens.ts` (or CSS variables); consumed by FloorplanView and Legend components.  
- Availability computation should live in shared helper to avoid duplication between map and list.  

### References

- docs/epics.md (Epic 2, Story 2.4)  
- docs/prd.md (FR5)  
- docs/architecture.md (design tokens, availability alignment)

## Dev Agent Record

### Context Reference

- docs/sprint-artifacts/2-4-availability-coloring.context.xml

### Agent Model Used

OpenAI GPT-5 (Codex SM mode)

### Debug Log References

### Completion Notes List

### File List

- NEW: docs/sprint-artifacts/2-4-availability-coloring.md
- NEW: docs/sprint-artifacts/2-4-availability-coloring.context.xml

## Change Log

- 2025-12-03: Initial draft created from epics, PRD, architecture.
- 2025-12-03: Generated story context and marked ready-for-dev.
