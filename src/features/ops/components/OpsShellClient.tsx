"use client";

import { useState } from "react";

import { OpsActionPanel } from "@/features/ops/components/OpsActionPanel";
import { OPS_RECOVERY_STEPS, OPS_SHELL_SECTIONS } from "@/features/ops/ops-shell-content";
import { type OpsHealthStatus, useOpsHealthQuery } from "@/features/ops/hooks/useOpsHealthQuery";
import { createOpsShellViewModel } from "@/features/ops/ops-shell-view";
import { createDashboardQueryClient } from "@/lib/client/query-client";
import { QueryClientProvider } from "@/lib/vendor/tanstack-react-query";

type OpsCheckViewModel = ReturnType<typeof createOpsShellViewModel>["checks"][number];
type OpsDiagnosticAreaViewModel = ReturnType<typeof createOpsShellViewModel>["diagnosticsAreas"][number];
type OpsDiagnosticSignalViewModel = OpsDiagnosticAreaViewModel["signals"][number];

function OpsShellBody({ initialStatus }: { initialStatus: OpsHealthStatus }) {
  const { data, previousData, refetch } = useOpsHealthQuery({
    initialData: initialStatus,
  });
  const status = data ?? previousData ?? initialStatus;
  const viewModel = createOpsShellViewModel(status);

  return (
    <main className="ops-page">
      <div className="ops-backdrop" aria-hidden="true" />
      <section className="ops-shell" aria-labelledby="ops-shell-heading">
        <a className="ops-shell__skip-link" href="#ops-system-checks">
          Skip to system checks
        </a>

        <header className="ops-shell__header">
          <p className="ops-shell__eyebrow">Local-only venue operations</p>
          <h1 className="ops-shell__title" id="ops-shell-heading">
            {OPS_SHELL_SECTIONS[0].heading}
          </h1>
          <p className="ops-shell__intro">{OPS_SHELL_SECTIONS[0].intro}</p>
        </header>

        <div className="ops-shell__body">
          <section className="ops-panel" aria-labelledby="ops-system-checks">
            <h2 className="ops-panel__title" id="ops-system-checks">
              {OPS_SHELL_SECTIONS[1].heading}
            </h2>
            <p className="ops-panel__intro">{OPS_SHELL_SECTIONS[1].intro}</p>

            <section className="ops-readiness" aria-labelledby="ops-readiness-heading">
              <div className="ops-readiness__header">
                <div>
                  <p className="ops-readiness__label">Public readiness</p>
                  <h3 className="ops-readiness__title" id="ops-readiness-heading">
                    {viewModel.readinessLabel}
                  </h3>
                </div>
                <dl className="ops-readiness__meta">
                  <div>
                    <dt>Snapshot</dt>
                    <dd>{viewModel.snapshotLabel}</dd>
                  </div>
                  <div>
                    <dt>Published</dt>
                    <dd>{viewModel.publishedAt}</dd>
                  </div>
                </dl>
              </div>

              <p className="ops-readiness__summary">{viewModel.readinessSummary}</p>

              <section className="ops-readiness__issues" aria-labelledby="ops-restart-recovery-heading">
                <p className="ops-readiness__label">{viewModel.recoveryHeading}</p>
                <h3 className="ops-diagnostics__title" id="ops-restart-recovery-heading">
                  {viewModel.recoveryLabel}
                </h3>
                <p className="ops-readiness__summary">{viewModel.recoverySummary}</p>
                <dl className="ops-readiness__meta">
                  <div>
                    <dt>Source</dt>
                    <dd>{viewModel.recoverySourceLabel}</dd>
                  </div>
                  <div>
                    <dt>Recovered</dt>
                    <dd>{viewModel.recoveryAt}</dd>
                  </div>
                  <div>
                    <dt>Live status</dt>
                    <dd>{viewModel.recoveryLiveLabel}</dd>
                  </div>
                  <div>
                    <dt>Live resumed</dt>
                    <dd>{viewModel.recoveryResumedAt}</dd>
                  </div>
                </dl>
              </section>

              <ul className="ops-readiness__checks" aria-label="Public readiness checks">
                {viewModel.checks.map((check: OpsCheckViewModel) => (
                  <li className="ops-readiness__check" key={check.id}>
                    <p className="ops-readiness__check-line">
                      <span
                        className={`ops-readiness__check-status ops-readiness__check-status--${check.status}`}
                        aria-hidden="true"
                      >
                        {check.cue}
                      </span>
                      <span className="sr-only">{`${check.cueLabel}: `}</span>
                      <span>{check.label}</span>
                    </p>
                    <p className="ops-readiness__check-detail">{check.detail}</p>
                  </li>
                ))}
              </ul>

              <div className="ops-readiness__issues" aria-live="polite">
                <p className="ops-readiness__label">{viewModel.issuesHeading}</p>
                <ul className="ops-readiness__issue-list">
                  {viewModel.issues.map((issue: string) => (
                    <li className="ops-readiness__issue" key={issue}>
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>

              <section className="ops-diagnostics" aria-labelledby="ops-diagnostics-heading">
                <p className="ops-readiness__label">{viewModel.diagnosticsHeading}</p>
                <h3 className="ops-diagnostics__title" id="ops-diagnostics-heading">
                  Signal and scope
                </h3>
                <p className="ops-diagnostics__summary">{viewModel.diagnosticsSummary}</p>

                {viewModel.diagnosticsAreas.length > 0 ? (
                  <ul className="ops-diagnostics__list" aria-label="Degraded impact diagnostics">
                    {viewModel.diagnosticsAreas.map((area: OpsDiagnosticAreaViewModel) => (
                      <li className="ops-diagnostics__card" key={area.id}>
                        <div className="ops-diagnostics__card-header">
                          <h4 className="ops-diagnostics__card-title">{area.areaLabel}</h4>
                          <p className="ops-diagnostics__scope">{area.impactScope}</p>
                        </div>
                        <ul className="ops-diagnostics__signals">
                          {area.signals.map((signal: OpsDiagnosticSignalViewModel) => (
                            <li className="ops-diagnostics__signal" key={`${area.id}-${signal.label}`}>
                              <p className="ops-diagnostics__signal-line">
                                <span className="ops-diagnostics__signal-label">{signal.label}</span>
                                <span className="ops-diagnostics__signal-state">{signal.stateLabel}</span>
                              </p>
                              <p className="ops-diagnostics__signal-detail">{signal.detail}</p>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                ) : null}

                {viewModel.healthyAreas.length > 0 ? (
                  <div className="ops-diagnostics__healthy">
                    <p className="ops-readiness__label">{viewModel.healthyAreasHeading}</p>
                    <ul className="ops-readiness__issue-list">
                      {viewModel.healthyAreas.map((area: string) => (
                        <li className="ops-readiness__issue" key={area}>
                          {area}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </section>
            </section>
          </section>

          <section className="ops-panel" aria-labelledby="ops-recovery-steps">
            <h2 className="ops-panel__title" id="ops-recovery-steps">
              {OPS_SHELL_SECTIONS[2].heading}
            </h2>
            <p className="ops-panel__intro">{OPS_SHELL_SECTIONS[2].intro}</p>
            <ol className="ops-checklist">
              {OPS_RECOVERY_STEPS.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <OpsActionPanel onActionSettled={refetch} />
          </section>
        </div>
      </section>
    </main>
  );
}

export function OpsShellClient({ initialStatus }: { initialStatus: OpsHealthStatus }) {
  const [queryClient] = useState(() => createDashboardQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <OpsShellBody initialStatus={initialStatus} />
    </QueryClientProvider>
  );
}
