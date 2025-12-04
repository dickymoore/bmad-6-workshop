# Desk Booking App

Single-page React app for browsing office floorplans, booking desks, managing a per-day roster, and exporting/importing backups. Runs locally; all data lives in browser storage plus optional JSON snapshots on disk.

## Features
- Office/floor/date filters drive both the floorplan and per-day availability list.
- Floorplan view overlays clickable desk hotspots on PNGs; shows booked/free/selected counts with a legend and tooltips.
- Booking list with desk/user sort, quick highlight, and inline cancellation.
- Booking confirm + conflict rules: one booking per user per day; desk must belong to the selected office/floor; duplicate desk bookings rejected.
- Roster manager to add/edit/deactivate users (writes to local storage and updates the booking dropdown).
- Backup/export writes users/bookings/last-updated to `data/backup/backup-YYYYMMDD-HHMMSS.json`; import validates schema and rolls back on failure.
- Feedback toasts for all critical actions; “Last updated” badge fed by storage writes/imports.

## Requirements
- Node.js 22.x (package.json pins `>=22 <23`).
- npm (ships with Node).
- React 19.2, Vite 6.2.x, Radix UI 1.2.x are already pinned; no additional services needed.

## Getting Started
1) Install dependencies  
`npm install`

2) Run the dev server (Vite default port 5173)  
`npm run dev`

3) Open the app  
http://localhost:5173

4) Build for production (outputs to `dist/`)  
`npm run build`

5) Preview the production build  
`npm run preview`

## Data & Persistence
- Primary store: browser `localStorage` keys  
  - `desk-booking:users` — roster  
  - `desk-booking:bookings` — desk reservations  
  - `desk-booking:last-updated` — ISO timestamp touched on every write/import
- Seed files under `data/` exist for reference/tests:  
  - `data/users.json` (example roster), `data/bookings.json` (empty), `data/last-updated.json`.
- Clearing the browser storage will reset the app; backups can restore state.

## Floorplans & Desk Metadata
- Office/floor/desk geometry comes from `office-floorplans/assets/floorplans/offices.json`.
- PNG assets are auto-synced on `npm run dev` / `npm run build` via `scripts/sync-floorplans.js`. Source files are read from `office-floorplans/demo-<CODE>-<floorId>.png` (or matching files in `office-floorplans/assets/floorplans/`) and copied to `public/assets/floorplans/<officeId>-<floorId>.png` so the app can serve them at `/assets/floorplans/...`.
- If you add a new office/floor, place the PNG under `office-floorplans/` using the demo naming pattern, then run `npm run sync:floorplans` (auto-runs on dev/build). The script fails if any office/floor listed in `offices.json` is missing a PNG.
- Desk validation uses `offices.json` to ensure a desk belongs to the selected office/floor.

## Booking Rules (enforced client-side)
- One booking per user per calendar day.
- A desk cannot be double-booked for the same office/floor/date.
- Desk IDs must exist in `offices.json` and match the current office/floor.
- Cancellation removes the booking and updates “Last updated”.

## Backup & Restore
- Export: `Export backup` button writes a timestamped JSON to `data/backup/` (created if missing) and stores the path in `localStorage`.
- Import: `Import backup` reads a selected JSON file, validates users/bookings/lastUpdated against the schema, writes to storage, and rolls back if any step fails. Validation errors surface inline and via toast.
- Backups include `{ users, bookings, lastUpdated, schemaVersion? }`.

## Roster Management
- Add/edit/deactivate users from the “Manage users” panel; duplicate/empty names are blocked.
- Changes immediately update the booking dropdown and are persisted to `localStorage`.
- “Visitor” is always available as a selectable user in addition to the roster.

## Tests
- Unit & component (Vitest + Playwright CT): `npm run test:unit`
- End-to-end (Playwright):  
  - All: `npm run test:e2e`  
  - Smoke/tagged: `npm run test:e2e:smoke`, `npm run test:e2e:p0`, `npm run test:e2e:p1`  
  - Headed UI: `npm run test:e2e:ui`  
  - HTML report: `npm run test:e2e:report`
- E2E specs that hit the live app are gated by `E2E_RUN=1` and expect the dev server on `BASE_URL` (defaults to `http://localhost:3000` in tests). See `tests/README.md` for selectors and env knobs.

## Project Structure (high level)
- `src/` — React app (filters, floorplan overlay, booking list, roster manager, backup controls, feedback toasts).
- `src/lib/storage/` — `localStorage` read/write, schema validation, backup/export/import, desk validation.
- `office-floorplans/` — source JSON + tooling for floorplan metadata/PNGs.
- `data/` — seed JSON + `backup/` destination (gitignored).
- `docs/` — architecture, PRD, UX, and sprint artifacts.

## Operational Notes
- Runs entirely locally; no backend or network calls.
- `.gitignore` already excludes `dist/`, `node_modules`, and `data/backup/*`.
- If backup export fails with permission errors, check write access to `data/backup/`.
- Missing floorplan images will not break booking flows; a warning and placeholder are shown.
