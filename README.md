# aForum Premium Sponsors

Theme-Komponente für Discourse: bis zu drei anklickbare Werbepartner-Kacheln vor der Kategoriennavigation, direkt unter dem nativen Willkommensbanner (bei der üblichen Standard-Anordnung).

## Installation

1. Dieses Verzeichnis in ein GitHub-Repository hochladen.
2. Discourse: Administration → Erscheinungsbild → Themes & Komponenten → Komponente installieren → Aus Git-Repository.
3. Repository-URL eintragen und die Komponente zum aktiven aForum-Theme hinzufügen.
4. In den Komponenteneinstellungen `sponsors` öffnen und Partner anlegen.

## Sponsor-Felder

- `name`: Name des Partners (Pflicht)
- `url`: Zieladresse mit https:// (Pflicht)
- `image`: Bild direkt im Discourse-Editor hochladen
- `image_url`: alternative externe Bildadresse; `image` hat Vorrang
- `tagline`: optionaler Slogan
- `mode`: `banner` oder `logo` (beide Bildvarianten werden ohne Beschnitt proportional eingepasst; Hintergrundfarbe frei wählbar)
- `background`: HEX-Farbe, z. B. `#151515`
- `active`: aktivieren/deaktivieren
- `position`: Reihenfolge, aufsteigend

Die ersten drei aktiven Einträge werden angezeigt. Jeder Banner ist als **WERBUNG** markiert und verwendet `rel="sponsored noopener noreferrer"`.

## Hinweis zum Einbaupunkt

Discourse stellt je nach Version und Theme unterschiedliche Seitenstrukturen bereit. Diese erste Version verwendet einen DOM-Anker (`#main-outlet .navigation-container`) für die Kategoriennavigation. Das ist ein pragmatischer Ansatz, aber kein garantierter stabiler Plugin-Outlet. Vor dem Produktiveinsatz auf aForum testen, ob die Kacheln wirklich unter dem Willkommensbanner und über der schwarzen Navigation erscheinen. Wenn der Anker nicht existiert, wird nichts angezeigt. Bei Änderungen an Discourse muss der Anker gegebenenfalls angepasst werden.

## Bilder

Für die beste Darstellung: Querformat 1200 × 500 px (Banner), transparentes PNG/WebP für Logo-Modus. Nur Bilder verwenden, für die die nötigen Nutzungsrechte vorliegen.


## CSS-Pfad (wichtig)
Die automatisch eingebundene Stylesheet-Datei liegt unter `common/common.scss`. Nicht im Repository-Stamm und nicht als `stylesheets/common.scss` ohne Import.

## Layout v4

- Desktop: immer drei gleich breite Spalten. Bei nur einem Sponsor bleibt dieser links; übrige Plätze bleiben frei.
- Alle hochgeladenen Bilder: `object-fit: contain`, proportional skaliert, vollständig sichtbar, ohne Beschnitt.
- Mobil: eine Spalte.
- Die Kachel-Farbe bleibt über `background` einstellbar.

## Layout v5 – einstellbare Hoehe und Ecken

- `tile_height`: Kachelhoehe in Pixeln, Standard **125**, erlaubter Bereich 90–300.
- `corner_radius`: Radius der Kachelecken in Pixeln, Standard **7**, erlaubter Bereich 0–40.
- Beide Werte gelten einheitlich fuer alle Sponsor-Kacheln und werden direkt in den Discourse-Komponenteneinstellungen gepflegt.
- Bilder bleiben mit `object-fit: contain` proportional und unbeschnitten.

## Layout v6 – dezente Werbekennzeichnung und Chevron

- Oben links steht nur noch **WERBUNG**, standardmäßig in Bronze `#D6B36A`.
- Die Farbe lässt sich über `ad_label_color` ändern (HEX).
- Partnername und Slogan werden nicht mehr sichtbar über das Bild gelegt; der Partnername bleibt als Alternativtext und Link-Beschriftung erhalten.
- Unten rechts steht ein minimalistisches weißes Chevron auf rotem Grund (SVG, keine Font-Awesome-Abhängigkeit).
- Der Chevron-Button übernimmt den einstellbaren Eckenradius der Kachel, begrenzt auf 18 px, damit er bei großen Radien gut aussieht.


## Version 7 – Mobilansicht

Korrigiert schmale, zusammengeschobene Sponsorenkacheln in mobilen Themes. Die Kacheln verwenden auf Smartphones die gesamte verfügbare Inhaltsbreite und stehen untereinander. Die konfigurierbare Höhe und der Eckenradius gelten weiterhin; Desktop bleibt dreispaltig.

## Version 8 – gewichtete Mobile-Ausspielung

- Desktop: unverändert alle bis zu drei Sponsoren in drei Spalten.
- Smartphone (bis 760 px): **nur eine** Sponsor-Kachel.
- Pro Sponsor: `mobile_weight` als Gewicht 0 bis 20. Leer = 1, 0 = auf Mobile ausgeschlossen.
- Beispiel 3, 1, 1: ungefähre Anzeigehäufigkeit 60 %, 20 %, 20 %.
- Die Auswahl erfolgt zufällig beim Laden der Seite und bleibt bei DOM-Neurendern stabil; bei einem vollständigen Reload kann ein anderer Sponsor erscheinen. Keine garantierte Quote oder Impression-Messung.
- Falls alle Gewichte 0 sind, wird auf Mobile keine Kachel gezeigt.

## Version 9

Der rote Chevron-Button skaliert proportional zur eingestellten Kachelhöhe (23 %, begrenzt auf 22–55 px). Bei 125 px Kachelhöhe ist er rund 29 px groß. Das weiße Chevron ist kräftiger (SVG stroke-width 4) und skaliert mit. Desktop und Mobile verwenden dieselbe Regel.

## Version 10 – individuelle Bildskalierung

- Neues Feld `image_scale` pro Sponsor: ganzzahlig 90–110 (Prozent).
- Ohne Eintrag bleibt das Bild bei 100 %, bestehende Einstellungen bleiben unverändert.
- Die Skalierung betrifft ausschließlich das hochgeladene Bild, nicht Kachel, Label oder Chevron.
- Bildseitenverhältnis bleibt erhalten (`object-fit: contain`); bei Vergrößerung kann das Bild näher an den Kachelrand rücken.
- Auf Desktop und Mobile identisch.


## Version 11 – Sponsorleiste auf allen Hauptreitern

Die Sponsorleiste erscheint bei aktivierter Einstellung `show_on_categories` jetzt nicht nur unter **Kategorien**, sondern auch unter **Aktuell** (`/latest`), **Neu** (`/new`) und **Heiß** (`/top` bzw. `/hot`). Die drei Kacheln bleiben direkt vor der Forennavigation. Alle vorhandenen Sponsor-Einstellungen, Bildskalierungen und die gewichtete mobile Auswahl aus v10 bleiben erhalten.

**Installation:** Dieses ZIP ersetzt die separate Theme-Komponente **aForum Premium Sponsors**. Das Haupttheme **aForum Alpha 16** muss nicht geändert werden.
