import { TerrainLayer } from "@deck.gl/geo-layers";

const KEY = import.meta.env.VITE_MAPTILER_API_KEY;

const TERRAIN_IMAGE = `https://api.maptiler.com/tiles/terrain-rgb-v2/{z}/{x}/{y}.webp?key=${KEY}`;
const SURFACE_IMAGE = `https://api.maptiler.com/tiles/satellite-v2/{z}/{x}/{y}.jpg?key=${KEY}`;

const ELEVATION_DECODER = {
    rScaler: 6553.6,
    gScaler: 25.6,
    bScaler: 0.1,
    offset: -10000,
};

export class HillLayer extends TerrainLayer {}

HillLayer.defaultProps = {
    ...TerrainLayer.defaultProps,
    id: "hill-layer",
    elevationDecoder: ELEVATION_DECODER,
    elevationData: TERRAIN_IMAGE,
    texture: SURFACE_IMAGE,
    wireframe: false,
    color: [255, 255, 255],
    minZoom: 0,
    maxZoom: 12,
    getPolygonOffset: () => [0, 10000],
};
