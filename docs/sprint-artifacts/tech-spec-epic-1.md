# Epic Technical Specification: Foundation & Persistence

Date: 2025-12-03
Author: DICKY
Epic ID: 1
Status: Draft

---

## Overview

Epic 1 establishes the local persistence backbone for the desk booking SPA: predictable project scaffold, JSON storage with schema validation, last-updated tracking, and roster handling. It underpins all booking, availability, and backup flows by ensuring data integrity and reliable file I/O on a single machine.

## Objectives and Scope

In Scope  
- Create and verify repo scaffold matching architecture (React 19.2, Vite 6, Node 22).  
- Provide storage module for bookings/users with schema validation and deskId alignment to desks.json.  
- Maintain `last-updated.json` on every write/import.  
- Seed and persist user roster (~20 users + visitor).  
- Ensure data directories (`data/`, `data/backup/`) exist and are .gitignored.  

Out of Scope  
- UI booking flows (Epic 2/3) beyond storage hooks.  
- Authentication, multi-device sync, time-slot booking, reporting.  
- Cloud/DB persistence; remains local file system.

## System Architecture Alignment

- Adheres to client-only architecture (React + Vite) with synchronous JSON writes.  
- Storage helpers live under `src/lib/storage` and are single source for read/write/validation; consumed by booking, backup, and roster features.  
- deskId validation uses desks.json (same asset used by floorplan overlay) to prevent orphan bookings.  
- Backup/import uses same schemas as runtime storage to avoid drift.

## Detailed Design

### Services and Modules

| Module | Responsibility | Inputs | Outputs | Owner |
| --- | --- | --- | --- | --- |
| storage/fs-adapter | Low-level read/write JSON, mkdirp backup dir, atomic write (temp + rename) | filePath, data | { ok, error } | Dev |
| storage/schema | zod/ajv schemas for users, bookings, backup payload | raw JSON | parsed objects or errors | Dev |
| storage/bookings-service | Read/write bookings with deskId validation, conflict checks (hook for Epic 3), update last-updated | booking DTO | { ok, data } | Dev |
| storage/users-service | Read/write roster, seed empty array if missing, update last-updated on change | users array | { ok, data } | Dev |
| storage/last-updated | Read/write `{ updatedAt }` ISO string | none | timestamp string | Dev |
| backup/export | Create timestamped snapshot `data/backup/backup-YYYYMMDD-HHMMSS.json` | current users/bookings/lastUpdated | { ok, path } | Dev |
| backup/import | Validate backup schema; on success overwrite users/bookings/lastUpdated; rollback on failure | backup file path | { ok, data } | Dev |

### Data Models and Contracts

- User: `{ id: string, name: string, active: boolean }` (visitor optional id).  
- Booking: `{ id: string (uuidv4), office: string, floor: string, deskId: string, date: YYYY-MM-DD, userId: string, createdAt: ISO, releasedAt?: ISO }`; deskId must exist in desks.json for given office/floor.  
- LastUpdated: `{ updatedAt: ISO }`.  
- Backup file: `{ users: User[], bookings: Booking[], lastUpdated: { updatedAt } }`, optional `schemaVersion`.

### APIs and Interfaces

- `readUsers(): Promise<Result<User[]>>`  
- `writeUsers(users: User[]): Promise<Result<void>>`  
- `readBookings(): Promise<Result<Booking[]>>`  
- `writeBookings(bookings: Booking[]): Promise<Result<void>>` (validates deskId)  
- `exportBackup(): Promise<Result<{ path: string }>>`  
- `importBackup(path: string): Promise<Result<void>>` (schema validate, replace files, update last-updated)  
- `readLastUpdated()/writeLastUpdated(ts)`  
All return `{ ok: true, data? }` or `{ ok: false, error }`; no throws on expected validation errors.

### Workflows and Sequencing

