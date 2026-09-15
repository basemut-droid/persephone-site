# Vergleich live ↔ Rebuild — 7. September 2026, nach dem RUN

Unabhängige Prüfung, Seite für Seite, gegen `https://www.persephone.at`.

## Wie geprüft wurde — und warum das diesmal anders ist

Derselbe Analysecode lief in **beiden** Seiten, im echten Browser, bei 1440 px Breite, und
las die **berechneten Stilwerte** aus: Schriftgröße, -gewicht, Farbe, Ausrichtung,
Hintergründe, Bilder inklusive **Hintergrundbilder**, Icons, Buttons, Listenmarker.

Das ist der Punkt. Drei falsche Aussagen in diesem Projekt — „die Unterseiten haben kein
Hero-Bild", „`/termine/` ist leer", „das lose Logo ist ein Versehen" — stammen alle daraus,
dass eine Live-Seite als **Text** gelesen wurde. Textextraktion verliert Bilder, iframes,
Icons und alles, was über eine CSS-Klasse kommt. Diese Prüfung liest Markup und berechnete
Stile; die Zahlen unten sind gemessen, nicht geschätzt.

Was diese Methode **nicht** kann: den Gesamteindruck beurteilen — Rhythmus, Weißraum,
ob eine Seite „sich richtig anfühlt". Dafür braucht es Dein Auge. Die Rebuild-Screenshots
aller Seiten liegen in `docs/screenshots/2026-09-07-vergleich/`.

---

# TEIL A — Systemische Befunde

Diese vier betreffen **jede Seite**. Sie erklären den größten Teil des „schaut anders aus",
und sie sind mit vier Werten zu beheben, nicht mit vierzig Einzelkorrekturen.

## A1. Die gesamte Typo-Skala ist zu klein — der wichtigste Einzelbefund

Gemessen auf jeder Seite, identisch:

| Element | live | Rebuild | Differenz |
|---|---|---|---|
| Fließtext | **20 px** | 16 px | −20 % |
| Intro unter der H1 | **20 px** | 18 px | −10 % |
| Abschnittsüberschrift (H3-Ebene) | **28 px** | 26 px | |
| „Von innen. Und von Fach." | **36 px** | 32 px | |
| Blog-Teaser-Titel | **26 px** | 21 px (Start) / 26 px (Blog) | |
| H1 | 48 px | 48 px | stimmt |

Der Fließtext ist der entscheidende Wert: 20 px gegen 16 px sind vier Punkt auf jeder Zeile
jeder Seite. Das allein lässt die Seite anders wirken, unabhängig von jedem Layoutdetail.

**Zu tun:** die Basis-Schriftgröße auf den Live-Wert setzen und die Skala daran hängen.
Ein Wert in `global.css`, nicht Seite für Seite.

## A2. Die Eyebrow-Label sind zu klein, zu fett und gesperrt

| | live | Rebuild |
|---|---|---|
| Größe | **18 px** | 13 px |
| Gewicht | **400** | 700 |
| Laufweite | **0** | 1 px |
| Farbe | #309898 | #309898 ✓ |
| Versalien | ja | ja ✓ |

Farbe und Versalien stimmen; Größe, Gewicht und Sperrung nicht. Live ist das ein ruhiges,
normal gewichtetes Label in Textgröße — der Rebuild macht daraus ein kleines fettes
Kapitälchen-Etikett. Betrifft jede Seite.

