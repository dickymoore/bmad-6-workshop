import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";

import { describe, expect, it } from "vitest";

const root = resolve(process.cwd());

describe("story 5.1 header shell guardrails", () => {
  it("keeps compact signal-note logic aligned with the trust-confidence model", () => {
    const headerSource = readFileSync(
      join(root, "src", "features", "dashboard", "components", "AtmosphericHeader.tsx"),
      "utf8",
    );

    expect(headerSource).toMatch(/trust\.confidence === "narrowed"/);
    expect(/trust\.confidence !== "steady"/.test(headerSource)).toBe(false);
    expect(headerSource).toMatch(/Last live read/);
    expect(headerSource).toMatch(/Awaiting live read/);
    expect(/return status\.label;/.test(headerSource)).toBe(false);
  });

  it("does not keep a duplicated visible board-update footer and only disables board scrolling on supported desktop layouts", () => {
    const headerSource = readFileSync(
      join(root, "src", "features", "dashboard", "components", "AtmosphericHeader.tsx"),
      "utf8",
    );
    const cssSource = readFileSync(join(root, "src", "app", "globals.css"), "utf8");

    expect(/atmospheric-header__currentness/.test(headerSource)).toBe(false);
    expect(cssSource).toMatch(/overflow-x:\s*hidden;\s*overflow-y:\s*auto;/);
    expect(cssSource).toMatch(
      /@media \(min-width:\s*1024px\)\s*{[\s\S]*?\.dashboard-page\s*{[\s\S]*?min-height:\s*100dvh;[\s\S]*?height:\s*100dvh;[\s\S]*?overflow:\s*hidden;/,
    );
  });
});
