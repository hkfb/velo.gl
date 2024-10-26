import {
    GeoJsonLayer,
    GeoJsonLayerProps,
    PathLayer,
} from "@deck.gl/layers/typed";
import { Color } from "@deck.gl/core/typed";
import { GPXLoader, TCXLoader } from "@loaders.gl/kml";
import * as _ from "lodash";

export class GpxLayer extends GeoJsonLayer {
    constructor(props: GeoJsonLayerProps) {
        props.loaders = [GPXLoader, TCXLoader];
        super(props);
    }

    renderLayers() {
        const defaultLayers = super.renderLayers();
        const lineLayers = defaultLayers[1] as PathLayer[];
        if (!_.isArray(lineLayers) || lineLayers.length < 2) {
            return defaultLayers;
        }
        const pathLayer = lineLayers[1];
        if (pathLayer.constructor !== PathLayer) {
            return defaultLayers;
        }
        const outlineLayer = pathLayer.clone({
            id: "outline",
            widthMinPixels: this.props.lineWidthMinPixels + 1,
            getColor: [0, 0, 0],
        });
        return [outlineLayer, ...defaultLayers];
    }
}

const defaultProps = {
    ...GeoJsonLayer.defaultProps,
    lineWidthMinPixels: 3,
    getLineColor: [255, 255, 0] as Color,
};

GpxLayer.defaultProps = defaultProps;
GpxLayer.layerName = "GpxLayer";
