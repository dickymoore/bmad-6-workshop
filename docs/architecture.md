---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
inputDocuments:
  - docs/prd.md
  - docs/product-brief-harbourwatch-phase-1.md
  - docs/product-brief-harbourwatch-phase-1-distillate.md
  - docs/research/domain-harbourwatch-phase-1-data-sources-research-2026-04-28.md
  - docs/research/technical-harbourwatch-phase-1-api-integration-notes-2026-04-28.md
  - docs/ux-design-specification.md
  - docs/ux-design-directions.html
  - docs/ux-color-themes.html
workflowType: architecture
lastStep: 8
status: complete
completedAt: 2026-04-30
project_name: bmad-6-workshop
user_name: Dicky
date: 2026-04-30
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**

HarbourWatch needs a local-only waterfront display with three role views: terminal, harbour-office, and visitor. The core UI is a board-first experience composed of a condition strip, harbour day summary, tide/weather/ferry panels, local notices, and a quiet source/freshness line. The system must normalize NOAA CO-OPS, NWS, WSDOT/WSF, optional Socrata, and fixture-backed local data into a common signal model. It must support role-based audience filtering, manual refresh, stale/unavailable/fixture states, and fixture-only mode for workshops and demos. The product boundary is explicit: no vessel tracking, no control workflows, no route planning, no auth/admin surface, and no raw diagnostics in the UI.

**Non-Functional Requirements:**

The architecture must favor local startup, deterministic fixture-backed rendering, and graceful degradation when any live provider fails. Optional credentials for WSDOT and Socrata must not block the app. NOAA and NWS integrations must be cached and freshness-aware. The UI must remain legible in fresh, stale, unavailable, and fixture-backed states, with strong contrast and no color-only signaling. The product should render a complete fixture-backed board quickly on a typical dev laptop and preserve the current readable display during refresh.

**Scale & Complexity:**

This is a medium-complexity local web app. The difficult parts are not user accounts or multi-tenancy; they are source normalization, audience filtering, cache/freshness handling, and maintaining a calm board-first experience across degraded states.

- Primary domain: local web app with a small backend-for-frontend/API layer
- Complexity level: medium
- Estimated architectural components: 8-10

### Technical Constraints & Dependencies

- NOAA CO-OPS station `9447130` is the tide and water-level source.
- NWS requires a unique `User-Agent` and cache-aware handling.
- WSDOT/WSF live schedule data requires an access code when enabled.
- Socrata is optional and low-prominence.
- Fixtures must be repository-visible, version-controlled, audience-tagged, and validity-bounded.
- Credentials must stay server-side only.
- The app should work locally without deployment complexity.
- The UX expects a board-first screen model with no deep navigation, auth, or admin workflows.

### Cross-Cutting Concerns Identified

- Signal normalization across live and fixture sources.
- Role-based disclosure and audience filtering.
- Fresh/stale/unavailable/fixture consistency.
- Local caching and refresh behavior.
- Credential isolation and safe failure handling.
- Accessibility and contrast across all board states.
- Responsive board layout that preserves reading order.
- Semantic boundary enforcement in copy and visuals.

## Starter Template Evaluation

### Primary Technology Domain

Local web app with a small backend-for-frontend/API layer.

### Starter Options Considered

1. **Next.js 16.2.4 / create-next-app 16.2.4**
   - Official starter for a single app with UI plus route handlers.
   - Supports App Router, TypeScript, Tailwind, Biome or ESLint, `src/`, and `--api` route handler scaffolding.
   - Fits the fixture-first adapter model because server-side source normalization, caching, and credential isolation can live beside the UI.

2. **Vite 8.0.10 / create-vite 9.0.6**
   - Best for a pure client-side frontend.
   - Official templates are strong for `react-ts` and similar UI-first setups.
   - Would still require a separate backend starter or server layer for live adapters, cache control, and secret isolation.

3. **Hono 4.12.15 / create-hono 0.19.4**
   - Excellent lightweight web framework for adapter endpoints and local APIs.
   - Works well as a BFF or server companion.
   - Not a full UI starter, so it would still need a separate frontend scaffold.

### Selected Starter: Vite + Hono Split Foundation

Under a strict Occam's Razor reading, the smallest sufficient foundation for HarbourWatch is a split stack:

- **UI starter:** Vite 8.0.10 / create-vite 9.0.6
- **Adapter starter:** Hono 4.12.15 / create-hono 0.19.4

