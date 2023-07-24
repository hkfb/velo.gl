import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { GpxMap } from "./gpx-map";

const meta: Meta<typeof GpxMap> = {
  title: "GPX Map",
  tags: ["autodocs"],
  component: GpxMap,
};

export default meta;

type Story = StoryObj<typeof GpxMap>;

export const Default: Story = {};

export const JotunheimenRundt: Story = {
  args: {
    initialViewState: {
      longitude: 8.3,
      latitude: 61.4,
      zoom: 8,
    },

    gpx: "Jotunheimen_rundt.gpx",
  },
};

export function GpxMapText() {
  return (
    <GpxMap>
      <div>Text</div>
    </GpxMap>
  );
}
