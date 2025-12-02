# UX Design Specification — Desk Booking Application
Date: 2025-12-02
Author: DICKY
Context: Local-only React+Vite SPA; JSON persistence; floorplan PNG + desks.json; ~20 users; day-level booking; no auth/multi-device.

## Project & Users
- Vision: Clear, reliable “who sits where today” with minimal steps.
- Users: Pre-listed ~20 employees/visitors; admin maintains roster.
- Core experience: Pick office/floor/date → see availability on floorplan → select user → click desk → confirm → per-day list updates.
- Desired feeling: Confident and fast; low-friction.

## Platform
- Web (desktop-first), responsive to tablet/mobile.

## Design System Choice
- Radix UI primitives + custom lightweight styling (CSS modules/Tailwind optional) to stay minimal and accessible; no heavy component kit.
- Typography: Inter/Geist-like sans (system fallback ok). Border radius: 8px. Spacing scale: 4/8/12/16/24.

## Visual Foundation
- Theme: Calm clarity.
  - Primary: #2563eb (actions)
  - Accent: #22c55e (success)
  - Warning: #f59e0b; Error: #ef4444; Info: #0ea5e9
  - Background: #0f172a on header; surface: #0b1220; cards: #111827; text: #e5e7eb; muted: #94a3b8
  - Legend: Free = #22c55e20 outline #22c55e; Booked = #ef444420 outline #ef4444; Selected = #2563eb33 outline #2563eb

## Key Screens
1) **Booking Board** (default)
   - Top bar: project title, last-updated, backup/export buttons.
   - Left rail (desktop): filters — office select, floor select, date picker, user dropdown, legend.
   - Main: floorplan canvas (PNG) with clickable hotspots; hover tooltip shows desk id/status/user; click opens inline confirm.
   - Right panel: per-day “who’s where” list (user, desk, office/floor) with cancel button.

2) **Backup/Import Modal**
   - Export: writes timestamped backup JSON; shows path.
   - Import: file picker; schema validation result; confirm replace.

3) **Roster Manager (simple modal/section)**
   - List users; add/edit name; toggle active; visitor placeholder note.

## Layout & Responsiveness
- Desktop ≥1200px: Two-column (floorplan 65%, list 35%); filters in a left rail.
- Tablet 768–1199px: Stack filters above; floorplan full width; list below; legend inline.
- Mobile <768px: Top filters condensed; floorplan full width; list in collapsible bottom sheet; FAB for backup/export.

## Core Interaction Patterns
- Buttons: Primary (solid primary), Secondary (outline), Destructive (error), Ghost (text). One primary per view.
- Feedback: Success/info via top-right toast; errors inline near trigger + toast; loading spinners on actions.
- Forms: Labels above; required marked *; validate on submit + onBlur for required fields; inline error text.
- Modals: ESC/overlay close; focus trap; primary action right; cancel left.
- Navigation: Single-page; no deep routing needed; anchor links for sections.
- Empty states: Friendly message + CTA (e.g., “No bookings for this date. Pick a user and click a desk.”)
- Confirmation: Cancel booking asks confirm; Import asks confirm after validation.

## Components
- FloorplanView: renders PNG; overlays desk hotspots; states free/booked/selected/hover; tooltip with desk id/user.
- DeskLegend: swatches for Free/Booked/Selected; accessibility text.
- FiltersBar: office select, floor select, date picker, user dropdown; last-updated display.
- BookingList: per-day list with user, desk, office/floor, cancel action; sortable by desk/user.
- BookingConfirm: inline card/modal after desk click; shows selected user/date/desk; Confirm/Cancel.
- BackupControls: export/import buttons; status messages; file input.
- RosterManager (optional later): modal to edit users list.

## User Journeys (high level)
- Book a desk: choose office/floor/date/user → click free desk → confirm → list updates; toast success; last-updated refreshed.
- Cancel a booking: locate in list or on map (booked desk) → cancel → confirm → availability updates.
- Backup: click Export → toast with file path.
- Import: click Import → pick file → validate → confirm replace → reload state.

## UX Pattern Decisions
- Tooltip on hover for desks; click = select. On touch, tap toggles select; second tap confirms via inline card.
- Conflict handling: if desk booked, tooltip shows user; click shows message “Desk booked by {user}.”
- Errors: inline red text + toast; never silent fail.
- Last-updated visible near filters; updates after every save/import.

## Responsive & Accessibility
- Breakpoints: 768px, 1200px. Floorplan zoom/pan enabled; maintain 44px min touch targets on mobile.
- Accessibility: WCAG 2.1 AA targets; keyboard: tab through hotspots (focus ring), Enter to select/confirm; ARIA labels on desks (desk id + status + user); toasts announced with role="status"; color contrast ≥ 4.5:1.

## Design System Use
- Radix primitives: Dialog (modals), Toast, Tooltip, Select, HoverCard; styled with custom tokens above.
- Custom: Floorplan overlay, DeskLegend swatches, BookingList table.

## Open Items
- Decide final typeface (system vs bundled). Default to system for speed.
- Optional: Add “highlight from list” interaction (list item hover highlights desk) post-MVP.
- Optional: Debug overlay to visualize hotspot boxes for alignment QA.

## Handoff Notes
- Provide desks.json structure to frontend; ensure IDs match overlay rectangles.
- Persist files under `data/`; create `data/backup/` at app start if missing.

