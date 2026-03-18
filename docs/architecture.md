stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
inputDocuments:
  - /home/codexuser/bmad-6-workshop/docs/prd.md
  - /home/codexuser/bmad-6-workshop/docs/product-brief-bmad-6-workshop-migration-2026-03-17.md
  - /home/codexuser/bmad-6-workshop/docs/ux-design-specification.md
  - /home/codexuser/bmad-6-workshop/docs/ux-design-directions.html
  - /home/codexuser/bmad-6-workshop/docs/research/domain-public-apis-for-london-mobility-weather-and-civic-display-data-research-2026-03-17.md
  - /home/codexuser/bmad-6-workshop/docs/research/technical-api-integration-requirements-for-albemarle-pulse-research-2026-03-17.md
  - /home/codexuser/bmad-6-workshop/_bmad-output/brainstorming/brainstorming-session-2026-03-16.md
workflowType: 'architecture'
project_name: 'bmad-6-workshop-migration'
user_name: 'Workshop'
date: '2026-03-18'
lastStep: 8
status: 'complete'
completedAt: '2026-03-18'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
The confirmed scope is a single-screen, display-first public web application with 38 functional requirements across nine capability groups: departure overview, mobility and local orientation, weather and human context, trust and disruption handling, live display behavior, shared readability, staff hosting support, venue operations, and scope protection.

Architecturally, these requirements imply:
- one canonical public display surface that stays stable while live data changes
- explicit state modeling for overall condition, trend, freshness, disruption, and public-readiness
- a local-context layer that anchors the screen to the Royal Institution without becoming a route planner
- separate operational behavior for venue staff recovery versus passive public viewing
- hard product guardrails preventing route planning, prescriptive recommendations, or dense secondary workflows from leaking into the MVP surface

**Non-Functional Requirements:**
The non-functional requirements are a primary architecture driver, not a secondary concern. They define:
- performance constraints around startup, refresh cadence, and non-disruptive visual updates
- reliability constraints around eight-hour continuous operation, partial-source failure isolation, and two-minute recovery
- accessibility constraints around room-scale readability, WCAG AA contrast, non-color status encoding, reduced-motion legibility, and keyboard-only staff recovery
- integration constraints around partial-feed tolerance, stale-data labeling, and optional-feed isolation
- security and privacy constraints around no personal data, no user accounts, no identifiable analytics, protected credentials, encrypted upstream requests, and no public debug or admin exposure

These requirements mean the architecture must optimize for trust, stability, and truthful degradation as strongly as it optimizes for feature delivery.

**Scale & Complexity:**
This is a display-first web application in a low-regulation domain, but the architectural complexity is medium because it combines live external data, public-display UX, and strict degraded-state behavior.

- Primary domain: display-first web application with live external data dependencies
- Complexity level: medium
- Estimated architectural components: 6 major component areas

The strongest complexity indicators are:
- real-time or near-real-time source updates: present
- external integration complexity: moderate to high
- public-user interaction complexity: low
- operator workflow complexity: low to moderate
- regulatory burden: low
- data-volume complexity: low to moderate, but freshness-sensitive
- visual and state-management complexity: high relative to app size

### Technical Constraints & Dependencies

- The MVP runs in a controlled desktop browser on a venue laptop and is optimized for a fixed landscape public display.
- The public experience is intentionally non-interactive; mouse and keyboard support exist only for setup, recovery, and maintenance.
- The product must remain a single-screen, fact-only departure display and must not drift into route planning, recommendations, dense dashboards, or public navigation patterns.
- External live data dependencies are required for transport, weather, and local spatial context, but optional enrichments must not become foundational to MVP viability.
- Offline-first behavior is not required, but honest last-known-state and degraded-source behavior is required.
- Responsive behavior is display-first, with a primary large-screen target and a secondary desktop adaptation rather than a mobile layout strategy.
- Public runtime behavior must never expose secrets, debug tools, recovery internals, or persistent viewer data.

### Cross-Cutting Concerns Identified

- Multi-source normalization and dependency isolation
- Freshness, trust, and degraded-state modeling
- Cache and refresh orchestration against provider limits and update cadences
- Stable public-display composition during live updates
- Accessibility for both distance viewing and staff-only keyboard workflows
- Operational observability and venue-side recovery confidence
- Security, secret mediation, and source-attribution governance
- Scope protection so the implementation stays aligned with the anti-planner product contract

