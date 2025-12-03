# Epic 3 Retrospective — Booking Actions & Rules

Date: 2025-12-03  
Facilitator: DICKY  
Status: Completed

## What Went Well

- Clear booking flow decomposition (select user, confirm, conflict rule, cancel, desk validation) kept scope tight.
- Consistent storage layer contracts reused across stories, reducing duplication.
- Accessibility baked into stories (tooltips, focus states, ARIA labels) early.

## What Didn’t Go Well

- Potential overlap between client and storage conflict checks could lead to double work if not centralized.
- Error messaging patterns not yet standardized across booking actions.

## Actions / Follow-Ups

- Standardize booking error codes and toast copy in a shared helper before implementation.
- Add a single booking validation module consumed by create/cancel/desk validation to avoid drift.
- Plan E2E conflict/cancel tests once core flows are implemented.

## Appreciations

- Good alignment between PRD FR8/FR9 and story ACs; minimized rework risk.
