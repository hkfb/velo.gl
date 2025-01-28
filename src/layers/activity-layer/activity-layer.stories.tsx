import type { StoryObj } from "@storybook/react";
import { ActivityLayer, ActivityLayerProps } from "./activity-layer";
import { DeckGL } from "@deck.gl/react";
import * as React from "react";
import {
    JR_ACTIVITY_FILE,
    JR_PITCHED_VIEW_STATE,
} from "../../constant.stories";
import { StreetLayer } from "../street-layer";
import * as d3 from "d3-color";
import { Color, type MapViewState, type PickingInfo } from "@deck.gl/core";
import * as _ from "lodash";
import { userEvent, fireEvent } from "@storybook/test";

export default {
    title: "Layers / Activity Layer",
    tags: ["autodocs"],
    parameters: {
        docs: {
            story: {
                height: "600px",
            },
        },
    },
};

async function uriToBlob(uri: string) {
    try {
        // Fetch the URI content
        const response = await fetch(uri);

        // Ensure the fetch was successful
        if (!response.ok) {
            throw new Error(`Failed to fetch URI: ${response.statusText}`);
        }

        // Convert the response into a Blob
        const blob = await response.blob();
        return blob;
    } catch (error) {
        console.error("Error converting URI to Blob:", error);
        throw error;
    }
}

export const JotunheimenRundtActivity: StoryObj = {
    render: () => {
        const data = JR_ACTIVITY_FILE;
        const layer = new ActivityLayer({ data: data });
        return (
            <DeckGL
                layers={[layer]}
                initialViewState={JR_PITCHED_VIEW_STATE}
                controller
            ></DeckGL>
        );
    },
    tags: ["no-test-webkit"],
};

export const ActivityWithMap: StoryObj = {
    render: () => {
        const data = JR_ACTIVITY_FILE;
        const profile = new ActivityLayer({ data: data });
        const base = new StreetLayer();
        return (
            <DeckGL
                layers={[base, profile]}
                initialViewState={JR_PITCHED_VIEW_STATE}
                controller
            ></DeckGL>
        );
    },
    tags: ["no-test-webkit"],
};

export const EmptyActivity: StoryObj = {
    render: () => {
        const layer = new ActivityLayer();
        return (
            <DeckGL
                layers={[layer]}
                initialViewState={JR_PITCHED_VIEW_STATE}
                controller
            ></DeckGL>
        );
    },
};

