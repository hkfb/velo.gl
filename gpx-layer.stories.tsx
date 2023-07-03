import { DeckGL } from "@deck.gl/react/typed";
import { useMemo } from "react";
import * as React from "react";
import { GpxLayer } from "./gpx-layer";

export default {
  title: "GPX Layer",
};

const gpxFile = "Morning_Ride.gpx";

const initialViewState = {
  longitude: 10.8,
  latitude: 59.85,
  zoom: 15,
};

export function GPXLayerDefault() {
  const layer = useMemo(
    () =>
      new GpxLayer({
        id: "gpx-layer",
        data: gpxFile,
      }),
    [gpxFile]
  );

  return (
    <DeckGL layers={[layer]} initialViewState={initialViewState} controller>
      <div style={{ position: "absolute", top: "10px", left: "10px" }}>
        GPX Example
      </div>
    </DeckGL>
  );
}

export function GPXLayerLineStyle() {
  const layer = useMemo(
    () =>
      new GpxLayer({
        id: "gpx-layer",
        data: gpxFile,
        lineWidthMinPixels: 5,
        getLineColor: [0, 0, 0],
      }),
    [gpxFile]
  );

  return (
    <DeckGL layers={[layer]} initialViewState={initialViewState} controller>
      <div style={{ position: "absolute", top: "10px", left: "10px" }}>
        GPX Example
      </div>
    </DeckGL>
  );
}
