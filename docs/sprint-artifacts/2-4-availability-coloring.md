# Story 2.4: Availability coloring

Status: done

## Story

As a user, I want to see booked vs free desks visually so I can choose an open desk.

## Acceptance Criteria

1. Booked desks render in booked color; free desks in free color; selected desk uses distinct state; colors match design tokens and pass contrast checks. citedocs/epics.md  
2. Legend reflects the same colors/states and stays in sync with the floorplan. citedocs/epics.md  
3. Color changes respond immediately to booking create/cancel operations and filter changes (office/floor/date). citedocs/prd.md  

## Tasks / Subtasks

- [x] Define color tokens/states (AC1)  
  - [x] Set tokens for free/booked/selected consistent with design system; ensure WCAG AA contrast.  
- [x] Apply to hotspots and legend (AC1, AC2)  
  - [x] Bind hotspot fill/stroke to booking state and selected desk; update legend accordingly.  
- [x] State sync (AC3)  
  - [x] Recompute availability on booking create/cancel and filter change; rerender overlay/legend.  
- [x] Tests (AC1–AC3)  
  - [x] Component: colors render per state; legend matches.  
  - [x] Interaction: create/cancel mock updates colors immediately.  
  - [x] Filter change recalculates availability.  

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

- Centralized availability tokens (free/booked/selected) and hotspot fill opacities; wired into FloorplanView + Legend and CSS vars.
- Hotspots now reflect live booking + selection state with token colors; legend counts stay in sync with overlay.
- Booking changes and filter changes recompute availability immediately; added availability color tests.

### Completion Notes List

- Tests run: `npm run test:unit` (pass).

### File List

- MOD: docs/sprint-artifacts/2-4-availability-coloring.md
- NEW: docs/sprint-artifacts/2-4-availability-coloring.context.xml
- MOD: src/components/Floorplan/FloorplanView.tsx
- MOD: src/components/Floorplan/Legend.tsx
- MOD: src/index.css
- NEW: src/lib/style/tokens.ts
- NEW: tests/component/AvailabilityColors.spec.tsx

## Change Log

- 2025-12-03: Initial draft created from epics, PRD, architecture.
- 2025-12-03: Generated story context and marked ready-for-dev.
- 2025-12-03: Implemented availability coloring tokens, legend sync, and reactive updates with tests; ready for review.
- 2025-12-03: Senior Developer Review (AI) completed; approved.

## Senior Developer Review (AI)

Reviewer: DICKY  
Date: 2025-12-03  
Outcome: Approve  

Summary: Availability colors centralized via tokens and applied to hotspots/legend; booking and filter changes immediately reflect in overlay and legend counts. Tests cover color mapping and live updates. No issues found.

Key Findings:
- None.

Acceptance Criteria Coverage:
- AC1 Booked/free/selected colors from tokens with contrast: IMPLEMENTED — tokens defined; hotspot fill/border use tokens. Evidence: src/lib/style/tokens.ts:1-11; src/components/Floorplan/FloorplanView.tsx:26-36,170-178; src/index.css:93-109.
- AC2 Legend reflects same colors/states and stays in sync: IMPLEMENTED — legend uses token colors and live counts. Evidence: FloorplanView.tsx:122-130; src/components/Floorplan/Legend.tsx:9-21.
- AC3 Colors respond to booking create/cancel and filter changes: IMPLEMENTED — bookings subscribed via onBookingsChanged; deriveStatuses recomputed on filter/date; tests simulate booking change. Evidence: FloorplanView.tsx:100-120,65-84; tests/component/AvailabilityColors.spec.tsx:61-93.

Task Validation:
- Define tokens/states: VERIFIED — tokens.ts:1-11; index.css root vars lines 1-8.
- Apply to hotspots and legend: VERIFIED — FloorplanView.tsx:26-36,165-194; Legend.tsx:9-21; index.css:93-109,121-138.
- State sync on booking/filter change: VERIFIED — FloorplanView.tsx:100-120; tests/component/AvailabilityColors.spec.tsx:61-93.
- Tests AC1–AC3: VERIFIED — tests/component/AvailabilityColors.spec.tsx:30-94.

Test Coverage and Gaps:
- Component tests cover color mapping and dynamic updates; no gaps for stated ACs.

Architectural Alignment:
- Tokens centralized; uses desks.json-derived status; aligns with architecture guidance. No violations found.

Security Notes:
- N/A (client-only visuals).

Best-Practices and References:
- Uses shared token module and CSS vars; subscribes to booking changes instead of stale snapshots.

Action Items:
- None.
