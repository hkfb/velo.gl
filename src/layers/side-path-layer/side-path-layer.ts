import { PathLayer, type PathLayerProps } from "@deck.gl/layers";
import { project32, picking } from "@deck.gl/core";
import { fs } from "./side-path-layer-fragment.glsl";
import { vs } from "./side-path-layer-vertex.glsl";
import { Geometry, Model } from "@luma.gl/engine";

export type SidePathLayerProps<DataT> = PathLayerProps<DataT>;

/**
 * SidePathLayer:
 * --------------
 * - Extends PathLayer so we can use its multi-segment logic from getPath()
 * - Inherits width props (getWidth, widthScale, etc.)
 * - No "initializeState" override needed; parent's attributes suffice
 * - Imports "project32" and "picking" as modules, without string references
 * - Uses "project_position_to_clipspace" directly, no #include needed
 */
export class SidePathLayer extends PathLayer {
    static defaultProps = {
        ...PathLayer.defaultProps,
    };

    getShaders() {
        return {
            vs,
            fs,
            // Provide the modules as objects instead of strings:
            modules: [project32, picking],
            shaderCache: this.context.shaderCache, // optional optimization
        };
    }

    protected _getModel(): Model {
        /*
         *       _
         *        "-_ 1                   3                       5
         *     _     "o---------------------o-------------------_-o
         *       -   / ""--..__              '.             _.-' /
         *   _     "@- - - - - ""--..__- - - - x - - - -_.@'    /
         *    "-_  /                   ""--..__ '.  _,-` :     /
         *       "o----------------------------""-o'    :     /
         *      0,2                            4 / '.  :     /
         *                                      /   '.:     /
         *                                     /     :'.   /
         *                                    /     :  ', /
         *                                   /     :     o
         */

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
            //debugShaders: "always",
        });
    }
}
