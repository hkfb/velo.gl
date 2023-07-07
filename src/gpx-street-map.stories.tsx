import * as React from "react";
import { GpxStreetMap } from "./gpx-street-map";

export default {
  title: "GPX Street Map",
};

export function GpxStreetMapDefault() {
  return <GpxStreetMap />;
}

export function GpxStreetMapText() {
  return (
    <GpxStreetMap>
      <div>Text</div>
    </GpxStreetMap>
  );
}
