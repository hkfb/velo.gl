import { ProfileLayer } from "./profile-layer";
import { DeckGL } from "@deck.gl/react/typed";
import * as React from "react";
import {
    Point3D,
    Point3dTuple,
    extrudePolylineProfile,
    extrudePolylineToRoad,
    lngLatToMeters,
    lngLatToMetersOld,
} from "./extrudePolylineProfile";
import { COORDINATE_SYSTEM } from "@deck.gl/core/typed";

export default {
    title: "Profile Layer",
};

const initialViewState = {
    longitude: 61.4,
    latitude: 8.3,
    zoom: 7,
};

const POLYLINE: Point3D[] = [
    { x: 61.45, y: 7.29, z: 10000 },
    { x: 62.46, y: 8.3, z: 0 },
    { x: 63.47, y: 8.51, z: 7000 },
    { x: 65.47, y: 9.51, z: 8000 },
];

const PATH_LAT_LONG: Point3dTuple[] = POLYLINE.map(({ x, y, z }) => [x, y, z]);

const polylineMeters = PATH_LAT_LONG.map(lngLatToMeters);

/*
const POLYLINE_METERS_STRUCTURED = polylineMeters.map(([x, y, z]) => ({
    x,
    y,
    z,
}));
*/
const POLYLINE_METERS_STRUCTURED = POLYLINE.map(lngLatToMetersOld);
//console.log(POLYLINE_METERS_STRUCTURED);

//const PROFILE = extrudePolylineProfile(polylineMeters, 5000);
const PROFILE = extrudePolylineToRoad(POLYLINE_METERS_STRUCTURED, 5000);
//const PROFILE_LAT_LONG = PROFILE.vertices.map(metersToLngLat);
//console.log(PROFILE_LAT_LONG);

// Flatten and format the positions and indices
/*
const positions = PROFILE_LAT_LONG.map((vertex) => [
  vertex.x,
  vertex.y,
  vertex.z,
]);
*/

const positionsFlat = PROFILE.vertices.flatMap((vertex) => [
    vertex.x,
    vertex.y,
    vertex.z,
]);

const positionsBuffer = new Float32Array(positionsFlat);
const indicesArray = new Uint32Array(PROFILE.indices);

export function ProfileLayerDefault() {
    const data = [PATH_LAT_LONG];

    const props = {
        /*
        mesh: {
            positions: {
                value: positionsBuffer,
                size: 3,
            },
            indices: {
                value: indicesArray,
                size: 1,
            },
        },
        */
        //data: [[0, 0, 0]],
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