This is the lightest architecture that still cleanly supports the project's real shape: a board-first web UI plus a small server-side adapter layer for fixture loading, optional live APIs, cache handling, and credential isolation.

Next.js remains the cleaner single-starter fallback if the team prefers one integrated framework, but it adds framework surface we do not need for a local, fixture-first demo.

**Rationale for Selection:**

HarbourWatch is mostly a display problem, not a routing or application-platform problem. The UI is a single board-first screen with role switching and refresh. The backend work is narrow: normalize a few external sources, keep secrets server-side, and serve fixture-backed aggregates consistently.

That makes a split foundation more honest than a heavier full-stack starter. Vite keeps the front end lean and explicit. Hono keeps the adapter layer small, portable, and local. Together they preserve the adapter-driven design without pulling in unnecessary framework conventions.

**Initialization Commands:**

```bash
npm create vite@latest harbourwatch-web -- --template react-ts
npm create hono@latest harbourwatch-api -- --template nodejs
```

**Architectural Decisions Provided by Starter:**

**Language & Runtime:**
- TypeScript on both sides.
- Node.js for the Hono adapter.
- Explicit browser/server boundary instead of a framework-concealed one.

**Styling Solution:**
- Vite pairs cleanly with the token-driven custom visual system already defined in the UX spec.
- Tailwind can be layered in on the UI side without forcing any opinionated app shell semantics.

**Build Tooling:**
- Vite gives a small, fast UI dev server.
- Hono gives a lightweight local adapter process for fixture-first and optional live source routes.
- The two-process model stays simple and obvious.

**Testing Framework:**
- No heavy testing stack is imposed by the starter.
- Add UI and adapter tests deliberately after the architecture is fixed.
- Keep the first pass focused on reliable local behavior and deterministic fixtures.

**Code Organization:**
- Separate `web` and `api` packages or app folders.
- Clear ownership boundaries for UI, adapters, fixtures, and shared types.
- Small shared contracts for normalized harbour data.

**Development Experience:**
- Fast local feedback for the UI.
- Small adapter surface for source normalization and caching.
- Easy to keep fixture-first behavior dominant.
- No auth, admin, or deployment plumbing required to get the demo working.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
- No database in Phase 1; use repository-visible JSON fixtures and local cache files.
- No authentication or authorization in Phase 1.
- Use simple REST JSON endpoints from the Hono adapter.
- Use local React state plus thin fetch helpers in the Vite UI.
- Run the system locally with no deployment target in Phase 1.
- Keep the app as a single repo with a clearly bounded UI package and adapter package, not as two loosely coupled projects.

**Important Decisions (Shape Architecture):**
- Use a normalized harbour summary envelope with per-source metadata and per-panel state.
- Keep raw provider payloads out of the UI.
- Use an in-memory cache backed by small local JSON cache files.
- Keep live-source credentials server-side in the Hono adapter process via environment variables.
- Keep the architecture adapter-driven and fixture-first.
- Treat the split Vite + Hono stack as a deliberate local-only boundary, not as a precursor to distributed deployment.

**Deferred Decisions (Post-MVP):**
- SQLite or any database history layer, if history or admin workflows appear later.
- Context/reducer/store libraries, if the app grows beyond one board screen.
- Streaming or SSE, if real-time updates become necessary later.
- Cloud deployment architecture, if the demo later becomes a production app.
- Replacing the split stack with a single-app framework, unless local coordination overhead becomes a real implementation problem.

### Data Architecture

HarbourWatch uses no database in Phase 1.

Persistent project data lives in repository-visible JSON fixture files. Live NOAA, NWS, WSF, and optional Socrata responses are normalized in the Hono adapter layer before they are exposed to the UI. The UI never receives raw provider payloads.

The canonical data shape is a single normalized harbour summary envelope with:
- selected audience
- overall harbour summary
- per-panel state
- per-source metadata
- freshness / stale / unavailable / fixture labels
- source timestamps where available
- fixture provenance where applicable

Caching uses a dual local strategy:
- in-memory cache for the current process
- small JSON cache files on disk for restart resilience and stale labeling

This keeps the demo stable across refreshes and restarts while preserving explicit stale-state handling.

### Authentication & Security

HarbourWatch has no user authentication or authorization in Phase 1.

The app is local-only, with no admin surface and no public write endpoints. Security depends on the local runtime boundary and on keeping live-source credentials server-side in the Hono adapter process.

Credential rules:
- secrets live only in environment variables on the server side
- the Vite UI never sees WSDOT or other live-source credentials
- adapter routes are read-oriented in Phase 1
- no browser-exposed secret handling

