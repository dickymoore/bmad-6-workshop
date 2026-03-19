import { getOpsHealthPayload } from "./get-ops-health.js";
import { assertOpsAccess, isOpsAccessDeniedError } from "../security/assert-ops-access.js";

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
      });
    }

    throw error;
  }

  const payload = await getOpsHealth();

  return Response.json(payload, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
      Vary: "host, x-forwarded-host, forwarded",
    },
  });
}
