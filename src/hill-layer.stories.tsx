import * as React from "react";
import { DeckGL } from "@deck.gl/react/typed";
import { HillLayer } from "./hill-layer";

const INITIAL_VIEW_STATE = {
  longitude: 8.3,
  latitude: 61.4,
  zoom: 8,
  pitch: 45,
};

export default {
  title: "Hill Layer",
};

export function HillLayerDefault() {
  const layer = new HillLayer();
  return <DeckGL layers={[layer]} />;
}

export function HillLayerCamera() {
  const layer = new HillLayer();
  return (
    <DeckGL layers={[layer]} initialViewState={INITIAL_VIEW_STATE} controller />
  );
}
