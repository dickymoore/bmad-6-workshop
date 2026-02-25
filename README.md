## Desk Booking App

Single-page React app for browsing office floorplans, booking desks, managing a per-day roster, and exporting/importing backups. Runs locally; all data lives in browser storage plus optional JSON snapshots on disk.

## App location (workshop note)
- From this stage onward, run the app from the repo root (Vite).
- `office-floorplans/` is the floorplan demo/asset source used by the app.

## Features
- Office/floor/date filters drive both the floorplan and per-day availability list.
- Floorplan hotspots mapped from office metadata.
- Booking creation/cancellation with conflict rules.
- Roster management.
- Backup export/import.

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

## Validation and reviewer helpers
- `./scripts/audit-bmad-v6.sh --all`
- `./scripts/verify-bmad-v6.sh --all --show-failures`
- `./workshop-reviewer.sh --all`
- See `scripts/README.md` for command details.
