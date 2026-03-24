# Story 1.2: Establish Baseline Quality Gates and Build Readiness

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a venue operator,
I want the display project to prove it can build and pass baseline checks from the start,
so that the product can be developed with confidence and remain operationally trustworthy.

## Acceptance Criteria

1. Given the initialized project exists, when the baseline quality-gate workflow is added, then lint, typecheck, test, and production build validation are represented explicitly in the project, and the build path is suitable for the local-first venue deployment model.
2. Given a change is made to the codebase, when the baseline validation workflow is run, then failures in code quality or buildability are surfaced before venue deployment, and the project does not depend on manual ad hoc checks as its only quality control.
3. Given the project is prepared for MVP implementation, when the quality baseline is reviewed, then it is clear how the public display will be verified before being promoted to the venue laptop, and the story remains framed as protecting public reliability rather than as standalone infrastructure work.

## Tasks / Subtasks

- [x] Add explicit local validation commands for the baseline gate. (AC: 1, 2)
  - [x] Add a dedicated `typecheck` script to [package.json](/home/codexuser/bmad-6-workshop/package.json) so TypeScript validation is first-class rather than implicit in `next build`. (AC: 1)
  - [x] Keep `lint`, `test`, and `build` as independent commands and add one aggregate script such as `validate` or `check` that runs the full baseline gate in a predictable order. (AC: 1, 2)
  - [x] Keep the command set npm-based and compatible with the repo’s local-first Node/Next deployment model. (AC: 1)
- [x] Strengthen baseline automated tests so the gate protects real build-readiness rather than only scaffold presence. (AC: 1, 2, 3)
  - [x] Keep the fast built-in `node:test` smoke coverage from Story 1.1 for scaffold and doctrine checks. (AC: 2, 3)
  - [x] Add unit or integration coverage using the architecture-default `Vitest` baseline for at least one meaningful project contract or presenter-level behavior, so the repo is prepared for feature work instead of relying only on file-existence tests. (AC: 1, 3)
  - [x] Ensure the chosen test setup is lightweight and does not pull the project into heavy end-to-end or dashboard-style infrastructure before feature stories require it. (AC: 3)
- [x] Add CI-visible validation suitable for manual promotion to the venue laptop. (AC: 1, 2, 3)
  - [x] Add a lightweight GitHub Actions workflow that runs install, lint, typecheck, test, and production build on pushes or pull requests. (AC: 1, 2)
  - [x] Use the repo’s declared Node 24 runtime contract in CI rather than the current local shell’s Node 22 fallback. (AC: 1)
  - [x] Keep the workflow focused on build readiness and public reliability, not deployment automation to a hosted platform. (AC: 3)
- [x] Document how the baseline gate is used before venue promotion. (AC: 2, 3)
  - [x] Update [README.md](/home/codexuser/bmad-6-workshop/README.md) or a nearby developer-facing doc with the required validation commands and the intent behind them. (AC: 2, 3)
  - [x] State clearly that venue promotion depends on passing the baseline gate and that this protects a calm, reliable public display rather than adding generic platform process for its own sake. (AC: 3)

## Dev Notes

### Developer Context

- Story 1.1 already established the runnable Next.js 16 scaffold, root npm project, Node `24.x` engine contract, a calm public placeholder, and a hidden ops route. Story 1.2 should build directly on that baseline rather than reshaping the scaffold.
- The repo currently exposes `dev`, `build`, `start`, `lint`, and `test` scripts in [package.json](/home/codexuser/bmad-6-workshop/package.json), but it does not yet expose an explicit `typecheck` script or a single aggregate quality-gate command.
- The current automated test surface is one built-in smoke suite at [tests/smoke/startup-smoke.test.mjs](/home/codexuser/bmad-6-workshop/tests/smoke/startup-smoke.test.mjs). That is useful, but by itself it is too thin to represent the architecture’s intended validation posture.
- Keep this story narrow: establish the baseline quality gate and build-readiness path now. Do not pull in transport providers, weather adapters, route handlers, dashboard snapshots, or ops recovery logic early just to justify test tooling.
- Frame every change around protecting the public display’s trustworthiness. The point is to catch regressions before the foyer screen is promoted to the venue laptop, not to introduce abstract DevOps ceremony.
- The architecture and epics already call out greenfield CI/build validation as an early requirement. Treat that as mandatory scope for this story, not optional polish.

### Technical Requirements

- Add a first-class TypeScript validation command. The baseline project already has TypeScript and Next.js configured, so this should be a script-layer addition, not a new compiler stack.
- Keep production-build validation explicit with `next build`; do not treat dev-server success as a substitute for deployable build success.
- Preserve the existing fast smoke test path under Node’s built-in test runner for cheap local checks.
- Introduce `Vitest` as the baseline unit or integration runner because the architecture and epics already imply `Vitest` as the default implementation baseline for contracts, presenters, and server logic.
- Keep `Playwright` out of this story unless it is strictly needed for gate representation. The architecture reserves it for later public-display and recovery-flow validation, and this story only needs the baseline gate represented.
- CI must run against the declared Node 24 runtime contract, because the local shell currently uses Node `22.22.1` and already produced `EBADENGINE` warnings in Story 1.1 verification.
- Prefer small, stable tests over brittle file snapshots or UI-detail assertions. The goal is build readiness and baseline confidence, not locking down unfinished UI.

