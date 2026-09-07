# Nachtlauf — 8. September 2026

Fasst `RUN-2026-09-07-B2.md` (Phasen 1c bis 4) und `docs/FEEDBACK-2026-09-08.md` zusammen.
**Diese Datei ersetzt B2.** Wo beide sich widersprechen, gilt diese hier.

**Zuerst lesen:**

1. `docs/FEEDBACK-2026-09-08.md` — die Maße und Begründungen zu Teil B.
2. `docs/VERGLEICH-2026-09-07.md` — alle Zielwerte, live gemessen.
3. `OPEN-QUESTIONS.md` — Punkte 7, 11, 17, 21–24 sind erledigt oder entschieden.
4. `CLAUDE.md`, `DESIGN-SYSTEM.md`, `HANDOFF.md`.

---

## SCHRITT NULL

Dev-Server im Hintergrund starten, URL melden, laufen lassen. Startet er nicht sauber, ist
das die wichtigste Meldung — dann anhalten.

## REGELN

- **Nichts erfinden.** Zielwerte stehen in den beiden Dokumenten oben. Was dort nicht steht
  und keine gestalterische Freigabe hat, kommt nach `OPEN-QUESTIONS.md`.
- **Nicht fragen, weiterarbeiten.**
- **Build vor jedem Commit. Commit pro Aufgabe. `HANDOFF.md` nach jedem Commit.**
- Gemeinsame Klassen in `global.css`, nie im scoped `<style>` einer Komponente.
- Keine neuen Abhängigkeiten ohne Eintrag in `OPEN-QUESTIONS.md`.
- **Teil A vor Teil B.** Teil A baut die Bausteine, die Teil B mehrfach verwendet.

## BILDRECHTE — HARTE GRENZE

Tabu, weil aus dem Avada-Demo-Import: `banner-2.jpg`, `banner-3.jpg`, `hero-graphic-2.svg`,
`info-bg-3.svg`, `Hintergrund.jpg`. Nicht herunterladen, nicht einbetten.

**Der Upload-Pfad `2023/…` ist ein Verdachtsmoment, kein Beweis** — dort liegt auch Marinas
eigener Schriftzug. Entscheidend ist der Dateiname: generisch = Vorlage, erkennbar
Persephone = ihres.

Frei verwendbar: alle Porträts von Marina (vom Ehemann fotografiert, Rechte bei ihr, **kein
Fotocredit aus eigenem Antrieb**) und `persephone-granatapfel-fruchtbarkeit` (2026/07).

---

# TEIL A0 — Sofortkorrektur: der Hero auf Über uns ist aufgebläht

**Das ist ein Rückschlag aus Phase 1b und muss als Erstes weg.**

Gemessen am 8.9. im laufenden Dev-Server, 1440 px:

| Seite | Bandhöhe | Bild |
|---|---|---|
| Über uns | **1176 px** | 784 × 1176 |
| alle anderen mit Hero | 520 px | 784 × 520 |

**Ursache:** Phase 1b hat `.hero-grid` von `height: 520px` auf `min-height: 520px`
umgestellt — richtig gedacht, aber jetzt begrenzt nichts mehr die Höhe. Das Bild liegt im
Fluss, hat `width: 100%` und keine Höhenvorgabe, also nimmt es seine eigene Proportion:
das Über-uns-Porträt ist 1000 × 1500, bei 784 px Breite ergibt das 1176 px. Die Gitterzeile
übernimmt diese Höhe.

Alle anderen Hero-Bilder sind querformatig und bleiben zufällig unter 520 px — deshalb
fällt es nur auf einer Seite auf. **Der Fehler ist trotzdem strukturell und trifft jedes
künftige hochformatige Bild.**

**Die Korrektur: das Bild darf keine Höhe beitragen.** Die Zelle ist bereits
`position: relative; overflow: hidden`, es fehlt nur das Herausnehmen aus dem Fluss:

