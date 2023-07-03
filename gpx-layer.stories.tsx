import { DeckGL } from '@deck.gl/react'
import { GeoJsonLayer } from '@deck.gl/layers'
import { gpx } from '@tmcw/togeojson'

export default {
  title: 'GPX Layer'
  // decorators: [withKnobs],
}

// Parse the GPX file
const gpxData = gpx('Morning_Ride.gpx')

export const GPXLayer = () => {
  const [dom, setDom] = React.useState();
  fetch("Morning_Ride.gpx").then((response) => response.text()).then((xml) => {setDom(new DOMParser().parseFromString(xml, "text/xml"))});
  const layer = new GeoJsonLayer({
    id: 'gpx-layer',
    data: gpxData,
    getRadius: 100, // customize the point radius
    getFillColor: [255, 0, 0] // customize the point color
  })

  return (
    <DeckGL layers={[layer]} initialViewState={{}} controller={true}>
      <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
        Custom UI or additional components can be added here
      </div>
    </DeckGL>
  )
}
