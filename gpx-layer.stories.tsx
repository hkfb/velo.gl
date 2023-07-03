import { DeckGL } from '@deck.gl/react/typed';
import { GeoJsonLayer } from '@deck.gl/layers';
import { gpx } from '@tmcw/togeojson';
import { useState, useMemo } from 'react';

export default {
  title: 'GPX Layer',
  // decorators: [withKnobs],
};

// Parse the GPX file
// const gpxData = gpx('Morning_Ride.gpx');

export function GPXLayer() {
  const [dom, setDom] = useState<Document>();
  fetch('Morning_Ride.gpx')
    .then((response) => response.text())
    .then((xml) => {
      setDom(new DOMParser().parseFromString(xml, 'text/xml'));
    });
  const geojsonData = useMemo(() => gpx(dom), [dom]);
  const layer = new GeoJsonLayer({
    id: 'gpx-layer',
    data: geojsonData,
    getRadius: 100, // customize the point radius
    getFillColor: [255, 0, 0], // customize the point color
  });

  return (
    <DeckGL layers={[layer]} initialViewState={{}} controller>
      <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
        Custom UI or additional components can be added here
      </div>
    </DeckGL>
  );
}
