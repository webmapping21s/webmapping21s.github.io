# Bike Trail Tirol HOWTO

Beispiel: <https://webmapping21s.github.io/tirol/>


## GPX-Daten von Bike Trail Tirol visualisieren

Quelle: <https://www.tirol.at/reisefuehrer/sport/radfahren/biketouren/3?form=biketours&query=&theme%5B0%5D=1>


### 1. Wir starten mit dem Template

* Vorlage <https://webmapping21s.github.io/templates/tirol_template.zip>
* Zielort <https://webmapping21s.github.io/tirol>

* Inhalt 
    * einfache Grundkarte mit *basemap.at* Hintergrund-Layern und einem leeren Overlay für die GPX-Tracks
    * GPX-Tracks der einzelnen Etappen mit der Etappennummer als Name im Unterverzeichnis `tracks/`
    * Icons für die Etappennummern, das Etappenziel und Wikipedia-Rubriken im Unterverzeichnis `icons/`
    * Etappenzuweisung und Metadaten für jede Etappe in `biketirol.ods`


### 2. Funktion zum Zeichnen des GPX-Tracks

* in `main.js` gleich unterhalb von `overlays.tracks.addTo(map);` eine leere Funktion `drawTrack` mit der Etappennummer `nr` als Argument erstellen und mit der eigenen Etappennummer, die wir als Konstante `selectedTrack` definieren, aufrufen

    ```javascript
    const drawTrack = (nr) => {
        console.log(nr);
    };
    const selectedTrack = 7;
    drawTrack(selectedTrack);
    ```

* das GPX-Plugin in `index.html` einbinden

    ```html
    <!-- Leaflet GPX -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/leaflet-gpx/1.5.2/gpx.js" integrity="sha512-g9o797RsNE2vtoxW8hWRPP42OSMvsJuGZrdP0kPaLwDUBxOn7bfzKoE1bUtsZFA2A15XZeMACjdy2ME1C4OQ+w==" crossorigin="anonymous"></script>
    ```

* den GPX-Track laden und in das vorbereitete Overlay `overlays.tracks` schreiben

    ```javascript
    // GPX-Track laden
    let gpxTrack = new L.GPX(`tracks/${nr}.gpx`, {
        async: true,
    }).addTo(overlays.tracks);
    ```

 * die fehlenden `pin-icon-*.png` Icons mit `marker_options` setzen

    ```javascript
    async: true,
    marker_options: {
        startIconUrl: `icons/number_${nr}.png`,
        endIconUrl: "icons/finish.png",
        shadowUrl: null,
    }
    ```

* die Track-Linie mit `polyline_options` schwarz strichliert zeichnen
    ```javascript
    marker_options: {
        // ..
    },
    polyline_options: {
        color: "black",
        dashArray: [2, 5],
    }
    ```

* auf den gezeichneten Track blicken sobald er geladen ist

    ```javascript
    // nach dem Laden ...
    gpxTrack.on("loaded", () => {
        // Ausschnitt auf den GPX-Track setzen
        map.fitBounds(gpxTrack.getBounds());
    });
    ```

* GPX-Track Eigenschaften als Popup anzeigen

    ```javascript
    // GPX-Track Eigenschaften als Popup anzeigen
    gpxTrack.bindPopup(`
        <h3>${gpxTrack.get_name()}</h3>
        <ul>
            <li>Streckenlänge: ${gpxTrack.get_distance()} m</li>
            <li>tiefster Punkt: ${gpxTrack.get_elevation_min()} m</li>
            <li>höchster Punkt: ${gpxTrack.get_elevation_max()} m</li>
            <li>Höhenmeter bergauf: ${gpxTrack.get_elevation_gain()} m</li>
            <li>Höhenmeter bergab: ${gpxTrack.get_elevation_loss()} m</li>
        </ul>
    `);
    ```

* die Werte im Popup sollten natürlich noch sinnvoll formatiert werden - z.B. die Streckenlänge in Kilometern oder gerundete Werte bei den Höhenangaben ;-)