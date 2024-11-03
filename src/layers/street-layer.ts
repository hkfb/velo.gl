import { _WMSLayer } from "@deck.gl/geo-layers";

export class StreetLayer extends _WMSLayer {}

const defaultProps = {
    ..._WMSLayer.defaultProps,
    data: "https://ows.terrestris.de/osm/service",
    layers: ["OSM-WMS"],
};

_WMSLayer.defaultProps = defaultProps;
