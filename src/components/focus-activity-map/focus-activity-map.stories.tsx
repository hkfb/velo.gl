import { FocusActivityMap } from "./focus-activity-map";
import type { Meta, StoryObj } from "@storybook/react";
import {
    JR_ACTIVITY_FILE,
    JR_PITCHED_VIEW_STATE,
    TEIDE_ACTIVITY_FILE,
} from "../../constant.stories";

type Story = StoryObj<typeof FocusActivityMap>;

const meta: Meta<typeof FocusActivityMap> = {
    tags: ["autodocs"],
    component: FocusActivityMap,
    parameters: {
        docs: {
            story: {
                height: "400px",
            },
        },
    },
};

export default meta;

export const Default: Story = {};

export const ActivitySelect: Story = {
    args: {
        gpx: JR_ACTIVITY_FILE,
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
                story: "Focus on selected activity.",
            },
        },
    },
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
