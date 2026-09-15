# Übersetzung EN / IT — Auftrag

**Diesen Lauf NICHT vor `docs/RUN-2026-09-07-B1.md` und `-B2.md` starten.** Die deutsche Seite ist die
Vorlage; solange sie sich noch ändert, übersetzt man einen Zwischenstand.

---

## Stand, gemessen am 7.9.2026

- Übersetzt ist **ausschließlich die Startseite**, in beiden Sprachen. Die Übersetzungen
  sind brauchbar, aber maschinell und **von niemandem gelesen**.
- **Alle anderen Seiten und alle sechs Blogartikel existieren nur auf Deutsch.**
- Beide Locale-Startseiten tragen `noindex` und stehen nicht in der Sitemap (geprüft:
  19 URLs, alle deutsch). Das bleibt so, bis die Besitzerin freigegeben hat.
- Die Live-Seite persephone.at hat **keine** englische oder italienische Fassung. Es gibt
  also keine Vorlage, gegen die man abgleichen könnte — jeder Satz ist neu.

## Die harte Grenze

**Nichts von `/en/` oder `/it/` geht online, bevor die Besitzerin es Zeile für Zeile
gelesen hat.** Sie spricht Deutsch, Italienisch und Englisch; die Prüfung ist ihre, nicht
die eines Übersetzungswerkzeugs und nicht Deine.

Der Grund ist nicht Stilempfinden. Auf diesen Seiten stehen Aussagen über eine in
Österreich **reglementierte Tätigkeit**: „Lebens- und Sozialberaterin in Ausbildung unter
Supervision", die Abgrenzung zur Psychotherapie, die Nennung der Ausbildungsstätte. Eine
Übersetzung, die daraus „counselor" oder „therapist" macht, beschreibt einen Beruf, den
sie nicht ausübt.

---

## PHASE 1 — Der rechtliche Teil. Zuerst, ohne Ausnahme.

**Das ist ein echter Mangel, kein Feinschliff:** auf `/en/` und `/it/` fehlen **Impressum,
Datenschutzerklärung und Disclaimer vollständig**. Der Footer beider Locale-Startseiten
enthält genau einen Link, und der geht auf den Newsletter. Auf den deutschen Seiten steht
die vollständige Fußzeile (Disclaimer, FAQs, Datenschutzerklärung, Impressum).

In Österreich gilt die Impressumspflicht für die gesamte Website, nicht nur für den
deutschen Teil. Der Disclaimer ist zudem genau die Seite, die die Abgrenzung zur
Psychotherapie ausspricht.

**Zu tun:**

1. Die deutsche Fußzeile auch auf `/en/` und `/it/` ausspielen. Solange es keine
   übersetzten Rechtsseiten gibt, **verlinkt sie auf die deutschen** — mit einem
   ehrlichen Hinweis in der jeweiligen Sprache, dass diese Seiten auf Deutsch vorliegen.
   Ein deutscher Link ist besser als kein Impressum.
2. Danach Impressum, Datenschutzerklärung und Disclaimer übersetzen — als **erste** drei
   Seiten, vor allem anderen.
3. Bei diesen dreien gilt: **Fachbegriffe nicht eindeutschen und nicht "verschönern".**
   Die Berufsbezeichnung, die Ausbildungsstätte und die Formulierung „in Ausbildung unter
   Supervision" werden übersetzt **und der deutsche Originalbegriff in Klammern
   danebengestellt**. Wenn Dir für einen Begriff keine belastbare Entsprechung bekannt
   ist, übersetze ihn nicht — lass den deutschen Begriff stehen und notiere ihn in
   `OPEN-QUESTIONS.md` für die Besitzerin.

Commit nach jedem Schritt.

---

## PHASE 2 — Der Kern, in dieser Reihenfolge

**Richtung entschieden (Claudio, 7.9.2026): neun Seiten, der Blog bleibt deutsch.**
Marinas Bestätigung zu Frage 18 steht noch aus, aber die Richtung ist gesetzt — plane
danach.

1. Über uns
2. Angebote
3. Beratung & Coaching
4. Workshops & Einzeltrainings
5. Selbsthilfegruppe
6. Kontakt

Zusammen mit den drei Rechtsseiten aus Phase 1 sind das neun Seiten pro Sprache.

**Die sechs Blogartikel bleiben deutsch.** Nicht übersetzen, auch nicht „schon mal
vorbereiten". Falls Marina später alles möchte, wird das ein eigener Lauf.

---

## Regeln für die Übersetzung selbst

- **Die Ansprache ist Du, nicht Sie.** Die deutschen Texte duzen durchgehend. Im
  Italienischen entspricht das dem „tu", im Englischen ohnehin dem „you". Kein „Sie",
  kein „Lei".
- **Die Texte sprechen zu Menschen in einer Krise.** Sie sind bewusst ruhig und ohne
  Werbeton. Übersetze das mit — keine Ausrufezeichen, keine Superlative, keine
  Marketingsprache, die im Deutschen nicht steht.
- **Nichts kürzen, nichts zusammenfassen, nichts ergänzen.** Ein Absatz im Deutschen ist
  ein Absatz in der Übersetzung.
- **Eigennamen bleiben:** Persephone, der e-Brief (als Eigenname, mit Erklärung in
  Klammern beim ersten Vorkommen), die Selbsthilfe Steiermark, KEPOS, Jugend am Werk.
- **Ortsangaben bleiben deutsch:** Wien, Graz — nicht „Vienna", nicht „Vienna/Graz online".
- **Zahlen, Adressen, Telefonnummern, Öffnungszeiten wörtlich übernehmen.**
- **Links zeigen auf die jeweilige Sprachfassung, sofern sie existiert** — sonst auf die
  deutsche, mit sprachlichem Hinweis. Kein Link darf ins Leere gehen.

## Was der Build danach garantieren muss

- Kein toter interner Link auf `/en/` oder `/it/` (siehe `RUN-2026-09-07-B1.md` Phase 0.1 —
  aktuell sind es je neun).
- Jede Locale-Seite hat Impressum, Datenschutz und Disclaimer in ihrer Fußzeile.
- `noindex` und Sitemap-Ausschluss bleiben, bis die Besitzerin freigibt. **Diese Sperre
  darfst Du nicht von Dir aus lösen** — auch dann nicht, wenn alles fertig aussieht.
- Der Sprachumschalter zeigt nur Sprachen, in denen die aktuelle Seite tatsächlich
  existiert.

## Zum Schluss

`OPEN-QUESTIONS.md` und `HANDOFF.md` aktualisieren. Im Bericht:

- welche Seiten in welcher Sprache jetzt existieren,
- welche Begriffe Du **nicht** übersetzt hast und warum,
- eine Liste der Sätze, bei denen Du Dir unsicher warst — die schaut sich die Besitzerin
  zuerst an.
