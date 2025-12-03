# Architecture — Desk Booking Application  
Date: 2025-12-02  
Author: DICKY  
Context: Local-only React + Vite SPA; JSON file persistence; floorplan PNG + desks.json; ~20 users; day-level bookings; no auth/multi-device; single-user runtime.

## Executive Summary
- Client-only SPA renders floorplans with clickable hotspots, enforces one booking per user/day, and persists to local JSON.  
- Stack: React 19.2, Vite 6.2.5 (patched), Radix UI 1.2.0, Node.js 22.17.x LTS. Verified 2025-12-02 against official release notes. citeturn0search5turn1search0turn1search10turn0search8  
- Persistence: `data/bookings.json`, `data/users.json`, `data/last-updated.json`; backups under `data/backup/`.  
- No server DB or auth; all logic runs locally; file writes are synchronous write-through.

## Project Initialization
- Node 22.17.x LTS (Active LTS, EOL Apr 30 2027). citeturn0search3turn0search8  
- Install: `npm install` (project root, Vite React SPA).  
- First story: ensure `data/` structure exists (`users.json`, `bookings.json`, `last-updated.json`, `backup/.keep`).

## Decision Summary
| Category | Decision | Version | Affects FR Groups | Rationale |
| -------- | -------- | ------- | ----------------- | --------- |
| Frontend framework | React | 19.2 | Desk selection, booking, list | Verified 2025-12-02 (react.dev). citeturn0search5 |
| Build tool | Vite | 6.2.5 | All FE | Verified 2025-12-02 (vite release notes); patched 6.0–6.2 CVEs. citeturn1search10turn1search2 |
| Runtime | Node.js | 22.17.x LTS | Tooling | Verified 2025-12-02; active LTS to 2027-04-30. citeturn0search3turn0search8turn1search0 |
| UI primitives | Radix UI | 1.2.0 | Modals, toasts, selects, tooltips | Verified 2025-12-02; keep pinned for determinism. |
| State/persistence | JSON files | n/a | Data & backup | Write-through files; no DB; simplest local persistence. |
| Asset source | desks.json + PNGs | n/a | Map/legend | Single source of truth for desks; overlay coordinates. |
| Backup/import | JSON snapshot | n/a | Data safety | Human-readable backup; schema validated on import. |

## Project Structure
```
docs/
  prd.md
  ux-design-specification.md
  architecture.md
  bmm-workflow-status.yaml
  adr/ADR-001-tech-stack.md
data/
  users.json
  bookings.json
  last-updated.json
  backup/.keep
src/
  assets/ (floorplan PNGs, desks.json from office-floorplans/assets/floorplans/)
  lib/
    storage/ (json read/write, schema validate)
    mapping/ (deskId validation, overlay helpers)
  components/
    FloorplanView/ (SVG overlay, hotspots, legend)
    FiltersBar/ (office, floor, date, user, last-updated)
    BookingList/ (per-day list, cancel)
    BackupControls/ (export/import modal)
    BookingConfirm/
    RosterManager/ (optional, simple list)
  pages/
    App.tsx (single-screen layout)
  styles/ (tokens: colors, spacing, radius)
scripts/
  validate-desks.js (optional overlay QA)
```

## FR Category Mapping
- Desk Selection & Booking → FloorplanView, BookingConfirm, storage/lib validation.
- Views & Lists → BookingList, FiltersBar.
- Data & Persistence → storage/lib JSON handlers, last-updated.
- Backup/Restore → BackupControls, storage/lib backup/import.
- Validation & Feedback → shared toast/alert utility.

## Technology Stack Details
### Core
- React 19.2 (SPA) citeturn0search5  
- Vite 6.2.5 (build/dev) citeturn1search10turn1search2  
- Node.js 22.17.x LTS (tooling) citeturn0search8  
- Radix UI primitives (Dialog, Toast, Tooltip, Select)  
- TypeScript, CSS modules or Tailwind (optional, keep minimal).

