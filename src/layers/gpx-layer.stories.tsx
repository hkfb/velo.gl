import { DeckGL } from "@deck.gl/react/typed";
import { StreetLayer } from "./street-layer";
import { useMemo, useState } from "react";
import * as React from "react";
import { GpxLayer } from "./gpx-layer";
import { TerrainLayer } from "@deck.gl/geo-layers/typed";
import { GeoJsonLayerProps } from "@deck.gl/layers/typed";
import { Map } from "react-map-gl/maplibre";
import type { StoryObj } from "@storybook/react";

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
        [defaultLayerProps],
    );

    return (
        <DeckGL
            layers={[layer]}
            initialViewState={initialViewState}
            controller
        ></DeckGL>
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
        [defaultLayerProps],
    );

    return (
        <DeckGL
            layers={[layer]}
            initialViewState={initialViewState}
            controller
        ></DeckGL>
    );
}

export function GpxWms() {
    const gpxLayer = useMemo(
        () =>
            new GpxLayer({
                ...defaultLayerProps,
            }),
        [defaultLayerProps],
    );

    const layers = [gpxLayer, new StreetLayer()];

    return (
        <DeckGL
            layers={layers}
            initialViewState={initialViewState}
            controller
        ></DeckGL>
    );
}

export const GpxSatteliteTerrain: StoryObj = {
    render: () => {
        const layerProps: GeoJsonLayerProps = {
            ...defaultLayerProps,
            getLineColor: [255, 255, 0],
        };

        const gpxLayer = useMemo(
            () => new GpxLayer({ ...layerProps }),
            [layerProps],
        );

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

        const pitchedViewState = {
            ...initialViewState,
            pitch: 45,
        };

        return (
            <DeckGL
                layers={layers}
                initialViewState={pitchedViewState}
                controller
            ></DeckGL>
        );
    },
    tags: ["no-visual-test"],
};

export function GpxMapTerrain() {
    const gpxLayer = useMemo(
        () => new GpxLayer(defaultLayerProps),
        [defaultLayerProps],
    );

    const [API_KEY] = useState(import.meta.env.VITE_MAPTILER_API_KEY);
    const layers = [gpxLayer];
    const mapStyle = `https://api.maptiler.com/maps/streets-v2/style.json?key=${API_KEY}`;

    return (
        <DeckGL
            style={{ position: "absolute", zIndex: "100" }}
            layers={layers}
            initialViewState={initialViewState}
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
