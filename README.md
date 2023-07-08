# Velo.gl

Map components and [Deck.gl](https://deck.gl/) layers for rendering GPX tracks.

![GpxLayer](sample/velo.gl.png)

## Examples
See [Storybook](https://hkfb.github.io/velo.gl/?path=/story/gpx-layer--gpx-layer-default)

## Running Storybook

### Using npm to run locally:
```sh
npm ci
npm run storybook
```

### Using npm & docker:
```sh
npm run docker:storybook
```

### Using npm & docker-compose:
```sh
npm run docker:compose:storybook
```

### Using docker directly:
```sh
docker run --rm -it $(docker build -q .)
```

### Using docker-compose directly:
```sh
docker-compose up --build
```

