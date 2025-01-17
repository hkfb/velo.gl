"use strict";

import { Layer, LayerExtension, LayerContext } from "@deck.gl/core";
import { vec3 } from "@math.gl/core";

/**
 * PathDistancePickingExtension
 *
 * This extension:
 * - Defines a `customPickingColors` attribute (size = 3) that stores a per-vertex
 *   distance value encoded as (R, G, B).
 * - Uses a `transform` callback to compute projected distance for each path.
 * - Implements a `getPickingInfo` method (not "override") to decode the distance
 *   from the picked color, storing it as info.distance.
 */
export class PathDistancePickingExtension extends LayerExtension {
    static extensionName = "PathDistancePickingExtension";
    static defaultProps = {};

    /**
     * Called once when the layer is initialized. We add the `customPickingColors`
     * attribute with a `transform` callback that returns an array of RGB
     * values (3 per vertex) encoding the distance along the path.
     */
    initializeState(this: Layer, context: LayerContext, extension: this) {
        const attributeManager = this.getAttributeManager();
        if (!attributeManager) return;

        //attributeManager.add({
        attributeManager.addInstanced({
            customPickingColors: {
                size: 3, // R, G, B
                accessor: "getPath",
                // transform is invoked once for each data object (each path).
                // Must return an array of length 3 * numVertices in that path.
                transform: (path) =>
                    extension._createPickingColorsForPath(path, this),
            },
        });
    }

    /**
     * Deck.gl will call any `getPickingInfo` methods on extensions after it determines
     * which object was picked. We remove "override" because LayerExtension does not
     * declare a parent method with this name.
     *
     * Here we decode the 24-bit distance from the picking color, storing it in `info.distance`.
     */
    public getPickingInfo({
        info,
        mode,
    }: {
        info: Record<string, any>;
        mode: string;
    }): Record<string, any> {
        const color = info.pickedColor; // e.g. [R, G, B]
        if (Array.isArray(color) && color.length >= 3) {
            // Decode 24-bit integer: distance = R + (G << 8) + (B << 16)
            const distance = color[0] + (color[1] << 8) + (color[2] << 16);
            info.distance = distance;
        }
        return info;
    }

    /**
     * Compute projected distances for all vertices in the given path, then
     * encode each distance as a 24-bit integer -> (R, G, B).
     */
    private _createPickingColorsForPath(
        path: number[][],
        layer: Layer,
    ): number[] {
        if (!Array.isArray(path) || path.length < 2) {
            // Degenerate path -> single vertex, distance = 0
            return [0, 0, 0];
        }

        // 1) Project each [longitude, latitude] or [x, y] via layer.project
        const projectedPositions: [number, number, number][] = [];
        for (const pt of path) {
            const [x, y] = layer.project(pt);
            projectedPositions.push([x, y, 0]);
        }

        // 2) Compute cumulative distances in projected space
        const distances = [0];
        let totalDist = 0;
        for (let i = 1; i < projectedPositions.length; i++) {
            totalDist += vec3.dist(
                projectedPositions[i],
                projectedPositions[i - 1],
            );
            distances.push(totalDist);
        }
        console.log(distances);

        // 3) Encode each distance as 24-bit (R, G, B)
        const colors: number[] = [];
        for (const dist of distances) {
            let distInt = Math.floor(dist);
            if (distInt < 0) distInt = 0;
            if (distInt > 16777215) distInt = 16777215;

            const r = (distInt + 1) & 0xff;
            const g = (distInt >> 8) & 0xff;
            const b = (distInt >> 16) & 0xff;

            colors.push(r, g, b);
        }

        return colors;
    }

    getShaders() {
        return {
            name: "path-distance-picking-extension",
            inject: {
                // Vertex shader: declare and set the picking color
                "vs:#decl": `
        in vec3 customPickingColors;
      `,
                "vs:#main-end": `
        // Use the custom per-vertex picking color
        picking_setPickingColor(customPickingColors);
      `,

                // Fragment shader: finalize picking color
                "fs:#main-end": `
        fragColor = picking_filterPickingColor(fragColor);
      `,
            },
        };
    }
}
