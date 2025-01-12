import * as d3 from "d3-color";
import { Color } from "@deck.gl/core";
import { type TextureProps } from "@luma.gl/core";

export const getRgba = (color: string): Color => {
    const { r, g, b, opacity } = d3.color(color)?.rgb() ?? {
        r: 0,
        g: 0,
        b: 0,
        opacity: 1,
    };
    return [r, g, b, opacity * 255];
};

function defaultColorScale(t: number): [number, number, number, number] {
    // Map t in [0, 1] to a color
    // For example, from blue to red
    const r = t * 255;
    const g = 0;
    const b = (1 - t) * 255;
    const a = 255;
    return [r, g, b, a];
}

export function createGradientTexture(
    colorScale: (
        t: number,
    ) => [number, number, number, number] = defaultColorScale,
    size = 256,
): TextureProps {
    const data = new Uint8Array(size * 4); // RGBA for each pixel

    for (let i = 0; i < size; i++) {
        const t = i / (size - 1);
        const [r, g, b, a] = colorScale(t);
        data[i * 4 + 0] = r;
        data[i * 4 + 1] = g;
        data[i * 4 + 2] = b;
        data[i * 4 + 3] = a;
    }

    const textureParams: TextureProps = {
        width: 1,
        height: size,
        data,
    };

    return textureParams;
}
