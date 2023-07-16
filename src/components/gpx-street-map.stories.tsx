import * as React from "react";
import { GpxStreetMap } from "./gpx-street-map";

export default {
  title: "GPX Street Map",
};

export function GpxStreetMapDefault() {
  return <GpxStreetMap />;
}

export function GpxStreetMapJotunheimenRundt() {
  const initialViewState = {
    longitude: 8.3,
    latitude: 61.4,
    zoom: 8,
  };
  return (
    <GpxStreetMap
      gpx={"Jotunheimen_rundt.gpx"}
      initialViewState={initialViewState}
    />
  );
}

export function GpxStreetMapText() {
  return (
    <GpxStreetMap>
      <div>Text</div>
    </GpxStreetMap>
  );
}
