# Story 1.1: Project scaffold and data directories

Status: ready-for-dev

## Story

As a developer, I want the repository scaffolded with the agreed stack and data folders so the desk booking app runs locally with a predictable structure.

## Acceptance Criteria

1. From a fresh clone, `npm install` then `npm run dev` starts the app without errors using Node 22.x LTS, React 19.2, and Vite 6.x. citedocs/architecture.md  
2. Data directory exists with `users.json`, `bookings.json`, `last-updated.json`, and `backup/` subfolder on initial setup. citedocs/architecture.md  
3. `.gitignore` excludes backup artifacts (`data/backup/*`), build output, and node_modules. citedocs/architecture.md  
4. Package manifest pins stack versions consistent with architecture (React 19.2, Vite 6.2.x, Radix UI 1.2.x, Node 22 engines field). citedocs/architecture.md  
5. Storage seed files are valid JSON (empty arrays for users/bookings, ISO string for last-updated) to avoid startup errors. citedocs/sprint-artifacts/tech-spec-epic-1.md  
6. Repository includes a quickstart note describing commands and data folder layout for new contributors. citedocs/prd.md

## Tasks / Subtasks

- [ ] Initialize project scaffold (AC:1)  
  - [ ] Create Vite React TS project (or align existing) and ensure `npm run dev` succeeds on Node 22.x.  
  - [ ] Pin dependencies to React 19.2, Vite 6.2.x, Radix UI 1.2.x; add `engines.node: ">=22 <23"`.  
- [ ] Create data directories and seed files (AC:2,5)  
  - [ ] Add `data/`, `data/backup/`; seed `users.json` and `bookings.json` as `[]`; seed `last-updated.json` with `{ "updatedAt": "" }`.  
- [ ] Harden ignore rules (AC:3)  
  - [ ] Update `.gitignore` to exclude `data/backup/*`, `dist/`, `node_modules/`, temp files.  
- [ ] Document quickstart (AC:6)  
  - [ ] Add README section or CONTRIBUTING note covering setup commands and data layout.  
- [ ] Smoke test (AC:1,5)  
  - [ ] Run `npm run dev` to confirm app boots; fail if seed files missing/invalid.  
- [ ] Testing hooks (AC:5)  
  - [ ] Add minimal validation script/test ensuring seed JSON parses and data dirs exist.

## Dev Notes

- Architecture: Client-only React 19.2 + Vite 6.2.5; synchronous JSON storage under `data/`; backups in `data/backup/`; write-through saves and deskId validation rely on storage layer defined for Epic 1. citedocs/architecture.md  
- Persistence contracts: Storage services defined in Epic 1 tech spec—use `storage/fs-adapter`, `storage/schema`, and `last-updated` helpers; seed files must align with those schemas. citedocs/sprint-artifacts/tech-spec-epic-1.md  
- Requirements link: PRD FR12–FR15 demand reliable file persistence, backup/import, and last-updated tracking; this story sets the foundation. citedocs/prd.md  
- Testing: Prefer Vitest unit checks for seed JSON validity and a smoke `npm run dev` workflow in CI (local).  
- Risks: Partial writes or missing dirs break downstream booking flows—mitigate with mkdirp on startup and atomic writes in storage module (covered in later stories).

### Project Structure Notes

- Create/ensure `data/`, `data/backup/`, and `.gitignore` entries per architecture spec.  
- Place storage modules under `src/lib/storage/`; keep seed JSON in project root `data/` to match backup/import paths. citedocs/architecture.md

### References

- docs/prd.md (FR12–FR15 persistence requirements)  
- docs/architecture.md (stack versions, data layout, write-through pattern)  
- docs/sprint-artifacts/tech-spec-epic-1.md (storage services, schemas, backup/import expectations)

## Dev Agent Record

### Context Reference

- docs/sprint-artifacts/1-1-project-scaffold-and-data-directories.context.xml

### Agent Model Used

OpenAI GPT-5 (Codex SM mode)

### Debug Log References

### Completion Notes List

### File List

- NEW: docs/sprint-artifacts/1-1-project-scaffold-and-data-directories.md
- NEW: docs/sprint-artifacts/1-1-project-scaffold-and-data-directories.context.xml

## Change Log

- 2025-12-03: Initial draft created from epics, PRD, architecture, and tech spec.
- 2025-12-03: Generated story context and marked ready-for-dev.