export const ActivityVerticalScale: StoryObj<{ verticalScale: number }> = {
    args: {
        verticalScale: 20,
    },
    argTypes: {
        verticalScale: {
            control: {
                type: "range",
                min: -1,
                max: 50,
                step: 0.1,
            },
        },
    },
    render: ({ verticalScale }) => {
        const data = JR_ACTIVITY_FILE;

        const getScale: [number, number, number] = [1, 1, verticalScale];

        const props = {
            data,
            id: "profile",
            width: 100,
            getScale,
        };

        const profile = new ActivityLayer({ ...props });
        const base = new StreetLayer();

        return (
            <DeckGL
                layers={[base, profile]}
                initialViewState={JR_PITCHED_VIEW_STATE}
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

export const SetActivityColor: StoryObj<{ color: string }> = {
    args: {
        color: "yellow",
    },
    argTypes: {
        color: {
            control: {
                type: "color",
            },
        },
    },
    render: ({ color }) => {
        const data = JR_ACTIVITY_FILE;

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
            width: 100,
            getColor,
        };

        const profile = new ActivityLayer({ ...props });
        const base = new StreetLayer();

        return (
            <DeckGL
                layers={[base, profile]}
                initialViewState={JR_PITCHED_VIEW_STATE}
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

export const ProfileWidth: StoryObj<{ width: number }> = {
    args: {
        width: 1000,
    },
    argTypes: {
        width: {
            control: {
                type: "range",
                min: -1,
                max: 5000,
                step: 1,
            },
        },
    },
    render: ({ width }) => {
        const data = JR_ACTIVITY_FILE;

        const props = {
            data,
            id: "profile",
            width,
        };

        const profile = new ActivityLayer({ ...props });
        const base = new StreetLayer();

        return (
            <DeckGL
                layers={[base, profile]}
                initialViewState={JR_PITCHED_VIEW_STATE}
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
    {
        color: string;
        verticalScale: number;
        width: number;
    } & ActivityLayerProps
> = {
    args: {
        color: "yellow",
        phongShading: true,
        material: {
            ambient: 0.7,
            diffuse: 0.4,
            shininess: 10,
        },
        verticalScale: 2,
        width: 500,
    },
    argTypes: {
        color: {
            control: {
                type: "color",
            },
        },
        verticalScale: {
            control: {
                type: "range",
                min: -1,
                max: 10,
                step: 0.1,
            },
        },
        width: {
            control: {
                type: "range",
                min: -1,
                max: 10000,
                step: 1,
            },
        },
    },
    render: ({ color, phongShading, material, verticalScale, width }) => {
        const data = JR_ACTIVITY_FILE;

        const { r, g, b, opacity } = d3.color(color)?.rgb() ?? {
            r: 0,
            g: 0,
            b: 0,
            opacity: 1,
        };

        const getColor: Color = [r, g, b, opacity * 255];

        const getScale: [number, number, number] = [1, 1, verticalScale];

        const props = {
            data,
            id: "profile",
            getColor,
            phongShading,
            material,
            getScale,
            width,
        };

        const profile = new ActivityLayer({ ...props });
        const base = new StreetLayer();

        return (
            <DeckGL
                layers={[base, profile]}
                initialViewState={JR_PITCHED_VIEW_STATE}
                controller
            ></DeckGL>
        );
    },
};

export const UseDataUrl: StoryObj = {
    render: () => {
        const [dataUri, setDataUri] = React.useState<string>();
        React.useEffect(() => {
            const reader = new FileReader();
            reader.addEventListener(
                "load",
                () => {
                    setDataUri(reader.result as string);
                },
                false,
            );
            uriToBlob(JR_ACTIVITY_FILE).then((blob) => {
                reader.readAsDataURL(blob);
            });
        }, []);

        const layer = dataUri ? new ActivityLayer({ data: dataUri }) : null;

        return (
            <DeckGL
                layers={[layer]}
                initialViewState={JR_PITCHED_VIEW_STATE}
                controller
            ></DeckGL>
        );
    },
    parameters: {
        docs: {
            description: {
                story: "Use a URL as profile data.",
            },
        },
    },
};

export const MissingCoordinate: StoryObj = {
    render: () => {
        const data = "stage-7-parcours.gpx";
        const layer = new ActivityLayer({ data });
        const initialViewState: MapViewState = {
            longitude: -0.3,
            latitude: 44.2,
            zoom: 10,
            pitch: 60,
        };
        return (
            <DeckGL
                layers={[layer]}
                initialViewState={initialViewState}
                controller
            ></DeckGL>
        );
    },
};

export const Picking: StoryObj = {
    render: () => {
        const data = JR_ACTIVITY_FILE;
        const layer = new ActivityLayer({ data: data, pickable: true });

        const getTooltip = React.useCallback(({ coordinate }: PickingInfo) => {
            if (!coordinate || _.isEmpty(coordinate)) {
                return null;
            }
            return {
                html: `lat: ${coordinate[1]}, lon: ${coordinate[0]}`,
            };
        }, []);

        return (
            <DeckGL
                layers={[layer]}
                initialViewState={JR_PITCHED_VIEW_STATE}
                controller
                getTooltip={getTooltip}
            ></DeckGL>
        );
    },
    play: async () => {
        const delay = 500;
        const canvas = document.querySelector("canvas");

        if (!canvas) {
            return;
        }

        await userEvent.click(canvas, { delay });
        await userEvent.hover(canvas, { delay });
        await fireEvent.mouseMove(canvas, { clientX: 50, clientY: 50, delay });
    },
};
