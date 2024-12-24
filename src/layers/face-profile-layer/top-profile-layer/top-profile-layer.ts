import { type DefaultProps } from "@deck.gl/core";
import { UpdateParameters } from "@deck.gl/core";
import _ from "lodash";
import {
    AbstractProfileLayer,
    AbstractProfileLayerProps,
    AbstractProfileLayerData,
} from "../abstract-profile-layer/abstract-profile-layer";

export type TopProfileLayerData = AbstractProfileLayerData;

export type TopProfileLayerProps<DataT = unknown> =
    AbstractProfileLayerProps<DataT>;

const defaultProps: DefaultProps<TopProfileLayerProps> = {
    ...AbstractProfileLayer.defaultProps,
    id: "top-profile-layer",
};

export class TopProfileLayer<
    DataT = TopProfileLayerData,
    PropsT = TopProfileLayerProps,
> extends AbstractProfileLayer<DataT, PropsT & TopProfileLayerProps> {
    static layerName = "TopProfileLayer";
    static defaultProps = defaultProps;

    updateState(args: UpdateParameters<this>) {
        super.updateState(args);
        if (!args.changeFlags.propsOrDataChanged) {
            return;
        }

        const data = args.props.data;

        if (!data || typeof data === "string" || _.isEmpty(data)) {
            return;
        }

        const mesh = this._getMesh(data as TopProfileLayerData);
        const model = this.getModel(mesh.topGeometry);

        this.state.model?.destroy();
        const attributeManager = this.getAttributeManager();
        if (attributeManager) {
            attributeManager.invalidateAll();
        }

        this.setState({ model, hasNormals: args.props.phongShading });
    }
}
