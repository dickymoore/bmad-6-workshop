# Story 1.4: Roster load/save

Status: review

## Story

As an admin, I want the app to load and persist the ~20-user roster so I can pick users when booking.

## Acceptance Criteria

1. Roster loads from `data/users.json` on startup; if missing/empty, app seeds with an empty array and shows a notice. citedocs/epics.md  
2. Roster save writes through storage module and updates `data/last-updated.json`; failures surface as structured errors (no silent failures). citedocs/sprint-artifacts/tech-spec-epic-1.md  
3. Roster read/write enforces schema (id, name, active) and rejects empty names/duplicates, returning clear errors. citedocs/epics.md  
4. UI (or API hook) reflects roster changes immediately and keeps booking user dropdown in sync. citedocs/prd.md  

## Tasks / Subtasks

- [x] Storage support (AC1, AC2, AC3)  
  - [x] Implement roster schema validation (id, name, active).  
  - [x] readUsers(): seed empty array + notice when file missing/empty.  
  - [x] writeUsers(): enforce non-empty names and no duplicates; atomic write; update last-updated; return { ok, error }.  
- [x] UI/Hook integration (AC1, AC4)  
  - [x] Load roster on app start; show notice “Roster empty—add users to enable booking.”  
  - [x] Keep user dropdown synced after saves/imports.  
- [x] Error handling & feedback (AC2, AC3)  
  - [x] Surface validation errors via inline message; log console.error.  
- [x] Tests (AC1–AC4)  
  - [x] Unit: seed behavior when file missing/empty.  
  - [x] Unit: duplicate/empty name rejected.  
  - [x] Unit/API: write updates last-updated and returns structured result on fs failure.  
  - [x] Component: dropdown reflects updated roster.  

## Dev Notes

- Architecture: storage layer is the single source of truth; keep roster in `data/users.json`, write-through with atomic writes, and update last-updated. citedocs/architecture.md  
- Tech spec alignment: reuse storage helpers and schemas from Epic 1 tech spec; ensure path safety within `data/`. citedocs/sprint-artifacts/tech-spec-epic-1.md  
- PRD linkage: FR3 (user dropdown) and FR12–FR15 (persistence/validation) depend on reliable roster handling. citedocs/prd.md  
- UX: show a friendly notice when roster empty; dropdown should disable booking confirm if roster empty (optional but recommended).  
- Data safety: prevent duplicate names; consider lowercasing compare; visitor handled as separate option.  

### Project Structure Notes

- Keep roster helpers in `src/lib/storage/users.ts`; invoked by app bootstrap and roster UI (if added later).  
- Shared validation utilities should be reused across bookings and roster to avoid drift.  

### References

- docs/epics.md (Epic 1, Story 1.4)  
- docs/architecture.md (data layout, write-through, last-updated)  
- docs/sprint-artifacts/tech-spec-epic-1.md (storage contracts, atomic write)  
- docs/prd.md (FR3 user dropdown, persistence)

## Dev Agent Record

### Context Reference

- docs/sprint-artifacts/1-4-roster-load-save.context.xml

### Agent Model Used

OpenAI GPT-5 (Codex SM mode)

### Debug Log References

Plan 2025-12-03:
- Add roster storage with validation, atomic write, last-updated touch, and change events.
- Wire roster provider + user dropdown notice for empty state.
- Tests for seed, duplicates, last-updated update, and dropdown rendering.

### Completion Notes List

- 2025-12-03: Implemented roster storage (read/write/emit) with ISO timestamp updates.
- 2025-12-03: Added roster provider and user dropdown UI; empty notice shown when no users.
- 2025-12-03: Added tests for storage behaviors and dropdown; build/tests passing (Node 20 run; engines expect Node 22).

### File List

- UPDATED: package.json
- UPDATED: package-lock.json
- UPDATED: vitest.config.ts
- NEW: src/lib/storage/users.ts
- UPDATED: src/lib/storage/last-updated.ts
- NEW: src/lib/storage/index.ts
- NEW: src/lib/roster/context.tsx
- NEW: src/components/UserDropdown.tsx
- UPDATED: src/components/LastUpdatedBadge.tsx
- UPDATED: src/App.tsx
- UPDATED: src/index.css
- UPDATED: tests/unit/seed.test.ts
- NEW: tests/unit/storage.users.test.ts
- NEW: tests/component/UserDropdown.spec.tsx
- UPDATED: tests/component/FiltersBar.spec.tsx
- UPDATED: docs/sprint-artifacts/1-4-roster-load-save.md
- UPDATED: docs/sprint-artifacts/1-4-roster-load-save.context.xml
- UPDATED: docs/sprint-artifacts/sprint-status.yaml

## Change Log

- 2025-12-03: Initial draft created from epics, PRD, architecture, and tech spec.
- 2025-12-03: Generated story context and marked ready-for-dev.
- 2025-12-03: Implemented roster storage, UI badge/dropdown, tests; marked story ready for review.
