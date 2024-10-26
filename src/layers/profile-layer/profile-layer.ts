import {
  SimpleMeshLayer,
  SimpleMeshLayerProps,
} from "@deck.gl/mesh-layers/typed";
import { COORDINATE_SYSTEM } from "@deck.gl/core/typed";

//export interface ProfileLayerProps extends SimpleMeshLayerProps;

export class ProfileLayer extends SimpleMeshLayer {
  static layerName = "ProfileLayer";

  constructor(props: SimpleMeshLayerProps) {
    super(props);
  }
}

ProfileLayer.defaultProps = {
  ...SimpleMeshLayer.defaultProps,
  id: "road-layer",
  getPosition: [0, 0, 0],
  getColor: [200, 100, 150, 255],
  coordinateSystem: COORDINATE_SYSTEM.LNGLAT,
  data: [[0, 0, 0]],
};
