import { headers } from "next/headers";
import { notFound } from "next/navigation";

import { OpsShell } from "@/features/ops/components/OpsShell";
import { assertOpsAccess, isOpsAccessDeniedError } from "@/lib/server/security/assert-ops-access";

export const dynamic = "force-dynamic";

export default async function OpsPage() {
  try {
    assertOpsAccess({
      headers: await headers(),
    });
  } catch (error) {
    if (isOpsAccessDeniedError(error)) {
      notFound();
    }

    throw error;
  }

  return <OpsShell />;
}
