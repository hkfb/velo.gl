import * as React from "react";
import { ActivityMaptiler } from "./activity-maptiler";
import type { StoryObj } from "@storybook/react";

export default {
    tags: ["no-visual-test", "autodocs"],
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
