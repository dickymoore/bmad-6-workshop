import { describe, expect, it } from "vitest";

import {
  assertOpsAccess,
  isAllowedOpsRequest,
  resolveOpsAccessAllowlist,
} from "../../src/lib/server/security/assert-ops-access.js";

function createHeaders(entries) {
  return new Headers(entries);
}

describe("ops access control", () => {
  it("allows loopback hosts by default", () => {
    expect(
      isAllowedOpsRequest({
        headers: createHeaders([["host", "localhost:3000"]]),
      }),
    ).toBe(true);
    expect(
      isAllowedOpsRequest({
        headers: createHeaders([["x-forwarded-host", "127.0.0.1:3000"]]),
      }),
    ).toBe(true);
  });

  it("allows explicitly configured venue hosts", () => {
    expect(
      isAllowedOpsRequest({
        headers: createHeaders([["host", "ops-display.internal:3000"]]),
        allowlist: resolveOpsAccessAllowlist("ops-display.internal, venue-console.local"),
      }),
    ).toBe(true);
  });

  it("denies non-local hosts by default", () => {
    expect(
      isAllowedOpsRequest({
        headers: createHeaders([["host", "example.com"]]),
      }),
    ).toBe(false);
  });

  it("fails closed when forwarded chains contain only denied hosts", () => {
    expect(
      isAllowedOpsRequest({
        headers: createHeaders([
          ["x-forwarded-host", "example.com, upstream.internal"],
          ["host", "edge-gateway"],
        ]),
      }),
    ).toBe(false);
  });

  it("throws a non-leaky denial error for disallowed requests", () => {
    let error;

    try {
      assertOpsAccess({
        headers: createHeaders([["host", "example.com"]]),
      });
    } catch (caughtError) {
      error = caughtError;
    }

    expect(error?.message).toBe("OPS_ACCESS_DENIED");
  });
});
