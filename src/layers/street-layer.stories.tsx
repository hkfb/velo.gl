import * as React from "react";
import { DeckGL } from "@deck.gl/react";
import { StreetLayer } from "./street-layer";
import { JR_INITIAL_VIEW_STATE } from "../constant.stories";

export default {
    title: "Street Layer",
};

export function StreetLayerStory() {
    return (
        <DeckGL
            layers={[new StreetLayer()]}
            controller
            initialViewState={JR_INITIAL_VIEW_STATE}
        />
    );
}
