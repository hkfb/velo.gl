import {
    ExtrudedPathLayer,
    type ExtrudedPathLayerProps,
} from "./extruded-path-layer";
import { DeckGL } from "@deck.gl/react";
import * as React from "react";
import type { StoryObj } from "@storybook/react";
import { StreetLayer } from "../street-layer";
import { SYNTHETIC_VIEW_STATE, SYNTHETIC_DATA } from "../../constant.stories";
import { Matrix4 } from "@math.gl/core";
import { getRgba } from "../../util.stories";

export default {
    title: "Layers / Extruded Path Layer",
    tags: ["autodocs"],
};

const DEFAULT_PROPS = {
    data: SYNTHETIC_DATA,
    id: "extruded-path-layer",
    getWidth: 3000,
};

export const ExtrudedPathLayerDefault: StoryObj = {
    render: () => {
        const layer = new ExtrudedPathLayer({ ...DEFAULT_PROPS });

        return (
            <DeckGL
                layers={[layer]}
                initialViewState={SYNTHETIC_VIEW_STATE}
                controller
            ></DeckGL>
        );
    },
};

export const ExtrudedPathLayerWithMap: StoryObj = {
    render: () => {
        const profile = new ExtrudedPathLayer({ ...DEFAULT_PROPS });
        const base = new StreetLayer();

        return (
            <DeckGL
                layers={[base, profile]}
                initialViewState={SYNTHETIC_VIEW_STATE}
                controller
            ></DeckGL>
        );
    },
};

export const ZeroLengthSegment: StoryObj = {
    render: () => {
        const path = [
            [7.29, 61.45, 10000],
            [8.3, 62.26, 0],
            [8.3, 62.26, 0],
            [8.51, 62.17, 7000],
            [9.51, 61.1, 8000],
        ];

        const data = [{ path }];

        const props = {
            ...DEFAULT_PROPS,
            data,
        };

        const layer = new ExtrudedPathLayer({ ...props });

        return (
            <DeckGL
                layers={[layer]}
                initialViewState={SYNTHETIC_VIEW_STATE}
                controller
            ></DeckGL>
        );
    },
    parameters: {
        docs: {
            description: {
                story: "Handle zero length segments.",
            },
        },
    },
    tags: ["no-test-webkit"],
};

export const ExtrudedPathLayerVerticalScale: StoryObj<
    ExtrudedPathLayerProps<unknown> & { verticalScale: number }
> = {
    args: {
        verticalScale: 5,
    },
    argTypes: {
        verticalScale: {
            control: {
                type: "range",
                min: -1,
                max: 10,
                step: 0.1,
            },
        },
    },
    render: ({ verticalScale }) => {
        const modelMatrix = new Matrix4();
        modelMatrix.scale([1, 1, verticalScale]);

        const props: ExtrudedPathLayerProps<unknown> = {
            ...DEFAULT_PROPS,
            modelMatrix,
        };

        const profile = new ExtrudedPathLayer({ ...props });

        return (
            <DeckGL
                layers={[profile]}
                initialViewState={SYNTHETIC_VIEW_STATE}
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
    tags: ["no-test-webkit"],
};

export const ProfileColor: StoryObj<{ color: string }> = {
    args: {
        color: "green",
    },
    argTypes: {
        color: {
            control: {
                type: "color",
            },
        },
    },
    render: ({ color }) => {
        const getColor = getRgba(color);

        const props = {
            ...DEFAULT_PROPS,
            getColor,
        };

        const profile = new ExtrudedPathLayer({ ...props });

        return (
            <DeckGL
                layers={[profile]}
                initialViewState={SYNTHETIC_VIEW_STATE}
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
    tags: ["no-test-webkit"],
};

export const SideColor: StoryObj<{ mainColor: string; sideColor: string }> = {
    args: {
        mainColor: "yellow",
        sideColor: "gray",
    },

    render: ({ mainColor, sideColor }) => {
        const getColor = getRgba(mainColor);
        const getSideColor = getRgba(sideColor);

        const props: ExtrudedPathLayerProps<unknown> = {
            ...DEFAULT_PROPS,
            getColor,
            getSideColor,
        };

        const profile = new ExtrudedPathLayer({ ...props });

        return (
            <DeckGL
                layers={[profile]}
                initialViewState={SYNTHETIC_VIEW_STATE}
                controller
            ></DeckGL>
        );
    },
    parameters: {
        docs: {
            description: {
                story: "Control top and side color.",
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
                max: 10000,
                step: 1,
            },
        },
    },
    render: ({ width }) => {
        const props = {
            ...DEFAULT_PROPS,
            getWidth: width,
        };

        const profile = new ExtrudedPathLayer({ ...props });

        return (
            <DeckGL
                layers={[profile]}
                initialViewState={SYNTHETIC_VIEW_STATE}
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