### Integration Points
- File system only: JSON read/write under `data/`; no external APIs.
- Assets: desks.json + PNGs from `office-floorplans/assets/floorplans/`.

## Implementation Patterns (consistency rules)
- Naming: React components `PascalCase.tsx`; files kebab-case for non-components.  
- State: use React state/query; no global store; props drilling acceptable given small scope.  
- State/async: keep async effects inside hooks with abort guards; no global event bus; avoid implicit globals.  
- Routes/URLs: single SPA route; if adding routes later, use kebab-case paths and data-testids mirroring FR map.  
- Config: `.env` for BASE_URL only; all other config co-located in `src/lib/config.ts`; no dynamic env branching.  
- Dates: ISO `YYYY-MM-DD`; stored as strings.  
- IDs: deskId must match desks.json; booking id = UUID v4.  
- Responses/errors: UI toasts for success/error; inline messages on forms.  
- File writes: synchronous write-through; update `last-updated.json` after every write/import.  
- Backups: filename `backup-YYYYMMDD-HHMMSS.json`, contains `users` and `bookings`.  
- Validation: schema check on load/import; reject invalid, log to console and toast.

## Consistency Rules
- Error handling: inline + toast; no silent failures.  
- Logging: console.info for normal ops, console.error for failures (local app).  
- Styling tokens: primary #2563eb, success #22c55e, warning #f59e0b, error #ef4444, radius 8px, spacing 4/8/12/16/24.  
- Accessibility: keyboard focus on hotspots; ARIA labels “Desk {id}, {status}, {user}”; toasts role="status"; WCAG AA contrast.
- Testing structure: Playwright at repo root, tests under `tests/e2e`; selectors use `data-testid`; artifacts to `test-results/*`; tags `@smoke`, `@booking`, `@backup`.
- CRUD/helper contracts (internal): storage helpers expose `readBookings()`, `writeBookings()`, `readUsers()`, `writeUsers()`, `exportBackup(path)`, `importBackup(path)` returning { ok, error } objects; all enforce deskId validation and update last-updated on write.

## Data Architecture
- users.json: `[ { id, name, active } ]`  
- bookings.json: `[ { id, office, floor, deskId, date, userId, createdAt, releasedAt? } ]`  
- last-updated.json: `{ updatedAt }`  
- backup file: `{ users: [...], bookings: [...], lastUpdated }`

## API Contracts
- None (local-only). Internal storage helpers expose CRUD functions returning Promises with result/error objects.

## Security Architecture
- Local-only; no auth; no network calls.  
- Guard imports: validate schema; ignore external file paths.  
- Known Vite CVEs fixed by using ≥6.2.5. citeturn1search10

## Performance Considerations
- Keep floorplan render lightweight (SVG overlay on PNG).  
- Debounce resize/zoom; lazy-load PNGs per office/floor.  
- Data size small (~hundreds of bookings); no pagination needed.
- Scaling/ops posture: intentionally local-only; no monitoring/metrics. If multi-device/auth added later, revisit persistence (move to API/DB), introduce auth, and add logging/metrics.

## Deployment Architecture
- Local dev: `npm run dev`.  
- Local prod preview: `npm run build && npm run preview`.  
- Optional packaging: static build; serve via `vite preview` or simple file server on same machine.

## Development Environment
### Prerequisites
- Node 22.17.x LTS; npm 10.9.x. citeturn0search8turn0search2  
- Git.
### Setup Commands
```bash
npm install
npm run dev
```

## Architecture Decision Records (highlights)
- ADR-001: Stack choice (React 19.2, Vite 6, JSON persistence, Node 22).  
- Backup/import JSON, no DB.  
- Radix primitives + custom tokens; no heavy design system.

---
Generated by BMAD Decision Architecture Workflow v1.0  
Date: 2025-12-02  
For: DICKY
