## Workload für die Woche vom 15. bis 22. April 2021

### AWS-Tirol Beispiel erweitern

1. Lufttemperatur-Layer

* Analog zum Schneehöhen-Layer soll ein weiterer Layer für die Lufttemperatur
  erzeuget werden.
* Dabei sollen nur Stationen angezeigt werden, die auch einen gültigen Wert für
  die Temperatur haben. **Achtung**: Die `if`-Abfrage, die wir bei den Schneehöhen
  verwendet haben wird hier nicht zum korrekten Ergebnis führen, da
  Temperatur-Werte mit `0` Grad dabei ausgeschlossen werden.
* Negative Temperaturen sollen blau, positive Temperaturen grün hinterlegt
  werden.

Natürlich sollen alle eure Schritte wie immer einzeln `committed` werden.

Bis spätestens **Donnerstag, 22. April 2021 mittags** soll der neue Layer auf
eurer Karte sichtbar sein.

