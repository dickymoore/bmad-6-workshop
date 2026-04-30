# Story 1.1: Starter Scaffold and Shared Harbour Summary Contract

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want HarbourWatch scaffolded from the approved starter stack with a shared normalized harbour summary contract,
so that the UI and adapter can work from one stable data shape without raw provider payloads leaking across the boundary.

## Acceptance Criteria

1. Given the existing workshop repo and approved starter stack, when the workspace is initialized, then the repository contains a local-only npm workspace with `apps/web`, `apps/api`, `packages/shared`, `fixtures`, `cache`, `tests`, and `scripts`, and it preserves the workshop docs and support files already in the repo.
2. Given the scaffold exists, when the shared contract is defined, then the shared package exports a normalized harbour summary envelope plus supporting types for audience, panel state, source metadata, and freshness/state labels, all in camelCase and with no provider-specific payload fields.
3. Given the UI and adapter consume the shared package, when either side imports the contract, then both sides type against the same source of truth and raw NOAA, NWS, WSF, or Socrata payload shapes do not appear in user-facing contracts.
4. Given the starter scaffold is complete, when a developer runs the local workspace, then the project clearly reflects the approved Vite UI starter plus Hono adapter starter and does not introduce a database, auth/admin surface, deployment target, or streaming layer in Phase 1.
5. Given the scaffold is ready for later stories, when the workspace verification commands run, then TypeScript compilation succeeds for the shared package and both runtime packages can resolve the shared contract without duplicate local type definitions.

## Tasks / Subtasks

- [x] Initialize the local workspace scaffold from the approved starter choices. (AC: 1, 4)
  - [x] Create root-level npm workspace config and local dev scripts for `web` and `api`.
  - [x] Establish `apps/web` as the Vite React TypeScript UI starter and `apps/api` as the Hono Node.js adapter starter.
  - [x] Encode the Node 24.x baseline in root metadata and keep the repo-local workshop docs intact.
  - [x] Add only minimal starter entrypoints; remove generic starter demo content that could be mistaken for HarbourWatch UI.
- [x] Define the shared harbour summary contract in `packages/shared`. (AC: 2, 3)
  - [x] Add the normalized envelope, audience identifiers, panel state, source metadata, and freshness/state enums.
  - [x] Keep field names camelCase and avoid provider-shaped fields in the exported contract.
  - [x] Export the contract from a single shared entrypoint for both UI and adapter use.
- [x] Prove the package boundary can compile. (AC: 3, 5)
  - [x] Add package scripts so a root-level check can typecheck the shared package and both runtime packages.
  - [x] Import the shared contract from both `apps/web` and `apps/api` in minimal placeholder code or smoke checks.
  - [x] Avoid duplicate `Audience`, `PanelState`, source metadata, or envelope types in `apps/web` or `apps/api`.
- [x] Add boundary-preserving placeholders only. (AC: 1, 4)
  - [x] Create minimal entry files so the workspace can resolve the starter packages without implementing board features yet.
  - [x] Keep the scaffold local-only and presentation-agnostic; do not add DB, auth, deployment, streaming, or live integration logic in this story.

## Dev Notes

### Developer Context

- This is a staged BMAD workshop repo. Preserve `docs/`, `_bmad/`, `.agents/`, `showcase/`, and other workshop assets while adding the HarbourWatch application scaffold.
- Architecture is already fixed: Vite 8.0.10 / create-vite 9.0.6 for the UI and Hono 4.12.15 / create-hono 0.19.4 for the adapter, with a split local-only workspace.
- The shared contract is the first hard dependency for later UI and adapter stories. Do not let the UI or adapter depend on raw provider payloads or separate ad hoc type definitions.
- Phase 1 excludes database, auth/admin, deployment targets, streaming, or raw diagnostics in the UI.

### Technical Requirements

