# Story 1.1: Set Up Initial Project from Approved Starter Template

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a venue operator,
I want the public display application initialized from the approved starter with the right baseline structure,
so that the MVP starts from a reliable, architecture-aligned foundation for the foyer display.

## Acceptance Criteria

1. Given the project has not yet been initialized, when the approved starter command is run and the baseline project is created, then the app uses the approved Next.js, TypeScript, and ESLint foundation, and the project structure separates the future public and ops surfaces in line with the architecture.
2. Given the baseline project is created, when a developer starts the app locally, then a single public display route can render a minimal placeholder shell, and the app does not expose planner-style flows, public admin surfaces, or generic starter content.
3. Given the baseline project is reviewed, when the public route is assessed against product doctrine, then the implementation posture remains calm, shared, venue-native, fact-only, ambient before interactive, location-specific, and not a route planner, and no public interaction pattern requires visitors to click, scroll, search, or enter a destination.

## Tasks / Subtasks

- [x] Initialize the approved empty Next.js starter with TypeScript, ESLint, App Router, `src/`, import aliasing, and no Tailwind. (AC: 1)
  - [x] Use the architecture-approved starter flags: `--ts --eslint --app --src-dir --import-alias "@/*" --empty --use-npm --no-tailwind`. (AC: 1)
  - [x] Preserve existing workshop planning artifacts under `docs/`, `_bmad/`, `.agents/`, and related repo support files while establishing the runnable app scaffold for this repository. (AC: 1)
  - [x] If implementation happens directly in this repository, adapt the starter workflow so the app scaffold lands at repository root rather than creating an extra nested product folder. (AC: 1)
- [x] Establish the baseline public and ops route split without implementing product features yet. (AC: 1, 2)
  - [x] Create one minimal public route entry for the display shell and keep staff or ops code in a separate route tree. (AC: 1, 2)
  - [x] Remove starter boilerplate content and replace it with a minimal placeholder shell that reflects the product’s non-interactive public display posture. (AC: 2, 3)
- [x] Align the scaffold with product doctrine and architecture guardrails before any feature work begins. (AC: 2, 3)
  - [x] Ensure the public route does not contain planner-style search, destination entry, dashboard clutter, or admin controls. (AC: 2, 3)
  - [x] Confirm styling remains custom-CSS based rather than Tailwind-based and that the scaffold leaves room for bespoke display components. (AC: 1, 3)

## Dev Notes

### Developer Context

- This workspace is still a docs-first BMAD workshop repository. There is no existing application scaffold yet: no root `package.json`, no `src/app`, and no `next.config` to extend.
- Treat Story 1.1 as true greenfield scaffold work, but preserve the non-app repository assets already present, especially `docs/`, `_bmad/`, `.agents/`, `.codex/`, `scripts/`, workshop guides, and other facilitator artifacts.
- The architecture’s sample starter command uses `albemarle-pulse` as the app directory name, but for this repository the implementation should land at the repository root unless the user explicitly requests a nested app folder.
- Scope is intentionally narrow for this story: create the approved baseline scaffold and a minimal placeholder public shell only. Do not implement transport providers, weather integrations, dashboard snapshot logic, Zod contracts, TanStack Query polling, health endpoints, or CI pipelines here unless they are the minimum generated defaults from the starter.
- Keep the public product posture visible from the first commit: one calm non-interactive public route, no route-planner flows, no destination entry, no dashboard-like boilerplate, and no public admin or ops controls.
- Separate the future public and ops route trees from the start so later implementation can grow into the architecture without a structural rewrite.
- No previous story file exists for reuse, so this story should establish the initial patterns that later stories will inherit.

### Technical Requirements

- Use the approved empty starter as the baseline scaffold: `npx create-next-app@latest albemarle-pulse --ts --eslint --app --src-dir --import-alias "@/*" --empty --use-npm --no-tailwind`.
- Because this repository already exists and contains workshop materials, adapt the scaffolding process so the generated application files are established at repository root instead of leaving the runnable app inside a second nested `albemarle-pulse/` directory.
- Required baseline outputs from this story:
  - root project config such as `package.json`, `tsconfig.json`, and starter-generated Next.js files
  - `src/app` App Router structure
  - one minimal public route shell
  - a separate placeholder ops route tree or equivalent route-group structure that keeps public and ops code physically separated from the start
  - starter-compatible CSS using custom styles, not Tailwind
- The public shell should render successfully in local development with `npm run dev` and should visibly represent a calm placeholder display, not generic Next.js starter content.
- Keep the scaffold intentionally thin. Do not add data providers, external API calls, user auth, route-planner flows, persistent storage, or operational controls on the public page.
- Keep all existing documentation and BMAD support assets intact. This story establishes the app scaffold alongside the planning repository; it does not replace the repository contents with a clean standalone app template.

