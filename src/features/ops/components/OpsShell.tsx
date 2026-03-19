import { OPS_ACTION_GROUPS, OPS_SHELL_SECTIONS } from "@/features/ops/ops-shell-content";

export function OpsShell() {
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

            <div className="ops-action-grid">
              {OPS_ACTION_GROUPS.map((group) => (
                <section className="ops-action-group" key={group.heading} aria-label={group.heading}>
                  <h3 className="ops-action-group__title">{group.heading}</h3>
                  <ul className="ops-action-group__list">
                    {group.actions.map((action) => (
                      <li className="ops-action-group__item" key={action}>
                        <button className="ops-action-group__button" type="button">
                          {action}
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </section>

          <section className="ops-panel" aria-labelledby="ops-recovery-steps">
            <h2 className="ops-panel__title" id="ops-recovery-steps">
              {OPS_SHELL_SECTIONS[2].heading}
            </h2>
            <p className="ops-panel__intro">{OPS_SHELL_SECTIONS[2].intro}</p>
            <ol className="ops-checklist">
              <li>Confirm the public display remains unchanged before any maintenance action.</li>
              <li>Review readiness and fallback notes in this local surface.</li>
              <li>Use later Epic 3 recovery actions here when they are implemented.</li>
            </ol>
          </section>
        </div>
      </section>
    </main>
  );
}
