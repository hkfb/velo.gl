import { GPXLoader, TCXLoader } from "@loaders.gl/kml";
import { FeatureCollection, Feature, LineString } from "geojson";
import { type DefaultProps } from "@deck.gl/core";
import {
    FaceProfileLayer,
    FaceProfileLayerProps,
} from "../face-profile-layer/face-profile-layer";

export type ActivityLayerProps<DataT = unknown> = FaceProfileLayerProps<DataT>;

const defaultProps: DefaultProps<ActivityLayerProps> = {
    ...FaceProfileLayer.defaultProps,
    id: "activity",
    loaders: [GPXLoader, TCXLoader],
    dataTransform: dataTransform as unknown as undefined,
};

/**
 * Deck.gl layer for rendering GPX or TCX activity files as an extruded path.
 */
export class ActivityLayer<
    PropsT = ActivityLayerProps,
> extends FaceProfileLayer<PropsT & ActivityLayerProps> {
    static layerName = "ActivityLayer";
    static defaultProps = defaultProps;
}

function dataTransform(collection: FeatureCollection) {
    const feature: Feature = collection.features[0];
    const geometry = feature.geometry as LineString;
    const coordinates = geometry.coordinates;
    return [coordinates];
}
