# Floorplan Demo

This project renders interactive floorplans for multiple UK offices (London, Bristol, Manchester, Cardiff, Leeds, Glasgow) with desk banks and fixtures (meeting rooms, kitchens, restrooms, games, printers, planters, etc.). Screenshots are auto-generated for each office/floor.

## Project Structure
- `assets/floorplans/offices.json`: Source data for offices, floors, fixtures, and desks (normalized positions/sizes).
- `src/components/OfficeFloorPlan.tsx`: SVG renderer (desk/fixture rectangles, rotations, wrapped labels, hover titles).
- `src/pages/demo-floorplans.tsx`: Demo page with office/floor selectors and zone/fixture legends.
- `scripts/screenshot-all.js`: Playwright script to capture per-floor PNGs (uses `DEMO_PORT` env; defaults to 3000).
- `demo-*.png`: Generated screenshots for each office/floor (higher-res via `deviceScaleFactor`).

## Getting Started
```bash
npm install
npm run dev
# open http://localhost:3000/demo-floorplans
```

## Data Editing Tips
- Coordinates and sizes are normalized (0–1). Layouts currently render at 800x600 in the component; labels wrap to stay inside shapes.
- Keep desks from overlapping fixtures/boundaries; use small sizes (width ~0.06–0.07, height ~0.04–0.05).
- Zones control desk colors; fixtures can include an optional `color` override.

## Screenshots
Run the Playwright script (ensure a dev/start server is running on `DEMO_PORT` or 3000):
```bash
PORT=3001 npm run start -- --hostname 127.0.0.1 --port 3001 &
DEMO_PORT=3001 node scripts/screenshot-all.js
```
Images are saved as `demo-<OFFICE>-<floor>.png` in the repo root (currently 1920x1400 via `deviceScaleFactor: 1.5`).

## Notes
- Title tooltips are simple and single-line to avoid browser warnings.
- Labels for desks/fixtures wrap and shrink to stay within their shapes.
