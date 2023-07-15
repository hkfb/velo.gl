import * as React from "react";
import { Map } from "react-map-gl/maplibre";
import { FocusGpxMap, FocusGpxMapProps } from "./focus-gpx-map";

export function GpxMaptiler(args: FocusGpxMapProps) {
  const [apiKey] = React.useState(import.meta.env.VITE_MAPTILER_API_KEY);
  const mapStyle = `https://api.maptiler.com/maps/streets-v2/style.json?key=${apiKey}`;
  return (
    <FocusGpxMap {...args}>
      <Map
        mapStyle={mapStyle}
        style={{ position: "relative", zIndex: "-100" }}
      />
    </FocusGpxMap>
  );
}
