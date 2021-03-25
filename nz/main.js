const map = L.map("map", {
  center: [ -39.29, 175.56  ],
  zoom: 13,
  layers: [
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
  ]
});
