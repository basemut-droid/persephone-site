# Nachtlauf 2026-09-09 — Auftrag an Code

Bevor irgendetwas anderes passiert: gib `pwd` aus. Wenn das nicht
`C:\Users\basem\persephone-site` ist, halt an und sag es mir. Tu sonst nichts.

Screenshots zu diesem Auftrag liegen unter `docs/screenshots/2026-09-09-feedback/`
(16 Dateien, durchnummeriert und beschriftet). Sie sind Claudios Handy-/Browser-
Fotos vom Vergleich Original (persephone.at) ↔ aktueller Rebuild (Vorschau) —
**keine Pixel-Messwerte**. Wo unten "vermutlich Original" oder "vermutlich
Rebuild" steht, ist das meine Einordnung anhand des Codes, nicht Claudios
eigene Aussage — vor dem Umsetzen mit der Live-Seite und der Vorschau
gegenprüfen (Regel 1 aus `docs/UEBERGABE-CHAT.md`: nie aus einem Screenshot
allein schließen, immer gerendertes Markup + berechnete Stile messen, Browser
auf 1440px Viewport). Wenn ein Befund unten der Live-Seite widerspricht, gilt
die Live-Seite — kurz vermerken und weitermachen, keine Rückfrage nötig.

Reihenfolge frei wählbar; E1–E4 (Über uns) und E5–E6 (Startseite) sind
unabhängig voneinander. F ist am Ende ein separater, kleiner Aufräum-Punkt,
kein Design-Thema.

---

## E1 — Über uns: Überschriften "Wer Dir hier begegnet" / "Was aus meiner Kinderwunschkrise wuchs"

**Screenshots:** `01-ueberuns-bio-rebuild-aktuell.png`, `02-ueberuns-bio-original-vermutet.png`

**Befund:** Screenshot 01 zeigt die beiden Überschriften groß, schwarz/dunkel,
normale Groß-/Kleinschreibung — das deckt sich mit dem aktuellen Code
(`ueber-uns.astro` rendert hier ein bloßes `<h2>{heading}</h2>`, global.css
gibt h2 keine Farbe/Transform, also 28px, `--color-text`, normal case). Das
ist vermutlich der Rebuild. Screenshot 02 zeigt beide Überschriften klein,
türkis, GROSSBUCHSTABEN — vermutlich die Original-Seite.

**Auftrag:** `https://www.persephone.at/ueber-uns/` und die lokale Vorschau
nebeneinander öffnen, für beide Überschriften Farbe, Schriftgröße,
Schriftschnitt und Groß-/Kleinschreibung am gerenderten Markup ablesen. Falls
Original tatsächlich die kleine türkise Eyebrow-Optik fährt: die beiden
Überschriften in `ueber-uns.astro`s Bio-Section auf `.eyebrow` umstellen
(gleicher Mechanismus wie z. B. Beratungs `<h2 class="eyebrow">Was ist
Beratung?</h2>`), statt des bloßen `<h2>`. Falls die Live-Seite hier
tatsächlich große schwarze Überschriften zeigt (Screenshot 01 wäre dann
näher am Original als angenommen), nichts ändern und das hier kurz
vermerken.

**Akzeptanz:** Beide Überschriften rendern exakt wie live gemessen (Farbe,
Größe, Case).

---

## E2 — Über uns: Ausbildung/Felderfahrung — Grafik & Listenstil

**Screenshots:** `03-ueberuns-quals-original.png`, `04-ueberuns-quals-rebuild.png`

**Befund:** Screenshot 03 (vermutlich Original): 2×2-Raster, oben links/unten
rechts türkise Blöcke ("Ausbildung"/"Felderfahrung") mit zentrierten Zeilen
ohne Bullet-Punkte, oben rechts/unten links großflächige
Granatapfel-Illustration. Screenshot 04 zeigt ein zweispaltiges Layout
(Panel + Bild nebeneinander, nicht 2×2), das Panel mit echten
Bullet-Punkten vor jedem Listeneintrag, linksbündig statt zentriert, und
unten links im Panel eine **ockerfarbene Schwungkurve**.

