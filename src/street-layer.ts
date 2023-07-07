import { _WMSLayer, WMSLayerProps } from "@deck.gl/geo-layers/typed";

export class StreetLayer extends _WMSLayer {
  constructor() {
    const props = {
      data: "https://ows.terrestris.de/osm/service",
      //serviceType: "wms",
      layers: ["OSM-WMS"],
    };
    super(props);
  }
}
