import { SimpleMeshLayer, SimpleMeshLayerProps } from "@deck.gl/mesh-layers";
import { type DefaultProps } from "@deck.gl/core";
import { Polyline, getOffset, extrudeProfile } from "./extrudePolylineProfile";
import { UpdateParameters, type Position } from "@deck.gl/core";
import _ from "lodash";
import { lineString } from "@turf/helpers";
import { simplify } from "@turf/simplify";
import { Feature, LineString } from "geojson";

export type ProfileLayerData = Polyline[];

export interface ProfileLayerProps<DataT = unknown>
    extends Omit<SimpleMeshLayerProps<DataT>, "mesh"> {
    width?: number;
}

const getPosition = (data: unknown) => {
    const origin3d = (data as Polyline)[0];
    return [origin3d[0], origin3d[1], 0] as Position;
};

const defaultProps: DefaultProps<ProfileLayerProps> = {
    ...SimpleMeshLayer.defaultProps,
    id: "road-layer",
    getPosition,
    getColor: [200, 100, 150, 255],
};

const getMesh = (activities: ProfileLayerData, width: number) => {
    const origin = activities[0][0];

    const pathMeterOffset = activities.map((polyline: Polyline) =>
        getOffset(polyline, origin),
    );

    const geojson = pathMeterOffset.map((polyline) => lineString(polyline));

    const simplified = geojson.map((polyline) =>
        simplify(polyline as Feature<LineString>),
    );

    const extrudedProfile = simplified.map((polyline) =>
        extrudeProfile(polyline.geometry.coordinates as Polyline, width),
    );

    const verticesFlat = extrudedProfile[0].positions;

    const positionsBuffer = new Float32Array(verticesFlat);
    const indicesArray = new Uint32Array(extrudedProfile[0].indices);

    const mesh: SimpleMeshLayerProps["mesh"] = {
        attributes: {
            positions: {
                value: positionsBuffer,
                size: 3,
            },
        },
        indices: {
            value: indicesArray,
            size: 1,
        },
    };

    return mesh;
};

export class ProfileLayer<
    DataT = ProfileLayerData,
    PropsT = ProfileLayerProps,
> extends SimpleMeshLayer<DataT, PropsT & ProfileLayerProps> {
    static layerName = "ProfileLayer";
    static defaultProps = defaultProps;

    updateState(args: UpdateParameters<this>) {
        super.updateState(args);

        const data = args.props.data;
        const width = this.props.width;

        if (!data || typeof data === "string" || _.isEmpty(data)) {
            return;
        }

        const mesh = getMesh(data as ProfileLayerData, width ?? 100);
        const model = this.getModel(mesh);
        this.setState({ model });
    }
}
