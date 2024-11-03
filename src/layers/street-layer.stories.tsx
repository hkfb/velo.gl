import React from "react";
import { DeckGL } from "@deck.gl/react";
import { StreetLayer } from "./street-layer";

export default {
    title: "Street Layer",
};

const INITIAL_VIEW_STATE = {
    longitude: 8.3,
    latitude: 61.4,
    zoom: 8,
};

export function StreetLayerStory() {
    return (
        <DeckGL
            layers={[new StreetLayer()]}
            controller
            initialViewState={INITIAL_VIEW_STATE}
        />
    );
}
