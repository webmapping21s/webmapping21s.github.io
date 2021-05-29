# Bike Trail Tirol HOWTO

Beispiel: <https://webmapping.github.io/tirol/>

## Metadaten der Etappen auf der HTML-Seite anzeigen

* das `BIKETIROL`-Objekt in <https://webmapping.github.io/tirol/biketirol.js> enthält für jede Etappe Metadaten, die wir zum Abschluss noch auf der HTML-Seite anzeigen werden. Wir schreiben die neue Funktion `updateTexts` direkt vor den Code zum Erzeugen des Menüs und übergeben ihr die Etappennummer als Argument `nr`:

    ```javascript
    const updateTexts = (nr) => {
        console.log(nr);
    };

    let pulldown = document.querySelector("#pulldown");
    ```

* aufgerufen wird `updateTexts` jedes Mal, wenn sich das Pulldown ändert. Das ist zum Einen beim Erzeugen des Menüs, zum Anderen bei jeder Änderung des Menüs in `pulldown.onchange`. Übergeben wird in beiden Fällen der aktuell selektierte Wert.

    ```javascript
    for (let track of BIKETIROL) {
        // Pulldown erzeugen
    }
    updateTexts(pulldown.value);

    pulldown.onchange = () => {
        drawTrack(pulldown.value);
        updateTexts(pulldown.value);
    };
    ```

* in einer `for-of` Schleife suchen wir die aktuelle Etappe und zeigen das Metadaten-Objekt dieser Etappe in der `console` an:

    ```javascript
    for (let etappe of BIKETIROL) {
        if (etappe.nr == nr) {
            console.log(etappe);
        }
    }
    ```

* in einer zweiten, verschachtelten `for-in` Schleife zeigen wir dann die einzelnen *Key-Value* Paare des Etappen-Objekts in der `console` an

    ```javascript
    console.log(etappe);
    for (let key in etappe) {
        console.log("key:", key, "value:", etappe[key]);
    }
    ```

**wie kommen die Texte nun auf die HTML-Seite?**

* ganz einfach, indem wir für jeden `key` des Etappen-Objekts im Javascript, im HTML-Code ein Element mit der selben ID bestimmen. Über `document.querySelector` können wir dann den dazugehörigen Wert als `.innerHTML` setzen.

* damit wir mit anderen IDs im Dokument nicht kollidieren, schreiben wir vor jede ID das Prefix `text-` und berücksichtigen das auch beim Suchen der ID mit `document.querySelector`. 

    Am Beispiel Etappentitel müssen wir also:

    Schritt 1: im HTML-Code ein Element mit `id="text-etappe"` versehen - wir nehmen das bestehende `<H2>`-Element

    ```html
    <h2 id="text-etappe">Bike Trail Tirol</h2>
    ```

    Schritt 2: in der `for-in` Schleife über *Template-Syntax* nach einem Element mit der ID `text-${key}`  suchen und, wenn wir fündig werden, dessen `.innerHTML` auf den dazugehörigen Wert setzen

    ```javascript
    for (let key in etappe) {
        if (document.querySelector(`#text-${key}`)) {
            document.querySelector(`#text-${key}`).innerHTML = etappe[key];
        }
    }
    ```

    damit wird "*Bike Trail Tirol*" mit dem Namen der aktuellen Etappe überschrieben

* will man vor, oder nach dem Titel der Etappe noch etwas ergänzen, kann man ein generisches `<SPAN>`-Element als Ziel definieren - die Etappennummer der Etappe können wir damit im Titel des `<H2>`-Elements integrieren:

    ```html
    <h2>Etappe <span id="text-nr"></span>: <span id="text-etappe"></span></h2>
    ```

* unsere `for-in` Schleife erledigt das Befüllen der `<SPAN>`-Elemente automatisch und wir müssen nur noch im HTML-Code die Ziele definieren:

    die Intro setzen wir beim bestehenden `<P>`-Element unter dem `<H2>`-Element

    ```html
    <p id="text-intro"></p>
    ```

    die Eigenschaften der Etappe passen vor das Kartenmenü in eine unsortierte Liste

    ```html
    <ul>
        <li>Start: <span id="text-start"></span></li>
        <li>Länge: <span id="text-laenge"></span></li>
        <li>Höhenmeter: <span id="text-hoehenmeter"></span></li>
        <li>Fahrzeit: <span id="text-fahrzeit"></span></li>
        <li>Schwierigkeitsgrad: <span id="text-grad"></span></li>
    </ul>
    ```

    für den Weblink müssen wir noch eine kleine Anpassung im Javascript-Code machen, denn der lässt sich nicht als `innerHTML` einbauen sondern nur als Attribut `href` eines `<A>`-Elements. **Workaround** wir erzeugen aus der bestehenden `weblink`-Eigenschaft einen neuen, gültigen Link und ergänzen ihn beim Etappen-Objekt als Eintrag `homepage`

    ```javascript
    etappe.homepage = `<a href="${etappe.weblink}">${etappe.weblink}</a>`;
    ```

    diese neue `homepage`-Eigenschaft verwenden wir dann bei unserer Liste

    ```html
    <li>Weblink: <span id="text-homepage"></span></li>
    ```

    die Streckenbeschreibung kommt zuletzt mit einer Überschrift unterhalb des Höhenprofils

    ```html
    <h3>Streckenbeschreibung</h3>
    <p id="text-strecke"></p>
    ```
