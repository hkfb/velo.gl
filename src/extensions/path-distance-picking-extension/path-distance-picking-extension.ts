"use strict";

import { Layer, LayerExtension, LayerContext, picking } from "@deck.gl/core";
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
            instanceDistAlongPath: {
                size: 1,
                accessor: "getPath",
                transform: (path) =>
                    extension._getPerVertexDistances(path, this),
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
    /*
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
   */

    private _getPerVertexDistances(path: number[][], layer: Layer): number[] {
        if (!Array.isArray(path) || path.length < 2) {
            // Degenerate path -> single vertex, distance = 0
            return [0, 0, 0];
        }

        // 1) Project each [longitude, latitude] or [x, y] via layer.project
        const projectedPositions: [number, number, number][] = [];
        for (const pt of path) {
            const [x, y] = layer.projectPosition(pt);
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
        console.log("projectedPositions: ", projectedPositions);

        return distances;
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

    override getShaders() {
        return {
            name: "path-distance-picking-extension",
            inject: {
                // Vertex shader: declare and set the picking color
                "vs:#decl": `
        in float instanceDistAlongPath;
        //in vec3 customPickingColors;
        out float vDistAlongPath;        // pass to fragment

        // Encode a float distance (0..16777215) into an RGB color [0..1].
        vec3 encodeDistanceToRGB(float distance) {
          float distClamped = clamp(distance, 0.0, 16777215.0);
          int distInt = int(floor(distClamped + 0.5));

          int r = distInt & 0xFF;          // low byte
          int g = (distInt >> 8) & 0xFF;   // mid byte
          int b = (distInt >> 16) & 0xFF;  // high byte

          // Convert [0..255] -> [0..1]
          //return vec3(float(r), float(g), float(b)) / 255.0;
          //return vec3(float(r), float(g), float(b));
          return vec3(float(r + 1), float(g), float(b));
        }

        // calculate line join positions
        float getSegmentLength(
          vec3 prevPoint, vec3 currPoint, vec3 nextPoint,
          vec2 width, bool billboard, vec3 positions
        ) {
          bool isEnd = positions.x > 0.0;

          vec3 deltaA3 = (currPoint - prevPoint);
          vec3 deltaB3 = (nextPoint - currPoint);

          mat3 rotationMatrix;
          bool needsRotation = !billboard && project_needs_rotation(currPoint, rotationMatrix);
          if (needsRotation) {
            deltaA3 = deltaA3 * rotationMatrix;
            deltaB3 = deltaB3 * rotationMatrix;
          }
          vec2 deltaA = deltaA3.xy / width;
          vec2 deltaB = deltaB3.xy / width;

          deltaA = deltaA / project_uCommonUnitsPerMeter.xy;
          deltaB = deltaB / project_uCommonUnitsPerMeter.xy;

          float lenA = length(deltaA);
          float lenB = length(deltaB);

          // length of the segment
          float L = isEnd ? lenA : lenB;
          return L;
        }
      `,
                "vs:#main-end": `
        // Use the custom per-vertex picking color
        vec3 segmentStart = project_position(instanceStartPositions, instanceStartPositions64Low);
        vec3 segmentEnd = project_position(instanceEndPositions, instanceEndPositions64Low);

        vec3 deltaCommon = segmentEnd - segmentStart;
        float deltaMeters = length(deltaCommon.xy / project_uCommonUnitsPerMeter.xy);
        deltaMeters /= project_size();
        float segmentUnits = length(deltaCommon.xy);

        //float segmentLength = getSegmentLength(prevPosition, currPosition, nextPosition, width.xy, billboard, positions);

        //float deltaACommon = distance(currPosition, prevPosition);
        //float deltaBCommon = distance(nextPosition, currPosition);
        //float segmentLengthCommon = mix(deltaBCommon, deltaACommon, isEnd);

        //float distUnits = mix(instanceDistAlongPath, instanceDistAlongPath + segmentLengthCommon, isEnd);
        float distUnits = mix(instanceDistAlongPath, instanceDistAlongPath + segmentUnits, isEnd);

        float distMeters = distUnits / project_uCommonUnitsPerMeter.z / project_size();

        vec3 pickingColor = encodeDistanceToRGB(distMeters);
        
        //vec3 pickingColor = encodeDistanceToRGB(instanceDistAlongPath / project_uCommonUnitsPerMeter.z);
        //vec3 pickingColor = encodeDistanceToRGB(d / project_uCommonUnitsPerMeter.z);

        picking_setPickingColor(pickingColor);
        //vColor = vec4(pickingColor, 1.);
      `,

                // Fragment shader: finalize picking color
                "fs:#decl": `
        //precision highp float;
      `,
                "fs:#main-end": `
        fragColor = picking_filterPickingColor(fragColor);
      `,
            },
        };
    }

    /*
    override draw(this: Layer, params: any, extension: this) {
        this.setShaderModuleProps({
            picking: {
                isAttribute: true,
                useFloatValues: true,
            },
        });
    }
    */
}
