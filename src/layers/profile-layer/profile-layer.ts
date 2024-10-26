import {
    SimpleMeshLayer,
    SimpleMeshLayerProps,
} from "@deck.gl/mesh-layers/typed";
import { COORDINATE_SYSTEM } from "@deck.gl/core/typed";
import {
    extrudePolylineProfile,
    lngLatToMeters,
    Point3dTuple,
} from "./extrudePolylineProfile";

export interface ProfileLayerProps extends Omit<SimpleMeshLayerProps, "mesh"> {
    data: Point3dTuple[][];
    width?: number;
}

export class ProfileLayer extends SimpleMeshLayer {
    static layerName = "ProfileLayer";

    constructor(props: ProfileLayerProps) {
        const data = props.data;
        const pathMeterOffset = data.map((polyline) =>
            polyline.map(lngLatToMeters)
        );

        const extrudedProfile = pathMeterOffset.map((polyline) =>
            extrudePolylineProfile(polyline)
        );

        const verticesFlat = extrudedProfile.map((profile) =>
            profile.vertices.flatMap(([x, y, z]) => [x, y, z])
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

        super({ ...props, mesh });
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
