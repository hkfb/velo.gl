import * as React from "react";
import { GpxMaptiler } from "./gpx-maptiler";

export default {
    title: "GPX Maptiler",
    tags: ["no-visual-test"],
};

export function GpxMaptilerDefault() {
    return <GpxMaptiler></GpxMaptiler>;
}

export function GpxMaptilerText() {
    return (
        <GpxMaptiler>
            <div>GPX Map Tiler story</div>
        </GpxMaptiler>
    );
}
