import { SimpleMeshLayer, SimpleMeshLayerProps } from "@deck.gl/mesh-layers";
import { COORDINATE_SYSTEM, type DefaultProps } from "@deck.gl/core";
import {
    extrudePolylineProfile,
    lngLatToMeters,
    Point3d,
} from "./extrudePolylineProfile";
import { UpdateParameters } from "@deck.gl/core";
import _ from "lodash";

type Polyline = Point3d[];

export type ProfileLayerData = Polyline[];

export interface ProfileLayerProps<DataT = unknown>
    extends Omit<SimpleMeshLayerProps<DataT>, "mesh"> {
    width?: number;
}

const defaultProps: DefaultProps<ProfileLayerProps> = {
    ...SimpleMeshLayer.defaultProps,
    id: "road-layer",
    getPosition: [0, 0, 0],
    getColor: [200, 100, 150, 255],
    coordinateSystem: COORDINATE_SYSTEM.LNGLAT,
    extensions: [],
};

const getMesh = (activities: ProfileLayerData, width: number) => {
    const origin = activities[0][0];

    const pathMeterOffset = activities.map((polyline: Polyline) =>
        polyline.map(lngLatToMeters),
    );

    const extrudedProfile = pathMeterOffset.map((polyline) =>
        extrudePolylineProfile(polyline, width),
    );

    const verticesFlat = extrudedProfile.map((profile) =>
        profile.vertices.flatMap(([x, y, z]) => [x, y, z]),
    );

    const positionsBuffer = new Float32Array(verticesFlat[0]);
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
        const data = args.props.data;
        const width = this.props.width;

        if (!data || typeof data === "string" || _.isEmpty(data)) {
            return;
        }

        const mesh = getMesh(data, width);

        const props = args.props;
        props.mesh = { ...mesh };

        const oldProps = { ...args.oldProps };
        oldProps.mesh = null;

        super.updateState({ ...args, props, oldProps });
    }
}
