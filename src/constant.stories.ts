import { type MapViewState } from "@deck.gl/core";

export const TEIDE_ACTIVITY_FILE = "Teide.tcx";

export const JR_ACTIVITY_FILE = "Jotunheimen_rundt.gpx";

export const JR_INITIAL_VIEW_STATE: MapViewState = {
    longitude: 8.3,
    latitude: 61.4,
    zoom: 8,
};

export const JR_PITCHED_VIEW_STATE: MapViewState = {
    ...JR_INITIAL_VIEW_STATE,
    pitch: 45,
};

export const SYNTHETIC_VIEW_STATE: MapViewState = {
    ...JR_PITCHED_VIEW_STATE,
    zoom: 7,
};
