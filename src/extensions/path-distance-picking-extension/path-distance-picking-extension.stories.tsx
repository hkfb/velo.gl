import { ExtrudedPathLayer } from "../../layers/extruded-path-layer/extruded-path-layer";
import { DeckGL } from "@deck.gl/react";
import * as React from "react";
import type { StoryObj } from "@storybook/react";
import { SYNTHETIC_DATA, SYNTHETIC_VIEW_STATE } from "../../constant.stories";
import { PathDistancePickingExtension } from "./path-distance-picking-extension";
//import { PathTextureExtension } from "./path-texture-extension";
import { createGradientTexture } from "../../util.stories";
import * as _ from "lodash";
import { type PickingInfo } from "@deck.gl/core";

export default {
    title: "Extensions / Path Distance Picking Extension",
    tags: ["autodocs"],
};

const DEFAULT_PROPS = {
    data: SYNTHETIC_DATA,
    id: "extruded-path-layer",
    getWidth: 3000,
    extensions: [new PathDistancePickingExtension()],
    pickable: true,
};

export const PathDistancePicking: StoryObj = {
    render: () => {
        const layer = new ExtrudedPathLayer({ ...DEFAULT_PROPS });

        const getTooltip = React.useCallback(
            ({ coordinate, picked, color, ...args }: PickingInfo) => {
                if (!coordinate || _.isEmpty(coordinate) || !picked) {
                    return null;
                }
                //console.log(args.index, color);
                const distance = color[0] + (color[1] << 8) + (color[2] << 16);
                console.log(distance, args.index);
                return {
                    html: `lat: ${coordinate[1]}, lon: ${coordinate[0]}`,
                };
            },
            [],
        );

        return (
            <DeckGL
                layers={[layer]}
                initialViewState={SYNTHETIC_VIEW_STATE}
                controller
                getTooltip={getTooltip}
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