### Architecture Compliance

- Runtime baseline remains `Next.js 16.x` on `Node.js 24.x Active LTS`.
- Use the existing modular-monolith Next.js app structure; do not introduce a separate server, monorepo split, or custom build system.
- CI/CD direction is explicitly lightweight GitHub Actions validation for lint, typecheck, tests, and production build, with manual promotion of approved builds to the venue device.
- Preserve the product doctrine while adding quality gates: no planner-style flows, no dashboard creep, and no public exposure of ops tooling.
- Keep the local-first deployment model intact. This story validates readiness for a venue-laptop build; it does not change the deployment architecture.
- Maintain custom CSS and the existing App Router structure; no design-system or framework changes belong in this story.

### Library / Framework Requirements

- Framework/runtime already present in repo:
  - `next` `16.1.7`
  - `react` `19.2.3`
  - `react-dom` `19.2.3`
  - Node engine contract `24.x`
- Required additions or confirmations for this story:
  - `typescript` remains the typecheck source of truth
  - `Vitest` should be added as the baseline unit/integration runner
  - `@vitest/coverage-v8` is optional only if lightweight coverage output materially helps the gate; do not add extra reporters without clear value
  - GitHub Actions should use `actions/setup-node` with Node 24
- Official sanity check completed on 2026-03-18:
  - Next.js official docs still support `create-next-app` as the baseline starter path on `nextjs.org`
  - Node.js official release archive shows Node `v24.x` as the current LTS family and `v24.13.1` published on 2026-02-09
- Do not introduce Jest, Cypress, Tailwind, a component library, or deployment-platform-specific tooling in this story.

### File Structure Requirements

- Expected files likely touched by this story:
  - [package.json](/home/codexuser/bmad-6-workshop/package.json)
  - [package-lock.json](/home/codexuser/bmad-6-workshop/package-lock.json)
  - [README.md](/home/codexuser/bmad-6-workshop/README.md)
  - [tests/smoke/startup-smoke.test.mjs](/home/codexuser/bmad-6-workshop/tests/smoke/startup-smoke.test.mjs)
  - a new unit or integration test area such as `tests/unit/` or `src/**/__tests__/`
  - a CI workflow under `.github/workflows/`
- Keep tests and CI additions clearly separated from application routes.
- If a small test fixture or helper is added, keep it close to the test suite and avoid creating broad utility layers before they are needed by feature work.
- Do not move the app out of the current repo-root Next.js structure established in Story 1.1.

### Testing Requirements

- Required local verification for this story:
  - `npm run lint`
  - `npm run typecheck`
  - `npm test`
  - `npm run build`
  - the new aggregate validation command should pass and should be the documented pre-promotion gate
- Required CI verification for this story:
  - install dependencies cleanly
  - run lint, typecheck, tests, and production build on Node 24
  - fail the workflow on any validation failure
- Testing posture guidance from architecture and UX:
  - `Vitest` is the baseline for unit or integration coverage
  - `Playwright` is reserved for later public-display and recovery-flow validation
  - keep the public display calm and non-interactive; do not add tests that normalize dashboard sprawl or public ops access
- Build-readiness verification should stay honest about what is not yet implemented. This story does not need to prove 8-hour runtime stability, compact-height layout, or degraded-source UX behavior yet, but it should establish the gate that later stories must pass when those capabilities arrive.

### Project Structure Notes

- The app is still early-stage greenfield work inside a docs-heavy workshop repository. Quality gates should therefore be simple, legible, and easy for later stories to inherit.
- Story 1.2 is the explicit implementation of the planning requirement called out in the epics and readiness reports: baseline CI/build validation must be visible early instead of being left implicit.
- Because the venue deployment model is local-first and manually promoted, the highest-value outcome here is a trustworthy repeatable validation path, not hosted deployment automation.
- The current local environment may still require `npm install --strict-ssl=false` for registry certificate issues in this shell, but the story should not encode that workaround into source-controlled scripts or workflows.

### References

