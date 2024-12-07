import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ActivityMap, DEFAULT_GPX_FILE } from "./activity-map";
import { TripGpxLayer } from "../layers/trip-gpx-layer";
import { Layer } from "@deck.gl/core";
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

export const ProfileConfig: Story = {
    args: {
        profileConfig: {
            getScale: [1, 1, 20],
            width: 1000,
            getColor: [0, 100, 255, 200],
        },
        initialViewState: JR_PITCHED_VIEW_STATE,
    },
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
