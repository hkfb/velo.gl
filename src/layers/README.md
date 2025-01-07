# Deck.gl layers

[Deck.gl](https://deck.gl/) layers for visualization of GPX and TCX activities.

## Activity Layer
Renders GPX and TCX activities as extruded paths.

### Example
```TSX
const data = "https://hkfb.github.io/velo.gl/Jotunheimen_rundt.gpx";

const initialViewState = {
    longitude: 8.3,
    latitude: 61.4,
    zoom: 8,
    pitch: 45,
}

const MyActivityMap = () => {
    const layer = new ActivityLayer({ data });
    return (
        <DeckGL
            layers={[layer]}
            initialViewState={initialViewState}
            controller
        ></DeckGL>
    );
};
```

See also [Activity Layer Story](https://hkfb.github.io/velo.gl/?path=/docs/layers-activity-layer--docs)

## Profile Layer
Renders paths extruded vertically from sea level, from a set of 3D polylines.

## Trip GPX Layer
Renders the position along a GPX trace at a given time.

## Extruded Path Layer
Extends the [Deck.gl Path Layer](https://deck.gl/docs/api-reference/layers/path-layer) with vertical extrusion of paths.

See also [Extruded Path Layer Story](https://hkfb.github.io/velo.gl/?path=/docs/layers-extruded-path-layer--docs)
