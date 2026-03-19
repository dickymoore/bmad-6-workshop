import { getOpsHealthPayload } from "./get-ops-health.js";
import { assertOpsAccess, isOpsAccessDeniedError } from "../security/assert-ops-access.js";

const OPS_ROUTE_HEADERS = Object.freeze({
  "Cache-Control": "no-store, max-age=0",
  Vary: "host, x-forwarded-host, forwarded",
});

/**
 * @param {{
 *   requestHeaders?: Headers;
 *   getOpsHealth?: typeof getOpsHealthPayload;
 * }} [options]
 */
export async function createOpsHealthRouteResponse({
  requestHeaders,
  getOpsHealth = getOpsHealthPayload,
} = {}) {
  try {
    assertOpsAccess({
      headers: requestHeaders,
    });
  } catch (error) {
    if (isOpsAccessDeniedError(error)) {
      return new Response(null, {
        status: 404,
        headers: OPS_ROUTE_HEADERS,
      });
    }

    throw error;
  }

  const payload = await getOpsHealth();

  return Response.json(payload, {
    headers: OPS_ROUTE_HEADERS,
  });
}