**Zur Farbe, erledigt:** in der Hero-Zeile ist das Eyebrow live terrakotta (#b33a3b) auf
Beratung, Workshops, Selbsthilfegruppe und Kontakt, aber teal auf Angebote, Über uns und
Blog — die Live-Seite widerspricht sich dort selbst. **Entscheidung (Claudio, 7.9.2026):
durchgehend teal.** Der Rebuild macht das bereits richtig; nur Größe, Gewicht und Sperrung
sind zu korrigieren.

## A3. Alle Buttons sind falsch

| | live | Rebuild |
|---|---|---|
| Füllung | **massiv terrakotta #b33a3b** | transparent |
| Schrift | #fbf8f5, 17 px, **aufrecht** | weiß, 15 px, **kursiv** |
| Eckenradius | **4 px** | 6 px |

Das Kursiv ist eine Erfindung des Rebuilds — es kommt auf der Live-Seite **an keiner Stelle**
vor. Die transparente Füllung macht den Hauptbutton zum Sekundärbutton. Betrifft jeden
Button der Seite.

Zwei Sonderfälle, gemessen:
- Sekundärbutton „ERFAHRE MEHR" (Startseite): live bg #f3ece6, Text #309898, 17 px,
  Versalien, r 4 px, aufrecht.
- „MELDE DICH AN" (Selbsthilfegruppe): live **massiv terrakotta, 13 px, Versalien,
  aufrecht**. Versalien sind hier also richtig, kursiv nicht.

## A4. Der Hero hat live zwei Ebenen — eine davon fehlt

Der Live-Hero besteht aus **zwei** Ebenen, die der Rebuild zu einer zusammengezogen hat:

1. eine **ganzflächige SVG-Grafik als Hintergrund** (`hero-graphic-2.svg`, 1425 × ~600,
   `background-size: cover`) über die volle Breite
2. darüber eine **783 px breite Spalte** mit einem Foto als Hintergrund

**Ebene 1 ist im Rebuild komplett abwesend.** Und sie ist die Antwort auf die alte offene
Frage nach der ockerfarbenen Kurve unten links: die Kurve *ist* diese Grafik. Claude Code
hat sie nicht gefunden, weil sie kein Bild-Element und kein Theme-CSS ist, sondern ein
`background-image` eine DOM-Ebene höher, auf dem äußeren Fullwidth-Div.

### Die Grafik selbst — ERLEDIGT: sie wird ersatzlos weggelassen

Die Datei ist **569 Bytes**: ein einziger `<path>`, eine einzige Farbe **`#EDA444`**, ein
nach oben geschwungener Bogen am unteren Rand. Keine Illustration, keine Textur, kein Bild.

Sie liegt unter `/wp-content/uploads/**2023/02**/` — aus demselben Avada-Demo-Import wie
`Hintergrund.jpg`, `banner-2.jpg` und `banner-3.jpg`. Marinas eigene Uploads sind von 2026.

**Bestätigt von Claudio, 7.9.2026: der Bogen ist Avada. Marina hat den Granatapfel bzw. die
Porträts darüber gelegt.** Der Bogen ist also kein gestaltetes Element der Marke, sondern
ein Rest der Vorlage, der unter ihren eigenen Bildern liegen geblieben ist.

**Entscheidung: ersatzlos weglassen.** Nicht laden, nicht nachzeichnen, kein Ersatz.
`#EDA444` kommt sonst nirgends auf der Seite vor und wird **nicht** als Token aufgenommen —
die Palette bleibt Terrakotta, Teal, Salbe, Beige, Creme, Tinte.

Damit ist auch die lange offene Frage nach der „ockerfarbenen Kurve unten links" erledigt.
Sie war nie ein fehlendes Element, sondern eines, das gar nicht mitkommen soll. **Nicht
erneut als Fehlbefund aufnehmen.**

Von Ebene 1 bleibt damit nur eines übrig: das Hero-Band liegt live auf **#f3ece6** (beige),
im Rebuild auf #fbf8f5 (creme).

### Welches Foto in Ebene 2 — die Regel

**Regel (Claudio, 7.9.2026): der Granatapfel ist das Hauptmotiv. Ausnahme nur dort, wo ein
Porträt gehört.**

| Seite | Live | Rebuild | Status |
|---|---|---|---|
| Startseite, Angebote, Kontakt, Selbsthilfegruppe | Granatapfel | Granatapfel | ✓ |
| **Beratung & Coaching** | `Hintergrund.jpg` (Avada) | Granatapfel | ✓ **richtig so** |
| **Workshops** | `Hintergrund.jpg` (Avada) | Granatapfel | ✓ **richtig so** |
| Über uns | Porträt `MG_7803` | eigenes Porträt | ✓ |
| Blog | Porträt am Schreibtisch | `marina-schreibtisch` | ✓ |
| FAQs, Termine, Impressum, Datenschutz, Disclaimer | **kein Hero-Bild** | keines | ✓ |

`Hintergrund.jpg` ist ein Avada-Template-Element, das Marina nie entfernen konnte — keine
Rechte. **Nicht laden.** Der Rebuild macht auf beiden Seiten bereits das Richtige; die
frühere Fassung dieses Dokuments hat das fälschlich als Fehler geführt.

**Die alte offene Frage nach Termine/FAQs/Impressum/Datenschutz/Disclaimer ist beantwortet:
diese Seiten haben live kein Hero-Bild.** Nicht mehr nachfragen.

Der Hintergrund der Hero-Bänder ist auf allen Unterseiten zu korrigieren: **#f3ece6** statt
#fbf8f5.

---

# TEIL B — Seite für Seite

Nur noch das, was **nicht** schon unter A1–A4 fällt.

## B1. Startseite

- **Tippfehler im Button: „e-Brief abonieren"** — ein „n" fehlt. Zweimal auf der Seite
  (Hero und Newsletter-Band). Live: „e-Brief abonnieren". Auf allen anderen Seiten ist es
  richtig geschrieben.
- **„Wähle, was gerade zu Dir passt…" ist live ein Absatz** (25 px), im Rebuild eine
  H2 (32 px). Der umgekehrte Fall zum Eyebrow-Problem: hier wurde ein Absatz zur
  Überschrift befördert.
- **Blog-Teaser-Karten haben einen Link ohne Text.** Der Bild-Link rendert als
  `<a>` mit leerem Inhalt und ohne `aria-label`. Für Screenreader ein Link ohne Namen.
  Live hat stattdessen einen sichtbaren „Continue Reading"-Link.
- Kategorie-Reihenfolge weicht ab: live „Männer im Kinderwunsch, Beziehung & Kinderwunsch",
  Rebuild „Beziehung & Kinderwunsch, Männer im Kinderwunsch". Kosmetisch, aber prüfbar.
- Live nutzt `texture-bg.svg` als Spaltenhintergrund im Ansatz-Abschnitt (3×) und
  `hero-graphic-3.svg` hinter dem Porträt. Beides im Rebuild nicht vorhanden. **Beide Dateien
  vor jeder Verwendung wie die Hero-Kurve prüfen:** liegt der Upload-Pfad unter `2023/`, ist
  es Avada-Material und wird nicht übernommen, sondern allenfalls in eigener Form
  nachgebaut. `dist/textures/seed-texture.svg` liegt bereits im Repo, wird aber nirgends
  verwendet — das ist vermutlich der eigene Ersatz für `texture-bg.svg` und sollte entweder
  eingesetzt oder entfernt werden.
- **Seitentitel geändert:** live „Homepage - Persephone", Rebuild „Persephone –
  Navigationshilfe im Sturm des Kinderwunsches". Der neue ist besser — aber er ist erfunden.
  Siehe Frage F3.

## B2. Über uns

- **Der Qualifikationsblock ist ein ganz anderes Element.** Live: ein **volles Band in
  Teal (#309898)** mit weißer Schrift, zentrierten Überschriften und den Sprachen in
  **34 px**. Rebuild: cremefarbenes Band, kleine teale Überschriften, linksbündig, 16 px.
  Das ist der auffälligste Einzelunterschied der Seite.
- „Wer Dir hier begegnet", „Was aus meiner Kinderwunschkrise wuchs", „Persephone als
  soziales Unternehmen" sind live **Eyebrows** (18 px teal, zentriert), im Rebuild
  **dunkle H2 in 32 px**. Das Eyebrow-Problem, auf dieser Seite bisher nicht erfasst.
- **Eine überzählige Kachel:** `logo-kongruenz-und-authentizitaet` rendert **zweimal** —
  einmal als 90 × 90-Badge im Qualifikationsblock (dort gehört sie nicht hin) und einmal
  als 360 × 360 im Abschluss-CTA. Live existiert sie genau einmal, 389 × 390, im CTA.
- Die Teaser-Überschriften sind live 18 px terrakotta; im Rebuild 13 px/700.
- Die beiden Teaser-Fotos heißen live `banner-2.jpg` und `banner-3.jpg` — das sind die
  Avada-Template-Bilder. Platzhalter bleiben richtig.
- CTA-Überschrift „Dein nächster Schritt": live 48 px, Rebuild 32 px.
- Porträt im CTA: live 336 × 390, Rebuild 230 × 307.
- **Meta-Beschreibung fehlt.**

## B3. Angebote

Der Zehn-Aussagen-Selektor ist **korrekt wiederhergestellt** — ich habe alle zehn
Zuordnungen gegen die Live-Seite geprüft. Sie stecken dort in `data-bridge`- und
`data-offer`-Attributen auf `button.pf-recognition`; die Angaben des Rebuilds stimmen
eins zu eins (6× beratung, 2× workshops, 2× shg). Das war der größte inhaltliche Risikopunkt
und er ist erledigt.

Offen:
- **Das Porträt im Abschluss-CTA fehlt.** Live stehen dort zwei Bilder nebeneinander,
  je 398 × 398: `mg_7425-1` und die Kachel `Logos-geborgenheit_04`. Der Rebuild rendert
  **nur die Kachel** (360 × 360). Die CTA-Komposition ist hier halb gebaut.
- CTA-Überschrift: live H3 28 px, Rebuild H2 32 px.
- **Meta-Beschreibung fehlt.**

## B4. Beratung & Coaching

Die Dauer- und Ortsangaben („50 MINUTEN", „WIEN, ONLINE", „90 MINUTEN") sind **wieder da**
und stimmen mit live überein. Gut.

Offen:
- **Falsches Hero-Bild** (siehe A4): live `Hintergrund.jpg`, Rebuild Granatapfel.
- **„Gut zu wissen" ist live ein Akkordeon.** Vier Fragen, eingeklappt, mit einem
  Plus-Icon in einem Kreis (#90c8c0). Fragen als H4 in 20 px. Der Rebuild zeigt alle vier
  Antworten offen, Fragen als H3 in 26 px. Und „GUT ZU WISSEN" ist live ein zentriertes
  teales Eyebrow, im Rebuild eine dunkle H2 in 32 px.
- **Häkchen-Kreise haben die falsche Farbe:** live #48b0b0, Rebuild #309898.
- **Meta-Beschreibung fehlt.**

## B5. Workshops & Einzeltrainings

Karten, Icons und Ortsangaben sitzen. Offen:
- **Falsches Hero-Bild** (siehe A4).
- **Die Listenmarker-Icons fehlen.** Live hat pro Listenpunkt ein Icon in Salbeigrün
  (#90c8c0) — `fa-book-reader` bei Workshops, `fa-scroll` bei Ressourcen, also **dasselbe
  Icon wie die Abschnitts-Kachel darüber**, nur klein und in Salbe. Der Rebuild rendert die
  Listen ohne Marker (`icons=0`).
- Abschnitts-Icons: live 28 px weiß auf terrakotta — im Rebuild vorhanden und korrekt.
- **Meta-Beschreibung fehlt.**

## B6. Selbsthilfegruppe

Prinzipien-Labels, Terminkarte und Steiermark-Banner sind da. Offen:
- **Der Button ist transparent und kursiv** statt massiv terrakotta und aufrecht (A3).
  Versalien sind hier korrekt, live ist er 13 px.
- **Die Detail-Icons haben die falsche Farbe und Größe:** live 14 px weiß auf **#48b0b0**,
  Rebuild 20 px weiß auf #309898.
- **Die große Überschrift „Nächstes SHG-Treffen" fehlt.** Live steht sie als 40-px-H1
  **über** dem Eyebrow „AKTUELLES"; der Rebuild beginnt direkt mit dem Eyebrow und bringt
  den Titel erst klein in der weißen Karte.
- Das Steiermark-Logo ist live 368 × 177 und rechtsbündig in seiner Spalte; im Rebuild
  220 × 106. Der Begleittext ist live 20 px, im Rebuild 17 px.
- **Meta-Beschreibung fehlt.**

## B7. Kontakt

- **Zur „Anliegen"-Option, gemessen:** das Live-Formular hat genau vier Optionen plus
  Platzhalter — Beratung, Workshops & Trainings, Selbsthilfegruppe, Sonstiges. Der Rebuild
  hat exakt dieselben vier. Es fehlt also **nichts** gegenüber live. Die offene Frage in
  `OPEN-QUESTIONS.md` betrifft eine **zusätzliche, neue** Option, die Marina haben möchte
  (Kooperations- und Presseanfragen). Das ist eine Erweiterung, kein Rückstand — und sie
  blockiert den Abgleich mit live nicht.
- „Erreichbarkeit" und „Standorte" sind live **Eyebrows mit je einem runden
  Terrakotta-Icon davor** (25 px, weiß auf #b33a3b). Der Rebuild zeigt dunkle H2 in 32 px
  **ohne Icons**.
- **Button-Beschriftung weicht ab:** live „Senden", Rebuild „Nachricht senden".
- Der Rebuild hat einen Satz ergänzt, den live nicht hat: „Direkt Kennenlernen vereinbaren —
  zwanzig Minuten, online, kostenfrei." Das ist die gewünschte Querverbindung zu Termine,
  aber es ist neuer Text. Siehe Frage F3.
- **Meta-Beschreibung fehlt.**

## B8. FAQs

- **Die Gruppierung fehlt komplett.** Live sind die Fragen in **drei Reitern** organisiert:
  „Zu Persephone", „Zu Coaching und Beratung", „Zur Selbsthilfe". Der Rebuild zeigt eine
  flache Liste aus dreizehn Fragen. Die Zuordnung Frage → Kategorie ist im Repo nicht
  vorhanden und muss von der Live-Seite geholt werden.
- Live ist es ein Akkordeon mit Plus-Icon (24 px weiß auf #d83830). Fragen H3 24 px,
  Antworten 20 px.
- **Die Antworten haben die falsche Textfarbe: #32373c statt #181a2b.** Das ist ein
  WordPress-Standardgrau, das in den Rebuild durchgerutscht ist. Kommt auch im Blog
  (Autorzeile) und auf Termine (Fallback-Zeile) vor — also eine Stelle im CSS, nicht drei.

## B9. Blog-Übersicht

Datum, Beschreibung, Autorzeile und die einspaltige Liste sind da. Offen:
- **Der Titel sieht anders aus:** live 20 px, **terrakotta, Versalien**; Rebuild 26 px,
  dunkel, normale Schreibung. Live ist die Zeile darüber die Kategorie in Teal — das stimmt.
- **Das Datumsformat weicht ab:** live „16 / 07, 2026", Rebuild „16 / JULI 2026". Der
  Rebuild ist lesbarer. Bewusste Abweichung, aber eine Abweichung.
- Live-Byline enthält Autor, Datum und Kategorien in **einer** Zeile („By Marina von
  Persephone|16.07.2026|…"); der Rebuild verteilt sie auf mehrere Zeilen. Der Rebuild ist
  besser; als Entscheidung festhalten.
- Teaser-Bilder: live 197 × 124 (Querformat), Rebuild 140 × 186 (Hochformat).
- Leerer Bild-Link ohne Namen, wie auf der Startseite.
- **Meta-Beschreibung fehlt.**

## B10. Termine

Live hat **keine** eigene Termine-Seite in der Navigation — sie ist nur verlinkt. Der
Rebuild-Aufbau (Einleitung, eingebetteter Kalender, Fallback-Link, Hinweis aufs
Kontaktformular) ist neu und entspricht der Entscheidung. Nichts zu korrigieren außer der
Typo-Skala und der Textfarbe #32373c in der Fallback-Zeile.

**Meta-Beschreibung fehlt.**

## B11. Impressum

**Wort für Wort identisch mit live.** Nichts zu tun. Meta-Beschreibung ist gesetzt.

## B12. Disclaimer

**Wort für Wort identisch mit live** — beide Absätze, „i.A.u.S.", der Verweis auf KEPOS und
die Supervision, der Hinweis „keine Psychotherapie". Das ist die Seite mit dem
größten rechtlichen Gewicht, und sie ist intakt.

**Meta-Beschreibung fehlt** — hier wäre eine sinnvoll, weil die Seite als Suchergebnis
erscheinen kann.

## B13. Datenschutzerklärung

Live hat **dreizehn** Abschnitte, der Rebuild **zwölf**:

| live | Rebuild |
|---|---|
| 6. Google Fonts | zusammengefasst zu |
| 7. Typekit Fonts | **6. Schriftarten (Fonts)** |

Die Seite ist ~1.580 Zeichen kürzer als live; der Unterschied deckt sich mit dieser Passage.

**Das ist kein Alleingang** — Claude Code hat die Änderung in `OPEN-QUESTIONS.md` Punkt 3
offen dokumentiert, begründet und den wortgetreuen Live-Text zusätzlich in
`src/content/pages/de/datenschutzerklaerung.md` aufbewahrt. Inhaltlich ist die Änderung
vermutlich richtig: die neue Seite hostet DM Sans selbst und lädt weder von Google noch von
Adobe.

**Trotzdem ist es eine Wortänderung an genau der Seite, an der keine passieren sollte.** Das
ist kein Grund, sie rückgängig zu machen — es ist ein Grund, sie Marina **explizit** zu
zeigen, statt sie in einem Absatz mitlaufen zu lassen. Sie gibt sonst einen Text frei, den
sie in dieser Form nicht gelesen hat.

**Zusätzlich, unabhängig davon:** die Live-Erklärung nennt **Matomo Webanalyse** und
**Cookies**. Wenn die neue Seite kein Matomo einsetzt, beschreibt die Erklärung eine
Verarbeitung, die nicht stattfindet — das ist genauso ein Fehler wie eine fehlende.
Zusammen mit dem eingebetteten Microsoft-Kalender (der eine Verbindung ohne Einwilligung
aufbaut) muss diese Seite ohnehin neu geschrieben werden. Das ist keine Aufgabe für Claude
Code, sondern für Marina und die rechtliche Freigabe.

## B14. Blogartikel — Texte vollständig, aber zwei Blöcke am Ende fehlen

Ich habe alle sechs Artikel gegen live geprüft. **Die Fließtexte sind wortgleich** —
Absatz für Absatz, inklusive Zitate, Zahlen und Zwischenüberschriften. Kein Textverlust.

Die Wortzahl liegt bei jedem Artikel konstant 29–41 Wörter unter live. Der Unterschied ist
immer derselbe, und er ist keine verlorene Passage, sondern **zwei fehlende Blöcke am
Artikelende**:

1. **Der Autorinnen-/Newsletter-Block.** Live steht unter jedem Artikel:
   „MARINA VON PERSEPHONE / Für weitere Einblicke in die Kinderwunschreise" mit dem Button
   „e-Brief abonnieren". Im Rebuild endet der Artikel nach dem letzten Absatz.
2. **„Verwandte Beiträge".** Live zeigt jeder Artikel drei weitere Beiträge mit Kategorie,
   Titel und „Continue Reading". Im Rebuild gibt es keine Querverweise zwischen Artikeln.

Beides ist Struktur, nicht Text — nichts muss erfunden werden. Der Newsletter-Block nutzt
bestehende Bausteine; die verwandten Beiträge lassen sich aus den Kategorien ableiten.

**Außerdem:** die Zwischenüberschriften im Artikel sind live in **Versalien**
(„WENN EINSAMKEIT DIE REPRODUKTIVE KRISE PRÄGT"), im Rebuild in normaler Schreibung. Das
ist dieselbe Familie wie A2 und sollte mit dort gelöst werden.

## B15. URL-Änderung, die Weiterleitungen braucht

| live | Rebuild |
|---|---|
| `/angebote-2/` | `/angebote/` |
| `/datenschutzerklaerung/` | `/datenschutz/` |
| `/maenner-im-kinderwunsch-mythos-stille-staerke/` | `/blog/maenner-im-kinderwunsch-…/` |

Alle Blogartikel liegen live **direkt unter der Wurzel**, im Rebuild unter `/blog/`. Beim
Umschalten der Domain laufen sonst alle bestehenden Links und alle Suchmaschinentreffer ins
Leere. Das braucht 301-Weiterleitungen — und die Liste hängt davon ab, wo gehostet wird.
Blockiert durch die Hosting-Entscheidung.

---

# TEIL C — Was gut ist

Damit das nicht untergeht:

- **Alle sechs Blogartikel sind wortgleich mit live.** Das ist der größte Textbestand der
  Seite und er ist unversehrt.
- Der Zehn-Aussagen-Selektor auf Angebote läuft **ohne JavaScript** (Radio-Buttons + CSS
  `:has()`). Das ist besser als die Live-Lösung und für Menschen in Belastung robuster.
- Disclaimer und Impressum sind wortgleich — die beiden Seiten mit rechtlichem Gewicht.
- Beratungs-Badges, SHG-Prinzipien, Terminkarte, Steiermark-Banner: alle wiederhergestellt
  und gegen live geprüft.
- Alt-Texte sind durchgehend gesetzt und beschreibend.
- Die Navigation ist repariert, das Dropdown mit der Maus bedienbar.

---

# TEIL D — Reihenfolge für Claude Code

1. **A1 Typo-Skala** und **A3 Buttons** — zwei Wertesätze, betreffen jede Seite, größter
   sichtbarer Effekt.
2. **A2 Eyebrow-Werte** — dieselbe Klasse, drei Werte.
3. **A4 Hero** — nur noch der Bandhintergrund: #f3ece6 statt #fbf8f5. Die ockerfarbene
   Kurve entfällt ersatzlos, die Hero-Fotos sind bereits richtig.
4. **Farb- und Größenkorrekturen:** #48b0b0 statt #309898 für Häkchen- und Detailkreise,
   #181a2b statt #32373c für Fließtext.
5. **Fehlende Elemente:** Angebote-Porträt im CTA, Workshops-Listenmarker,
   SHG-Überschrift, Kontakt-Icons, Über-uns-Doppelkachel entfernen.
6. **Über uns Qualifikationsblock** als Teal-Band.
7. **Akkordeons:** Beratung „Gut zu wissen", FAQs inklusive der drei Kategorien.
8. **Tippfehler „abonieren"**, leere Bild-Links mit `aria-label`, Meta-Beschreibungen.
9. **Datenschutzerklärung nicht anfassen.** Die eine Wortänderung (Fonts) bleibt stehen und
   geht so zur Freigabe — sie ist dokumentiert und inhaltlich richtig. Nur der Hinweis für
   Marina wird deutlicher gemacht.

10. **Blogartikel:** Autorinnen-/Newsletter-Block und „Verwandte Beiträge" am Artikelende
    ergänzen (B14).

## Entscheidungen von Claudio, 7.9.2026 — nicht mehr zur Diskussion

- **Eyebrow durchgehend teal (#309898)**, auch in der Hero-Zeile. Die Uneinheitlichkeit der
  Live-Seite wird **nicht** übernommen. Der Rebuild macht das bereits richtig.
- **Über uns, Qualifikationsblock: Teal-Band wiederherstellen** — volles Band #309898,
  weiße Schrift, zentrierte Überschriften, Sprachen 34 px, wie live.
- **Diese vier Abweichungen bleiben so, wie der Rebuild sie hat**, und werden *nicht* an
  live angeglichen: Blog-Titel dunkel statt terrakotta-Versalien, Datumsformat
  „16 / JULI 2026", der neue Kontakt-Satz zum Kennenlernen, und der neue Seitentitel der
  Startseite.

---

# TEIL E — Was diese Prüfung NICHT abdeckt

Damit niemand sie für vollständiger hält, als sie ist:

1. **Nur 1440 px.** Handy und Tablet sind ungeprüft. Die Live-Seite bringt Avadas eigene
   Breakpoints mit, der Rebuild seine eigenen — die stimmen mit ziemlicher Sicherheit nicht
   überein. Das muss einmal auf einem echten Telefon passieren.
2. **Nur Ruhezustände.** Hover, Fokus, Tastaturbedienung, das tatsächliche Verhalten des
   Angebote-Selektors und der Akkordeons habe ich nicht durchgeklickt.
3. **Vertikaler Rhythmus nur stichprobenartig.** Ich habe Schriftgrößen, Farben und
   Hintergründe systematisch gemessen, Abstände zwischen Abschnitten nicht. Genau dort kann
   sich „fühlt sich anders an" noch verstecken, auch wenn A1–A4 behoben sind.
4. **Das Kontaktformular sendet nirgendwohin** und ist deshalb nicht testbar.
5. **EN und IT sind ungeprüft** — bewusst, sie sind gesperrt.
6. **Die Live-Seite kann sich ändern.** Alle Messwerte hier sind vom 7.9.2026, abends.
