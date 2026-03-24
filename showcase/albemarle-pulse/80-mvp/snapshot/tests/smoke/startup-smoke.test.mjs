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
  assert.equal(/LocalMapFrame|Green Park|Piccadilly \/ St James's Street|Local orientation/i.test(publicFeature), true, "public route should include fixed local-map locality cues");
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
  assert.equal(/<svg|role="img"|aria-label="Passive local orientation map anchored to the Royal Institution"/.test(localMap), true, "local map should render as a passive framed graphic");
  assert.equal(/google\.com\/maps|local-map-panel__embed/.test(localMap), true, "local map should support a Google-backed base layer without losing venue overlays");
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
    /\bmobile\b|\bdrawer\b|\btab\b|\bplanner\b|\btouch\b/i.test(publicFeature),
    false,
    "public display should not collapse into mobile-first or planner-like patterns",
  );
  assert.equal(
    /real-device|contrast|reduced-motion|shared readability|1366|1024/i.test(verificationNotes),
    true,
    "verification notes should make venue-sized validation explicit in the artifact set",
  );
});

test("story 5.1 reframes the public display as a one-screen status-first board shell", () => {
  const layoutPath = join(root, "src", "app", "layout.tsx");
  const screenPath = join(root, "src", "features", "dashboard", "components", "DashboardScreen.tsx");
  const headerPath = join(root, "src", "features", "dashboard", "components", "AtmosphericHeader.tsx");
  const modeGridPath = join(root, "src", "features", "dashboard", "components", "ModeSummaryGrid.tsx");
  const localMapPath = join(root, "src", "features", "dashboard", "components", "LocalMapFrame.tsx");
  const globalCssPath = join(root, "src", "app", "globals.css");

  const layout = readFileSync(layoutPath, "utf8");
  const screen = readFileSync(screenPath, "utf8");
  const header = readFileSync(headerPath, "utf8");
  const modeGrid = readFileSync(modeGridPath, "utf8");
  const localMap = readFileSync(localMapPath, "utf8");
  const globalCss = readFileSync(globalCssPath, "utf8");
  const publicFeature = [screen, header, modeGrid, localMap].join("\n");

  assert.equal(
    /next\/font\/google|CSS fallbacks|--font-body:\s*"Inter"|--font-headline:\s*"Noto Serif"/.test(layout + globalCss),
    true,
    "layout should preserve the approved font pairing through repo-owned font variables, whether defaulted in CSS or loaded via next/font",
  );
  assert.equal(/dashboard-masthead|Albemarle Pulse|The Royal Institution/.test(screen), true, "screen should add the new board masthead");
  assert.equal(/PUBLIC_STATUS|Services: Good|signal-card|Refreshing in/.test(header), true, "header should expose a status-first board treatment with live refresh cues");
  assert.equal(/atmospheric-header__currentness/.test(header), false, "header should avoid a duplicated visible board-update footer");
  assert.equal(/Nearby mode status|W1S wayfinding/.test(modeGrid), true, "nearby mode section should shift to compact board language");
  assert.equal(
    /local-map-panel__district-label|local-map-panel__venue-pill/.test(localMap),
    true,
    "map treatment should surface the anchored district and venue more clearly",
  );
  assert.equal(/overflow-y:\s*auto|grid-template-rows:\s*auto minmax\(0,\s*1fr\)|dashboard-masthead|signal-card/.test(globalCss), true, "global styles should enforce the compact board shell without clipping vertical overflow");
  assert.equal(
    /Route Planner|best option|recommended|switch to|take buses instead|reroute now/i.test(publicFeature),
    false,
    "story 5.1 should stay fact-only even while reframing the board",
  );
});

