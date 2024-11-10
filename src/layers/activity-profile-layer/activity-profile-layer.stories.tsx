import type { StoryObj } from "@storybook/react";
import { ActivityProfileLayer } from "./activity-profile-layer";
import { DeckGL } from "@deck.gl/react";
import * as React from "react";
import {
    JR_ACTIVITY_FILE,
    JR_PITCHED_VIEW_STATE,
} from "../../constant.stories";
import { StreetLayer } from "../street-layer";

export default {
    title: "Layers / Activity Profile Layer",
    tags: ["autodocs"],
    parameters: {
        docs: {
            story: {
                height: "600px",
            },
        },
    },
};

const testViewState = {
    longitude: 7.505,
    latitude: 61.064,
    zoom: 10,
};

export const ActivityProfileLayerDefault: StoryObj = {
    render: () => {
        const layer = new ActivityProfileLayer();
        return (
            <DeckGL
                layers={[layer]}
                initialViewState={JR_PITCHED_VIEW_STATE}
                controller
            ></DeckGL>
        );
    },
};

export const JotunheimenRundt: StoryObj = {
    render: () => {
        const data = JR_ACTIVITY_FILE;
        const layer = new ActivityProfileLayer({ data: data, width: 100 });
        //const layer = new ActivityProfileLayer({ data: [] });
        return (
            <DeckGL
                layers={[layer]}
                initialViewState={testViewState}
                controller
            ></DeckGL>
        );
    },
};

export const JotunheimenRundtWithMap: StoryObj = {
    render: () => {
        const data = JR_ACTIVITY_FILE;
        const profile = new ActivityProfileLayer({ data: data, width: 100 });
        const base = new StreetLayer();
        return (
            <DeckGL
                layers={[base, profile]}
                initialViewState={testViewState}
                controller
            ></DeckGL>
        );
    },
};