```css
.hero-image img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

Dann bestimmt die Textspalte plus `min-height: 520px` die Bandhöhe, und das Bild füllt
seine Zelle, egal welches Format es hat.

**Wichtig, sonst bricht es auf dem Handy:** sobald die Spalten untereinander stehen, hat
die Bildzelle keinen Inhalt mehr im Fluss und fällt auf null zusammen. Deshalb braucht
`.hero-image` unterhalb des Umbruchpunkts eine eigene Höhe — am saubersten über
`aspect-ratio`. **Nach der Änderung bei 390 px und bei 1440 px nachsehen**, dass beide
Fälle stimmen.

`min-height` bleibt. Die Umstellung war richtig; nur die Konsequenz für das Bild fehlte.

---

# TEIL A — Gemeinsame Bausteine

## A1. Zwei Farbwerte, die überall durchschlagen

- **#48b0b0 statt #309898** für runde Icon-Kreise: Häkchen auf Beratung, Termindetails auf
  Selbsthilfegruppe.
- **#181a2b statt #32373c** für Fließtext. `#32373c` ist ein WordPress-Standardgrau, das
  durchgerutscht ist — in den FAQ-Antworten, in der Autorzeile der Blogliste und in der
  Fallback-Zeile auf Termine. **Eine Stelle im CSS, nicht drei.**

## A2. Das Icon-Set überarbeiten

Zwei Beschwerden aus dem Feedback, beide betreffen dasselbe Set:

- **Die Symbole sind zu fein.** In den Kreisen auf der Terminkarte der Selbsthilfegruppe
  sind sie bei ihrer Größe nicht mehr lesbar. Glyphe im Kreis vergrößern, Strichstärke
  erhöhen.
- **Die Abschnitts-Icons auf Workshops sollen erkennbar sein** als Buch (Workshops) und
  Dokument/Schriftrolle (Ressourcen), so wie live.

Größen zum Abgleich: live 14 px Glyphe auf `#48b0b0` bei den Termindetails; 28 px weiß auf
`#b33a3b` bei den Abschnitts-Icons; 25 px bei den Kontakt-Icons.

## A3. Listenmarker als kleine Icons

Live sind die Aufzählungszeichen in den Workshops-Karten **kleine türkise Versionen
desselben Icons wie die Abschnittskachel darüber** — `book-reader` bzw. `scroll`, 16 px,
`#90c8c0`. Nicht schlichte Punkte.

Als Variante des Listen-Bausteins bauen: „Marker = Icon X in Salbe", damit Beratung und
Workshops dieselbe Mechanik nutzen.

## A4. Das Platzhalter-Element neu gestalten

