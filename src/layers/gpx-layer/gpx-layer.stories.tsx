import { DeckGL } from "@deck.gl/react";
import { StreetLayer } from "../street-layer";
import { useState } from "react";
import * as React from "react";
import { GpxLayer, GpxLayerProps } from "./gpx-layer";
import { CompositeLayer } from "@deck.gl/core";
import { Map } from "react-map-gl/maplibre";
import type { StoryObj } from "@storybook/react";
import {
    JR_ACTIVITY_FILE,
    JR_INITIAL_VIEW_STATE,
    JR_PITCHED_VIEW_STATE,
} from "../../constant.stories";
import { HillLayer } from "../hill-layer";
import { getRgba } from "../util.stories";

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

export const GPXLayerDefault: StoryObj = {
    render: () => {
        const layer = new GpxLayer({ ...defaultLayerProps });

        return (
            <DeckGL
                layers={[layer]}
                initialViewState={JR_INITIAL_VIEW_STATE}
                controller
            ></DeckGL>
        );
    },
};

export const GPXLayerLineStyle: StoryObj<{ color: string } & GpxLayerProps> = {
    args: {
        color: "blue",
        lineWidthMinPixels: 5,
    },
    render: ({ color, lineWidthMinPixels }) => {
        const getLineColor = getRgba(color);

        const layer = new GpxLayer({
            ...defaultLayerProps,
            lineWidthMinPixels,
            getLineColor,
        });

        return (
            <DeckGL
                layers={[layer]}
                initialViewState={JR_PITCHED_VIEW_STATE}
                controller
            ></DeckGL>
        );
    },
};

export const GpxWms: StoryObj = {
    render: () => {
        const gpxLayer = new GpxLayer({
            ...defaultLayerProps,
        });

        const layers = [gpxLayer, new StreetLayer()];

        return (
            <DeckGL
                layers={layers}
                initialViewState={JR_PITCHED_VIEW_STATE}
                controller
            ></DeckGL>
        );
    },
};

export const GpxSatteliteTerrain: StoryObj = {
    render: () => {
        const layerProps: GpxLayerProps = {
            ...defaultLayerProps,
            getLineColor: [255, 255, 0],
        };

        const gpxLayer = new GpxLayer({ ...layerProps });

        const layers = [gpxLayer, new HillLayer()];

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
