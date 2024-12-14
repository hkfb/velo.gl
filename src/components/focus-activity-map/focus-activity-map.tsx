import { ActivityMap, ActivityMapProps } from "../activity-map";
import { useActivityView } from "../../hooks/useActivityView";

export type FocusActivityMapProps = ActivityMapProps;

export function FocusActivityMap(args: FocusActivityMapProps) {
    const { onLoad, viewState } = useActivityView(args.initialViewState);

    return ActivityMap({
        ...args,
        onGpxLoad: onLoad as (data: unknown, context: unknown) => void,
        initialViewState: viewState,
    });
}
