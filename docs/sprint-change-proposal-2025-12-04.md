# Sprint Change Proposal — Floorplan Assets Fix
Date: 2025-12-04
Owner: DICKY (PM)

## 1) Issue Summary
- Floorplan PNGs are not being served: all offices/floors show `Floorplan image unavailable` and console logs `Missing floorplan asset for {officeId} {floorId}: /assets/floorplans/{officeId}-{floorId}.png`.
- Root cause: expected asset path `/assets/floorplans/{officeId}-{floorId}.png` is not populated in the built app. Actual PNGs live under `office-floorplans/demo-*.png` with different naming and not copied to the public assets folder.
- Impact: Epic 2 (Availability View & Navigation) blocked; PRD FR4/FR5 unmet; architecture/UX assumptions broken; visual confidence and usability degraded.

## 2) Impact Analysis
- **Epic Impact**: Epic 2 cannot be completed until assets render. Epic 3 still functions but UX quality drops without map context.
- **PRD**: Violates FR4 (floorplan PNG render) and FR5 (availability overlay on map). MVP achievable once assets are served.
- **Architecture**: Assumes PNGs are available from `assets/floorplans/`; alignment required between build output and file locations.
- **UX**: Core screen relies on the map; current fallback degrades experience. Need graceful fallback plus working assets.
- **Testing/Tooling**: Any visual or availability tests will fail without assets; build should guard against missing PNGs.

## 3) Recommended Approach (Option 1 — Direct Adjustment)
Low-risk, contained changes to restore required functionality and prevent regressions.

### 3.1 Actions (implementation order)
1) **Asset copy pipeline**: During dev/build, copy floorplan PNGs into a served path `public/assets/floorplans/` (or equivalent) so Vite serves them at `/assets/floorplans/*.png`.
2) **Filename alignment**: Ensure filenames follow `{officeId}-{floorId}.png`. If source files differ, add a mapping/rename step (e.g., `office-lon-lon-1.png`, `office-bri-bri-1.png`, `office-man-man-1.png`, etc.).
3) **Validation script**: Add a CI/dev script that reads `office-floorplans/assets/floorplans/offices.json` and verifies every floor has a matching PNG in the served directory; fail on missing files.
4) **Code path check**: Keep `buildFloorplanSrc` pointing to `/assets/floorplans/${officeId}-${floorId}.png`; adjust only if served path changes.
5) **Docs**: Update README/setup with where to place new floorplans and how to regenerate/copy them.

### 3.2 Effort & Risk
- Effort: Low–Medium (1–2 dev hours + quick QA).
- Risk: Low (static assets). Main risk is naming drift; mitigated by validation script.

## 4) Detailed Change Proposals (Batch)

| Artifact | Current | Proposed | Rationale |
| --- | --- | --- | --- |
| Build assets | No PNGs under `/assets/floorplans/` | Add build/dev copy from `office-floorplans/*.png` to `public/assets/floorplans/` | Serve images at expected path; unblock FR4/FR5 |
| Filenames | Source `demo-*.png` not matching `{officeId}-{floorId}` | Rename or map to `{officeId}-{floorId}.png` per `offices.json` IDs | Ensure FloorplanView resolves correct file |
| Validation | None | Script to assert PNG exists for every office/floor in `offices.json`; fail build if missing | Prevent regressions, catches naming drift |
| Docs | No guidance on floorplan assets | Add README note on where PNGs live and naming convention | Keep contributors aligned |

## 5) Implementation Handoff
- **Scope classification**: Minor (static assets + small script/config change).
- **Dev**: Implement copy/rename + validation + doc update; confirm FloorplanView still points to `/assets/floorplans/...`.
- **QA**: Verify no 404s, hotspots overlay on correct PNGs, accessibility unchanged; regression on booking flow unaffected.
- **PO/PM**: Approve updated acceptance criteria for Epic 2 Story 2.2 (include asset validation & served path).

## 6) Success Criteria
- All offices/floors load correct PNGs at `/assets/floorplans/{officeId}-{floorId}.png` with no console 404s.
- Floorplan visible with hotspots; counts/legend accurate for selected date.
- Validation script passes in CI and fails if any PNG missing.
- README includes asset instructions.

## 7) Next Steps
- If approved: Dev to implement and raise PR; QA to run smoke (load each office/floor, check console). Target completion: same sprint.

Approval: ___ Yes  ___ No  ___ Revisions requested
