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
  assert.equal(existsSync(pagePath), true, "expected public route page");

  const page = readFileSync(pagePath, "utf8");

  assert.equal(/Create Next App/i.test(page), false, "public route should not contain generic starter content");
  assert.equal(/Public Display Shell/i.test(page), false, "public route should not use developer-facing shell labels");
  assert.equal(/Starter scaffold only/i.test(page), false, "public route should not expose scaffold language");
  assert.equal(/Route Planner/i.test(page), false, "public route should not frame itself as a route planner");
  assert.equal(/Royal Institution|Albemarle Pulse|departure/i.test(page), true, "public route should signal product-specific content");
  assert.equal(/No click, scroll, or search required/i.test(page), true, "public route should remain non-interactive");
});
