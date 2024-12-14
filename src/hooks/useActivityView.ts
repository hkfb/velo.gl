import * as React from "react";
import {
    Layer,
    WebMercatorViewport,
    FlyToInterpolator,
    MapViewState,
} from "@deck.gl/core";
import {
    ActivityMapProps,
    INITIAL_VIEW_STATE,
} from "../components/activity-map";
import { multiLineString } from "@turf/helpers";
import * as _ from "lodash";
import bbox from "@turf/bbox";
import { Feature, MultiLineString } from "geojson";

/**
 * Custom React hook for calculating a view state when activity layer
 * data has loaded.
 */
export const useActivityView = (
    initialViewState: ActivityMapProps["initialViewState"],
) => {
    const [viewState, setViewState] = React.useState<MapViewState>(
        initialViewState ?? INITIAL_VIEW_STATE,
    );

    const onLoad = React.useCallback(
        (data: number[][][], info: { propName: string; layer: Layer }) => {
            const viewport = info.layer.context.viewport as WebMercatorViewport;
            const polylines = multiLineString(data);
            const bounds = _.chunk(
                bbox(polylines as Feature<MultiLineString>),
                2,
            ) as [[number, number], [number, number]];
            const fit = viewport.fitBounds(bounds, { padding: 20 });
            const { longitude, latitude, zoom } = fit;
            setViewState({
                ...viewState,
                longitude,
                latitude,
                zoom,
                transitionDuration: 1000,
                transitionInterpolator: new FlyToInterpolator(),
            });
        },
        [setViewState],
    );

    return { onLoad, viewState };
};