## Starter Template Evaluation

### Primary Technology Domain

Full-stack web application based on project requirements analysis.

Although the product behaves like a single-screen public display, the MVP still needs server-side mediation for external APIs, freshness normalization, and secret handling. That makes this a full-stack web application rather than a frontend-only SPA.

### Starter Options Considered

**1. Next.js `create-next-app`**
Current official starter with TypeScript, linting, App Router, route handlers, and an `--empty` mode.

Strengths:
- official full-stack React starter with clear conventions
- route handlers support the BFF pattern needed for secret-bearing upstream API calls
- empty starter avoids blog/dashboard boilerplate and fits a bespoke single-screen display
- strong TypeScript and linting defaults for consistent AI-assisted implementation

Trade-offs:
- broader framework surface than MVP strictly needs
- App Router brings React framework conventions that should be used conservatively for this project

**2. React Router `create-react-router`**
Current official framework starter with full-stack support, BFF guidance, and deploy/custom-server templates.

Strengths:
- good conceptual fit for a BFF-style app
- current official support for Node/custom-server paths
- strong route-module type safety and Vite-based development ergonomics

Trade-offs:
- starter/template path is more template-driven and less minimal for this specific display-first MVP
- official deploy templates lean toward SSR/Tailwind/Docker assumptions that are not core MVP needs

**3. Vite `create-vite` with `react-ts`**
Current official minimal frontend starter.

Strengths:
- fastest minimal UI foundation
- good fit for bespoke visual work and controlled-browser runtime
- low boilerplate

Trade-offs:
- frontend-only starter, so it leaves the BFF/server boundary unresolved
- does not establish the secret-handling and API mediation path this product needs from day one

### Selected Starter: Next.js `create-next-app`

**Rationale for Selection:**
Next.js is the strongest foundation for this project because it gives us one official, maintained starter that covers both sides of the MVP: the highly bespoke React display UI and the server-side route-handler layer needed to shield credentials, normalize provider responses, and expose a single internal API surface to the client.

The `--empty` option is especially important here because Albemarle Pulse is not a generic marketing site or CRUD app. We want the framework conventions and tooling, but we do not want unnecessary starter UI structure. This keeps the architecture disciplined while still giving implementation agents a predictable file layout and runtime model.

React Router remains a credible second choice, especially if we later decide we want a more explicit custom-server posture from the start. Vite remains a strong frontend-only option, but it does not solve the backend-for-frontend requirement cleanly enough as the primary starter.

**Initialization Command:**

```bash
npx create-next-app@latest albemarle-pulse --ts --eslint --app --src-dir --import-alias "@/*" --empty --use-npm --no-tailwind
```

**Architectural Decisions Provided by Starter:**

**Language & Runtime:**
- TypeScript by default
- React-based application runtime
- Node-capable full-stack framework with built-in route handlers for server endpoints

**Styling Solution:**
- No Tailwind included
- Leaves the UI free to use custom CSS tokens and bespoke display components aligned with the UX spec

**Build Tooling:**
- `next dev`, `next build`, and `next start`
- Turbopack-enabled development workflow by default in current Next.js docs
- production build pipeline already integrated

**Testing Framework:**
- no test runner is included by default
- implementation should add unit/integration and end-to-end testing intentionally rather than inherit an opinionated starter setup

**Code Organization:**
- App Router conventions under `app/`
- route handlers available within the same project for BFF endpoints
- optional `src/` directory for cleaner separation
- import alias configuration for consistent internal module boundaries

**Development Experience:**
- strong official documentation and current maintenance
- integrated TypeScript support
- official ESLint configuration with Next.js and TypeScript rules
- predictable conventions that are suitable for AI-agent consistency

**Note:** Project initialization using this command should be the first implementation story.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
- Use `Next.js 16.x` on `Node.js 24.x Active LTS` for the MVP runtime baseline.
- Use a modular monolith with built-in route handlers as a backend-for-frontend boundary.
- Use no relational database in MVP; model the app around a normalized live dashboard snapshot.
- Use server-side schema validation with `Zod 4.x`.
- Use primary in-memory caching with file-backed last-known snapshot fallback for restart resilience.
- Use no end-user authentication in MVP.
- Keep operator actions separate from the public display route and restricted to local venue-device use.
- Use internal REST-style JSON endpoints only; no GraphQL or multi-service RPC layer.

