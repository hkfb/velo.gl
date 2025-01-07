import * as d3 from "d3-color";
import { Color } from "@deck.gl/core";

export const getRgba = (color: string): Color => {
    const { r, g, b, opacity } = d3.color(color)?.rgb() ?? {
        r: 0,
        g: 0,
        b: 0,
        opacity: 1,
    };
    return [r, g, b, opacity * 255];
};
