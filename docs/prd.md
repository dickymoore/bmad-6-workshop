# Product Requirements Document (PRD) — Desk Booking Application

**Date:** 2025-12-02  
**Author:** DICKY  
**Track:** BMad Method (greenfield)  
**Context:** Local-only SPA; file-based storage; reuse floorplan PNGs + desks.json; ~20 known users; day-level bookings; no auth/multi-device.

---

## 1. Vision & Differentiator
- Provide a single, reliable source of truth for “who sits where” each day across offices/floors using existing floorplan assets.
- Ultra-lightweight: no auth, no server DB; JSON files with write-through saves and backup/export.
- Clear availability overlay + per-day list; enforce one booking per user per day.

## 2. Success Criteria
- Zero conflicting bookings (one booking/user/day enforced in UI and data validation).
- Availability view accurately reflects persisted state after reload/restore.
- Backup/export/import roundtrip succeeds without data loss.
- Booking flow completable in under a few steps (office/floor/date/user/desk/confirm).

## 3. MVP Scope
### Core Features
- Office & floor selector; date picker; user dropdown (~20 users + visitor).
- Floorplan PNG render with clickable hotspots from desks.json; legend for free/booked.
- Per-day “who’s where” list showing user ↔ desk for the selected date.
- Booking creation/cancel: enforce one booking per user per day.
- Persistence: write-through JSON (`data/bookings.json`, `data/users.json`) plus `data/last-updated.json`.
- Backup/export to `data/backup/backup-YYYYMMDD-HHMMSS.json`; import with schema validation.
- Validation: deskId must exist in desks.json; drop/flag invalid records on load.

### Out of Scope (MVP)
- Authentication, multi-device sync, half-day/time-slot bookings, approvals, advanced reporting/analytics.

### Future Vision
- Click per-day list to highlight desk on map; printable per-day seating snapshot; optional check-in toggle; eventual multi-device + auth.

## 4. Target Users
- Primary: Employees/visitors (pre-listed ~20 users) booking a desk for a given day/office/floor.
- Secondary: Admin maintaining user roster and ensuring desk mappings align with PNGs.

## 5. Functional Requirements (FR)
Group A — Desk Selection & Booking  
- FR1: Users can select office and floor from predefined lists.  
- FR2: Users can select a date (day-level).  
- FR3: Users can choose a user identity from a dropdown (~20 users + visitor).  
- FR4: Users can view a floorplan PNG with desk hotspots sourced from desks.json.  
- FR5: Users can see desk availability (free/booked) via color/legend for the selected date.  
- FR6: Users can create a booking by clicking a desk hotspot and confirming with selected user/date.  
- FR7: Users can cancel/release an existing booking for the selected date/desk.  
- FR8: System enforces one active booking per user per day; conflicts are blocked with a clear message.  
- FR9: System validates deskId against desks.json before saving a booking.  

Group B — Views & Lists  
- FR10: Users can view a per-day “who’s where” list (user, desk, office/floor, date).  
- FR11: Users can filter/switch office/floor and see the list update accordingly.  

Group C — Data & Persistence  
- FR12: System saves bookings to `data/bookings.json` on every create/cancel action.  
- FR13: System saves/reads user roster from `data/users.json`.  
- FR14: System writes `data/last-updated.json` with latest save timestamp.  
- FR15: On startup, system loads bookings and users; invalid records (bad schema or missing deskIds) are skipped and flagged.  

Group D — Backup/Restore  
- FR16: Users can export current `users.json` + `bookings.json` to a timestamped file under `data/backup/`.  
- FR17: Users can import a backup file; system validates schema and replaces current data if valid, otherwise rejects with errors.  

Group E — Validation & Feedback  
- FR18: Users receive immediate confirmation/error messages for create/cancel/backup/import actions.  

## 6. Non-Functional Requirements (NFR)
- NFR1 Reliability: Write-through saves; import rejects invalid schema; deskId validation against desks.json; last-updated timestamp maintained.  
- NFR2 Usability: Booking flow ≤ a few clear steps; availability legend always visible; conflict messages explicit.  
- NFR3 Performance: Local SPA must render floorplan and update availability without noticeable lag on a single machine.  
- NFR4 Operability: Backup/export/import available from UI; backup files are human-readable JSON.  
- NFR5 Security/Privacy: No auth; runs locally; no external data transmission.  

## 7. Technical Preferences (from brief/research)
- Stack: React 19.2 + Vite 6 SPA on Node 22 LTS; file-based JSON persistence in `data/`.  
- Assets: Reuse existing floorplan PNGs and desks.json as the single source of truth for desk metadata.  
- Validation: Schema checks on load and import; deskId alignment with desks.json.  

## 8. Risks & Mitigations
- Data loss → write-through saves + easy backup/export/import.  
- Mapping drift → validate deskIds against desks.json; add optional overlay debug.  
- Version drift → pin Node 22.x / React ^19.2 / Vite ^6 and audit periodically.  

## 9. Supporting Materials
- Product Brief: docs/bmm-product-brief-Desk-Booking-Application-2025-12-02.md  
- Technical Research: docs/bmm-research-technical-2025-12-02.md  
- ADR: docs/adr/ADR-001-tech-stack.md  
- Brainstorm: docs/brainstorming-session-results-2025-12-02.md  

## 10. Summary
The PRD defines a minimal, reliable, local desk booking SPA that leverages existing floorplan assets, enforces one booking per user/day, and persists safely to JSON with backup/import. Next steps per workflow path: Architecture, then Epics/Stories (create-epics-and-stories); optional design if needed for UI details.

## Manual PRD Validation (2025-12-02)
- Scope aligned: FRs cover all MVP items (selectors, floorplan overlay, per-day list, booking rules, backup/import) and exclude out-of-scope items (auth, multi-device, half-day, approvals, reporting).
- Completeness: FRs map to every MVP feature; NFRs address reliability, usability, performance (local), operability, security (local-only).
- Consistency: Booking rule (one booking/user/day) stated in scope, FRs (FR8), and UI patterns; JSON persistence specified in FR12–FR17 and NFR1.
- Risks mirrored: data loss, mapping drift, version drift captured here and in brief/research.
- Traceability: Supporting docs linked (brief, research, ADR, brainstorm); technical prefs match ADR (React+Vite, JSON files, desks.json validation).
- Lean guardrails: keep scope minimal; two breakpoints; single theme; simple backup/import; optional debug overlay; no auth/multi-device/half-day.
