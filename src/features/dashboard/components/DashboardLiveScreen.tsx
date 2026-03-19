"use client";

import { useState } from "react";

import { useDashboardQuery, type DashboardApiResponse } from "@/features/dashboard/hooks/useDashboardQuery";
import { presentDashboardSnapshot } from "@/features/dashboard/presenters/dashboard-presenter";
import { createDashboardQueryClient } from "@/lib/client/query-client";
import { QueryClientProvider } from "@/lib/vendor/tanstack-react-query";

import { DashboardScreen } from "./DashboardScreen";

function DashboardLiveBoundary({ initialResponse }: { initialResponse: DashboardApiResponse }) {
  const { data, previousData } = useDashboardQuery({ initialData: initialResponse });
  const response = data ?? initialResponse;
  const previousSnapshot =
    previousData?.data.publishedAt && previousData.data.publishedAt !== response.data.publishedAt
      ? previousData.data
      : null;
  const hasUpdatedSinceLoad = response.data.publishedAt !== initialResponse.data.publishedAt;
  const viewModel = presentDashboardSnapshot(response.data, {
    previousSnapshot,
    hasUpdatedSinceLoad,
  });

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
