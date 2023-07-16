import { useMemo } from "react";
import * as React from "react";
import { DeckGL, DeckGLProps } from "@deck.gl/react/typed";
import { LayersList } from "@deck.gl/core/typed";
import { GpxLayer } from "../layers/gpx-layer";

const gpxFile =
  "https://cdn.cyclingstage.com/images/tour-de-france/2023/stage-7-parcours.gpx";

const defaultLayerProps = {
  id: "gpx-layer",
  data: gpxFile,
};

export const INITIAL_VIEW_STATE = {
  longitude: -0.48,
  latitude: 44.2,
  zoom: 8,
};

export type GpxMapProps = {
  children?: React.ReactNode;
  gpx?: string;
  initialViewState?: typeof INITIAL_VIEW_STATE;

  /**
   * Auxillary layers.
   * @deprecated Use baseLayers or annotationLayers instead.
   */
  auxLayers?: LayersList;
  deckGlProps?: DeckGLProps;
  onGpxLoad?: (data: unknown, context: unknown) => void;

  /**
   * A list of layers to render on top of the GPX track.
   */
  annotationLayers?: LayersList;

  /**
   * A list of layers to render below the GPX track.
   */
  baseLayers?: LayersList;
};

export function GpxMap({
  children = [],
  gpx = gpxFile,
  initialViewState = INITIAL_VIEW_STATE,
  auxLayers = [],
  deckGlProps = {},
  onGpxLoad,
  annotationLayers = [],
  baseLayers = [],
}: GpxMapProps) {
  const gpxLayer = useMemo(
    () =>
      new GpxLayer({ ...defaultLayerProps, data: gpx, onDataLoad: onGpxLoad }),
    [defaultLayerProps, gpx]
  );

  return (
    <DeckGL
      {...deckGlProps}
      layers={[...baseLayers, ...auxLayers, gpxLayer, ...annotationLayers]}
      initialViewState={initialViewState}
      controller
    >
      {children}
    </DeckGL>
  );
}
