# Bike Trail Tirol HOWTO

Beispiel: <https://webmapping21s.github.io/tirol/>

## Wikipedia-Artikel als Marker anzeigen

### 1. ein neues Overlay für die Wikipedia-Marker erstellen

* bei `let overlays`:

    ```javascript
    {
        tracks: L.featureGroup(),
        wikipedia: L.featureGroup()
    }
    ```

* bei `let layerControl`:

    ```javascript
    {
        "GPX-Tracks": overlays.tracks,
        "Wikipedia-Artikel": overlays.wikipedia
    }
    ```

* unterhalb von `let layerControl`:

    ```javascript
    overlays.tracks.addTo(map);
    overlays.wikipedia.addTo(map);
    ```

### 2. eine neue Funktion zum Zeichnen der Marker definieren

* die neue Funktion zum Zeichnen der Wikipedia-Marker schreiben wir gleich unterhalb des Blocks mit der *Elevation-Control*. Wir werden ihr später den gewünschten Kartenausschnitt im Argument `bounds` übergeben:

    ```javascript
    const drawWikipedia = (bounds) => {
        console.log(bounds);
    };
    ```

* die Funktion `drawWikipedia` ist vorbereitet und wir können sie am Ende der `gpxTrack.on("loaded")` Funktion aufrufen. Als Ausschnitt übergeben wir den Extent des geladenen gpx-Tracks.

    ```javascript
    gpxTrack.on("loaded", () => {
        // ..
        drawWikipedia(gpxTrack.getBounds());
    });
    ```

