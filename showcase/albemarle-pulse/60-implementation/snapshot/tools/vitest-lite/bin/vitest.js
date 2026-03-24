#!/usr/bin/env node

import { readdirSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const packageRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const repoRoot = resolve(packageRoot, "..", "..");
const testsRoot = resolve(repoRoot, "tests", "unit");

function collectTests(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...collectTests(fullPath));
      continue;
    }

    if (entry.isFile() && /\.test\.(mjs|js|cjs)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }

  return files.sort();
}

if (process.argv[2] && process.argv[2] !== "run") {
  console.error("vitest-lite only supports `vitest run`.");
  process.exit(1);
}

if (!statSync(testsRoot, { throwIfNoEntry: false })?.isDirectory()) {
  console.error(`No unit test directory found at ${testsRoot}`);
  process.exit(1);
}

const testFiles = collectTests(testsRoot);

if (testFiles.length === 0) {
  console.error(`No unit tests found in ${testsRoot}`);
  process.exit(1);
}

const result = spawnSync(process.execPath, ["--test", ...testFiles], {
  cwd: repoRoot,
  stdio: "inherit",
});

process.exit(result.status ?? 1);