**Important Decisions (Shape Architecture):**
- Use `TanStack Query v5` for client-side server-state polling and stale-state handling.
- Use a server-rendered shell with selective client components for live display zones.
- Use bespoke display components over custom CSS tokens and lightweight primitives; no UI framework layer.
- Use provider adapters per external source so transport, weather, and optional feeds remain replaceable.
- Use structured logging, health endpoints, and source-freshness telemetry from day one.
- Deploy as a single local-first Node process on the venue laptop, managed by an OS-level service wrapper.

**Deferred Decisions (Post-MVP):**
- Historical persistence and analytics database
- Hosted multi-environment deployment
- Multi-venue tenancy
- Public-facing admin or operator accounts
- WebSocket push updates
- Optional secondary views and richer operational dashboards

### Data Architecture

- **Runtime data model:** one canonical `DashboardSnapshot` aggregate representing the full public display state.
- **Persistence:** no relational or document database in MVP.
- **Snapshot durability:** keep the current normalized snapshot in memory and persist the most recent safe public snapshot to a local file for restart recovery and honest degraded-mode fallback.
- **Validation strategy:** validate all provider responses and internal normalized payloads with `Zod 4.x` before they enter the application core.
- **Migration approach:** no database migrations in MVP; evolve the snapshot contract through versioned TypeScript and Zod schemas.
- **Caching strategy:** cache-aside plus scheduled refresh. Refresh providers on bounded cadences, preserve last-known good data when safe, and mark stale data explicitly rather than hiding degradation.

**Rationale:**
This matches the MVP shape: live, freshness-sensitive, low-history, and local-first. A database would add operational weight without solving the actual problem the architecture has to solve, which is truthful live-state normalization and degradation handling.

### Authentication & Security

- **Authentication method:** no end-user authentication in MVP.
- **Operator access model:** operator-only actions are available through a separate local maintenance surface or keyboard-only recovery path, not through the public display route.
- **Authorization pattern:** physical device access plus server-side route gating for maintenance actions; no public write endpoints.
- **Secret handling:** all provider credentials remain server-side in environment configuration only.
- **Data protection:** no personal data, no accounts, no identifiable analytics, no cookies beyond strictly necessary runtime behavior.
- **API security strategy:** same-origin internal APIs, no browser exposure of upstream credentials, minimal endpoint surface, request validation on support actions, and throttling/backoff where operator or internal actions could be abused.

**Rationale:**
The product is a public display, not a user account system. Security is mainly about secret isolation, local operational safety, and preventing support tooling from leaking into the public surface.

### API & Communication Patterns

- **API pattern:** internal REST-style JSON route handlers within the Next.js app.
- **Primary server boundary:** provider adapters feed a normalized internal service layer, which exposes a small internal API surface to the client.
- **Core endpoints:** one public dashboard-read endpoint, one health/status endpoint, and a small set of maintenance-only endpoints for refresh/recovery.
- **Error handling:** typed error envelopes internally, but calm public fallbacks in the UI; the display never exposes raw provider errors.
- **Rate limiting strategy:** provider-aware polling and backoff matter more than external consumer rate limiting; add basic protection to maintenance endpoints only.
- **Service communication:** no separate services in MVP; use in-process module boundaries inside a modular monolith.

**Rationale:**
This keeps the architecture narrow and reversible while matching the BFF pattern already implied by the starter choice and the source-security requirements.

### Frontend Architecture

- **Rendering model:** server-rendered shell plus client components for live dashboard refresh behavior.
- **Server state:** `TanStack Query v5`.
- **Client state:** local component state only; no global client state store in MVP.
- **Component architecture:** bespoke public-display components layered on lightweight internal primitives, following the UX spec’s atmospheric header, mode summary, fixed local map, trust cue, and degraded-state patterns.
- **Styling approach:** custom CSS tokens and modular styling, not Tailwind or a third-party design system.
- **Routing strategy:** single primary public route, plus hidden staff/support routes separated from the public display experience.
- **Performance strategy:** keep one canonical layout, minimize client JavaScript outside live zones, and prefer stable polling plus partial UI updates over full redraws.

**Rationale:**
The UI is composition-heavy, not workflow-heavy. The architecture should optimize for stable display behavior, not generic SPA complexity.

### Infrastructure & Deployment

