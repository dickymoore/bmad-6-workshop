import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");

test("story 5.7 exposes repo-owned Playwright tooling for public-board validation", () => {
  const packageJsonPath = join(root, "package.json");
  const playwrightConfigPath = join(root, "playwright.config.ts");
  const publicBoardSpecPath = join(root, "tests", "e2e", "public-board-visual.spec.ts");

  const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
  const playwrightVersion = packageJson.devDependencies["@playwright/test"];

  assert.match(
    playwrightVersion,
    /^\d+\.\d+\.\d+$/,
    "expected a direct pinned Playwright dependency for story 5.7",
  );
  assert.equal(
    packageJson.scripts["test:e2e"],
    "npm run build && playwright test",
    "expected repo-owned e2e command wired through Playwright",
  );
  assert.equal(
    packageJson.scripts["screenshot:public-board"],
    "PUBLIC_BOARD_EVIDENCE=1 npm run build && PUBLIC_BOARD_EVIDENCE=1 playwright test tests/e2e/public-board-visual.spec.ts",
    "expected the targeted public-board screenshot command to promote official evidence explicitly",
  );
  assert.equal(
    packageJson.scripts["start:e2e"],
    "next start --hostname 127.0.0.1 --port 3100",
    "expected a deterministic production server command for Playwright webServer",
  );
  assert.equal(existsSync(playwrightConfigPath), true, "expected root Playwright config");
  assert.equal(existsSync(publicBoardSpecPath), true, "expected public-board visual spec");
});
