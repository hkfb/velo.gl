import { GeoJsonLayer, type GeoJsonLayerProps } from "@deck.gl/layers";
import { Color } from "@deck.gl/core";
import { GPXLoader, TCXLoader } from "@loaders.gl/kml";
import { ExtrudedPathLayer } from "../extruded-path-layer/extruded-path-layer";

export type GpxLayerProps = GeoJsonLayerProps;

export class GpxLayer extends GeoJsonLayer {}

const defaultProps = {
    ...GeoJsonLayer.defaultProps,
    lineWidthMinPixels: 3,
    getLineColor: [255, 255, 0] as Color,
    loaders: [GPXLoader, TCXLoader],
    _subLayerProps: {
        linestrings: {
            type: ExtrudedPathLayer,
            getSideColor: [120, 120, 120, 255],
        },
    },
};

GpxLayer.defaultProps = defaultProps;
GpxLayer.layerName = "GpxLayer";
