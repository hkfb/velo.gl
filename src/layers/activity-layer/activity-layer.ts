import { GPXLoader, TCXLoader } from "@loaders.gl/kml";
import { FeatureCollection, Feature, LineString, Position } from "geojson";
import { type DefaultProps } from "@deck.gl/core";
import {
    FaceProfileLayer,
    FaceProfileLayerProps,
} from "../face-profile-layer/face-profile-layer";
import { simplify } from "@turf/simplify";
import { coordEach } from "@turf/meta";

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
    const simplified = simplify(feature, { tolerance: 0.0003 });
    const geometry = simplified.geometry as LineString;

    // Validate coordinates.
    coordEach(geometry, (coord: Position) => {
        if (coord.length !== 3) {
            throw new Error(
                "Some coordinates do not have exactly three values.",
            );
        }
    });

    const coordinates = geometry.coordinates;
    return [coordinates];
}
