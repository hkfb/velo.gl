import * as React from "react";
import { DeckGL } from "@deck.gl/react";
import { Layer } from "@deck.gl/core";
import { TripGpxLayer, TripGpxLayerProps } from "./trip-gpx-layer";
import { GpxHillMap } from "../components/gpx-hill-map";
import { DEFAULT_GPX_FILE } from "../components/activity-map";
import type { StoryObj } from "@storybook/react";

export default {
    title: "Layers / GPX Trip Layer",
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

export const TripGpxLayerDefault: StoryObj<TripGpxLayerProps> = {
    render: (layerProps) => {
        const layer = new TripGpxLayer({
            ...layerProps,
        });
        return (
            <DeckGL
                layers={[layer]}
                initialViewState={initialViewState}
                controller
            ></DeckGL>
        );
    },
    tags: ["no-test-webkit"],
    args: { ...defaultLayerProps },
};

export const TripGpxLayerTime: StoryObj<{ time: number }> = {
    render: ({ time }) => {
        const layer = new TripGpxLayer({
            ...defaultLayerProps,
            currentTime: time,
        });
        return (
            <DeckGL
                layers={[layer]}
                initialViewState={initialViewState}
                controller
            ></DeckGL>
        );
    },
    tags: ["no-test-webkit"],
    args: { time: 10000 },
    argTypes: {
        time: { control: { type: "range", min: 1000, max: 10000 } },
    },
};

export function TripGpxLayerMap({ time }: { time: number }) {
    const layer = new TripGpxLayer({
        ...defaultLayerProps,
        currentTime: time,
    }) as unknown as Layer;
    return <GpxHillMap gpx={gpxFile} annotationLayers={[layer]}></GpxHillMap>;
}

TripGpxLayerMap.args = { time: 1000 };
TripGpxLayerMap.argTypes = {
    time: { control: { type: "range", min: 1000, max: 46000 } },
};
TripGpxLayerMap.tags = ["no-visual-test"];

export function TripGpxLayerSynthetic({ time }: { time: number }) {
    const layer = new TripGpxLayer({
        ...defaultLayerProps,
        data: "synthetic.gpx",
        currentTime: time,
        trailLength: 100000,
    }) as unknown as Layer;

    return (
        <GpxHillMap
            gpx={"synthetic.gpx"}
            annotationLayers={[layer]}
        ></GpxHillMap>
    );
}

TripGpxLayerSynthetic.args = { time: 0 };
TripGpxLayerSynthetic.argTypes = {
    time: { control: { type: "range", min: 0, max: 6000000 } },
};
TripGpxLayerSynthetic.tags = ["no-visual-test"];

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

    const layer = new TripGpxLayer({
        ...defaultLayerProps,
        data: DEFAULT_GPX_FILE,
        currentTime: date,
        velocity: velocity,
    }) as unknown as Layer;

    return (
        <GpxHillMap
            gpx={DEFAULT_GPX_FILE}
            annotationLayers={[layer]}
        ></GpxHillMap>
    );
}

TripGpxLayerAnimate.args = { velocity: 10 };
TripGpxLayerAnimate.argTypes = {
    velocity: { control: { type: "range", min: 0, max: 30 } },
};
TripGpxLayerAnimate.tags = ["no-visual-test"];