### Architecture Compliance

- Runtime baseline is `Next.js 16.x` on `Node.js 24.x Active LTS`.
- Use the App Router with `src/app` as the route entrypoint area.
- Preserve the architecture’s route split from the start:
  - public display route code under a public route tree such as `src/app/(public)/*`
  - ops route code under a separate ops route tree such as `src/app/(ops)/ops/*`
- Keep route handlers, provider adapters, contracts, and feature UI physically separate even if most of those areas remain unimplemented in this story.
- Follow feature-first organization for app-facing code. If placeholder feature folders are created, public display UI belongs under `src/features/dashboard/*` and ops UI belongs under `src/features/ops/*`.
- Use `kebab-case` for directories and non-component files, `PascalCase` for React component files, and `camelCase` for variables and functions.
- Keep styling on the custom-CSS path. Do not introduce Tailwind, component-library scaffolds, or a third-party design system.
- Do not place ops actions, admin surfaces, or maintenance controls on the public route.
- Do not add external-provider logic directly into UI components. Even placeholder public UI should remain presentation-only.
- Do not add planner-style route trees, search flows, destination inputs, or multi-step public workflows. The architecture explicitly supports one stable public display surface.

### Library / Framework Requirements

- Framework: `Next.js 16.x`
- Runtime: `Node.js 24.x Active LTS`
- Language: TypeScript from the starter baseline
- Linting: official Next.js ESLint setup from the starter baseline
- Routing: App Router only
- Styling: custom CSS only for this story; explicitly no Tailwind
- Package manager: `npm`, matching the architecture’s approved starter command
- Do not introduce extra framework choices in this story such as React Router, Tailwind, Zustand, Redux, UI kits, or custom server frameworks.
- `TanStack Query v5` and `Zod 4.x` are architecture requirements for later stories, but they do not need to be added yet unless a later implementation decision explicitly pulls them forward.

### File Structure Requirements

- Establish the application under `src/` rather than mixing route files at repository root.
- Expected baseline route layout for this story:
  - `src/app/layout.tsx`
  - `src/app/globals.css`
  - `src/app/(public)/page.tsx`
  - `src/app/(ops)/ops/page.tsx` or an equivalent separated placeholder ops route
- Remove or replace generic starter content so the public entry route behaves like a minimal display shell rather than a default framework welcome page.
- Keep room for the later architecture without overbuilding it now:
  - public UI will eventually live under `src/features/dashboard/*`
  - ops UI will eventually live under `src/features/ops/*`
  - route handlers will eventually live under `src/app/api/*`
  - server-only logic will eventually live under `src/lib/server/*`
  - shared contracts will eventually live under `src/lib/contracts/*`
- Do not commit runtime-generated snapshots, caches, or operational artifacts under `src/`.
- Keep workshop documentation and planning artifacts in their current locations under `docs/` and related support directories; the app scaffold should coexist with them cleanly.

### Testing Requirements

- Minimum verification for this story:
  - the project installs successfully with `npm install`
  - the scaffold starts successfully with `npm run dev`
  - the public route renders a minimal placeholder shell without generic starter content
  - the route split for public vs ops is present in the file structure
- If linting is available immediately from the starter, run it and fix any scaffold-related issues introduced during adaptation.
- Do not over-engineer test tooling in this story. Architecture-level validation for lint, typecheck, tests, and production build is explicitly covered by Story 1.2.
- If lightweight smoke verification is added, keep it proportional to scaffold setup work and avoid pulling in unrelated end-to-end or integration infrastructure prematurely.

### Project Structure Notes

- The architecture recommends a full production structure that includes `src/app`, `src/features`, `src/lib/contracts`, and `src/lib/server`. Story 1.1 should only create the minimum scaffold needed now while aligning with that future shape.
- The most important structural rule for this story is the route split: public display code and ops code must begin in separate route trees from day one.
- This repository is a workshop repo rather than a clean product repo, so the developer must preserve the surrounding workshop files while introducing the app scaffold at root.
- The architecture examples reference an `albemarle-pulse/` app directory, but in this repository that should be interpreted as the application identity, not as a required nested folder.

### References

- `docs/epics.md#Epic 1: Shared Departure Picture`
- `docs/epics.md#Story 1.1: Set Up Initial Project from Approved Starter Template`
- `docs/prd.md#Executive Summary`
- `docs/prd.md#MVP - Minimum Viable Product`
- `docs/ux-design-specification.md#Platform Strategy`
- `docs/ux-design-specification.md#Core User Experience`
- `docs/architecture.md#Selected Starter: Next.js create-next-app`
- `docs/architecture.md#Core Architectural Decisions`
- `docs/architecture.md#Frontend Architecture`
- `docs/architecture.md#Infrastructure & Deployment`
- `docs/architecture.md#Implementation Patterns & Consistency Rules`
- `docs/architecture.md` recommended project tree section
- `AGENT-REPO-SUMMARY.md#What this repo is`
- `AGENT-REPO-SUMMARY.md#What each branch is supposed to contain`

