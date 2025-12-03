# Story 1.4: Roster load/save

Status: ready-for-dev

## Story

As an admin, I want the app to load and persist the ~20-user roster so I can pick users when booking.

## Acceptance Criteria

1. Roster loads from `data/users.json` on startup; if missing/empty, app seeds with an empty array and shows a notice. citedocs/epics.md  
2. Roster save writes through storage module and updates `data/last-updated.json`; failures surface as structured errors (no silent failures). citedocs/sprint-artifacts/tech-spec-epic-1.md  
3. Roster read/write enforces schema (id, name, active) and rejects empty names/duplicates, returning clear errors. citedocs/epics.md  
4. UI (or API hook) reflects roster changes immediately and keeps booking user dropdown in sync. citedocs/prd.md  

## Tasks / Subtasks

- [ ] Storage support (AC1, AC2, AC3)  
  - [ ] Implement roster schema validation (id, name, active).  
  - [ ] readUsers(): seed empty array + notice when file missing/empty.  
  - [ ] writeUsers(): enforce non-empty names and no duplicates; atomic write; update last-updated; return { ok, error }.  
- [ ] UI/Hook integration (AC1, AC4)  
  - [ ] Load roster on app start; show notice “Roster empty—add users to enable booking.”  
  - [ ] Keep user dropdown synced after saves/imports.  
- [ ] Error handling & feedback (AC2, AC3)  
  - [ ] Surface validation errors via toast + inline message; log console.error.  
- [ ] Tests (AC1–AC4)  
  - [ ] Unit: seed behavior when file missing/empty.  
  - [ ] Unit: duplicate/empty name rejected.  
  - [ ] Unit/API: write updates last-updated and returns structured result on fs failure.  
  - [ ] Component: dropdown reflects updated roster.  

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

### Completion Notes List

### File List

- NEW: docs/sprint-artifacts/1-4-roster-load-save.md
- NEW: docs/sprint-artifacts/1-4-roster-load-save.context.xml

## Change Log

- 2025-12-03: Initial draft created from epics, PRD, architecture, and tech spec.
- 2025-12-03: Generated story context and marked ready-for-dev.