This matches the demo scope and avoids unnecessary user-management complexity.

### API & Communication Patterns

The Vite UI talks to the Hono adapter using simple REST JSON endpoints.

Primary endpoint:
- `GET /api/harbour-summary?audience=terminal|harbour-office|visitor`

Supporting endpoints:
- `GET /api/health`
- `POST /api/refresh` only if the implementation needs an explicit refresh trigger; otherwise the UI can refresh by re-fetching the summary endpoint

Communication rules:
- no streaming for Phase 1
- no GraphQL
- no RPC layer
- the main API response is aggregate-first and role-aware
- source-specific payloads remain hidden behind the adapter boundary
- the UI and adapter should share a single normalized contract to avoid drift

This keeps the contract obvious and aligned with the board-first UX.

### Frontend Architecture

The frontend uses local React state plus thin fetch helpers.

State held at the top level:
- selected audience
- pending refresh status
- current harbour summary payload

State rules:
- no Context for Phase 1
- no reducer store unless the app expands materially
- no Zustand or query library unless later stories introduce more screens or synchronization needs
- role switching is immediate and re-renders the same board with changed hierarchy and disclosure
- refresh preserves the current readable state while new data is loading

This is sufficient for a one-screen display with one primary fetch path.

### Infrastructure & Deployment

Phase 1 is local-only.

The runtime model is:
- Vite UI started locally
- Hono adapter started locally
- simple npm scripts for each process
- a root-level convenience script can be added later if needed

Infrastructure exclusions for Phase 1:
- no Docker
- no cloud deployment target
- no CI/CD architecture
- no observability stack beyond basic local logging
- no production hosting assumptions

This keeps the demo lightweight and easy to run in the workshop environment.

### Decision Impact Analysis

**Implementation Sequence:**
1. Create repository-visible JSON fixtures and normalized harbour summary contracts.
2. Implement the Hono adapter with source normalization, cache loading, and REST endpoints.
3. Scaffold the Vite UI and top-level board state.
4. Wire role switching and aggregate refresh to the summary endpoint.
5. Add local cache file persistence and stale-state labeling.
6. Add demo health reporting.
7. Add later-only decisions only if the implementation grows beyond the Phase 1 boundary.

**Cross-Component Dependencies:**
- The fixture schema drives both adapter normalization and UI rendering.
- The summary envelope defines panel state, source labels, and freshness behavior.
- Cache behavior affects refresh behavior and demo resilience.
- Security decisions constrain where credentials can exist and what endpoints can expose.
- The local-only deployment decision keeps the architecture simple and removes the need for environment-specific branching.
- The split-stack decision requires a shared contract and a single root-level workflow, or it stops being a simplification.

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

**Critical Conflict Points Identified:**
8 areas where AI agents could make different choices:
- repository and package naming
- API endpoint naming
- shared contract and JSON field casing
- fixture and cache file organization
- component and helper naming
- response and error shapes
- loading and refresh state handling
- logging and failure reporting

### Naming Patterns

**Repository and Package Naming Conventions:**
- Use lowercase kebab-case for packages, folders, fixtures, and cache files.
- Use `web` for the Vite app and `api` for the Hono adapter when separate package folders are needed.
- Use `packages/shared` for any shared TypeScript contracts.
- Use `fixtures/` for repository-visible harbour data, grouped by source or audience when needed.
- Use `cache/` for local JSON cache files that should not be treated as source-of-truth fixtures.

Examples:
- `apps/web`
- `apps/api`
- `packages/shared`
- `fixtures/noaa/`
- `cache/harbour-summary-terminal.json`

**API Naming Conventions:**
- Use REST JSON endpoints with lowercase kebab-case paths.
- Keep the aggregate endpoint singular in meaning but plural in capability: `GET /api/harbour-summary`.
- Use query parameters for audience selection: `audience=terminal|harbour-office|visitor`.
- Use short, explicit supporting endpoints: `GET /api/health`, `POST /api/refresh`.
- Keep route parameters out of Phase 1 unless a later story requires them.

**Code Naming Conventions:**
- Use PascalCase for React components.
- Use camelCase for functions, variables, hooks, and object properties in code.
- Use `use` prefixes for React hooks.
- Use `get`, `build`, `normalize`, `load`, `save`, and `format` prefixes for pure helper functions where that intent is useful.
- Use descriptive component names tied to the board model, such as `ConditionStrip`, `HarbourSummary`, `PanelGrid`, and `SourceLine`.

