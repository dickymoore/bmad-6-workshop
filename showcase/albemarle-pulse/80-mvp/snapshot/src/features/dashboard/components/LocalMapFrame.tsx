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

const MAP_CENTER = Object.freeze({
  lat: 51.5086,
  lng: -0.1418,
});

const MAP_VIEWBOX = Object.freeze({
  width: 1000,
  height: 840,
});
const MAP_SCALE_LEVEL = 17;
const MAP_TILE_SIZE = 256;
const MAP_TILE_GRID_PADDING = 1;

const MAP_COORDINATES_BY_KEY = Object.freeze({
  "royal-institution": { lat: 51.5097496, lng: -0.1423309 },
  "green-park": { lat: 51.5066092, lng: -0.1427438 },
  "green-park-station": { lat: 51.5066092, lng: -0.1427438 },
  "piccadilly-stop-r": { lat: 51.50855, lng: -0.13725 },
  "albemarle-street": { lat: 51.5102, lng: -0.1423309 },
});

const MARKER_POSITIONING = Object.freeze({
  "green-park": "north",
  "piccadilly-stop-r": "west",
  "albemarle-street": "north-west",
});

function getMarkerPositioning(key: string) {
  return MARKER_POSITIONING[key as keyof typeof MARKER_POSITIONING] ?? "north";
}

function toWorldPoint(pointLat: number, pointLng: number) {
  const scale = 256 * 2 ** MAP_SCALE_LEVEL;
  const sine = Math.min(Math.max(Math.sin((pointLat * Math.PI) / 180), -0.9999), 0.9999);

  return {
    x: ((pointLng + 180) / 360) * scale,
    y: (0.5 - Math.log((1 + sine) / (1 - sine)) / (4 * Math.PI)) * scale,
  };
}

const MAP_CENTER_POINT = toWorldPoint(MAP_CENTER.lat, MAP_CENTER.lng);

function projectCoordinate(lat: number, lng: number) {
  const markerPoint = toWorldPoint(lat, lng);

  return {
    x: ((markerPoint.x - MAP_CENTER_POINT.x) + MAP_VIEWBOX.width / 2) / MAP_VIEWBOX.width,
    y: ((markerPoint.y - MAP_CENTER_POINT.y) + MAP_VIEWBOX.height / 2) / MAP_VIEWBOX.height,
  };
}

function markerPositionStyle(marker: LocalMapMarker) {
  const coordinates = MAP_COORDINATES_BY_KEY[marker.key as keyof typeof MAP_COORDINATES_BY_KEY];
  const position = coordinates
    ? projectCoordinate(coordinates.lat, coordinates.lng)
    : {
        x: marker.x / 100,
        y: marker.y / 100,
      };

  return {
    left: `${(position.x * 100).toFixed(2)}%`,
    top: `${(position.y * 100).toFixed(2)}%`,
  } as const;
}

function buildMapTiles() {
  const minTileX = Math.floor((MAP_CENTER_POINT.x - MAP_VIEWBOX.width / 2) / MAP_TILE_SIZE) - MAP_TILE_GRID_PADDING;
  const maxTileX = Math.floor((MAP_CENTER_POINT.x + MAP_VIEWBOX.width / 2) / MAP_TILE_SIZE) + MAP_TILE_GRID_PADDING;
  const minTileY = Math.floor((MAP_CENTER_POINT.y - MAP_VIEWBOX.height / 2) / MAP_TILE_SIZE) - MAP_TILE_GRID_PADDING;
  const maxTileY = Math.floor((MAP_CENTER_POINT.y + MAP_VIEWBOX.height / 2) / MAP_TILE_SIZE) + MAP_TILE_GRID_PADDING;

  const tileXRange = Array.from({ length: maxTileX - minTileX + 1 }, (_, index) => minTileX + index);
  const tileYRange = Array.from({ length: maxTileY - minTileY + 1 }, (_, index) => minTileY + index);

  return tileXRange.flatMap((tileX) =>
    tileYRange.map((tileY) => ({
      key: `${tileX}-${tileY}`,
      src: `/map-tiles/${MAP_SCALE_LEVEL}/${tileX}-${tileY}.png`,
      x: (tileX * MAP_TILE_SIZE - MAP_CENTER_POINT.x) + MAP_VIEWBOX.width / 2,
      y: (tileY * MAP_TILE_SIZE - MAP_CENTER_POINT.y) + MAP_VIEWBOX.height / 2,
    })),
  );
}

const MAP_TILES = buildMapTiles();

function tileStyle(tile: { x: number; y: number }) {
  return {
    left: `${((tile.x / MAP_VIEWBOX.width) * 100).toFixed(3)}%`,
    top: `${((tile.y / MAP_VIEWBOX.height) * 100).toFixed(3)}%`,
    width: `${((MAP_TILE_SIZE / MAP_VIEWBOX.width) * 100).toFixed(3)}%`,
    height: `${((MAP_TILE_SIZE / MAP_VIEWBOX.height) * 100).toFixed(3)}%`,
  } as const;
}

export function LocalMapFrame({ viewModel }: { viewModel: LocalMapViewModel }) {
  const isFallback = viewModel.state === "fallback";
  const narrative =
    (isFallback ? viewModel.fallbackCopy : viewModel.localityEmphasis) ??
    viewModel.localityEmphasis ??
    viewModel.fallbackCopy ??
    "Royal Institution and nearby stations are shown on the map.";
  const overlayLabel = "Royal Institution area";
  const overlayCopy =
    viewModel.nearbyReferences
      .slice(0, 2)
      .map((reference) => reference.label)
      .join(" • ") || "Green Park • Piccadilly / St James's Street";

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
        {/* Optional venue override can still point at a Google-backed source such as www.google.com/maps. */}
        <div aria-hidden="true" className="local-map-panel__base-map">
          {MAP_TILES.map((tile) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              alt=""
              className="local-map-panel__tile"
              key={tile.key}
              loading="eager"
              src={tile.src}
              style={tileStyle(tile)}
            />
          ))}
          <div className="local-map-panel__base-map-wash" />
        </div>
        {isFallback ? null : (<p className="local-map-panel__district-label">Albemarle Street District</p>)}
        <div className="local-map-panel__marker-layer" aria-label="Passive local orientation map anchored to the Royal Institution">
          {viewModel.selectedNearbyNodes.map((node) =>
            node.key === "albemarle-street" ? null : (
              <div
                key={node.key}
                className={`local-map-panel__node local-map-panel__node--${getMarkerPositioning(node.key)}`}
                style={markerPositionStyle(node)}
              >
                <span className="local-map-panel__node-dot" aria-hidden="true" />
                <span className="local-map-panel__node-label">{node.label}</span>
              </div>
            ),
          )}

          <div className="local-map-panel__venue-anchor" style={markerPositionStyle(viewModel.venueAnchor)}>
            <span className="local-map-panel__venue-dot" aria-hidden="true" />
            <p className="local-map-panel__venue-pill">{viewModel.venueAnchor.label}</p>
          </div>
        </div>

        {isFallback ? <span className="sr-only">{narrative}</span> : <span className="sr-only">Full local map detail.</span>}

        <div className="local-map-panel__overlay-card">
          <p className="local-map-panel__overlay-label">{overlayLabel}</p>
          <p className="local-map-panel__overlay-copy">{overlayCopy}</p>
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
