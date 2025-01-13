import {
    ExtrudedPathLayer,
    type ExtrudedPathLayerProps,
} from "../../layers/extruded-path-layer/extruded-path-layer";
import { DeckGL } from "@deck.gl/react";
import * as React from "react";
import type { StoryObj } from "@storybook/react";
import { StreetLayer } from "../../layers/street-layer";
import { SYNTHETIC_DATA, SYNTHETIC_VIEW_STATE } from "../../constant.stories";
import { Matrix4 } from "@math.gl/core";
import { PathTextureExtension } from "./path-texture-extension";
import { createGradientTexture } from "../../util.stories";
import { PathLayer } from "@deck.gl/layers";

export default {
    title: "Extensions / Path Texture Extension",
    tags: ["autodocs"],
};

const DEFAULT_PROPS = {
    data: SYNTHETIC_DATA,
    id: "extruded-path-layer",
    getWidth: 3000,
    extensions: [new PathTextureExtension()],
    texture: createGradientTexture(),
};

export const UndefinedTexture: StoryObj = {
    render: () => {
        const layerProps = {
            ...DEFAULT_PROPS,
            texture: undefined,
        };
        const layer = new ExtrudedPathLayer({ ...layerProps });

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
                story: "Show the effect of an undefined texture (default).",
            },
        },
    },
};

export const PathLayerTexture: StoryObj = {
    render: () => {
        const profile = new PathLayer({ ...DEFAULT_PROPS });

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
                story: "Apply the Texture Extension to PathLayer.",
            },
        },
    },
};

export const ExtrudedPath: StoryObj = {
    render: () => {
        const profile = new ExtrudedPathLayer({ ...DEFAULT_PROPS });

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
                story: "Apply the Texture Extension to ExtrudedPathLayer.",
            },
        },
    },
};

export const WithMap: StoryObj = {
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
};

export const VerticalScale: StoryObj<
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

        const props = {
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
