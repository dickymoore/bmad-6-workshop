const LOOPBACK_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]", "::1"]);

function splitHeaderValues(value) {
  return value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function unquoteHeaderValue(value) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
}

function normalizeHost(rawValue) {
  if (!rawValue) {
    return null;
  }

  const trimmedValue = unquoteHeaderValue(rawValue.trim().toLowerCase());

  if (!trimmedValue) {
    return null;
  }

  const forwardedHostMatch = trimmedValue.match(/host=([^;]+)/);
  const hostValue = forwardedHostMatch ? forwardedHostMatch[1].trim() : trimmedValue;

  if (hostValue.startsWith("[")) {
    const ipv6EndIndex = hostValue.indexOf("]");
    return ipv6EndIndex === -1 ? hostValue : hostValue.slice(0, ipv6EndIndex + 1);
  }

  return hostValue.replace(/:\d+$/, "");
}

function extractForwardedHost(rawValue) {
  if (!rawValue) {
    return null;
  }

  const match = rawValue.match(/(?:^|;)\s*host=([^;]+)/i);

  return match ? normalizeHost(match[1]) : null;
}

function collectCandidateHosts(headers) {
  const forwardedHosts = splitHeaderValues(headers.get("x-forwarded-host") ?? "").map(normalizeHost);
  const directHost = normalizeHost(headers.get("host"));
  const standardForwardedHosts = splitHeaderValues(headers.get("forwarded") ?? "").map(extractForwardedHost);

  return [...new Set([...forwardedHosts, directHost, ...standardForwardedHosts].filter(Boolean))];
}

export function resolveOpsAccessAllowlist(envValue = process.env.OPS_ALLOWED_HOSTS ?? "") {
  const configuredHosts = splitHeaderValues(envValue).map(normalizeHost).filter(Boolean);

  return new Set([...LOOPBACK_HOSTS, ...configuredHosts]);
}

export function isAllowedOpsRequest({
  headers,
  allowlist = resolveOpsAccessAllowlist(),
}) {
  const candidateHosts = collectCandidateHosts(headers);

  if (candidateHosts.length === 0) {
    return false;
  }

  // Fail closed if any declared host context falls outside the allowlist.
  return candidateHosts.every((host) => allowlist.has(host));
}

export function createOpsAccessDeniedError() {
  const error = new Error("OPS_ACCESS_DENIED");
  error.name = "OpsAccessDeniedError";
  return error;
}

export function isOpsAccessDeniedError(error) {
  return error instanceof Error && error.message === "OPS_ACCESS_DENIED";
}

export function assertOpsAccess(options) {
  if (!isAllowedOpsRequest(options)) {
    throw createOpsAccessDeniedError();
  }
}
