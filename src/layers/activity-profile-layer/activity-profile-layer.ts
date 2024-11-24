import { GPXLoader, TCXLoader } from "@loaders.gl/kml";
import {
    ProfileLayer,
    ProfileLayerProps,
} from "../profile-layer/profile-layer";
import { FeatureCollection, Feature, LineString } from "geojson";
import { type DefaultProps } from "@deck.gl/core";

export type ActivityProfileLayerProps<DataT = unknown> =
    ProfileLayerProps<DataT>;

const defaultProps: DefaultProps<ActivityProfileLayerProps> = {
    ...ProfileLayer.defaultProps,
    id: "activity-profile",
    loaders: [GPXLoader, TCXLoader],
    dataTransform: dataTransform as unknown as undefined,
};

export class ActivityProfileLayer<
    DataT = unknown,
    PropsT = ActivityProfileLayerProps,
> extends ProfileLayer<DataT, PropsT & ActivityProfileLayerProps> {
    static layerName = "ActivityProfileLayer";
    static defaultProps = defaultProps;
}

function dataTransform(collection: FeatureCollection) {
    const feature: Feature = collection.features[0];
    const geometry = feature.geometry as LineString;
    const coordinates = geometry.coordinates;
    return [coordinates];
}
