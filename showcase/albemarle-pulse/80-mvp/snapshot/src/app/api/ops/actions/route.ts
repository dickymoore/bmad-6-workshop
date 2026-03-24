import { headers } from "next/headers";

import { createOpsActionsRouteResponse } from "@/lib/server/ops/create-ops-actions-route-response";

export async function POST(request: Request) {
  return createOpsActionsRouteResponse({
    requestHeaders: await headers(),
    requestBody: await request.json().catch(() => null),
  });
}
