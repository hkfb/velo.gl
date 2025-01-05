import { PathLayer, type PathLayerProps } from "@deck.gl/layers";
import { fs } from "./extruded-path-layer-fragment.glsl";
import { vs } from "./extruded-path-layer-vertex.glsl";
import { Geometry, Model } from "@luma.gl/engine";

export type ExtrudedPathLayerProps<DataT> = PathLayerProps<DataT>;

/**
 * Deck.gl layer that extrudes a path vertically from sea level.
 */
export class ExtrudedPathLayer extends PathLayer {
    static defaultProps = {
        ...PathLayer.defaultProps,
    };
    static layerName = "ExtrudedPathLayer";

    /**
     * Override PathLayer shaders with ones that draw path side walls.
     */
    getShaders() {
        return {
            ...super.getShaders(),
            vs,
            fs,
        };
    }

    /**
     * Override the PathLayer path segment model with a model that defines
     * side walls.
     */
    protected _getModel(): Model {
        // prettier-ignore
        const SEGMENT_INDICES = [
          // start corner
          0, 1, 2,
          // body
          1, 4, 2,
          1, 3, 4,
          // end corner
          3, 5, 4,

          // Right side
          2, 4, 6,
          6, 7, 4,
          0, 6, 2,
          0, 8, 6,
          9, 4, 5,
          7, 4, 9,

          // Left side
          10, 3, 1,
          10, 11, 3,
          10, 1, 0,
          11, 3, 5,

        ];

        // [0] position on segment - 0: start, 1: end
        // [1] side of path - -1: left, 0: center (joint), 1: right
        // [2] elevation of path - 0: bottom, 1: top
        // prettier-ignore
        const SEGMENT_POSITIONS = [
          // bevel start corner (0)
          0, 0, 1,
          // start inner corner (1)
          0, -1, 1,
          // start outer corner (2)
          0, 1, 1,
          // end inner corner (3)
          1, -1, 1,
          // end outer corner (4)
          1, 1, 1,
          // bevel end corner (5)
          1, 0, 1,
          // bottom start outer corner (6)
          0, 1, 0,
          // bottom end outer corner (7)
          1, 1, 0,
          // bottom bevel start corner (8)
          0, 0, 0,
          // bottom bevel end corner (9)
          1, 0, 0,
          // bottom start inner corner (10)
          0, -1, 0,
          // bottom end inner corner (11)
          1, -1, 0,
        ];

        return new Model(this.context.device, {
            ...this.getShaders(),
            id: this.props.id,
            bufferLayout: this.getAttributeManager()!.getBufferLayouts(),
            geometry: new Geometry({
                topology: "triangle-list",
                attributes: {
                    indices: new Uint16Array(SEGMENT_INDICES),
                    positions: {
                        value: new Float32Array(SEGMENT_POSITIONS),
                        size: 3,
                    },
                },
            }),
            isInstanced: true,
        });
    }
}
