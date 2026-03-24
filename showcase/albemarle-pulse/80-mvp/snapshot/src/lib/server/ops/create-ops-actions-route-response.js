import { z } from "zod";

import {
  isUnsupportedOpsMaintenanceActionError,
  runOpsMaintenanceAction,
} from "./run-ops-maintenance-action.js";
import { assertOpsAccess, isOpsAccessDeniedError } from "../security/assert-ops-access.js";

const OPS_ROUTE_HEADERS = Object.freeze({
  "Cache-Control": "no-store, max-age=0",
  Vary: "host, x-forwarded-host, forwarded",
});

const OPS_ACTION_REQUEST_SCHEMA = z.object({
  action: z.enum(["refresh", "trust-check"]),
});

function createCalmErrorResponse(summary, status) {
  return Response.json(
    {
      error: {
        summary,
      },
    },
    {
      status,
      headers: OPS_ROUTE_HEADERS,
    },
  );
}

/**
 * @param {{
 *   requestHeaders?: Headers;
 *   requestBody?: unknown;
 *   runAction?: typeof runOpsMaintenanceAction;
 * }} [options]
 */
export async function createOpsActionsRouteResponse({
  requestHeaders,
  requestBody,
  runAction = runOpsMaintenanceAction,
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

  let body;

  try {
    body = OPS_ACTION_REQUEST_SCHEMA.parse(requestBody);
  } catch {
    return createCalmErrorResponse("This maintenance action is not available from the local surface.", 400);
  }

  try {
    const result = await runAction({
      action: body.action,
    });

    return Response.json(result, {
      headers: OPS_ROUTE_HEADERS,
    });
  } catch (error) {
    if (isUnsupportedOpsMaintenanceActionError(error)) {
      return createCalmErrorResponse("This maintenance action is not available from the local surface.", 400);
    }

    return createCalmErrorResponse("This maintenance action could not be completed from the local surface.", 500);
  }
}
