# Test Design: Epic 2 - Availability View & Navigation

**Date:** 2025-12-03
**Author:** DICKY
**Status:** Draft

---

## Executive Summary
Scope: Epic 2 (office/floor/date selectors, floorplan render, availability colors, per-day list).

**Risk Summary**
- Total risks: 7
- High-priority (≥6): 3 (desk mapping drift, availability calc errors, accessibility gaps)
- Critical categories: TECH, DATA, BUS

**Coverage Summary**
- P0 scenarios: 7 (14 hours)
- P1 scenarios: 7 (7 hours)
- P2/P3 scenarios: 5 (2.5 hours)
- Total effort: 23.5 hours

---

## Risk Assessment

### High-Priority Risks (Score ≥6)
| Risk ID | Category | Description | Prob | Impact | Score | Mitigation | Owner | Timeline |
| ------- | -------- | ----------- | ---- | ------ | ----- | ---------- | ----- | -------- |
| R2-TECH-MAPDRIFT | TECH | Hotspot coordinates/deskId mismatch to PNG causing wrong desk selection | 2 | 3 | 6 | Add validation script & visual overlay test; E2E hotspot click asserts deskId | QA | 2025-12-06 |
| R2-DATA-AVAIL | DATA | Availability calculation includes wrong date/office/floor leading to false conflicts | 2 | 3 | 6 | Unit tests for filter pipeline; date-only comparison; timezone-safe ISO | Dev | 2025-12-05 |
| R2-BUS-A11Y | BUS | Keyboard users cannot focus hotspots/legend causing unusable UI | 2 | 3 | 6 | Component tests for focusability + aria labels; contrast check | QA | 2025-12-05 |

### Medium-Priority Risks (Score 3-4)
| Risk ID | Category | Description | Prob | Impact | Score | Mitigation | Owner |
| ------- | -------- | ----------- | ---- | ------ | ----- | ---------- | ----- |
| R2-PERF-IMG | PERF | Large PNG slows render on slow machines | 2 | 2 | 4 | Lazy load + smoke visual test; doc limit sizes | Dev |
| R2-OPS-FILTERSTATE | OPS | Filters not persisted/reset predictably causing confusion | 2 | 2 | 4 | Component test default today; reset behavior | QA |
| R2-BUS-LISTSYNC | BUS | List and map desync after booking change | 2 | 2 | 4 | E2E create/cancel ensures both update | QA |
| R2-TECH-SORT | TECH | Sorting per-day list unstable | 1 | 2 | 2 | Unit test stable sort | Dev |

### Low-Priority Risks (Score 1-2)
| Risk ID | Category | Description | Prob | Impact | Score | Action |
| ------- | -------- | ----------- | ---- | ------ | ----- | ------ |
| R2-UX-TOOLTIP | BUS | Tooltip text missing/incorrect | 1 | 1 | 1 | Monitor |

---

## Test Coverage Plan

### P0 (Critical)
| Requirement | Test Level | Risk Link | Test Count | Owner | Notes |
| ----------- | ---------- | --------- | ---------- | ----- | ----- |
| Office/floor/date filters narrow bookings correctly | Unit | R2-DATA-AVAIL | 2 | Dev | date-only compare, office/floor keys |
| Floorplan hotspot click selects correct deskId | Component | R2-TECH-MAPDRIFT | 2 | QA | uses sample desks.json + PNG stub |
| Hotspots keyboard-focusable & aria-label includes status/user | Component | R2-BUS-A11Y | 2 | QA | axe check |
| Availability colors reflect booking status | Component | R2-DATA-AVAIL | 1 | QA | free/booked/selected |
| Per-day list updates after map booking change (happy path) | E2E | R2-BUS-LISTSYNC | 1 | QA | uses storage stub |
| Per-day list updates after cancel | E2E | R2-BUS-LISTSYNC | 1 | QA | cancel flow |
| Legend visible at all times | Component | R2-BUS-A11Y | 1 | QA | presence & contrast |

### P1 (High)
| Requirement | Test Level | Risk Link | Test Count | Owner | Notes |
| Hotspots show deskId tooltip on hover/focus | Component | R2-UX-TOOLTIP | 1 | QA | a11y |
| Sorting per-day list by desk/user stable | Unit | R2-TECH-SORT | 1 | Dev | deterministic |
| Filters default to today & first office/floor | Component | R2-OPS-FILTERSTATE | 1 | QA | default state |
| Filter change updates both map and list | E2E | R2-DATA-AVAIL | 2 | QA | office and date cases |
| PNG lazy-load placeholder renders | Component | R2-PERF-IMG | 1 | QA | avoids blank |
| Large PNG performance smoke (load < threshold) | E2E | R2-PERF-IMG | 1 | QA | smoke timing |
| List row highlights desk on select (if implemented) or shows details | Component | R2-BUS-LISTSYNC | 1 | QA | optional highlight |

### P2/P3 (Medium/Low)
| Requirement | Test Level | Test Count | Owner | Notes |
| ----------- | ---------- | ---------- | ----- | ----- |
| Tooltip copy text matches spec | Component | 1 | QA | P3 |
| Filter reset button clears state | Component | 1 | QA | optional |
| Legend contrast AA verified | Component | 1 | QA | color tokens |
| Map overlay z-index above image | Component | 1 | Dev | visual |
| Empty state (no bookings) list shows friendly message | Component | 1 | QA | accessibility |

---

## Execution Order
- Smoke: filter default, legend present, hotspot keyboard focus.
- P0: filter correctness, map/list sync, color status, accessibility.
- P1: sorting, lazy-load/perf smoke, tooltip, filter resets.
- P2/P3: copy/visual edges.

---

## Resource Estimates
| Priority | Count | Hours/Test | Total Hours |
| -------- | ----- | ---------- | ----------- |
| P0 | 7 | 2.0 | 14 |
| P1 | 7 | 1.0 | 7 |
| P2/P3 | 5 | 0.5 | 2.5 |
| **Total** | **19** | - | **23.5** |

---

## Quality Gate Criteria
- P0 100% pass; P1 ≥95%.
- No map/list desync; accessibility checks (focusable hotspots, aria labels, contrast) all green.
- Availability math validated for office/floor/date and cancel paths.

---

## Mitigation Plans
- Map drift: add desk overlay validator script; visual diff of hotspots vs PNG.
- Availability correctness: isolate selector logic; unit tests for date-only compare; TZ-free ISO strings.
- Accessibility: use Radix focus rings; axe checks in CI; ensure legend/tooltip labels.

---

## Assumptions and Dependencies
- desks.json contains office/floor metadata and coordinates.
- PNG assets available locally; single timezone (local machine).

## Related Documents
- PRD: docs/prd.md
- Architecture: docs/architecture.md
- Epic: docs/epics.md (Epic 2)

