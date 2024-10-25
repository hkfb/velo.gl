import { ProfileLayer } from "./profile-layer";
import { DeckGL } from "@deck.gl/react/typed";
import * as React from "react";
import {
  Point3D,
  extrudePolylineToRoad as extrudePolylineProfile,
  lngLatToMeters,
  metersToLngLat,
} from "./extrudePolylineProfile";
import { PathLayer } from "@deck.gl/layers/typed";
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
  { x: 61.45, y: 7.29, z: 10 },
  { x: 62.46, y: 8.3, z: 10000 },
  { x: 63.47, y: 8.51, z: 7000 },
  { x: 65.47, y: 9.51, z: 8000 },
];

const polylineMeters = POLYLINE.map(lngLatToMeters);

const PROFILE = extrudePolylineProfile(polylineMeters, 5000);
const PROFILE_LAT_LONG = PROFILE.vertices.map(metersToLngLat);
console.log(PROFILE_LAT_LONG);

// Flatten and format the positions and indices
const positions = PROFILE_LAT_LONG.map((vertex) => [
  vertex.x,
  vertex.y,
  vertex.z,
]);

const positionsFlat = PROFILE.vertices.flatMap((vertex) => [
  vertex.x,
  vertex.y,
  vertex.z,
]);

const positionsBuffer = new Float32Array(positionsFlat);
const indicesArray = new Uint32Array(PROFILE.indices);

export function ProfileLayerDefault() {
  const props = {
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
    data: [[0, 0, 0]],
    id: "p",
    wireframe: true,
    coordinateSystem: COORDINATE_SYSTEM.METER_OFFSETS,
  };

  const layer = new ProfileLayer({ ...props });

  //console.log(positions);

  //const pathV = POLYLINE.map((v) => [v.x, v.y, v.z]);
  const pathV = positions;

  const path = new PathLayer({
    data: [pathV],
    getPath: (object) => object,
    widthMinPixels: 2,
  });

  //console.log(props);

  return (
    <DeckGL
      layers={[layer]}
      //layers={[layer, path]}
      //layers={[/*layer,*/ path]}
      initialViewState={initialViewState}
      controller
    ></DeckGL>
  );
}
