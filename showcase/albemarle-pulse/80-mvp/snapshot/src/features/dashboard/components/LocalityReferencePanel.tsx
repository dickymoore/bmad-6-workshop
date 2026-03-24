type LocalityReferenceViewModel = {
  key: string;
  label: string;
  kind: string;
  kindLabel: string;
  caption: string;
  lineTokens: readonly string[];
};

type LocalityReferencePanelViewModel = {
  title: string;
  heading: string;
  summary: string | null;
  references: readonly LocalityReferenceViewModel[];
};

export function LocalityReferencePanel({
  viewModel,
}: {
  viewModel: LocalityReferencePanelViewModel;
}) {
  const visibleReferences = viewModel.references.filter((reference) => reference.kind !== "corridor").slice(0, 2);

  return (
    <section className="locality-reference-panel" aria-labelledby="locality-reference-heading">
      <div className="locality-reference-panel__header">
        <div>
          <p className="dashboard-reserved__label">{viewModel.title}</p>
          <h2 className="locality-reference-panel__heading" id="locality-reference-heading">
            {viewModel.heading}
          </h2>
        </div>
        <p className="locality-reference-panel__summary-label">Close read</p>
      </div>
      <ul className="locality-reference-panel__list" aria-label="Concrete nearby references">
        {visibleReferences.map((reference) => (
          <li key={reference.key} className="locality-reference-panel__item">
            <div className="locality-reference-panel__item-primary">
              <span className="locality-reference-panel__item-walk" aria-hidden="true">
                W
              </span>
              <div>
                <p className="locality-reference-panel__item-label">{reference.label}</p>
                <div className="locality-reference-panel__item-lines" aria-hidden="true">
                  {reference.lineTokens.map((line) => (
                    <span
                      key={`${reference.key}-${line}`}
                      className={`locality-reference-panel__item-line locality-reference-panel__item-line--${line}`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <p className="locality-reference-panel__item-kind">{reference.caption}</p>
          </li>
        ))}
      </ul>
      {viewModel.summary ? <p className="sr-only">{viewModel.summary}</p> : null}
      <p className="sr-only">{viewModel.heading}</p>
    </section>
  );
}
