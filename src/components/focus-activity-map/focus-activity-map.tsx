import * as React from "react";
import {
    ActivityMap,
    ActivityMapProps,
    INITIAL_VIEW_STATE,
} from "../activity-map";
import bbox from "@turf/bbox";
import * as _ from "lodash";
import {
    Layer,
    WebMercatorViewport,
    FlyToInterpolator,
    MapViewState,
} from "@deck.gl/core";
import { Feature, MultiLineString } from "geojson";
import { multiLineString } from "@turf/helpers";

export type FocusActivityMapProps = ActivityMapProps;

export function FocusActivityMap(args: FocusActivityMapProps) {
    const [viewState, setViewState] = React.useState<MapViewState>(
        args.initialViewState ?? INITIAL_VIEW_STATE,
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
                longitude: longitude,
                latitude: latitude,
                zoom: zoom,
                transitionDuration: 1000,
                transitionInterpolator: new FlyToInterpolator(),
            });
        },
        [setViewState],
    );

    return ActivityMap({
        ...args,
        onGpxLoad: onLoad as (data: unknown, context: unknown) => void,
        initialViewState: viewState,
    });
}
