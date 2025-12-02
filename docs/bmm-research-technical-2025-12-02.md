# Technical Research – Desk Booking (Local, SPA)  
date: 2025-12-02  
author: Mary (Analyst)  
scope: client-side SPA with floorplan PNG + desks JSON; ~20 users; local-only file persistence; day-level bookings; no auth/multi-device.

## Technical Question
- Pick a lean frontend + runtime + persistence stack to ship fastest while keeping assets (PNGs + desks.json) as source of truth, using file-based storage (no SQL).

## Context
- Greenfield, single-machine, no server auth, day-level desk bookings, one booking per user/day, immediate save and backup/export.

## Functional Requirements
- Render floorplan PNG with clickable desk hotspots from desks.json.
- Create/cancel bookings: fields {office, floor, deskId, date, userId, createdAt, releasedAt?}.
- Enforce one booking per user per day; show “who’s where” per selected date.
- Persist locally; manual backup/export + import/restore.

## Non-Functional Requirements
- Very fast dev/build; hot reload.
- Zero infra; works offline/local.
- Clear availability UI; low risk of data loss (auto-save + backup).
- Version longevity ≥ 18 months without forced upgrades.

## Constraints
- Local-only; no auth/multi-device; day-level slots only.
- Fixed ~20 users; reuse existing PNGs + desks.json.
- Avoid heavy frameworks/SSR complexity.

## Technology Options (2025 landscape)
- React 19.2 + Vite 6 (SPA) on Node 22 LTS (fast dev/build, minimal config).
- Alternative: React 19.2 + Vite 6 on Node 20 LTS (slightly shorter support window).
- Alt frontends: SvelteKit 2 (adds routing/SSR overhead for this use); vanilla + Preact (lighter but weaker DX).
- Alt bundlers: Parcel 2 (slower cold starts), esbuild-only (minimal plugins).

## Deep Dive Profiles
### React 19.2 + Vite 6 + Node 22 LTS (recommended)
- React 19.2 adds modern hooks (Activity, useEffectEvent) and partial pre-rendering; good DX.
- Vite 6 keeps SPA simplicity and fast HMR; supports Node 18/20/22.
- Node 22 LTS: long runway (EOL 2027-04-30).
- Fit: fastest DX (vite dev), minimal config, modern React features; no SSR burden.

### React 19.2 + Vite 6 + Node 20 LTS
- EOL 2026-04-30; stable, slightly shorter runway.

### SvelteKit 2 + Vite 6 + Node 20/22
- Great DX, but routing/SSR defaults add overhead vs SPA; extra learning curve for team already React-based.

## Comparative Analysis (H/M/L vs needs)
Dimension | React19/Vite6/Node22 | React19/Vite6/Node20 | SvelteKit2
--------- | ------------------- | -------------------- | ----------
Time-to-ship | H | H | M
DX/HMR speed | H | H | H
Complexity | L | L | M
Longevity | H (to 2027-04-30) | M (to 2026-04-30) | H
Ecosystem/docs | H | H | M
Mapping assets integration | H | H | H

## Decision Priorities (weight)
1) Time-to-ship / simplicity  
2) Stability & support window  
3) Ecosystem/plugins for mapping & build  
4) Minimal config/ops

## Recommendation
- **Adopt React 19.2 + Vite 6 SPA on Node 22 LTS.** Highest speed + longest support; SPA-simple; aligns with desks.json + PNG workflow; keeps upgrades minimal.
- If environment lacks Node 22, fallback to Node 20 LTS; plan upgrade before 2026-04-30.

## Implementation Notes
- Tooling: pnpm or npm; Vite react-ts template.
- Persistence: JSON files in `data/` (e.g., `bookings.json`, `users.json`); write-through on every change; export/import uses the same JSON format.
- Data validation: on load, validate deskIds against desks.json; drop/flag mismatches.
- UI: office/floor selector, date picker, user dropdown, floorplan overlay with legend, per-day list, last-updated; backup/export buttons.
- File schemas:
  - users.json: `{ id, name, active }` (~20 users; allow `visitor`).
  - bookings.json: `{ id, office, floor, deskId, date: YYYY-MM-DD, userId, createdAt, releasedAt? }`.
- Rules: one booking per user per day; deskId must exist in desks.json; save on every change; keep `data/last-updated.json` with `updatedAt`.
- Backup/export: copy users.json + bookings.json to `data/backup/backup-YYYYMMDD-HHMMSS.json`; import replaces after schema check.

## Risks & Mitigations
- Data loss: write-through saves + daily JSON export.
- Mapping drift: validation step; optional overlay debug mode.
- Version drift: pin Node 22.x, Vite ^6, React ^19.2; add `npm audit --production` in preflight script.
- Corrupt import: schema-validate backups before replace; reject invalid.

## ADR (draft)
- **Decision:** React 19.2 + Vite 6 SPA; Node 22 LTS runtime; JSON file persistence in `data/` (no SQL).
- **Drivers:** fastest delivery, zero infra, long support window, strong ecosystem, simplest persistence.
- **Alternatives:** same stack on Node 20 (shorter support); SvelteKit 2 (more moving parts).
- **Consequences:** SPA only (no SSR); must ensure safe file writes; plan Node upgrade cadence before 2027.

## Next Steps
1) Scaffold Vite React app targeting Node 22; add floorplan overlay + desks.json loader.
2) Define SQLite schema and JSON export/import utility.
3) Wire booking rules (one booking/user/day) + availability legend + per-day list.
4) Add backup/export + last-updated indicator.
5) Create ADR file in `docs/adr/ADR-001-tech-stack.md`.
