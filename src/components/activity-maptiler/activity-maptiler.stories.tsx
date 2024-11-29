import * as React from "react";
import { ActivityMaptiler } from "./activity-maptiler";
import type { StoryObj } from "@storybook/react";
import {
    JR_ACTIVITY_FILE,
    JR_PITCHED_VIEW_STATE,
    TEIDE_ACTIVITY_FILE,
} from "../../constant.stories";

export default {
    tags: ["autodocs"],
    component: ActivityMaptiler,
    parameters: {
        docs: {
            story: {
                height: "400px",
            },
        },
    },
};

type Story = StoryObj<typeof ActivityMaptiler>;

export const Default: Story = {};

export const TextAnnotation: Story = {
    render: () => (
        <ActivityMaptiler>
            <div>Activity Map Tiler story</div>
        </ActivityMaptiler>
    ),
};

export const PitchedCamera: Story = {
    args: {
        gpx: JR_ACTIVITY_FILE,
        initialViewState: JR_PITCHED_VIEW_STATE,
    },
    argTypes: {
        gpx: {
            control: "select",
            options: [JR_ACTIVITY_FILE, TEIDE_ACTIVITY_FILE],
        },
    },
    parameters: {
        docs: {
            description: {
                story: "Focus with pitched camera.",
            },
        },
    },
};
