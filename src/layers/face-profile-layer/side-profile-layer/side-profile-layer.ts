import { type DefaultProps } from "@deck.gl/core";
import { UpdateParameters } from "@deck.gl/core";
import _ from "lodash";
import {
    AbstractProfileLayer,
    AbstractProfileLayerData,
    AbstractProfileLayerProps,
} from "../abstract-profile-layer/abstract-profile-layer";

export type SideProfileLayerData = AbstractProfileLayerData;

type SideProfileLayerProps<DataT = unknown> = AbstractProfileLayerProps<DataT>;

const defaultProps: DefaultProps<SideProfileLayerProps> = {
    ...AbstractProfileLayer.defaultProps,
    id: "side-profile-layer",
};

export class SideProfileLayer<
    DataT = SideProfileLayerData,
    PropsT = SideProfileLayerProps,
> extends AbstractProfileLayer<DataT, PropsT & SideProfileLayerProps> {
    static layerName = "SideProfileLayer";
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

        const mesh = this._getMesh(data as SideProfileLayerData);
        const model = this.getModel(mesh.sideGeometry);

        this.state.model?.destroy();
        const attributeManager = this.getAttributeManager();
        if (attributeManager) {
            attributeManager.invalidateAll();
        }

        this.setState({ model, hasNormals: args.props.phongShading });
    }
}
