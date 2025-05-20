maptilersdk.config.apiKey = mapKey;
const coordinates = JSON.parse(latLang);
const map = new maptilersdk.Map({
  container: "map", // container's id or the HTML element in which the SDK will render the map
  style: maptilersdk.MapStyle.STREETS,
  center: coordinates, // starting position [lng, lat]
  zoom: 14, // starting zoom
});

const customIcon = document.createElement('img');
customIcon.src = '../img/compass.png'; // <-- update this path
customIcon.style.width = '32px';
customIcon.style.height = '32px';

let popup = new maptilersdk.Popup({ offset: 25 }).setHTML(
        "<h6> Exact location will be provided after booking </h6>"
    );

const marker = new maptilersdk.Marker({ element: customIcon })
  .setLngLat(coordinates)
  .setPopup(popup) 
  .addTo(map);


console.log(latLang);
