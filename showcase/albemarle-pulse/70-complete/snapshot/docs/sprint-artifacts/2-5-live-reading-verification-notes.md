# Story 2.5 Live Reading Verification Notes

Date: 2026-03-19
Scope: Stable live reading during in-place refreshes and motion changes for the public Royal Institution display.

## Target-Device Review Focus

- Target-device review should confirm the public shell remains fixed in the same reading order throughout live refreshes: atmospheric header first, nearby modes second, fixed local map third.
- Background refreshes should update copy inside the existing shell without full-screen placeholders, remount-style resets, or card reshuffling.
- Calm update cues should read as continuity rather than novelty: currentness wording, fact-only "Latest change" copy, stable trust wording, and no alert posture.

## Supported Desktop Browser Review Focus

- Supported `1366px+` and `1024px+` desktop contexts should keep the same public shell markers: `data-reading-zone="header"`, `data-reading-zone="modes"`, and `data-reading-zone="map"`.
- Venue-browser polling should continue in the background through TanStack Query without focus-driven churn and without reverting to first-load placeholders.
- Nearby mode cards should retain stable React keys and canonical ordering even when trust, trend, or disruption scope changes.

## Reduced-Motion Checks

- `prefers-reduced-motion: reduce` remains active in `src/app/globals.css`.
- Update meaning remains legible through copy and structural emphasis: header update copy, mode update copy, local-frame update copy, and reduced-motion border emphasis.
- No animation library, marquee, blinking badge, auto-scroll, or spinner-based refresh affordance was introduced.

## Calm Update Observations

- Presenter-owned update meaning is derived from previous versus current snapshots, so the public route explains meaningful changes in wording instead of depending on motion.
- Header announcements are narrowly scoped to a single polite live region for meaningful trust or currentness changes; the public route does not use `role="alert"`.
- Canonical nearby mode ordering is preserved through presenter sorting, so trend or trust changes do not force visitors to rescan the grid.
- The fixed local map remains anchored in place while fallback or carried-forward states narrow only the local-map meaning.

## Automated Evidence

- `tests/unit/dashboard.presenter.test.mjs` verifies canonical nearby-mode ordering plus text-first change summaries.
- `tests/unit/dashboard.live-path.test.mjs` verifies the route-local polling boundary preserves the existing shell during background refreshes.
- `tests/smoke/startup-smoke.test.mjs` verifies reduced-motion hooks, stable reading-order markers, and non-alerting live-update posture.
- Full validation remains compatible with `npm run validate`.
