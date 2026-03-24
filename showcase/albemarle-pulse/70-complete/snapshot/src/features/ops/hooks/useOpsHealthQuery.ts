"use client";

import { fetchJson } from "@/lib/client/fetch-json";
import { useQuery } from "@/lib/vendor/tanstack-react-query";

export type OpsHealthStatus = {
  readiness: {
    state: string;
    label: string;
    summary: string;
  };
  checks: readonly {
    id: string;
    label: string;
    status: string;
    detail: string;
  }[];
  issues: readonly string[];
  diagnostics: {
    summary: string;
    affectedAreas: readonly {
      id: string;
      areaLabel: string;
      impactScope: string;
      signals: readonly {
        label: string;
        stateLabel: string;
        detail: string;
      }[];
    }[];
    healthyAreas: readonly string[];
  };
  evidence: {
    snapshotState: string;
    publishedAt: string | null;
    recovery: {
      phase: string;
      recoveredAt: string | null;
      recoverySource: string;
      livePublicationResumed: boolean;
      resumedAt: string | null;
    };
  };
};

export function useOpsHealthQuery({ initialData }: { initialData: OpsHealthStatus }) {
  return useQuery({
    queryKey: ["ops", "health"],
    queryFn: () => fetchJson<OpsHealthStatus>("/api/ops/health"),
    initialData,
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
}
