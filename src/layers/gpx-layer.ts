import {
    GeoJsonLayer,
    PathLayer,
    type GeoJsonLayerProps,
} from "@deck.gl/layers";
import { Color } from "@deck.gl/core";
import { GPXLoader, TCXLoader } from "@loaders.gl/kml";
import * as _ from "lodash";

export type GpxLayerProps = typeof GeoJsonLayerProps;

export class GpxLayer extends GeoJsonLayer<GpxLayerProps> {
    constructor(props: GpxLayerProps) {
        super({ ...props });
    }

    renderLayers() {
        const defaultLayers = super.renderLayers();
        const lineLayers = defaultLayers[1];
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
    loaders: [GPXLoader, TCXLoader],
};

GpxLayer.defaultProps = defaultProps;
GpxLayer.layerName = "GpxLayer";
