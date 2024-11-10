import { DeckGL } from "@deck.gl/react";
import { StreetLayer } from "./street-layer";
import { useMemo, useState } from "react";
import * as React from "react";
import { GpxLayer, GpxLayerProps } from "./gpx-layer";
import { TerrainLayer } from "@deck.gl/geo-layers";
import { LayersList, CompositeLayer } from "@deck.gl/core";
import { Map } from "react-map-gl/maplibre";
import type { StoryObj } from "@storybook/react";
import {
    JR_ACTIVITY_FILE,
    JR_INITIAL_VIEW_STATE,
    JR_PITCHED_VIEW_STATE,
} from "../constant.stories";

export default {
    title: "Layers / GPX Layer",
    tags: ["autodocs"],
    parameters: {
        docs: {
            story: {
                height: "600px",
            },
        },
    },
};

const defaultLayerProps = {
    id: "gpx-layer",
    data: JR_ACTIVITY_FILE,
};

export function GPXLayerDefault() {
    const layer = new GpxLayer({ ...defaultLayerProps });

    return (
        <DeckGL
            layers={[layer] as LayersList}
            initialViewState={JR_INITIAL_VIEW_STATE}
            controller
        ></DeckGL>
    );
}

export function GPXLayerLineStyle() {
    const layer = new GpxLayer({
        ...defaultLayerProps,
        lineWidthMinPixels: 5,
        getLineColor: [0, 0, 200],
    }) as CompositeLayer;

    return (
        <DeckGL
            layers={[layer]}
            initialViewState={JR_INITIAL_VIEW_STATE}
            controller
        ></DeckGL>
    );
}

export function GpxWms() {
    const gpxLayer = new GpxLayer({
        ...defaultLayerProps,
    }) as CompositeLayer;

    const layers = [gpxLayer, new StreetLayer()];

    return (
        <DeckGL
            layers={layers}
            initialViewState={JR_INITIAL_VIEW_STATE}
            controller
        ></DeckGL>
    );
}

export const GpxSatteliteTerrain: StoryObj = {
    render: () => {
        const layerProps: GpxLayerProps = {
            ...defaultLayerProps,
            getLineColor: [255, 255, 0],
        };

        const gpxLayer = new GpxLayer({ ...layerProps });

        const [key] = useState(import.meta.env.VITE_MAPTILER_API_KEY);

        const TERRAIN_IMAGE = `https://api.maptiler.com/tiles/terrain-rgb-v2/{z}/{x}/{y}.webp?key=${key}`;
        const SURFACE_IMAGE = `https://api.maptiler.com/tiles/satellite-v2/{z}/{x}/{y}.jpg?key=${key}`;

        const ELEVATION_DECODER = {
            rScaler: 6553.6,
            gScaler: 25.6,
            bScaler: 0.1,
            offset: -10000,
        };

        const terrainLayer = useMemo(
            () =>
                new TerrainLayer({
                    id: "terrain",
                    minZoom: 0,
                    maxZoom: 12,
                    elevationDecoder: ELEVATION_DECODER,
                    elevationData: TERRAIN_IMAGE,
                    texture: SURFACE_IMAGE,
                    wireframe: false,
                    color: [255, 255, 255],
                }),
            [ELEVATION_DECODER, TERRAIN_IMAGE, SURFACE_IMAGE],
        );

        const layers = [gpxLayer, terrainLayer];

        return (
            <DeckGL
                layers={layers}
                initialViewState={JR_PITCHED_VIEW_STATE}
                controller
            ></DeckGL>
        );
    },
    tags: ["no-visual-test"],
};

export function GpxMapTerrain() {
    const gpxLayer = new GpxLayer({ ...defaultLayerProps }) as CompositeLayer;

    const [API_KEY] = useState(import.meta.env.VITE_MAPTILER_API_KEY);
    const layers = [gpxLayer];
    const mapStyle = `https://api.maptiler.com/maps/streets-v2/style.json?key=${API_KEY}`;

    return (
        <DeckGL
            style={{ position: "absolute", zIndex: "100" }}
            layers={layers}
            initialViewState={JR_INITIAL_VIEW_STATE}
            controller
        >
            <Map
                mapStyle={mapStyle}
                style={{ position: "relative", zIndex: "-100" }}
            />
        </DeckGL>
    );
}
GpxMapTerrain.tags = ["no-visual-test"];
