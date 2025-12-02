# Brainstorming Session Results

author: Mary (facilitator)
user: DICKY
session_date: 2025-12-02
session_topic: "All aspects of the desk booking app, handled one by one"
stated_goals:
  - Broad exploration
  - Stay within constraints: local-only, ~20 users, day-level bookings, reuse floorplan PNGs + desk JSON
  - Exclude features that slow delivery (auth, multi-device, half-day slots, heavy extras)

## Technique Sessions

- **Mind Mapping** (structured)
  - Core: local-only, day-based desk reservations; ~20 fixed users; file persistence; reuse floorplan PNGs + desks JSON; no auth/multi-device/half-day.
  - Users: dropdown of ~20; possible “visitor” placeholder; admin maintains list.
  - Offices/Floors: selector; multiple floors per office; align with PNGs.
  - Desks: clickable hotspots from JSON; status per day; legend (free/booked).
  - Bookings: select office/floor/desk/date/user; enforce one booking per user/day; cancel/release; “who’s where today/by date.”
  - Data: bookings file (JSON/YAML); desks mapping JSON as source of truth; user roster file; backup/export; seed/demo data.
  - UX: floorplan view with availability overlay; date picker; user dropdown; per-day bookings list; last-updated indicator; refresh button; backup/export button; printable daily snapshot.
  - Constraints: fast delivery; exclude auth, multi-device, half-day slots; keep mapping in sync; immediate save on change.
  - Risks: data loss; stale view; mapping drift; outdated roster; future scaling.

- **SCAMPER** (structured, delivery-first)
  - Substitute: manual chat → single availability view; free-text desk choice → hotspots from JSON; generic storage → structured bookings file with immediate save.
  - Combine: PNG floorplans + desk mapping JSON + bookings file → one UI; per-day list + map → “who’s where” clarity; bookings + export for backup.
  - Adapt: constrain to day-level bookings; fixed ~20-user dropdown; local file persistence; reuse assets as-is.
  - Modify: enforce one booking per user/day; simplify UI controls (office/floor/date/user/desk + confirm); add backup/export button; add last-updated indicator.
  - Put to other uses: generate printable per-day seating snapshot from the same data.
  - Eliminate: auth, multi-device sync, half-day/time slots, complex approvals, heavy reporting.
  - Reverse: optional later — per-day list drives map highlight instead of map-first.

- **Question Storming** (deep) — unresolved questions/assumptions to close fast
  - Data & mapping: How to validate desk IDs against JSON? How to ensure PNG ↔ JSON alignment stays correct? Do we need a quick visual overlay to verify hotspots? Where to store backups (path/format)?
  - Bookings model: What fields in the bookings file (office, floor, deskId, date, userId, createdAt)? Do we need “released” timestamps? Do we log last-updated to show staleness?
  - Availability UX: How do we show booked vs free (color/legend/tooltip)? Do we need a per-day list always visible? How to refresh after change—auto or button?
  - Roster: Where to store the ~20 users? Allow “guest/visitor” placeholder? Do we need roles (probably no)?
  - Constraints enforcement: Do we hard-block multiple bookings per user/day? What message to show on conflict?
  - Backup/export: Format (JSON/YAML/CSV)? Do we auto-save on every change and expose a manual backup button? Do we need an import/restore action?
  - Seed/demo: Should we pre-seed sample bookings for a demo day? Should we pre-select a default office/floor/date?
  - Errors/failures: How to guard against manual file corruption? Should we validate schema on load and reset to empty with a warning if invalid?

## Convergent Phase

Immediate opportunities (quick wins)
- Show floorplan with clear availability overlay + legend (booked vs free) per selected date.
- Per-day bookings list (“who’s where today/by date”) alongside the map.
- One booking per user/day enforcement with a simple conflict message.
- Immediate save to a local bookings file on every change; add backup/export button and last-updated indicator.
- Validate desk IDs against desks JSON on load; warn/reset if invalid.

Future innovations (after MVP)
- Map-driven highlight from per-day list (click list → highlight desk).
- Printable per-day seating snapshot.
- Optional check-in toggle to release no-shows.

Moonshots
- Multi-device sync and auth.
- Half-day/time-slot bookings.

Key themes
- Availability clarity + conflict prevention.
- Single source of truth: desks JSON and bookings file with validation.
- Fast delivery: minimal UI controls; day-level only; fixed roster.

Insights / learnings
- Keep mapping JSON as the authoritative source; validate and align to PNGs.
- Persistence is critical: save on change, backup/export to avoid loss.
- UX must surface per-day status and conflicts immediately.

Priorities and steps
1) Availability clarity with map + per-day list
   - Steps: load PNG + desks JSON; render hotspots; color by availability for selected date; add legend; add per-day list with user/desk/date.
2) Conflict prevention and save/backup
   - Steps: enforce one booking per user/day; save to file on change; add backup/export; show last-updated; add simple schema validation on load.
3) Roster and controls
   - Steps: maintain ~20-user list file (plus optional visitor); dropdown; default office/floor/date; simple conflict message.

What worked
- Structured + constraint-focused techniques (Mind Mapping, SCAMPER) kept scope tight.

Areas to explore further
- Exact bookings file schema and validation rules; backup/import format; desk-to-PNG alignment check flow.

Follow-up techniques
- Six Thinking Hats (to stress test risks/benefits) and a quick Devil’s Advocate on data integrity.

Next session plan
- If needed, a short follow-up after schema draft; prep: propose concrete JSON schema and backup format.
