import * as React from "react";
import { ActivityMaptiler } from "./activity-maptiler";

export default {
    title: "Activity Maptiler",
    tags: ["no-visual-test"],
};

export function ActivityMaptilerDefault() {
    return <ActivityMaptiler></ActivityMaptiler>;
}

export function ActivityMaptilerText() {
    return (
        <ActivityMaptiler>
            <div>Activity Map Tiler story</div>
        </ActivityMaptiler>
    );
}
