import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { GpxMap, DEFAULT_GPX_FILE } from "./gpx-map";
import { TripGpxLayer } from "../layers/trip-gpx-layer";

const meta: Meta<typeof GpxMap> = {
    title: "GPX Map",
    tags: ["autodocs"],
    component: GpxMap,
};

export default meta;

type Story = StoryObj<typeof GpxMap>;

export const Default: Story = {};

export const ElTeide: Story = {
    args: {
        initialViewState: {
            latitude: 28.2,
            longitude: -16.6,
            zoom: 10,
        },

        gpx: "Teide.tcx",
    },
};

export function GpxMapText() {
    return (
        <GpxMap>
            <div>Text</div>
        </GpxMap>
    );
}

export const AnnotationLayer: Story = {
    render: () => {
        const annotationLayers = [
            new TripGpxLayer({ id: "trip", data: DEFAULT_GPX_FILE }),
        ];
        return <GpxMap annotationLayers={annotationLayers} />;
    },
};
