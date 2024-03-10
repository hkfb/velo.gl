import * as React from "react";
import { FocusGpxMap } from "./focus-gpx-map";

export default {
  title: "Focus GPX Map",
};

export function FocusGpxMapDefault() {
  return <FocusGpxMap></FocusGpxMap>;
}

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
