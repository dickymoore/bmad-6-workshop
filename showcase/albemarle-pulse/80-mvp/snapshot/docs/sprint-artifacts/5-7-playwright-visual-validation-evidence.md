# Story 5.7 Playwright Visual Validation Evidence

Date: 2026-03-23
Story: `5-7-validate-design-reference-parity-with-playwright-screenshots`
Scope: Canonical live public-route screenshot validation against `docs/design-inputs/code.html`, `docs/design-inputs/screen.png`, and `docs/design-inputs/DESIGN.md`
Outcome: Pass

## Commands Run

- `npm run test:smoke -- tests/smoke/public-board-visual-harness.test.mjs`
- `npm run test:e2e`
- `npm run screenshot:public-board`
- `npm run validate`

## Capture Context

- Repo-owned Playwright version: `1.51.1`
- Playwright web server command: `npm run start:e2e`
- Playwright base URL: `http://127.0.0.1:3100`
- Ephemeral rerun output path: `test-results/public-board-visual`
- Official sprint-artifact evidence path: [5-7-design-parity-evidence](/home/codexuser/bmad-6-workshop/docs/sprint-artifacts/5-7-design-parity-evidence)
- Capture stabilization:
  - route wait uses `networkidle`
  - browser fonts wait on `document.fonts.ready`
  - the board geometry must settle across repeated samples before the screenshot is written

### Viewports Used

- Primary foyer capture: `1366x900` in [foyer-1366x900.png](/home/codexuser/bmad-6-workshop/docs/sprint-artifacts/5-7-design-parity-evidence/foyer-1366x900.png)
- Supported desktop adaptation: `1024x768` in [desktop-1024x768.png](/home/codexuser/bmad-6-workshop/docs/sprint-artifacts/5-7-design-parity-evidence/desktop-1024x768.png)
- Compact-height fallback: `1366x800` in [compact-height-1366x800.png](/home/codexuser/bmad-6-workshop/docs/sprint-artifacts/5-7-design-parity-evidence/compact-height-1366x800.png)

## Runtime Metrics

- No-scroll contract held in all captures:
  - `1366x900`: shell bottom `880 <= 901`, `documentScrollHeight = 900`, `bodyScrollHeight = 900`
  - `1024x768`: shell bottom `752 <= 769`, `documentScrollHeight = 768`, `bodyScrollHeight = 768`
  - `1366x800`: shell bottom `784 <= 801`, `documentScrollHeight = 800`, `bodyScrollHeight = 800`
- Typography evidence:
  - masthead serif family: `"Noto Serif", "Noto Serif Fallback", "Noto Serif", serif`
  - headline serif family: `"Noto Serif", "Noto Serif Fallback", "Noto Serif", serif`
  - body font family: `Inter, "Inter Fallback", Inter, sans-serif`
- Code-reference contract derived from [code.html](/home/codexuser/bmad-6-workshop/docs/design-inputs/code.html):
  - approved editorial column ratio from design input: `7 / 5 = 1.4`
  - live ratio at `1366x900`: `1.498`
  - live ratio at `1024x768`: `1.5`
  - live ratio at `1366x800`: `1.499`
  - live gutter between the left reading column and right rail: `16px`, `12px`, `12px`
- Major-section placement evidence from the primary foyer capture:
  - modes zone: `x=43 y=64 width=758 height=707`
  - map zone: `x=817 y=64 width=506 height=425`
  - locality zone: `x=817 y=563 width=506 height=258`
- Surface samples from the actual rendered board:
  - atmospheric header background: `rgba(252, 249, 243, 0.96)`
  - mode-summary card background: `rgba(255, 255, 255, 0.88)` with subtle ghost-shadow `rgba(186, 186, 176, 0.2) 0px 1px 0px 0px`
  - locality-reference item background: `rgba(252, 249, 243, 0.96)`
  - map overlay card background: `rgba(255, 252, 247, 0.9)` with ambient shadow `rgba(56, 56, 49, 0.08) 0px 8px 22px 0px`
