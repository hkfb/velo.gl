import { SimpleMeshLayer, SimpleMeshLayerProps } from "@deck.gl/mesh-layers";
import { COORDINATE_SYSTEM } from "@deck.gl/core";
import {
    extrudePolylineProfile,
    lngLatToMeters,
    Point3d,
} from "./extrudePolylineProfile";
import { UpdateParameters } from "@deck.gl/core";

export type ProfileLayerData = Point3d[][];

export interface ProfileLayerProps
    extends Omit<SimpleMeshLayerProps<ProfileLayerData>, "mesh"> {
    data: Point3d[][];
    width?: number;
}

export class ProfileLayer extends SimpleMeshLayer<
    ProfileLayerData,
    ProfileLayerProps
> {
    static layerName = "ProfileLayer";

    updateState(args: UpdateParameters<this>) {
        const data = args.props.data;
        const pathMeterOffset = data.map((polyline) =>
            polyline.map(lngLatToMeters),
        );

        const extrudedProfile = pathMeterOffset.map((polyline) =>
            extrudePolylineProfile(polyline),
        );

        const verticesFlat = extrudedProfile.map((profile) =>
            profile.vertices.flatMap(([x, y, z]) => [x, y, z]),
        );

        const positionsBuffer = new Float32Array(verticesFlat[0]);
        const indicesArray = new Uint32Array(extrudedProfile[0].indices);

        const mesh = {
            positions: {
                value: positionsBuffer,
                size: 3,
            },
            indices: {
                value: indicesArray,
                size: 1,
            },
        };

        const props = {
            ...args.props,
            mesh,
        };

        super.updateState({ ...args, props });
    }
}

ProfileLayer.defaultProps = {
    ...SimpleMeshLayer.defaultProps,
    id: "road-layer",
    getPosition: [0, 0, 0],
    getColor: [200, 100, 150, 255],
    coordinateSystem: COORDINATE_SYSTEM.LNGLAT,
    data: [[0, 0, 0]],
};
