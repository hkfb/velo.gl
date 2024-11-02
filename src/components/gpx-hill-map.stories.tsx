import { GpxHillMap } from "./gpx-hill-map";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof GpxHillMap> = {
    component: GpxHillMap,
    tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof GpxHillMap>;

export const Default: Story = {
    tags: ["no-visual-test"],
};

export const JotunheimenRundt: Story = {
    args: {
        gpx: "Jotunheimen_rundt.gpx",
    },
    tags: ["no-visual-test"],
};
