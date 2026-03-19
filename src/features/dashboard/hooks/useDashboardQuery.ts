"use client";

import { fetchJson } from "@/lib/client/fetch-json";
import { useQuery } from "@/lib/vendor/tanstack-react-query";

export type NearbyModeSnapshot = {
  key: string;
  label: string;
  state: string;
  summary: string;
  nuance: string | null;
  sourceStatus: {
    state: string;
    label: string;
    detail: string;
  };
  trust: {
    state: string;
    label: string;
    detail: string;
    confidence: string;
  };
};

export type DashboardApiResponse = {
  data: {
    publishedAt: string;
    placeLabel: string;
    overallState: string;
    overallTrend: string | null;
    weatherSummary: string;
    mobilitySummary: string;
    supportLabel: string;
    headerTrust: {
      weather: {
        state: string;
        label: string;
        detail: string;
        confidence: string;
      };
      mobility: {
        state: string;
        label: string;
        detail: string;
        confidence: string;
      };
    };
    headerStatus: {
      weather: {
        state: string;
        label: string;
        detail: string;
      };
      mobility: {
        state: string;
        label: string;
        detail: string;
      };
    };
    localMap: {
      title: string;
      state: string;
      sourceStatus: {
        state: string;
        label: string;
        detail: string;
      };
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
