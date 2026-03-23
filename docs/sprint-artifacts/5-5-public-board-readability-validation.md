# Story 5.5 Public Board Readability Validation

Date: 2026-03-23
Scope: Final foyer-readability validation for the canonical public board at the Royal Institution.
Target display context: venue-first desktop surface using the existing `1366px+` foyer layout, the `1024px+` supported desktop adaptation, and the compact-height `max-height: 820px` fallback already defined in `src/app/globals.css`.
Canonical implementation seams:
- `src/app/(public)/page.tsx`
- `src/features/dashboard/components/DashboardScreen.tsx`
- `src/features/dashboard/components/ModeSummaryGrid.tsx`
- `src/features/dashboard/components/LocalityReferencePanel.tsx`
- `src/features/dashboard/components/LocalMapFrame.tsx`
- `src/features/dashboard/presenters/dashboard-presenter.js`
- `tests/smoke/startup-smoke.test.mjs`
- `tests/unit/dashboard.presenter.test.mjs`

## Foyer-Readability Rubric

### Acceptance gate

Accepted only if the canonical public board reads like a clear public information board in the foyer context.
Epic 5 remains open if any clarity failure, beauty failure, no-scroll failure, or nearby-reference comprehension failure remains unresolved.

### Review conditions

- Review the existing one-screen public board only. No alternate route, prototype, or validation-only shell is allowed.
- Judge the board first at room scale and then at a nearby standing read.
- Read the board as a passive public information surface, not as a planner, dashboard, or operator console.

### Explicit criteria

- No-scroll rule: the default public view must remain a one-screen board shell with the same stable reading order: header, nearby modes, nearby references, local map.
- `2-3 second` far-read expectation: overall service state, strongest warning state, and board status hierarchy must be obvious without requiring paragraph reading.
- `5-10 second` nearby-reference comprehension expectation: Green Park, Piccadilly / St James's Street, and Albemarle Street must be understandable as concrete local cues.
- Anti-repetition copy rule: labels, hierarchy, compact status language, and named references must carry the main meaning. Repeated explanatory prose must not be required for comprehension.
- Passive-board rule: no controls, planner language, recommendation language, or ops posture may leak into the public board.

## Review Evidence

### Board shell and no-scroll evidence

- `DashboardScreen.tsx` keeps one canonical board shell with the stable reading order `dashboard-shell__header`, `dashboard-lower-grid__modes`, `dashboard-lower-grid__locality`, and `dashboard-lower-grid__map`.
- `globals.css` keeps the supported `1024px+` public board pinned to a one-screen, no-scroll shell in the existing route rather than creating a second validation layout.
- `tests/smoke/startup-smoke.test.mjs` now locks the Story 5.5 one-screen contract to the canonical route and component seams.

### Far-read evidence

- `AtmosphericHeader.tsx` still presents the overall board state as the dominant public headline and status chip.
- The board cue, movement, and weather cards remain compact structural signals rather than long-form explanation.
- Presenter copy keeps the dominant support line concise: `Weather and movement align nearby.`

### Nearby-reference evidence

- `dashboard.presenter.test.mjs` now enforces concise board-facing presenter copy and confirms the concrete nearby references remain `Green Park`, `Piccadilly / St James's Street`, and `Albemarle Street`.
- `LocalityReferencePanel.tsx` and `LocalMapFrame.tsx` keep those named references visible through labels, kind markers, and passive local orientation cues.
- The local map remains subordinate to the board hierarchy while still reinforcing the same named locality story.

### Anti-prose and anti-planner evidence

- `tests/smoke/startup-smoke.test.mjs` now rejects planner-like wording and Story 5.5 regressions that would move meaning back into explanatory prose.
- `tests/unit/dashboard.presenter.test.mjs` now constrains presenter copy length and rejects advisory language, repeated explanatory phrasing, and route-planner posture in the board-facing view model.

## Final Review Result

Result: Pass for Story 5.5 acceptance.

- The default public board stays attached to the existing no-scroll one-screen shell.
- The overall state remains the fastest room-scale read.
- Nearby references remain concrete and understandable within the intended close-read window.
- The map stays passive and subordinate rather than dominating the board.
- No remaining clarity or beauty failure was identified in the canonical repo-owned board evidence set.

## Validation Commands

- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run build`

## Review Follow-up Resolution

- Code review rerun on 2026-03-23 tightened the supported-desktop no-scroll contract so Story 5.5 no longer relies on a permissive `overflow-y: auto` check.
