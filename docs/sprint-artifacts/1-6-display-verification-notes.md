# Story 1.6 Display Verification Notes

Date: 2026-03-18
Scope: Venue-sized verification for the public Royal Institution display only.

## Real-Device and Surface Checks

- Primary venue target reviewed against the implemented `1366px+` landscape layout rules.
- Secondary desktop adaptation reviewed against the implemented `1024px+` layout rules.
- Compact-height fallback reviewed against the implemented `max-height: 820px` tuning.
- Canonical reading order held during each pass: atmospheric header, nearby modes, fixed local map.
- No alternate mode, tab, drawer, planner, or touch-first pattern was introduced during verification hardening.

## Readability and Calm Hierarchy Observations

- Room-scale hierarchy remains led by the atmospheric headline and overall state chip.
- Close-read detail remains in nearby mode labels, state labels, summaries, and the Royal Institution local-map legend.
- Under compact-height constraints, secondary support detail compresses before the primary hierarchy is reduced.
- Compact-height tuning keeps both header trust cues and fallback local-map explanation visible, rather than hiding factual context to save space.
- The local map remains anchored to Royal Institution locality cues rather than collapsing into a generic card or mobile stack.

## Accessibility Checks

- Contrast was reviewed against the existing palette and hierarchy, with status meaning still reinforced by wording and chip labels rather than color alone.
- Reduced-motion-safe behavior is represented directly in `src/app/globals.css` through `prefers-reduced-motion: reduce`.
- Shared readability remains explicit for both room-scale scanning and closer factual inspection.

## Scope Guardrails Confirmed

- The supported `1024px+` desktop target keeps the venue-first composition without forced horizontal overflow.
- Verification remains fixture-backed and route-passive.
- No provider adapters, polling, TanStack Query hooks, route handlers, ops actions, or recovery tooling were added.
- No supported public layout was added below `1024px`; unsupported narrow surfaces keep the venue-first composition instead of reinterpreting it as a mobile UI.
