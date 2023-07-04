import { DeckGL } from "@deck.gl/react/typed";
import { _WMSLayer } from "@deck.gl/geo-layers/typed";
import { useMemo } from "react";
import * as React from "react";
import { GpxLayer } from "./gpx-layer";

export default {
  title: "GPX Layer",
};

const gpxFile = "Jotunheimen_rundt.gpx";

const initialViewState = {
  longitude: 8.3,
  latitude: 61.4,
  zoom: 8,
};

const defaultLayerProps = {
  id: "gpx-layer",
  data: gpxFile,
};

export function GPXLayerDefault() {
  const layer = useMemo(
    () => new GpxLayer(defaultLayerProps),
    [defaultLayerProps]
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
        ...defaultLayerProps,
        lineWidthMinPixels: 5,
        getLineColor: [0, 0, 200],
      }),
    [defaultLayerProps]
  );

  return (
    <DeckGL layers={[layer]} initialViewState={initialViewState} controller>
      <div style={{ position: "absolute", top: "10px", left: "10px" }}>
        GPX Example
      </div>
    </DeckGL>
  );
}

export function GpxWms() {
  const gpxLayer = useMemo(
    () => new GpxLayer(defaultLayerProps),
    [defaultLayerProps]
  );

  const wmsLayer = new _WMSLayer({
    data: "https://ows.terrestris.de/osm/service",
    serviceType: "wms",
    layers: ["OSM-WMS"],
  });

  const layers = [gpxLayer, wmsLayer];

  return (
    <DeckGL layers={layers} initialViewState={initialViewState} controller>
      <div style={{ position: "absolute", top: "10px", left: "10px" }}>
        GPX Example
      </div>
    </DeckGL>
  );
}
