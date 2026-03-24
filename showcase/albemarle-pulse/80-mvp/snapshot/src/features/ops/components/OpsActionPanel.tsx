"use client";

import { createOpsMaintenanceActionViewModel } from "@/features/ops/ops-shell-view";
import {
  type OpsMaintenanceAction,
  type OpsMaintenanceActionResult,
  useOpsMaintenanceActionMutation,
} from "@/features/ops/hooks/useOpsMaintenanceActionMutation";

type OpsMaintenanceActionViewModel = ReturnType<typeof createOpsMaintenanceActionViewModel>;

export function OpsActionPanel({
  onActionSettled,
}: {
  onActionSettled: (result: OpsMaintenanceActionResult) => Promise<unknown>;
}) {
  const mutation = useOpsMaintenanceActionMutation();
  const viewModel: OpsMaintenanceActionViewModel = createOpsMaintenanceActionViewModel({
    actionResult: mutation.result,
    errorMessage: mutation.errorMessage,
    isPending: mutation.isPending,
  });

  async function handleAction(action: OpsMaintenanceAction) {
    try {
      const result = await mutation.mutate(action);
      await onActionSettled(result);
    } catch {
      // The calm error message is already captured in hook state.
    }
  }

  return (
    <section className="ops-actions" aria-labelledby="ops-actions-heading">
      <div className="ops-actions__header">
        <div>
          <p className="ops-readiness__label">Maintenance actions</p>
          <h3 className="ops-diagnostics__title" id="ops-actions-heading">
            Keep the local read current
          </h3>
        </div>
        <p className="ops-actions__copy">
          Run a refresh or trust check from this local surface without exposing controls on the foyer display.
        </p>
      </div>

      <div className="ops-actions__controls">
        <button
          className="ops-actions__button"
          type="button"
          onClick={() => void handleAction("refresh")}
          disabled={viewModel.disableActions}
        >
          Run refresh
        </button>
        <button
          className="ops-actions__button ops-actions__button--secondary"
          type="button"
          onClick={() => void handleAction("trust-check")}
          disabled={viewModel.disableActions}
        >
          Run trust check
        </button>
      </div>

      <div className="ops-actions__result" aria-live="polite">
        {viewModel.pendingMessage ? <p className="ops-actions__pending">{viewModel.pendingMessage}</p> : null}
        {viewModel.errorMessage ? <p className="ops-actions__error">{viewModel.errorMessage}</p> : null}

        {viewModel.resultSummary ? (
          <>
            <p className="ops-readiness__label">{viewModel.resultHeading}</p>
            <p className="ops-actions__summary">{viewModel.resultSummary}</p>
            <dl className="ops-readiness__meta">
              <div>
                <dt>Action</dt>
                <dd>{viewModel.actionLabel}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>{viewModel.resultStatusLabel}</dd>
              </div>
              <div>
                <dt>Completed</dt>
                <dd>{viewModel.completedAt}</dd>
              </div>
            </dl>
            {viewModel.readinessLabel ? (
              <p className="ops-actions__readiness">
                {viewModel.readinessLabel}: {viewModel.readinessSummary}
              </p>
            ) : null}
            {viewModel.attentionDetails.length > 0 ? (
              <ul className="ops-readiness__issue-list">
                {viewModel.attentionDetails.map((detail: string) => (
                  <li className="ops-readiness__issue" key={detail}>
                    {detail}
                  </li>
                ))}
              </ul>
            ) : null}
          </>
        ) : null}
      </div>
    </section>
  );
}
