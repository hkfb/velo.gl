import { PathLayer, type PathLayerProps } from "@deck.gl/layers";
import { project32, picking, UNIT } from "@deck.gl/core";
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

    /*
    initializeState() {
        super.initializeState();
        this.setState({
            sideModel: this._getSideModel(),
        });
    }
    */

    /*
    draw({ uniforms }) {
        super.draw({ uniforms });
        const {
            jointRounded,
            capRounded,
            billboard,
            miterLimit,
            widthUnits,
            widthScale,
            widthMinPixels,
            widthMaxPixels,
        } = this.props;

        const model = this.state.sideModel!;
        model.setUniforms(uniforms);
        model.setUniforms({
            jointType: Number(jointRounded),
            capType: Number(capRounded),
            billboard,
            widthUnits: UNIT[widthUnits],
            widthScale,
            miterLimit,
            widthMinPixels,
            widthMaxPixels,
        });
        model.draw(this.context.renderPass);
    }
    */

    getShaders() {
        return {
            vs,
            fs,
            // Provide the modules as objects instead of strings:
            modules: [project32, picking],
            shaderCache: this.context.shaderCache, // optional optimization
        };
    }

    /*
    _getSideModel() {
        // 1. Create luma.gl Geometry with side-wall vertices + indices
        //    For demonstration, let's define a simple rectangle in "template space".
        //    The vertex shader will interpret instance attributes to extrude them
        //    around each path segment from bottom (z=0) to the path’s z.
        //
        //    Example: a single quad with corners: (-1, 0), (-1, 1), (1, 1), (1, 0).
        //    We’ll rely on the vertex shader to shape it (width, height, offset, etc.)
        //
        //    If you want each segment's left/right walls, you might replicate or expand
        //    to 8 corners. Keep it minimal for demonstration.

        // prettier-ignore
        const VERTICES = new Float32Array([
            // x,   y
            -1.0, 0.0, // bottom-left corner
            -1.0, 1.0, // top-left corner
            1.0, 1.0, // top-right corner
            1.0, 0.0, // bottom-right corner
        ]);

        // Triangulate (2 triangles): [0,1,2], [0,2,3]
        const INDICES = new Uint16Array([0, 1, 2, 0, 2, 3]);

        const geometry = new Geometry({
            id: `${this.props.id}-side-geometry`,
            topology: "triangle-list",

            attributes: {
                // "positions" is the non-instanced, "template" geometry
                // that the vertex shader will reshape for each instance
                side_positions: {
                    size: 2, // (x, y)
                    value: VERTICES,
                },
            },
            indices: INDICES,
        });

        // 2. Create a luma.gl Model using your custom side-face vertex/fragment shaders
        //    Typically you'd do getShaders() or specify {vs, fs} inline.
        //    For demonstration, let's say we have them in `this.getShaders()`.
        const { vs, fs, modules } = this.getShaders();

        return new Model(this.context.device, {
            id: `${this.props.id}-side-model`,
            vs,
            fs,
            modules,
            //shaderCache,
            geometry,
            isInstanced: true, // so we can draw multiple path segments in one pass
            // The instanceCount is set later in draw/updateState, based on how many segments
        });
    }
    */

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
          6, 4, 9,
          9, 4, 5,
        ];

        // [0] position on segment - 0: start, 1: end
        // [1] side of path - -1: left, 0: center (joint), 1: right
        // [2] elevation of path - 0: bottom, 1: top
        // prettier-ignore
        const SEGMENT_POSITIONS = [
          // bevel start corner
          0, 0, 1,
          // start inner corner
          0, -1, 1,
          // start outer corner (2)
          0, 1, 1,
          // end inner corner
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
