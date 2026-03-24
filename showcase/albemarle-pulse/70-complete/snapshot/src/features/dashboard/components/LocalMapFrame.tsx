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
  nearbyReferences: readonly {
    key: string;
    label: string;
    kind: string;
    kindLabel: string;
    caption: string;
  }[];
  localityEmphasis: string | null;
  fallbackCopy: string | null;
  changeSummary: string | null;
};

function markerClassName(marker: LocalMapMarker, isAnchor = false) {
  return isAnchor ? "local-map-panel__marker local-map-panel__marker--anchor" : "local-map-panel__marker";
}

function renderMapLabel(label: string) {
  const parts = label.split(" / ");

  if (parts.length === 1) {
    return label;
  }

  return parts.map((part, index) => (
    <tspan key={`${label}-${part}`} x="0" dy={index === 0 ? 0 : 4.8}>
      {part}
    </tspan>
  ));
}

export function LocalMapFrame({ viewModel }: { viewModel: LocalMapViewModel }) {
  const isFallback = viewModel.state === "fallback";
  const narrative =
    (isFallback ? viewModel.fallbackCopy : viewModel.localityEmphasis) ??
    viewModel.localityEmphasis ??
    viewModel.fallbackCopy ??
    "Royal Institution locality held in a fixed nearby frame.";
  const overlayLabel = isFallback ? "Simplified local read" : "Mayfair transit hub";

  return (
    <section className="local-map-panel" aria-label={viewModel.ariaLabel}>
      <div className="local-map-panel__header sr-only">
        <div>
          <p className="dashboard-reserved__label">{viewModel.title}</p>
          <h2 className="local-map-panel__heading">Albemarle Street district</h2>
        </div>
        <p className={`local-map-panel__state local-map-panel__state--${viewModel.state}`}>{viewModel.stateLabel}</p>
      </div>

      <div className={`local-map-panel__surface local-map-panel__surface--${viewModel.state}`}>
        <p className="local-map-panel__district-label">Albemarle Street District</p>
        <svg
          aria-label="Passive local orientation map anchored to the Royal Institution"
          className="local-map-panel__graphic"
          role="img"
          viewBox="0 0 160 160"
        >
          <title>Passive local orientation map anchored to the Royal Institution</title>
          <rect className="local-map-panel__frame" x="8" y="8" width="144" height="144" rx="18" />
          <rect className="local-map-panel__block" x="20" y="18" width="44" height="38" rx="8" />
          <rect className="local-map-panel__block" x="96" y="18" width="44" height="38" rx="8" />
          <rect className="local-map-panel__block" x="20" y="96" width="44" height="40" rx="8" />
          <rect className="local-map-panel__block" x="104" y="100" width="32" height="32" rx="8" />
          <path className="local-map-panel__road" d="M78 18 L102 18 L102 140 L78 140 Z" />
          <path className="local-map-panel__road local-map-panel__road--primary" d="M18 90 L142 90" />
          <path className="local-map-panel__road" d="M18 62 L142 62" />
          <path className="local-map-panel__road" d="M44 18 L44 140" />
          <text className="local-map-panel__street-label" x="112" y="80">
            Piccadilly
          </text>
          <text className="local-map-panel__street-label local-map-panel__street-label--primary" x="90" y="46">
            Albemarle Street
          </text>
          {isFallback ? null : (
            <text className="local-map-panel__street-label" x="48" y="54">
              Burlington Gardens
            </text>
          )}

          {viewModel.selectedNearbyNodes.map((node) => (
            <g
              key={node.key}
              className={markerClassName(node)}
              transform={`translate(${node.x} ${node.y})`}
            >
              <circle r="3.4" />
              <text x="0" y="-8.4">
                {renderMapLabel(node.label)}
              </text>
            </g>
          ))}

          <g
            className={markerClassName(viewModel.venueAnchor, true)}
            transform={`translate(${viewModel.venueAnchor.x} ${viewModel.venueAnchor.y})`}
          >
            <circle className="local-map-panel__anchor-ring" r="7.2" />
            <circle r="4.8" />
            <text x="0" y="-10.2">
              {viewModel.venueAnchor.label}
            </text>
          </g>
        </svg>

        <p className="local-map-panel__venue-pill">{viewModel.venueAnchor.label}</p>

        <div className="local-map-panel__overlay-card">
          <p className="local-map-panel__overlay-label">{overlayLabel}</p>
          <p className="local-map-panel__overlay-copy">{isFallback ? viewModel.sourceStatus.detail : narrative}</p>
        </div>
      </div>

      <div className="local-map-panel__footer sr-only">
        <p className={`local-map-panel__fallback local-map-panel__fallback--${viewModel.sourceStatus.state}`}>
          {viewModel.sourceStatus.detail}
        </p>
        {viewModel.changeSummary ? <p className="local-map-panel__update">{viewModel.changeSummary}</p> : null}
      </div>
    </section>
  );
}