### Structure Patterns

**Project Organization:**
- Keep the repo as one workspace with two bounded runtime areas: UI and adapter.
- Keep shared types in one place and import them from both sides instead of duplicating contracts.
- Keep fixture parsing and source normalization in the adapter, not in the UI.
- Keep board composition and role-specific rendering in the UI, not in the adapter.
- Keep tests close to the code they validate unless a later testing layer needs centralization.

**File Structure Patterns:**
- Place app-specific code under `apps/web` and `apps/api` or equivalent root folders.
- Place shared TypeScript types and constants under `packages/shared`.
- Place repository-visible fixtures under `fixtures/`.
- Place runtime cache files under `cache/`.
- Keep documentation under `docs/` and do not mix architecture notes into implementation folders.

### Format Patterns

**API Response Formats:**
- Return direct JSON objects, not wrapped envelopes with unrelated metadata.
- Use one normalized harbour summary envelope per request.
- Use `camelCase` for all JSON field names.
- Keep per-panel state embedded in the summary envelope rather than splitting the response into multiple unrelated payloads.
- Use ISO 8601 strings for timestamps.

**Data Exchange Formats:**
- Use `camelCase` in TypeScript and JSON.
- Use booleans as `true` and `false`, never `1` and `0`.
- Use `null` explicitly for missing optional values.
- Keep arrays as arrays even when they contain one item, unless a contract explicitly requires a scalar.
- Keep fixture and cache files as human-readable JSON.

### Communication Patterns

**Event System Patterns:**
- Phase 1 does not use an event bus or streaming channel.
- Refresh is a request/response action, not a push subscription.
- If later work introduces events, use lowercase noun phrases for event names and keep payloads aligned with the shared harbour summary contract.

**State Management Patterns:**
- Keep selected audience, refresh state, and current summary in top-level React component state.
- Treat the fetched summary as server state, but do not introduce a query library for Phase 1.
- Update state immutably.
- Preserve the existing readable board while refresh is pending.
- Change role selection by re-prioritizing the same board modules, not by navigating to a different state tree.

### Process Patterns

**Error Handling Patterns:**
- Keep raw provider errors in adapter logs, not in the UI.
- Show user-facing failure states as calm, labeled board states such as `stale`, `unavailable`, or `fixture-backed`.
- Preserve the last readable summary when a refresh fails if the prior data is still valid to show.
- Return adapter errors with a small consistent error shape such as `{ error: { code, message } }`.
- Distinguish between a true failure and a stale-but-usable fallback.

**Loading State Patterns:**
- Use explicit `idle`, `loading`, and `refreshing` states in UI code.
- `loading` applies to initial fetch.
- `refreshing` applies when the board already has content and the user requests an update.
- Do not blank the board during refresh unless no previous summary exists.
- Keep loading indicators quiet and local to the affected area.

### Enforcement Guidelines

**All AI Agents MUST:**
- Use the shared normalized harbour summary contract for both adapter output and UI rendering.
- Keep all JSON and TypeScript field names in camelCase.
- Preserve the board during refresh and label stale or unavailable data explicitly.

**Pattern Enforcement:**
- Verify patterns through shared types, fixture validation, and adapter response shape checks.
- Document any naming or contract deviation in `docs/architecture.md` before implementing around it.
- If a pattern must change, update the shared contract first, then update adapter and UI code together.

### Pattern Examples

**Good Examples:**
- `GET /api/harbour-summary?audience=visitor`
- `ConditionStrip.tsx`
- `harbourSummary.currentTide`
- `cache/harbour-summary-harbour-office.json`
- `loading`, `refreshing`, `stale`, `unavailable`

**Anti-Patterns:**
- `GetHarbourSummary`
- `harbour_summary`
- raw NOAA or WSDOT payloads rendered directly in the UI
- mixing fixture files and cache files in the same folder without labels
- blanking the board during refresh

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:**
The technology choices work together cleanly. Vite handles the board-first UI, Hono handles the local adapter layer, and the shared contract keeps both sides aligned. The no-database, no-auth, local-only, fixture-first decisions all reinforce the same demo boundary instead of pulling the design in different directions. The split stack does add coordination overhead, but the architecture already contains the guardrails needed to keep it from behaving like two unrelated projects.

**Pattern Consistency:**
The implementation patterns support the architectural decisions. Naming is consistent across packages, endpoints, shared contracts, fixtures, and cache files. JSON and TypeScript field casing are aligned. Loading, refresh, stale-state, and error handling patterns all reinforce the board-first UX and the adapter-driven boundary.

