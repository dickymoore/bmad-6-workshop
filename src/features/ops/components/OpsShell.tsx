import { OpsShellClient } from "@/features/ops/components/OpsShellClient";

import type { OpsHealthStatus } from "@/features/ops/hooks/useOpsHealthQuery";

export function OpsShell({ status }: { status: OpsHealthStatus }) {
  return <OpsShellClient initialStatus={status} />;
}
