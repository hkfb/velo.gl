import { ProfileLayer, type ProfileLayerProps } from "./profile-layer";
import { DeckGL } from "@deck.gl/react";
import * as React from "react";
import type { StoryObj } from "@storybook/react";
import { StreetLayer } from "../street-layer";
import { SYNTHETIC_PATH, SYNTHETIC_VIEW_STATE } from "../../constant.stories";
import { getRgba } from "../../util.stories";
import { createGradientTexture } from "../../util.stories";

export default {
    title: "Layers / Profile Layer",
    tags: ["autodocs"],
};

export const ProfileLayerDefault: StoryObj = {
    render: () => {
        const props = {
            data: [SYNTHETIC_PATH],
            id: "profile",
            pickable: true,
            width: 3000,
        };

        const layer = new ProfileLayer({ ...props });

        return (
            <DeckGL
                layers={[layer]}
                initialViewState={SYNTHETIC_VIEW_STATE}
                controller
            ></DeckGL>
        );
    },
};

export const ProfileLayerWithMap: StoryObj = {
    render: () => {
        const props = {
            data: [SYNTHETIC_PATH],
            id: "profile",
            pickable: true,
            width: 3000,
        };

        const profile = new ProfileLayer({ ...props });
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

        const data = React.useMemo(() => [path], []);

        const props = {
            data,
            id: "profile",
            pickable: true,
            width: 3000,
        };

        const layer = new ProfileLayer({ ...props });

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

export const VerticalScale: StoryObj<{ verticalScale: number }> = {
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
        const getScale: [number, number, number] = [1, 1, verticalScale];

        const props = {
            data: [SYNTHETIC_PATH],
            id: "profile",
            pickable: true,
            width: 3000,
            getScale,
        };

        const profile = new ProfileLayer({ ...props });

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
            data: [SYNTHETIC_PATH],
            id: "profile",
            width: 3000,
            getColor,
        };

        const profile = new ProfileLayer({ ...props });

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
            data: [SYNTHETIC_PATH],
            id: "profile",
            width,
        };

        const profile = new ProfileLayer({ ...props });

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

export const PhongShading: StoryObj<
    { color: string } & Pick<ProfileLayerProps, "phongShading" | "material">
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
        const getColor = getRgba(color);

        const props = {
            data: [SYNTHETIC_PATH],
            id: "profile",
            width: 3000,
            getColor,
            phongShading,
            material,
        };

        const profile = new ProfileLayer({ ...props });

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

export const ProfileTexture: StoryObj = {
    render: () => {
        const texture = createGradientTexture();

        const props = {
            data: [SYNTHETIC_PATH],
            id: "profile",
            pickable: true,
            width: 3000,
            texture,
        };

        const layer = new ProfileLayer({ ...props });

        return (
            <DeckGL
                layers={[layer]}
                initialViewState={SYNTHETIC_VIEW_STATE}
                controller
            ></DeckGL>
        );
    },
};
