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

function simulateTimestamps(coordinates: Position[], velocity: number) {
  console.log(velocity);
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

function dataTransform(collection: FeatureCollection, velocity: number) {
  const feature: Feature = collection.features[0];
  const geometry = feature.geometry as LineString;
  const coordinates = geometry.coordinates;
  const properties = feature.properties;
  const times = properties?.coordinateProperties?.times;
  const gpxTimestamps = getTimestamps(times);
  const timestamps = gpxTimestamps ?? simulateTimestamps(coordinates, velocity);
  const trip = {
    path: coordinates,
    timestamps: timestamps,
  };
  return [trip];
}

function createDataTransform(velocity: number) {
  return (collection: FeatureCollection) => dataTransform(collection, velocity);
}

export interface TripGpxLayerProps extends TripsLayerProps {
  velocity?: number;
}

export class TripGpxLayer extends TripsLayer {
  constructor(props: TripGpxLayerProps) {
    super({
      ...props,
      dataTransform: createDataTransform(
        props.velocity ?? 10
      ) as unknown as undefined,
      updateTriggers: { getTimestamps: [props.velocity] },
    });
  }
}

const defaultProps = {
  ...TripsLayer.defaultProps,
  currentTime: 5000,
  trailLength: 1000,
  widthMinPixels: 5,
  getColor: [255, 0, 0] as Color,
  loaders: [GPXLoader],
  velocity: 10,
  //updateTriggers: { getTimestamps: [velocity] }
};

TripGpxLayer.defaultProps = defaultProps;
TripGpxLayer.layerName = "TripGpxLayer";