Die grauen Diagonalstreifen fliegen raus. Stattdessen ein **eigenes, gestaltetes Element in
der Markenpalette**: Fläche in Salbe (#90c8c0) oder Beige (#f3ece6), darauf zentriert das
Persephone-Signet in gedeckter Farbe, darunter klein „Foto folgt".

Es soll aussehen, als gehöre es zur Seite — und trotzdem sofort erkennbar sein als etwas,
das ersetzt wird. **Gestalterische Freiheit ausdrücklich erteilt**, solange nur Farben und
Formen aus dem bestehenden System verwendet werden.

## A5. Der Fußzeilen-Trenner soll nach Pinselstrich aussehen

Aktuell eine glatte, gleichmäßige Welle. Gewünscht: unregelmäßige, handgemalt wirkende
Kante — leicht schwankende Höhe, weiche Ausläufer.

Die Live-Datei ist ein Avada-Separator und wird **nicht kopiert**. Eigenen Pfad zeichnen.
Gestalterische Freiheit, aber es bleibt eine Kante zwischen zwei Flächen, kein Ornament.

## A6. Einblenden beim Scrollen

Vom Besitzer gewünscht, zunächst **nur für den Qualifikationsblock auf Über uns** (B2).

Bedingungen, nicht verhandelbar:
- `prefers-reduced-motion: reduce` schaltet es vollständig ab.
- **Ohne JavaScript sind die Inhalte trotzdem sichtbar.** Kein Aufbau, bei dem Text
  unsichtbar bleibt, wenn ein Skript nicht läuft.
- Dezent: kurze Dauer, kleine Bewegung.

---

# TEIL B — Seite für Seite

## B1. Startseite

- **Tippfehler „e-Brief abonieren" → „e-Brief abonnieren".** Zweimal auf der Seite.
- **Der Button im Gründerinnen-Abschnitt ist falsch.** „ERFAHRE MEHR" unter „Von innen. Und
  von Fach." ist aktuell blass-beige mit tealer Schrift. Live: **massiv terrakotta
  (#b33a3b), weiße Schrift (#fbf8f5), 17 px, Radius 4 px.** Die beige-teale Variante gehört
  ausschließlich auf die drei Angebots-Karten weiter oben.
- **Blog-Teaser: die überlappende weiße Karte fehlt.** Live liegt das Bild links und eine
  weiße Karte greift nach rechts darüber hinaus; sie enthält Kategorie (teal), Titel und
  Weiterlesen-Link. Nachbauen.
  **Nur das Layout.** Marina hat am 7.9. entschieden: Blogtitel bleiben **dunkel und in
  normaler Schreibung**, und es bleibt „Weiterlesen →". Nicht auf die Live-Typografie
  zurückdrehen.
- **Bild-Links ohne Namen:** `<a>` ohne Textinhalt und ohne `aria-label`. `aria-label` mit
  dem Artikeltitel setzen oder den Titel in denselben Link ziehen. Betrifft auch die
  Blogübersicht.
- „Wähle, was gerade zu Dir passt…" ist live ein **Absatz**, kein Heading. Zurückstufen.
- Kategorie-Reihenfolge gegen live prüfen.

## B2. Über uns — die größte Einzelaufgabe

### B2.1 Der Qualifikationsblock

Live: **drei ganzflächige, zweispaltige Bänder**, Seiten abwechselnd. Eine Spalte ein
kräftig türkises Panel mit weißer, zentrierter Schrift (Ausbildung, Felderfahrung,
Sprachen), die andere die Granatapfel-Illustration.

**Das Live-Panel ist `info-bg-3.svg` — Avada, tabu.** Also nachbauen, nicht kopieren:

- Panel: **einfarbig #309898**, weiße Schrift, zentrierte Überschriften, Sprachenzeilen
  **34 px**. Ohne Wellen, ohne ockerfarbenen Bogen.
- Andere Spalte: `persephone-granatapfel-fruchtbarkeit` aus dem Repo.
- Reihenfolge der Seiten abwechselnd.
- Einblenden beim Scrollen nach A6.

### B2.2 Die beiden Abschluss-Teaser

Live-Maße bei 1440 px, aus `docs/FEEDBACK-2026-09-08.md`:

| Element | Breite × Höhe | linke Kante |
|---|---|---|
| Foto links | **420 × 575** | 113 |
| Foto rechts | **680 × 635** | 633 |
| Karte links | **316 × 395** | 113 |
| Karte rechts | **524 × 275** | 633 |

Regeln daraus:
- Blockbreite **1200 px**, Spaltenabstand **100 px**.
- Karte **linksbündig mit ihrem Foto**, Breite etwa **75 %** der Fotobreite.
- Karte ragt unten **130 px** über das Foto hinaus — bei beiden.
- Rechtes Foto beginnt **30 px höher**, rechte Karte sitzt **150 px tiefer**.
- Kartenhintergrund **#fbf8f5**. Kartenhöhe wächst mit dem Text, nicht fixieren.
- Teaser-Überschrift: **18 px terrakotta**, Versalien.
- Fotoflächen bekommen das neue Platzhalter-Element aus A4.

### B2.3 Kleinigkeiten auf derselben Seite

- **Doppelte Kachel entfernen:** `logo-kongruenz-und-authentizitaet` rendert zweimal — als
  90 × 90-Badge im Qualifikationsblock (falsch) und 360 × 360 im CTA (richtig). Badge raus.
- CTA-Überschrift „Dein nächster Schritt": live **48 px**, aktuell 32 px.
- Porträt im CTA: live **336 × 390**, aktuell 230 × 307.

## B3. Angebote

- **Das Porträt im Abschluss-CTA fehlt.** Live zwei Bilder nebeneinander, je **398 × 398**:
  `mg-7425` und die Kachel `logo-geborgenheit`. Aktuell rendert nur die Kachel.
- **Die Antwortkarte soll beim Scrollen mitwandern** — `position: sticky` mit sinnvollem
  Abstand nach oben. Auf schmalen Viewports, wo sie unter der Liste steht, bleibt sie im
  normalen Fluss.

## B4. Beratung

- **„Gut zu wissen" ist live ein Akkordeon** — vier Fragen, eingeklappt, Plus-Icon im Kreis
  (#90c8c0), Fragen als H4 in 20 px. Aktuell alles offen, Fragen H3 26 px.
- „GUT ZU WISSEN" ist live ein zentriertes teales Eyebrow, aktuell dunkle H2 32 px.
- Die beiden Format-Karten gleich hoch, Badges unten verankert (siehe B5).

## B5. Workshops

- **Listenmarker als Icons** nach A3.
- **Abschnitts-Icons** nach A2.
- **Die beiden Karten stehen auf unterschiedlicher Höhe**, weil die linke fünf und die
  rechte vier Listenpunkte hat — dadurch sitzt „WIEN, GRAZ, ONLINE" tiefer als „ONLINE".
  **Karten gleich hoch, Pille unten verankern** (Flex-Spalte, Pille `margin-top: auto`).
  Gilt sinngemäß auch für die Format-Karten auf Beratung.

## B6. Selbsthilfegruppe

- **Die große Überschrift „Nächstes SHG-Treffen" fehlt.** Live als 40-px-H1 **über** dem
  Eyebrow „AKTUELLES"; aktuell beginnt der Abschnitt direkt mit dem Eyebrow.
- **Terminkarten-Icons unlesbar** — nach A2 überarbeiten.
- Steiermark-Logo: live **368 × 177**, rechtsbündig in seiner Spalte; aktuell 220 × 106.
  Begleittext live 20 px, aktuell 17 px.

## B7. Kontakt

- „Erreichbarkeit" und „Standorte" sind live **Eyebrows mit je einem runden
  Terrakotta-Icon davor** (25 px, weiß auf #b33a3b). Aktuell dunkle H2 in 32 px, keine
  Icons. Derselbe Icon-Baustein wie auf Workshops und Selbsthilfegruppe.
- Button-Beschriftung: live „Senden", aktuell „Nachricht senden".
- **Die vier „Anliegen"-Optionen bleiben, wie sie sind.** Der Besitzer hat am 8.9.
  entschieden: **keine fünfte Option.** Nichts ergänzen.

## B8. FAQs

- **Die drei Kategorien fehlen.** Live sind die dreizehn Fragen gruppiert in „Zu
  Persephone", „Zu Coaching und Beratung", „Zur Selbsthilfe". Die Zuordnung ist im Repo
  nicht vorhanden und muss von der Live-Seite geholt werden. Als **strukturierte Daten**
  modellieren.
- Live ist es ein Akkordeon mit Plus-Icon (24 px weiß auf #d83830), Fragen H3 24 px.

## B9. Blogartikel

- **Autorinnen-/Newsletter-Block am Artikelende fehlt.** Live: „MARINA VON PERSEPHONE / Für
  weitere Einblicke in die Kinderwunschreise" plus Button „e-Brief abonnieren".
- **„Verwandte Beiträge" fehlt.** Drei weitere Beiträge mit Kategorie, Titel und
  Weiterlesen-Link, aus den Kategorien abgeleitet.
- Zwischenüberschriften im Artikel sind live in **Versalien**.
- **Die Fließtexte sind wortgleich mit live. Nicht anfassen.**

---

# TEIL C — Marinas Antworten vom 8.9.

## C1. Die zehn Meta-Beschreibungen

Stehen wörtlich in `docs/fuer-marina.md` Frage 16. **Wörtlich übernehmen** — nicht
umformulieren, nicht kürzen, keine Zeichen ändern.

Zwei Rückfragen an sie sind dort offen („psychodukativ" statt „psychoedukativ", „(i.A.u.S)"
ohne Punkt). **Bis zu ihrer Antwort so übernehmen, wie sie es geschrieben hat.** Nicht
stillschweigend korrigieren.

Danach die Meta-Beschreibungs-Regel im Build-Check **blockierend** machen.

## C2. Aus `/termine/` wird `/kennenlernen/` — Name **und** URL

Marina hat den Namen entschieden, der Besitzer am 8.9. die URL.

- Route umbenennen: `/termine/` → `/kennenlernen/`.
- Seitentitel, Überschrift, Menüeintrag, Querverweise von Kontakt und Beratung.
- **Eine Zeile in `docs/START-CHECKLISTE.md` Teil 3 ergänzen:** zusätzliche Weiterleitung
  `/termine/` → `/kennenlernen/` beim Umschalten der Domain.
- Meta-Beschreibung dafür steht in C1 unter „Kennenlernen".

## C3. Was NICHT angefasst wird

- **Der Terminkalender bleibt direkt eingebettet.** Marina hat Frage 13 noch nicht
  abschließend beantwortet. **Kein Umbau, kein Einwilligungsbanner.**
- **Am Matomo-Abschnitt der Datenschutzerklärung ändert sich nichts**, bis Frage 20
  beantwortet ist.
- `src/pages/datenschutz.astro` — kein Wort.

---

# TEIL D — Abschluss

- Build-Check laufen lassen. Blockierend bleiben müssen: Alt-Text, Schema-Felder,
  `internal-links-resolve`, `link-accessible-name`. Neu blockierend: Meta-Beschreibungen.
- `HANDOFF.md` und `OPEN-QUESTIONS.md` aktualisieren.

## Bericht

Ganz oben Befehl und tatsächlich freier Port:

```
So schaust Du es Dir an:
  cd C:\Users\basem\persephone-site
  npm run dev
  → http://localhost:XXXX

Diese Seiten haben sich geändert: …
```

Danach: was gebaut wurde, **wo Du gestalterisch frei entschieden hast und warum** (A4, A5,
A6, B2.1 — dort will der Besitzer Deine Begründung lesen), was nicht bestimmbar war, und
was auf Marina wartet.

**Wenn Du etwas an der Live-Seite prüfen musst: gerendertes Markup und berechnete Stile
lesen, nicht eine Textfassung.** Drei falsche Befunde in diesem Projekt stammen aus
Textextraktion.

---

## NICHT ANFASSEN

- Blogartikeltexte, Impressum, Disclaimer — wortgleich mit live.
- Hero-Fotos — bereits korrekt. Die ockerfarbene Kurve entfällt ersatzlos.
- Die vier bewussten Abweichungen: Blogtitel dunkel statt terrakotta-Versalien, Datumsformat
  „16 / JULI 2026", der neue Kontakt-Satz, der neue Startseiten-Titel.
- EN/IT bleiben gesperrt und auf `noindex`. Übersetzung ist ein eigener Lauf
  (`docs/UEBERSETZUNG.md`).
- Keine Farben, Schriften oder Abstände über die hier genannten Werte hinaus ändern.
