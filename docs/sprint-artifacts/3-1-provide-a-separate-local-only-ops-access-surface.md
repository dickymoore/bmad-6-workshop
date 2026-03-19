# Story 3.1: Provide a Separate Local-Only Ops Access Surface

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a venue operator,
I want a separate local ops surface for maintenance and recovery,
so that I can manage the display without exposing operational controls to visitors.

## Acceptance Criteria

1. Given the app is running on the venue device, when a venue operator opens the ops surface, then it is clearly separate from the public display route, and no ops controls appear on the public-facing screen.
2. Given the ops surface is available, when a venue operator navigates it with keyboard only, then the controls are usable in a keyboard-safe order, and the labels remain plain and operationally clear.
3. Given an access attempt is made from a denied or non-local context, when the ops surface is requested, then maintenance functionality is not exposed, and the public display remains unchanged and free of debug or admin leakage.

## Tasks / Subtasks

- [x] Replace the hidden ops placeholder with a gated local-only route shell. (AC: 1, 3)
  - [x] Refactor [page.tsx](/home/codexuser/bmad-6-workshop/src/app/(ops)/ops/page.tsx) so it no longer unconditionally calls `notFound()`, and instead delegates to a server-side access assertion before rendering any ops UI. (AC: 1, 3)
  - [x] Add a dedicated access helper under `src/lib/server/security/assert-ops-access.js` that checks request context against a local-only allowlist and fails closed without exposing admin copy, stack traces, or route hints. (AC: 3)
  - [x] Choose one repo-wide local access rule and document it in env handling so future ops stories reuse the same gate instead of inventing a second mechanism. Default used: allow loopback plus `OPS_ALLOWED_HOSTS`, deny everything else. (AC: 3)
- [x] Introduce the first ops-only UI shell in the separate `(ops)` route tree. (AC: 1, 2)
  - [x] Create an ops feature surface under [src/features/ops](/home/codexuser/bmad-6-workshop/src/features/ops) for the page shell, headings, and placeholder maintenance sections instead of placing feature logic in the route file. (AC: 1)
  - [x] Keep the page visually and structurally distinct from the public dashboard, with plain operational labels, restrained maintenance styling, and no public-screen controls or route-planner language. (AC: 1, 2)
  - [x] Ensure the initial focus order, landmarks, headings, and action grouping support keyboard-only operation without traps, pointer dependency, or decorative-only labels. (AC: 2)
- [x] Preserve strict separation between public and ops surfaces. (AC: 1, 3)
  - [x] Leave [page.tsx](/home/codexuser/bmad-6-workshop/src/app/(public)/page.tsx) and the public dashboard feature free of ops buttons, status copy, or maintenance controls. (AC: 1)
  - [x] Keep ops-only behavior out of [DashboardScreen.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/DashboardScreen.tsx), [DashboardLiveScreen.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/DashboardLiveScreen.tsx), and public presenter code. (AC: 1, 3)
  - [x] Make denied ops access return a non-leaky response path such as `notFound()` or equivalent server-side denial, while leaving the public display route untouched. (AC: 3)
- [x] Add regression coverage for local-only access and keyboard-safe ops entry. (AC: 1, 2, 3)
  - [x] Update [startup-smoke.test.mjs](/home/codexuser/bmad-6-workshop/tests/smoke/startup-smoke.test.mjs) so Story 1.1's placeholder assertion evolves into a secured-access assertion rather than continuing to require the route to stay permanently hidden. (AC: 1, 3)
  - [x] Add targeted unit coverage for the new access helper, including allowed loopback or venue-host contexts and denied non-local contexts. (AC: 3)
  - [x] Add route or component coverage proving the first ops page exposes keyboard-ordered controls or sections with plain operational labels and does not leak into the public route tree. (AC: 1, 2)
  - [x] Keep the full verification path compatible with `npm run validate`. (AC: 1, 2, 3)

## Dev Notes

### Developer Context

