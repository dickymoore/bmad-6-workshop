# Story 4.3: Toasts and inline feedback

Status: done

## Story

As a user, I want clear success/error messages for actions so I know what happened.

## Acceptance Criteria

1. All create/cancel/export/import actions show success toasts; errors show both toast and inline message near the trigger. citedocs/epics.md  
2. Toasts use consistent copy/tone and are accessible (`role="status"`, focusable when needed). citedocs/prd.md  
3. Errors propagate structured messages from storage/helpers; no silent failures. citedocs/architecture.md  

## Tasks / Subtasks

- [x] Centralize feedback (AC1–AC3)  
  - [x] Create toast/inline feedback utility; standardize copy keys for create/cancel/export/import.  
  - [x] Ensure helpers surface { ok:false, error } messages; map to user-facing text.  
- [x] Accessibility & tone (AC2)  
  - [x] role="status"; focus handling; consistent wording.  
- [x] Wire actions (AC1)  
  - [x] Integrate feedback for booking create/cancel, backup export, import, and validation errors.  
- [x] Tests (AC1–AC3)  
  - [x] Component/unit: success and error toasts appear; inline errors rendered.  
  - [x] Error propagation uses structured messages; no suppressed errors.  

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

- Implemented feedback system: centralized messages, toast viewport, inline error surfacing across booking create/cancel and backup export/import. (2025-12-03)

### Completion Notes List

- Added FeedbackProvider + ToastViewport for consistent, accessible toasts; auto-dismiss + manual close. (2025-12-03)
- Booking create/cancel now map structured errors to inline + toast; success toasts unified. (2025-12-03)
- Backup export/import show toasts and inline messages; error mapping covers permissions/JSON/schema. (2025-12-03)
- New feedback message utilities and unit/component coverage ensure no silent failures. (2025-12-03)

### File List

- MOD: docs/sprint-artifacts/4-3-toasts-and-inline-feedback.md
- MOD: docs/sprint-artifacts/sprint-status.yaml
- MOD: src/App.tsx
- MOD: src/components/BackupControls.tsx
- MOD: src/components/BookingCancel.tsx
- MOD: src/components/BookingConfirm.tsx
- ADD: src/components/ToastViewport.tsx
- ADD: src/lib/feedback/context.tsx
- ADD: src/lib/feedback/messages.ts
- MOD: src/lib/storage/backup.ts
- MOD: src/lib/storage/schema.ts
- MOD: src/lib/storage/last-updated.ts
- MOD: tests/component/BackupControls.spec.tsx
- MOD: tests/component/BookingConfirm.spec.tsx
- MOD: tests/component/BookingConfirm.conflict.spec.tsx
- MOD: tests/component/BookingConfirm.invalid.spec.tsx
- ADD: tests/unit/feedback.test.ts
- MOD: tests/support/fixtures/backup-factory.ts
- MOD: tests/e2e/booking-flow.spec.ts

## Change Log

- 2025-12-03: Initial draft created from epics, PRD, architecture.
- 2025-12-03: Generated story context and marked ready-for-dev.
- 2025-12-03: Implemented centralized toasts/inline feedback, wired booking + backup flows, added tests; marked ready for review.
- 2025-12-03: Fixed shared feedback crash; retested unit suite.
- 2025-12-03: Senior Developer Review appended; status moved to done.

## Senior Developer Review (AI)

**Reviewer:** DICKY  
**Date:** 2025-12-03  
**Outcome:** Approve  
**Summary:** Feedback system centralizes success/error copy, exposes accessible toasts, and wires booking + backup actions with inline errors; structured error mapping prevents silent failures. Tests cover unit, component, and e2e paths.

### Key Findings
- None (all ACs satisfied).

### Acceptance Criteria Coverage
| AC | Description | Status | Evidence |
| --- | --- | --- | --- |
| 1 | All create/cancel/export/import show success toasts; errors show toast + inline | IMPLEMENTED | src/lib/feedback/context.tsx:17-41; src/components/ToastViewport.tsx:10-22; src/components/BookingConfirm.tsx:29-75; src/components/BookingCancel.tsx:28-47; src/components/BackupControls.tsx:13-110; tests/component/BackupControls.spec.tsx:13-46 |
| 2 | Toasts consistent and accessible (role="status", focusable) | IMPLEMENTED | src/components/ToastViewport.tsx:10-22; src/index.css (toast styles) |
| 3 | Errors propagate structured messages; no silent failures | IMPLEMENTED | src/lib/feedback/messages.ts:1-35; src/lib/feedback/context.tsx:17-41; booking/backup components use showError return strings; tests/unit/feedback.test.ts:1-20 |

Summary: 3/3 ACs implemented.

### Task Completion Validation
| Task | Marked As | Verified As | Evidence |
| --- | --- | --- | --- |
| Centralize feedback (AC1–AC3) | Complete | VERIFIED COMPLETE | src/lib/feedback/context.tsx; src/lib/feedback/messages.ts |
| Accessibility & tone (AC2) | Complete | VERIFIED COMPLETE | src/components/ToastViewport.tsx:10-22 (role="status", focusable) |
| Wire actions (AC1) | Complete | VERIFIED COMPLETE | BookingConfirm.tsx:29-75; BookingCancel.tsx:28-47; BackupControls.tsx:13-110; App.tsx provider/viewport |
| Tests (AC1–AC3) | Complete | VERIFIED COMPLETE | tests/unit/feedback.test.ts; tests/component/BackupControls.spec.tsx; tests/component/BookingConfirm*.spec.tsx; tests/e2e/booking-flow.spec.ts |

Summary: 4/4 completed tasks verified; 0 questionable; 0 false completions.

### Test Coverage and Gaps
- Unit: feedback mapping (tests/unit/feedback.test.ts).
- Component: booking create/cancel toasts & errors; backup export/import toasts and inline errors (tests/component/*).
- E2E: backup export/import toasts (tests/e2e/booking-flow.spec.ts).
- No gaps noted.

### Architectural Alignment
- Centralized feedback aligns with architecture’s structured error propagation; role/status toasts meet accessibility guidance.

### Security Notes
- No external endpoints; errors are surfaced, not suppressed.

### Best-Practices and References
- Reusable feedback provider + viewport; structured message mapping per action.

### Action Items
- None.