**Structure Alignment:**
The project structure supports the architecture. UI, adapter, shared contract, fixtures, cache, tests, and scripts all have explicit homes. The boundaries are clear enough to keep raw provider payloads out of the UI and to keep caching and normalization in the adapter layer.

### Requirements Coverage Validation ✅

**Epic/Feature Coverage:**
The architecture supports the full HarbourWatch feature set as defined in the PRD and UX spec. The board-first harbour read, role switching, condition strip, harbour day summary, source freshness, fixture fallback, and public-safe visitor view all map cleanly to the chosen architecture.

**Functional Requirements Coverage:**
All core functional requirements are architecturally supported: normalized summary generation, role-aware rendering, manual refresh, live source integration, optional fixture-backed mode, stale/unavailable labeling, and local demo fallback. The architecture does not introduce unnecessary features that would conflict with the product boundary.

**Non-Functional Requirements Coverage:**
The architecture addresses local startup, deterministic fixture-backed rendering, cache-aware freshness, graceful degradation, credential isolation, and strong contrast across states. Security and deployment constraints are also covered by the local-only runtime and server-side credential handling.

### Implementation Readiness Validation ✅

**Decision Completeness:**
The critical decisions are documented with enough specificity to implement Phase 1 without reopening the major architecture questions. The starter choice, data shape, API pattern, state approach, security model, and deployment boundary are all fixed.

**Structure Completeness:**
The project structure is explicit and concrete. It defines the root workspace, the two runtime apps, the shared contract area, fixtures, cache, scripts, and tests. The structure is specific enough to guide implementation without leaving major directories ambiguous.

**Pattern Completeness:**
The naming, format, communication, error handling, and loading-state patterns are sufficient to keep multiple agents consistent. The shared normalized harbour summary contract is the main coordination mechanism, which is exactly what this project needs.

### Gap Analysis Results

**Critical Gaps:**
None identified.

**Important Gaps:**
The main remaining risk is operational coordination rather than architecture correctness. The split-stack setup needs one clear root-level workflow so the Vite UI and Hono adapter do not feel like separate projects during development. The shared harbour summary contract also needs to remain the single source of truth for both packages or the UI and adapter can drift.

**Nice-to-Have Gaps:**
A root-level convenience script for starting both local processes together would reduce demo friction. Explicit fixture-versus-cache labeling in README notes or developer docs would also help prevent confusion during implementation.

### Validation Issues Addressed

No blocking issues were found. The only notable refinement is the split-stack coordination boundary, which is now explicitly constrained by the shared contract, the adapter responsibility split, and the local-only runtime model.

### Architecture Completeness Checklist

**✅ Requirements Analysis**

- [x] Project context thoroughly analyzed
- [x] Scale and complexity assessed
- [x] Technical constraints identified
- [x] Cross-cutting concerns mapped

**✅ Architectural Decisions**

- [x] Critical decisions documented with versions
- [x] Technology stack fully specified
- [x] Integration patterns defined
- [x] Performance considerations addressed

**✅ Implementation Patterns**

- [x] Naming conventions established
- [x] Structure patterns defined
- [x] Communication patterns specified
- [x] Process patterns documented

**✅ Project Structure**

- [x] Complete directory structure defined
- [x] Component boundaries established
- [x] Integration points mapped
- [x] Requirements to structure mapping complete

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION

**Confidence Level:** High based on validation results

**Key Strengths:**
- Fixture-first and local-only are consistent throughout the stack
- The adapter boundary is clear and enforceable
- The normalized harbour summary contract prevents UI/adapter drift
- The structure is specific without being overbuilt for a demo
- The UX, architecture, and implementation patterns all point in the same direction

**Areas for Future Enhancement:**
- Formalize the workspace mechanism if coordination friction appears
- Add a root-level convenience script for dual-process startup when implementation begins
- Introduce SQLite only if history or admin workflows become real requirements later

### Implementation Handoff

**AI Agent Guidelines:**
- Follow all architectural decisions exactly as documented
- Use implementation patterns consistently across all components
- Respect project structure and boundaries
- Refer to this document for all architectural questions

**First Implementation Priority:**
Create the repository-visible JSON fixtures, the normalized harbour summary contract, and the Hono adapter routes before wiring the Vite UI.

## Project Structure & Boundaries

### Complete Project Directory Structure