- **Hosting strategy:** local-first deployment on the venue laptop.
- **Runtime process model:** single Next.js production process on `Node.js 24.x Active LTS`.
- **Service management:** run behind an OS-level process supervisor so the app can restart cleanly and remain operationally boring.
- **CI/CD approach:** lightweight GitHub Actions pipeline for lint, typecheck, tests, and production build; manual promotion of approved builds to the venue device for MVP.
- **Environment configuration:** environment variables for provider credentials and venue-specific settings.
- **Monitoring and logging:** structured server logs, source freshness metrics, health endpoint, and maintenance-readable current/degraded/unavailable state reporting.
- **Scaling strategy:** vertical single-instance scaling only for MVP.

**Rationale:**
The PRD explicitly prioritizes laptop-run MVP behavior over hosted platform complexity. The right architecture is therefore single-instance and local-first, with clean seams for future hosting if the product proves itself.

### Decision Impact Analysis

**Implementation Sequence:**
1. Initialize the empty Next.js project baseline.
2. Establish the module boundaries: provider adapters, normalization layer, snapshot model, route handlers, and UI shell.
3. Implement schema validation and caching before any rich display behavior.
4. Build the public read path and degraded-state logic.
5. Add operator recovery path, health reporting, and observability.
6. Add CI validation and packaging for venue deployment.

**Cross-Component Dependencies:**
- The no-database decision pushes correctness into the snapshot model, validation layer, and cache strategy.
- The no-auth decision increases the importance of route separation and local operator boundaries.
- The single-process deployment decision makes observability, restart behavior, and provider backoff core reliability concerns.
- The display-first UX decision constrains routing, state management, and rendering strategy toward one stable public surface.
- The anti-planner product contract constrains both API shape and frontend component boundaries.

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

**Critical Conflict Points Identified:**
8 high-risk areas where AI agents could diverge: route naming, file naming, schema placement, provider normalization, API response shape, date/time handling, loading/degraded-state behavior, and observability event naming.

### Naming Patterns

**Database Naming Conventions:**
No database naming rules apply in MVP because persistence is limited to snapshot files, not relational tables. If persistent storage is added later, database naming must be defined in a future architecture revision rather than inferred ad hoc.

**API Naming Conventions:**
- Internal API routes use lowercase kebab-case path segments.
- Public read endpoints use singular resource names when the route represents one aggregate view, e.g. `/api/dashboard`.
- Operational endpoints live under `/api/ops/*`, e.g. `/api/ops/health`, `/api/ops/refresh`.
- Query parameters use `camelCase`.
- Route handlers must not mirror external provider naming directly into internal route names.

**Code Naming Conventions:**
- React components: `PascalCase`
- TypeScript types, interfaces, Zod schemas, and enums: `PascalCase`
- Variables and functions: `camelCase`
- File and directory names: `kebab-case`, except React component files which use `PascalCase.tsx`
- Constants shared across modules: `SCREAMING_SNAKE_CASE`
- External provider payloads must be normalized to internal `camelCase` keys at the adapter boundary

### Structure Patterns

**Project Organization:**
- Use feature-first organization for app-facing code.
- Keep provider integrations under server-only modules, separate from UI code.
- Co-locate feature tests with their feature modules unless the test is end-to-end.
- Shared schemas, types, and contracts belong in a central shared contract area, not duplicated across features.
- No component may call external providers directly.

**File Structure Patterns:**
- Public display route code and maintenance route code must remain in separate route trees.
- Zod schemas and snapshot contracts must live in dedicated contract files, not inline inside components or route handlers.
- Static assets use purpose-based folders such as `images/`, `icons/`, and `fonts/`.
- Snapshot persistence files and runtime-generated artifacts must remain outside committed source structure.

### Format Patterns

**API Response Formats:**
- Success responses use `{ data, meta }`.
- Error responses use `{ error: { code, message, retryable, details? }, meta }`.
- Health/status responses may use a dedicated typed status object but must still keep top-level shape stable.
- Public UI routes must never expose raw upstream provider errors, stack traces, or unnormalized payloads.

**Data Exchange Formats:**
- Internal JSON fields use `camelCase`.
- Dates and times use ISO 8601 UTC strings.
- Freshness is represented explicitly, not inferred from missing values.
- Unknown or unavailable values use `null` plus a trust/freshness field, not magic strings.
- Boolean values remain `true`/`false`, never `1`/`0`.

### Communication Patterns

