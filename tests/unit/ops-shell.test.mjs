import { describe, expect, it } from "vitest";

import { OPS_ACTION_GROUPS, OPS_SHELL_SECTIONS } from "../../src/features/ops/ops-shell-content.js";

describe("ops shell", () => {
  it("defines keyboard-safe sections and plain operational labels", () => {
    expect(OPS_SHELL_SECTIONS.map((section) => section.id)).toEqual([
      "ops-summary",
      "ops-system-checks",
      "ops-recovery-steps",
    ]);
    expect(OPS_SHELL_SECTIONS.map((section) => section.heading)).toEqual([
      "Venue operations",
      "System checks",
      "Recovery steps",
    ]);
    expect(OPS_ACTION_GROUPS.flatMap((group) => group.actions)).toEqual([
      "Open readiness status",
      "Review data freshness",
      "Review fallback state",
      "Prepare manual refresh",
    ]);
    expect(OPS_ACTION_GROUPS.map((group) => group.heading)).toEqual([
      "Current maintenance view",
      "Next recovery tools",
    ]);
  });
});
