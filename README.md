# Velo.gl

Deck.gl layer for rendering GPX tracks.

![GpxLayer](sample/velo.gl.png)

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

