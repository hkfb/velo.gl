import * as React from "react";
import { DeckGL } from "@deck.gl/react/typed";
import { TripGpxLayer } from "./trip-gpx-layer";
import { GpxHillMap } from "../components/gpx-hill-map";
import { DEFAULT_GPX_FILE } from "../components/gpx-map";
import { TEIDE_ACTIVITY_FILE } from "../constant.stories";

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
  return <GpxHillMap gpx={gpxFile} annotationLayers={[layer]}></GpxHillMap>;
}

TripGpxLayerMap.args = { time: 1000 };
TripGpxLayerMap.argTypes = {
  time: { control: { type: "range", min: 1000, max: 46000 } },
};

export function TripGpxLayerSynthetic({ time }: { time: number }) {
  const layer = React.useMemo(
    () =>
      new TripGpxLayer({
        ...defaultLayerProps,
        data: "synthetic.gpx",
        currentTime: time,
        trailLength: 100000,
      }),
    [time, defaultLayerProps]
  );
  return (
    <GpxHillMap gpx={"synthetic.gpx"} annotationLayers={[layer]}></GpxHillMap>
  );
}

TripGpxLayerSynthetic.args = { time: 0 };
TripGpxLayerSynthetic.argTypes = {
  time: { control: { type: "range", min: 0, max: 6000000 } },
};

export function TripGpxLayerAnimate({ velocity }: { velocity: number }) {
  const [date, setDate] = React.useState(0);

  React.useEffect(() => {
    const timerID = setInterval(() => {
      setDate((date) => date + 1);
    }, 1000);
    return () => {
      clearInterval(timerID);
    };
  }, []);

  const layer = React.useMemo(
    () =>
      new TripGpxLayer({
        ...defaultLayerProps,
        data: DEFAULT_GPX_FILE,
        currentTime: date,
        velocity: velocity,
      }),
    [date, defaultLayerProps, velocity]
  );
  return (
    <GpxHillMap gpx={DEFAULT_GPX_FILE} annotationLayers={[layer]}></GpxHillMap>
  );
}

TripGpxLayerAnimate.args = { velocity: 10 };
TripGpxLayerAnimate.argTypes = {
  velocity: { control: { type: "range", min: 0, max: 30 } },
};
