import { DashboardScreen } from "@/features/dashboard/components/DashboardScreen";
import { getOverallDepartureSnapshot } from "@/features/dashboard/data/overall-departure-snapshot";
import {
  getDashboardMetadata,
  presentDashboardSnapshot,
} from "@/features/dashboard/presenters/dashboard-presenter";

export const metadata = getDashboardMetadata();

export default function PublicDisplayPage() {
  const snapshot = getOverallDepartureSnapshot();
  const viewModel = presentDashboardSnapshot(snapshot);

  return <DashboardScreen viewModel={viewModel} />;
}
