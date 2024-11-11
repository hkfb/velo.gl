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

export const JotunheimenRundt: StoryObj = {
    render: () => {
        const data = JR_ACTIVITY_FILE;
        const layer = new ActivityProfileLayer({ data: data });
        return (
            <DeckGL
                layers={[layer]}
                initialViewState={JR_PITCHED_VIEW_STATE}
                controller
            ></DeckGL>
        );
    },
};

export const JotunheimenRundtWithMap: StoryObj = {
    render: () => {
        const data = JR_ACTIVITY_FILE;
        const profile = new ActivityProfileLayer({ data: data });
        const base = new StreetLayer();
        return (
            <DeckGL
                layers={[base, profile]}
                initialViewState={JR_PITCHED_VIEW_STATE}
                controller
            ></DeckGL>
        );
    },
};

export const Empty: StoryObj = {
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