**Event System Patterns:**
- There is no cross-service event bus in MVP.
- Internal observability event names use lowercase dot notation, e.g. `source.refresh.started`, `source.refresh.failed`, `snapshot.published`.
- Event payloads must include `area`, `source`, `status`, and `timestamp` where applicable.
- Provider-specific fields must stay nested under a provider-specific object, not leak into shared event shape.

**State Management Patterns:**
- Server state uses `TanStack Query`.
- Query keys use array form, e.g. `['dashboard']`, `['ops', 'health']`.
- Client state is limited to local presentation state.
- Components must not implement ad hoc fetch logic if the data belongs to shared server state.
- State updates remain immutable and contract-driven.

### Process Patterns

**Error Handling Patterns:**
- Validate all inbound provider data before publishing to the snapshot model.
- Degradation is handled as product state, not exceptional UI failure.
- Public UI shows calm degraded states, not raw error banners.
- Maintenance surfaces may show more explicit operational detail, but still use the standard error envelope.
- Logs distinguish between `provider_error`, `normalization_error`, `snapshot_error`, and `ui_state_error`.

**Loading State Patterns:**
- First load may show a composed shell/loading placeholder.
- After first successful render, refreshes must preserve the existing layout and content structure.
- No full-screen spinner is allowed for routine polling updates.
- If fresh data is unavailable, retain the last safe snapshot and update trust/freshness indicators.
- Loading and degraded states must be visually distinct.

### Enforcement Guidelines

**All AI Agents MUST:**
- normalize external data into shared contracts before it reaches UI code
- use the agreed route, file, and schema naming rules exactly
- preserve stable layout behavior during refresh, error, and degraded states

**Pattern Enforcement:**
- verify contracts through shared Zod schemas and TypeScript types
- treat deviations from route shape, response shape, or snapshot shape as architecture violations
- document any required pattern exception directly in the architecture or story artifact before implementation

### Pattern Examples

**Good Examples:**
- `src/features/dashboard/components/AtmosphericHeader.tsx`
- `src/lib/contracts/dashboard-snapshot.ts`
- `src/app/api/dashboard/route.ts`
- success payload: `{ data: dashboardSnapshot, meta: { generatedAt, freshness } }`
- log event: `{ event: "source.refresh.failed", source: "weather", status: "degraded", timestamp }`

**Anti-Patterns:**
- calling TfL or weather APIs directly from React components
- mixing `snake_case` and `camelCase` in internal contracts
- returning raw provider payloads from internal API routes
- using full-screen loading states during background refresh
- placing maintenance actions on the same surface and route flow as the public display

## Project Structure & Boundaries

### Complete Project Directory Structure

