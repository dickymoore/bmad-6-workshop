# Story 4.3: Toasts and inline feedback

Status: ready-for-dev

## Story

As a user, I want clear success/error messages for actions so I know what happened.

## Acceptance Criteria

1. All create/cancel/export/import actions show success toasts; errors show both toast and inline message near the trigger. citedocs/epics.md  
2. Toasts use consistent copy/tone and are accessible (`role="status"`, focusable when needed). citedocs/prd.md  
3. Errors propagate structured messages from storage/helpers; no silent failures. citedocs/architecture.md  

## Tasks / Subtasks

- [ ] Centralize feedback (AC1–AC3)  
  - [ ] Create toast/inline feedback utility; standardize copy keys for create/cancel/export/import.  
  - [ ] Ensure helpers surface { ok:false, error } messages; map to user-facing text.  
- [ ] Accessibility & tone (AC2)  
  - [ ] role="status"; focus handling; consistent wording.  
- [ ] Wire actions (AC1)  
  - [ ] Integrate feedback for booking create/cancel, backup export, import, and validation errors.  
- [ ] Tests (AC1–AC3)  
  - [ ] Component/unit: success and error toasts appear; inline errors rendered.  
  - [ ] Error propagation uses structured messages; no suppressed errors.  

## Dev Notes

- Depends on storage helpers returning structured results (Epic 1); align error codes for booking/backup/import. citedocs/architecture.md  
- PRD linkage: FR18 requires immediate confirmation/error messages. citedocs/prd.md  
- Keep copy minimal and consistent; avoid duplicates across components.  

### Project Structure Notes

- Put feedback utility in `src/lib/feedback/`; provide hooks/helpers for toasts + inline.  
- Common copy table for messages (success/error) per action.  

### References

- docs/epics.md (Epic 4, Story 4.3)  
- docs/prd.md (FR18)  
- docs/architecture.md (error propagation expectations)

## Dev Agent Record

### Context Reference

- docs/sprint-artifacts/4-3-toasts-and-inline-feedback.context.xml

### Agent Model Used

OpenAI GPT-5 (Codex SM mode)

### Debug Log References

### Completion Notes List

### File List

- NEW: docs/sprint-artifacts/4-3-toasts-and-inline-feedback.md
- NEW: docs/sprint-artifacts/4-3-toasts-and-inline-feedback.context.xml

## Change Log

- 2025-12-03: Initial draft created from epics, PRD, architecture.
- 2025-12-03: Generated story context and marked ready-for-dev.
