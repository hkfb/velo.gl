import { GeoJsonLayer, GeoJsonLayerProps } from "@deck.gl/layers/typed";
import { GPXLoader } from "@loaders.gl/kml";

export class GpxLayer extends GeoJsonLayer {
  constructor(props: GeoJsonLayerProps) {
    props.loaders = [GPXLoader];
    super(props);
  }
}
