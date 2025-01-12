import { type MapViewState } from "@deck.gl/core";
import { Point3d } from "./layers/profile-layer/extrudePolylineProfile";
import { PathGeometry } from "@deck.gl/layers/dist/path-layer/path";

export const TEIDE_ACTIVITY_FILE = "Teide.tcx";

export const JR_ACTIVITY_FILE = "Jotunheimen_rundt.gpx";

export const JR_INITIAL_VIEW_STATE: MapViewState = {
    longitude: 8.3,
    latitude: 61.4,
    zoom: 8,
};

export const JR_PITCHED_VIEW_STATE: MapViewState = {
    ...JR_INITIAL_VIEW_STATE,
    pitch: 45,
};

export const SYNTHETIC_VIEW_STATE: MapViewState = {
    ...JR_PITCHED_VIEW_STATE,
    zoom: 7,
};

const SYNTHETIC_POLYLINE = [
    { y: 61.45, x: 7.29, z: 10000 },
    { y: 62.26, x: 8.3, z: 0 },
    { y: 62.17, x: 8.51, z: 7000 },
    { y: 61.1, x: 9.51, z: 8000 },
    { y: 61.0, x: 8.51, z: 8000 },
    { y: 61.1, x: 8.71, z: 1000 },
];

export const SYNTHETIC_PATH: Point3d[] = SYNTHETIC_POLYLINE.map(
    ({ x, y, z }) => [x, y, z],
);

export const SYNTHETIC_DATA = [
    {
        path: SYNTHETIC_PATH as PathGeometry,
    },
];
