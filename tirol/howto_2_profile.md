# Bike Trail Tirol HOWTO

Beispiel: <https://webmapping21s.github.io/tirol/>

## Höhenprofil zeichnen

* Leaflet-Plugin <https://github.com/Raruto/leaflet-elevation> in `index.html` einbinden

    ```html
    <!-- Leaflet Elevation -->
    <link rel="stylesheet" href="https://unpkg.com/@raruto/leaflet-elevation/dist/leaflet-elevation.css" />
    <script src="https://unpkg.com/@raruto/leaflet-elevation/dist/leaflet-elevation.js"></script>
    ```

* ein `DIV`-Element mit der Id `profile` direkt unter dem Karten-`DIV` hinzufügen

    ```html
    <div id="profile"></div>
    ```

* die Control `L.control.elevation` in `main.js` hinzufügen

    ```javascript
    // Control für Höhenprofil hinzufügen
    const elevationControl = L.control.elevation({
        elevationDiv: "#profile",
        followMarker: false,
        theme: "lime-theme",
    }).addTo(map);
    ```

* das Höhenprofil nach dem Laden des Tracks zeichnen

    ```javascript
    gpxTrack.on("loaded", (evt) => {
        // ...

        // Höhenprofil zeichnen
        elevationControl.load(`tracks/${nr}.gpx`);
    };
    ```

* den Rahmen für das Profil in `main.css` setzen 

    ```css
    #profile {
        margin-top: 0.3em;
        border: 1px solid gray;
    }
    ```

* die zusätzlich, neu gezeichnete Track-Linie in der Karte über CSS in `main.css` verbergen

    ```css
    #map path.lime-theme.elevation-polyline {
        stroke-opacity: 0;
    }
    ```
