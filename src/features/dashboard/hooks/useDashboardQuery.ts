"use client";

import { fetchJson } from "@/lib/client/fetch-json";
import { useQuery } from "@/lib/vendor/tanstack-react-query";

export type NearbyModeSnapshot = {
  key: string;
  label: string;
  state: string;
  summary: string;
  nuance: string | null;
};

export type DashboardApiResponse = {
  data: {
    publishedAt: string;
    placeLabel: string;
    overallState: string;
    weatherSummary: string;
    mobilitySummary: string;
    freshnessLabel: string;
    supportLabel: string;
    localMap: {
      title: string;
      state: string;
      venueAnchor: {
        key: string;
        label: string;
        x: number;
        y: number;
      };
      selectedNearbyNodes: readonly {
        key: string;
        label: string;
        x: number;
        y: number;
      }[];
      localityEmphasis: { label: string } | null;
      fallbackCopy: string | null;
    };
    nearbyModes: readonly NearbyModeSnapshot[];
  };
  meta: {
    venueKey: string;
    publishedAt: string;
    refreshIntervalMs: number;
    snapshotState: "live" | "last-safe" | "fallback";
  };
};

export function useDashboardQuery({
  initialData,
}: {
  initialData: DashboardApiResponse;
}) {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: () => fetchJson<DashboardApiResponse>("/api/dashboard"),
    initialData,
    refetchInterval: initialData.meta.refreshIntervalMs,
  });
}
