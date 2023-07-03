import { DeckGL } from "@deck.gl/react/typed";
import { GeoJsonLayer } from "@deck.gl/layers/typed";
import { gpx } from "@tmcw/togeojson";
import { useState, useMemo, useEffect } from "react";
import * as React from "react";

export default {
  title: "GPX Layer",
};

export function GPXLayer() {
  const [dom, setDom] = useState<Document>(new Document());
  const gpxFile = "Morning_Ride.gpx";

  useEffect(() => {
    fetch(gpxFile)
      .then((response) => response.text())
      .then((xml) => {
        setDom(new DOMParser().parseFromString(xml, "text/xml"));
      });
  }, [gpxFile]);

  const geojsonData = useMemo(() => gpx(dom), [dom]);

  const layer = useMemo(
    () =>
      new GeoJsonLayer({
        id: "gpx-layer",
        data: geojsonData,
        lineWidthMinPixels: 5, // customize the point radius
        getFillColor: [255, 0, 0], // customize the point color
      }),
    [geojsonData]
  );

  const initialViewState = {
    longitude: 10.8,
    latitude: 59.79,
    zoom: 12,
  };

  return (
    <DeckGL layers={[layer]} initialViewState={initialViewState} controller>
      <div style={{ position: "absolute", top: "10px", left: "10px" }}>
        GPX Example
      </div>
    </DeckGL>
  );
}
