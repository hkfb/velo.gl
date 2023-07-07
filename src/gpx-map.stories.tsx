import * as React from "react";
import { GpxMap } from "./gpx-map";

export default {
  title: "GPX Map",
};

export function GpxMapDefault() {
  return <GpxMap />;
}

export function GpxMapJotunheimenRundt() {
  const initialViewState = {
    longitude: 8.3,
    latitude: 61.4,
    zoom: 8,
  };

  const gpxUrl = "Jotunheimen_rundt.gpx";
  return <GpxMap gpx={gpxUrl} initialViewState={initialViewState} />;
}
