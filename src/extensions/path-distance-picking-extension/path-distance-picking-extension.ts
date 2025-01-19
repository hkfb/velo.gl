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
            modules: [picking],
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

          int r = distInt & 255;          // low byte
          int g = (distInt >> 8) & 255;   // mid byte
          int b = (distInt >> 16) & 255;  // high byte

          // Convert [0..255] -> [0..1]
          //return vec3(float(r), float(g), float(b)) / 255.0;
          return vec3(float(r), float(g), float(b));
        }
      `,
                "vs:#main-end": `
        // Use the custom per-vertex picking color
        //picking_setPickingColor(customPickingColors);
        //picking_setPickingAttribute(instanceDistAlongPath);
        //vec3 pickingColor = encodeDistanceToRGB(instanceDistAlongPath);
        //picking_setPickingColor(pickingColor);
        vDistAlongPath = instanceDistAlongPath;
      `,

                // Fragment shader: finalize picking color
                "fs:#decl": `
        precision highp float;

        in float vDistAlongPath;
        vec4 fPickingColor;

        // Normalize unsigned byte color to 0-1 range
        vec3 picking_normalizeColor(vec3 color) {
          return picking.useFloatColors > 0.5 ? color : color / 255.0;
        }

        // Normalize unsigned byte color to 0-1 range
        vec4 picking_normalizeColor(vec4 color) {
          return picking.useFloatColors > 0.5 ? color : color / 255.0;
        }

        bool picking_isColorZero(vec3 color) {
          return dot(color, vec3(1.0)) < 0.00001;
        }

        bool picking_isColorValid(vec3 color) {
          return dot(color, vec3(1.0)) > 0.00001;
        }

        // Check if this vertex is highlighted 
        bool isVertexHighlighted(vec3 vertexColor) {
          vec3 highlightedObjectColor = picking_normalizeColor(picking.highlightedObjectColor);
          return
            bool(picking.isHighlightActive) && picking_isColorZero(abs(vertexColor - highlightedObjectColor));
        }

        // Set the current picking color
        void picking_setPickingColor(vec3 pickingColor) {
          pickingColor = picking_normalizeColor(pickingColor);

          if (bool(picking.isActive)) {
            // Use alpha as the validity flag. If pickingColor is [0, 0, 0] fragment is non-pickable
            fPickingColor.a = float(picking_isColorValid(pickingColor));
            //picking_vRGBcolor_Avalid.a = float(picking_isColorValid(pickingColor));

            if (!bool(picking.isAttribute)) {
              // Stores the picking color so that the fragment shader can render it during picking
              fPickingColor.rgb = pickingColor;
              //picking_vRGBcolor_Avalid.rgb = pickingColor;
            }
          } else {
            // Do the comparison with selected item color in vertex shader as it should mean fewer compares
            fPickingColor.a = float(isVertexHighlighted(pickingColor));
            //picking_vRGBcolor_Avalid.a = float(isVertexHighlighted(pickingColor));
          }
        }

        // Encode a float distance (0..16777215) into an RGB color [0..1].
        vec3 encodeDistanceToRGB(float distance) {
          float distClamped = clamp(distance, 0.0, 16777215.0);
          int distInt = int(floor(distClamped + 0.5));

          int r = distInt & 255;          // low byte
          int g = (distInt >> 8) & 255;   // mid byte
          int b = (distInt >> 16) & 255;  // high byte

          // Convert [0..255] -> [0..1]
          return vec3(float(r), float(g), float(b));
          //return vec3(float(r), float(g), float(b)) / 255.0;
        }
      `,

                "fs:#main-start": `
        vec3 pickingColor = encodeDistanceToRGB(vDistAlongPath);
        picking_setPickingColor(pickingColor);
      `,
                "fs:#main-end": `
        //vec3 pickingColor = encodeDistanceToRGB(vDistAlongPath);
        /*
        if (bool(picking.isActive)) {
            fragColor = vec4(pickingColor, 1.);
        }
        */
        //fragColor = picking_filterPickingColor(fragColor);
        if (bool(picking.isActive)) {
            fragColor = fPickingColor;
        }

      `,
            },
        };
    }

    /*
    override draw(this: Layer, { moduleParameters, ...args }: any) {
        //args.moduleParameters.picking.isAttribute = true;
        this.setShaderModuleProps({
            ...moduleParameters,
            picking: {
                ...moduleParameters.picking,
                isAttribute: true,
                //useFloatColors: true,
            },
        });
        //console.log(args);
    }
    */
}