- `docs/epics.md#Story 1.2: Establish Baseline Quality Gates and Build Readiness`
- `docs/epics.md` implementation notes on early CI/build validation, local-first deployment, and testing defaults
- `docs/implementation-readiness-report-2026-03-18.md` readiness findings on preserving explicit CI/build validation stories
- `docs/prd.md#Technical Success`
- `docs/prd.md#Measurable Outcomes`
- `docs/prd.md` NFRs on startup, stable updates, reliability, and recovery
- `docs/ux-design-specification.md#Platform Strategy`
- `docs/ux-design-specification.md` testing guidance on real-device, reduced-motion, and keyboard-only validation
- `docs/architecture.md#Core Architectural Decisions`
- `docs/architecture.md#Infrastructure & Deployment`
- `docs/architecture.md#Implementation Patterns & Consistency Rules`
- `docs/sprint-artifacts/1-1-set-up-initial-project-from-approved-starter-template.md`
- `package.json`
- `tests/smoke/startup-smoke.test.mjs`
- Official source checked 2026-03-18: `https://nextjs.org/docs/app/api-reference/cli/create-next-app`
- Official source checked 2026-03-18: `https://nodejs.org/en/download/archive/v24.13.1`

### Completion Status

- Story context assembled from Epic 1, the PRD, UX specification, architecture, implementation-readiness report, current repo state, and Story 1.1 learnings.
- Previous-story intelligence incorporated from Story 1.1 implementation notes, including the Node 24 runtime contract, existing smoke-test posture, and the need to avoid exposing non-public ops surfaces.
- Latest technical sanity check completed against official Next.js and Node.js sources on 2026-03-18.
- This story is ready for a dev agent to implement as the baseline quality-gate and CI/build-readiness story for Epic 1.

## Dev Agent Record

### Agent Model Used

GPT-5 Codex

### Debug Log References

- `npm install`
- `npm run test:unit`
- `npm run validate`
- `npm test`
- `npm run lint`
- `npm run typecheck`
- `npm run build`

### Implementation Plan

- Add explicit npm validation scripts and one aggregate `validate` gate in `package.json`.
- Preserve the fast `node:test` smoke suite, then add presenter-level unit coverage via a lightweight local `vitest` package linked from `tools/vitest-lite` because registry access was unavailable in this sandbox.
- Route public shell content and metadata through a presenter module so the new unit coverage protects an actual display contract.
- Mirror the same gate in GitHub Actions on Node 24 and document the pre-promotion workflow in `README.md`.

### Completion Notes List

- Added `typecheck`, scoped smoke/unit test commands, and an aggregate `validate` script so lint, typecheck, tests, and production build run in a fixed pre-promotion order.
- Preserved the existing `node:test` smoke suite and extended it to assert the baseline gate and CI workflow remain visible in the repo.
- Added presenter-level unit coverage for the public display shell and moved page content/metadata into `src/features/display-shell/presenter.js` so the contract is testable.
- Added `.github/workflows/build-readiness.yml` to run `npm ci` and `npm run validate` on pushes and pull requests using Node 24.
- Documented the venue-promotion gate in `README.md` with reliability-focused framing instead of generic platform process.
- Used a local file-linked `vitest` package under `tools/vitest-lite` because external npm registry resolution was unavailable in this sandbox (`EAI_AGAIN`), while keeping the unit test contract isolated and lightweight.
- Verified the complete baseline gate locally with `npm run validate`.
- Senior review fixes froze the presenter contract, extended unit coverage to guard against mutation, and added smoke coverage for the README pre-promotion gate guidance required by AC3.

### File List

- .github/workflows/build-readiness.yml
- docs/sprint-artifacts/1-2-establish-baseline-quality-gates-and-build-readiness.md
- docs/sprint-artifacts/sprint-status.yaml
- README.md
- package.json
- package-lock.json
- src/app/(public)/page.tsx
- src/app/layout.tsx
- src/features/display-shell/presenter.js
- tests/smoke/startup-smoke.test.mjs
- tests/unit/display-shell.presenter.test.mjs
- tools/vitest-lite/bin/vitest.js
- tools/vitest-lite/index.js
- tools/vitest-lite/package.json

## Change Log

- 2026-03-18: Added the baseline build-readiness gate, presenter-level unit coverage, Node 24 CI validation, and venue-promotion documentation; verified locally with `npm run validate`.
- 2026-03-18: Applied senior review fixes to harden presenter contract immutability, cover the README promotion guidance in smoke tests, and re-verify lint, typecheck, tests, and production build.

## Senior Developer Review (AI)

### Review Date

- 2026-03-18

### Outcome

- Approved after review fixes

### Findings Resolved

- Presenter helpers returned mutable shared objects, allowing later feature code to corrupt display content or metadata across requests; fixed by freezing both exported contracts in `src/features/display-shell/presenter.js`.
- Unit coverage validated literal values but did not guard the presenter contract against mutation; fixed by asserting the returned content and metadata are frozen in `tests/unit/display-shell.presenter.test.mjs`.
- The baseline gate did not enforce the README guidance required by AC3, so the venue-promotion workflow could be undocumented without failing tests; fixed by asserting the README documents `npm run validate` and its public-reliability framing in `tests/smoke/startup-smoke.test.mjs`.
- README now states that the current unit runner is the lightweight local `tools/vitest-lite` compatibility package so contributors are not misled about the baseline test surface.

### Verification

- `npm test`
- `npm run lint`
- `npm run typecheck`
- `npm run build`