- Story 3.1 is the first Epic 3 implementation story, so it establishes the access boundary that later ops stories depend on:
  - Story 3.2 will need this surface to show current, reduced-confidence, or unavailable readiness.
  - Story 3.3 will depend on the same surface to show degraded-impact scope.
  - Story 3.4 and Story 3.5 will depend on the same local-only gate for refresh and recovery actions.
- The current repository already contains the route split required by architecture, but not the secured ops experience:
  - [src/app/(public)/page.tsx](/home/codexuser/bmad-6-workshop/src/app/(public)/page.tsx) serves the public display.
  - [src/app/(ops)/ops/page.tsx](/home/codexuser/bmad-6-workshop/src/app/(ops)/ops/page.tsx) currently calls `notFound()` immediately.
  - [tests/smoke/startup-smoke.test.mjs](/home/codexuser/bmad-6-workshop/tests/smoke/startup-smoke.test.mjs) currently asserts that the ops route remains hidden until secured access exists.
- This story should convert that placeholder into a real, server-gated maintenance entry point without jumping ahead into full status or recovery implementation.
- Scope discipline matters:
  - Story 3.1 owns route separation, local-only gating, and the first keyboard-safe ops shell.
  - Story 3.2 owns readiness state content.
  - Story 3.4 and Story 3.5 own refresh and recovery actions.
  - Do not pull full health diagnostics, manual refresh execution, or restart workflows into this story unless needed as inert placeholders.

### Technical Requirements

- Implement one local-only access decision on the server and reuse it everywhere ops functionality appears.
  - deny by default
  - do not rely on client-side hiding
  - do not introduce user accounts, passwords, or public auth flows
  - do not expose whether a denied request was "almost allowed"
- Keep the ops surface separate from the public display in route tree, rendering, and copy.
  - public viewers stay on one passive display route
  - ops UI lives only in the `(ops)` route tree and related ops feature modules
  - no ops buttons, drawers, banners, or debug text on the public screen
- Make the first ops page intentionally lightweight.
  - include clear operational headings and section framing for later readiness, diagnostics, and recovery work
  - plain-language labels only
  - no raw logs, stack traces, provider payload dumps, or secret-bearing diagnostics
- Keyboard-only use is part of the functional requirement, not a polish item.
  - logical heading order
  - predictable tab sequence
  - visible focus treatment
  - no pointer-only affordances
- Denied access must not degrade the public experience.
  - the public route continues to render normally
  - a denied ops request must not reveal admin terminology on the public page
  - no redirect to the public route with query params or debug state

### Architecture Compliance

- Runtime baseline in the repo remains:
  - `next` `16.1.7`
  - `react` `19.2.3`
  - `react-dom` `19.2.3`
  - `node` `24.x`
- Follow the architecture boundaries already approved:
  - public UI in `src/features/dashboard/*`
  - ops UI in `src/features/ops/*`
  - ops route entry in `src/app/(ops)/ops/*`
  - server-only access control in `src/lib/server/security/*`
  - future ops services in `src/lib/server/ops/*`
- Keep route files thin. The route should compose an ops feature and run access control; it should not become the long-term home for maintenance view logic.
- Preserve same-origin internal API posture and server-only secret handling. This story must not introduce public write endpoints or browser-exposed secrets.
- Stay aligned with the architecture requirement that public and ops routes remain separate route trees and that maintenance actions remain local venue-device behaviors.

### Library / Framework Requirements

- No new libraries are required for Story 3.1. Extend the current stack already in the repo:
  - `next` `16.1.7`
  - `react` `19.2.3`
  - `react-dom` `19.2.3`
  - `@tanstack/react-query` `^5.0.0` remains available for later ops data fetching, but Story 3.1 should not add query complexity without an actual data need
  - `zod` `^4.3.6` remains the validation tool for future ops contracts if request or status schemas are introduced
