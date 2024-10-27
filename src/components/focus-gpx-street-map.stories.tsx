import * as React from "react";
import { FocusGpxStreetMap } from "./focus-gpx-street-map";

export default {
    title: "Focus GPX Street Map",
};

export function FocusGpxStreetMapDefault() {
    return <FocusGpxStreetMap></FocusGpxStreetMap>;
}

export function FocusGpxStreetMapSelect({ gpxUrl }: { gpxUrl: string }) {
    return <FocusGpxStreetMap gpx={gpxUrl}></FocusGpxStreetMap>;
}

FocusGpxStreetMapSelect.args = {
    gpxUrl: "Jotunheimen_rundt.gpx",
};

FocusGpxStreetMapSelect.argTypes = {
    gpxUrl: {
        control: "select",
        options: ["Jotunheimen_rundt.gpx", "Teide.tcx"],
    },
};
