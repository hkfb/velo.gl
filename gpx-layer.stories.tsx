import { DeckGL } from "@deck.gl/react/typed";
import { GeoJsonLayer } from "@deck.gl/layers/typed";
import { gpx } from "@tmcw/togeojson";
import { useState, useMemo, useEffect } from "react";
import * as React from "react";

export default {
  title: "GPX Layer",
  // decorators: [withKnobs],
};

// Parse the GPX file
// const gpxData = gpx('Morning_Ride.gpx');

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

  const layer = new GeoJsonLayer({
    id: "gpx-layer",
    data: geojsonData,
    getRadius: 100, // customize the point radius
    getFillColor: [255, 0, 0], // customize the point color
  });

  return (
    <DeckGL layers={[layer]} initialViewState={{}} controller>
      <div style={{ position: "absolute", top: "10px", left: "10px" }}>
        Custom UI or additional components can be added here
      </div>
    </DeckGL>
  );
}
