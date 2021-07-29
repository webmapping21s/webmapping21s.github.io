# Bike Trail Tirol HOWTO

Beispiel: <https://webmapping21s.github.io/tirol/>

## Etappen als Pulldown wählbar machen

* LiberOffice-Tabelle `biketirol.ods` in JSON-Datei `biketirol.js` umwandeln

    * CSV To JSON Converter <https://www.convertcsv.com/csv-to-json.htm> ansteuern 

    * Spalten und Reihen von `biketirol.ods` dorthin kopieren

    * das voreingestellte `CSV to JSON` Format verwenden das wir schon aus anderen Beispielen kennen

    * das JSON-Objekt `const BIKETIROL` als `biketirol.js` speichern - so sieht ein Record des Objekts aus

        ```javascript
        const BIKETIROL = [{
            "nr": 7,
            "user": "webmapping",
            "etappe": "Scharnitz - Achensee",
            "start": "Scharnitz",
            "laenge": "62 km",
            "hoehenmeter": "1.850 m",
            "fahrzeit": "6 h",
            "grad": "schwierig",
            "intro": "...",
            "strecke": "...",
            "weblink": "https://www.tirol.at/reisefuehrer/sport/radfahren/biketouren/a-bike-trail-tirol-scharnitz-achensee"
        }]
        ```

    * das Skript in `index.html` einbinden

        ```html
        <script src="biketirol.js"></script>
        ```

* ein `SELECT`-Element mit der Id `pulldown` in `index.html` hinzufügen

    ```html
    <!-- direkt über dem Karten-DIV -->
    <select id="pulldown"></select>
    ```

* in `main.js` gleich nach `drawTrack(selectedTrack)` mit `document.querySelector` eine Referenz auf das `select`-Element über dessen `id` speichern

    ```javascript
    let pulldown = document.querySelector("#pulldown");
    ```

* in einer `for-of` Schleife die Pulldown-Einträge über `.innerHTML` hinzufügen

    ```javascript
    for (let track of BIKETIROL) {
        pulldown.innerHTML += `<option value="${track.nr}">${track.nr}: ${track.etappe}</option>`;
    }
    ```

* den aktuellen Track über eine `if`-Abfrage vorselektieren

    ```javascript
    let selected = "";
    if (track.nr == nr) {
        selected = "selected";
    }
    pulldown.innerHTML += `<option ${selected} value="${track.nr}">${track.nr}: ${track.etappe}</option>`;
    ```

* auf Änderungen im Pulldown-Menü reagieren und den gewählten Track zeichnen

    ```javascript
    pulldown.onchange = () => {
        drawTrack(pulldown.value);
    };
    ```

* den bestehenden Track und das gezeichnete Profil müssen wir vor dem Neuzeichnen noch löschen

    ```javascript
    // zu Beginn der Funktion drawTrack
    elevationControl.clear();
    overlays.tracks.clearLayers();
    ```

* leider bleibt nach dem Wechsel auf einen neuen Track noch eine Track-Linie übrig, die das `L.control.elevation` Plugin gezeichnet hat - wir entfernen sie mit einem recht aufwendigen *Hack*:

    * zuerst definieren wir gleich oberhalb von `const drawTrack` ein neues (leeres) Objekt in dem wir uns die Track-Linie merken werden

        ```javascript
        let activeElevationTrack;
        const drawTrack = (nr) => {
            // ...
        }
        ```

    * gleich nach dem Löschen des bestehenden Tracks mit `overlays.tracks.clearLayers()` löschen wir auch die Track-Linie sofern sie vorhanden ist

        ```javascript
        overlays.tracks.clearLayers();
        if (activeElevationTrack) {
            activeElevationTrack.removeFrom(map);
        }
        ```

    * gleich unterhalb von `elevationControl.load(...)` fügen wir eine zweite Callback-Funktion hinzu in der wir uns die Track-Linie merken sobald sie geladen ist

        ```javascript
        elevationControl.load(`tracks/${nr}.gpx`);
        elevationControl.on('eledata_loaded', (evt) => {
            activeElevationTrack = evt.layer;
        });
        ```

    Damit wird die zusätzliche Track-Linie bei jedem Wechsel auf eine andere Etappe gelöscht