- Latest official-source sanity checks completed on 2026-03-19:
  - Next.js App Router docs still use route handlers under `app/**/route.ts`, matching the approved route-tree model: https://nextjs.org/docs/app/getting-started/route-handlers
  - React's official `'use client'` guidance still requires serializable server-to-client boundaries, so access decisions should stay server-side and not depend on non-serializable request objects crossing into client components: https://react.dev/reference/rsc/use-client
  - TanStack Query v5 docs still support the query-key patterns already used in the repo, which later ops stories can reuse for `['ops', 'health']`: https://tanstack.com/query/v5/docs/framework/react/guides/queries
  - Node's official releases page lists `v24` as Active LTS as of 2026-03-19, consistent with the repo engine contract: https://nodejs.org/en/about/previous-releases
  - Zod's official docs still identify Zod 4 as the stable line: https://zod.dev/
- No latest-doc signal suggests changing the approved architecture or stack for this story.

### File Structure Requirements

- Expected files to add or reshape:
  - [page.tsx](/home/codexuser/bmad-6-workshop/src/app/(ops)/ops/page.tsx)
  - a new ops feature shell under [src/features/ops](/home/codexuser/bmad-6-workshop/src/features/ops)
  - [assert-ops-access.ts](/home/codexuser/bmad-6-workshop/src/lib/server/security/assert-ops-access.ts)
  - optional supporting env or config helpers under [src/lib/config](/home/codexuser/bmad-6-workshop/src/lib/config) if the allowlist needs central configuration
  - updates to [globals.css](/home/codexuser/bmad-6-workshop/src/app/globals.css) only as needed for restrained ops-shell styling and visible keyboard focus
  - targeted unit coverage under [tests/unit](/home/codexuser/bmad-6-workshop/tests/unit)
  - updated smoke coverage in [startup-smoke.test.mjs](/home/codexuser/bmad-6-workshop/tests/smoke/startup-smoke.test.mjs)
- Existing files to preserve, not redesign beyond this story's needs:
  - [page.tsx](/home/codexuser/bmad-6-workshop/src/app/(public)/page.tsx)
  - [DashboardScreen.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/DashboardScreen.tsx)
  - [DashboardLiveScreen.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/DashboardLiveScreen.tsx)
  - [useDashboardQuery.ts](/home/codexuser/bmad-6-workshop/src/features/dashboard/hooks/useDashboardQuery.ts)
- Keep naming aligned with current repo conventions:
  - component files in `PascalCase.tsx`
  - non-component modules in `kebab-case`
  - route files limited to request and rendering composition

### Testing Requirements

- Minimum verification for implementation:
  - `npm run lint`
  - `npm run typecheck`
  - `npm test`
  - `npm run build`
- Add targeted coverage for:
  - allowed local-only ops access
  - denied non-local or unapproved-host access
  - absence of ops controls on the public route
  - keyboard-usable ops shell structure and visible focus behavior
  - non-leaky denial behavior with no debug or admin disclosure
- Tests must explicitly protect these behaviors:
  - public and ops routes remain separate
  - access control is enforced on the server
  - the public screen stays passive and fact-only
  - the first ops shell uses plain operational language
  - future Epic 3 work has a stable gated entry surface to extend
- Keep testing honest about scope. Story 3.1 does not need to finish:
  - readiness-state business logic from Story 3.2
  - degraded-impact diagnostics from Story 3.3
  - refresh execution from Story 3.4
  - restart recovery orchestration from Story 3.5

### Git Intelligence Summary

- Recent Epic 2 commits (`c8f7dfa`, `c67b394`, `5560765`, `7c59d10`, `a05a3b6`) reinforce the repo pattern to follow here:
  - keep behavior-specific logic in focused modules, not route files
  - preserve the stable public screen rather than mixing in maintenance concerns
  - protect behavior changes with smoke and unit coverage
- The current implementation seam is deliberate:
  - the ops route exists but is held behind a hard placeholder
  - smoke coverage explicitly documents that the route must stay hidden until secure local access exists
- Story 3.1 should treat that as a migration point:
  - replace the placeholder with secured local gating
  - update the smoke expectation to match the new secured behavior
  - avoid weakening the route split or public-screen discipline established earlier

### Latest Tech Information

