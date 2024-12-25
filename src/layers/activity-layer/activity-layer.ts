import { GPXLoader, TCXLoader } from "@loaders.gl/kml";
import { FeatureCollection, Feature, LineString, Position } from "geojson";
import { type DefaultProps } from "@deck.gl/core";
import {
    FaceProfileLayer,
    FaceProfileLayerProps,
} from "../face-profile-layer/face-profile-layer";
import { simplify } from "@turf/simplify";
import { coordEach } from "@turf/meta";
import _ from "lodash";

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
    const simplified = simplify(feature, { tolerance: 0.0002 });
    const geometry = simplified.geometry as LineString;

    // Sanitize coordinates.
    coordEach(geometry, (coord: Position) => {
        if (coord.length === 3 && !_.isUndefined(coord[2])) {
            return coord;
        }

        console.info(`Encountered non 3D coordinates: ${coord}`);

        return [coord[0], coord[1], 0];
    });

    const coordinates = geometry.coordinates;
    return [coordinates];
}
