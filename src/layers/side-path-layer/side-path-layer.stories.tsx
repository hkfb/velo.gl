import { SidePathLayer, type SidePathLayerProps } from "./side-path-layer";
import { DeckGL } from "@deck.gl/react";
import { Color } from "@deck.gl/core";
import * as React from "react";
import { Point3d } from "../profile-layer/extrudePolylineProfile";
import type { StoryObj } from "@storybook/react";
import { StreetLayer } from "../street-layer";
import { SYNTHETIC_VIEW_STATE } from "../../constant.stories";
import * as d3 from "d3-color";
import { PathGeometry } from "@deck.gl/layers/dist/path-layer/path";
import { Matrix4 } from "@math.gl/core";

export default {
    title: "Layers / Side Path Layer",
    tags: ["autodocs"],
    parameters: {
        docs: {
            story: {
                height: "500px",
            },
        },
    },
};

const POLYLINE = [
    { y: 61.45, x: 7.29, z: 10000 },
    { y: 62.26, x: 8.3, z: 0 },
    { y: 62.17, x: 8.51, z: 7000 },
    { y: 61.1, x: 9.51, z: 8000 },
    { y: 61.0, x: 8.51, z: 8000 },
    { y: 61.1, x: 8.71, z: 1000 },
];

const PATH_LAT_LONG: Point3d[] = POLYLINE.map(({ x, y, z }) => [x, y, z]);

const DATA = [
    {
        path: PATH_LAT_LONG as PathGeometry,
    },
];

const DEFAULT_PROPS = {
    data: DATA,
    id: "side-path-layer",
    getWidth: 3000,
};

export const SidePathLayerDefault: StoryObj = {
    render: () => {
        const layer = new SidePathLayer({ ...DEFAULT_PROPS });

        return (
            <DeckGL
                layers={[layer]}
                initialViewState={SYNTHETIC_VIEW_STATE}
                controller
            ></DeckGL>
        );
    },
};

export const SidePathLayerWithMap: StoryObj = {
    render: () => {
        const profile = new SidePathLayer({ ...DEFAULT_PROPS });
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

        const layer = new SidePathLayer({ ...props });

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

export const SidePathLayerVerticalScale: StoryObj<
    SidePathLayerProps<unknown> & { verticalScale: number }
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

        const props: SidePathLayerProps<unknown> = {
            ...DEFAULT_PROPS,
            modelMatrix,
        };

        const profile = new SidePathLayer({ ...props });

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
        const { r, g, b, opacity } = d3.color(color)?.rgb() ?? {
            r: 0,
            g: 0,
            b: 0,
            opacity: 1,
        };

        const getColor: Color = [r, g, b, opacity * 255];

        const props = {
            ...DEFAULT_PROPS,
            getColor,
        };

        const profile = new SidePathLayer({ ...props });

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

        const profile = new SidePathLayer({ ...props });

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
