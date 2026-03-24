"use client";

import { useRef, useState } from "react";

import type { OpsHealthStatus } from "@/features/ops/hooks/useOpsHealthQuery";

export type OpsMaintenanceAction = "refresh" | "trust-check";

export type OpsMaintenanceActionResult = {
  action: OpsMaintenanceAction;
  status: string;
  summary: string;
  completedAt: string;
  readiness: OpsHealthStatus["readiness"];
  diagnostics: OpsHealthStatus["diagnostics"];
  checks: OpsHealthStatus["checks"];
  issues: readonly string[];
  evidence: OpsHealthStatus["evidence"];
  attentionDetails?: readonly string[];
};

async function parseCalmError(response: Response) {
  try {
    const payload = await response.json();

    if (typeof payload?.error?.summary === "string" && payload.error.summary.trim().length > 0) {
      return payload.error.summary.trim();
    }
  } catch {
    // Ignore malformed error bodies and fall through to the default.
  }

  return null;
}

function formatActionLabel(action: OpsMaintenanceAction) {
  return action === "trust-check" ? "Trust check" : "Refresh";
}

function createDefaultActionErrorMessage(action: OpsMaintenanceAction) {
  return `${formatActionLabel(action)} could not be completed from the local surface.`;
}

export function useOpsMaintenanceActionMutation() {
  const [isPending, setIsPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<OpsMaintenanceActionResult | null>(null);
  const inFlightPromiseRef = useRef<Promise<OpsMaintenanceActionResult> | null>(null);

  async function mutate(action: OpsMaintenanceAction) {
    if (inFlightPromiseRef.current) {
      return inFlightPromiseRef.current;
    }

    setIsPending(true);
    setErrorMessage(null);
    setResult(null);

    const pendingRequest = (async () => {
      try {
        const response = await fetch("/api/ops/actions", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            accept: "application/json",
          },
          cache: "no-store",
          body: JSON.stringify({ action }),
        });

        if (!response.ok) {
          const calmError = await parseCalmError(response);
          throw new Error(calmError ?? createDefaultActionErrorMessage(action));
        }

        const nextResult = (await response.json()) as OpsMaintenanceActionResult;
        setResult(nextResult);
        return nextResult;
      } catch (error) {
        const message =
          error instanceof Error && error.message.trim().length > 0
            ? error.message.trim()
            : createDefaultActionErrorMessage(action);
        setErrorMessage(message);
        setResult(null);
        throw error;
      } finally {
        inFlightPromiseRef.current = null;
        setIsPending(false);
      }
    })();

    inFlightPromiseRef.current = pendingRequest;
    return pendingRequest;
  }

  return {
    mutate,
    isPending,
    errorMessage,
    result,
  };
}
