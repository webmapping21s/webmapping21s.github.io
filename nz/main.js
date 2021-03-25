
let stop = {
  nr: 22,
  name: "Tongariro National Park",
  lat: -39.29,
  lng: 175.56,
  user: "webmapping",
  wikipedia: "https://en.wikipedia.org/wiki/Tongariro_National_Park"
}

const map = L.map("map", {
  center: [stop.lat, stop.lng],
  zoom: 13,
  layers: [
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
  ]
});

console.log(ROUTE);
for (let entry of ROUTE) {
  console.log(entry);
  let mrk = L.marker([entry.lat, entry.lng]).addTo(map);
  mrk.bindPopup(`<h4>Stop ${entry.nr}: ${entry.name}<h4>
<p><a href="${entry.wikipedia}"><i class="fas fa-external-link-alt mr-3"></i>Read about stop in Wikipedia</a></p>
`);

}


console.log(document.querySelector("#map"));
