import { type DeckGLProps } from "@deck.gl/react";

export const TEIDE_ACTIVITY_FILE = "Teide.tcx";

export const JR_ACTIVITY_FILE = "Jotunheimen_rundt.gpx";

export const JR_INITIAL_VIEW_STATE: DeckGLProps["initialViewState"] = {
    longitude: 8.3,
    latitude: 61.4,
    zoom: 8,
};

export const JR_PITCHED_VIEW_STATE: DeckGLProps["initialViewState"] = {
    ...JR_INITIAL_VIEW_STATE,
    pitch: 45,
};
