import { DashboardLiveScreen } from "@/features/dashboard/components/DashboardLiveScreen";
import { getDashboardMetadata } from "@/features/dashboard/presenters/dashboard-presenter";
import { getDashboardApiResponse } from "@/lib/server/dashboard/dashboard-service";

export const metadata = getDashboardMetadata();
export const dynamic = "force-dynamic";

export default async function PublicDisplayPage() {
  const initialResponse = await getDashboardApiResponse();

  return <DashboardLiveScreen initialResponse={initialResponse} />;
}
