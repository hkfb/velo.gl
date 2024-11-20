import * as React from "react";
import { Map } from "react-map-gl/maplibre";
import { FocusGpxMap, FocusGpxMapProps } from "./focus-gpx-map";
import "maplibre-gl/dist/maplibre-gl.css";

export function GpxMaptiler(args: FocusGpxMapProps) {
    const apiKey = import.meta.env.VITE_MAPTILER_API_KEY;
    const mapStyle = `https://api.maptiler.com/maps/streets-v2/style.json?key=${apiKey}`;
    return (
        <FocusGpxMap {...args}>
            <Map
                mapStyle={mapStyle}
                style={{ position: "absolute", zIndex: "-100" }}
                attributionControl={false}
            />
            {args.children}
        </FocusGpxMap>
    );
}
