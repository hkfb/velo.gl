import { GPXLoader } from "@loaders.gl/kml";
import { TripsLayer } from "@deck.gl/geo-layers/typed";
import { TripsLayerProps } from "@deck.gl/geo-layers/typed/trips-layer/trips-layer";
import { Color } from "@deck.gl/core/typed";
import { FeatureCollection, Feature, LineString } from "geojson";

function dataTransform(collection: FeatureCollection) {
  const feature: Feature = collection.features[0];
  const geometry = feature.geometry as LineString;
  const coordinates = geometry.coordinates;
  const properties = feature.properties;
  const times = properties?.coordinateProperties.times;
  const timestamps = times.map(
    (time: string) => new Date(time).getTime() / 1000 - 1561748779
  );
  const trip = {
    path: coordinates,
    timestamps: timestamps,
  };
  return [trip];
}

export class TripGpxLayer extends TripsLayer {
  constructor(props: TripsLayerProps) {
    props.loaders = [GPXLoader];
    props.dataTransform = dataTransform as unknown as null;
    super(props);
  }
}

const defaultProps = {
  ...TripsLayer.defaultProps,
  currentTime: 5000,
  trailLength: 1000,
  widthMinPixels: 5,
  getColor: [255, 0, 0] as Color,
};

TripGpxLayer.defaultProps = defaultProps;
