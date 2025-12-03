# Story 4.4: Roster edit UI

Status: ready-for-dev

## Story

As an admin, I want to edit the user list so I can keep the roster current.

## Acceptance Criteria

1. Admin can add, edit, and deactivate users; saves to `users.json`; validation prevents empty names and duplicates. citedocs/epics.md  
2. Changes propagate immediately to the booking user dropdown; last-updated is refreshed. citedocs/prd.md  
3. Error states (validation or write failure) show clear toast/inline messages; no partial saves. citedocs/epics.md  

## Tasks / Subtasks

- [ ] UI and validation (AC1)  
  - [ ] Build form/table for roster with add/edit/deactivate; enforce non-empty, unique names.  
- [ ] Persistence (AC2, AC3)  
  - [ ] Save via storage helper; update last-updated; refresh dropdown state.  
  - [ ] Handle errors; rollback UI state on failure.  
- [ ] Tests (AC1–AC3)  
  - [ ] Component: add/edit/deactivate flows; validation blocks empties/dupes.  
  - [ ] Integration: dropdown updates after save; last-updated refreshed.  
  - [ ] Error path shows toast/inline and leaves prior data intact.  

## Dev Notes

- Depends on storage layer (users.json) and dropdown integration (Story 3.1). citedocs/epics.md  
- PRD linkage: extends FR3 and persistence requirements FR12–FR15. citedocs/prd.md  
- Architecture: use same schema and validation as storage helpers; keep writes atomic and scoped to data/. citedocs/architecture.md  
- UX: include inline validation messages; deactivate vs delete to preserve references.  

### Project Structure Notes

- Place UI in RosterManager component; reuse storage/users helper; share state with dropdown.  
- Keep visitor option separate; ensure id uniqueness.  

### References

- docs/epics.md (Epic 4, Story 4.4)  
-, docs/prd.md (FR3, FR12–FR15)  
- docs/architecture.md (roster storage, atomic writes)

## Dev Agent Record

### Context Reference

- docs/sprint-artifacts/4-4-roster-edit-ui.context.xml

### Agent Model Used

OpenAI GPT-5 (Codex SM mode)

### Debug Log References

### Completion Notes List

### File List

- NEW: docs/sprint-artifacts/4-4-roster-edit-ui.md
- NEW: docs/sprint-artifacts/4-4-roster-edit-ui.context.xml

## Change Log

- 2025-12-03: Initial draft created from epics, PRD, architecture.
- 2025-12-03: Generated story context and marked ready-for-dev.
