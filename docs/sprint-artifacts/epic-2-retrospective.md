# Epic 2 Retrospective — Availability View & Navigation

Date: 2025-12-03  
Facilitator: DICKY  
Status: Completed

## What Went Well

- Filter → floorplan → list pipeline defined with shared state, reducing sync bugs risk.
- Accessibility baked into hotspots (focus/ARIA) and legend/tooltip plans.
- All availability stories (selectors, hotspots, list, coloring) reached ready-for-dev with contexts.

## What Didn’t Go Well

- Potential map/list desync risk if shared state isn’t centralized in implementation.
- PNG/desk coordinate validation strategy still needs a concrete helper/script.

## Actions / Follow-Ups

- Implement a single filter/booking state store consumed by FloorplanView and BookingList.
- Add a desks.json overlay validator script to catch coordinate drift before shipping.
- Include accessibility checks (axe) in CI for hotspots and legend.

## Appreciations

- Strong linkage to FR1, FR2, FR4, FR5, FR10, FR11 keeps scope tight and testable.  
