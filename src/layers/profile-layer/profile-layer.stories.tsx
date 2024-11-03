import { ProfileLayer } from "./profile-layer";
import { DeckGL } from "@deck.gl/react";
import * as React from "react";
import { Point3d } from "./extrudePolylineProfile";
import { COORDINATE_SYSTEM } from "@deck.gl/core";

export default {
    title: "Layers / Profile Layer",
};

const initialViewState = {
    longitude: 61.4,
    latitude: 8.3,
    zoom: 7,
};

const POLYLINE = [
    { x: 61.45, y: 7.29, z: 10000 },
    { x: 62.46, y: 8.3, z: 0 },
    { x: 63.47, y: 8.51, z: 7000 },
    { x: 65.47, y: 9.51, z: 8000 },
];

const PATH_LAT_LONG: Point3d[] = POLYLINE.map(({ x, y, z }) => [x, y, z]);

export function ProfileLayerDefault() {
    const data = [PATH_LAT_LONG];

    const props = {
        data,
        id: "profile",
        coordinateSystem: COORDINATE_SYSTEM.METER_OFFSETS,
        pickable: true,
    };

    const layer = new ProfileLayer({ ...props });

    return (
        <DeckGL
            layers={[layer]}
            initialViewState={initialViewState}
            controller
        ></DeckGL>
    );
}
