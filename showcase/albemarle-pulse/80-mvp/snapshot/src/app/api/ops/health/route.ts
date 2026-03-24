import { headers } from "next/headers";

import { getOpsHealthPayload } from "@/lib/server/ops/get-ops-health";
import { createOpsHealthRouteResponse as createResponse } from "@/lib/server/ops/create-ops-health-route-response";

export async function GET() {
  return createResponse({
    requestHeaders: await headers(),
    getOpsHealth: getOpsHealthPayload,
  });
}