- Official-source checks on 2026-03-19 confirm the approved technical path remains current:
  - Next.js App Router still supports the route-group structure already used by `src/app/(public)` and `src/app/(ops)`.
  - Server-side route handling remains the right place to enforce access decisions and keep request context off the client boundary.
  - React server/client boundary rules still favor keeping request-derived security decisions on the server.
  - Node `v24` remains Active LTS, matching the repo engine contract.
  - Zod 4 remains stable for future ops request and status contracts.
- Inference: Story 3.1 should stay inside the current Next.js modular-monolith shape and add a server-side access assertion plus a thin ops shell, not a separate auth product or a client-only visibility toggle.

### Project Structure Notes

- The repository already has the minimum foundations this story should build on:
  - separate route groups for public and ops
  - shared styling tokens with early ops accent hooks in [globals.css](/home/codexuser/bmad-6-workshop/src/app/globals.css)
  - an established smoke-test habit for architectural guardrails
- What is still missing is the real local-only access boundary and the first maintenance-facing page shell.
- Avoid regressions toward:
  - ops controls appearing on the public route
  - access checks implemented only in client code
  - a second, inconsistent ops gating rule in later stories
  - dashboard or control-room tone on the ops surface
  - redirects or denial messages that leak admin intent to non-local contexts

### References

- `docs/epics.md#Story 3.1: Provide a Separate Local-Only Ops Access Surface`
- `docs/prd.md` sections covering FR34, NFR14, NFR27, and NFR28
- `docs/ux-design-specification.md` sections covering Button Hierarchy, Feedback Patterns, Form Patterns, and keyboard-safe staff-only setup and recovery
- `docs/architecture.md` sections covering separate route trees, ops-only actions, internal API boundaries, and security gating
- [page.tsx](/home/codexuser/bmad-6-workshop/src/app/(ops)/ops/page.tsx)
- [page.tsx](/home/codexuser/bmad-6-workshop/src/app/(public)/page.tsx)
- [startup-smoke.test.mjs](/home/codexuser/bmad-6-workshop/tests/smoke/startup-smoke.test.mjs)
- [DashboardScreen.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/DashboardScreen.tsx)
- [DashboardLiveScreen.tsx](/home/codexuser/bmad-6-workshop/src/features/dashboard/components/DashboardLiveScreen.tsx)
- [globals.css](/home/codexuser/bmad-6-workshop/src/app/globals.css)

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- Create-story workflow executed in autonomous mode on 2026-03-19.
- Dev-story workflow executed in autonomous mode on 2026-03-19.
- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run build`

### Completion Notes List

- Replaced the placeholder ops route with a server-gated local-only entry that denies by default and maps denied requests to `notFound()`.
- Added a dedicated ops feature shell with keyboard-safe headings, skip link, grouped maintenance actions, and restrained local-only styling.
- Standardized the repo-wide ops access rule to loopback plus `OPS_ALLOWED_HOSTS` so later Epic 3 stories reuse one allowlist.
- Updated smoke and unit coverage to protect route separation, non-leaky denial, allowed local contexts, denied remote contexts, and plain operational labels.
- Story is ready for review and sprint tracking should move `3-1-provide-a-separate-local-only-ops-access-surface` to `review`.

### File List

- docs/sprint-artifacts/3-1-provide-a-separate-local-only-ops-access-surface.md
- docs/sprint-artifacts/sprint-status.yaml
- src/app/(ops)/ops/page.tsx
- src/app/globals.css
- src/features/ops/components/OpsShell.tsx
- src/features/ops/ops-shell-content.js
- src/lib/server/security/assert-ops-access.js
- tests/smoke/startup-smoke.test.mjs
- tests/unit/ops-access.test.mjs
- tests/unit/ops-shell.test.mjs

### Change Log

- Added a server-only local access helper and converted the `(ops)` route from a placeholder to a gated maintenance entry.
- Added the first ops feature shell and styling with plain operational labels, keyboard-visible focus states, and grouped placeholder actions.
- Extended smoke and unit coverage to lock in route separation, local-only access behavior, and keyboard-safe ops structure.
