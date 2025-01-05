import * as React from "react";
import { DeckGL } from "@deck.gl/react";
import { HillLayer } from "./hill-layer";
import { JR_PITCHED_VIEW_STATE } from "../constant.stories";

export default {
    title: "Hill Layer",
    tags: ["no-visual-test"],
};

export function HillLayerDefault() {
    const layer = new HillLayer();
    return <DeckGL layers={[layer]} />;
}

export function HillLayerCamera() {
    const layer = new HillLayer();
    return (
        <DeckGL
            layers={[layer]}
            initialViewState={JR_PITCHED_VIEW_STATE}
            controller
        />
    );
}