```text
albemarle-pulse/
├── README.md
├── package.json
├── package-lock.json
├── next.config.ts
├── tsconfig.json
├── next-env.d.ts
├── eslint.config.mjs
├── .gitignore
├── .env.example
├── .env.local
├── .github/
│   └── workflows/
│       └── ci.yml
├── docs/
│   ├── architecture.md
│   ├── prd.md
│   ├── ux-design-specification.md
│   └── research/
├── ops/
│   ├── systemd/
│   │   └── albemarle-pulse.service
│   └── scripts/
│       ├── start-production.sh
│       └── restart-display.sh
├── public/
│   ├── fonts/
│   ├── icons/
│   └── images/
├── runtime/
│   └── snapshots/
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── (public)/
│   │   │   ├── page.tsx
│   │   │   ├── loading.tsx
│   │   │   └── error.tsx
│   │   ├── (ops)/
│   │   │   └── ops/
│   │   │       ├── page.tsx
│   │   │       └── loading.tsx
│   │   └── api/
│   │       ├── dashboard/
│   │       │   └── route.ts
│   │       └── ops/
│   │           ├── health/
│   │           │   └── route.ts
│   │           └── refresh/
│   │               └── route.ts
│   ├── features/
│   │   ├── dashboard/
│   │   │   ├── components/
│   │   │   │   ├── AtmosphericHeader.tsx
│   │   │   │   ├── DashboardScreen.tsx
│   │   │   │   ├── DegradedStateNotice.tsx
│   │   │   │   ├── LocalMapFrame.tsx
│   │   │   │   ├── ModeSummaryCard.tsx
│   │   │   │   ├── ModeSummaryGrid.tsx
│   │   │   │   └── TrustCue.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useDashboardQuery.ts
│   │   │   ├── presenters/
│   │   │   │   └── dashboard-presenter.ts
│   │   │   └── __tests__/
│   │   │       ├── DashboardScreen.test.tsx
│   │   │       └── dashboard-presenter.test.ts
│   │   └── ops/
│   │       ├── components/
│   │       │   ├── OpsStatusPanel.tsx
│   │       │   └── RefreshControls.tsx
│   │       ├── hooks/
│   │       │   ├── useOpsHealthQuery.ts
│   │       │   └── useRefreshMutation.ts
│   │       └── __tests__/
│   │           └── OpsStatusPanel.test.tsx
│   ├── lib/
│   │   ├── client/
│   │   │   ├── fetch-json.ts
│   │   │   └── query-client.ts
│   │   ├── config/
│   │   │   ├── env.ts
│   │   │   └── venue-config.ts
│   │   ├── contracts/
│   │   │   ├── api-response.ts
│   │   │   ├── dashboard-snapshot.ts
│   │   │   ├── freshness.ts
│   │   │   └── ops-status.ts
│   │   ├── server/
│   │   │   ├── cache/
│   │   │   │   ├── memory-cache.ts
│   │   │   │   └── snapshot-store.ts
│   │   │   ├── dashboard/
│   │   │   │   ├── build-dashboard-snapshot.ts
│   │   │   │   ├── dashboard-service.ts
│   │   │   │   └── publish-dashboard-snapshot.ts
│   │   │   ├── observability/
│   │   │   │   ├── events.ts
│   │   │   │   ├── health-report.ts
│   │   │   │   └── logger.ts
│   │   │   ├── ops/
│   │   │   │   ├── get-ops-status.ts
│   │   │   │   └── refresh-dashboard.ts
│   │   │   ├── providers/
│   │   │   │   ├── tfl/
│   │   │   │   │   ├── tfl-client.ts
│   │   │   │   │   ├── tfl-normalizer.ts
│   │   │   │   │   └── tfl-schemas.ts
│   │   │   │   └── weather/
│   │   │   │       ├── weather-client.ts
│   │   │   │       ├── weather-normalizer.ts
│   │   │   │       └── weather-schemas.ts
│   │   │   └── security/
│   │   │       └── assert-ops-access.ts
│   │   └── utils/
│   │       ├── datetime.ts
│   │       └── status-formatters.ts
├── tests/
│   ├── e2e/
│   │   ├── dashboard.spec.ts
│   │   └── ops-recovery.spec.ts
│   ├── fixtures/
│   │   ├── tfl/
│   │   └── weather/
│   └── smoke/
│       └── startup-smoke.test.ts
├── vitest.config.ts
└── playwright.config.ts
```

### Architectural Boundaries

**API Boundaries:**
- Public read boundary: `src/app/api/dashboard/route.ts`
- Operational read/write boundary: `src/app/api/ops/health/route.ts` and `src/app/api/ops/refresh/route.ts`
- External provider boundary: `src/lib/server/providers/*`
- Contract boundary: `src/lib/contracts/*`
- No UI code may cross directly into provider clients

**Component Boundaries:**
- Public display UI lives only under `src/features/dashboard/*`
- Maintenance UI lives only under `src/features/ops/*`
- Route files compose feature modules; they do not contain feature logic
- Presenters adapt snapshot contracts to display-ready props and labels

**Service Boundaries:**
- Snapshot orchestration lives under `src/lib/server/dashboard/*`
- Cache and persisted last-known snapshot handling live under `src/lib/server/cache/*`
- Observability and status reporting live under `src/lib/server/observability/*`
- Ops-only actions live under `src/lib/server/ops/*`

**Data Boundaries:**
- Raw provider payloads are validated and normalized inside `src/lib/server/providers/*`
- Canonical internal data enters `DashboardSnapshot` contracts only after validation
- Snapshot persistence is file-backed under `runtime/snapshots/` and never treated as a domain database

### Requirements to Structure Mapping

**Feature Mapping by FR Category:**
- Departure overview, live display behavior, and shared readability:
  `src/features/dashboard/components/*`, `src/features/dashboard/presenters/*`, `src/app/(public)/*`
- Mobility comparison, local orientation, weather, trust, and disruption:
  `src/features/dashboard/components/*`, `src/lib/server/providers/*`, `src/lib/server/dashboard/*`, `src/lib/contracts/*`
