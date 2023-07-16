import * as React from "react";
import { DeckGL } from "@deck.gl/react/typed";
import { TripGpxLayer } from "./trip-gpx-layer";
import { GpxHillMap } from "../components/gpx-hill-map";
import { GpxMap } from "../components/gpx-map";
import { FocusGpxMap } from "../components/focus-gpx-map";

export default {
  title: "GPX Trip Layer",
};

const gpxFile = "Jotunheimen_rundt.gpx";

const defaultLayerProps = {
  id: "trip-layer",
  data: gpxFile,
};

const initialViewState = {
  longitude: 7.883,
  latitude: 61.09,
  zoom: 8,
};

export function TripGpxLayerDefault() {
  const layer = new TripGpxLayer({
    ...defaultLayerProps,
  });
  return (
    <DeckGL
      layers={[layer]}
      initialViewState={initialViewState}
      controller
    ></DeckGL>
  );
}

export function TripGpxLayerTime({ time }: { time: number }) {
  const layer = React.useMemo(
    () =>
      new TripGpxLayer({
        ...defaultLayerProps,
        currentTime: time,
      }),
    [time, defaultLayerProps]
  );
  return (
    <DeckGL
      layers={[layer]}
      initialViewState={initialViewState}
      controller
    ></DeckGL>
  );
}

TripGpxLayerTime.args = { time: 10000 };
TripGpxLayerTime.argTypes = {
  time: { control: { type: "range", min: 1000, max: 10000 } },
};

export function TripGpxLayerMap({ time }: { time: number }) {
  const layer = React.useMemo(
    () =>
      new TripGpxLayer({
        ...defaultLayerProps,
        currentTime: time,
      }),
    [time, defaultLayerProps]
  );
  return <FocusGpxMap gpx={gpxFile} annotationLayers={[layer]}></FocusGpxMap>;
}

TripGpxLayerMap.args = { time: 1000 };
TripGpxLayerMap.argTypes = {
  time: { control: { type: "range", min: 1000, max: 46000 } },
};
