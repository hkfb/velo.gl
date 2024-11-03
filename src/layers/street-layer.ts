import { _WMSLayer } from "@deck.gl/geo-layers";

export class StreetLayer extends _WMSLayer {}

const defaultProps = {
    ..._WMSLayer.defaultProps,
    data: "https://ows.terrestris.de/osm/service?",
    serviceType: "wms",
    layers: ["OSM-WMS"],
};

StreetLayer.defaultProps = defaultProps;
StreetLayer.layerName = "StreetLayer";
