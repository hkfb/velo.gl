import {
    SideProfileLayer,
    type SideProfileLayerProps,
} from "./side-profile-layer";
import { DeckGL } from "@deck.gl/react";
import { Color } from "@deck.gl/core";
import * as React from "react";
import { Point3d } from "../../profile-layer/extrudePolylineProfile";
import type { StoryObj } from "@storybook/react";
import { StreetLayer } from "../../street-layer";
import { SYNTHETIC_VIEW_STATE } from "../../../constant.stories";
import * as d3 from "d3-color";
import { createGradientTexture } from "../../../util.stories";

export default {
    title: "Layers / Side Profile Layer",
    tags: ["autodocs"],
};

const POLYLINE = [
    { y: 61.45, x: 7.29, z: 10000 },
    { y: 62.26, x: 8.3, z: 0 },
    { y: 62.17, x: 8.51, z: 7000 },
    { y: 61.1, x: 9.51, z: 8000 },
];

const PATH_LAT_LONG: Point3d[] = POLYLINE.map(({ x, y, z }) => [x, y, z]);

export const SideProfileLayerDefault: StoryObj = {
    render: () => {
        const data = React.useMemo(() => [PATH_LAT_LONG], []);

        const props = {
            data,
            id: "profile",
            pickable: true,
            width: 3000,
        };

        const layer = new SideProfileLayer({ ...props });

        return (
            <DeckGL
                layers={[layer]}
                initialViewState={SYNTHETIC_VIEW_STATE}
                controller
            ></DeckGL>
        );
    },
};

export const SideProfileLayerWithMap: StoryObj = {
    render: () => {
        const data = React.useMemo(() => [PATH_LAT_LONG], []);

        const props = {
            data,
            id: "profile",
            pickable: true,
            width: 3000,
        };

        const profile = new SideProfileLayer({ ...props });
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

export const SideProfileZeroLengthSegment: StoryObj = {
    render: () => {
        const path = [
            [7.29, 61.45, 10000],
            [8.3, 62.26, 0],
            [8.3, 62.26, 0],
            [8.51, 62.17, 7000],
            [9.51, 61.1, 8000],
        ];

        const data = React.useMemo(() => [path], []);

        const props = {
            data,
            id: "profile",
            pickable: true,
            width: 3000,
        };

        const layer = new SideProfileLayer({ ...props });

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

export const SideProfileVerticalScale: StoryObj<{ verticalScale: number }> = {
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
        const data = React.useMemo(() => [PATH_LAT_LONG], []);

        const getScale: [number, number, number] = [1, 1, verticalScale];

        const props = {
            data,
            id: "profile",
            pickable: true,
            width: 3000,
            getScale,
        };

        const profile = new SideProfileLayer({ ...props });

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

export const SideProfileColor: StoryObj<{ color: string }> = {
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
        const data = React.useMemo(() => [PATH_LAT_LONG], []);

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
            width: 3000,
            getColor,
        };

        const profile = new SideProfileLayer({ ...props });

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

export const SideProfileWidth: StoryObj<{ width: number }> = {
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
        const data = React.useMemo(() => [PATH_LAT_LONG], []);

        const props = {
            data,
            id: "profile",
            width,
        };

        const profile = new SideProfileLayer({ ...props });

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

export const SideProfilePhongShading: StoryObj<
    { color: string } & Pick<SideProfileLayerProps, "phongShading" | "material">
> = {
    args: {
        color: "lightgreen",
        phongShading: true,
        material: {
            ambient: 0.7,
            diffuse: 0.4,
            shininess: 10,
        },
    },
    argTypes: {
        color: {
            control: {
                type: "color",
            },
        },
    },
    render: ({ color, phongShading, material }) => {
        const data = React.useMemo(() => [PATH_LAT_LONG], []);

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
            width: 3000,
            getColor,
            phongShading,
            material,
        };

        const profile = new SideProfileLayer({ ...props });

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
};

export const SideProfileTexture: StoryObj = {
    render: () => {
        const data = React.useMemo(() => [PATH_LAT_LONG], []);

        const texture = createGradientTexture();

        const props = {
            data,
            id: "profile",
            pickable: true,
            width: 3000,
            texture,
        };

        const layer = new SideProfileLayer({ ...props });

        return (
            <DeckGL
                layers={[layer]}
                initialViewState={SYNTHETIC_VIEW_STATE}
                controller
            ></DeckGL>
        );
    },
};