**Wichtig — möglicher Regelverstoß:** Falls Screenshot 04 tatsächlich die
aktuelle Vorschau zeigt, widerspricht die ockerfarbene Kurve einer bereits
getroffenen, nicht mehr zu diskutierenden Entscheidung
(`docs/UEBERGABE-CHAT.md`, Abschnitt "Entschieden": *"Die ockerfarbene Kurve
im Hero entfällt ersatzlos (Avada), `#EDA444` kommt nicht ins
Farbsystem."*). Zuerst in der Vorschau prüfen, ob diese Kurve wirklich (noch)
da ist:
- Wenn ja: sofort entfernen, unabhängig vom Rest dieser Aufgabe — das ist ein
  Regressions-Fund, kein Geschmacksthema.
- Wenn nein (Screenshot ist älter als der letzte Nachtlauf-Stand): nur
  vermerken, dass der Screenshot veraltet war.

**Auftrag (Bullet-Stil):** Aktueller Code (`.quals-list { list-style: none }`
in `ueber-uns.astro`) zeigt keine Bullet-Punkte. Live-Seite messen: hat
Original dort wirklich keine Marker (zentrierte Fließtext-Zeilen), oder
Bullet-Punkte? Falls Original keine Marker hat, ist der aktuelle Stand schon
richtig und Screenshot 04 zeigt keinen echten Fehler in diesem Punkt — dann
nur die Kurve prüfen (siehe oben) und den Rest so lassen.

**Neue Anforderung (nicht aus Screenshots, sondern aus Claudios Text) — Scroll-Faden:**
> "außerdem sollten jeweils eine Skill-/Erfahrungskarte und ein Hintergrundbild
> ein 'Faden' (animiert). Wenn man weiterscrollt, dann das nächste."

Gemeint ist: Die drei Qualifikationsbänder (Ausbildung / Felderfahrung /
Sprachen) sollen nicht mehr als drei unabhängig scrollende Bänder
untereinanderstehen, sondern als **ein** Bereich funktionieren, in dem beim
Weiterscrollen die Karte (Text-Panel) *und* das dazugehörige Hintergrundbild
sanft zur nächsten Karte/dem nächsten Bild überblenden ("faden" =
Crossfade), statt hart zu wechseln.

Das ist ein eigenständiges Interaktions-Feature, kein Styling-Fix — bitte
mit Augenmaß umsetzen:
- Leichtgewichtig bauen (Scroll-gekoppeltes Opacity-Crossfade, z. B. über
  `position: sticky` auf dem Bild-/Panel-Container plus IntersectionObserver
  oder scroll-timeline — keine schwere Carousel-Library einbinden).
- Denselben Geist wie der bestehende `.reveal`-Mechanismus (A6, dezent,
  progressive enhancement): ohne JavaScript oder bei
  `prefers-reduced-motion: reduce` bleiben alle drei Bänder einfach
  untereinander sichtbar wie heute — kein gefangener Scroll, kein
  Scroll-Jacking.
- Wenn der Aufwand größer wird als ein, zwei Stunden: kurz stoppen und mir
  (dieser Chat-Rolle) den Stand + Optionen zurückmelden, statt auf Verdacht
  durchzubauen — das ist ein neues Feature, kein Messwert-Fix, und verdient
  vor der Vollumsetzung einen kurzen Zwischenstand.

**Akzeptanz:** Kurve-Regelverstoß-Frage beantwortet; Bullet-Stil gegen Live
verifiziert; Crossfade entweder gebaut (mit Reduced-Motion-Fallback) oder als
Zwischenstand mit Optionen zurückgemeldet.

---

## E3 — Über uns: "Beratung & Coaching" / "Workshops & Trainings"-Teaser

**Screenshots:** `05-ueberuns-teaser-platzhalter-vorschlag.png`,
`06-ueberuns-teaser-original-fotos.png`, `07-ueberuns-teaser-gradient-cards.png`

**Befund:** Screenshot 05 = der aktuell gebaute Stand (Foto+Card-Überlapp
mit `ImagePlaceholder.astro`, NACHTLAUF-2026-09-08.md A4). Screenshot 06 =
Original mit echten Schwarz-Weiß-Fotos, laut Claudio **gleiche Maße** wie
Screenshot 05 — die Platzhalter-Größen/-Proportionen sind also schon richtig
kalibriert.

**Claudios Entscheidung:** Das Foto-Platzhalter-Layout (Screenshot 05) bleibt
**als Backup** im Code, falls es später gebraucht wird, wenn Marina das
Element im CMS/Editor bearbeitet. Für den Moment aber die Elemente aus
Screenshot 07 übernehmen — das sind die türkisen Gradient-Karten mit
"ERFAHRE MEHR"-Button und Punktmuster-Ecke, wie sie die Startseite für
Beratung & Coaching / Workshops & Einzeltrainings schon nutzt
(`src/components/ServiceCard.astro`, siehe `HomePage.astro`).

**Auftrag:**
1. In `ueber-uns.astro` den `.photo-teaser-grid`-Block (Zeilen mit
   `ImagePlaceholder`) durch zwei `<ServiceCard>`-Aufrufe ersetzen — gleiche
   Inhalte wie bisher (Titel/Beschreibung/Href aus `teasers`), gerne mit
   `tone="teal-dark"` und `tone="teal"` (siehe `serviceTones` in
   `HomePage.astro` als Vorbild), damit es wie Screenshot 07 aussieht.
2. Den bisherigen `.photo-teaser`-Code (Markup + `<style>`-Block) **nicht
   löschen**, sondern klar auskommentiert/als Kommentarblock stehen lassen
   mit einem Verweis auf diesen Auftrag ("Backup für den Editor-Fall,
   NACHTLAUF-2026-09-09.md E3 — bei Bedarf reaktivieren, sobald echte Fotos
   vorliegen und Marina das im CMS bearbeiten soll"), oder wenn eine saubere
   Entfernung aus der Datei bevorzugt wird: in `docs/decisions.md` unter
   diesem Datum knapp festhalten, dass der Photo-Teaser-Code aus der
   Versionsgeschichte (git log) wiederherstellbar ist, statt live im Code zu
   liegen. Beides ist okay — Hauptsache nachvollziehbar, wo das
   Platzhalter-Layout wiederzufinden ist.

**Akzeptanz:** Über uns zeigt für beide Teaser die ServiceCard-Optik aus
Screenshot 07; das alte Platzhalter-Layout ist auffindbar dokumentiert,
nicht ersatzlos verloren.

---

## E4 — Startseite: Blog-Karten-Raster (Farben/Schrift/einheitliche Größe)

**Screenshots:** `08-startseite-bloggrid-a.png`, `09-startseite-bloggrid-b.png`

**Befund:** Beide Screenshots zeigen dasselbe 2×2-Raster (4 Beitragskarten),
wirken auf den ersten Blick sehr ähnlich — die Abweichung ist fein
(Kartenhöhen, evtl. Schriftfarbe/-gewicht). Auffällig: Die Karte "Männer im
Kinderwunsch: Mythos 'stille Stärke'" hat einen 4-zeiligen Titel, die
übrigen 2-zeilige — je nach Reihe können die Karten dadurch ungleich hoch
wirken.

**Auftrag:**
1. Persephone.at-Startseite und lokale Vorschau nebeneinander öffnen, das
   Blog-Teaser-Raster (`HomePage.astro`s `.blog-grid`, `BlogTeaserCard.astro`)
   gegen Original messen: Schriftfarbe/-größe der Kategorie-Eyebrow, des
   Titels, des "Weiterlesen"-Links; Kartenränder/Schatten.
2. Prüfen, ob Karten **innerhalb einer Zeile** gleich hoch sind. Falls nicht
   (unterschiedlich lange Titel sprengen die Höhe): `.blog-teaser`
   gleich-hoch machen, analog zum bereits bestehenden Muster bei
   `.format-card`/`.workshop-card` (flex-column + `height: 100%`) — Bild
   und Card-Body sollen die gestreckte Höhe der `<article>` sauber ausfüllen,
   nicht nur die `<article>` selbst.

**Akzeptanz:** Gemessene Abweichungen zu Farbe/Schrift behoben; alle vier
Karten im Raster gleich hoch, unabhängig von Titellänge.

---

## E5 — Startseite: "Der Persephone-Ansatz" — Spalten gleiche Höhe

**Screenshots:** `10-startseite-persephone-ansatz-original.png`,
`11-startseite-persephone-ansatz-rebuild.png`

**Befund:** Zweispaltiger Bereich (`HomePage.astro`s `.philosophy-grid`):
links Fließtext (Eyebrow + Überschrift + 3 Absätze), rechts vier
`ValueTile`-Einträge mit Trennlinien. In beiden Screenshots ragt die rechte
Spalte sichtbar weiter nach unten als die linke — Claudio: *"Die Texte der
beiden Spalten sollen die gleiche Höhe einnehmen, ohne dass sich von der
Anordnung der Texte etwas ändert."* Kein Original/Rebuild-Unterschied,
sondern derselbe Befund in beiden Screenshots — also ein bestehendes Problem,
kein Regressionsfund.

**Auftrag:** Live-Seite messen, ob Original dort wirklich gleich hohe
Spalten hat (Zeilenhöhe/Absatzabstand dort ggf. anders austariert). Ziel in
der Vorschau: beide Spalten enden auf gleicher Höhe, **ohne** Text zu
kürzen, umzustellen oder die Reihenfolge der vier `ValueTile`-Punkte zu
ändern. Ansatzpunkte, die dafür in Frage kommen (Code selbst soll
entscheiden, was am nächsten am Original liegt): Zeilenhöhe/Absatzabstand
der linken Spalte leicht erhöhen, oder vertikalen Abstand zwischen den vier
`ValueTile`-Blöcken rechts leicht verringern.

**Akzeptanz:** Linke und rechte Spalte enden auf derselben Höhe (±wenige
Pixel), Textinhalt und -reihenfolge unverändert.

---

## E6 — Blog-Artikel: Zwischenüberschriften-Farbe

**Screenshots:** `12-blogartikel-original-h2-teal.png`,
`13-blogartikel-rebuild-h2-schwarz.png`

**Befund:** Beide Screenshots stammen aus demselben Artikel ("Männer im
Kinderwunsch: Mythos 'Männerohnmacht'"). Screenshot 12 zeigt die
Zwischenüberschrift "DER WEG ZUR HÖLLE IST MIT GUTEN VORSÄTZEN GEPFLASTERT"
in Türkis — vermutlich Original. Screenshot 13 zeigt "HELDEN WEINEN DOCH" in
Schwarz/Dunkelblau — das deckt sich mit dem aktuellen Code
(`[...slug].astro`: `:global(.post-body h2) { text-transform: uppercase; }`,
keine Farbe gesetzt, erbt also `--color-text`). Vermutlich fehlt schlicht
eine Farbregel.

**Auftrag:** Gegen `https://www.persephone.at/blog/maenner-im-kinderwunsch-mythos-maennerohnmacht/`
(oder den passenden Live-Artikel) messen, welche Farbe die H2 im Fließtext
tatsächlich hat (vermutlich `var(--color-accent)`, #309898 — dieselbe Farbe
wie `.eyebrow`). Dann `:global(.post-body h2)` in `[...slug].astro` um diese
Farbe ergänzen. Textbreite/Schriftgröße des Fließtexts gegenmessen — in den
beiden Screenshots wirkt sie bereits sehr ähnlich, also wahrscheinlich schon
korrekt, aber kurz verifizieren.

**Akzeptanz:** H2-Zwischenüberschriften im Blog-Artikel farblich wie live
gemessen.

---

## E7 — Blog-Artikel: "Verwandte Beiträge" ohne Bilder

**Screenshot:** `14-blogartikel-verwandte-beitraege-aktuell.png`

**Befund:** Zeigt den aktuellen Stand: drei reine Text-Karten (Kategorie +
Titel + "Weiterlesen →"), keine Bilder. Claudio: soll ähnlich aussehen wie
auf der Startseite (siehe `08`/`09` oben) — dort hat jede Karte ein Bild.

**Auftrag:** In `src/pages/blog/[...slug].astro` den `.post-related-grid`
so umbauen, dass er `BlogTeaserCard.astro` wiederverwendet (dieselbe
Komponente wie auf der Startseite) statt der eigenen
`.post-related-item`-Markup — inklusive `heroImage`/`heroImageAlt` aus dem
jeweiligen `related`-Post. Die alte drei-spaltige `.post-related-grid`/
`.post-related-item`-CSS kann entfallen, sobald `BlogTeaserCard` das
übernimmt; ggf. `BlogTeaserCard`s Grid-Spaltenzahl für drei statt zwei
Karten anpassen (eigene `.post-related`-Wrapper-Klasse mit
`grid-template-columns: repeat(3, 1fr)` bei ≥900px, analog zum
bestehenden `@media (min-width: 700px)`-Block).

**Akzeptanz:** "Verwandte Beiträge" zeigt drei `BlogTeaserCard`-Karten mit
Bild, gleiche Optik wie die Startseiten-Blogkarten.

---

## E8 — Workshops & Einzeltrainings: Bulletpoints

**Screenshot:** `15-workshops-bulletpoints-aktuell.png`

**Befund:** Zeigt den aktuellen Stand: `icon-list-sage` (bloßes
Buch-/Schriftrollen-Icon in Salbeigrün vor jedem Punkt, kein Kreis
dahinter). Claudio: *"Bulletpoints wieder zu normalen Bulletpoints zurück
bauen, siehe Beratung und Coaching."* Beratungs eigene Listen
(Einzelberatung/Paarberatung) nutzen `icon-list-check` — ein gefüllter
türkiser Kreis mit weißem Häkchen (`beratung.astro`).

**Auftrag:** In `workshops.astro` beide Listen (Workshops & Trainings /
Ressourcen) von `icon-list icon-list-sage` + `<Icon name="book"/>`
bzw. `<Icon name="scroll"/>` auf `icon-list icon-list-check` +
`<Icon name="check" size={16} />` umstellen — exakt das Muster, das
`beratung.astro`s Formate-Karten schon nutzen. Vor dem Umsetzen kurz gegen
die Beratungs-Seite in der Vorschau gegenchecken, dass das wirklich die
gemeinte "normale" Optik ist (Claudios Formulierung "normale Bulletpoints"
ist nicht hundertprozentig eindeutig — falls die Live-Seite an dieser
Stelle tatsächlich schlichte, unmarkierte `<li>`-Punkte ohne jedes Icon
zeigt, das stattdessen umsetzen).

**Akzeptanz:** Workshops-Listen sehen wie Beratungs-Listen aus (oder wie
live gemessen, falls das etwas anderes ergibt).

---

## E9 — Kennenlernen: Hero & Aufbau

**Screenshot:** `16-kennenlernen-hero-aktuell.png`

**Befund:** Aktueller Stand: reiner Text-Banner (`PageHero` mit
`image={false}`), Überschrift "Kennenlernen", Einleitungssatz separat weiter
unten vor dem Kalender. Claudio möchte den Hero wie auf den anderen Seiten
aufgebaut haben (Split-Hero mit Bild) mit:
- Überschrift **"Kennenlernen vereinbaren"** statt "Kennenlernen",
- dem Text "Das Online Kennenlernen (ca. 20 Min.) ist kostenfrei und dient
  dem gegenseitigen Beschnuppern und der Klärung Deines Anliegens." als
  Hero-Intro (nicht mehr separat unter dem Kalender),
- Granatapfel-Bild (`granatapfel-fruchtbarkeit.png`, der Standard, den
  `PageHero` schon als Default-Bild mitbringt).

**Das ist eine bewusste Design-Entscheidung von Claudio, keine
Live-Site-Angleichung** — die bisherige `image={false}`-Wahl war ebenfalls
eine bewusste, dokumentierte Entscheidung (Kommentar in `kennenlernen.astro`:
"Confirmed no hero image on the live page"). Beides ist richtig für seinen
jeweiligen Zeitpunkt; hier zählt die neue Anweisung.

**Auftrag:**
1. `src/content/pages/de/kennenlernen.md`: `title` auf "Kennenlernen
   vereinbaren" ändern (wirkt sich auch auf `<title>`/Breadcrumbs aus —
   kurz prüfen, ob das irgendwo unerwünscht durchschlägt, z. B. im
   Seitentitel im Browser-Tab; falls ja, den Seitentitel weiter "Kennenlernen
   – Persephone" lassen und nur die H1 im Markup separat setzen).
2. `src/pages/kennenlernen.astro`: `<PageHero title={...} image={false} />`
   auf `<PageHero title="Kennenlernen vereinbaren" intro={intro} />` (Default-
   Bild) umstellen; die bisherige separate `<p>{intro}</p>` im
   `.booking-wrap` entfernen, da der Text jetzt im Hero steht.
3. Kommentar im Code aktualisieren/ersetzen (der alte "Confirmed no hero
   image" wird sonst irreführend).

**Akzeptanz:** Kennenlernen-Seite hat Split-Hero mit Granatapfel-Bild,
Überschrift "Kennenlernen vereinbaren", Einleitungssatz im Hero statt
darunter.

---

## E10 — Kennenlernen: Kalenderbreite

**Kein Screenshot vorhanden** — siehe Hinweis ganz unten, Claudios Text
beschreibt: *"Der Kalender (Bookings) soll die gesamte Breite des Elements,
in dem er eingebaut ist, einnehmen."*

**Befund/Vermutung:** Das iframe selbst hat schon `width="100%"`. Zwei
mögliche Ursachen, die auseinanderzuhalten sind:
(a) Microsofts eigene Bookings-Seite zentriert sich innerhalb des iframes
selbst schmaler, unabhängig von der iframe-Breite — dagegen ist von hier aus
nichts zu machen.
(b) Der umgebende Container (`.booking-wrap { max-width: 56rem }`) ist enger
als "das Element, in dem es eingebaut ist" gemeint ist — Claudio meint dann
vermutlich, dass die ganze Sektion die reguläre Container-Breite
(`--container-max: 1248px`, wie andere Sektionen auch) nutzen soll, statt
der schmaleren `56rem`-Lesebreite.

**Auftrag:** In der Vorschau `/kennenlernen/` öffnen, das iframe und seinen
Eltern-Container per `javascript_tool`/DevTools vermessen (`getBoundingClientRect`
auf iframe vs. `.booking-wrap` vs. `.container`). Wenn (b) zutrifft:
`.booking-wrap`s `max-width` entfernen oder auf `--container-max` erhöhen.
Wenn (a) zutrifft: das Kollegen-Feedback (Claudio) kurz zurückmelden, dass
das an Microsofts eigener Seite liegt und von hier aus nicht behebbar ist.

**Akzeptanz:** Entweder das Kalender-Element nutzt die volle
Container-Breite, oder es ist dokumentiert, dass die Einschränkung von
Microsofts Seite kommt.

---

## F — Repo-Hygiene: uncommittete Dateien (kein Screenshot, siehe unten)

Claudio hat in VS Code eine lange Liste uncommitteter Änderungen gesehen
(u. a. mehrere `build-*.png`-Screenshots unter "Claude outputs",
`external-review-1.md`, `fuer-marina-1.md`, `hero-graphic-2-nachgezeichnet.png`,
`NIGHT-RUN.md`) und fragt, ob und was man da aufräumen sollte. Dazu unten
mehr — das ist keine Aufgabe an Code, die *ich* hier schon präzise genug
formulieren kann, ohne den tatsächlichen `git status` zu sehen (siehe
Antwort an Claudio).

---

## G — Build-Check & Abschluss

Nach E1–E10: `npm run build` und `npx astro check` laufen lassen, beides
muss sauber sein. Danach `docs/decisions.md` und `HANDOFF.md` um diesen Lauf
ergänzen (wie bei jedem vorherigen Nachtlauf), inklusive: welche der
"vermutlich Original/Rebuild"-Zuordnungen oben sich beim Live-Messen als
falsch herausgestellt haben, damit die nächste Sitzung nicht denselben
Denkfehler wiederholt.
