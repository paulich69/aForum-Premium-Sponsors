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

Die ersten drei aktiven Einträge werden angezeigt. Jeder Banner ist als **WERBEPARTNER** markiert und verwendet `rel="sponsored noopener noreferrer"`.

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
