import * as React from "react";
import { FocusGpxMap } from "./focus-gpx-map";
import type { Meta, StoryObj } from "@storybook/react";

type Story = StoryObj<typeof FocusGpxMap>;

const meta: Meta<typeof FocusGpxMap> = {
    tags: ["autodocs"],
    component: FocusGpxMap,
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
    return <FocusGpxMap gpx={gpxUrl}></FocusGpxMap>;
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
