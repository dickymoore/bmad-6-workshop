import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";

import { describe, it } from "vitest";

const root = resolve(process.cwd());

describe("ops query boundary", () => {
  it("blocks duplicate maintenance submissions and clears stale action results before a new request", () => {
    const hookSource = readFileSync(
      join(root, "src", "features", "ops", "hooks", "useOpsMaintenanceActionMutation.ts"),
      "utf8",
    );

    assert.match(hookSource, /useRef,\s*useState|useState,\s*useRef/);
    assert.match(hookSource, /const inFlightPromiseRef = useRef<Promise<OpsMaintenanceActionResult> \| null>\(null\)/);
    assert.match(hookSource, /if \(inFlightPromiseRef\.current\) \{\s*return inFlightPromiseRef\.current;\s*\}/);
    assert.match(hookSource, /setResult\(null\);/);
  });

  it("keeps reconnect and focus refetch handlers active even when polling is disabled", () => {
    const querySource = readFileSync(join(root, "src", "lib", "vendor", "tanstack-react-query.tsx"), "utf8");

    assert.match(querySource, /window\.addEventListener\("focus", handleFocus\);/);
    assert.match(querySource, /window\.addEventListener\("online", handleOnline\);/);
    assert.match(querySource, /if \(refetchInterval\) \{\s*timer = window\.setInterval/);
    assert.doesNotMatch(querySource, /if \(!refetchInterval\) \{\s*return \(\) => \{\s*cancelled = true;/);
  });
});
