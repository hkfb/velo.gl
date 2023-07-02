import { DeckGL } from '@deck.gl/react';
import { GeoJsonLayer } from '@deck.gl/layers';
import { Parser } from 'gpx-parser';

// Parse the GPX file
const gpxParser = new Parser();
const gpxData = gpxParser.parse('Morning_Ride.gpx');

// Convert GPS data to deck.gl-compatible format
const features = gpxData.tracks.flatMap(track =>
  track.segments.flatMap(segment =>
    segment.map(point => ({
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Point',
        coordinates: [point.lon, point.lat] // [lng, lat]
      }
    }))
  )
);

// Create a deck.gl layer
const layer = new GeoJsonLayer({
  id: 'gpx-layer',
  data: {
    type: 'FeatureCollection',
    features
  },
  getRadius: 100, // customize the point radius
  getFillColor: [255, 0, 0], // customize the point color
});

// Render the deck.gl layer on a map
ReactDOM.render(
  <DeckGL layers={[layer]} />,
  document.getElementById('map-container')
);

