import { ExtrudedPathLayer } from "../../layers/extruded-path-layer/extruded-path-layer";
import { DeckGL } from "@deck.gl/react";
import * as React from "react";
import type { StoryObj } from "@storybook/react";
import { SYNTHETIC_DATA, SYNTHETIC_VIEW_STATE } from "../../constant.stories";
import { PathDistancePickingExtension } from "./path-distance-picking-extension";
//import { PathTextureExtension } from "./path-texture-extension";
//import { createGradientTexture } from "../../util.stories";
import * as _ from "lodash";
import { type PickingInfo } from "@deck.gl/core";
import { StreetLayer } from "../../layers/street-layer";

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

                const latTrunc = Math.floor(coordinate[1]);
                const lonTrunc = Math.floor(coordinate[0]);
                console.log(distance, args.index, color);
                return {
                    //html: `lat: ${latTrunc} lon: ${lonTrunc} distance: ${args.index}`,
                    html: `distance: ${args.index} rgb: ${color} d: ${distance}`,
                };
            },
            [],
        );

        const base = new StreetLayer();

        return (
            <DeckGL
                layers={[base, layer]}
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