test("story 5.2 replaces verbose nearby cards with compact RAG transport rows", () => {
  const screenPath = join(root, "src", "features", "dashboard", "components", "DashboardScreen.tsx");
  const modeGridPath = join(root, "src", "features", "dashboard", "components", "ModeSummaryGrid.tsx");
  const modeCardPath = join(root, "src", "features", "dashboard", "components", "ModeSummaryCard.tsx");
  const presenterPath = join(root, "src", "features", "dashboard", "presenters", "dashboard-presenter.js");
  const globalCssPath = join(root, "src", "app", "globals.css");

  const screen = readFileSync(screenPath, "utf8");
  const modeGrid = readFileSync(modeGridPath, "utf8");
  const modeCard = readFileSync(modeCardPath, "utf8");
  const presenter = readFileSync(presenterPath, "utf8");
  const globalCss = readFileSync(globalCssPath, "utf8");
  const publicFeature = [screen, modeGrid, modeCard, presenter, globalCss].join("\n");

  assert.equal(/dashboard-shell__header[\s\S]*dashboard-lower-grid__modes[\s\S]*dashboard-lower-grid__map/.test(screen), true, "canonical shell order should remain header, nearby rows, then map");
  assert.equal(
    /Nearby mode status|W1S wayfinding|Running nearby|Disrupted nearby/i.test(modeGrid + presenter),
    true,
    "nearby mode section should describe compact board rows",
  );
  assert.equal(/mode-summary-card__status-rag|mode-summary-card__meta-chip|mode-summary-card__rail/.test(modeCard), true, "row component should expose explicit RAG, support, and rail cues");
  assert.equal(/mode-summary-grid__row|mode-summary-panel__rows|mode-summary-row/.test(globalCss), true, "global styles should define compact row layout semantics");
  assert.equal(/route planner|best option|recommended|switch to|take buses instead|reroute now/i.test(publicFeature), false, "story 5.2 nearby rows must stay fact-only and non-planner-like");
  assert.equal(/card soup|dashboard-style cards|article card/i.test(publicFeature), false, "story 5.2 source should not describe the nearby area as card-style treatment");
});

