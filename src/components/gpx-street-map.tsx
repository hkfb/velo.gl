import React from "react";
import { ActivityMap } from "./activity-map";
import { StreetLayer } from "../layers/street-layer";
import { MapViewState } from "@deck.gl/core";

export type GpxStreetMapProps = {
    children?: React.ReactNode;
    gpx?: string;
    initialViewState?: MapViewState;
};

export function GpxStreetMap({
    children,
    gpx,
    initialViewState,
}: GpxStreetMapProps) {
    return (
        <ActivityMap
            gpx={gpx}
            initialViewState={initialViewState}
            auxLayers={[new StreetLayer()]}
        >
            {children}
        </ActivityMap>
    );
}
