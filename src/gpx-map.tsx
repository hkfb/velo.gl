import { useMemo } from "react";
import * as React from "react";
import { DeckGL } from "@deck.gl/react/typed";
import { GpxLayer } from "./gpx-layer";

const gpxFile = "Jotunheimen_rundt.gpx";

const defaultLayerProps = {
  id: "gpx-layer",
  data: gpxFile,
};

const initialViewState = {
  longitude: 8.3,
  latitude: 61.4,
  zoom: 8,
};

export function GpxMap() {
  const layer = useMemo(
    () => new GpxLayer(defaultLayerProps),
    [defaultLayerProps]
  );

  return (
    <DeckGL
      layers={[layer]}
      initialViewState={initialViewState}
      controller
    ></DeckGL>
  );
}
