# Wetterstationen Tirol, Teil 2

<https://webmapping.github.io/aws-tirol/>

## A. Wir verfeinern den Code für die Overlays

* Unsere Karte hat jetzt schon einige Layer und deshalb ist es Zeit, den Code für diese Overlays etwas aufzuräumen. Dazu erstellen wir zuerst vor dem `L.map`-Aufruf ein neues `overlays`-Objekt mit fünf *Key/Value*-Paaren: *Key* ist der Name des Overlays und *Value* eine neue `L.featureGroup()` (siehe <https://leafletjs.com/reference.html#featuregroup>):

    ```javascript
    let overlays = {
        stations: L.featureGroup(),
        temperature: L.featureGroup(),
        snowheight: L.featureGroup(),
        windspeed: L.featureGroup(),
        winddirection: L.featureGroup()
    };
    ```

* Dann hängen wir diese Overlays in unsere Layer-Control ein. Die Leaflet-Dokumentation für die Layer-Control unter <https://leafletjs.com/reference.html#control-layers> zeigt uns wie das geht: `L.control.layers` erwartet als erstes Argument die sogenannten `baseLayer` -  das sind die Kartenhintergründe die wir mit dem [leaflet-providers-Plugin](https://github.com/leaflet-extras/leaflet-providers) definiert haben. Hier müssen wir nichts zu ändern. Als zweites Argument können ein- und ausschaltbare `overlays` angegeben werden. Sie bestehen wieder aus *Key/Value*-Paaren für den angezeigten Label und das dazugehörige `L.featureGroup()`-Objekt. Hier fügen wir unsere neuen Overlays hinzu:

    ```javascript
    let layerControl = L.control.layers({
        // baseLayers
    }, {
        // overlays
        "Wetterstationen Tirol": overlays.stations,
        "Temperatur (°C)": overlays.temperature,
        "Schneehöhe (cm)": overlays.snowheight,
        "Windgeschwindigkeit (km/h)":  overlays.windspeed,
        "Windrichtung": overlays.winddirection
    })).addTo(map);
    ```

* Um einen der Layer direkt anzeigen zu können, müssen wir ihn noch zur Karte hinzufügen. Wir entscheiden uns für den Temperatur-Layer:

    ```javascript
    overlays.temperature.addTo(map);
    ```

* Damit sehen wir fünf neue Einträge in der Layer-Control, allerdings sind sie noch leer, denn die Marker landen nicht in den `L.featureGroup()`-Objekten der neuen Overlays. Vier Änderungen bei den `marker.addTo()`-Aufrufen sind nötig um die bestehenden Marker auch dort zu zeichnen:

    ```javascript
    marker.addTo(overlays.stations);
    // ...
    marker.addTo(overlays.temperature);
    // ...
    marker.addTo(overlays.snowheight);
    // ...
    marker.addTo(overlays.windspeed);
    ```

* Auch beim Setzen des Kartenausschnitts auf den Extent der Stationen müssen wir natürlich das neue Overlay-Objekt verwenden:

    ```javascript
    map.fitBounds(overlays.stations.getBounds());
    ```

* Den Code für die alten Overlays können wir jetzt löschen. Dieser [Commit bei github.com](https://github.com/webmapping/webmapping.github.io/commit/86c53c7145c527b117d1590edc247917ca919707#diff-a7f70a836f9499378b86afd167e1ed438d670630f26a56bc39e3c25e09fd3417) zeigt uns in Rot, welche Code-Zeilen gelöscht wurde


* Nachdem wir schon bei der Layer-Control sind, implementieren wir auch noch das dauerhafte Ausklappen dieser Control über die Option `collapsed` (siehe <https://leafletjs.com/reference.html#control-layers-collapsed>) beim dritten möglichen Argument von `L.control.layers`, dem optionalen `options`-Objekt:

    ```javascript
    let layerControl = L.control.layers({
        // baseLayers
    }, {
        // overlays
    }, {
        collapsed: false
    }).addTo(map);
    ```

* Die Layer-Control ist damit rechts oben dauerhaft sichtbar, links unten fehlt auch noch etwas: eine Maßstabsleiste. In der Dokumentation werden wir unter <https://leafletjs.com/reference.html#control-scale> fündig. Über die Option `imperial: false` verhindern wir die zusätzliche Anzeige von Meilen:

    ```javascript
    L.control.scale({
        imperial: false
    }).addTo(map);
    ```

**Unser Karten-Interface ist jetzt aufgeräumt und wir können uns an die nächste Ausbaustufe unserer Karte wagen**


## B. Temperatur Layer über eine Funktion einbauen

* Die `if`-Abfrage für die Temperaturdaten funktioniert am Besten über den `typeof` Operator, der uns sagt, ob in `station.properties.LT` eine Zahl ist oder nicht:
    ```javascript
    if (typeof station.properties.LT == "number") {

    }
    ```

* Zur Visualisierung des Temperatur-Layers erstellen wir eine eigene *Funktion*, warum? Weil wir diese Funktion später auch zum Zeichnen der bereits bestehenden Overlays verwenden können.

* Funktionen sind vereinfacht gesagt:
    * Code-Blöcke, die Aufgaben erledigen
    * Code-Blöcke, die einen Funktionsnamen haben über den sie aufgerufen werden
    * Code-Blöcke, denen man beim Aufruf auch Werte übergeben kann - die sogenannten *Argumente* der Funktion
    * Code-Blöcke, die zum Weiterarbeiten auch Werte oder Objekte zurückliefern können

* Funktionen schrieb und schreibt man heute immer noch so:

    ```javascript
    let sayHello = function(msg) {
        console.log("Hello", msg);
    }
    ```

* Viel *cooler* ist allerdings die neue Schreibweise, die als *Arrow function expressions* oder *[Pfeilfunktionen](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Functions/Arrow_functions)* bezeichnet wird - immer wenn wir `=>` sehen, wissen wir, dass eine Funktion im Spiel ist. Die selbe Funktion wie oben schreibt man dann so:

    ```javascript
    let sayHello = (msg) => {
        console.log("Hello", msg);
    };

* Beide Schreibweisen sind möglich, wir versuchen uns an der *coolen* Variante und definieren eine Funktion, die ein `L.divIcon` zurückliefert und als Argumente beim Aufruf die Koordinaten sowie den zu visualisierenden Wert als `options`-Objekt erhält:

    ```javascript
    let newLabel = (coords, options) => {
        console.log("das Argument coords", coords);
        console.log("das Argument options", options);
        return "und hier kommt der neue Label zurück";
    };
    ```

* Aufgerufen wird die Funktion über ihren Namen samt den Argumenten die wir übergeben wollen:

    ```javascript
    let marker = newLabel(station.geometry.coordinates, {
        value: station.properties.LT
    });
    console.log(marker);
    ```

    Das erste Argument, `station.geometry.coordinates`, enthält die Koordinaten mit Seehöhe und landet in der Funktion in der Variablen `coords`. Das zweite Argument ist unser `options`-Objekt - es landet in der Funktion in der Variablen `options` und hat fürs Erste nur einen Eintrag - den Wert, den wir mit `L.divIcon` als Label in der Karte anzeigen wollen. Über `return` gibt die Funktion den erzeugten Marker (jetzt noch den Text "und hier kommt ...") zurück. Wir speichern ihn beim Aufruf der Funktion in der Variablen `marker`.

* Die Befehle zum Zeichnen des Markers kennen wir schon:
    * `L.divIcon` erzeugt unseren neuen Temperaturlabel (siehe <https://leafletjs.com/reference.html#divicon>)
    * die Option `html` definiert dabei den angezeigten Text
    * die Option `className` fügt dem Label eine CSS-Klasse `text-label` hinzu, über die wir den Label später in `main.css` stylen können
    * das  `L.divIcon` verwenden wir schließlich als Icon beim `L.marker`-Befehl
    * die `if`-Abfrage für die Farbe des Labels lassen wir vorerst weg - wir werden sie später durch eine elegantere Methode ersetzen
    
    Damit lautet unsere Funktion zum Erzeugen des Labels:

    ```javascript
    let newLabel = (coords, options) => {
        let label = L.divIcon({
            html: `<div>${options.value}</div>`,
            className: "text-label"
        });
        let marker = L.marker([ coords[1], coords[0] ], {
            icon: label
        });
        return marker;
    };
    ```

* In der `console` erkennen wir, dass der zurückgegebene `labelMarker` ein Leaflet-Objekt ist, das wir nur noch in das Temperatur-Overlay schreiben müssen:

    ```javascript
    marker.addTo(overlays.temperature);
    ```

* Der Text-Label sieht leider noch nicht so gut aus, was daran liegt, dass wir über die Option `className` eine neue CSS-Klasse `text-label` eingeführt haben, die in <https://webmapping.github.io/aws-tirol/main.css> noch nicht definiert ist. Mit *Rechter Maustaste* und *Element untersuchen(Q)* bei einem der Label sehen wir die Struktur des Icons und erkennen, dass wir unser `DIV`-Element mit dem Temperaturwert über den Selektor `.text-label div` ansprechen können. Die Eigenschaften unseres neuen CSS-Stils übernehmen wir aus der Klasse `.snow-label`:

    ```css
    .text-label div {
        font-size: 1.25em;
        font-weight: bold;
        display: inline;
        padding: 0.3em;
        border: 1px solid gray;
        background-color: silver;
        text-shadow: 
            -1px -1px 0 white,
            -1px -1px 0 white,
            -1px -1px 0 white,
            -1px -1px 0 white;        
    }
    ```
* Die Labels sind nun wieder formatiert und wir können bei dieser Gelegenheit eine kleine *BUG* bei der `text-shadow`-Eigenschaft beheben - wer genau schaut, wird sehen, dass der weiße Rand nur am linken oberen Bereich ist. Um alle Seiten zu berücksichtigen, müssen die Vorzeichen der Offsets bei den vier CSS-Anweisung unterschiedlich sein - so ist es richtig:

    ```css
    text-shadow: 
        -1px -1px 0 white,
        1px -1px 0 white,
        -1px 1px 0 white,
        1px 1px 0 white;        
    ```

**Die newLabel-Funktion ist damit fertig und kann auch für die anderen Layer verwendet werden**

## C. Die newLabel-Funktion für die anderen Layer verwenden

* der dazugehörige [Commit bei github.com](https://github.com/webmapping/webmapping.github.io/commit/a353291e4f1d769a57ebd4cf12453a083465c507#diff-a7f70a836f9499378b86afd167e1ed438d670630f26a56bc39e3c25e09fd3417) zeigt die nötigen Änderungen. In diesem Schritt löschen wir auch den Code für alle `if`-Abfrage, die unsere Layer bisher mit Farbe erfüllt haben - wir werden später unsere eigenen Farbpaletten implementieren und das für alle Layer gleichzeitig.

Im nächsten Schritt können wir alle Label in allen Layern gleichzeitig nach den Farbklassen ihrer Farbskalen einfärben. Die Regeln dafür stehen im `COLORS`-Objekt der eingebundenen <https://webmapping.github.io/aws-tirol/colors.js> Datei und was liegt näher, als das Einfärben wieder in eine Funktion auszulagern.

## D. Label über die getColor-Funktion Einfärben

* Die Funktion zum Einfärben der Label soll uns für einen gegebenen Wert die passende Farbe je nach Schwellenwerten ermitteln. Dazu übergeben wir ihr den aktuellen Wert und die dazugehörige Farbpalette, vergleichen den Wert mit den allen Schwellen in *min/max* und geben die Farbe zurück sobald ein Wert größer oder gleich `min` und kleiner als `max` ist. Für den Fall, dass keine Regel zutrifft, geben wir ganz am ende der Funktion die Farbe Schwarz zurück:

    ```javascript
    let getColor = (value, colorRamp) => {
        for (let rule of colorRamp) {
            if (value >= rule.min && value < rule.max) {
                return rule.col;
            }
        }
    };
    return "black";
    ```

* Zum Testen müssen wir `colors.js` natürlich noch als `script`-Element in `index.html` einbinden:

    ```html
    <script src="colors.js"></script>
    ```

* damit sind wir fast am Ziel, was fehlt sind noch drei kleine Schritte:

    1. wir übergeben bei allen drei Aufrufen der `newLabel`-Funktion die passende Farbpalette als neuen `colors`-Eintrag im `options`-Objekt

        ```javascript
        // Funktionsaufruf am Beispiel Temperatur
        let marker = newLabel(station.geometry.coordinates, {
            value: station.properties.LT.toFixed(1),
            station: station.properties.name,
            colors: COLORS.temperature
        });
        ```
    
    2. wir bestimmen in der `newLabel`-Funktion die passende Farbe mit Hilfe der `getColor`-Funktion und speichern den zurückgelieferten Farbwert in einer neuen Variablen `color`:

        ```javascript
        let color = getColor(options.value, options.colors);
        ```

    3. wir setzen die Farbe unseres DIV-Elements in einem CSS `style`-Attribut über die Eigenschaft `background-color` mit der ermittelten Farbe:

        ```javascript
        icon: L.divIcon({
            html: `<div style="background-color:${color}">${options.value}</div>`,
            className: "text-label"
        })
        ```

**Voilà, alle Label haben nun Farben!**

## E. Wir verfeinern die Label

* Die Zahl der Kommastellen bei den dargestellten Werten ist leider sehr uneinheitlich. Bei der Temperatur sollten Zehntelgrad genügen und bei der Schneehöhe und Windgeschwindigkeit brauchen wir gar keine Kommastellen. Mit Hilfe der Methode `.toFixed()` (siehe <https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Number/toFixed>) können wir auf die gewünschte Zahl an Kommastellen runden:

    ```javascript
    station.properties.HS.toFixed(0)
    station.properties.WG.toFixed(0)
    station.properties.LT.toFixed(1)
    ```

* Leider können wir noch nicht ablesen zu welcher Station ein Textlabel gehört, weshalb wir im nächsten Schritt einen Tooltip mit dem Namen der Station und ihrer Seehöhe implementieren. Den Namen der Station übergeben wir beim Aufruf der `newLabel`-Funktion  als neues `station`-Attribut und die Seehöhe haben wir bereits in der Variablen `coords` verfügbar. Damit der Tooltip beim Marker erscheint, verwenden wir das `title`-Attribut (siehe <https://leafletjs.com/reference.html#marker-title>) und setzen den Tooltip in *Template String Syntax*:

    Funktionsaufruf am Beispiel des Temperatur-Overlays

    ```javascript
    let marker = newLabel(station.geometry.coordinates, {
        value: station.properties.LT.toFixed(1),
        colors: COLORS.temperature,
        station: station.properties.name
    });
    ```

    Anpassung in der newLabel-Funktion beim title-Attribut von L.marker

    ```javascript
    let marker = L.marker([coords[1], coords[0]], {
        icon: label,
        title: `${options.station} (${coords[2]}m)`
    });
    ```

    **Achtung:** beim Ergänzen von `station` nicht auf das neue Komma in der Zeile mit `value` vergessen!

**Der Tooltipp ist damit in allen Layern verfügbar**
