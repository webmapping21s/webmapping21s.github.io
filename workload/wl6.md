## Workload für die Woche vom 22. bis 29. April 2021

## Das AWS-Tirol Beispiel erweitern

### Layer relative Luftfeuchtigkeit

* Analog zu den bestehenden Layern soll mit der `newLabel`-Funktion ein weiteres Overlay für die Relative Luftfeuchtigkeit (RH) erzeugt werden.
* passende Farben und Schwellen zur Erweiterung von <https://webmapping21s.github.io/aws-tirol/colors.js> um eine Farbpalette `COLORS.humidity` findet ihr bei [wetteronline.de](https://www.wetteronline.de/?gid=10093&metparaid=RH&pcid=pc_aktuell_local&pid=p_aktuell_local&sid=ColorMap), genauer gesagt in der [SVG-Grafik der Legende](https://st.wetteronline.de/mdr/p_aktuell_local/1.0.159/images/symbology/www/ic_Humidity_390x76.svg), die ihr auf der Wetterkarte rechts oben eingebettet seht.

### Popup der Stationen erweitern 

* den Wert für die relative Luftfeuchtigkeit zur Liste der Datenwerten hinzufügen.
* die bestehende numerische Angabe der Windrichtung durch eine textliche Darstellung ersetzen. Dazu müsst ihr, analog zur `getColor`-Funktion eine neue `getDirection`-Funktion schreiben, die Gradangaben in der Variablen `station.properties.RH` nach den *min/max*-Regeln in *N*, *NO*, *O*, usw. umsetzt. Den Javascript-Array mit den passenden *min/max/dir* Regeln haben wir euch schon vorbereitet - ihr findet ihn unter <https://webmapping21s.github.io/aws-tirol/directions.js>.

### Extra-Challenge für Mutige

* Einbau des [Rainviewer Plugins](https://github.com/mwasil/Leaflet.Rainviewer)

Natürlich sollen alle eure Schritte wie immer einzeln `committed` werden. Wir empfehlen auch wieder die Verwendung des *Beautify*-Plugins (`F1`-*Beautify File*), oder der *Formatieren*-Funktion (`F1`-*Formatieren*) von VisualStudio-Code.

Bis spätestens **Donnerstag, 29. April 2021 mittags** sollen die drei (oder zwei, je nachdem wie mutig ihr seid ;-)  Aufgaben erledigt sein.
