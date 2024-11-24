import * as React from "react";
import { FocusActivityMap } from "./focus-activity-map";
import type { Meta, StoryObj } from "@storybook/react";

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

export function FocusGpxMapSelect({ gpxUrl }: { gpxUrl: string }) {
    return <FocusActivityMap gpx={gpxUrl}></FocusActivityMap>;
}

FocusGpxMapSelect.args = {
    gpxUrl: "Jotunheimen_rundt.gpx",
};

FocusGpxMapSelect.argTypes = {
    gpxUrl: {
        control: "select",
        options: ["Jotunheimen_rundt.gpx", "Teide.tcx"],
    },
};
