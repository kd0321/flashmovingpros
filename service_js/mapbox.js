// Set your Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoibG9sb21nNDk5IiwiYSI6ImNtM21ia25wZDEwbjYycG9mY3F1cGE3azMifQ.IhqcnH7sqRQNGjxI_sJfDQ';
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [-74.4244, 40.5298],
  zoom: 8
});
const geocoder = new MapboxGeocoder({
  accessToken: mapboxgl.accessToken,
  mapboxgl: mapboxgl
});
document.getElementById('geocoder').appendChild(geocoder.onAdd(map));


// Add navigation controls to the map
const hqCoords = [-74.3024, 40.4593]; // 08859 (Parlin, NJ)
const hqMarker = new mapboxgl.Marker({ color: 'red' })
  .setLngLat(hqCoords)
  .setPopup(new mapboxgl.Popup().setText("HQ - 08859"))
  .addTo(map);
const hqCoord = [-74.3024, 40.4593];  // HQ location (longitude, latitude)
geocoder.on('result', (e) => {
  const destCoord = e.result.geometry.coordinates;  // [lng, lat] of selected location

  // After initializing `geocoder`:
  if (typeof window.setMileageCharge === 'function') {
    window.setMileageCharge(destCoord);
  }

  // Construct a GeoJSON LineString from HQ to the selected location
  const lineData = {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: [hqCoord, destCoord]
    }
  };

  // Add the line on the map (or update it if already added)
  if (map.getSource('route')) {
    // Update existing line’s coordinates
    map.getSource('route').setData(lineData);
  } else {
    // First time: add a new source and line layer
    map.addSource('route', { type: 'geojson', data: lineData });
    map.addLayer({
      id: 'route-line',
      type: 'line',
      source: 'route',
      layout: { 'line-join': 'round', 'line-cap': 'round' },
      paint: { 'line-color': '#007CBF', 'line-width': 4 }
    });
  }
});
