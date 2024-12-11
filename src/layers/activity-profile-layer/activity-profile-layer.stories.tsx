import type { StoryObj } from "@storybook/react";
import {
    ActivityProfileLayer,
    ActivityProfileLayerProps,
} from "./activity-profile-layer";
import { DeckGL } from "@deck.gl/react";
import * as React from "react";
import {
    JR_ACTIVITY_FILE,
    JR_PITCHED_VIEW_STATE,
} from "../../constant.stories";
import { StreetLayer } from "../street-layer";
import * as d3 from "d3-color";
import { Color } from "@deck.gl/core";

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
    tags: ["no-test-webkit"],
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
    tags: ["no-test-webkit"],
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

export const VerticalScale: StoryObj<{ verticalScale: number }> = {
    args: {
        verticalScale: 20,
    },
    argTypes: {
        verticalScale: {
            control: {
                type: "range",
                min: -1,
                max: 50,
                step: 0.1,
            },
        },
    },
    render: ({ verticalScale }) => {
        const data = JR_ACTIVITY_FILE;

        const getScale: [number, number, number] = [1, 1, verticalScale];

        const props = {
            data,
            id: "profile",
            width: 100,
            getScale,
        };

        const profile = new ActivityProfileLayer({ ...props });
        const base = new StreetLayer();

        return (
            <DeckGL
                layers={[base, profile]}
                initialViewState={JR_PITCHED_VIEW_STATE}
                controller
            ></DeckGL>
        );
    },
    parameters: {
        docs: {
            description: {
                story: "Vertical scaling of profiles.",
            },
        },
    },
};

export const ActivityColor: StoryObj<{ color: string }> = {
    args: {
        color: "yellow",
    },
    argTypes: {
        color: {
            control: {
                type: "color",
            },
        },
    },
    render: ({ color }) => {
        const data = JR_ACTIVITY_FILE;

        const { r, g, b, opacity } = d3.color(color)?.rgb() ?? {
            r: 0,
            g: 0,
            b: 0,
            opacity: 1,
        };

        const getColor: Color = [r, g, b, opacity * 255];

        const props = {
            data,
            id: "profile",
            width: 100,
            getColor,
        };

        const profile = new ActivityProfileLayer({ ...props });
        const base = new StreetLayer();

        return (
            <DeckGL
                layers={[base, profile]}
                initialViewState={JR_PITCHED_VIEW_STATE}
                controller
            ></DeckGL>
        );
    },
    parameters: {
        docs: {
            description: {
                story: "Profile coloring.",
            },
        },
    },
};

export const ProfileWidth: StoryObj<{ width: number }> = {
    args: {
        width: 1000,
    },
    argTypes: {
        width: {
            control: {
                type: "range",
                min: -1,
                max: 5000,
                step: 1,
            },
        },
    },
    render: ({ width }) => {
        const data = JR_ACTIVITY_FILE;

        const props = {
            data,
            id: "profile",
            width,
        };

        const profile = new ActivityProfileLayer({ ...props });
        const base = new StreetLayer();

        return (
            <DeckGL
                layers={[base, profile]}
                initialViewState={JR_PITCHED_VIEW_STATE}
                controller
            ></DeckGL>
        );
    },
    parameters: {
        docs: {
            description: {
                story: "Adjusting lateral width of profiles.",
            },
        },
    },
};

export const PhongShading: StoryObj<
    {
        color: string;
        verticalScale: number;
        width: number;
    } & ActivityProfileLayerProps
> = {
    args: {
        color: "yellow",
        phongShading: true,
        material: {
            ambient: 0.7,
            diffuse: 0.4,
            shininess: 10,
        },
        verticalScale: 2,
        width: 500,
    },
    argTypes: {
        color: {
            control: {
                type: "color",
            },
        },
        verticalScale: {
            control: {
                type: "range",
                min: -1,
                max: 10,
                step: 0.1,
            },
        },
        width: {
            control: {
                type: "range",
                min: -1,
                max: 10000,
                step: 1,
            },
        },
    },
    render: ({ color, phongShading, material, verticalScale, width }) => {
        const data = JR_ACTIVITY_FILE;

        const { r, g, b, opacity } = d3.color(color)?.rgb() ?? {
            r: 0,
            g: 0,
            b: 0,
            opacity: 1,
        };

        const getColor: Color = [r, g, b, opacity * 255];

        const getScale: [number, number, number] = [1, 1, verticalScale];

        const props = {
            data,
            id: "profile",
            getColor,
            phongShading,
            material,
            getScale,
            width,
        };

        const profile = new ActivityProfileLayer({ ...props });
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
