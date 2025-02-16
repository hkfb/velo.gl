import {
    TopProfileLayer,
    type TopProfileLayerProps,
} from "./top-profile-layer";
import { SideProfileLayer } from "../side-profile-layer/side-profile-layer";
import { DeckGL } from "@deck.gl/react";
import { Color } from "@deck.gl/core";
import * as React from "react";
import { Point3d } from "../../profile-layer/extrudePolylineProfile";
import type { StoryObj } from "@storybook/react";
import { StreetLayer } from "../../street-layer";
import { JR_PITCHED_VIEW_STATE } from "../../../constant.stories";
import * as d3 from "d3-color";
import { type TextureProps } from "@luma.gl/core";

export default {
    title: "Layers / Top Profile Layer",
    tags: ["autodocs"],
    parameters: {
        docs: {
            story: {
                height: "500px",
            },
        },
    },
};

const INITIAL_VIEW_STATE = {
    ...JR_PITCHED_VIEW_STATE,
    zoom: 7,
};

const POLYLINE = [
    { y: 61.45, x: 7.29, z: 10000 },
    { y: 61.76, x: 7.3, z: 7000 },
    { y: 62.26, x: 8.3, z: 0 },
    { y: 62.17, x: 8.51, z: 7000 },
    { y: 62.07, x: 8.71, z: 6500 },
    { y: 61.1, x: 9.51, z: 8000 },
];

const PATH_LAT_LONG: Point3d[] = POLYLINE.map(({ x, y, z }) => [x, y, z]);

function defaultColorScale(t: number): [number, number, number, number] {
    // Map t in [0, 1] to a color
    const r = (Math.trunc(t * 8) * 255) / 8;
    const g = (r + 100) % 255;
    const b = 255 - r;
    const a = 255;
    return [r, g, b, a];
}

function createGradientTexture(
    colorScale: (
        t: number,
    ) => [number, number, number, number] = defaultColorScale,
    size = 256,
): TextureProps {
    const data = new Uint8Array(size * 4); // RGBA for each pixel

    for (let i = 0; i < size; i++) {
        const t = i / (size - 1);
        const [r, g, b, a] = colorScale(t);
        data[i * 4 + 0] = r;
        data[i * 4 + 1] = g;
        data[i * 4 + 2] = b;
        data[i * 4 + 3] = a;
    }

    const textureParams: TextureProps = {
        width: 1,
        height: size,
        data,
    };

    return textureParams;
}

export const TopProfileLayerDefault: StoryObj = {
    render: () => {
        const data = React.useMemo(() => [PATH_LAT_LONG], []);

        const props = {
            data,
            id: "profile",
            pickable: true,
            width: 3000,
        };

        const layer = new TopProfileLayer({ ...props });

        return (
            <DeckGL
                layers={[layer]}
                initialViewState={INITIAL_VIEW_STATE}
                controller
            ></DeckGL>
        );
    },
};

export const TopProfileLayerWithMap: StoryObj = {
    render: () => {
        const data = React.useMemo(() => [PATH_LAT_LONG], []);

        const props = {
            data,
            id: "profile",
            pickable: true,
            width: 3000,
        };

        const profile = new TopProfileLayer({ ...props });
        const base = new StreetLayer();

        return (
            <DeckGL
                layers={[base, profile]}
                initialViewState={INITIAL_VIEW_STATE}
                controller
            ></DeckGL>
        );
    },
};

export const TopProfileZeroLengthSegment: StoryObj = {
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

        const layer = new TopProfileLayer({ ...props });

        return (
            <DeckGL
                layers={[layer]}
                initialViewState={INITIAL_VIEW_STATE}
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

export const TopProfileVerticalScale: StoryObj<{ verticalScale: number }> = {
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

        const profile = new TopProfileLayer({ ...props });

        return (
            <DeckGL
                layers={[profile]}
                initialViewState={INITIAL_VIEW_STATE}
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

export const TopProfileColor: StoryObj<{ color: string }> = {
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

        const profile = new TopProfileLayer({ ...props });

        return (
            <DeckGL
                layers={[profile]}
                initialViewState={INITIAL_VIEW_STATE}
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

export const TopProfileWidth: StoryObj<{ width: number }> = {
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

        const profile = new TopProfileLayer({ ...props });

        return (
            <DeckGL
                layers={[profile]}
                initialViewState={INITIAL_VIEW_STATE}
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

export const TopProfilePhongShading: StoryObj<
    { color: string } & Pick<TopProfileLayerProps, "phongShading" | "material">
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

        const profile = new TopProfileLayer({ ...props });

        return (
            <DeckGL
                layers={[profile]}
                initialViewState={INITIAL_VIEW_STATE}
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

export const TopProfileTexture: StoryObj = {
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

        const layer = new TopProfileLayer({ ...props });

        return (
            <DeckGL
                layers={[layer]}
                initialViewState={INITIAL_VIEW_STATE}
                controller
            ></DeckGL>
        );
    },
};

export const WithSideFaces: StoryObj<TopProfileLayerProps> = {
    args: {
        phongShading: true,
    },
    render: ({ phongShading }) => {
        const data = React.useMemo(() => [PATH_LAT_LONG], []);

        const texture = createGradientTexture();

        const props = {
            data,
            id: "profile",
            pickable: true,
            width: 3000,
            texture,
            phongShading,
        };

        const topLayer = new TopProfileLayer({ ...props });
        const sideLayer = new SideProfileLayer({ ...props });

        return (
            <DeckGL
                layers={[topLayer, sideLayer]}
                initialViewState={INITIAL_VIEW_STATE}
                controller
            ></DeckGL>
        );
    },
};