test("story 5.3 adds concrete nearby station and locality references to the canonical board", () => {
  const screenPath = join(root, "src", "features", "dashboard", "components", "DashboardScreen.tsx");
  const localityPanelPath = join(root, "src", "features", "dashboard", "components", "LocalityReferencePanel.tsx");
  const localMapPath = join(root, "src", "features", "dashboard", "components", "LocalMapFrame.tsx");
  const presenterPath = join(root, "src", "features", "dashboard", "presenters", "dashboard-presenter.js");
  const snapshotPath = join(root, "src", "features", "dashboard", "data", "overall-departure-snapshot.js");
  const contractPath = join(root, "src", "lib", "contracts", "dashboard-snapshot.js");
  const globalCssPath = join(root, "src", "app", "globals.css");

  assert.equal(existsSync(localityPanelPath), true, "expected dedicated locality reference panel component");

  const screen = readFileSync(screenPath, "utf8");
  const localityPanel = readFileSync(localityPanelPath, "utf8");
  const localMap = readFileSync(localMapPath, "utf8");
  const presenter = readFileSync(presenterPath, "utf8");
  const snapshot = readFileSync(snapshotPath, "utf8");
  const contract = readFileSync(contractPath, "utf8");
  const globalCss = readFileSync(globalCssPath, "utf8");
  const publicFeature = [screen, localityPanel, localMap, presenter, snapshot].join("\n");

  assert.equal(/dashboard-lower-grid__modes[\s\S]*dashboard-lower-grid__locality[\s\S]*dashboard-lower-grid__map/.test(screen), true, "board shell should insert a compact locality panel between nearby modes and map");
  assert.equal(/LocalityReferencePanel|viewModel\.locality/.test(screen), true, "dashboard screen should wire the explicit locality panel from the presenter");
  assert.equal(/nearbyReferences|kind|caption/.test(contract), true, "dashboard contract should model structured nearby locality references");
  assert.equal(/Green Park|Piccadilly \/ St James's Street|Albemarle Street/.test(snapshot), true, "fixture snapshot should expose concrete nearby names for the Royal Institution context");
  assert.equal(
    /title:\s*"Nearby"|heading:\s*"Stations and streets"|kindLabel/.test(presenter + localityPanel),
    true,
    "presenter and panel should elevate explicit named references into the board shell",
  );
  assert.equal(/Nearby node/.test(presenter), false, "presenter should retire generic nearby-node labels as the primary locality language");
  assert.equal(/route planner|best option|recommended|switch to|take buses instead|reroute now/i.test(publicFeature), false, "story 5.3 locality treatment must stay fact-only and non-planner-like");
  assert.equal(/locality-reference-panel|dashboard-lower-grid__locality/.test(globalCss), true, "global styles should define the dedicated locality panel and shell slot");
  assert.equal(/<button|<input|<form|<select|<textarea|href=/.test(localityPanel), false, "locality panel should remain passive and non-interactive");
  assert.equal(/selectedNearbyNodes/.test(localMap), true, "map should remain the existing single local-map path rather than a replacement locality implementation");
});

test("story 5.4 redesigns the local map into a practical passive orientation aid", () => {
  const screenPath = join(root, "src", "features", "dashboard", "components", "DashboardScreen.tsx");
  const localMapPath = join(root, "src", "features", "dashboard", "components", "LocalMapFrame.tsx");
  const presenterPath = join(root, "src", "features", "dashboard", "presenters", "dashboard-presenter.js");
  const snapshotPath = join(root, "src", "features", "dashboard", "data", "overall-departure-snapshot.js");
  const contractPath = join(root, "src", "lib", "contracts", "dashboard-snapshot.js");
  const globalCssPath = join(root, "src", "app", "globals.css");

  const screen = readFileSync(screenPath, "utf8");
  const localMap = readFileSync(localMapPath, "utf8");
  const presenter = readFileSync(presenterPath, "utf8");
  const snapshot = readFileSync(snapshotPath, "utf8");
  const contract = readFileSync(contractPath, "utf8");
  const globalCss = readFileSync(globalCssPath, "utf8");
  const passivePublicSources = [screen, localMap, presenter, snapshot].join("\n");

  assert.equal(/Passive local orientation map anchored to the Royal Institution/.test(localMap + presenter), true, "map should advertise a passive orientation surface anchored to the venue");
  assert.equal(/orientationSummary/.test(contract + presenter + snapshot), true, "snapshot and presenter should carry a narrow orientation summary seam");
  assert.equal(/Green Park|Piccadilly \/ St James's Street|Albemarle Street/.test(snapshot), true, "fixture map should preserve the same Royal Institution locality references");
  assert.equal(/local-map-panel__street-label|local-map-panel__road|local-map-panel__block/.test(localMap + globalCss), true, "map source should read as a conventional static street surface");
  assert.equal(/local-map-panel__corridor/.test(localMap + globalCss), false, "decorative corridor emphasis should be retired");
  assert.equal(/dashboard-lower-grid__locality[\s\S]*dashboard-lower-grid__map/.test(screen), true, "board composition should still keep the locality panel and map in the canonical lower grid");
  assert.equal(
    /<button|<input|<form|<select|<textarea|href=|onClick=|\bpan\b|\bzoom\b|\btoggle\b|\btabs?\b/i.test(
      passivePublicSources,
    ),
    false,
    "map redesign should stay passive and non-interactive",
  );
  assert.equal(/simplified local orientation keeps the Royal Institution/i.test(snapshot + presenter), true, "fallback copy should keep the Royal Institution anchor and usable nearby context");
});

test("story 5.5 keeps the public board attached to an explicit foyer-readability contract", () => {
  const screenPath = join(root, "src", "features", "dashboard", "components", "DashboardScreen.tsx");
  const modeGridPath = join(root, "src", "features", "dashboard", "components", "ModeSummaryGrid.tsx");
  const localityPanelPath = join(root, "src", "features", "dashboard", "components", "LocalityReferencePanel.tsx");
  const localMapPath = join(root, "src", "features", "dashboard", "components", "LocalMapFrame.tsx");
  const presenterPath = join(root, "src", "features", "dashboard", "presenters", "dashboard-presenter.js");
  const globalCssPath = join(root, "src", "app", "globals.css");
  const validationArtifactPath = join(root, "docs", "sprint-artifacts", "5-5-public-board-readability-validation.md");

  assert.equal(existsSync(validationArtifactPath), true, "expected a repo-owned Story 5.5 readability validation artifact");

  const screen = readFileSync(screenPath, "utf8");
  const modeGrid = readFileSync(modeGridPath, "utf8");
  const localityPanel = readFileSync(localityPanelPath, "utf8");
  const localMap = readFileSync(localMapPath, "utf8");
  const presenter = readFileSync(presenterPath, "utf8");
  const globalCss = readFileSync(globalCssPath, "utf8");
  const validationArtifact = readFileSync(validationArtifactPath, "utf8");
  const publicFeature = [screen, modeGrid, localityPanel, localMap, presenter, globalCss].join("\n");

  assert.equal(
    /foyer-readability|no-scroll|2-3 second|5-10 second|anti-repetition/i.test(validationArtifact),
    true,
    "validation artifact should capture the explicit Story 5.5 board-readability rubric",
  );
  assert.equal(
    /Accepted only if|Epic 5 remains open|keep Epic 5 open|clarity failure|beauty failure/i.test(validationArtifact),
    true,
    "validation artifact should make failure conditions explicit rather than silently closing Epic 5",
  );
  assert.equal(
    /dashboard-shell__header[\s\S]*dashboard-lower-grid__modes[\s\S]*dashboard-lower-grid__locality[\s\S]*dashboard-lower-grid__map/.test(screen),
    true,
    "canonical public route should still read as one stable header-to-modes-to-locality-to-map board",
  );
  assert.equal(
    /@media \(min-width:\s*1024px\)\s*{[\s\S]*?\.dashboard-page\s*{[\s\S]*?min-height:\s*100dvh;[\s\S]*?height:\s*100dvh;[\s\S]*?overflow:\s*hidden;[\s\S]*?\.dashboard-shell--desktop\s*{[\s\S]*?height:\s*100%;[\s\S]*?min-height:\s*0;[\s\S]*?grid-template-rows:\s*auto minmax\(0,\s*1fr\);/m.test(
      globalCss,
    ),
    true,
    "public board source should keep the supported desktop board pinned to a one-screen, no-scroll shell",
  );
  assert.equal(
    /Nearby mode status|W1S wayfinding|Close read|Albemarle Street district/.test(modeGrid + localityPanel + localMap),
    true,
    "public board should keep concise board-facing labels across nearby rows, locality references, and map cues",
  );
  assert.equal(
    /Route Planner|best option|recommended|switch to|take buses instead|reroute now|should choose|you should/i.test(publicFeature),
    false,
    "public board should stay non-advisory and avoid planner-like wording",
  );
  assert.equal(
    /explanatory prose|repeated explanatory|board walkthrough|step-by-step explanation/i.test(publicFeature),
    false,
    "public board sources should not reframe the board around repeated explanatory prose",
  );
});

test("story 5.6 tightens the canonical live board toward the approved design-reference layout", () => {
  const packageJsonPath = join(root, "package.json");
  const layoutPath = join(root, "src", "app", "layout.tsx");
  const screenPath = join(root, "src", "features", "dashboard", "components", "DashboardScreen.tsx");
  const headerPath = join(root, "src", "features", "dashboard", "components", "AtmosphericHeader.tsx");
  const localityPanelPath = join(root, "src", "features", "dashboard", "components", "LocalityReferencePanel.tsx");
  const localMapPath = join(root, "src", "features", "dashboard", "components", "LocalMapFrame.tsx");
  const globalCssPath = join(root, "src", "app", "globals.css");

  const packageJson = readFileSync(packageJsonPath, "utf8");
  const layout = readFileSync(layoutPath, "utf8");
  const screen = readFileSync(screenPath, "utf8");
  const header = readFileSync(headerPath, "utf8");
  const localityPanel = readFileSync(localityPanelPath, "utf8");
  const localMap = readFileSync(localMapPath, "utf8");
  const globalCss = readFileSync(globalCssPath, "utf8");
  const publicFeature = [screen, header, localityPanel, localMap, globalCss].join("\n");

  assert.equal(
    /dashboard-shell__body--editorial|dashboard-lower-grid--editorial/.test(screen + globalCss),
    true,
    "editorial parity should add an explicit two-column shell adaptation rather than leaving the old three-card adaptation untouched",
  );
  assert.equal(
    /grid-template-areas:\s*"modes map"\s*"modes locality"|grid-template-areas:\s*"header header"\s*"modes map"\s*"modes locality"/.test(
      globalCss,
    ),
    true,
    "editorial parity should place modes in the primary column with map above locality in the secondary stack",
  );
  assert.equal(
    /dashboard-masthead__eyebrow|dashboard-masthead__status|atmospheric-header__status-band|atmospheric-header__signal-strip/.test(
      screen + header,
    ),
    true,
    "masthead and hero should expose a more explicit editorial status-band structure",
  );
  assert.equal(
    /next\/font\/google|Inter\(\{|Noto_Serif\(\{|--font-body|--font-headline/.test(layout),
    true,
    "story 5.6 should self-host the approved serif and sans pairing through next/font rather than CSS-only fallbacks",
  );
  assert.equal(
    /--surface-base|--surface-low|--surface-high|--surface-highest/.test(globalCss),
    true,
    "global board styles should define explicit tonal-layering tokens for the Civic Editorial treatment",
  );
  assert.equal(
    /border:\s*1px solid var\(--border\)/.test(globalCss),
    false,
    "story 5.6 should retire the broad 1px var(--border) panel-sectioning pattern from the public board styles",
  );
  assert.equal(
    /local-map-panel__district-label|local-map-panel__overlay-card|local-map-panel__venue-pill/.test(localMap),
    true,
    "map source should adopt the approved framed-overlay treatment instead of the older legend-heavy card adaptation",
  );
  assert.equal(
    /local-map-panel__legend/.test(localMap),
    false,
    "story 5.6 map should stop rendering the side legend inside the map panel now that nearby references have their own editorial panel",
  );
  assert.equal(
    /@media \(min-width:\s*1024px\)\s*{[\s\S]*?\.dashboard-page\s*{[\s\S]*?min-height:\s*100dvh;[\s\S]*?height:\s*100dvh;[\s\S]*?overflow:\s*hidden;[\s\S]*?\.dashboard-shell--desktop\s*{[\s\S]*?height:\s*100%;[\s\S]*?min-height:\s*0;[\s\S]*?grid-template-rows:\s*auto minmax\(0,\s*1fr\);/m.test(
      globalCss,
    ),
    true,
    "story 5.6 should pin the supported desktop board to a real viewport-height shell instead of a permissive scroll layout",
  );
  assert.equal(
    /@media \(min-width:\s*1024px\) and \(max-height:\s*820px\)\s*{[\s\S]*?\.dashboard-shell\s*{[\s\S]*?height:\s*100%;[\s\S]*?min-height:\s*0;[\s\S]*?gap:\s*10px;[\s\S]*?\.dashboard-secondary-stack\s*{[\s\S]*?gap:\s*12px;[\s\S]*?\.local-map-panel__surface\s*{[\s\S]*?aspect-ratio:\s*1 \/ 0\.74;/m.test(
      globalCss,
    ),
    true,
    "story 5.6 should keep a compact-height fallback that actively shrinks the right column and map instead of only hiding overflow",
  );
  assert.equal(
    /tailwindcss/.test(packageJson),
    false,
    "parity work should stay inside the repo's existing bespoke CSS/runtime path",
  );
  assert.equal(
    /Route Planner|best option|recommended|switch to|take buses instead|reroute now/i.test(publicFeature),
    false,
    "design parity should not reintroduce advisory or planner-like public copy",
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
  assert.equal(/const \{ data, previousData, isFetching \} = useDashboardQuery|const previousSnapshot =|previousData\?\.data\.publishedAt && previousData\.data\.publishedAt !== response\.data\.publishedAt|const hasUpdatedSinceLoad = response\.data\.publishedAt !== initialResponse\.data\.publishedAt|presentDashboardSnapshot\(response\.data,\s*\{\s*[\r\n]+\s*previousSnapshot,\s*[\r\n]+\s*hasUpdatedSinceLoad,/.test(liveScreen), true, "live boundary should keep update meaning route-local without remounting the shell");
  assert.equal(/refetchIntervalInBackground:\s*true|refetchOnReconnect:\s*true/.test(hook), true, "query hook should preserve the existing shell during background refresh");
  assert.equal(/orderNearbyModesForReading|createUpdateSummary|changeSummary/.test(presenter), true, "presenter should own stable ordering and calm text-first change meaning");
  assert.equal(/aria-live="polite"/.test(header), true, "header should keep a narrowly scoped polite live region");
  assert.equal(/role="alert"|alert overlay|ops console|ticker|marquee/i.test(publicFeature), false, "public route should not devolve into an alert surface during updates");
  assert.equal(/atmospheric-header__update|mode-summary-card__update|local-map-panel__update/.test(globalCss), true, "CSS should preserve update meaning through copy and structure");
  assert.equal(/prefers-reduced-motion:\s*reduce|border-left:\s*3px solid currentColor/.test(globalCss), true, "reduced-motion mode should keep change meaning without relying on animation");
  assert.equal(/target-device|supported desktop|reduced-motion|calm update|browser/i.test(verificationNotes), true, "verification notes should capture explicit live-reading review categories");
});

test("story 3.5 keeps restart recovery inside the existing public and local-only ops shells", () => {
  const servicePath = join(root, "src", "lib", "server", "dashboard", "dashboard-service.js");
  const recoveryStatePath = join(root, "src", "lib", "server", "dashboard", "recovery-state.js");
  const apiContractPath = join(root, "src", "lib", "contracts", "api-response.js");
  const publicPagePath = join(root, "src", "app", "(public)", "page.tsx");
  const liveScreenPath = join(root, "src", "features", "dashboard", "components", "DashboardLiveScreen.tsx");
  const opsHealthPath = join(root, "src", "lib", "server", "ops", "get-ops-health.js");
  const opsViewPath = join(root, "src", "features", "ops", "ops-shell-view.js");
  const opsClientPath = join(root, "src", "features", "ops", "components", "OpsShellClient.tsx");
  const opsActionPath = join(root, "src", "lib", "server", "ops", "run-ops-maintenance-action.js");
  const opsRoutePath = join(root, "src", "app", "(ops)", "ops", "page.tsx");

  const service = readFileSync(servicePath, "utf8");
  const recoveryState = readFileSync(recoveryStatePath, "utf8");
  const apiContract = readFileSync(apiContractPath, "utf8");
  const publicPage = readFileSync(publicPagePath, "utf8");
  const liveScreen = readFileSync(liveScreenPath, "utf8");
  const opsHealth = readFileSync(opsHealthPath, "utf8");
  const opsView = readFileSync(opsViewPath, "utf8");
  const opsClient = readFileSync(opsClientPath, "utf8");
  const opsAction = readFileSync(opsActionPath, "utf8");
  const opsRoute = readFileSync(opsRoutePath, "utf8");

  assert.equal(existsSync(recoveryStatePath), true, "expected a dedicated recovery-state seam");
  assert.equal(/recordDashboardRestartRecovery|readDashboardRecoveryState|createDashboardRecoveryMeta/.test(service + recoveryState), true, "restart recovery should be derived explicitly from a server-only recovery state");
  assert.equal(/meta\.recovery|livePublicationResumed|recoverySource|recoveredAt/.test(apiContract + liveScreen), true, "public and local consumers should share explicit recovery metadata through the canonical API response");
  assert.equal(/DashboardLiveScreen|getDashboardApiResponse/.test(publicPage), true, "public route should continue using the same single-screen live boundary");
  assert.equal(/boot screen|debug|recovery tooling|restart button|process-control/i.test(publicPage + liveScreen), false, "public route should not introduce boot tooling or recovery controls");
  assert.equal(/recoveryHeading|recoveryLabel|recoverySourceLabel|recoveryLiveLabel/.test(opsHealth + opsView + opsClient), true, "ops shell should expose restart recovery evidence in the existing local-only surface");
  assert.equal(/refresh|trust-check/.test(opsAction), true, "ops actions should remain limited to the lightweight refresh and trust-check tools");
  assert.equal(/restart-service|process-control|systemctl|pm2/i.test(opsAction + opsClient + opsRoute), false, "ops surface should not grow process-control affordances");
  assert.equal(/assertOpsAccess|notFound\(\)/.test(opsRoute), true, "ops recovery confirmation should remain local-only");
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
