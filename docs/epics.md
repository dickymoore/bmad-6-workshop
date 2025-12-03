# Epics and Stories — Desk Booking Application  
Date: 2025-12-02  
Author: DICKY  
Context: Local-only React+Vite SPA, JSON persistence, floorplan PNG + desks.json, ~20 users, day-level bookings, no auth/multi-device.

## FR Inventory (from PRD)
- FR1: Users can select office and floor from predefined lists.  
- FR2: Users can select a date (day-level).  
- FR3: Users can choose a user identity from a dropdown (~20 users + visitor).  
- FR4: Users can view a floorplan PNG with desk hotspots sourced from desks.json.  
- FR5: Users can see desk availability (free/booked) via color/legend for the selected date.  
- FR6: Users can create a booking by clicking a desk hotspot and confirming with selected user/date.  
- FR7: Users can cancel/release an existing booking for the selected date/desk.  
- FR8: System enforces one active booking per user per day; conflicts are blocked with a clear message.  
- FR9: System validates deskId against desks.json before saving a booking.  
- FR10: Users can view a per-day “who’s where” list (user, desk, office/floor, date).  
- FR11: Users can filter/switch office/floor and see the list update accordingly.  
- FR12: System saves bookings to `data/bookings.json` on every create/cancel action.  
- FR13: System saves/reads user roster from `data/users.json`.  
- FR14: System writes `data/last-updated.json` with latest save timestamp.  
- FR15: On startup, system loads bookings and users; invalid records (bad schema or missing deskIds) are skipped and flagged.  
- FR16: Users can export current `users.json` + `bookings.json` to a timestamped file under `data/backup/`.  
- FR17: Users can import a backup file; system validates schema and replaces current data if valid, otherwise rejects with errors.  
- FR18: Users receive immediate confirmation/error messages for create/cancel/backup/import actions.  

---

## Epic 1: Foundation & Persistence
Goal: Set up the project scaffold, local JSON persistence, validation, and last-updated tracking to support all other epics.
FR coverage: FR12, FR13, FR14, FR15, FR18 (cross-cutting), enables all others.

Story 1.1: Project scaffold and data directories  
- As a developer, I want the repo to be initialized with the agreed stack and data folders so that the app can run locally with predictable structure.  
- Acceptance Criteria  
  - Given a fresh clone, when I run `npm install` then `npm run dev`, the app starts without errors.  
  - Data folder exists with `users.json`, `bookings.json`, `last-updated.json`, `backup/`.  
  - `.gitignore` excludes backups and build artifacts.  
  - Dependencies match architecture.md (React 19.2, Vite 6.x, Radix, TypeScript).  
- Prerequisites: none  
- Technical notes: add minimal config; keep Tailwind optional; ensure Node 22 compatibility.

Story 1.2: JSON storage service with schema validation  
- As a developer, I want a storage module that reads/writes JSON with schema validation so that corrupted data doesn’t break the app.  
- Acceptance Criteria  
  - Given valid JSON files, when the app loads, data is parsed into memory without errors.  
  - Given invalid records (missing required fields or unknown deskId), they are skipped and logged; app still loads.  
  - On every write, files are saved atomically and update `last-updated.json` with ISO timestamp.  
- Prerequisites: Story 1.1  
- Technical notes: simple zod/ajv schema; synchronous write-through acceptable.

Story 1.3: Last-updated service hook  
- As a user, I want to see when data was last saved so I trust the state I’m viewing.  
- Acceptance Criteria  
  - Last-updated timestamp displays near filters.  
  - After any booking create/cancel/import, timestamp updates immediately.  
- Prerequisites: Story 1.2  
- Technical notes: reuse storage module; store ISO string.

Story 1.4: Roster load/save  
- As an admin, I want the app to load and persist the ~20-user roster so I can pick users when booking.  
- Acceptance Criteria  
  - Roster loads from `users.json` on start.  
  - If file missing/empty, app seeds with an empty array and shows a notice.  
  - Changes to roster (if UI present later) save via storage module.  
- Prerequisites: Story 1.2  
- Technical notes: initial roster can be static for MVP; editing optional later.

---

## Epic 2: Availability View & Navigation
Goal: Let users browse offices/floors/dates and see availability on the floorplan with a per-day list.
FR coverage: FR1, FR2, FR4, FR5, FR10, FR11, FR18 (messages).

Story 2.1: Office/floor/date selectors  
- As a user, I want to choose office, floor, and date so I can view relevant desks.  
- Acceptance Criteria  
  - Dropdowns for office and floor populated from desks.json metadata.  
  - Date picker limited to day-level; defaults to today.  
  - Changing any filter updates view and list.  
- Prerequisites: Story 1.1  
- Technical notes: keep state in URL hash optional; no timezone conversion (use local date).

Story 2.2: Floorplan rendering with hotspots  
- As a user, I want to see the floorplan PNG with clickable desk hotspots so I can inspect desks.  
- Acceptance Criteria  
  - PNG loads per office/floor; hotspots overlay show deskId tooltip on hover/focus.  
  - Legend shows Free/Booked/Selected colors.  
  - Hotspots keyboard-focusable with visible ring.  
- Prerequisites: Story 2.1, Story 1.2 (validation ensures deskIds exist)  
- Technical notes: SVG overlay over image; simple pan/zoom optional later.

