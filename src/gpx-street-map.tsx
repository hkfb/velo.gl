import React from "react";
import { GpxMap } from "./gpx-map";
import { StreetLayer } from "./street-layer";

export function GpxStreetMap() {
  return <GpxMap auxLayers={[new StreetLayer()]} />;
}
