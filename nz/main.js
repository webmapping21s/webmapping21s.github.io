let stop = {
    nr: 22,
    name: "Tongariro National Park",
    lat: -39.29,
    lng: 175.56,
    user: "webmapping",
    wikipedia: "https://en.wikipedia.org/wiki/Tongariro_National_Park"
}


const map = L.map("map", {
    // center: [stop.lat, stop.lng],
    // zoom: 13,
    layers: [
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
    ]
});

let pulldown = document.querySelector('#navigation');
console.log('Navigation HTML Element: ', pulldown);
// console.log(ROUTE);

ROUTE.sort((stop1, stop2) => {
    if (stop1.nr > stop2.nr) {
        return 1;
    } else {
        return -1;
    }
});
for (let entry of ROUTE) {
    // console.log(entry);

    pulldown.innerHTML += `<option value="${entry.user}">Stop ${entry.nr}: ${entry.name}</option>`;
    let mrk = L.marker([entry.lat, entry.lng]).addTo(map);
    mrk.bindPopup(`<h4>Stop ${entry.nr}: ${entry.name}<h4>
<p><a href="${entry.wikipedia}"><i class="fas fa-external-link-alt mr-3"></i>Read about stop in Wikipedia</a></p>
`);

    if (entry.nr == stop.nr) {
        map.setView([entry.lat, entry.lng], 13);
        mrk.openPopup();
    }
}

pulldown.selectedIndex = 22 - 1;
pulldown.onchange = (evt) => {
    let user = pulldown.value;
    let link = `https://${user}.github.io/nz/index.html`;
    //console.log(link);
    window.location.href = link;
}

console.log(document.querySelector("#map"));

L.control.fullscreen().addTo(map);

let miniMap = new L.Control.MiniMap(
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'), {
        toggleDisplay: true,
        minimized: false
    }
).addTo(map);