import {
    LayerExtension,
    Layer,
    LayerContext,
    UpdateParameters,
    DefaultProps,
    TextureSource,
} from "@deck.gl/core";
import { vec3 } from "@math.gl/core";
import type { Texture, Binding } from "@luma.gl/core";
import type { Model } from "@luma.gl/engine";

/**
 * PathTextureExtensionProps
 *
 * These are the additional props that this extension expects on the layer.
 * - texture: a WebGL texture or a luma.gl Texture instance that will be sampled
 *   as a "1D strip" in the fragment shader.
 */
export interface PathTextureExtensionProps {
    /**
     * A 2D texture to be sampled as a 1D strip (in its u-direction).
     */
    texture?: TextureSource;
}

const defaultProps: DefaultProps<PathTextureExtensionProps> = {
    texture: { type: "image", value: null, async: true },
};

export class PathTextureExtension extends LayerExtension<PathTextureExtensionProps> {
    static defaultProps = defaultProps;
    static extensionName = "PathTextureExtension";

    /**
     * Return GLSL shader injection code.
     * We add a vertex attribute for distance and sample a texture in the fragment shader.
     */
    getShaders() {
        return {
            name: "path-texture-extension",
            inject: {
                // Vertex shader additions
                "vs:#decl": `
        in float instanceDistAlongPath;
        out float vTexCoord;
      `,
                "vs:#main-end": `
        // Pass instanceDistAlongPath to the fragment as vTexCoord
        vTexCoord = instanceDistAlongPath;
      `,

                // Fragment shader additions
                "fs:#decl": `
        in float vTexCoord;
        uniform sampler2D pathTexture;
        //out vec4 fragColor;
      `,
                //"fs:#main-start": `
                "fs:DECKGL_FILTER_COLOR": `
        vec4 texColor = texture(pathTexture, vec2(0.5, vTexCoord));
        color = texColor;
      `,
            },
        };
    }

    /**
     * Called once when the layer is initialized.
     * We configure an instanced attribute to store our
     * distance-based texture coordinates for each vertex.
     */
    initializeState(
        this: Layer<PathTextureExtensionProps>,
        context: LayerContext,
        extension: this,
    ) {
        const attributeManager = this.getAttributeManager();
        if (!attributeManager) {
            return;
        }

        attributeManager.addInstanced({
            instanceDistAlongPath: {
                size: 1,
                // Reuse the layer's getPath accessor
                accessor: "getPath",
                /**
                 * transform is invoked once per data object (each path).
                 * Must return an array of numeric values (one for each vertex).
                 */
                transform: (path: number[][]) =>
                    extension._getNormalizedDistances(path, this),
            },
        });

        this.setState({
            emptyTexture: this.context.device.createTexture({
                data: new Uint8Array(4),
                width: 1,
                height: 1,
            }),
        });
    }

    isEnabled(layer: Layer<PathTextureExtensionProps>): boolean {
        return "pathTesselator" in layer.state;
    }

    updateState(
        this: Layer<PathTextureExtensionProps>,
        params: UpdateParameters<Layer<PathTextureExtensionProps>>,
        extension: this,
    ) {
        if (!extension.isEnabled(this)) {
            return;
        }

        const { emptyTexture, model } = this.state;

        const bindings: Record<string, Binding> = {
            pathTexture:
                (this.props.texture as Binding) || (emptyTexture as Texture),
        };

        (model as Model)?.setBindings(bindings);
    }

    /**
     * Compute the cumulative distance of each point along a path,
     * using the provided layer's project() method (similar to how PathStyleExtension
     * calculates dash offsets). We then normalize these distances to [0..1].
     */
    private _getNormalizedDistances(
        path: number[][],
        layer: Layer<PathTextureExtensionProps>,
    ): number[] {
        if (!path || path.length < 2) {
            // Degenerate path: return a single zero
            return [0];
        }

        const projectedPositions: [number, number, number][] = [];

        // 1. Project each path vertex using layer.project()
        for (const point of path) {
            // project() typically returns [x, y], ignoring z
            const [xProjected, yProjected] = layer.project(point);
            projectedPositions.push([xProjected, yProjected, 0]);
        }

        // 2. Compute cumulative distances
        const distances: number[] = [0];
        let totalDistance = 0;
        for (let i = 1; i < projectedPositions.length; i++) {
            const d = vec3.dist(
                projectedPositions[i],
                projectedPositions[i - 1],
            );
            totalDistance += d;
            distances.push(totalDistance);
        }

        // 3. Normalize distances to [0..1]
        const maxDist = totalDistance || 1;
        for (let i = 0; i < distances.length; i++) {
            distances[i] /= maxDist;
        }

        return distances;
    }
}
