import { getDashboardApiResponse } from "@/lib/server/dashboard/dashboard-service";

export async function GET() {
  const payload = await getDashboardApiResponse();

  return Response.json(payload, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
