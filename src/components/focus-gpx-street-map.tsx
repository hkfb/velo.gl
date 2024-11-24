import React from "react";
import { FocusActivityMap } from "./focus-activity-map/focus-activity-map";
import { StreetLayer } from "../layers/street-layer";

export type FocusGpxStreetMapProps = {
    children?: React.ReactNode;
    gpx?: string;
};

export function FocusGpxStreetMap({ children, gpx }: FocusGpxStreetMapProps) {
    return (
        <FocusActivityMap gpx={gpx} auxLayers={[new StreetLayer()]}>
            {children}
        </FocusActivityMap>
    );
}
