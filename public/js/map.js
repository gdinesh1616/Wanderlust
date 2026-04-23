import * as maptilersdk from '@maptiler/sdk';

maptilersdk.config.apiKey = mapToken;
const map = new maptilersdk.Map({
container: 'map', // container's id or the HTML element to render the map
style: maptilersdk.MapStyle.STREETS,
center: [91.6951352,26.1921003], // starting position [lng, lat]
zoom: 11.7, // starting zoom
});
