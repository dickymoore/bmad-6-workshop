# ADR-001: Stack for Local Desk Booking SPA

## Status
Proposed

## Context
- Local-only desk booking SPA with floorplan PNGs and desks.json.
- ~20 users; day-level bookings; no auth/multi-device; reuse assets; zero infra.
- Need fastest delivery with clear availability UI and reliable local persistence.

## Decision Drivers
- Time-to-ship and simplicity
- Support window and ecosystem stability
- Minimal configuration/ops footprint
- Good DX for overlaying PNG + JSON hotspots

## Considered Options
- React 19.2 + Vite 6 SPA on Node 22 LTS (chosen)
- React 19.2 + Vite 6 on Node 20 LTS (fallback)
- SvelteKit 2 + Vite 6 on Node 20/22

## Decision
Use React 19.2 + Vite 6 SPA on Node 22 LTS; JSON file persistence in `data/` (no SQL); keep desks.json as source of truth; immediate save on change; JSON export/import for backup.

## Consequences
**Positive**
- Fast dev/build (vite dev); long support window to 2027-04-30 for Node 22.
- SPA simplicity; strong React ecosystem; minimal config.
- Clear path to overlay assets and validate desk IDs against JSON.
- No DB setup; simple file-based persistence matches local-only scope.

**Negative**
- No SSR; purely local SPA (okay for scope).
- Need to ship Node 22 with the app if packaged.
- Must handle safe concurrent writes (single-user is fine; still guard writes).

**Neutral**
- Can fall back to Node 20 if environment blocks Node 22; plan upgrade later.

## Implementation Notes
- Pin versions: Node 22.x, React ^19.2, Vite ^6.
- File formats: `data/bookings.json` (array of bookings), `data/users.json` (array of users).
  - User: { id, name, active }
  - Booking: { id, office, floor, deskId, date: YYYY-MM-DD, userId, createdAt, releasedAt? }
- Write-through saves on change; enforce one booking/user/day; backup/export to `data/backup/backup-YYYYMMDD-HHMMSS.json`; validate desks against desks.json on load; keep `data/last-updated.json` with updatedAt.

## References
- React 19.2 release (2025-10-01) – react.dev blog.
- Vite 6 release (2024-11-26) – vite conf 2024 note.
- Node 22 LTS schedule – Node.js release working group.
