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

  assert.equal(existsSync(publicRoutePath), true, "expected public route group page");
  assert.equal(existsSync(opsRoutePath), true, "expected ops route group page");

  const opsPage = readFileSync(opsRoutePath, "utf8");
  assert.equal(/notFound\s*\(/.test(opsPage), true, "ops route should stay hidden until secured access exists");
});

test("story 1.1 public route is a calm placeholder, not generic starter content", () => {
  const pagePath = join(root, "src", "app", "(public)", "page.tsx");
  const presenterPath = join(root, "src", "features", "display-shell", "presenter.js");
  assert.equal(existsSync(pagePath), true, "expected public route page");
  assert.equal(existsSync(presenterPath), true, "expected public display presenter");

  const page = readFileSync(pagePath, "utf8");
  const presenter = readFileSync(presenterPath, "utf8");

  assert.equal(/Create Next App/i.test(page), false, "public route should not contain generic starter content");
  assert.equal(/Public Display Shell/i.test(page), false, "public route should not use developer-facing shell labels");
  assert.equal(/Starter scaffold only/i.test(page), false, "public route should not expose scaffold language");
  assert.equal(/Route Planner/i.test(page), false, "public route should not frame itself as a route planner");
  assert.equal(/getPublicDisplayShellContent/.test(page), true, "public route should render presenter-backed display content");
  assert.equal(/Royal Institution|Albemarle Pulse|departure/i.test(presenter), true, "public route should signal product-specific content");
  assert.equal(/No click, scroll, or search required/i.test(presenter), true, "public route should remain non-interactive");
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
