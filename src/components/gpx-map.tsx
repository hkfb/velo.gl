import * as React from "react";
import { DeckGL, DeckGLProps } from "@deck.gl/react";
import { LayersList } from "@deck.gl/core";
import { GpxLayer } from "../layers/gpx-layer";
import { GeoJsonLayer } from "@deck.gl/layers";

export const DEFAULT_GPX_FILE = "Jotunheimen_rundt.gpx";

const defaultLayerProps = {
    id: "gpx-layer",
    data: DEFAULT_GPX_FILE,
};

export const INITIAL_VIEW_STATE = {
    longitude: 8.3,
    latitude: 61.4,
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
    gpx = DEFAULT_GPX_FILE,
    initialViewState = INITIAL_VIEW_STATE,
    auxLayers = [],
    deckGlProps = {},
    onGpxLoad,
    annotationLayers = [],
    baseLayers = [],
}: GpxMapProps) {
    const gpxLayer: typeof GeoJsonLayer = new GpxLayer({
        ...defaultLayerProps,
        data: gpx,
        onDataLoad: onGpxLoad,
    });

    const layers = [...baseLayers, ...auxLayers, gpxLayer, ...annotationLayers];

    return (
        <DeckGL
            {...deckGlProps}
            layers={layers}
            initialViewState={initialViewState}
            controller
        >
            {children}
        </DeckGL>
    );
}
