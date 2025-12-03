# Story 1.3: Last-updated service hook

Status: ready-for-dev

## Story

As a user, I want to see when data was last saved so I trust the state I’m viewing.

## Acceptance Criteria

1. The UI displays the last-updated timestamp near filters (office/floor/date/user) using the value from `data/last-updated.json`. citedocs/epics.md  
2. After any booking create/cancel/import action, the last-updated timestamp refreshes immediately in UI and on disk. citedocs/epics.md  
3. Timestamp is stored and shown as an ISO string (no timezone conversions); empty value handled gracefully on first run. citedocs/architecture.md  
4. Storage helper updates `last-updated.json` on every successful write/import and returns `{ ok, error }` on failure. citedocs/sprint-artifacts/tech-spec-epic-1.md  

## Tasks / Subtasks

- [ ] Expose last-updated helper (AC3, AC4)  
  - [ ] Add `readLastUpdated` / `writeLastUpdated` in storage layer; ensure atomic write.  
  - [ ] Handle empty/invalid file by seeding `{ updatedAt: "" }`.  
- [ ] Wire booking flows (AC2, AC4)  
  - [ ] After booking create/cancel/import, call `writeLastUpdated(nowIso)`; surface errors to UI.  
  - [ ] Ensure booking/write helpers bubble `{ ok:false, error }` to trigger toast.  
- [ ] UI display (AC1, AC3)  
  - [ ] Render timestamp near filters; show “Not yet saved” if empty.  
  - [ ] Style per design tokens; accessible text (role="status").  
- [ ] Tests (AC1–AC4)  
  - [ ] Unit: writeLastUpdated writes ISO, handles empty file.  
  - [ ] Unit: booking write triggers timestamp update.  
  - [ ] Component: timestamp renders and updates after mocked write.  
  - [ ] Unit: error path returns `{ ok:false, error }`.  

## Dev Notes

- Architecture: last-updated is part of persistence contract; stored in `data/last-updated.json`, updated on every write/import. citedocs/architecture.md  
- Tech spec alignment: reuse storage layer from Story 1.2; ensure atomic write and structured result. citedocs/sprint-artifacts/tech-spec-epic-1.md  
- PRD linkage: supports NFR1 reliability and FR12/FR14 around persistence visibility. citedocs/prd.md  
- UX: place near filters to keep state trust visible; avoid timezone conversion—use `YYYY-MM-DDTHH:mm:ss.sssZ` as stored.  
- Error handling: on failure to update, show non-blocking toast and keep prior timestamp; log console.error.  

### Project Structure Notes

- Hooks/UI: locate display component near FiltersBar; use a small status text with design tokens.  
- Storage: keep last-updated helper in `src/lib/storage/last-updated.ts`; used by booking/import flows.  

### References

- docs/epics.md (Epic 1, Story 1.3)  
- docs/architecture.md (last-updated file, data layout)  
- docs/sprint-artifacts/tech-spec-epic-1.md (storage helpers, atomic write)  
- docs/prd.md (FR12–FR15 persistence visibility)

## Dev Agent Record

### Context Reference

- docs/sprint-artifacts/1-3-last-updated-service-hook.context.xml

### Agent Model Used

OpenAI GPT-5 (Codex SM mode)

### Debug Log References

### Completion Notes List

### File List

- NEW: docs/sprint-artifacts/1-3-last-updated-service-hook.md
- NEW: docs/sprint-artifacts/1-3-last-updated-service-hook.context.xml

## Change Log

- 2025-12-03: Initial draft created from epics, PRD, architecture, and tech spec.
- 2025-12-03: Generated story context and marked ready-for-dev.