1. Startup: ensure data directories; read users/bookings with schema validation; drop/flag invalid rows; load last-updated.  
2. Booking write (used by later epics): validate deskId → write file → update last-updated → emit success/error.  
3. Backup: read current data → mkdirp backup → write snapshot file → return path.  
4. Import: validate backup schema → write users/bookings → write last-updated (now) → refresh in-memory state.  

## Non-Functional Requirements

### Performance
- File I/O must stay sub-100ms on local machine for typical sizes (<1k bookings).  
- No blocking UI: wrap writes with async calls, but writes are synchronous on FS to keep integrity.

### Security
- Local-only; refuse absolute paths outside project data dir for import/export.  
- Validate all imported data; reject unknown fields or invalid deskIds.

### Reliability/Availability
- Atomic writes (temp + rename) to avoid partial files.  
- On read errors, app shows blocking error with recovery instructions; never proceeds with corrupt state.  
- Backup/import has rollback on failure (leave existing data untouched).

### Observability
- Console.info for success, console.error for failures; optional in-app toast mirroring.  
- Record last-updated on every successful write/import; surface in UI.

## Dependencies and Integrations

- Node 22.17.x LTS, npm 10.x; React 19.2; Vite 6.2.5; Radix UI 1.2.0.  
- zod or ajv for schema validation.  
- uuid for booking IDs.  
- desks.json and floorplan PNGs as authoritative assets (read-only for this epic).  
- FS access under `data/` and `data/backup/`.

## Acceptance Criteria (Authoritative)

1. Fresh clone + `npm install && npm run dev` starts app; data folder present with `users.json`, `bookings.json`, `last-updated.json`, `backup/`.  
2. Storage module validates users/bookings; invalid rows skipped and logged without app crash.  
3. Every write to users or bookings updates `last-updated.json` with ISO timestamp.  
4. DeskId validation blocks writes when deskId missing from desks.json.  
5. Backup export writes `backup-YYYYMMDD-HHMMSS.json` containing users, bookings, lastUpdated; success path returned.  
6. Import rejects malformed or schema-mismatched backups with clear error and no data change.  
7. Import success replaces users/bookings and refreshes last-updated; UI reflects new data after reload.  
8. `.gitignore` excludes backup files and build artifacts.  

## Traceability Mapping

| AC | Spec Section | Components/APIs | Test Idea |
| --- | --- | --- | --- |
| 1 | Services, NFR Reliability | bootstrap script, storage/fs-adapter | E2E: fresh clone run dev, check data files created |
| 2 | Services, Data Models | storage/schema, readUsers/readBookings | Unit: invalid rows dropped, warning logged |
| 3 | Services, NFR Reliability | writeUsers/writeBookings, last-updated | Unit: write updates timestamp; E2E after booking write |
| 4 | APIs | writeBookings, desks.json | Unit: invalid deskId rejected |
| 5 | Backup | exportBackup | Unit: filename regex; file contents structure |
| 6 | Backup/Import | importBackup | API: invalid schema rejected, no file mutation |
| 7 | Backup/Import | importBackup, last-updated | E2E: import valid file, data replaced, timestamp newer |
| 8 | Scope/Setup | repo scaffold | Unit: .gitignore contains backup/, dist/ |

## Risks, Assumptions, Open Questions

- Risk: Partial writes corrupt data → mitigated via temp file + rename and error surfacing.  
- Risk: desks.json drift from floorplan → add optional validation script and warn on mismatch.  
- Assumption: Single-machine use; no concurrent processes writing files.  
- Question: Need version field in backup to guard future schema changes? (recommend add `schemaVersion: 1`).

## Test Strategy Summary

- Unit: schema validation, deskId checks, timestamp update, filename regex, rollback on failed import.  
- API/Integration: export/import happy + error paths, atomic write behavior, invalid row handling.  
- E2E (optional now, required pre-release): fresh-clone bootstrap, backup/export/import smoke.  
- Tooling: use Vitest for unit/API; Playwright optional for bootstrap smoke.  
