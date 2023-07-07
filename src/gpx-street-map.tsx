import React from "react";
import { GpxMap } from "./gpx-map";
import { StreetLayer } from "./street-layer";

export function GpxStreetMap({ children }: { children?: React.ReactNode }) {
  return <GpxMap auxLayers={[new StreetLayer()]}>{children}</GpxMap>;
}
