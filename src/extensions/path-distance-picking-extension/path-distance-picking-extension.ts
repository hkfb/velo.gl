"use strict";

import { Layer, LayerExtension, LayerContext, picking } from "@deck.gl/core";
import { vec3 } from "@math.gl/core";

/**
 * A deck.gl layer extension for picking the distance along a path.
 *
 * Does not work for segments longer than 255 meters.
 */
export class PathDistancePickingExtension extends LayerExtension {
    static extensionName = "PathDistancePickingExtension";
    static defaultProps = {};

    /**
     * Called once when the layer is initialized. We add the `customPickingColors`
     * attribute with a `transform` callback that returns an array of RGB
     * values (3 per vertex) encoding the distance along the path.
     */
    override initializeState(
        this: Layer,
        context: LayerContext,
        extension: this,
    ) {
        const attributeManager = this.getAttributeManager();
        if (!attributeManager) return;

        attributeManager.addInstanced({
            instanceDistAlongPath: {
                size: 1,
                accessor: "getPath",
                transform: (path) =>
                    extension._getPerVertexDistances(path, this),
            },
        });
    }

    private _getPerVertexDistances(path: number[][], layer: Layer): number[] {
        if (!Array.isArray(path) || path.length < 2) {
            // Degenerate path -> single vertex, distance = 0
            return [0, 0, 0];
        }

        // Project each [longitude, latitude] or [x, y]
        const projectedPositions: [number, number, number][] = [];
        for (const pt of path) {
            const [x, y] = layer.projectPosition(pt);
            projectedPositions.push([x, y, 0]);
        }

        // Compute cumulative distances in projected space
        const distances = [0];
        let totalDist = 0;
        for (let i = 1; i < projectedPositions.length; i++) {
            totalDist += vec3.dist(
                projectedPositions[i],
                projectedPositions[i - 1],
            );
            distances.push(totalDist);
        }

        return distances;
    }

    override getShaders() {
        return {
            name: "path-distance-picking-extension",
            inject: {
                // Vertex shader: declare and set the picking color
                "vs:#decl": `
        in float instanceDistAlongPath;
        out float pathDistance;

        // Encode a float distance (0..16777215) into an RGB color.
        vec3 encodeDistanceToRGB(float distance) {
          float distClamped = clamp(distance, 0.0, 16777215.0);
          int distInt = int(floor(distClamped + 0.5));

          int r = distInt & 0xFF;          // low byte
          int g = (distInt >> 8) & 0xFF;   // mid byte
          int b = (distInt >> 16) & 0xFF;  // high byte

          return vec3(float(r + 1), float(g), float(b));
        }
      `,
                "vs:#main-end": `
        // Use the custom per-vertex picking color
        vec3 segmentStart = project_position(instanceStartPositions, instanceStartPositions64Low);
        vec3 segmentEnd = project_position(instanceEndPositions, instanceEndPositions64Low);

        vec3 deltaCommon = segmentEnd - segmentStart;

        float segmentUnits = length(deltaCommon.xy);

        float distUnits = mix(instanceDistAlongPath, instanceDistAlongPath + segmentUnits, isEnd);

        float distMeters = distUnits / project_uCommonUnitsPerMeter.z / project_size();

        vec3 pickingColor = encodeDistanceToRGB(distMeters);

        //picking_setPickingColor(pickingColor);
        picking_vRGBcolor_Avalid.r = distMeters;

        pathDistance = distMeters;
      `,
                "fs:#decl": `
        in float pathDistance;

        // Encode a float distance (0..16777215) into an RGB color.
        vec3 encodeDistanceToRGB(float distance) {
          float distClamped = clamp(distance, 0.0, 16777215.0);
          int distInt = int(floor(distClamped + 0.5));

          int r = distInt & 0xFF;          // low byte
          int g = (distInt >> 8) & 0xFF;   // mid byte
          int b = (distInt >> 16) & 0xFF;  // high byte

          return vec3(float(r + 1), float(g), float(b)) / 255.;
        }
      `,
                "fs:#main-end": `
        //fragColor = picking_filterPickingColor(fragColor);
                //
        if (bool(picking.isActive)) {
            fragColor.rgb = encodeDistanceToRGB(picking_vRGBcolor_Avalid.r);
            //fragColor.rgb = encodeDistanceToRGB(pathDistance);
        }
      `,
            },
        };
    }
}