- Use npm workspaces for the root-local mono-repo shape.
- Keep the project local-only and runnable without live credentials.
- Keep the starter scaffold minimal: package roots, config, entry points, and shared types only.
- Any generated boilerplate should be replaced or reduced so later stories can add the board-first UX cleanly.
- Do not add application features, live adapters, caches, or refresh logic beyond what is needed to establish the starter boundary and shared types.
- Do not implement REST endpoints, provider adapters, fixture loading, cache read/write logic, board components, role switching, design tokens, or live-source calls in this story. Those belong to later stories.
- Keep `.env.example` limited to documented optional future variables if added; do not require `WSDOT_API_ACCESS_CODE` or `SOCRATA_APP_TOKEN` for Story 1.1 verification.

### Architecture Compliance

- Follow the approved split-stack boundary: `apps/web` owns the Vite UI, `apps/api` owns the Hono adapter, and `packages/shared` owns the normalized harbour summary contract.
- Keep raw provider payloads out of the UI package.
- Keep all Story 1.1 artifacts compatible with later stories that will add REST endpoints, caching, and board rendering.
- Maintain camelCase contracts and explicit source/freshness state labels.
- Treat `packages/shared/src` as the only source of truth for shared domain types. Runtime packages may import these types but must not redefine them.
- The starter packages should compile before any live data or UI composition exists.

### Shared Contract Requirements

The shared package should define the minimum contract needed by later stories, without implementing normalization logic yet:

- `Audience`: `terminal`, `harbour-office`, `visitor`
- `SignalState`: `fresh`, `stale`, `unavailable`, `fixture`
- `SourceKind`: `noaa`, `nws`, `wsf`, `socrata`, `fixture`, `local`
- `PanelKind`: enough stable identifiers for the Phase 1 board contract, such as `summary`, `condition`, `tide`, `weather`, `ferry`, `notices`, and `sourceContext`
- `SourceMetadata`: source label, source kind, state, updated timestamp when known, freshness wording, optional validity window, and optional fixture label
- `PanelState`: panel kind, state, title/label text, source metadata, and optional message/value fields suitable for fixture placeholders
- `HarbourSummaryEnvelope`: selected audience, generated timestamp, plain-language summary, condition-strip items or equivalent summary signals, panels, and aggregate source metadata

The contract should intentionally exclude raw provider terms such as NOAA response field names, NWS period payloads, WSF route objects, HTTP diagnostics, stack traces, credentials, and unnormalized raw JSON.

### Library / Framework Requirements

- UI starter: Vite 8.0.10 / create-vite 9.0.6
- Adapter starter: Hono 4.12.15 / create-hono 0.19.4
- Language: TypeScript
- Package manager: npm
- Node baseline: Node.js 24.x Active LTS
- No additional framework choices in this story.
- Use current official starter CLIs consistent with the architecture decisions. If a latest starter minor version differs from the architecture's recorded version, preserve the architecture's approved stack intent and document any generated version difference in completion notes.

### File Structure Requirements

- Root workspace and package config belong at repository root.
- UI package lives under `apps/web`.
- Adapter package lives under `apps/api`.
- Shared contract package lives under `packages/shared`.
- Repository-visible fixtures and runtime cache directories remain separate and untouched by feature logic in this story.
- Keep the documentation and workshop files in place.
- Prefer placeholder `.gitkeep` files for empty `fixtures/`, `cache/`, `tests/`, or `scripts/` directories if needed. Do not create fake product data in Story 1.1.

### Testing Requirements

- Verify the workspace shape and shared contract compile cleanly.
- Verify the starter scaffold does not introduce live-source assumptions, database access, auth, or deployment logic.
- Keep tests proportional to scaffolding work; deeper integration and end-to-end coverage belong to later stories.
- If a smoke check is added, it should prove the workspace can load the shared contract and resolve the starter package boundaries.
- Minimum expected verification: install dependencies, run the root typecheck/check script, and confirm `apps/web` and `apps/api` can import from `packages/shared`.

### Project Structure Notes

