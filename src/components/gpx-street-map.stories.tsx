import * as React from "react";
import { GpxStreetMap } from "./gpx-street-map";

export default {
  title: "GPX Street Map",
};

export function GpxStreetMapDefault() {
  return <GpxStreetMap />;
}

export function ElTeide() {
  const initialViewState = {
    latitude: 28.2,
    longitude: -16.6,
    zoom: 10,
  };
  return <GpxStreetMap gpx={"Teide.tcx"} initialViewState={initialViewState} />;
}

export function GpxStreetMapText() {
  return (
    <GpxStreetMap>
      <div>Text</div>
    </GpxStreetMap>
  );
}
