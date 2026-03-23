type LocalMapMarker = {
  key: string;
  label: string;
  x: number;
  y: number;
  caption: string;
};

type LocalMapViewModel = {
  title: string;
  ariaLabel: string;
  state: string;
  stateLabel: string;
  sourceStatus: {
    state: string;
    label: string;
    detail: string;
    isLive: boolean;
  };
  venueAnchor: LocalMapMarker;
  selectedNearbyNodes: readonly LocalMapMarker[];
  localityEmphasis: string | null;
  fallbackCopy: string | null;
  changeSummary: string | null;
};

function markerClassName(marker: LocalMapMarker, isAnchor = false) {
  return isAnchor ? "local-map-panel__marker local-map-panel__marker--anchor" : "local-map-panel__marker";
}

export function LocalMapFrame({ viewModel }: { viewModel: LocalMapViewModel }) {
  const isFallback = viewModel.state === "fallback";
  const narrative =
    (isFallback ? viewModel.fallbackCopy : viewModel.localityEmphasis) ??
    viewModel.localityEmphasis ??
    viewModel.fallbackCopy ??
    "Royal Institution locality held in a fixed nearby frame.";

  return (
    <section className="local-map-panel" aria-label={viewModel.ariaLabel}>
      <div className="local-map-panel__header">
        <div>
          <p className="dashboard-reserved__label">{viewModel.title}</p>
          <h2 className="local-map-panel__heading">Nearby stations</h2>
        </div>
        <p className={`local-map-panel__state local-map-panel__state--${viewModel.state}`}>
          {viewModel.stateLabel}
        </p>
      </div>

      <p className="local-map-panel__intro">{narrative}</p>

      <div className={`local-map-panel__surface local-map-panel__surface--${viewModel.state}`}>
        <div className="local-map-panel__map-wrap">
          <svg
            aria-label="Fixed local map anchored to the Royal Institution"
            className="local-map-panel__graphic"
            role="img"
            viewBox="0 0 100 100"
          >
            <title>Fixed local map anchored to the Royal Institution</title>
            <rect className="local-map-panel__frame" x="2" y="2" width="96" height="96" rx="11" />
            <path
              className="local-map-panel__street local-map-panel__street--primary"
              d="M12 72 C28 60, 36 57, 50 55 S74 49, 88 42"
            />
            <path
              className="local-map-panel__street"
              d="M18 20 C30 28, 40 31, 56 33 S76 36, 90 28"
            />
            <path
              className="local-map-panel__street"
              d="M28 12 C34 28, 38 43, 40 88"
            />
            <path
              className="local-map-panel__street"
              d="M70 10 C66 28, 63 42, 62 84"
            />
            {isFallback ? null : (
              <ellipse className="local-map-panel__corridor" cx="52" cy="46" rx="28" ry="16" />
            )}

            {viewModel.selectedNearbyNodes.map((node) => (
              <g
                key={node.key}
                className={markerClassName(node)}
                style={{ transform: `translate(${node.x}px, ${node.y}px)` }}
              >
                <circle r="3.4" />
                <text x="0" y="-6.6">
                  {node.label}
                </text>
              </g>
            ))}

            <g
              className={markerClassName(viewModel.venueAnchor, true)}
              style={{ transform: `translate(${viewModel.venueAnchor.x}px, ${viewModel.venueAnchor.y}px)` }}
            >
              <circle r="4.8" />
              <text x="0" y="-8.2">
                {viewModel.venueAnchor.label}
              </text>
            </g>
          </svg>

          <p className="local-map-panel__map-badge">{viewModel.venueAnchor.label}</p>
        </div>

        <div className="local-map-panel__legend" aria-label="Locality cues">
          <p className="local-map-panel__legend-anchor">
            <span className="local-map-panel__legend-label">{viewModel.venueAnchor.caption}</span>
            <span>{viewModel.venueAnchor.label}</span>
          </p>
          <ul className="local-map-panel__legend-list">
            {viewModel.selectedNearbyNodes.map((node) => (
              <li key={node.key}>
                <span className="local-map-panel__legend-label">{node.caption}</span>
                <span>{node.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="local-map-panel__footer">
        <p className={`local-map-panel__fallback local-map-panel__fallback--${viewModel.sourceStatus.state}`}>
          {viewModel.sourceStatus.detail}
        </p>
        {viewModel.changeSummary ? <p className="local-map-panel__update">{viewModel.changeSummary}</p> : null}
      </div>
    </section>
  );
}