- Staff hosting support and venue operations:
  `src/features/ops/*`, `src/app/(ops)/ops/*`, `src/app/api/ops/*`, `src/lib/server/ops/*`, `src/lib/server/security/*`
- Scope protection:
  enforced by keeping only one public route tree and no planner, search, or multi-step public workflow directories

**Cross-Cutting Concerns:**
- Freshness and degradation: `src/lib/contracts/freshness.ts`, `src/lib/server/dashboard/*`, `src/features/dashboard/components/TrustCue.tsx`, `src/features/dashboard/components/DegradedStateNotice.tsx`
- Security and ops gating: `src/lib/config/env.ts`, `src/lib/server/security/assert-ops-access.ts`
- Observability: `src/lib/server/observability/*`
- Environment and venue configuration: `src/lib/config/*`
- Shared transport/weather fixtures and e2e validation: `tests/fixtures/*`, `tests/e2e/*`, `tests/smoke/*`

### Integration Points

**Internal Communication:**
- Route handlers call server services
- Server services call provider adapters, cache modules, and observability modules
- Client hooks call internal API routes only
- UI components consume presenter output and typed contracts

**External Integrations:**
- TfL integration enters only through `src/lib/server/providers/tfl/*`
- Weather integration enters only through `src/lib/server/providers/weather/*`
- Any future optional provider must follow the same adapter + schema + normalizer structure

**Data Flow:**
1. Provider clients fetch external data
2. Provider schemas validate raw payloads
3. Normalizers convert payloads into internal `camelCase` shapes
4. Dashboard services assemble and publish `DashboardSnapshot`
5. API routes return `{ data, meta }`
6. TanStack Query hooks refresh the client view without layout churn

### File Organization Patterns

**Configuration Files:**
- Root-level framework and tool configuration only
- Runtime env parsing in `src/lib/config/env.ts`
- Venue-specific runtime settings in `src/lib/config/venue-config.ts`

**Source Organization:**
- `src/app/*` for route entry points only
- `src/features/*` for feature-facing UI and feature hooks
- `src/lib/contracts/*` for shared data shapes
- `src/lib/server/*` for all server-only logic
- `src/lib/client/*` for client-only fetch and query setup

**Test Organization:**
- Feature tests co-located in `__tests__`
- End-to-end flows in `tests/e2e`
- Provider fixtures in `tests/fixtures`
- Startup and operational smoke checks in `tests/smoke`

**Asset Organization:**
- Public static assets in `public/*`
- Runtime snapshots outside source in `runtime/snapshots/`
- No generated operational data committed under `src/` or `docs/`

### Development Workflow Integration

**Development Server Structure:**
- `next dev` serves both UI routes and internal route handlers
- Feature modules can be developed independently behind stable contracts
- Ops view can be exercised without changing the public route structure

**Build Process Structure:**
- `next build` packages the public display, ops routes, and internal APIs as one deployable app
- Vitest covers contracts, presenters, and server logic
- Playwright validates public display and recovery flows

**Deployment Structure:**
- CI validates code quality and build output
- Venue deployment uses `ops/systemd/albemarle-pulse.service`
- Runtime snapshots and env configuration stay device-local and outside committed source

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:**
The architecture is internally coherent. The selected stack, `Next.js 16.x` on `Node.js 24.x`, supports the chosen backend-for-frontend model, server-rendered shell, route-handler APIs, and local-first deployment approach. The data architecture, cache strategy, contract validation approach, and UI rendering model all align with the requirement for a single live public display with honest degraded-state behavior.

The absence of a database is compatible with the product scope because the MVP is centered on current-state synthesis rather than durable business records. The no-auth decision is also coherent with the venue-display model and strengthens the simplicity of the public surface while keeping maintenance flows separated.

**Pattern Consistency:**
The implementation patterns reinforce the architectural decisions correctly:
- naming and response-shape rules support the internal REST-style API decision
- server-only provider boundaries support the BFF and secret-isolation decisions
- snapshot and schema placement rules support the no-database and normalization-first data model
- loading, degraded-state, and event-naming rules support the trust and observability requirements

The patterns are specific enough to reduce AI-agent drift in the highest-risk areas.

**Structure Alignment:**
The project structure supports the architecture cleanly:
- route handlers, server services, contracts, and provider adapters are physically separated
- public display code and ops code are split into different route and feature areas
- the structure gives every major requirement category a stable implementation home
- integration points are explicit and do not rely on undocumented cross-module coupling

