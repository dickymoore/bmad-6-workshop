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

  it("fails closed when a forwarded allowlisted host conflicts with a denied direct host", () => {
    expect(
      isAllowedOpsRequest({
        headers: createHeaders([
          ["x-forwarded-host", "localhost:3000"],
          ["host", "example.com"],
        ]),
      }),
    ).toBe(false);
  });

  it("ignores standard Forwarded entries that do not declare a host", () => {
    expect(
      isAllowedOpsRequest({
        headers: createHeaders([
          ["host", "ops-display.internal:3000"],
          ["forwarded", "for=192.0.2.10;proto=https"],
        ]),
        allowlist: resolveOpsAccessAllowlist("ops-display.internal"),
      }),
    ).toBe(true);
  });

  it("accepts quoted Forwarded host parameters when they resolve to an allowlisted host", () => {
    expect(
      isAllowedOpsRequest({
        headers: createHeaders([
          ["host", "ops-display.internal:3000"],
          ["forwarded", 'for=192.0.2.10;host="ops-display.internal:3000";proto=https'],
        ]),
        allowlist: resolveOpsAccessAllowlist("ops-display.internal"),
      }),
    ).toBe(true);
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
