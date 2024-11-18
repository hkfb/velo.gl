import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ActivityMap, DEFAULT_GPX_FILE } from "./activity-map";
import { TripGpxLayer } from "../layers/trip-gpx-layer";
import { Layer } from "@deck.gl/core";

const meta: Meta<typeof ActivityMap> = {
    title: "GPX Map",
    tags: ["autodocs"],
    component: ActivityMap,
};

export default meta;

type Story = StoryObj<typeof ActivityMap>;

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

export function ActivityMapText() {
    return (
        <ActivityMap>
            <div>Text</div>
        </ActivityMap>
    );
}

export const AnnotationLayer: Story = {
    render: () => {
        const annotationLayers = [
            new TripGpxLayer({
                id: "trip",
                data: DEFAULT_GPX_FILE,
            }) as unknown as Layer,
        ];
        return <ActivityMap annotationLayers={annotationLayers} />;
    },
};
