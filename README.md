# Velo.gl

[![codecov](https://codecov.io/github/hkfb/velo.gl/graph/badge.svg?token=51M41YJFGO)](https://codecov.io/github/hkfb/velo.gl)

React/Typescript library for interactive 3D visualization of GPX and TCX activities.

![GpxLayer](https://github.com/hkfb/velo.gl/raw/main/sample/velo.gl.webp)

## Features
* [Deck.gl](https://deck.gl/) [layers](./src/layers/README.md) for visualization of GPX and TCX activities.
* Map components
  * Activity Map - renders a GPX activity
  * Focus Activity Map - renders a GPX trace and automatically centers the camera around the bounds of the displayed trace
  * GPX Maptiler - renders a GPX trace on a Maptiler base map
  * GPX Hill Map - renders a GPX trace on a Maptiler satellite terrain map

## Examples
See [Storybook](https://hkfb.github.io/velo.gl/?path=/story/focus-gpx-street-map--focus-gpx-street-map-default)

## Installation

```sh
npm install velo.gl
```

## Usage
```TSX
import { GpxStreetMap } from "velo.gl";

const MyGpxMap = () => {
  const initialViewState = {
    longitude: 8.3,
    latitude: 61.4,
    zoom: 8
  };
  return <GpxStreetMap gpx={myGpxUrl} initialViewState={initialViewState} />
}
```

## Running Storybook

### Using npm to run locally:
```sh
npm ci
npm run storybook
```

### Using npm & docker-compose:
```sh
npm ci
npm run docker:compose:storybook
```

## Testing

### Run visual tests
```sh
npm ci
npm run docker:compose:test
```

### Update visual test snapshots
```sh
npm ci
npm run docker:compose:test:update
```

## Demo
Live demo: [VeloLens](https://velo-lens.com/)

