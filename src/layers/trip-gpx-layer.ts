import { GPXLoader } from "@loaders.gl/kml";
import { TripsLayer } from "@deck.gl/geo-layers/typed";
import { TripsLayerProps } from "@deck.gl/geo-layers/typed/trips-layer/trips-layer";
import { Color } from "@deck.gl/core/typed";
import { FeatureCollection, Feature, LineString, Position } from "geojson";
import distance from "@turf/distance";

function getTimestamps(times: string[] | undefined) {
  const t = times?.map(
    (time: string) => new Date(time).getTime() / 1000 - 1561748779
  );
  return t;
}

function simulateTimestamps(coordinates: Position[]) {
  const velocity = 10; // m/s
  const timestamps = coordinates.reduce((accumulator, coordinate, index) => {
    if (0 === index) {
      return [0];
    }
    const previousCoordinate = coordinates[index - 1];
    const coordinate3d = [coordinate[0], coordinate[1], coordinate[2] ?? 0];
    const d = distance(previousCoordinate, coordinate3d); // km
    const time = (d * 1000) / velocity;
    const [previousTime] = accumulator.slice(-1);
    const accumulatedTime = previousTime + time;
    return [...accumulator, accumulatedTime];
  }, []);
  return timestamps;
}

function dataTransform(collection: FeatureCollection) {
  const feature: Feature = collection.features[0];
  const geometry = feature.geometry as LineString;
  const coordinates = geometry.coordinates;
  const properties = feature.properties;
  const times = properties?.coordinateProperties?.times;
  const gpxTimestamps = getTimestamps(times);
  const timestamps = gpxTimestamps ?? simulateTimestamps(coordinates);
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
TripGpxLayer.layerName = "TripGpxLayer";
