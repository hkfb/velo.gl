import React from "react";
import { GpxMap } from "./gpx-map";
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
        <GpxMap
            gpx={gpx}
            initialViewState={initialViewState}
            auxLayers={[new StreetLayer()]}
        >
            {children}
        </GpxMap>
    );
}
