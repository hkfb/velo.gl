import React from "react";
import { FocusGpxMap } from "./focus-gpx-map";
import { StreetLayer } from "../layers/street-layer";

export type FocusGpxStreetMapProps = {
    children?: React.ReactNode;
    gpx?: string;
};

export function FocusGpxStreetMap({ children, gpx }: FocusGpxStreetMapProps) {
    return (
        <FocusGpxMap gpx={gpx} auxLayers={[new StreetLayer()]}>
            {children}
        </FocusGpxMap>
    );
}
