import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ActivityMap, DEFAULT_GPX_FILE } from "./activity-map";
import { TripGpxLayer } from "../layers/trip-gpx-layer";
import { JR_PITCHED_VIEW_STATE } from "../constant.stories";

const meta: Meta<typeof ActivityMap> = {
    tags: ["autodocs"],
    component: ActivityMap,
    parameters: {
        docs: {
            story: {
                height: "700px",
            },
        },
    },
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
    tags: ["no-test-webkit"],
};

export const ActivityMapText: Story = {
    render: () => {
        return (
            <ActivityMap>
                <div>Text</div>
            </ActivityMap>
        );
    },
    tags: ["no-test-webkit"],
};

export const AnnotationLayer: Story = {
    render: () => {
        const annotationLayers = [
            new TripGpxLayer({
                id: "trip",
                data: DEFAULT_GPX_FILE,
            }),
        ];
        return <ActivityMap annotationLayers={annotationLayers} />;
    },
    tags: ["no-test-webkit"],
};

export const ProfileConfig: Story = {
    args: {
        profileConfig: {
            getScale: [1, 1, 20],
            width: 1000,
            getColor: [0, 100, 255, 200],
        },
        initialViewState: JR_PITCHED_VIEW_STATE,
    },
    tags: ["no-test-webkit"],
};

export const DisableController: Story = {
    args: {
        deckGlProps: {
            controller: false,
        },
        initialViewState: JR_PITCHED_VIEW_STATE,
    },
    parameters: {
        docs: {
            description: {
                story: "Disable camera interaction.",
            },
        },
    },
    tags: ["no-test-webkit"],
};

export const OverrideController: Story = {
    args: {
        deckGlProps: {
            controller: {
                dragMode: "rotate",
            },
        },
        initialViewState: JR_PITCHED_VIEW_STATE,
    },
    parameters: {
        docs: {
            description: {
                story: "Override default camera interaction.",
            },
        },
    },
};
