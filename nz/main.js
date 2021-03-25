
let stop = {
  nr: 22,
  name: "Tongariro National Park",
  lat: -39.29,
  lng: 175.56,
  user: "webmapping",
  wikipedia: "https://en.wikipedia.org/wiki/Tongariro_National_Park"
}

const map = L.map("map", {
  center: [ stop.lat, stop.lng ],
  zoom: 13,
  layers: [
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
  ]
});

let mrk = L.marker([ stop.lat, stop.lng ]).addTo(map);
mrk.bindPopup(`<h4>Stop ${stop.nr}: ${stop.name}<h4>
<p><a href="${stop.wikipedia}">Read about stop in Wikipedia</a></p>
`).openPopup();

console.log(document.querySelector("#map"));
