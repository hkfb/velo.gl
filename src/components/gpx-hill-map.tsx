import * as React from "react";
import {
    FocusActivityMap,
    FocusActivityMapProps,
} from "./focus-activity-map/focus-activity-map";
import { HillLayer } from "../layers/hill-layer";

/**
 * Renders a GPX trace on top of a satellite terrain map.
 */
export function GpxHillMap(args: FocusActivityMapProps) {
    const baseLayer = new HillLayer();
    return <FocusActivityMap {...args} baseLayers={[baseLayer]} />;
}