```text
harbourwatch/
├── README.md
├── package.json
├── .gitignore
├── .env.example
├── apps/
│   ├── web/
│   │   ├── index.html
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   ├── tsconfig.json
│   │   ├── src/
│   │   │   ├── main.tsx
│   │   │   ├── app/
│   │   │   │   ├── HarbourBoard.tsx
│   │   │   │   ├── BoardShell.tsx
│   │   │   │   └── roleViews.ts
│   │   │   ├── components/
│   │   │   │   ├── ConditionStrip.tsx
│   │   │   │   ├── HarbourSummary.tsx
│   │   │   │   ├── PanelGrid.tsx
│   │   │   │   ├── SourceLine.tsx
│   │   │   │   ├── RoleSwitcher.tsx
│   │   │   │   └── RefreshButton.tsx
│   │   │   ├── features/
│   │   │   │   └── harbour/
│   │   │   │       ├── HarbourPanels.tsx
│   │   │   │       ├── HarbourState.ts
│   │   │   │       └── useHarbourSummary.ts
│   │   │   ├── lib/
│   │   │   │   ├── api.ts
│   │   │   │   └── formatters.ts
│   │   │   ├── styles/
│   │   │   │   └── globals.css
│   │   │   └── types/
│   │   │       └── ui.ts
│   │   └── public/
│   │       └── assets/
│   └── api/
│       ├── package.json
│       ├── tsconfig.json
│       ├── src/
│       │   ├── index.ts
│       │   ├── app.ts
│       │   ├── routes/
│       │   │   ├── harbour-summary.ts
│       │   │   ├── health.ts
│       │   │   └── refresh.ts
│       │   ├── adapters/
│       │   │   ├── noaa.ts
│       │   │   ├── nws.ts
│       │   │   ├── wsf.ts
│       │   │   ├── socrata.ts
│       │   │   └── fixtures.ts
│       │   ├── cache/
│       │   │   └── cacheStore.ts
│       │   ├── domain/
│       │   │   ├── harbour-summary.ts
│       │   │   └── panel-state.ts
│       │   ├── lib/
│       │   │   ├── env.ts
│       │   │   ├── logger.ts
│       │   │   └── response.ts
│       │   └── types/
│       │       └── api.ts
│       └── test/
│           ├── route.test.ts
│           └── adapter.test.ts
├── packages/
│   └── shared/
│       ├── package.json
│       ├── tsconfig.json
│       └── src/
│           ├── harbour-summary.ts
│           ├── panel-state.ts
│           ├── audience.ts
│           └── formats.ts
├── fixtures/
│   ├── noaa/
│   ├── nws/
│   ├── wsf/
│   ├── socrata/
│   └── local-notices/
├── cache/
│   ├── harbour-summary-terminal.json
│   ├── harbour-summary-harbour-office.json
│   └── harbour-summary-visitor.json
├── tests/
│   ├── integration/
│   │   ├── harbour-summary.test.ts
│   │   └── cache-behavior.test.ts
│   └── e2e/
│       ├── role-switching.spec.ts
│       └── refresh.spec.ts
├── scripts/
│   ├── dev.sh
│   ├── check-fixtures.sh
│   └── sync-cache.sh
└── docs/
    ├── architecture.md
    ├── prd.md
    ├── ux-design-specification.md
    ├── ux-design-directions.html
    └── ux-color-themes.html
```

### Architectural Boundaries

**API Boundaries:**
- The browser only talks to the Hono adapter on localhost.
- Public endpoints are read-oriented in Phase 1.
- `GET /api/harbour-summary` is the main boundary for data delivery.
- `GET /api/health` reports demo and source status.
- `POST /api/refresh` exists only if an explicit refresh trigger is needed.
- No auth boundary, write boundary, or admin boundary exists in Phase 1.

**Component Boundaries:**
- `apps/web` owns board composition, role switching, refresh UI, and rendering.
- `apps/api` owns adapter logic, normalization, caching, and source access.
- `packages/shared` owns the normalized harbour summary contract and shared enums.
- UI components never parse provider payloads directly.
- Adapter code never renders UI state.

**Service Boundaries:**
- NOAA, NWS, WSF, Socrata, and fixtures are isolated behind adapter modules.
- Each adapter returns normalized domain data, not raw provider shapes.
- Cache services read and write only the normalized summary envelope and cache metadata.

**Data Boundaries:**
- Repository-visible JSON fixtures are the source of truth for demo fallback behavior.
- File-backed cache records are separate from fixtures and labeled as cache state.
- Raw provider payloads remain server-side and out of the UI.
- The UI receives one normalized payload per audience, plus freshness and source metadata.

