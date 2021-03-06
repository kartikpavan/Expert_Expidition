campground = JSON.parse(campground);
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/light-v10", // style URL
  center: campground.geometry.coordinates, // starting position [lng, lat]
  zoom: 11, // starting zoom
});
// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`<h3>${campground.title}</h3>`);

const marker = new mapboxgl.Marker().setLngLat(campground.geometry.coordinates).setPopup(popup).addTo(map);
