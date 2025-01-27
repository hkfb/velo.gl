import { ExtrudedPathLayer } from "../../layers/extruded-path-layer/extruded-path-layer";
import { DeckGL } from "@deck.gl/react";
import * as React from "react";
import type { StoryObj } from "@storybook/react";
import { PathDistancePickingExtension } from "./path-distance-picking-extension";
import * as _ from "lodash";
import { MapViewState, type PickingInfo } from "@deck.gl/core";
import { StreetLayer } from "../../layers/street-layer";

export default {
    title: "Extensions / Path Distance Picking Extension",
    tags: ["autodocs"],
};

const DEFAULT_PROPS = {
    id: "extruded-path-layer",
    getWidth: 10,
    extensions: [new PathDistancePickingExtension()],
    pickable: true,
};

export const PathDistancePicking: StoryObj = {
    render: () => {
        const path = [
            [7.291, 61.411, 50],
            [7.29, 61.411, 50],
            [7.288, 61.411, 110],
            [7.287, 61.412, 250],
            [7.285, 61.413, 200],
            [7.284, 61.413, 200],
            [7.283, 61.413, 100],
        ];

        const layerProps = {
            ...DEFAULT_PROPS,
            data: [
                {
                    path,
                },
            ],
        };

        const initialViewState: MapViewState = {
            longitude: 7.287,
            latitude: 61.412,
            zoom: 15,
            pitch: 45,
        };

        const layer = new ExtrudedPathLayer({ ...layerProps });

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
                story: "Pick the distance along the path. Does not work for segments longer than 255 meters.",
            },
        },
    },
};