### Requirements to Structure Mapping

**Feature / Requirement Mapping:**
- Board-first harbour read, role switching, and source/freshness display → `apps/web/src/app/` and `apps/web/src/components/`
- NOAA / NWS / WSF / Socrata normalization → `apps/api/src/adapters/`
- Local fixtures and demo fallback → `fixtures/` and `apps/api/src/adapters/fixtures.ts`
- Cache resilience and stale-state labeling → `apps/api/src/cache/` and `cache/`
- Shared domain contract → `packages/shared/src/`
- Demo health checks → `apps/api/src/routes/health.ts`
- Manual refresh behavior → `apps/web/src/components/RefreshButton.tsx` and `apps/api/src/routes/refresh.ts`

**Cross-Cutting Concerns:**
- Shared state shape and naming → `packages/shared/src/`
- Source provenance and freshness → `apps/api/src/domain/` and `apps/web/src/components/SourceLine.tsx`
- Local-only startup and script orchestration → root `package.json` and `scripts/`
- Test placement close to validated code → `apps/api/test/` and `tests/`
- Static assets and board visuals → `apps/web/public/assets/`

### Integration Points

**Internal Communication:**
- The UI fetches the normalized summary from the adapter and renders it directly.
- The UI sends only audience selection and refresh intent.
- Shared types keep the UI and adapter aligned on field names and states.
- The adapter loads fixtures, cache, and live providers in a single normalization pipeline.

**External Integrations:**
- NOAA CO-OPS adapter handles tide and water-level data.
- NWS adapter handles weather and visibility context.
- WSF adapter handles ferry schedules and alerts when credentials are enabled.
- Socrata adapter remains optional and low prominence.

**Data Flow:**
- Live source or fixture data enters the adapter.
- Adapter normalizes it into one harbour summary envelope.
- Cache service stores the normalized envelope and stale metadata.
- UI fetches the envelope for the selected audience and renders the board.
- Refresh re-fetches the envelope without changing the UI contract.

### File Organization Patterns

**Configuration Files:**
- Root configuration stays at the repository root for discoverability.
- App-specific config files stay inside each app package.
- Environment examples stay at the root so the demo setup is obvious.

**Source Organization:**
- Shared domain types live in `packages/shared/src/`.
- UI features live under `apps/web/src/features/`.
- Adapter responsibilities live under `apps/api/src/adapters/`, `routes/`, `cache/`, and `domain/`.

**Test Organization:**
- Adapter tests stay with the adapter package.
- Integration tests live at the repository level when they span UI and adapter boundaries.
- End-to-end tests stay in `tests/e2e/`.

**Asset Organization:**
- Fixture files are grouped by source or notice type under `fixtures/`.
- Runtime cache files stay in `cache/`.
- Browser assets live in `apps/web/public/assets/`.

### Development Workflow Integration

**Development Server Structure:**
- Run the Vite UI and Hono adapter locally as separate processes.
- Use a root-level script to start both when convenience matters.
- Keep local environment setup simple and explicit.

**Build Process Structure:**
- Build the UI and adapter independently.
- Keep shared types compiled as part of both packages.
- Do not introduce a deployment pipeline in Phase 1.

**Deployment Structure:**
- There is no production deployment architecture for Phase 1.
- Local runtime behavior is the only required execution model.
- Docker, cloud hosting, and CI/CD are deferred until the app stops being a demo.

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

**Critical Conflict Points Identified:**
8 areas where AI agents could make different choices:
- repository and package naming
- API endpoint naming
- shared contract and JSON field casing
- fixture and cache file organization
- component and helper naming
- response and error shapes
- loading and refresh state handling
- logging and failure reporting

### Naming Patterns

**Repository and Package Naming Conventions:**
- Use lowercase kebab-case for packages, folders, fixtures, and cache files.
- Use `web` for the Vite app and `api` for the Hono adapter when separate package folders are needed.
- Use `shared/` for any shared TypeScript contracts.
- Use `fixtures/` for repository-visible harbour data, grouped by source or audience when needed.
- Use `cache/` for local JSON cache files that should not be treated as source-of-truth fixtures.

Examples:
- `apps/web`
- `apps/api`
- `shared/src`
- `fixtures/noaa/`
- `cache/harbour-summary-terminal.json`

**API Naming Conventions:**
- Use REST JSON endpoints with lowercase kebab-case paths.
- Keep the aggregate endpoint singular in meaning but plural in capability: `GET /api/harbour-summary`.
- Use query parameters for audience selection: `audience=terminal|harbour-office|visitor`.
- Use short, explicit supporting endpoints: `GET /api/health`, `POST /api/refresh`.
- Keep route parameters out of Phase 1 unless a later story requires them.

