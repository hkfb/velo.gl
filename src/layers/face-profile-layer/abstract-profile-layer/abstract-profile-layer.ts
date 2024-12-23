import { SimpleMeshLayer, SimpleMeshLayerProps } from "@deck.gl/mesh-layers";
import { type DefaultProps } from "@deck.gl/core";
import {
    Polyline,
    getOffset,
} from "../../profile-layer/extrudePolylineProfile";
import { UpdateParameters, type Position } from "@deck.gl/core";
import _ from "lodash";
import { lineString, multiLineString } from "@turf/helpers";
import { Feature, LineString, MultiLineString } from "geojson";
import { centroid } from "@turf/centroid";
import { cleanCoords } from "@turf/clean-coords";
import { extrudeRoadMeshes } from "../util/extrudeRoadMeshes";

export type AbstractProfileLayerData = Polyline[];

export interface AbstractProfileLayerProps<DataT = unknown>
    extends Omit<SimpleMeshLayerProps<DataT>, "mesh"> {
    width?: number;
    phongShading?: boolean;
}

const getPosition = (data: unknown) => {
    const path = lineString(data as Polyline);
    const origin = centroid(path as Feature<LineString>).geometry.coordinates;
    return [origin[0], origin[1], 0] as Position;
};

const defaultProps: DefaultProps<AbstractProfileLayerProps> = {
    ...SimpleMeshLayer.defaultProps,
    id: "road-layer",
    getPosition,
    getColor: [200, 100, 150, 255],
    parameters: {
        cullMode: "back",
    },
    phongShading: false,
};

export abstract class AbstractProfileLayer<
    DataT = AbstractProfileLayerData,
    PropsT = AbstractProfileLayerProps,
> extends SimpleMeshLayer<DataT, PropsT & AbstractProfileLayerProps> {
    static layerName = "AbstractProfileLayer";
    static defaultProps = defaultProps;

    _getMesh(activities: AbstractProfileLayerData) {
        const paths = multiLineString(activities);

        const clean = cleanCoords(paths);

        const origin = centroid(clean as Feature<MultiLineString>);

        const pathMeterOffset = clean.geometry.coordinates.map(
            (polyline: Polyline) =>
                getOffset(polyline, origin.geometry.coordinates),
        );

        const profileWidth = this.props.width ?? 100;

        return extrudeRoadMeshes(pathMeterOffset[0] as Polyline, profileWidth);
    }

    updateState(args: UpdateParameters<this>) {
        super.updateState(args);
    }
}