- Supporting metric snapshots are stored in:
  - [foyer-1366x900.json](/home/codexuser/bmad-6-workshop/docs/sprint-artifacts/5-7-design-parity-evidence/foyer-1366x900.json)
  - [desktop-1024x768.json](/home/codexuser/bmad-6-workshop/docs/sprint-artifacts/5-7-design-parity-evidence/desktop-1024x768.json)
  - [compact-height-1366x800.json](/home/codexuser/bmad-6-workshop/docs/sprint-artifacts/5-7-design-parity-evidence/compact-height-1366x800.json)

## Comparison Against Approved Design Reference

### Layout Hierarchy

Pass.

- The automated gate now derives the expected editorial contract from [code.html](/home/codexuser/bmad-6-workshop/docs/design-inputs/code.html): `Noto Serif` headline voice, `Inter` body voice, and the dominant `7/5` left-to-right reading balance.
- The live board met that contract across all three supported desktop captures with the map above locality on the right rail and the nearby modes column remaining dominant.
- The primary foyer screenshot also passed a normalized [screen.png](/home/codexuser/bmad-6-workshop/docs/design-inputs/screen.png) fingerprint check. Because `screen.png` is a taller full-page reference image than the live `1366x900` viewport, the comparison uses a width-normalized top-crop fingerprint rather than a literal full-resolution pixel match.
  - `diffPixelRatio = 0.0908`
  - `meanChannelDelta = 14.34`
  - `meanLuminanceDelta = 18.19`

### Typography Pairing

Pass.

- Runtime metrics confirm the masthead and main headline resolve to `Noto Serif`.
- Runtime body metrics confirm the operational voice resolves to `Inter`.
- That matches the explicit `headline` and `body` font families declared in [code.html](/home/codexuser/bmad-6-workshop/docs/design-inputs/code.html) and the implemented `next/font` pairing in [layout.tsx](/home/codexuser/bmad-6-workshop/src/app/layout.tsx).

### Spacing Rhythm

Pass.

- The board stayed within the viewport without scroll at `1366x900`, `1024x768`, and `1366x800`.
- The left-to-right gutter stayed visible in each capture, preserving the editorial reading void instead of collapsing the layout into a dense grid.
- The geometry is now captured only after the live board reaches a stable settled state, so the evidence is rerunnable rather than dependent on a fixed one-second sleep.

### Tonal Layering

Pass.

- The evidence note now relies on sampled rendered surfaces instead of transparent outer wrappers.
- The header, mode cards, locality items, and map overlay card all resolve to warm layered surfaces rather than a flat border-only shell.
- The map overlay keeps the strongest ambient depth cue, while the other surfaces stay restrained, which aligns with the Civic Editorial direction in [DESIGN.md](/home/codexuser/bmad-6-workshop/docs/design-inputs/DESIGN.md).

### Major Section Placement

Pass.

- The approved major zones are present in the live route during capture: masthead/header, nearby modes, nearby locality references, and passive map.
- In the primary foyer capture, the map remains on the upper-right and locality remains on the lower-right, matching the intended editorial composition family.

## Guardrail Checks

- Passive public-board assertions passed: no `button`, `input`, `form`, `select`, `textarea`, or public `a[href]` elements were present in the canonical board capture surface.
- Screenshot capture ran against the existing live public route rather than a copied prototype or alternate validation-only shell.
- `npm run test:e2e` now writes only ephemeral outputs under `test-results/public-board-visual`; the official sprint-artifact evidence set is written only by `npm run screenshot:public-board`.

## Acceptance Decision

Story `5.7` acceptance is evidence-backed and passes in the current repo state.

- AC1: Pass. Playwright captures the canonical live public board at the approved desktop contexts and stores the official evidence in the sprint-artifact set.
- AC2: Pass. The rerunnable gate now enforces the `code.html` editorial contract and the primary foyer screenshot passes the normalized `screen.png` reference fingerprint while the stored evidence confirms typography, spacing, tonal layering, and major section placement.
- AC3: Not triggered. Screenshot capture succeeded, the reference-backed gate passed, and the evidence does not show a material parity blocker that would require keeping Epic 5 open.
