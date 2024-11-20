import { ProfileLayer } from "./profile-layer";
import { DeckGL } from "@deck.gl/react";
import * as React from "react";
import { Point3d } from "./extrudePolylineProfile";
import type { StoryObj } from "@storybook/react";
import { StreetLayer } from "../street-layer";
import { JR_PITCHED_VIEW_STATE } from "../../constant.stories";

export default {
    title: "Layers / Profile Layer",
};

const INITIAL_VIEW_STATE = {
    ...JR_PITCHED_VIEW_STATE,
    zoom: 7,
};

const POLYLINE = [
    { y: 61.45, x: 7.29, z: 10000 },
    { y: 62.26, x: 8.3, z: 0 },
    { y: 62.17, x: 8.51, z: 7000 },
    { y: 61.1, x: 9.51, z: 8000 },
];

const PATH_LAT_LONG: Point3d[] = POLYLINE.map(({ x, y, z }) => [x, y, z]);

export const ProfileLayerDefault: StoryObj = {
    render: () => {
        const data = [PATH_LAT_LONG];

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
                initialViewState={INITIAL_VIEW_STATE}
                controller
            ></DeckGL>
        );
    },
};

export const ProfileLayerWithMap: StoryObj = {
    render: () => {
        const data = [PATH_LAT_LONG];

        const props = {
            data,
            id: "profile",
            pickable: true,
            width: 3000,
        };

        const profile = new ProfileLayer({ ...props });
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

export const ZeroLengthSegment: StoryObj = {
    render: () => {
        const path = [
            [7.29, 61.45, 10000],
            [8.3, 62.26, 0],
            [8.3, 62.26, 0],
            [8.51, 62.17, 7000],
            [9.51, 61.1, 8000],
        ];

        const data = [path];

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
};
