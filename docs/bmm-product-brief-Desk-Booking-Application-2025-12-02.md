# Product Brief: Desk Booking Application

**Date:** 2025-12-02
**Author:** DICKY
**Context:** Greenfield, local-only, lightweight file-based SPA using existing floorplan assets

---

## Executive Summary
A fast, local-only desk booking app for ~20 known users. Users pick office/floor/date, see availability on existing floorplan PNGs (hotspots from desks.json), and make day-level bookings with one booking per user per day. Data is stored in JSON files with immediate write-through plus backup/export. No auth, no multi-device sync, no half-day slots—minimal to ship quickly with clear availability and reliability.

---

## Core Vision

### Problem Statement
Ad hoc coordination on “who sits where today” is error-prone. There’s no single source of truth for desk assignments across offices/floors, causing confusion and wasted time.

### Problem Impact
Confusion and rework when two people think they have the same desk; lack of visibility into who is onsite on a given day.

### Proposed Solution
A single-page web app (React + Vite) running locally: select office/floor/date, view floorplan with availability overlay, choose user from dropdown, and book/cancel desks. Automatic save to JSON with backup/export. Desk IDs validated against desks.json to keep hotspots accurate.

### Key Differentiators
- Ultra-light footprint: no auth, no server DB, local JSON files.
- Uses existing floorplan PNGs and mapping JSON—no rework of assets.
- Clear per-day availability and “who’s where” list; one booking per user/day enforced.

---

## Target Users

### Primary Users
- Employees or visitors (pre-listed ~20 users) needing a desk for a given day in a specific office/floor.

### Secondary Users
- Admin maintaining the user list and ensuring desk mappings stay aligned with PNGs.

### User Journey
Pick office/floor → pick date → see availability overlay → select user → click desk hotspot → confirm booking → see per-day list; cancel/release if needed; optional backup/export.

---

## Success Metrics
- Booking success rate without conflicts.
- Accuracy of availability view vs saved state.
- Backup/export usability (can restore without errors).

### Business Objectives
- Provide a reliable single source of truth for daily desk allocation.

### Key Performance Indicators
- 0 conflicting bookings per day (one booking/user/day enforced).
- <1 minute to place a booking end-to-end locally.
- Successful backup/restore roundtrip without data loss.

---

## MVP Scope

### Core Features
- Office/floor selector; date picker; user dropdown (~20 users + visitor).
- Floorplan PNG render with clickable desk hotspots from desks.json.
- Per-day availability legend (free/booked) and per-day “who’s where” list.
- Booking rules: one booking per user per day; cancel/release.
- Persistence: write-through JSON (`bookings.json`, `users.json`), last-updated timestamp, backup/export to `data/backup/backup-YYYYMMDD-HHMMSS.json`, import with schema validation.
- Validation: deskId must exist in desks.json; on load, drop/flag invalid records.

### Out of Scope for MVP
- Authentication, multi-device sync, half-day/time-slot bookings, approvals, reporting.

### MVP Success Criteria
- Users can view availability and book/cancel without conflicts; state survives restart via JSON save; backup/export/import works.

### Future Vision
- Click per-day list to highlight desk on map; printable per-day seating snapshot; optional check-in toggle; eventual multi-device + auth if needed.

---

## Market Context
Internal/local utility; no external competitive pressure. Key benchmark is speed and reliability for a small team.

## Technical Preferences
React 19.2 + Vite 6 SPA on Node 22 LTS; JSON file storage in `data/`; reuse PNG + desks.json assets; pin versions; validate desks on load; write-through saves.

## Risks and Assumptions
- Data loss risk mitigated by write-through + backups.
- Mapping drift risk mitigated by deskId validation vs desks.json and optional overlay debug.
- Assumes single-user environment (no true concurrency) and fixed ~20-user roster.

## Timeline
Keep as short as possible; defer all non-essential features.

## Supporting Materials
- Brainstorm: docs/brainstorming-session-results-2025-12-02.md
- Technical research: docs/bmm-research-technical-2025-12-02.md
- ADR: docs/adr/ADR-001-tech-stack.md

---

_Next: Use PRD workflow to turn this brief into detailed requirements and then proceed to Architecture & Epics/Stories._
