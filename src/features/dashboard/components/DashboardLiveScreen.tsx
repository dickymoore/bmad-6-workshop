"use client";

import { useEffect, useState } from "react";

import { useDashboardQuery, type DashboardApiResponse } from "@/features/dashboard/hooks/useDashboardQuery";
import { presentDashboardSnapshot } from "@/features/dashboard/presenters/dashboard-presenter";
import { createDashboardQueryClient } from "@/lib/client/query-client";
import { QueryClientProvider } from "@/lib/vendor/tanstack-react-query";

import { DashboardScreen } from "./DashboardScreen";

function formatPublishedAt(publishedAt: string) {
  const parsedAt = new Date(publishedAt);

  if (Number.isNaN(parsedAt.getTime())) {
    return "--:--";
  }

  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsedAt);
}

function DashboardLiveBoundary({ initialResponse }: { initialResponse: DashboardApiResponse }) {
  const { data, previousData, isFetching } = useDashboardQuery({ initialData: initialResponse });
  const response = data ?? initialResponse;
  const refreshIntervalMs = response.meta.refreshIntervalMs;
  const refreshIntervalSeconds = Math.ceil(refreshIntervalMs / 1000);
  const [refreshCountdownSeconds, setRefreshCountdownSeconds] = useState(refreshIntervalSeconds);
  const previousSnapshot =
    previousData?.data.publishedAt && previousData.data.publishedAt !== response.data.publishedAt
      ? previousData.data
      : null;
  const hasUpdatedSinceLoad = response.data.publishedAt !== initialResponse.data.publishedAt;
  const viewModel = {
    ...presentDashboardSnapshot(response.data, {
      previousSnapshot,
      hasUpdatedSinceLoad,
      recovery: response.meta.recovery,
    }),
    liveMeta: {
      lastUpdatedLabel: formatPublishedAt(response.data.publishedAt),
      refreshCountdownSeconds,
      refreshIntervalSeconds,
      isRefreshing: isFetching,
    },
  };

  useEffect(() => {
    const startedAtMs = Date.now();
    const timer = window.setInterval(() => {
      const elapsedMs = Date.now() - startedAtMs;
      const cycleMs = elapsedMs % refreshIntervalMs;
      const remainingMs = cycleMs === 0 && elapsedMs > 0 ? 0 : refreshIntervalMs - cycleMs;
      setRefreshCountdownSeconds(Math.max(0, Math.ceil(remainingMs / 1000)));
    }, 250);

    return () => {
      window.clearInterval(timer);
    };
  }, [refreshIntervalMs]);

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