Story 2.3: Per-day availability list  
- As a user, I want a per-day “who’s where” list so I can quickly see desk assignments.  
- Acceptance Criteria  
  - List shows user, deskId, office/floor for selected date.  
  - Sorting by desk or user is available.  
  - Selecting a row highlights the corresponding desk (optional post-MVP; at minimum, shows details).  
- Prerequisites: Story 2.1, 2.2  
- Technical notes: reuse booking data; consider hover highlight later.

Story 2.4: Availability coloring  
- As a user, I want to see booked vs free desks visually so I can choose an open desk.  
- Acceptance Criteria  
  - Booked desks render in booked color; free desks in free color; selected desk state distinct.  
  - Colors match design tokens and pass contrast checks.  
- Prerequisites: Story 2.2  

---

## Epic 3: Booking Actions & Rules
Goal: Enable creating and cancelling bookings with conflict prevention and validation.
FR coverage: FR3, FR6, FR7, FR8, FR9, FR18; uses FR12–15 services.

Story 3.1: Select user for booking  
- As a user, I want to pick myself (or a visitor) from a dropdown so the booking is attributed.  
- Acceptance Criteria  
  - User dropdown shows roster from storage.  
  - Visitor option available.  
- Prerequisites: Story 1.4  

Story 3.2: Create booking with confirmation  
- As a user, I want to click a free desk and confirm booking for the selected date so my seat is reserved.  
- Acceptance Criteria  
  - Clicking free desk opens confirm card/modal showing user, desk, date.  
  - On confirm, booking is saved, view/list update, success toast shown.  
  - Booking id generated (UUID).  
- Prerequisites: Stories 2.2, 2.4, 3.1, 1.2  
- Technical notes: write-through save; update last-updated; optimistic UI allowed.

Story 3.3: Enforce one booking per user/day  
- As the system, I must block conflicts so a user cannot hold multiple desks on the same day.  
- Acceptance Criteria  
  - If user already has a booking on selected date, confirm is blocked with clear message.  
  - Validation occurs both client-side pre-write and during write.  
  - No duplicate bookings written to file.  
- Prerequisites: Story 3.2  
- Technical notes: check by userId + date; consider visitor as unique id (e.g., visitor-uuid).

Story 3.4: Cancel/release booking  
- As a user, I want to release my booking so the desk becomes free.  
- Acceptance Criteria  
  - From list or map, user can cancel a booking; confirmation required.  
  - On cancel, booking removed or marked released; availability and list update; success toast.  
- Prerequisites: Story 3.2  
- Technical notes: remove entry or set releasedAt; keep history optional.

Story 3.5: Desk validation  
- As the system, I want to ensure deskIds are valid before save so data stays consistent.  
- Acceptance Criteria  
  - Attempt to book a non-existent desk is rejected with error toast.  
  - Validation uses desks.json metadata.  
- Prerequisites: Story 3.2, 1.2  

---

## Epic 4: Data Safety & Admin
Goal: Protect data via backup/import and clear feedback; ensure messages and roster persistence.
FR coverage: FR16, FR17, FR18 (plus roster persistence FR13).

Story 4.1: Backup/export snapshot  
- As a user, I want to export users/bookings to a timestamped JSON so I can back up state.  
- Acceptance Criteria  
  - Export button writes `data/backup/backup-YYYYMMDD-HHMMSS.json` containing users, bookings, lastUpdated.  
  - Success toast shows path.  
- Prerequisites: Story 1.2  

Story 4.2: Import/restore with validation  
- As a user, I want to import a backup safely so I don’t corrupt data.  
- Acceptance Criteria  
  - Import flow validates schema; on success, replaces current data and reloads view.  
  - On invalid file, import is rejected with error message and no state change.  
  - last-updated refreshed on success.  
- Prerequisites: Story 4.1, 1.2  

Story 4.3: Toasts and inline feedback  
- As a user, I want clear success/error messages for all actions so I know what happened.  
- Acceptance Criteria  
  - All create/cancel/export/import actions show toasts; errors also inline near the trigger.  
  - Messages match UX spec tone; accessible (role="status").  
- Prerequisites: Stories 3.2–3.5, 4.1–4.2 (hooks into actions)  

Story 4.4 (optional later): Roster edit UI  
- As an admin, I want to edit the user list so I can keep the roster current.  
- Acceptance Criteria  
  - Add/edit/deactivate users; saves to users.json; validation prevents empty names/dupes.  
  - Changes propagate to dropdown immediately.  
- Prerequisites: Story 1.4  
- Note: Optional; only if needed.

---

## FR Coverage Matrix (epics → FRs)
- Epic 1: FR12, FR13, FR14, FR15, FR18  
- Epic 2: FR1, FR2, FR4, FR5, FR10, FR11, FR18  
- Epic 3: FR3, FR6, FR7, FR8, FR9, FR18  
- Epic 4: FR16, FR17, FR18 (and FR13 via persistence)  

All FR1–FR18 are covered.

## Acceptance Criteria Style
- BDD (Given / When / Then) applied per story; detailed AC captured in this document for each story above.

## Notes on Scope Control
- No auth, no multi-device sync, no half-day slots, no reporting.  
- Two breakpoints only; single theme; no complex animations.  
- File-based storage only; no DB.  
- Optional features clearly marked (highlight from list, roster edit).

