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
    tags: ["no-visual-test"],
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
    tags: ["no-test-webkit"],
};

export const ProfileConfig: Story = {
    args: {
        profileConfig: {
            getScale: [1, 1, 20],
            width: 1000,
            getColor: [0, 100, 255, 200],
        },
        initialViewState: JR_PITCHED_VIEW_STATE,
    },
    tags: ["no-visual-test"],
};
