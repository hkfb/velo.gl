import { GPXLoader } from "@loaders.gl/kml";
import { TripsLayer } from "@deck.gl/geo-layers";
import { TripsLayerProps } from "@deck.gl/geo-layers";
import { Color } from "@deck.gl/core";
import { FeatureCollection, Feature, LineString, Position } from "geojson";
import distance from "@turf/distance";

function calcTimestamps(times: string[] | undefined) {
    const t = times?.map(
        (time: string) => new Date(time).getTime() / 1000 - 1561748779,
    );
    return t;
}

function simulateTimestamps(coordinates: Position[], velocity: number) {
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
    const gpxTimestamps = calcTimestamps(times);
    const trip = {
        path: coordinates,
        timestamps: gpxTimestamps,
    };
    return [trip];
}

function getTimestamps(velocity: number) {
    return (data: { path: Position[]; timestamps: number[] }) =>
        data.timestamps ?? simulateTimestamps(data.path, velocity);
}

export interface TripGpxLayerProps extends TripsLayerProps {
    /**
     * Trip velocity in m/s, which will be used if the GPX file does not already
     * contain timestamps.
     */
    velocity?: number;
}

/**
 * A Deck.gl layer that shows the position from a GPX track at a given moment.
 */
export class TripGpxLayer extends TripsLayer<TripGpxLayerProps> {
    constructor(props: TripGpxLayerProps) {
        // @ts-expect-error 2554
        super({
            ...props,
            updateTriggers: { getTimestamps: [props.velocity] },
            getTimestamps: getTimestamps(props.velocity ?? 10),
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
    dataTransform: dataTransform as unknown as undefined,
};

TripGpxLayer.defaultProps = defaultProps;
TripGpxLayer.layerName = "TripGpxLayer";
