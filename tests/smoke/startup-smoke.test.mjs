import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");

test("story 1.1 scaffold baseline exists at repo root", () => {
  assert.equal(existsSync(join(root, "package.json")), true, "expected package.json at repo root");
  assert.equal(existsSync(join(root, "tsconfig.json")), true, "expected tsconfig.json at repo root");
  assert.equal(existsSync(join(root, "src", "app", "layout.tsx")), true, "expected src/app/layout.tsx");
  assert.equal(existsSync(join(root, "src", "app", "globals.css")), true, "expected src/app/globals.css");
});

test("story 1.1 keeps the approved baseline and runtime contract", () => {
  const packageJsonPath = join(root, "package.json");
  assert.equal(existsSync(packageJsonPath), true, "expected package.json at repo root");

  const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));

  assert.equal(packageJson.dependencies.next, "16.1.7", "expected approved Next.js baseline");
  assert.equal(packageJson.engines.node, "24.x", "expected Node 24 runtime contract");
  assert.equal(packageJson.devDependencies["@types/node"], "^24", "expected Node 24 type baseline");
  assert.equal(Boolean(packageJson.dependencies.tailwindcss), false, "tailwind should not be installed");
  assert.equal(Boolean(packageJson.devDependencies.tailwindcss), false, "tailwind should not be installed");
});

test("story 1.2 exposes a first-class local validation gate", () => {
  const packageJsonPath = join(root, "package.json");
  const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));

  assert.equal(packageJson.scripts.lint, "eslint .", "expected explicit lint command");
  assert.equal(packageJson.scripts.typecheck, "tsc --noEmit", "expected first-class typecheck command");
  assert.equal(
    packageJson.scripts.test,
    "npm run test:smoke && npm run test:unit",
    "expected test command to preserve smoke checks and run unit coverage",
  );
  assert.equal(
    packageJson.scripts["test:smoke"],
    "node --test tests/smoke/*.test.mjs",
    "expected smoke command to stay fast and scoped to scaffold checks",
  );
  assert.equal(
    packageJson.scripts.validate,
    "npm run lint && npm run typecheck && npm test && npm run build",
    "expected aggregate build-readiness gate",
  );
});

test("story 1.1 separates public and non-public ops routes", () => {
  const publicRoutePath = join(root, "src", "app", "(public)", "page.tsx");
  const opsRoutePath = join(root, "src", "app", "(ops)", "ops", "page.tsx");
  const opsFeaturePath = join(root, "src", "features", "ops", "components", "OpsShell.tsx");
  const opsContentPath = join(root, "src", "features", "ops", "ops-shell-content.js");
  const opsAccessPath = join(root, "src", "lib", "server", "security", "assert-ops-access.js");

  assert.equal(existsSync(publicRoutePath), true, "expected public route group page");
  assert.equal(existsSync(opsRoutePath), true, "expected ops route group page");
  assert.equal(existsSync(opsFeaturePath), true, "expected dedicated ops feature shell");
  assert.equal(existsSync(opsContentPath), true, "expected ops shell content model");
  assert.equal(existsSync(opsAccessPath), true, "expected server-side ops access helper");

  const publicPage = readFileSync(publicRoutePath, "utf8");
  const opsPage = readFileSync(opsRoutePath, "utf8");
  const opsFeature = readFileSync(opsFeaturePath, "utf8");
  const opsContent = readFileSync(opsContentPath, "utf8");
  const opsAccess = readFileSync(opsAccessPath, "utf8");

  assert.equal(/assertOpsAccess|isOpsAccessDeniedError|headers\(\)/.test(opsPage), true, "ops route should gate access on the server before rendering");
  assert.equal(
    /getOpsHealthPayload|return <OpsShell status=\{status\} \/>;/.test(opsPage),
    true,
    "ops route should delegate rendering to the ops feature shell with server-derived readiness",
  );
  assert.equal(/notFound\(\)/.test(opsPage), true, "denied ops access should fail closed with a non-leaky response");
  assert.equal(/OPS_ALLOWED_HOSTS|localhost|127\.0\.0\.1/.test(opsAccess), true, "ops helper should document one repo-wide local-only allowlist rule");
  assert.equal(/Venue operations|System checks|Recovery steps|Skip to system checks/.test(opsFeature + opsContent), true, "ops shell should expose clear keyboard-safe maintenance structure");
  assert.equal(
    /ops|maintenance|readiness|fallback/i.test(publicPage),
    false,
    "public route should remain free of ops or maintenance copy",
  );
});

