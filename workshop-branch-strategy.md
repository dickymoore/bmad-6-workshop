# Workshop Branch Strategy

## Goals

- Keep `main` as the shared workshop bootstrap.
- Make each demo an explicit track instead of baking desk-booking into the whole repo.
- Leave room for parallel workshops without reworking the automation again.

## Branch Model

Shared entry point:

- `main`

Rolling authoring branches:

- `authoring/<track>`

Desk-booking track:

- `workshop/desk-booking/10-analysis`
- `workshop/desk-booking/20-planning`
- `workshop/desk-booking/30-solutioning`
- `workshop/desk-booking/40-implementation-setup`
- `workshop/desk-booking/50-ready-for-dev`
- `workshop/desk-booking/60-implementation`
- `workshop/desk-booking/70-complete`
- `workshop/desk-booking/80-mvp`

Future tracks should follow the same pattern:

- `workshop/<track>/10-analysis`
- `workshop/<track>/20-planning`
- ...

Recommended authoring pattern for every track:

- do real BMAD work on `authoring/<track>`
- cut the frozen `workshop/<track>/*` branches only at stage boundaries

## Track Metadata

Track definitions now live in `workshops/`.

- `workshops/index.json` selects the default track.
- `workshops/desk-booking/track.json` defines branch order, folder mapping,
  stage guidance, required patterns, forbidden patterns, and compatibility names.

Automation on `main` reads this data instead of hard-coding a single desk-booking ladder.

## Compatibility Policy

The scripts still accept these older names for the desk-booking track:

- Old canonical:
  - `workshop/10-analysis`
  - `workshop/20-planning`
  - `workshop/30-solutioning`
  - `workshop/40-implementation-setup`
  - `workshop/50-ready-for-dev`
  - `workshop/60-implementation`
  - `workshop/70-complete`
  - `workshop/80-mvp`
- Legacy aliases:
  - `stage-1`
  - `stage-2`
  - `stage-3`
  - `stage-4`
  - `ready-for-dev`
  - `implementation-in-progress`
  - `complete`
  - `mvp`

Docs and facilitator flow should use the namespaced `workshop/desk-booking/*`
branches first. Compatibility names are there to avoid breaking live delivery
or older notes during the transition.

## Migration Method

1. Make automation track-aware on `main`.
2. Create namespaced desk-booking branches from the existing canonical workshop branches.
3. Update branch-local README guidance to point at namespaced next branches.
4. Keep compatibility names working until facilitators stop relying on them.

## Safety Rules

- Do not delete old compatibility branches casually.
- Do not break `main`; it is the shared bootstrap for all tracks.
- Stage branches must still obey the pre-artifact rule: each branch contains
  only the outputs up to that stage, not the outputs participants are meant to create next.
