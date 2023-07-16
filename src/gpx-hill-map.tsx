import * as React from "react";
import { FocusGpxMap, FocusGpxMapProps } from "./focus-gpx-map";
import { HillLayer } from "./hill-layer";

/**
 * Renders a GPX trace on top of a satellite terrain map.
 */
export function GpxHillMap(args: FocusGpxMapProps) {
  const baseLayer = new HillLayer();
  return <FocusGpxMap {...args} auxLayers={[baseLayer]} />;
}