test("story 1.5 public route composes the Royal Institution dashboard feature with a fixed passive local map", () => {
  const pagePath = join(root, "src", "app", "(public)", "page.tsx");
  const apiRoutePath = join(root, "src", "app", "api", "dashboard", "route.ts");
  const contractPath = join(root, "src", "lib", "contracts", "dashboard-snapshot.js");
  const apiContractPath = join(root, "src", "lib", "contracts", "api-response.js");
  const snapshotPath = join(root, "src", "features", "dashboard", "data", "overall-departure-snapshot.js");
  const presenterPath = join(root, "src", "features", "dashboard", "presenters", "dashboard-presenter.js");
  const screenPath = join(root, "src", "features", "dashboard", "components", "DashboardScreen.tsx");
  const liveScreenPath = join(root, "src", "features", "dashboard", "components", "DashboardLiveScreen.tsx");
  const headerPath = join(root, "src", "features", "dashboard", "components", "AtmosphericHeader.tsx");
  const modeGridPath = join(root, "src", "features", "dashboard", "components", "ModeSummaryGrid.tsx");
  const modeCardPath = join(root, "src", "features", "dashboard", "components", "ModeSummaryCard.tsx");
  const localMapPath = join(root, "src", "features", "dashboard", "components", "LocalMapFrame.tsx");
  const hookPath = join(root, "src", "features", "dashboard", "hooks", "useDashboardQuery.ts");
  const servicePath = join(root, "src", "lib", "server", "dashboard", "dashboard-service.js");
  const publishPath = join(root, "src", "lib", "server", "dashboard", "publish-dashboard-snapshot.js");
  const storePath = join(root, "src", "lib", "server", "cache", "snapshot-store.js");
  const queryCompatPath = join(root, "src", "lib", "vendor", "tanstack-react-query.tsx");
  assert.equal(existsSync(pagePath), true, "expected public route page");
  assert.equal(existsSync(apiRoutePath), true, "expected dashboard API route");
  assert.equal(existsSync(contractPath), true, "expected dashboard snapshot contract");
  assert.equal(existsSync(apiContractPath), true, "expected dashboard API response contract");
  assert.equal(existsSync(snapshotPath), true, "expected fixture-backed dashboard snapshot");
  assert.equal(existsSync(presenterPath), true, "expected public display presenter");
  assert.equal(existsSync(screenPath), true, "expected dashboard screen component");
  assert.equal(existsSync(liveScreenPath), true, "expected client live dashboard boundary");
  assert.equal(existsSync(headerPath), true, "expected atmospheric header component");
  assert.equal(existsSync(modeGridPath), true, "expected nearby mode summary grid component");
  assert.equal(existsSync(modeCardPath), true, "expected nearby mode summary card component");
  assert.equal(existsSync(localMapPath), true, "expected fixed local map component");
  assert.equal(existsSync(hookPath), true, "expected dashboard query hook");
  assert.equal(existsSync(servicePath), true, "expected dashboard service");
  assert.equal(existsSync(publishPath), true, "expected snapshot publication module");
  assert.equal(existsSync(storePath), true, "expected snapshot persistence module");
  assert.equal(existsSync(queryCompatPath), true, "expected local query compatibility module");

  const page = readFileSync(pagePath, "utf8");
  const apiRoute = readFileSync(apiRoutePath, "utf8");
  const contract = readFileSync(contractPath, "utf8");
  const apiContract = readFileSync(apiContractPath, "utf8");
  const snapshot = readFileSync(snapshotPath, "utf8");
  const presenter = readFileSync(presenterPath, "utf8");
  const screen = readFileSync(screenPath, "utf8");
  const liveScreen = readFileSync(liveScreenPath, "utf8");
  const header = readFileSync(headerPath, "utf8");
  const modeGrid = readFileSync(modeGridPath, "utf8");
  const modeCard = readFileSync(modeCardPath, "utf8");
  const localMap = readFileSync(localMapPath, "utf8");
  const hook = readFileSync(hookPath, "utf8");
  const service = readFileSync(servicePath, "utf8");
  const publish = readFileSync(publishPath, "utf8");
  const store = readFileSync(storePath, "utf8");
  const queryCompat = readFileSync(queryCompatPath, "utf8");
  const tsconfig = readFileSync(join(root, "tsconfig.json"), "utf8");
  const publicFeature = [page, apiRoute, contract, apiContract, snapshot, presenter, screen, liveScreen, header, modeGrid, modeCard, localMap, hook, service, publish, store, queryCompat].join("\n");
  const publicCopySources = [page, snapshot, presenter, screen, liveScreen, header, modeGrid, modeCard, localMap].join("\n");

  assert.equal(/Create Next App/i.test(page), false, "public route should not contain generic starter content");
  assert.equal(/display-shell/i.test(publicFeature), false, "story 1.3 should retire the temporary display-shell presenter");
  assert.equal(
    /Route Planner|best option|recommended|switch to|take\b/i.test(publicCopySources),
    false,
    "public route should stay fact-only",
  );
  assert.equal(
    /overallState|overallTrend|headerTrust|headerStatus|weatherSummary|placeLabel/i.test(contract),
    true,
    "dashboard contract should cover overall picture fields and trust metadata",
  );
  assert.equal(/publishedAt/i.test(contract + apiContract), true, "live dashboard path should carry a publication timestamp through contract boundaries");
  assert.equal(/nearbyModes|summary|state|trust/i.test(contract), true, "dashboard contract should cover nearby mode summaries and local trust");
  assert.equal(/localMap|selectedNearbyNodes|fallbackCopy/.test(contract), true, "dashboard contract should cover fixed local-map data");
  assert.equal(/calm|watchful|strained|disrupted/i.test(contract), true, "dashboard contract should encode approved overall-state vocabulary");
  assert.equal(/available|caution|disrupted/i.test(contract), true, "dashboard contract should encode approved nearby-mode vocabulary");
  assert.equal(/must be unique/i.test(contract), true, "dashboard contract should require stable unique keys");
  assert.equal(/Royal Institution|Albemarle Street/i.test(publicFeature), true, "public route should remain venue-specific");
  assert.equal(/DashboardLiveScreen|getDashboardApiResponse/.test(page), true, "public route should use the live dashboard boundary and service");
  assert.equal(/export const dynamic = "force-dynamic"/.test(page), true, "public route should stay server-rendered at request time");
  assert.equal(/getDashboardApiResponse|Cache-Control|Response\.json/.test(apiRoute), true, "dashboard API route should expose same-origin JSON without provider internals");
  assert.equal(/ModeSummaryGrid|ModeSummaryCard/.test(screen + modeGrid), true, "public route should include shared-reading mode summaries");
  assert.equal(/LocalMapFrame|Green Park|Piccadilly Arcade|Local frame/i.test(publicFeature), true, "public route should include fixed local-map locality cues");
  assert.equal(/QueryClientProvider|useDashboardQuery|refetchInterval/.test(liveScreen + hook), true, "live path should poll through a dedicated query boundary");
  assert.equal(/"@tanstack\/react-query"\s*:/.test(tsconfig), false, "tsconfig should not alias react-query away from the installed package");
  assert.equal(/@\/lib\/vendor\/tanstack-react-query/.test(liveScreen + hook), true, "query compatibility wiring should be explicit in source");
  assert.equal(
    /runtime\/snapshots|dashboard-history|last-safe|fallback/.test(service + publish + store),
    true,
    "live path should publish and reuse safe snapshots with lightweight recent history",
  );
  assert.equal(
    /const isFallback = viewModel\.state === "fallback";/.test(localMap),
    true,
    "local map component should branch explicitly for fallback handling",
  );
  assert.equal(
    /\(isFallback \? viewModel\.fallbackCopy : viewModel\.localityEmphasis\)/.test(localMap),
    true,
    "fallback mode should prioritize simplified fallback explanation over locality emphasis copy",
  );
  assert.equal(
    /\{isFallback \? null : \(/.test(localMap),
    true,
    "fallback mode should simplify the map treatment instead of rendering the default corridor overlay",
  );
  assert.equal(/Map placeholder/i.test(publicCopySources), false, "public route should not expose placeholder copy");
  assert.equal(
    /<button|<input|<form|<select|<textarea|href=/i.test(publicFeature),
    false,
    "public route should remain passive and non-interactive",
  );
  assert.equal(/spinner|loading takeover|manual refresh/i.test(publicFeature), false, "public route should avoid full-screen loading or manual refresh controls");
  assert.equal(/provider request failed|TfL|WeatherAPI|HTTP|cache/i.test(publicCopySources), false, "public copy should stay plain-language and non-technical");
  assert.equal(/disruptionEmphasis|disruptionScope/.test(contract + presenter), true, "dashboard contract and presenter should model first-class disruption emphasis");
  assert.equal(/sourceStatus/.test(contract + presenter + header + modeCard + localMap), true, "provider-failure source evidence should stay canonical from contract through public UI");
  assert.equal(/disruption-callout|mode-summary-card--overall-disrupted|mode-summary-card__emphasis/.test(header + modeCard), true, "public UI should render calm structural disruption emphasis without a takeover");
  assert.equal(/warning banner|alert overlay|control room|ops console|reroute now|take buses instead/i.test(publicCopySources), false, "story 2.3 should avoid alert-surface and operational language");
  assert.equal(/<svg|role="img"|aria-label="Fixed local map anchored to the Royal Institution"/.test(localMap), true, "local map should render as a passive framed graphic");
});

test("story 1.6 keeps the public display locked to venue-sized layout pillars and explicit verification evidence", () => {
  const screenPath = join(root, "src", "features", "dashboard", "components", "DashboardScreen.tsx");
  const headerPath = join(root, "src", "features", "dashboard", "components", "AtmosphericHeader.tsx");
  const modeGridPath = join(root, "src", "features", "dashboard", "components", "ModeSummaryGrid.tsx");
  const localMapPath = join(root, "src", "features", "dashboard", "components", "LocalMapFrame.tsx");
  const globalCssPath = join(root, "src", "app", "globals.css");
  const verificationNotesPath = join(root, "docs", "sprint-artifacts", "1-6-display-verification-notes.md");

  assert.equal(existsSync(screenPath), true, "expected dashboard screen component");
  assert.equal(existsSync(headerPath), true, "expected atmospheric header component");
  assert.equal(existsSync(modeGridPath), true, "expected nearby mode summary grid component");
  assert.equal(existsSync(localMapPath), true, "expected fixed local map component");
  assert.equal(existsSync(globalCssPath), true, "expected global stylesheet");
  assert.equal(existsSync(verificationNotesPath), true, "expected explicit story 1.6 verification notes artifact");

  const screen = readFileSync(screenPath, "utf8");
  const header = readFileSync(headerPath, "utf8");
  const modeGrid = readFileSync(modeGridPath, "utf8");
  const localMap = readFileSync(localMapPath, "utf8");
  const globalCss = readFileSync(globalCssPath, "utf8");
  const verificationNotes = readFileSync(verificationNotesPath, "utf8");
  const publicFeature = [screen, header, modeGrid, localMap].join("\n");

  assert.equal(
    /dashboard-shell--venue|dashboard-shell--desktop/.test(screen + globalCss),
    true,
    "public display should expose venue-sized and desktop adaptation hooks without changing the route structure",
  );
  assert.equal(
    /width:\s*max\(100%,\s*1024px\)/.test(globalCss),
    false,
    "desktop-sized layout should not force horizontal overflow at the 1024px target",
  );
  assert.equal(
    /max-width:\s*1480px|margin-inline:\s*auto/.test(globalCss),
    true,
    "dashboard shell should stay centered on venue screens without oversizing the supported desktop target",
  );
  assert.equal(
    /dashboard-shell__header|dashboard-shell__body/.test(screen),
    true,
    "dashboard screen should preserve one canonical header-first, modes-second, map-third composition",
  );
  assert.equal(
    /dashboard-lower-grid__modes|dashboard-lower-grid__map/.test(screen),
    true,
    "dashboard lower grid should keep nearby modes and fixed local map as stable layout pillars",
  );
  assert.equal(
    /@media\s*\(min-width:\s*1366px\)|@media\s*\(min-width:\s*1024px\)/.test(globalCss),
    true,
    "global styles should define venue-sized and secondary desktop breakpoints",
  );
  assert.equal(
    /@media\s*\(max-height:\s*820px\)|compact-height/.test(globalCss),
    true,
    "global styles should define a compact-height fallback for constrained venue surfaces",
  );
  assert.equal(
    /\.atmospheric-header__footer p:last-child,\s*[\r\n]+\s*\.mode-summary-panel__intro|\.local-map-panel__intro,\s*[\r\n]+\s*\.local-map-panel__fallback/.test(
      globalCss,
    ),
    false,
    "compact-height tuning should compress support detail without hiding trust cues or fallback map context",
  );
  assert.equal(
    /prefers-reduced-motion:\s*reduce/.test(globalCss),
    true,
    "public display should document reduced-motion-safe behavior in CSS",
  );
  assert.equal(
    /mobile|drawer|tab|planner|touch/i.test(publicFeature),
    false,
    "public display should not collapse into mobile-first or planner-like patterns",
  );
  assert.equal(
    /real-device|contrast|reduced-motion|shared readability|1366|1024/i.test(verificationNotes),
    true,
    "verification notes should make venue-sized validation explicit in the artifact set",
  );
});

test("story 2.5 keeps live reading stable during refreshes and motion changes", () => {
  const screenPath = join(root, "src", "features", "dashboard", "components", "DashboardScreen.tsx");
  const liveScreenPath = join(root, "src", "features", "dashboard", "components", "DashboardLiveScreen.tsx");
  const hookPath = join(root, "src", "features", "dashboard", "hooks", "useDashboardQuery.ts");
  const headerPath = join(root, "src", "features", "dashboard", "components", "AtmosphericHeader.tsx");
  const modeCardPath = join(root, "src", "features", "dashboard", "components", "ModeSummaryCard.tsx");
  const localMapPath = join(root, "src", "features", "dashboard", "components", "LocalMapFrame.tsx");
  const presenterPath = join(root, "src", "features", "dashboard", "presenters", "dashboard-presenter.js");
  const globalCssPath = join(root, "src", "app", "globals.css");
  const verificationNotesPath = join(root, "docs", "sprint-artifacts", "2-5-live-reading-verification-notes.md");

  assert.equal(existsSync(verificationNotesPath), true, "expected explicit story 2.5 verification notes artifact");

  const screen = readFileSync(screenPath, "utf8");
  const liveScreen = readFileSync(liveScreenPath, "utf8");
  const hook = readFileSync(hookPath, "utf8");
  const header = readFileSync(headerPath, "utf8");
  const modeCard = readFileSync(modeCardPath, "utf8");
  const localMap = readFileSync(localMapPath, "utf8");
  const presenter = readFileSync(presenterPath, "utf8");
  const globalCss = readFileSync(globalCssPath, "utf8");
  const verificationNotes = readFileSync(verificationNotesPath, "utf8");
  const publicFeature = [screen, liveScreen, header, modeCard, localMap].join("\n");

  assert.equal(/data-live-shell="calm-fixed"|data-reading-zone="header"|data-reading-zone="modes"|data-reading-zone="map"/.test(screen), true, "stable reading-order hooks should stay explicit in the public shell");
  assert.equal(/const \{ data, previousData \} = useDashboardQuery|const previousSnapshot =|previousData\?\.data\.publishedAt && previousData\.data\.publishedAt !== response\.data\.publishedAt|const hasUpdatedSinceLoad = response\.data\.publishedAt !== initialResponse\.data\.publishedAt|presentDashboardSnapshot\(response\.data,\s*\{\s*[\r\n]+\s*previousSnapshot,\s*[\r\n]+\s*hasUpdatedSinceLoad,/.test(liveScreen), true, "live boundary should keep update meaning route-local without remounting the shell");
  assert.equal(/refetchIntervalInBackground:\s*true|refetchOnReconnect:\s*true/.test(hook), true, "query hook should preserve the existing shell during background refresh");
  assert.equal(/orderNearbyModesForReading|createUpdateSummary|changeSummary/.test(presenter), true, "presenter should own stable ordering and calm text-first change meaning");
  assert.equal(/aria-live="polite"/.test(header), true, "header should keep a narrowly scoped polite live region");
  assert.equal(/role="alert"|alert overlay|ops console|ticker|marquee/i.test(publicFeature), false, "public route should not devolve into an alert surface during updates");
  assert.equal(/atmospheric-header__update|mode-summary-card__update|local-map-panel__update/.test(globalCss), true, "CSS should preserve update meaning through copy and structure");
  assert.equal(/prefers-reduced-motion:\s*reduce|border-left:\s*3px solid currentColor/.test(globalCss), true, "reduced-motion mode should keep change meaning without relying on animation");
  assert.equal(/target-device|supported desktop|reduced-motion|calm update|browser/i.test(verificationNotes), true, "verification notes should capture explicit live-reading review categories");
});

test("story 1.2 keeps CI focused on Node 24 build readiness for venue promotion", () => {
  const workflowPath = join(root, ".github", "workflows", "build-readiness.yml");

  assert.equal(existsSync(workflowPath), true, "expected build readiness workflow");

  const workflow = readFileSync(workflowPath, "utf8");

  assert.equal(/pull_request:/i.test(workflow), true, "workflow should run for pull requests");
  assert.equal(/push:/i.test(workflow), true, "workflow should run for pushes");
  assert.equal(/node-version:\s*["']?24["']?/i.test(workflow), true, "workflow should enforce Node 24");
  assert.equal(/npm ci/i.test(workflow), true, "workflow should install dependencies cleanly");
  assert.equal(/npm run validate/i.test(workflow), true, "workflow should run the aggregate validation gate");
  assert.equal(/deploy/i.test(workflow), false, "workflow should not automate hosted deployment");
});

test("story 1.2 documents the pre-promotion validation gate in README", () => {
  const readmePath = join(root, "README.md");

  assert.equal(existsSync(readmePath), true, "expected README.md at repo root");

  const readme = readFileSync(readmePath, "utf8");

  assert.equal(/Baseline Build-Readiness Gate/i.test(readme), true, "README should name the baseline gate");
  assert.equal(/npm run validate/i.test(readme), true, "README should document the pre-promotion validation command");
  assert.equal(/venue laptop|venue promotion/i.test(readme), true, "README should frame the gate around venue promotion");
  assert.equal(
    /operational, not ceremonial|public-display reliability/i.test(readme),
    true,
    "README should explain the reliability intent behind the gate",
  );
});
