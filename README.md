## Desk Booking App

# BMAD BMM Stage 4 - Development complete (correct-course exercise)

## App location (workshop note)
- Run the desk booking app from the repo root (Vite).
- `office-floorplans/` is the floorplan demo/asset source used by the app.

1. `npm install`
2. `npm run dev`
3. Open `http://localhost:5173`
4. Reproduce the issue called out in this stage.
5. Run Codex.
6. Load PM agent: `/bmad-agent-bmm-pm`.
7. Run change-management workflow: `/bmad-bmm-correct-course`.
8. Re-test and iterate until satisfied.
9. `git checkout workshop/desk-booking/80-mvp`

# Desk Booking App
Single-page React app for browsing office floorplans, booking desks, managing a per-day roster, and exporting/importing backups. Runs locally; all data lives in browser storage plus optional JSON snapshots on disk.

## Features
- Office/floor/date filters drive both the floorplan and per-day availability list.
- Floorplan view overlays clickable desk hotspots on PNGs; shows booked/free/selected counts with a legend and tooltips.
- Booking list with desk/user sort, quick highlight, and inline cancellation.
- Booking confirm + conflict rules: one booking per user per day; desk must belong to the selected office/floor; duplicate desk bookings rejected.
- Roster manager to add/edit/deactivate users.
- Backup export/import and validation.
- Feedback toasts for key actions.

## Requirements
- Node.js 22.x (`>=22 <23`)
- npm

## Getting Started
1) `npm install`
2) `npm run dev`
3) Open http://localhost:5173

## Tests
- Unit/component: `npm run test:unit`
- E2E: `npm run test:e2e`