### Project Context Reference

- No `project-context.md` file exists in this repository at the time of story creation.
- If additional implementation guardrails are needed before development, run the BMAD `generate-project-context` workflow separately.

### Completion Status

- Story context assembled from epics, PRD, UX, architecture, repo constraints, and current sprint status.
- No previous-story intelligence was available because this is the first implementation story.
- Git history confirms this repository is currently at a planning/setup boundary rather than an existing app implementation stage.
- This story is ready for a dev agent to implement as the first runnable scaffold story.

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Implementation Plan

- Create a failing built-in `node:test` smoke test to encode Story 1.1 acceptance criteria before scaffolding.
- Generate the official empty App Router starter from the real `create-next-app` package and adapt its output into the existing workshop repository root.
- Replace generic starter content with a calm public placeholder, add a separate ops route, and add custom CSS without introducing Tailwind or extra framework choices.
- Verify with smoke tests, lint, production build, and a live dev-server check for `/` and `/ops`.

### Debug Log References

- `node --test` failed before scaffold creation, then passed after implementation and review fixes using `tests/smoke/startup-smoke.test.mjs`.
- Official starter package was generated via `node <downloaded create-next-app tarball>/dist/index.js ... --skip-install --disable-git`.
- `npm install` required `--strict-ssl=false` in this shell because the local Node/npm environment could not validate the npm registry certificate chain.
- Verified with `npm test`, `npm run lint`, `npm run build`, and a live `npm run dev` check against `/` and `/ops`.

### Completion Notes List

- Implemented the official Next.js 16 empty TypeScript App Router scaffold at repository root with preserved workshop docs and support files.
- Added root project config files, custom CSS, a public placeholder route at `/`, and a separate ops route tree for later local-only use.
- Added a minimal built-in smoke test covering scaffold presence, route separation, and non-generic placeholder content.
- Verified clean lint and production build results, plus live dev-server rendering for both placeholder routes.
- `npm` registry access in this environment required the install-time workaround `--strict-ssl=false`; source code and runtime config were not changed to depend on that flag.
- Local verification ran on Node `22.22.1` because that is the installed shell runtime here; project guidance still targets Node `24.x` for the intended deployment baseline.
- Senior review fixes hid the `/ops` scaffold behind a `404` response until a local-only ops access story is implemented, rewrote the public route copy to remain venue-facing, encoded the Node `24.x` baseline in project metadata, and moved the smoke test into a portable discovery-based location.

### File List

- .gitignore
- .nvmrc
- docs/sprint-artifacts/1-1-set-up-initial-project-from-approved-starter-template.md
- docs/sprint-artifacts/sprint-status.yaml
- eslint.config.mjs
- next.config.ts
- package-lock.json
- package.json
- src/app/(ops)/ops/page.tsx
- src/app/(public)/page.tsx
- src/app/globals.css
- src/app/layout.tsx
- tests/smoke/startup-smoke.test.mjs
- tsconfig.json

## Senior Developer Review (AI)

### Review Date

- 2026-03-18

### Outcome

- Approved after review fixes

### Findings Resolved

- Hid the scaffolded `/ops` path behind `notFound()` so the route tree exists without exposing a public admin surface before Story 3.1.
- Rewrote the public route copy to stay calm, venue-facing, fact-only, and explicitly non-interactive.
- Encoded the Node `24.x` baseline in `package.json` and `.nvmrc`, and updated the Node type package to match.
- Replaced the story-specific absolute-path smoke test with a portable discovery-based smoke test under `tests/smoke/`.
- Prepared the scaffold files to be staged cleanly so the story file list matches diffable implementation artifacts instead of only untracked working-tree state.

### Verification

- `npm install --strict-ssl=false` completed with the expected `EBADENGINE` warning under local Node `22.22.1` because the project now declares the target Node `24.x` runtime explicitly.
- `npm test`
- `npm run lint`
- `npm run build`
- `npm run dev` with `HEAD /` returning `200` and `HEAD /ops` returning `404`

## Change Log

- 2026-03-18: Implemented Story 1.1 by bootstrapping the official Next.js 16 empty App Router scaffold into the repository root, adding separate public and ops placeholder routes, custom CSS, and scaffold smoke-test coverage.
- 2026-03-18: Applied senior review fixes to keep `/ops` non-public, align the public copy with product doctrine, encode the Node 24 baseline, and move smoke coverage to a portable `tests/smoke` path.
