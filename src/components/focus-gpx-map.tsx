import * as React from "react";
import { GpxMap, GpxMapProps, INITIAL_VIEW_STATE } from "./gpx-map";
import bbox from "@turf/bbox";
import * as _ from "lodash";
import {
    Layer,
    WebMercatorViewport,
    FlyToInterpolator,
    MapViewState,
} from "@deck.gl/core/typed";
import { FeatureCollection } from "geojson";

export type FocusGpxMapProps = Omit<GpxMapProps, "initialViewState">;

export function FocusGpxMap(args: FocusGpxMapProps) {
    const [viewState, setViewState] =
        React.useState<MapViewState>(INITIAL_VIEW_STATE);

    const onLoad = React.useCallback(
        (data: FeatureCollection, info: { propName: string; layer: Layer }) => {
            const viewport = info.layer.context.viewport as WebMercatorViewport;
            const bounds = _.chunk(bbox(data), 2) as [
                [number, number],
                [number, number],
            ];
            const fit = viewport.fitBounds(bounds, { padding: 20 });
            const { longitude, latitude, zoom } = fit;
            setViewState({
                longitude: longitude,
                latitude: latitude,
                zoom: zoom,
                transitionDuration: 1000,
                transitionInterpolator: new FlyToInterpolator(),
            });
        },
        [setViewState],
    );

    return GpxMap({
        ...args,
        onGpxLoad: onLoad as (data: unknown, context: unknown) => void,
        initialViewState: viewState,
    });
}
