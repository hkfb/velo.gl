import { CompositeLayer } from "@deck.gl/core";
import {
    TopProfileLayer,
    TopProfileLayerProps,
    TopProfileLayerData,
} from "./top-profile-layer/top-profile-layer";
import {
    SideProfileLayer,
    SideProfileLayerProps,
} from "./side-profile-layer/side-profile-layer";
import { type DefaultProps } from "@deck.gl/core";

export type FaceProfileLayerData = TopProfileLayerData;

export type FaceProfileLayerProps<DataT = unknown> =
    TopProfileLayerProps<DataT>;

const defaultProps: DefaultProps<FaceProfileLayerProps> = {
    ...TopProfileLayer.defaultProps,
    id: "face-profile-layer",
};

export class FaceProfileLayer<
    PropsT = FaceProfileLayerProps,
> extends CompositeLayer<PropsT & FaceProfileLayerProps> {
    static layerName = "FaceProfileLayer";
    static defaultProps = defaultProps;

    renderLayers() {
        const data = this.props.data;
        const texture = this.props.texture;

        const topLayerProps: TopProfileLayerProps<unknown> = {
            ...this.getSubLayerProps({
                ...this.props,
                id: "top",
            }),
            data,
            texture,
        };
        const topLayer = new TopProfileLayer<unknown>(topLayerProps);

        const sideLayerProps: SideProfileLayerProps<unknown> = {
            ...this.getSubLayerProps({
                ...this.props,
                id: "side",
            }),
            data,
            texture,
        };
        const sideLayer = new SideProfileLayer<unknown>(sideLayerProps);

        return [topLayer, sideLayer];
    }
}
