"use client";

import { useState } from "react";

import { useDashboardQuery, type DashboardApiResponse } from "@/features/dashboard/hooks/useDashboardQuery";
import { presentDashboardSnapshot } from "@/features/dashboard/presenters/dashboard-presenter";
import { createDashboardQueryClient } from "@/lib/client/query-client";
import { QueryClientProvider } from "@/lib/vendor/tanstack-react-query";

import { DashboardScreen } from "./DashboardScreen";

function DashboardLiveBoundary({ initialResponse }: { initialResponse: DashboardApiResponse }) {
  const { data } = useDashboardQuery({ initialData: initialResponse });
  const response = data ?? initialResponse;
  const viewModel = presentDashboardSnapshot(response.data);

  return <DashboardScreen viewModel={viewModel} />;
}

export function DashboardLiveScreen({ initialResponse }: { initialResponse: DashboardApiResponse }) {
  const [queryClient] = useState(() => createDashboardQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <DashboardLiveBoundary initialResponse={initialResponse} />
    </QueryClientProvider>
  );
}