- The architecture’s future tree is more detailed than this story needs. Story 1.1 should establish only the minimum scaffold and shared contract needed to unblock later vertical stories.
- If placeholder directories are created for later features, keep them empty or minimally stubbed. Do not prebuild later board components or API routes.
- The architecture validation called out split-stack coordination as the main remaining risk. This story should reduce that risk with one root workflow and one shared contract, not by adding implementation scope.

### References

- [docs/prd.md](docs/prd.md) - Executive summary, MVP boundary, excluded behaviors, and no-control/no-tracking stance.
- [docs/architecture.md](docs/architecture.md) - Selected Starter, Core Architectural Decisions, Project Structure & Boundaries, Implementation Patterns & Consistency Rules.
- [docs/epics.md](docs/epics.md) - Epic 1 Story 1.1 and FR coverage map.
- [docs/ux-design-specification.md](docs/ux-design-specification.md) - Platform Strategy, Core User Experience, and board-first UX constraints.
- [docs/implementation-readiness-report-2026-04-30.md](docs/implementation-readiness-report-2026-04-30.md) - Readiness assessment and FR/UX alignment status.
- [AGENT-REPO-SUMMARY.md](AGENT-REPO-SUMMARY.md) - Workshop repository constraints and stage-boundary expectations.
- [README.md](README.md) - Workshop track model and repo-level operational guidance.

### Project Context Reference

- No `project-context.md` file exists in this repository at story creation time.
- If additional guardrails become necessary during implementation, generate project context separately; do not expand Story 1.1 beyond the starter scaffold and shared contract.

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- Story authored from `docs/prd.md`, `docs/architecture.md`, `docs/epics.md`, `docs/ux-design-specification.md`, and `docs/implementation-readiness-report-2026-04-30.md`.
- Official starter references were checked against current Vite and Hono documentation.
- No previous story file exists in this repo for reuse.
- `npm run test:boundary` initially failed because `packages/shared/src/index.ts` and runtime starter entrypoints did not exist, confirming the boundary verification test was red before implementation.
- `npm install` completed successfully and created the local workspace lockfile.
- `npm run check` passed after implementation: API, web, and shared typechecks passed, and Story 1.1 boundary verification passed.

### Completion Notes List

- Implemented root npm workspace config with Node 24.x engine metadata, local `dev:web`, `dev:api`, `typecheck`, `test:boundary`, and `check` scripts.
- Added minimal Vite React TypeScript web starter and Hono Node adapter starter, both importing `HarbourSummaryEnvelope` from `@harbourwatch/shared`.
- Added `packages/shared/src/index.ts` as the single source of truth for `Audience`, `SignalState`, `SourceKind`, `PanelKind`, `SourceMetadata`, `PanelState`, and `HarbourSummaryEnvelope`.
- Added boundary verification that checks shared exports, runtime imports, and absence of duplicated shared types in runtime packages.
- Kept scaffold local-only and omitted database, auth/admin, deployment, streaming, provider adapters, cache logic, fixture data, REST endpoints, and board features.
- Verified with `npm run check`.

### File List

- apps/api/package.json
- apps/api/src/index.ts
- apps/api/tsconfig.json
- apps/web/index.html
- apps/web/package.json
- apps/web/src/App.tsx
- apps/web/src/main.tsx
- apps/web/tsconfig.json
- apps/web/vite.config.ts
- cache/.gitkeep
- docs/sprint-artifacts/1-1-starter-scaffold-and-shared-harbour-summary-contract.md
- fixtures/.gitkeep
- package-lock.json
- package.json
- packages/shared/package.json
- packages/shared/src/index.ts
- packages/shared/tsconfig.json
- scripts/verify-story-1-1.mjs
- tests/.gitkeep
- tsconfig.json

### Change Log

- 2026-04-30: Implemented Story 1.1 starter scaffold, shared harbour summary contract, workspace verification, and marked story ready for review.
