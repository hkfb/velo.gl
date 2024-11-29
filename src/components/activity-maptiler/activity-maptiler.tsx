import * as React from "react";
import { Map } from "react-map-gl/maplibre";
import {
    FocusActivityMap,
    FocusActivityMapProps,
} from "../focus-activity-map/focus-activity-map";
import "maplibre-gl/dist/maplibre-gl.css";

export function ActivityMaptiler(args: FocusActivityMapProps) {
    const apiKey = import.meta.env.VITE_MAPTILER_API_KEY;
    const mapStyle = `https://api.maptiler.com/maps/streets-v2/style.json?key=${apiKey}`;
    return (
        <FocusActivityMap {...args}>
            <Map
                mapStyle={mapStyle}
                style={{ position: "absolute", zIndex: "-100" }}
                attributionControl={false}
            />
            {args.children}
        </FocusActivityMap>
    );
}

/**
 * @deprecated Use ActivityMaptiler instead.
 */
export const GpxMaptiler = ActivityMaptiler;
