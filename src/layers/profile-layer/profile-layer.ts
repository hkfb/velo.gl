import { SimpleMeshLayer, SimpleMeshLayerProps } from "@deck.gl/mesh-layers";
import { COORDINATE_SYSTEM, type DefaultProps } from "@deck.gl/core";
import {
    extrudePolylineProfile,
    lngLatToMeters,
    Polyline,
    getOffset,
} from "./extrudePolylineProfile";
import { UpdateParameters } from "@deck.gl/core";
import _ from "lodash";

export type ProfileLayerData = Polyline[];

export interface ProfileLayerProps<DataT = unknown>
    extends Omit<SimpleMeshLayerProps<DataT>, "mesh"> {
    width?: number;
}

const defaultProps: DefaultProps<ProfileLayerProps> = {
    ...SimpleMeshLayer.defaultProps,
    id: "road-layer",
    /*
    getPosition: (data: unknown) => {
        const position = [0, 0];
        console.dir(position);
        return new Float32Array(position);
    },
    */
    getPosition: (data: unknown) => {
        const position = (data as unknown as Polyline)[0];
        console.dir(position);
        return position;
    },
    //getPosition: [0, 0, 0],
    getColor: [200, 100, 150, 255],
    //coordinateSystem: COORDINATE_SYSTEM.LNGLAT,
    //extensions: [],
    //_instanced: true,
    //numInstances: 10,
    //numInstances: 1,
};

const getMesh = (activities: ProfileLayerData, width: number) => {
    //const origin = [0, 0];
    const origin = activities[0][0];
    console.log("origin: ", origin);

    const pathMeterOffset = activities.map((polyline: Polyline) =>
        getOffset(polyline, origin),
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
        super.updateState(args);
        //super.updateState(args);

        const data = args.props.data;
        const width = this.props.width;

        if (!data || typeof data === "string" || _.isEmpty(data)) {
            return;
        }

        //const origin = (data as ProfileLayerData)[0][0];

        const mesh = getMesh(data as ProfileLayerData, width ?? 100);
        const model = this.getModel(mesh);
        //this.state.model = model;
        this.setState({ model });

        /*
        const props = args.props;
        props.mesh = { ...mesh };

        const oldProps = { ...args.oldProps };
        oldProps.mesh = null;

        super.updateState({ ...args, props, oldProps });
        */
    }
}