### Requirements Coverage Validation ✅

**Feature Coverage:**
All functional requirement groups are architecturally supported:
- departure overview, live display behavior, and shared readability are supported by the public route, dashboard components, presenters, and query flow
- mobility, local orientation, weather, and disruption handling are supported by provider adapters, normalization, snapshot publishing, and display components
- staff and venue operation requirements are supported by separated ops routes, ops components, health reporting, and refresh controls
- scope-protection requirements are supported by the single public route, non-interactive public UI, and absence of planner-style structures

**Functional Requirements Coverage:**
All 38 functional requirements are covered by architectural decisions and structure. No FR category is left without a mapped implementation boundary. Cross-cutting FRs around trust, freshness, degraded operation, and shared readability are explicitly addressed by both the data model and the UI component boundaries.

**Non-Functional Requirements Coverage:**
The NFR set is well covered:
- performance is addressed through cache-aside refresh, stable partial updates, and a single deployable app
- reliability is addressed through last-known snapshot persistence, health reporting, and managed local process supervision
- accessibility is addressed through the display-first component model, reduced-motion rules, plain-language state handling, and staff-only keyboard-safe ops surfaces
- integration resilience is addressed through provider adapters, schema validation, and local degraded-state publishing
- security is addressed through server-only credentials, no user accounts, same-origin internal APIs, and isolated ops functionality

### Implementation Readiness Validation ✅

**Decision Completeness:**
All critical architectural decisions required to start implementation are present:
- runtime and framework baseline
- API and service boundaries
- data model and validation approach
- cache and snapshot strategy
- client/server rendering responsibilities
- deployment posture and observability direction

No missing critical decision currently blocks story creation or initial implementation.

**Structure Completeness:**
The project structure is concrete rather than generic. It defines:
- route entry points
- feature locations
- provider and contract locations
- test and fixture locations
- operational scripts and service-management area
- runtime snapshot storage location

This is sufficient for AI agents to place implementation work consistently.

**Pattern Completeness:**
The pattern set is complete enough for implementation consistency. It covers:
- naming rules
- response formats
- normalization boundaries
- state-management rules
- error and degraded-state handling
- observability event naming
- loading-state behavior

These are the areas most likely to produce incompatible code if left unspecified, and they have been addressed directly.

### Gap Analysis Results

**Critical Gaps:**
- None identified.

**Important Gaps:**
- The structure now implies `Vitest` and `Playwright` as testing defaults. This is coherent, but it was introduced at the structure layer rather than as a standalone architectural decision.
- The `systemd` service wrapper is deployment-environment specific. If the venue device is not Linux-based, the process-management wrapper should be swapped while preserving the same architectural boundary.

**Nice-to-Have Gaps:**
- A future appendix could define the exact `DashboardSnapshot` schema example in full.
- A future appendix could define source freshness thresholds per provider in a compact decision table.
- A future appendix could define the exact ops-access assertion mechanism once the venue environment is finalized.

### Validation Issues Addressed

No blocking issues were found.

The two important notes above do not require architectural redesign:
- Testing tooling can remain `Vitest` + `Playwright` as the default implementation baseline because it fits the project shape and current structure.
- Process supervision remains a required boundary, while the concrete service wrapper may vary by venue OS.

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

**Confidence Level:** High

**Key Strengths:**
- Strong alignment between product constraints and technical scope
- Clear backend-for-frontend isolation for external providers and credentials
- Explicit contract-first approach for live data normalization and degraded-state handling
- Concrete project structure and consistency rules suitable for multi-agent implementation
- Good separation between public display behavior and venue operations behavior

**Areas for Future Enhancement:**
- Formalize the exact testing-tool decision in a future revision if the team wants alternatives
- Add provider-specific freshness thresholds and fallback rules as an implementation appendix
- Add environment-specific ops packaging guidance once the exact venue device OS is confirmed

### Implementation Handoff

**AI Agent Guidelines:**
- Follow all architectural decisions exactly as documented
- Use implementation patterns consistently across all components
- Respect project structure and boundaries
- Refer to this document for all architectural questions

**First Implementation Priority:**
```bash
npx create-next-app@latest albemarle-pulse --ts --eslint --app --src-dir --import-alias "@/*" --empty --use-npm --no-tailwind
```