**Code Naming Conventions:**
- Use PascalCase for React components.
- Use camelCase for functions, variables, hooks, and object properties in code.
- Use `use` prefixes for React hooks.
- Use `get`, `build`, `normalize`, `load`, `save`, and `format` prefixes for pure helper functions where that intent is useful.
- Use descriptive component names tied to the board model, such as `ConditionStrip`, `HarbourSummary`, `PanelGrid`, and `SourceLine`.

### Structure Patterns

**Project Organization:**
- Keep the repo as one workspace with two bounded runtime areas: UI and adapter.
- Keep shared types in one place and import them from both sides instead of duplicating contracts.
- Keep fixture parsing and source normalization in the adapter, not in the UI.
- Keep board composition and role-specific rendering in the UI, not in the adapter.
- Keep tests close to the code they validate unless a later testing layer needs centralization.

**File Structure Patterns:**
- Place app-specific code under `apps/web` and `apps/api`.
- Place shared TypeScript types and constants under `shared/src`.
- Place repository-visible fixtures under `fixtures/`.
- Place runtime cache files under `cache/`.
- Keep documentation under `docs/` and do not mix architecture notes into implementation folders.

### Format Patterns

**API Response Formats:**
- Return direct JSON objects, not wrapped envelopes with unrelated metadata.
- Use one normalized harbour summary envelope per request.
- Use `camelCase` for all JSON field names.
- Keep per-panel state embedded in the summary envelope rather than splitting the response into multiple unrelated payloads.
- Use ISO 8601 strings for timestamps.

**Data Exchange Formats:**
- Use `camelCase` in TypeScript and JSON.
- Use booleans as `true` and `false`, never `1` and `0`.
- Use `null` explicitly for missing optional values.
- Keep arrays as arrays even when they contain one item, unless a contract explicitly requires a scalar.
- Keep fixture and cache files as human-readable JSON.

### Communication Patterns

**Event System Patterns:**
- Phase 1 does not use an event bus or streaming channel.
- Refresh is a request/response action, not a push subscription.
- If later work introduces events, use lowercase noun phrases for event names and keep payloads aligned with the shared harbour summary contract.

**State Management Patterns:**
- Keep selected audience, refresh state, and current summary in top-level React component state.
- Treat the fetched summary as server state, but do not introduce a query library for Phase 1.
- Update state immutably.
- Preserve the existing readable board while refresh is pending.
- Change role selection by re-prioritizing the same board modules, not by navigating to a different state tree.

### Process Patterns

**Error Handling Patterns:**
- Keep raw provider errors in adapter logs, not in the UI.
- Show user-facing failure states as calm, labeled board states such as `stale`, `unavailable`, or `fixture-backed`.
- Preserve the last readable summary when a refresh fails if the prior data is still valid to show.
- Return adapter errors with a small consistent error shape such as `{ error: { code, message } }`.
- Distinguish between a true failure and a stale-but-usable fallback.

**Loading State Patterns:**
- Use explicit `idle`, `loading`, and `refreshing` states in UI code.
- `loading` applies to initial fetch.
- `refreshing` applies when the board already has content and the user requests an update.
- Do not blank the board during refresh unless no previous summary exists.
- Keep loading indicators quiet and local to the affected area.

### Enforcement Guidelines

**All AI Agents MUST:**
- Use the shared normalized harbour summary contract for both adapter output and UI rendering.
- Keep all JSON and TypeScript field names in camelCase.
- Preserve the board during refresh and label stale or unavailable data explicitly.

**Pattern Enforcement:**
- Verify patterns through shared types, fixture validation, and adapter response shape checks.
- Document any naming or contract deviation in `docs/architecture.md` before implementing around it.
- If a pattern must change, update the shared contract first, then update adapter and UI code together.

### Pattern Examples

**Good Examples:**
- `GET /api/harbour-summary?audience=visitor`
- `ConditionStrip.tsx`
- `harbourSummary.currentTide`
- `cache/harbour-summary-harbour-office.json`
- `loading`, `refreshing`, `stale`, `unavailable`

**Anti-Patterns:**
- `GetHarbourSummary`
- `harbour_summary`
- raw NOAA or WSDOT payloads rendered directly in the UI
- mixing fixture files and cache files in the same folder without labels
- blanking the board during refresh
