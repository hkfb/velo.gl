import { ExtrudedPathLayer } from "../../layers/extruded-path-layer/extruded-path-layer";
import { DeckGL } from "@deck.gl/react";
import * as React from "react";
import type { StoryObj } from "@storybook/react";
import { PathDistancePickingExtension } from "./path-distance-picking-extension";
import * as _ from "lodash";
import { MapViewState, type PickingInfo } from "@deck.gl/core";
import { StreetLayer } from "../../layers/street-layer";
import { SYNTHETIC_DATA } from "../../constant.stories";
import { userEvent, fireEvent } from "@storybook/test";

export default {
    title: "Extensions / Path Distance Picking Extension",
    tags: ["autodocs"],
};

const DEFAULT_PROPS = {
    id: "extruded-path-layer",
    getWidth: 3000,
    extensions: [new PathDistancePickingExtension()],
    pickable: true,
    data: SYNTHETIC_DATA,
};

export const PathDistancePicking: StoryObj = {
    render: () => {
        const layer = new ExtrudedPathLayer({ ...DEFAULT_PROPS });

        const initialViewState: MapViewState = {
            zoom: 8,
            latitude: 62.1,
            longitude: 8.7,
            pitch: 60,
        };

        const getTooltip = React.useCallback(
            ({ coordinate, picked, index }: PickingInfo) => {
                if (!coordinate || _.isEmpty(coordinate) || !picked) {
                    return null;
                }

                const latTrunc = Math.floor(coordinate[1]);
                const lonTrunc = Math.floor(coordinate[0]);

                return {
                    html: `lat: ${latTrunc} lon: ${lonTrunc} distance: ${index}`,
                };
            },
            [],
        );

        const base = new StreetLayer();

        return (
            <DeckGL
                layers={[base, layer]}
                initialViewState={initialViewState}
                controller
                getTooltip={getTooltip}
            ></DeckGL>
        );
    },
    parameters: {
        docs: {
            description: {
                story: "Pick the distance along the path.",
            },
        },
    },
    play: async () => {
        const delay = 500;
        const canvas = document.querySelector("canvas");

        if (!canvas) {
            return;
        }

        await userEvent.click(canvas, { delay });
        await userEvent.hover(canvas, { delay });
        await fireEvent.mouseMove(canvas, {
            clientX: canvas.width / 2,
            clientY: canvas.height / 2,
            delay,
        });
    },
};