* in `drawWikipedia` setzen wir dann über *Template-Syntax* die Eckkordinaten des `bounds`-Objekts mit `getNorth(), getSouth(), getEast(), getWest()` in die URL für den Aufruf des GeoNames-Webservices [wikipediaBoundingBoxJSON](https://www.geonames.org/export/wikipedia-webservice.html#wikipediaBoundingBox) ein. Im Gegensatz zum Demo-Beispiel verwenden wir `https://secure.geonames.org` als Server. Als Sprache für die Wikipedia-Artikel wählen wir Deutsch (`lang=de`), die Anzahl der gewünschten Artikel bestimmen wir mit 30 (`maxRows=30`) und als `username` verwenden wir den User, den wir uns bei <https://www.geonames.org/> erstellt haben:

    ```javascript
    let url = `https://secure.geonames.org/wikipediaBoundingBoxJSON?north=${bounds.getNorth()}&south=${bounds.getSouth()}&east=${bounds.getEast()}&west=${bounds.getWest()}&username=webmapping&lang=de&maxRows=30`;
    console.log(url);
    ```

* der fertige Link lautet damit: <https://secure.geonames.org/wikipediaBoundingBoxJSON?north=47.517664434770246&south=47.32579231609051&east=11.940078735351564&west=11.06254577636719&username=webmapping&lang=de&maxRows=30>

* mit der `fetch-API` holen wir uns dann die Daten vom Webservice als JSON-Objekt ab

    ```javascript
    fetch(url).then(
        response => response.json()
    ).then(jsonData => {
        console.log(jsonData)
    })
    ```

* in einer `for-of` Schleife zeichnen wir für jeden Eintrag im Array `jsonData.geonames` einen Marker und hängen ihn an das Wikipedia-Overlay

    ```javascript
    for (let article of jsonData.geonames) {
        let mrk = L.marker([article.lat, article.lng]);
        mrk.addTo(overlays.wikipedia);
    }
    ```

* jeder Marker bekommt zusätzlich ein Popup in *Template-Syntax* mit Typ, Titel, Seehöhe, Beschreibung, Link zum Wikipedia-Artikel und Vorschaubild (sofern vorhanden)

    ```javascript
    let img = "";
    if (article.thumbnailImg) {
        img = `<img src="${article.thumbnailImg}" alt="thumbnail">`
    }
    mrk.bindPopup(`
        <small>${article.feature}</small>
        <h3>${article.title} (${article.elevation}m)</h3>
        ${img}
        <p>${article.summary}</p>
        <a target="wikipedia" href="https://${article.wikipediaUrl}">Wikipedia Artikel</a>
    `)
    ```

### 3. Icons beim Marker anzeigen

* die meisten Einträge im Wikipedia JSON-Objekt haben in der Eigenschaft `feature` den Typ des Eintrags als Zeichenkette (z.B. *waterbody*, *mountain*, *river* etc.). Diese Typen übersetzen wir in unterschiedliche Icons der <https://mapicons.mapsmarker.com/> Icon-collection. Für Einträge ohne Typ sehen wir ein generisches Info-Icon als `default` vor. Das `icons`-Objekt definieren wir vor der `for-of` Schleife:

    ```javascript
    let icons = {
        adm1st: "wikipedia_administration.png",
        adm2nd: "wikipedia_administration.png",
        adm3rd: "wikipedia_administration.png",
        airport: "wikipedia_helicopter.png",
        city: "wikipedia_smallcity.png",
        glacier: "wikipedia_glacier-2.png",
        landmark: "wikipedia_landmark.png",
        railwaystation: "wikipedia_train.png",
        river: "wikipedia_river-2.png",
        mountain: "wikipedia_mountains.png",
        waterbody: "wikipedia_lake.png",
        default: "wikipedia_information.png",
    };

    for (let article of jsonData.geonames) {
        // Marker zeichnen
    }
    ```

* innerhalb der `for-of` Schleife ersetzen wir alle Artikel-Typen die wir **nicht** kennen (deshalb das "!" bei der `if`-Abfrage) mit unserem generieschen Wert `default`. Damit können wir uns darauf verlassen, dass für jeden Eintrag in `article.feature` auch ein Icon verfügbar ist:

    ```javascript
    for (let article of jsonData.geonames) {
        if (! icons[article.feature]) {
            article.feature = "default";
        }
        // ..
    }
    ```

* das ermittelte Icon setzen wir dann als `L.icon` beim Marker über folgende `properties` ein:
    
    * `iconUrl` : Pfad zum passenden Icon in `icons[article.feature]`
    
    * `iconSize` : Array mit Breite und Höhe des Icons in Pixel. **Hinweis**: sobald `iconSize` gesetzt ist, wird das Icon an der Koordinate zentriert. Fehlt `iconsize` ist die Positionierung Links/Oben

    * `iconAnchor` : Array mit Anfasspunkt zur Positionierung bezogen auf das Bild. Bei uns ist das die horizontale Mitte (16) und die Unterkante (37)

    * `popupAnchor` : Array mit Anfasspunkt für das Popup bezogen auf die Koordinate. Nachdem das Icon mit der Spitze auf der Koordinate positioniert ist, müssen wir den `popupAnchor` um die Höhe des Icons nach oben schieben um das Icon nicht zu verdecken

    Details dazu findet ihr in der Leaflet-Dokumentation unter <https://leafletjs.com/reference.html#icon-iconsize>

    ```javascript
    let mrk = L.marker([article.lat, article.lng], {
        icon: L.icon({
            iconUrl: `icons/${icons[article.feature]}`,
            iconSize: [32, 37],
            iconAnchor: [16, 37],
            popupAnchor: [0, -37]
        })
    });
    ```

### 4. Wikipedia-Artikel bei Zoom/Pan automatisch laden

Damit bei Zoom/Pan in der Karte auch immer wieder neue Wikipedia-Artikel geladen werden, müssen wir den Aufruf von `drawWikipedia` mit den jeweiligen Karten-Events verknüpfen. Das geschieht über eine Callback-Funktion (`map.on()`), die immer dann aufgerufen wird, wenn sich der Ausschnitt der Karte über Zoom (`zoomend`) oder Pan (`moveend`) verändert. 

* wir verschieben den alten `drawWikipedia`-Aufruf ganz an das Ende des Scripts in eine neue Callback-Funktion und übergeben `drawWikipedia` den jeweils letzten Ausschnitt der Karte. Als Trennzeichen für unsere beiden Events im Callback verwenden wir ein *Leerzeichen*:

    ```javascript
    // Wikipedia Icons zeichnen
    map.on("zoomend moveend", () => {
        drawWikipedia(map.getBounds());
    })
    ```

    damit werden immer wieder Artikel nachgeladen. Allerdings werden auch Artikel geladen, die wir schon einmal geladen haben. Um das zu verhindern, müssen wir uns merken, welche Artikel wir schon geladen haben. 

* dazu definieren wir oberhalb der `drawWikipedia` Funktion ein (anfangs) leeres `articleDrawn`-Objekt in dem wir über die jeweilige Wikipedia-URL festhalten werden, ob wir einen Artikel schon gezeichnet haben

    ```javascript
    let articleDrawn = {};
    const drawWikipedia = () => {
        // ....
    }
    ```
    ganz zu Beginn der `for-of` Schleife entscheiden wir, ob wir zeichnen oder nicht. Wenn wir den Artikel schon gezeichnet haben, gehen wir über die Anweisung `continue` direkt zum nächsten Eintrag in `jsonData.geonames` weiter. Wenn wir den Artikel noch nicht kennen, merken wir ihn uns und führen der restlichen Code-Block zum Zeichnen des Markers aus:

    ```javascript
    for (let article of jsonData.geonames) {
        if (articleDrawn[article.wikipediaUrl]) {
            console.log("schon gesehen", article.wikipediaUrl);
            continue;
        } else {
            articleDrawn[article.wikipediaUrl] = true;
        }

        // ...
    }
    ```

    in der `console` erkennen wir, dass viele Artikel doppelt gezeichnet worden wären. Das liegt daran, dass `zoomend` und `moveend` auch gemeinsam auftreten können und natürlich daran, dass bei überlappenden Ausschnitten die selben Artikel als Resultat ankommen.

* Zum Schluss bleibt noch, alle `console.log()`-Aufrufe zu deaktivieren :-)
