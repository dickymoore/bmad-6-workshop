## Albemarle Pulse

# BMAD Stage 1: Analysis

Albemarle Pulse is a live mobility dashboard centered on the Royal Institution.
It combines nearby TfL transport and weather data to show, at a glance, the
best options for getting around London from here, what disruption is building
next, and how conditions may affect onward journeys.

The goal of this stage is to frame the product clearly before any planning or
solution design artifacts exist.

## Workshop Goal For This Stage

Use BMAD to define:

- the real user problem
- the primary users around the Royal Institution
- what "best option" means in practice
- which live transport and weather signals matter most
- what the first useful dashboard view should and should not do

## Suggested Stage Flow

1. Run Codex.
2. Run `/skills` and confirm BMAD skills are available.
3. Run `$bmad-help`.
4. Use the BMAD analyst workflow to create the product brief.
5. Do the initial research work needed to sharpen the problem and scope.
6. Keep the scope tight:
   - Royal Institution centered
   - London only
   - public data only
   - calm decision dashboard, not full route planning
7. Inspect the files created or changed under `docs/`.
8. When you are done, stash any local changes and move to the next stage:

```bash
git stash
git checkout workshop/albemarle-pulse/20-planning
```

## Product Framing Prompts

Use these as pressure tests during analysis:

- Who is the dashboard really for: attendees leaving, attendees arriving, or both?
- What is the smallest high-value view someone can understand in under 10 seconds?
- Which nearby transport modes matter most around the Royal Institution?
- How should weather change recommendations without making the UI noisy?
- What disruption signals should be highlighted versus left in drill-down detail?
- What should be explicitly out of scope for MVP?

## Expected Output Boundary

At the end of this branch, analysis outputs should exist.
Planning outputs should not.

## Where The App Lives

The actual Next.js application is in `src/app/`.

- Public display route: `src/app/(public)/page.tsx`
  - serves `/`
  - renders the shared foyer display
- Local-only ops route: `src/app/(ops)/ops/page.tsx`
  - serves `/ops`
  - renders the operator-facing maintenance and readiness surface
- Public dashboard API: `src/app/api/dashboard/route.ts`
- Local-only ops APIs:
  - `src/app/api/ops/health/route.ts`
  - `src/app/api/ops/actions/route.ts`

## Run Locally

Requirements:

- Node `24.x`
- npm

From the repo root:

```bash
cp env.local.example .env.local
npm install
npm run dev
```

Then open:

- `http://localhost:3000` for the public display
- `http://localhost:3000/ops` for the local-only ops surface

Notes:

- The app can boot without live provider keys. In that case it falls back to the stored or fixture dashboard path so the UI still loads.
- The ops route is intentionally local-only. If you want to reach `/ops` through a named local host instead of loopback, add that host to `OPS_ALLOWED_HOSTS` in `.env.local`.

## Local Environment File

Store local secrets in `.env.local` at the repo root.

- Do not commit `.env.local`
- Do not put provider secrets in `NEXT_PUBLIC_` variables
- Use `env.local.example` as the template and copy it to `.env.local`

Next.js loads `.env*` files into `process.env`, and non-`NEXT_PUBLIC_` variables remain server-only:

- Official Next.js environment variable guide: https://nextjs.org/docs/pages/guides/environment-variables

## Live API Keys

This repo uses two external providers for live data:

- TfL for nearby transport status
- WeatherAPI for current weather

If you do not configure these keys, the app still starts, but it will not fetch live provider data.

### TfL

The current provider code reads:

- `TFL_API_KEY`
- `TFL_APP_ID`
- optional `TFL_FORCE_LIVE`

How to get a key:

1. Create a TfL Open Data account: https://api-portal.tfl.gov.uk/signup
2. Activate the account from the confirmation email
3. Sign in to the TfL API portal: https://api-portal.tfl.gov.uk/
4. Use the `APIs` page to browse the available API groups and confirm the endpoints you need
5. Open `Products` and subscribe to the `500 requests per min` product if you need a subscription key and higher request limits
6. Open `Profile` and retrieve your subscription key

TfL currently states that requests should use `app_key` and that `app_id` is no longer required. In this repo, that means:

- `TFL_API_KEY` should be populated for normal live access
- `TFL_APP_ID` can usually be left blank

Useful official links:

- TfL API portal home: https://api-portal.tfl.gov.uk/
- TfL APIs catalog: https://api-portal.tfl.gov.uk/apis
- TfL API details: https://api-portal.tfl.gov.uk/api-details
- TfL products: https://api-portal.tfl.gov.uk/products
- TfL profile: https://api-portal.tfl.gov.uk/profile
- TfL FAQ: https://api-portal.tfl.gov.uk/faq

### WeatherAPI

The current provider code reads:

- `WEATHERAPI_KEY`
- optional `WEATHERAPI_LOCATION`
- optional `WEATHERAPI_FORCE_LIVE`

How to get a key:

1. Create a WeatherAPI account: https://www.weatherapi.com/signup.aspx
2. Sign in and get your API key from your account
3. Put that key in `WEATHERAPI_KEY`

WeatherAPI documents that you can sign up, find your API key under your account, and start using it right away. If the key is ever exposed, they also document regenerating it from the account area.

Useful official links:

- WeatherAPI signup: https://www.weatherapi.com/signup.aspx
- WeatherAPI docs: https://www.weatherapi.com/docs/
- WeatherAPI account login: https://www.weatherapi.com/login.aspx

## Environment Variables Used By This Repo

Copy `env.local.example` to `.env.local` and fill in only what you need.

- `TFL_API_KEY`
  - live TfL subscription key
- `TFL_APP_ID`
  - optional legacy field; usually leave blank
- `TFL_FORCE_LIVE`
  - when `0` or unset, the app skips the TfL live call if no TfL credentials are configured
  - when set to `1`, the app will still attempt the live TfL request instead of silently skipping it
  - this is mainly useful for deliberate integration testing or custom provider setups, not normal local use
- `WEATHERAPI_KEY`
  - live WeatherAPI key
- `WEATHERAPI_LOCATION`
  - optional query override; defaults to `51.5099,-0.1419`
- `WEATHERAPI_FORCE_LIVE`
  - when `0` or unset, the app skips the WeatherAPI live call if no weather key is configured
  - when set to `1`, the app will still attempt the live weather request instead of silently skipping it
  - without a valid `WEATHERAPI_KEY`, that forced request will usually fail and the app will fall back to last-safe or fixture behavior
- `DASHBOARD_REFRESH_INTERVAL_MS`
  - optional refresh interval override; defaults to `30000`
- `OPS_ALLOWED_HOSTS`
  - optional comma-separated host allowlist for `/ops` in addition to loopback hosts

## Baseline Build-Readiness Gate

Before promoting the public display build to the venue laptop, run the baseline
quality gate from the repo root:

```bash
npm run validate
```

That gate runs:

- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run build`

The intent is operational, not ceremonial: any change that weakens code
quality, type safety, test coverage, or production buildability should fail
before the foyer display is manually promoted. The matching GitHub Actions
workflow in `.github/workflows/build-readiness.yml` mirrors the same checks on
Node 24 so public-display reliability is verified before venue rollout.

Unit coverage currently runs through the lightweight local `vitest`
compatibility package at `tools/vitest-lite/` so the baseline gate stays
available even in restricted workshop environments without pulling in heavier
test infrastructure early.
