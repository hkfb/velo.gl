import * as React from "react";
import { DeckGL, DeckGLProps } from "@deck.gl/react";
import { LayersList } from "@deck.gl/core";
import {
    ActivityLayer,
    ActivityLayerProps,
} from "../layers/activity-layer/activity-layer";

export const DEFAULT_GPX_FILE = "Jotunheimen_rundt.gpx";

const defaultLayerProps = {
    id: "profile",
    data: DEFAULT_GPX_FILE,
};

export const INITIAL_VIEW_STATE = {
    longitude: 8.3,
    latitude: 61.4,
    zoom: 8,
};

const DEFAULT_CONTROLLER = {
    touchRotate: true,
};

export type ActivityMapProps = {
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

    /**
     * Properties that control the appearance of activity profiles.
     */
    profileConfig?: Omit<ActivityLayerProps, "data" | "id">;
};

export function ActivityMap({
    children = [],
    gpx = DEFAULT_GPX_FILE,
    initialViewState = INITIAL_VIEW_STATE,
    auxLayers = [],
    deckGlProps = {},
    onGpxLoad,
    annotationLayers = [],
    baseLayers = [],
    profileConfig = {},
}: ActivityMapProps) {
    const gpxLayer = new ActivityLayer({
        ...defaultLayerProps,
        ...profileConfig,
        data: gpx,
        onDataLoad: onGpxLoad,
    });

    const layers = [...baseLayers, ...auxLayers, gpxLayer, ...annotationLayers];

    const controller = deckGlProps.controller ?? DEFAULT_CONTROLLER;

    return (
        <DeckGL
            {...deckGlProps}
            layers={layers}
            initialViewState={initialViewState}
            controller={controller}
        >
            {children}
        </DeckGL>
    );
}

/**
 * @deprecated use ActivityMapProps instead.
 */
export type GpxMapProps = ActivityMapProps;

/**
 * @deprecated use ActivityMap instead.
 */
export const GpxMap = ActivityMap;
