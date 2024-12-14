import { SimpleMeshLayer, SimpleMeshLayerProps } from "@deck.gl/mesh-layers";
import { type DefaultProps } from "@deck.gl/core";
import { Polyline, getOffset, extrudeProfile } from "./extrudePolylineProfile";
import { UpdateParameters, type Position } from "@deck.gl/core";
import _ from "lodash";
import { lineString, multiLineString } from "@turf/helpers";
import { simplify } from "@turf/simplify";
import { Feature, LineString, MultiLineString } from "geojson";
import { centroid } from "@turf/centroid";

export type ProfileLayerData = Polyline[];

export interface ProfileLayerProps<DataT = unknown>
    extends Omit<SimpleMeshLayerProps<DataT>, "mesh"> {
    width?: number;
    phongShading?: boolean;
}

const getPosition = (data: unknown) => {
    const path = lineString(data as Polyline);
    const origin = centroid(path as Feature<LineString>).geometry.coordinates;
    return [origin[0], origin[1], 0] as Position;
};

const defaultProps: DefaultProps<ProfileLayerProps> = {
    ...SimpleMeshLayer.defaultProps,
    id: "road-layer",
    getPosition,
    getColor: [200, 100, 150, 255],
    parameters: {
        cullMode: "back",
    },
    phongShading: false,
};

export class ProfileLayer<
    DataT = ProfileLayerData,
    PropsT = ProfileLayerProps,
> extends SimpleMeshLayer<DataT, PropsT & ProfileLayerProps> {
    static layerName = "ProfileLayer";
    static defaultProps = defaultProps;

    _getMesh(activities: ProfileLayerData) {
        const paths = multiLineString(activities);

        const origin = centroid(paths as Feature<MultiLineString>);

        const pathMeterOffset = activities.map((polyline: Polyline) =>
            getOffset(polyline, origin.geometry.coordinates),
        );

        const geojson = pathMeterOffset.map((polyline) => lineString(polyline));

        const simplified = geojson.map((polyline) =>
            simplify(polyline as Feature<LineString>),
        );

        const extrudedProfile = simplified.map((polyline) =>
            extrudeProfile(
                polyline.geometry.coordinates as Polyline,
                this.props.width ?? 100,
            ),
        );

        const verticesFlat = extrudedProfile[0].positions;
        const normals = new Float32Array(extrudedProfile[0].normals.flat());
        const texCoords = new Float32Array(extrudedProfile[0].texCoords.flat());

        const positionsBuffer = new Float32Array(verticesFlat);
        const indicesArray = new Uint32Array(extrudedProfile[0].indices);

        const normalsAttribute = {
            normals: {
                value: normals,
                size: 3,
            },
        };

        const texCoordsAttribute = {
            texCoords: {
                value: texCoords,
                size: 2,
            },
        };

        const mesh: SimpleMeshLayerProps["mesh"] = {
            attributes: {
                positions: {
                    value: positionsBuffer,
                    size: 3,
                },
                ...normalsAttribute,
                ...texCoordsAttribute,
            },
            indices: {
                value: indicesArray,
                size: 1,
            },
        };

        return mesh;
    }

    updateState(args: UpdateParameters<this>) {
        super.updateState(args);
        if (!args.changeFlags.propsOrDataChanged) {
            return;
        }

        const data = args.props.data;

        if (!data || typeof data === "string" || _.isEmpty(data)) {
            return;
        }

        const mesh = this._getMesh(data as ProfileLayerData);
        const model = this.getModel(mesh);

        this.state.model?.destroy();
        const attributeManager = this.getAttributeManager();
        if (attributeManager) {
            attributeManager.invalidateAll();
        }

        this.setState({ model, hasNormals: args.props.phongShading });
    }
}
