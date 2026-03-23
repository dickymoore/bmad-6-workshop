type LocalityReferenceViewModel = {
  key: string;
  label: string;
  kind: string;
  kindLabel: string;
  caption: string;
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
  return (
    <section className="locality-reference-panel" aria-labelledby="locality-reference-heading">
      <div className="locality-reference-panel__header">
        <div>
          <p className="dashboard-reserved__label">{viewModel.title}</p>
          <h2 className="locality-reference-panel__heading" id="locality-reference-heading">
            {viewModel.heading}
          </h2>
        </div>
        <p className="locality-reference-panel__summary-label">Named nearby read</p>
      </div>
      {viewModel.summary ? <p className="locality-reference-panel__summary">{viewModel.summary}</p> : null}
      <ul className="locality-reference-panel__list" aria-label="Concrete nearby references">
        {viewModel.references.map((reference) => (
          <li key={reference.key} className="locality-reference-panel__item">
            <div>
              <p className="locality-reference-panel__item-label">{reference.label}</p>
              <p className="locality-reference-panel__item-caption">{reference.caption}</p>
            </div>
            <p className="locality-reference-panel__item-kind">{reference.kindLabel}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
