import { useMemo } from "react";
import * as React from "react";
import { DeckGL } from "@deck.gl/react/typed";
import { LayersList } from "@deck.gl/core/typed";
import { GpxLayer } from "./gpx-layer";

const gpxFile =
  "https://cdn.cyclingstage.com/images/tour-de-france/2023/stage-7-parcours.gpx";

const defaultLayerProps = {
  id: "gpx-layer",
  data: gpxFile,
};

const INITIAL_VIEW_STATE = {
  longitude: -0.48,
  latitude: 44.2,
  zoom: 8,
};

export type GpxMapProps = {
  children?: React.ReactNode;
  gpx?: string;
  initialViewState?: typeof INITIAL_VIEW_STATE;
  auxLayers?: LayersList;
};

export function GpxMap({
  children = [],
  gpx = gpxFile,
  initialViewState = INITIAL_VIEW_STATE,
  auxLayers = [],
}: GpxMapProps) {
  const gpxLayer = useMemo(
    () => new GpxLayer({ ...defaultLayerProps, data: gpx }),
    [defaultLayerProps, gpx]
  );

  return (
    <DeckGL
      layers={[...auxLayers, gpxLayer]}
      initialViewState={initialViewState}
      controller
    >
      {children}
    </DeckGL>
  );
}
