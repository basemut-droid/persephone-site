# Open questions — waiting on you

Only genuinely open items live here. Resolved decisions moved to `docs/decisions.md`
(2026-09-07) — see that file if you want the full history of what was decided and why.

## 0. Selbsthilfe Steiermark logo — confirm permission for continued use

Downloaded from the live page and now used in the new partner band at the bottom of
`/selbsthilfegruppe/` (`docs/RUN-2026-09-07.md` Phase D4, `FIXES-2026-09-07.md` task
2e.4). It's a partner organization's logo, not an Avada template image and not one
of the owner's own photographs, so neither existing rule about images covers it —
the live site already uses it in the context of a stated partnership, so it was
carried into the rebuild rather than left out, but per the task's own instruction:
please confirm Selbsthilfe Steiermark is fine with continued use before launch.

## 0b. The ochre/amber curved shape — RESOLVED 2026-09-07, no longer a question

**Found.** It is `hero-graphic-2.svg`, applied as a `background-image` with
`background-size: cover` to the **outer** `div.fusion-fullwidth.fullwidth-box` of the
hero band — 1425 × ~600 px, spanning the full page width, *behind* the 783 px photo
column. Measured in a live browser on Home, Angebote, Beratung, Workshops,
Selbsthilfegruppe, Kontakt and Blog: present on all of them, absent on Über uns.

The reason the earlier check missed it is worth keeping: it looked at the hero *image*
element and at the source illustration, and both were the wrong place. The shape is not
in the artwork and not layered on top — it is a second, larger background one level up
the DOM.

**Und damit erledigt, nicht zu bauen.** Die Datei ist 569 Bytes: ein Pfad, eine Farbe
(`#EDA444`), ein Bogen. Sie liegt unter `/uploads/2023/02/` — Avada-Demo-Import.
Vom Besitzer am 7.9.2026 bestätigt: der Bogen gehört zur Avada-Vorlage, Marina hat den
Granatapfel bzw. die Porträts darübergelegt.

**Entscheidung: ersatzlos weglassen** — nicht laden, nicht nachzeichnen, kein Ersatz, und
`#EDA444` kommt nicht ins Farbsystem. Die Frage nach der „ockerfarbenen Kurve" ist damit
endgültig geschlossen und darf nicht erneut als Fehlbefund auftauchen.

See `docs/VERGLEICH-2026-09-07.md` section A4.

<details>
<summary>Original entry (kept for the record)</summary>

## 0b-old. The ochre/amber curved shape on subpage heroes — could not confirm from markup

`FIXES-2026-09-07.md` task 2 asks for an "ochre/amber curved shape at the lower-left
edge of the hero image area", visible in the owner's screenshots. Checked the raw
HTML of every subpage hero (Beratung, Angebote, Workshops, Selbsthilfegruppe,
Kontakt, homepage) for a separate decorative element there — found none; the hero
image itself is a single CSS `background-image`, no extra shape layered on top of
it in the markup. Downloaded the full source illustration
(`Hintergrund.jpg`/`persephone-granatapfel-fruchtbarkeit.jpg`, the same artwork
already in the repo) and looked at it directly: it has a salmon/coral scalloped
shape near the top-left, but nothing ochre/amber at the lower-left matching the
description. The shape may come from the live theme's own compiled CSS (a
`::before`/`::after` with its own background-image) rather than anything in the
page's inline styles or the source illustration — that stylesheet wasn't fetched
this run, so this is genuinely unconfirmed, not guessed.

**Not built**, rather than inventing an untokenized color for a shape whose exact
form isn't confirmed. **Recommendation:** send a cropped screenshot of just that
corner of the hero, or the live theme's compiled CSS file, and it can be added in
one pass — it's a small decorative detail once the shape itself is known.

</details>

## 0c. Termine's calendar is embedded directly again — this costs a cookie banner

Decision by the owner's husband, 2026-09-07: go back to embedding the Microsoft
Bookings calendar directly on `/termine/`, without the click-to-load button a
previous session had built specifically to avoid this. Implemented as asked
(`FIXES-2026-09-07.md` task 5e) — but recording the consequence rather than
burying it, since it's a real trade-off and not this run's decision to make:

**An embedded calendar contacts Microsoft's servers on every page load, for
every visitor, before any consent.** That's the one thing on this otherwise
tracker-free site (self-hosted fonts, no analytics) that makes a cookie
consent banner necessary — a banner on every page, for every visitor, plus an
additional passage in the Datenschutzerklärung describing an unconditional
third-party load.

**This needs a decision from you, not a settled matter:** the direct embed is
more convenient by one click and costs a consent banner site-wide. The
alternatives — the click-to-load version that was briefly built and then
reverted, or a plain link out to Microsoft (what the live site does today) —
both keep the site banner-free. No consent banner has been added on this run's
own initiative either way; that decision, and its wording if wanted, is yours.

## 1. Ten pages ship no meta description — ERLEDIGT 2026-09-08

Marina wrote all ten (fuer-marina.md Frage 16); added verbatim to every page listed
here (Über uns, Angebote, Beratung, Workshops, Selbsthilfegruppe, Kontakt,
Kennenlernen, Disclaimer, Datenschutz, Blog index) in `NACHTLAUF-2026-09-08.md`
C1, and the build-check's meta-description rule is now **blocking** (Teil D) so a
future page shipping with none fails the build instead of quietly passing.

Two of her ten sentences carry a wording question she hasn't answered yet
("psychodukativ" on Über uns, probably "psychoedukativ"; "(i.A.u.S)" without the
trailing period the site uses everywhere else, on both Über uns and Beratung) —
taken exactly as she wrote them, not silently corrected. See her own note at
Frage 16 in `fuer-marina.md` for the two open sub-questions.

## 2. The live site ships duplicate/conflicting meta description tags — FYI, not a rebuild task

The live homepage's `<head>` has two `<meta name="description">` tags (the real one
plus an unremoved Avada theme demo default); all 6 blog posts have the same pattern
via `og:description`. This is a bug on the *live* site, already handled correctly in
the rebuild (only the real description ships anywhere) — nothing left to do here
except, optionally, telling whoever manages the live WordPress site so they can clean
it up independently of this rebuild.

## 3. Datenschutzerklärung — NEEDS HUMAN SIGN-OFF (not resolved by code)

This is a legal document for a real business. The owner's wife approves the wording,
not this rebuild — nothing here should be read as "settled," including the parts
already correct. It also needs a fresh re-check at launch against whatever the live
site actually loads by then (its fonts/analytics/embeds could easily change again
between now and launch).

**What's different from the live source, and why:** the live Datenschutzerklärung has
two sections — "6. Google Fonts" and "7. Typekit Fonts" — describing font files loaded
from Google and Adobe. The new Astro site doesn't do this (DM Sans is self-hosted via
`@fontsource`, no external font requests at all), so `src/pages/datenschutz.astro`'s
own Section 6 ("Schriftarten (Fonts)") replaces both with one sentence stating this.
This is the only wording change from the live source anywhere in this document; every
other sentence is the live site's own text, carried over verbatim. Wrapper markup
(PageHero/.section instead of a bare `<h1>`) has changed; confirmed via `git diff`
that zero words have, ever, in any session.

**Current state:** `src/content/pages/de/datenschutzerklaerung.md` (content
collection) stores the live site's text fully verbatim, Google Fonts/Typekit sections
included — a faithful record of the source, not what's shipped.
`src/pages/datenschutz.astro` (the real, live page) has the fonts-section rewrite
described above and is what visitors see. The two files intentionally disagree on
this one point; that's not a bug to reconcile away without the wife's sign-off.

**Needs before launch:**
- The wife's sign-off on the fonts-section wording (and everything else on the page,
  even the parts that are the live site's own existing words).
- A re-check of this whole page against whatever the live site (or the actual
  deployment) loads at launch time — cookies, analytics, embedded forms (Microsoft
  Bookings/Forms are both referenced in the body text), fonts.

## 4. Kontakt's form has nowhere to submit yet — DECIDED, BLOCKED ON A FORM URL

Decided (`fuer-marina.md` Q10 / `external-review.md` 2c): **Microsoft Forms**, same
service already used for the Selbsthilfegruppe registration, submitting to
`marinabletsas@persephone.at`. Chosen because the owner is already on Microsoft 365,
already uses Microsoft Forms for the Selbsthilfegruppe sign-up, the
Datenschutzerklärung already covers Microsoft, and running inside her own tenant
avoids the sender-authentication failure behind the live site's current contact-form
outage (see the urgent item at the top of `fuer-marina.md`).

`ContactForm.astro` (name/phone/email/topic/message/consent + honeypot) is still
deliberately inert (`action="#"`) because **no actual Microsoft Forms URL exists yet**
for this form — the Selbsthilfegruppe's form is a different form for a different
purpose, not reusable here. Nothing to fix in code until the owner creates the actual
Microsoft Form and shares its URL/embed.

**Fünfte Anliegen-Option: ENTSCHIEDEN 8.9.2026 — es gibt keine.** Der Besitzer hat die
drei Vorschläge verworfen; die Kontaktseite bleibt, wie sie ist, mit vier Optionen
(Beratung, Workshops & Trainings, Selbsthilfegruppe, Sonstiges) — genau wie die Live-Seite.
**Nichts ergänzen.**

## 5. Not a decision — just worth knowing

Several `<li>` elements in the live Über-uns page's "Ausbildung"/"Felderfahrung" lists
carry a leftover CSS class, `font-claude-response-body`, in their raw HTML — a tell
that this text was pasted into the WordPress editor directly from a Claude.ai chat
response at some point. Zero visible effect on the live page, and the actual visible
text matches genuine content documented elsewhere — just an FYI in case the owner
wants to clean up the live WordPress page's HTML source at some point.

## 6. `astro.config.mjs`'s `site` is still a placeholder — BLOCKED ON HOSTING

`site: 'https://persephone.example'` — every built page's canonical URL, `og:url`, and
the sitemap all derive from this, and all of them are currently wrong. Left as a
placeholder deliberately: guessing a production domain isn't this run's call, and the
real value depends on the hosting decision, not just the domain — see
`docs/external-review.md`'s "DECISIONS PENDING" section (domain, hosting, and where
the owner writes are three independent choices, and hosting gates everything else —
the contact form endpoint, deploy config, the Datenschutz re-check, and the DNS
cutover).

**Recommendation:** decide hosting first (a European static host simplifies the
Datenschutzerklärung's processor disclosure), then set `site` to the real domain in
one line. `astro.config.mjs` carries a prominent `// TODO` marking exactly where.

## 7. EN/IT: tote Links auf den Locale-Startseiten — ERLEDIGT in Run B1, 8.9.2026

**Endstand, damit die Geschichte nicht noch einmal kippt:**

1. Der ursprüngliche Eintrag stand auf „RESOLVED (EN/IT nav trim)".
2. Ich habe am 7.9. abends gegen den Build von 11:41 gemessen und **je neun tote interne
   Links** gefunden — der Eintrag war also verfrüht. Korrektur auf „NICHT ERLEDIGT",
   Aufgabe nach `RUN-2026-09-07-B1.md` Phase 0.1.
3. **Run B1 hat es tatsächlich behoben.** Die Links sitzen in
   `src/content/site/en.json` und `it.json`; der Fix ist per `git diff` belegt. Der Nav-Trim
   war schon vorher erledigt — offen waren die neun Links in den Services-Karten, dem
   Gründerinnen-Link, beiden e-Brief-Buttons und vier Blog-Teasern.
4. **Meine Fassung dieses Eintrags war danach kurzzeitig wieder falsch**, weil ich die Datei
   als Ganzes mit einem älteren Stand überschrieben habe. Das ist hiermit korrigiert.

`internal-links-resolve` ist seit B1 **blockierend**. Damit kann diese Klasse nicht
zurückkommen.

## 7b. EN/IT must stay unpublished until you've read them — needs your sign-off

Not a code decision. `FIXES-2026-09-07.md` task 4 found the English homepage
contains **no mention of your training status** — searching the built page for
"supervision", "in training", "i.A.u.S." and "psychotherapy" returns zero matches.
It offers "Counseling & Coaching" with no qualifier, and `/en/disclaimer/` doesn't
exist at all. The German site is careful about exactly this everywhere else on the
site — Austrian law regulates these designations and requires the training status
to be disclosed, and an unreviewed translation that drops it describes a service
you may not be able to offer unqualified.

**What's already done, as a stopgap, not a fix:** both locale homepages now carry
`noindex` and are excluded from the sitemap, so they can't be found by search
engines in the meantime. **What still needs you:** read both translations line by
line — in particular every sentence describing your qualifications — before either
goes live. Until then they stay noindexed, whether or not anyone remembers to ask
again.

## 8. Termine's page title — ERLEDIGT 2026-09-08

Marina chose "Kennenlernen" (fuer-marina.md Frage 17); the owner decided the same day
that the URL should move with it, not just the visible title (see #24). Both are
implemented (NACHTLAUF-2026-09-08.md C2): the page is now
`src/content/pages/de/kennenlernen.md` / `src/pages/kennenlernen.astro`, served at
`/kennenlernen/`. Every internal reference (header CTA, Kontakt's cross-link,
Beratung's and Angebote's closing CTAs, the EN/IT header CTA hrefs) was updated to
match — verified via `npm run build`'s blocking `internal-links-resolve` check, which
would have failed on a stale link. `docs/START-CHECKLISTE.md` Teil 3 has the redirect
this needs at launch (`/termine/` → `/kennenlernen/`).

## 9. PageHero's intro line is narrower than the body content below it

`PageHero.astro`'s intro paragraph uses `max-width: 48rem` (768px), while
`.section-narrow` — every subpage's body content, and the homepage's own pain-points
section — is `56rem` (896px). Both values are real and in active use; they just apply
to different elements.

**Question:** is the narrower hero intro deliberate (a common typographic choice — a
short lede often reads better narrower than full body copy), or should it match
`.section-narrow` for consistency? Not changed — colours/fonts/spacing/layout are
settled, and this is exactly that kind of call.

**Recommendation:** leave as-is unless it looks wrong in the screenshots in
`docs/screenshots/`; if so, it's a one-line change in `PageHero.astro`.

---

# Neu aus dem Live-Vergleich vom 7.9.2026 (abends)

Aufgenommen aus `docs/VERGLEICH-2026-09-07.md`. Alle Werte dort sind im echten Browser
gemessen, nicht aus Text erschlossen.

## 10. Hero-Eyebrow — ENTSCHIEDEN 7.9.2026: einheitlich teal

**Entscheidung (Claudio): durchgehend teal #309898, auf allen Seiten, auch in der
Hero-Zeile.** Der Rebuild macht das bereits richtig — nichts zu tun. Der Eintrag bleibt nur
als Begründung stehen, damit die Abweichung von live nicht später erneut „korrigiert" wird.

<details><summary>Befund</summary>

Gemessen in der Hero-Zeile jeder Seite:

| Seite | Farbe des Eyebrows live |
|---|---|
| Beratung, Workshops, Selbsthilfegruppe, Kontakt | **#b33a3b terrakotta** |
| Angebote, Über uns, Blog | **#309898 teal** |

Der Rebuild verwendet durchgehend teal. Das ist auf vier Seiten eine Abweichung — aber die
Live-Seite widerspricht sich hier selbst, es gibt also kein „richtig" zum Abschreiben.

**Frage an Marina:** einheitlich teal (wie der Rebuild es jetzt macht, und wie es in den
Abschnitten innerhalb der Seiten überall aussieht) oder terrakotta in der Hero-Zeile und
teal darunter?

**Empfehlung:** einheitlich teal. Das Terrakotta in der Hero-Zeile steht direkt neben der
terrakottafarbenen H1 und verliert dort seine Funktion als abgesetztes Label.

</details>

## 11. `Hintergrund.jpg` — ERLEDIGT 7.9.2026: Avada-Material, wird nicht verwendet

**Antwort (Claudio): `Hintergrund.jpg` ist ein Element der Avada-Vorlage, das Marina nie
entfernen konnte. Es bestehen keine Rechte daran. Nicht herunterladen, nicht einsetzen.**

**Regel für Hero-Fotos:** der Granatapfel ist das Hauptmotiv — Ausnahme nur dort, wo ein
Porträt hingehört (Über uns, Blog). Der Rebuild macht das auf allen Seiten bereits richtig;
Beratung und Workshops zeigen zu Recht den Granatapfel, nicht `Hintergrund.jpg`.

**Nachtrag zur Hero-Kurve:** `hero-graphic-2.svg` stammt aus demselben Avada-Demo-Import
und wird **ersatzlos weggelassen** — siehe Punkt 0b.

**Faustregel für alles Weitere:** Upload-Pfad `2023/…` = Avada-Demo, tabu. Marinas eigene
Uploads liegen unter `2026/`. Betrifft auch `texture-bg.svg` und `hero-graphic-3.svg`, falls
die noch gebraucht werden.

<details><summary>Ursprüngliche Frage</summary>

Beratung & Coaching und Workshops verwenden live **nicht** den Granatapfel, sondern eine
Datei namens `Hintergrund.jpg` als Hero-Foto. Der Rebuild zeigt auf beiden Seiten den
Granatapfel — das ist schlicht das falsche Bild.

Die Datei ist nicht im Repo. Bevor sie geladen wird, muss geklärt sein, was sie ist:

- ein Foto von Claudio → freie Verwendung, Rechte bei Marina, herunterladen und einsetzen
- ein Avada-Template-Bild → **darf nicht** übernommen werden, wie `banner-2.jpg` und
  `banner-3.jpg` auf Über uns

Der Dateiname (generisch, deutsch, ohne Persephone-Bezug) spricht eher für ein
Template-Bild, ist aber kein Beweis.

**Frage an Claudio:** kurz auf `https://www.persephone.at/beratung/` schauen — ist das ein
Bild von Dir? Falls nicht: Platzhalter wie auf Über uns, und Marina sucht ein Motiv aus.

</details>

## 12. Vier bewusste Abweichungen — ENTSCHIEDEN 7.9.2026: alle vier bleiben

Der Rebuild weicht hier von live ab, und in allen vier Fällen halte ich den Rebuild für
besser. Es sind trotzdem Abweichungen, und der Auftrag war „gleich aussehen und anfühlen".

1. **Seitentitel der Startseite.** Live „Homepage - Persephone". Rebuild „Persephone –
   Navigationshilfe im Sturm des Kinderwunsches". Der neue ist für Suchmaschinen deutlich
   besser — aber er ist erfunden und niemand hat ihn freigegeben.
2. **Blog-Titel in der Übersicht.** Live 20 px terrakotta in Versalien, Rebuild 26 px
   dunkel in normaler Schreibung. Der Rebuild ist ruhiger und besser lesbar.
3. **Datumsformat in der Blogliste.** Live „16 / 07, 2026", Rebuild „16 / JULI 2026".
4. **Neuer Satz auf Kontakt:** „Direkt Kennenlernen vereinbaren — zwanzig Minuten, online,
   kostenfrei." Steht live nicht. Er erfüllt die gewünschte Querverbindung zu `/termine/`,
   ist aber neuer Text.

**Entscheidung (Claudio): alle vier bleiben so, wie der Rebuild sie hat** — einschließlich
des neuen Startseiten-Titels. Nichts zu tun; nicht an live angleichen.

Einziger Nachtrag: der Startseiten-Titel ist das, was in den Suchergebnissen steht. Er ist
freigegeben, aber Marina soll ihn einmal gelesen haben — als Eintrag in `fuer-marina.md`,
nicht als Blocker.

## 13. Über uns, Qualifikationsblock — ERLEDIGT 2026-09-08 (entschieden 7.9.2026)

Live ist das ein **volles Band in Teal (#309898)** mit weißer Schrift, zentrierten
Überschriften und den Sprachen in 34 px — ein deutlicher Farbakzent mitten auf der Seite.
Der Rebuild macht daraus einen cremefarbenen Abschnitt mit kleinen tealen Überschriften.

Das ist der auffälligste Einzelunterschied der Seite und keine Kleinigkeit: er verändert
den Rhythmus der ganzen Seite.

**Entscheidung (Claudio): wiederherstellen** — volles Band in #309898, weiße Schrift,
zentrierte Überschriften, Sprachen in 34 px, wie live. Der Block trägt die Qualifikationen;
genau das soll bei einer Beraterin in Ausbildung sichtbar sein.

**Umgesetzt** (NACHTLAUF-2026-09-08.md B2.1): drei ganzflächige, abwechselnde Bänder in
#309898, nachgebaut statt kopiert (das Live-Panel ist `info-bg-3.svg`, ein Avada-Asset).

## 14. FAQs: die drei Kategorien fehlen — ERLEDIGT 2026-09-08

Die Zuordnung Frage → Kategorie wurde von der Live-Seite geholt (gerendertes Markup,
nicht Text: jeder Akkordeon-Post trägt dort eine `fusion-faq-post-<id>`-Klasse plus
eine Kategorie-Klasse, `<id>` deckt sich mit den `#collapse-1-<id>`-Ankern, die schon
im Repo standen) und in `faqs.astro` als strukturierte Daten hinterlegt
(NACHTLAUF-2026-09-08.md B8). Alle dreizehn Fragen sind jetzt unter „Zu Persephone",
„Zu Coaching und Beratung" und „Zur Selbsthilfe" gruppiert, als drei statische
Abschnitte statt der Live-Seite eigener JS-Filter-Reiter — passend zum Rest der
Seite, die interaktive Gruppierungen durchgehend ohne Pflicht-JavaScript baut.

## 15. 301-Weiterleitungen — blockiert durch die Hosting-Entscheidung

Drei URL-Muster ändern sich:

| live | Rebuild |
|---|---|
| `/angebote-2/` | `/angebote/` |
| `/datenschutzerklaerung/` | `/datenschutz/` |
| `/<artikel-slug>/` (Blogartikel direkt an der Wurzel) | `/blog/<artikel-slug>/` |

Ohne Weiterleitungen laufen beim Domainwechsel alle bestehenden Links und alle
Suchmaschinentreffer ins Leere — betrifft **jeden** Blogartikel. Wie das eingerichtet wird,
hängt vom Hosting ab.

**Nichts zu tun, bis die Hosting-Entscheidung steht** — aber es gehört auf die Liste der
Dinge, die vor dem Umschalten fertig sein müssen.

## 16. Datenschutzerklärung — die eine Wortänderung gehört Marina explizit gezeigt

Punkt 3 oben beschreibt es korrekt und vollständig. Hier nur der Nachtrag: die Änderung
(„6. Google Fonts" + „7. Typekit Fonts" → „6. Schriftarten (Fonts)") ist die **einzige**
Wortänderung im Dokument, sie ist inhaltlich richtig, und sie soll **stehen bleiben**.

Sie darf Marina nur nicht in einem Fließtext untergehen: sie gibt sonst eine Fassung frei,
die sie so nicht gelesen hat. Der Punkt gehört in `fuer-marina.md` als eigener Eintrag mit
beiden Fassungen nebeneinander.

**Unabhängig davon** nennt die Live-Erklärung Matomo und Cookies. Wenn die neue Seite kein
Matomo einsetzt, beschreibt sie eine Verarbeitung, die nicht stattfindet — das ist derselbe
Fehler wie eine fehlende Beschreibung, nur andersherum. Zusammen mit dem eingebetteten
Microsoft-Kalender (Punkt 0c) muss die Seite vor dem Launch ohnehin neu gelesen werden.

---

# Marinas Antworten, 8.9.2026

## 17. `.hero-grid` hatte eine feste Höhe von 520 px — ERLEDIGT in Run B1, 8.9.2026

Von Code im B1-Bericht gemeldet: `.hero-grid` stand in `global.css` auf `height: 520px`
ohne Überlaufbehandlung. Nicht im Browser geprüft, weil das Budget knapp war — richtig so
gemeldet, statt still geändert.

**Nachgemessen (8.9., alle Seiten mit Hero-Bild, 1024–1920 px): nirgends ein Überlauf.**
Engste Stelle war die Startseite bei 1024 px mit 18 px Reserve, also etwa einer halben
Textzeile. Werte in `docs/PRUEFUNG-B1.md`.

**Behoben in Phase 1b:** `height` → `min-height`. Am heutigen Rendering ändert sich nichts,
aber das Band wächst künftig mit, statt zu überlaufen.

*Dieser Eintrag war zwischenzeitlich ganz aus der Datei verschwunden, weil ich sie als
Ganzes mit einem älteren Stand überschrieben habe. Hiermit wiederhergestellt.*

## 21. Erledigt durch ihre Antworten

- **Punkt 1 (Meta-Beschreibungen): ERLEDIGT.** Sie hat alle zehn geschrieben; der Wortlaut
  steht in `docs/fuer-marina.md` Frage 16. Umgesetzt in `NACHTLAUF-2026-09-08.md` C1
  (siehe Punkt 1 oben). Zwei winzige Rückfragen an sie sind dort offen („psychodukativ",
  „(i.A.u.S)" ohne Punkt) — bis dahin wörtlich übernommen, nicht korrigiert.
- **Punkt 0 (Selbsthilfe-Steiermark-Logo): ERLEDIGT.** Die Nutzung ist abgesprochen.
- **Frage 15 (Startseiten-Titel): bestätigt**, bleibt wie er ist.
- **Frage 17: die Terminseite heißt künftig „Kennenlernen".** Umgesetzt, Name **und** URL
  (`NACHTLAUF-2026-09-08.md` C2, siehe Punkt 8/24 oben) — `/kennenlernen/`.
- **Frage 18 (Übersetzung): bestätigt** — neun Seiten in Etappen, Blog bleibt deutsch.
  `docs/UEBERSETZUNG.md` ist damit freigegeben: der Nachtlauf (der B2 ersetzt hat) ist
  durch.

## 22. Eine Korrektur an meiner eigenen Darstellung — Cookie-Banner

Ich hatte geschrieben, ein Einwilligungsbanner erscheine „auf jeder Seite, für jede
Besucherin". **Das war überzogen und Marina hat zu Recht widersprochen.** Ein Banner
erscheint einmal, beim ersten Besuch, auf der Einstiegsseite; die Entscheidung wird
gespeichert. Die Korrektur steht in `docs/fuer-marina.md` 13a.

## 23. Was der Bookings-Kalender tatsächlich ablegt — gemessen, aber nicht verlässlich

Marina hat gefragt, ob sich zuverlässig sagen lässt, welche Cookies der eingebettete
Kalender setzt und was sie tun. Gemessen am 8.9.2026, Buchungsseite als eigene Seite
aufgerufen, nicht angemeldet:

- **Weiterleitung** `outlook.office.com` → `bookings.cloud.microsoft`. Zwei Domains.
- **Cookies:** `ClientId`, `msal.cache.encryption`
- **Lokaler Speicher, 11 Einträge**, darunter `olk-OwaClientId`, `olk-OwaLocale`,
  `olk-OwaSessionCount`, `olk-isTimeZoneCacheAvailable`, `msal.version` — und
  **`mats-telemetry-profile-id`**, also eine Kennung zur Nutzungsmessung.
- **Sitzungsspeicher:** 2 Einträge.

**Warum das keine belastbare Grundlage für einen Rechtstext ist:** gemessen als eigene
Seite, nicht eingebettet (Browser behandeln eingebettete Speicher unterschiedlich); Namen
und Zweck können sich jederzeit ändern; Microsoft veröffentlicht dafür keine verbindliche
Liste; angemeldete Besucher bekommen möglicherweise mehr.

**Folge:** die Empfehlung zu Frage 13 hat sich geändert — **Kalender lädt erst auf Klick.**
Dann ist keine Cookie-Liste nötig, und die Datenschutzerklärung sagt etwas, das dauerhaft
wahr bleibt. Entscheidung liegt bei Marina.

## 24. Soll `/termine/` zu `/kennenlernen/` werden? — ENTSCHIEDEN 2026-09-08: ja

Der Besitzer hat sich für den Empfehlung gefolgt und umbenannt: Name **und** Pfad
wandern beide auf „Kennenlernen" (NACHTLAUF-2026-09-08.md C2). Die Seite lebt jetzt
unter `/kennenlernen/`; die zusätzliche Weiterleitung `/termine/` → `/kennenlernen/`
steht in `docs/START-CHECKLISTE.md` Teil 3.

# Neu aus LAUF-2026-09-10.md

## 25. Kontakt-Formular: kein Absendeweg — DECIDED, BLOCKED ON EINER URL

Beschlossen ist ein Microsoft-Formular; die Formular-URL fehlt aber bis heute. Die
neue Kontaktseite (Teil C) hat die Felder aus Marinas Prototyp gebaut
(`ContactForm.astro`: Name, E-Mail, Anliegen, Nachricht), aber `<form action="#">`
ist ein sichtbarer Platzhalter — siehe den `TODO`-Kommentar direkt im Component. Sobald
die Formular-URL existiert: entweder `action` darauf umbiegen, oder das `<form>` ganz
durch ein eingebettetes Microsoft-Formular ersetzen (diese Wahl ist selbst offen, siehe
Punkt 27 unten).

## 26. Kontakt: drei oder vier Anliegen-Optionen? — WIDERSPRUCH, NICHT AUFGELÖST

Der Prototyp (`docs/mockups/kontakt-prototype.dc.html`) bietet drei Optionen: „Frage zu
Persephone", „Kooperation & Presse", „Sonstiges". Beschlossen waren an anderer Stelle
**vier** Anliegen-Optionen, ausdrücklich ohne fünfte (siehe Punkt "Kontakt's Anliegen
dropdown" in `HANDOFF.md`, Entscheidung 2026-09-08). Dieser Lauf hat sich für die drei
aus dem Prototyp entschieden, weil er der jüngere Stand ist (LAUF-2026-09-10.md C3.2) —
aber das löst den Widerspruch nicht auf, es wählt nur eine Seite davon. Marina/Claudio:
bitte entscheiden, ob die vierte Option zurückkommt oder die frühere Vier-Optionen-
Entscheidung selbst überholt ist.

## 27. Kontakt: „Termin buchen" — Overlay oder eigene Seite?

Der Prototyp öffnet für „Termin buchen" ein Overlay mit Platzhaltertext ("Hier
erscheint die bestehende Buchungsseite"). Es gibt aber bereits `/kennenlernen/` als
eigene Seite, und beschlossen war, dass Kontakt- und Terminseite getrennt bleiben. Der
Link geht deshalb vorerst auf `/kennenlernen/` — die Variante, die keine Entscheidung
vorwegnimmt. Zu klären: soll das stattdessen ein Overlay mit eingebettetem Kalender
werden (wie im Prototyp), oder bleibt die einfache Verlinkung?

## 28. Zwei Farbvorschläge brauchen Marinas Auge

Beide sind umgesetzt, weil das Dokument es so verlangte, aber beide sind *mein*
Vorschlag, nicht ihre Bestätigung:

- **`--color-teal-darker` (`#226e6e`)** für die grüne Footer-Schrift (A5) — keine der
  bestehenden Türkistöne erfüllt 4,5:1 Kontrast auf dem Footer-Beige, dieser schon
  (5,09:1). Ist das noch „grün" in ihrem Sinn?
- **Angebote-Dropdown-Farbe (B9)**: `--color-accent` (`#309898`) auf Weiß liegt bei
  ~3,4:1 — unter dem Fließtext-Standard, aber die Menüeinträge sind groß genug gesetzt,
  dass das vertretbar sein könnte. Alternative: der dunklere `--color-teal-darker`.

## 29. Punkt 35 fehlt in Marinas Liste

Ihre Liste springt von 34 auf 36 (siehe `docs/LAUF-2026-09-10.md`). Nichts in diesem
Lauf deutete darauf hin, worum es gegangen sein könnte — bitte nachreichen, falls es
noch relevant ist.

## 30. B10 Punkt 28 („Gut zu wissen"-Gestaltung) — konnte nicht bestätigt werden

Marinas Screenshot-Vergleich (`docs/feedback-2026-09-10/punkt-28.png`) zeigt im Rebuild
eine boxig wirkende Akkordeon-Darstellung mit eckigen statt runden Icons — das passt
aber nicht zu dem, was `global.css`s geteiltes `.accordion-item` tatsächlich rendert
(schlichte Zeilen mit Trennlinie, runde Icons), das schon dem Original entspricht.
Möglich, dass der Screenshot ein Browser-/Inspektor-Overlay statt der echten Seite
zeigt. Keine Änderung vorgenommen, weil sich in der aktuellen Codebase keine
abweichende Darstellung finden ließ — bitte nach diesem Lauf direkt nachprüfen.

# Neu aus den Live-Korrekturen nach dem Abschlussbericht (10./11.9.2026)

## 31. Über uns, Qualifikationsbänder: Kontrast wieder gesenkt — Ihr Auge gefragt

Auf einen Live-Screenshot hin ist die Fläche wieder auf `--color-teal-dark`
(`#309898`) mit hellem Text zurückgestellt, nachdem B7 Punkt 17 sie extra auf
`--color-sage` mit dunklem Text gestellt hatte, um den WCAG-Standard zu erfüllen
(9,18:1 statt 2,96:1 Kontrast). Der neue Wert unterschreitet 4,5:1 wieder — ein
bewusster Trade-off dieser expliziten Vorgabe. Bitte bestätigen, dass das so
gewollt ist, gerade weil hier schon einmal in die andere Richtung korrigiert wurde.

## 32. Über uns, Qualifikationsbänder: dekorative Fläche ist eine Annäherung, keine Kopie

Die Wellentextur und der abgerundete Rostorange-Akzent in der Panel-Fläche wurden
von Hand nach einem Referenz-Screenshot nachgebaut (Farben pixelgenau gemessen:
Fläche `#309898`, Akzentform `#c26d32`), nicht mit einem Bildgenerator exakt
nachgezeichnet — dafür fehlt mir ein Werkzeug. Bitte ansehen und sagen, ob die
Annäherung genügt oder ob die Original-Illustration eingebunden werden soll (dann
bräuchte es die Bilddatei selbst, nicht nur einen Screenshot davon).

## 33. Über uns, Qualifikationsbänder: Übergang beim Scrollen — GELÖST (NACHTRAG N4, 11.9.)

War offen, weil das Scroll-*Gefühl* sich nicht mit einem Werkzeug prüfen ließ. Claudio hat es
im echten Browser geprüft und den Befund geliefert: die Bänder schoben sich sichtbar
übereinander, statt sauber überzublenden ("more like a slide in whereas the original one
vanishes while the other appears"). Ursache war `position: sticky` auf jedem Band einzeln,
gestapelt hintereinander — dadurch schob sich das nachrückende Band optisch über das
vorige, obwohl die Deckkraft selbst sauber überblendete. Behoben: jetzt ist nur die neue
`[data-quals-stage]`-Hülle sticky, die drei Bänder liegen absolut übereinander an derselben
Stelle und ausschließlich die Deckkraft ändert sich — nichts bewegt sich mehr. Siehe
`docs/decisions.md`'s Eintrag vom 11.9.2026.

## 34. Über uns, Qualifikationsbänder: mehrere Live-Korrekturen widersprechen dem Nachtrag-Text

Direkt im Anschluss an N1–N4 gab es weitere Live-Korrekturen, live am Telefon über WLAN
geprüft, die Teile des schriftlichen Nachtrags überschreiben:

- **Die diagonale Wellentextur** (`.quals-panel::before`) — der Nachtrag sagte ausdrücklich,
  sie bleibe ("ist etwas anderes und bleibt"). Auf direkten Wunsch jetzt trotzdem entfernt,
  die Fläche ist reine Flatfarbe ohne Textur.
- **Die Panel-Höhe** — N2 selbst sagte, die Höhe dürfe sich aus dem Inhalt ergeben (das
  dritte Band, Sprachen, sei kürzer). Ein direkter Vergleich aller drei Original-Bänder
  nebeneinander (Live-Screenshots) zeigte aber: alle drei sind in Wahrheit exakt gleich groß,
  nur die Platzierung alterniert. Jetzt fix auf `calc(100svh - 117px)` gesetzt — die Fläche
  unterhalb der Kopfleiste, gemessen bei 1440 px (Kopfleiste: 117 px, `position: sticky`,
  kein Overlay). Die 117 px sind ein gemessener, nicht dynamisch nachgeführter Wert; ändert
  sich die Kopfleistenhöhe künftig (z. B. durch neue Nav-Punkte), muss diese Zahl von Hand
  nachgezogen werden.
- **Die Zeilenbreite** — auf Wunsch jetzt "fast die ganze Seitenbreite" (eigener
  `.quals-container`, `max-width: 1800px`, kleiner werdender Rand statt der sonst
  sitenweiten 1200-px-Textspalte aus A1). Eine bewusste Ausnahme von der sonst
  durchgehenden Textbreiten-Konvention, nur für diese eine Komponente.
- **Ein neuer Slideshow-Positionsindikator** (rote Pille mit drei Punkten, rechts) — in
  keinem der schriftlichen Aufträge erwähnt, auf Zuruf gebaut, weil die Original-Screenshots
  (Nummer 4 und 5) ihn zeigten. Nur im Enhanced-Zustand sichtbar (JS + ≥900 px + kein
  `prefers-reduced-motion`), sitzt in `[data-quals-stage]` selbst, damit er beim
  Weiterscrollen zur ClosingCta-Sektion korrekt wieder verschwindet.

Bitte im echten Browser gegenprüfen, ob diese vier Korrekturen so bleiben sollen — sie sind
alle aus Live-Feedback in genau dieser Sitzung entstanden, nicht aus einem schriftlichen
Auftrag.

## 35. Der Rostorange-Akzent (#c26d32) — Widerspruch zwischen N3 und dem echten Original

N3 (`docs/NACHTRAG-2026-09-11.md`) ordnet die Entfernung dieses abgerundeten Akzents
ausdrücklich an, als Teil des projektweiten Ocker-Verbots aus `docs/LAUF-2026-09-10.md`s
"NICHT ANFASSEN" (dort ist wörtlich von der Hero-Kurve `#EDA444` die Rede). Diese Sitzung
hat er die Entfernung befolgt — sie ist umgesetzt.

**Aber:** In derselben Sitzung wurden mir zum Vergleich Live-Screenshots der drei
Original-Qualifikationsbänder geschickt, und alle drei zeigen genau diesen
Rostorange-Bogen mit dünner heller Linie darüber als festen Bestandteil der
Original-Illustration — kein Ausreißer, sondern die eigentliche Grafik. Das ist ein anderer
Farbton (`#c26d32`, "Rostorange") als die Hero-Kurve (`#EDA444`, "Ocker"), auf die sich das
NICHT-ANFASSEN-Verbot ursprünglich bezog.

Ich habe den Akzent **nicht** wieder eingebaut — N3s Entscheidung ist eine schriftliche
Entscheidung auf der Aufzeichnung, und die Live-Nachrichten in dieser Sitzung haben ihn
nicht ausdrücklich zurückgefordert, nur zum Vergleich gezeigt. Aber der Widerspruch ist real
und braucht eine bewusste Entscheidung: gilt das Ocker-Verbot wirklich für jeden
orange-artigen Ton projektweit (dann bleibt der Akzent draußen), oder war es spezifisch für
die Hero-Kurve gemeint (dann könnte dieser andere Ton zurück, weil er zur echten
Originalgrafik gehört)?

## 36. ClosingCta (Foto+Logo) — auf allen vier Seiten vereinheitlicht, zwei ältere Entscheidungen überschrieben

Live-Feedback (Telefon-Screenshots) verglich die vier Verwendungen dieser Komponente
(Über uns, Angebote, Workshops, Beratung) und fand sie uneinheitlich. Ergebnis dieser
Sitzung: **eine** gemeinsame Form für alle vier — Foto und Logo beide quadratisch, gleich
groß, Foto unten-links über das Logo versetzt (mit spürbarer Überlappung, kein schmaler
Rand). Die eigene Logofarbe jeder Seite bleibt unverändert (Braun/Beige, Terrakotta, Blaugrau,
Türkis — je nach Seite).

Das überschreibt zwei ältere, schriftlich festgehaltene Entscheidungen:

- **`NACHTLAUF-2026-09-08.md` B3** (Angebote: zwei gleich große Bilder nebeneinander, kein
  Überlappen) — war ohnehin schon durch `LAUF-2026-09-10.md` B8 Punkt 30 zurückgenommen
  worden (Foto/Logo sollen sich überlappen).
- **`LAUF-2026-09-10.md` B10 Punkt 29 / B11 Punkt 32** (Workshops, Beratung: "gleich große
  Quadrate … **ohne** Überlappung", `layout="pair"`) — diese Sitzung hat das `layout`-Prop
  und den ganzen "pair"-Zweig ersatzlos entfernt; Workshops und Beratung überlappen jetzt
  genauso wie die anderen beiden Seiten.

Bitte bestätigen, dass die eine gemeinsame Form für alle vier Seiten so gewollt ist —
insbesondere, dass Workshops/Beratung jetzt auch überlappen sollen, obwohl der
ursprüngliche Auftrag dort ausdrücklich "ohne Überlappung" verlangt hatte.

## 37. Über uns, "Beratung & Coaching"/"Workshops & trainings"-Kacheln — Größenverhältnis dreimal live nachjustiert, jetzt per CSS Grid gekoppelt

Nach dem Umzug der Kacheln von Angebote nach Über uns (N1) kam dreimal Live-Feedback zum
Größenverhältnis von farbiger Fläche und weißer Textkarte: erst war die Karte zu groß (fast
deckungsgleich mit der Fläche), dann — nachdem beide auf ein erzwungenes Quadrat gleicher
Größe gestellt wurden — blieb unter dem Text viel leerer Weißraum übrig, weil das Quadrat
höher war als der Inhalt brauchte. **Gelöst, nicht nur nachjustiert:** Fläche und Karte
liegen jetzt in derselben CSS-Grid-Zelle übereinander; die Kartenhöhe ergibt sich aus dem
Text (kein `aspect-ratio` mehr), und die Fläche übernimmt per Grid-`stretch` automatisch
genau diese Höhe — beide sind dadurch dauerhaft gleich groß, auch wenn sich der Text später
ändert, ohne dass hier erneut von Hand nachgemessen werden muss. Bitte trotzdem im echten
Browser gegenprüfen, ob der Versatz (aktuell 1,5rem links / 3rem unten) so passt.

## 38. Rote Buttons: Verlauf im Ruhezustand zurück, Hover unverändert

Eine frühere Nachkorrektur hatte `.button-primary` anhand pixelgesampelter Screenshots auf
flache Flächen umgestellt (Ruhe **und** Hover, kein Verlauf). Live-Feedback zum aktuell
gerenderten Button (Screenshot) zeigte ausdrücklich einen Verlauf im Ruhezustand — jetzt
wieder `linear-gradient(--color-cta-from, --color-cta-to)`, also A3s ursprüngliche zwei
Rottöne. Der Hover-Zustand blieb bewusst unangetastet (flache `--color-terracotta-hover`-
Fläche) — nur der Ruhezustand wurde zurückgefordert. Gilt sitenweit, da `.button-primary`
die geteilte globale Regel ist. Bitte gegenprüfen, ob Ruhe UND Hover jetzt so stimmen, da
hier bereits zweimal in unterschiedliche Richtungen korrigiert wurde.

## 39. Homepage: orangefarbene Punkte auf den Service-Karten entfernt

`ServiceCard`s dekorative Ecktextur (`/textures/seed-texture.svg`, verstreute orangefarbene
"Kerne" unten rechts, sichtbar auf der Startseite und überall sonst, wo `ServiceCard`
verwendet wird) ist auf direkten Wunsch ersatzlos entfernt. Betraf nur die Startseite zum
Zeitpunkt der Entfernung (`ServiceCard` wird seit N1 nirgendwo sonst mehr live gerendert,
Über uns nutzt jetzt `.offer-tiles`). Kein schriftlicher Auftrag dazu vorhanden — reine
Live-Korrektur, zum Vermerk hier.

## 40. Startseite, Newsletter-Band: Abstand zwischen Überschrift und Text entfernt

`CtaBand`s h2→p-Abstand (`--space-6`, 2,5rem/40px) auf 0 gesetzt, auf direkten Wunsch
("Abstand entfernen" — wörtlich genommen, nicht auf einen kleineren Zwischenwert reduziert).
Betrifft `CtaBand`, also auch jede Unterseiten-Schluss-CTA, die diese Komponente nutzt.

## 41. Disclaimer: Titel jetzt linksbündig statt optisch zentriert — GELÖST

War zunächst durch `PageHero`s geteiltes `.page-hero-inner` (max-width 768px) verursacht,
das gegen den durch A1 bereits auf 1200px verbreiterten Fließtext darunter zu schmal und
dadurch optisch zentriert wirkte. Ein Zwischenschritt (Seiten-eigener Breiten-Override) hatte
das behoben, aber einen vorbestehenden, unabhängigen 390px-`scrollWidth`-Überschuss (419px
statt 390px) auf derselben Seite offengelegt, dessen Ursache zunächst nicht auffindbar war.
**Beides erledigt sich jetzt gemeinsam:** Live-Korrektur vom 12.9. hat `PageHero` auf dieser
Seite ganz durch ein einfaches `<h1 class="eyebrow">` ersetzt (siehe #42 für den gleichen
Schritt auf Datenschutz) — der Titel ist dadurch von Haus aus linksbündig, und der
390px-Überschuss ist mitverschwunden (390px gemessen, kein Überlauf mehr). Vermutlich lag
die Überlauf-Ursache also tatsächlich in `PageHero`s eigenem Rendering (z. B. der
Reveal-Animation oder Bild-Auszeichnung), nicht in etwas dieser Seite selbst — nie einzeln
bestätigt, aber durch das Verschwinden mit der Komponente naheliegend.

## 42. Datenschutzerklärung: kein separates Hero-Banner mehr, nur ein kleines Eyebrow-Label

Ein Vergleich mit einem Original-Screenshot zeigte: die Live-Seite hat für "Datenschutz-
erklärung" gar kein eigenes `PageHero`-Banner mit großem rotem Titel — nur ein kleines,
großgeschriebenes türkises Label direkt über "Marina Bletsas | Stand: ...", auf demselben
hellen Hintergrund wie der restliche Text, keine eigene beige Bandfläche. Angepasst:
`<PageHero>` entfernt, stattdessen ein `<h1 class="eyebrow">` direkt im Textblock (weiterhin
ein echtes, einziges H1 für Semantik/SEO, nur optisch wie die anderen Eyebrow-Labels der
Seite gestylt). Rechtstext selbst nicht verändert.

## 43. Kontakt: mehr Abstand zwischen Namenszeile und "Standorte"

`.kontakt-person-col`s Zeilenabstand (Name/Foto → Standorte → Terminverfügbarkeit) von
1,25rem auf 2rem erhöht, auf direkten Wunsch. Gilt einheitlich für beide Abstände in dieser
Spalte (nicht nur den ersten), da beide vom selben Grid-`gap` gesteuert werden.

## 44. Über uns, Qualifikationsbänder: helleres Grün, Spalten-Bug bei Band 2 behoben, Schrift vergrößert, Alternation korrigiert

Vier weitere Live-Korrekturen an denselben drei Bändern:

- **Farbe:** von `--color-teal-dark` (#309898) auf `--color-teal` (#48b0b0, "Empathie", die
  zweite Markenfarbe laut Brandbook) aufgehellt, auf ausdrücklichen Wunsch ("orientiere Dich
  am Brandbook"). Senkt den ohnehin schon unter 4,5:1 liegenden Kontrast des hellen Texts
  weiter — derselbe bewusste Trade-off wie in #31, jetzt noch einmal verschärft.
- **Echter Bug gefunden und behoben, nicht nur nachjustiert:** Band 2 (Felderfahrung)
  hatte eine sichtbar schmalere Textspalte als Band 1 und 3 — verursacht durch die alte
  `order: 2`-Technik zum Seitenwechsel, die nicht nur die Malreihenfolge, sondern auch die
  Grid-Spaltenzuordnung vertauscht hatte (das Panel landete in der schmalen 1fr-Spur statt
  der breiten 2fr-Spur). Jetzt über `grid-template-areas` gelöst: das Panel bleibt auf
  beiden Seiten in der 2fr-Spur, nur die Anordnung der Spuren selbst wechselt.
- **Schrift:** die Aufzählungslisten (Ausbildung/Felderfahrung) von 1,25rem auf 1,5rem
  vergrößert, orientiert an (nicht exakt übernommen von) der Sprachen-Zeilen-Größe
  (2,125rem/34px) — 34px wörtlich hätte bei den längeren, umbrechenden Listenzeilen anders
  gewirkt als bei Sprachens kurzen freistehenden Zeilen.
- **Alternation:** Über uns hatte drei `section-alt` (beige) Sektionen in Folge nach einem
  bereits beigen Hero (Bio-Text, Qualifikationsbänder, Angebotskacheln) — nie einmal die
  helle `--color-bg`, anders als jede andere Seite. Bio-Sektion und Angebotskacheln-Sektion
  von `section-alt` auf `section` (hell) umgestellt; die Bänder selbst waren mit ihrem
  eigenen fest codierten Beige bereits korrekt und blieben unverändert.

Bitte alle vier im echten Browser gegenprüfen, besonders den jetzt noch niedrigeren Kontrast
aus dem ersten Punkt.

## 45. Disclaimer, Impressum, Datenschutz: Titel jetzt einheitlich als kleines Eyebrow-Label

Auf direkten Wunsch tragen alle drei Seiten jetzt dieselbe Titel-Behandlung wie Datenschutz
(#42): kein `PageHero`-Banner mehr, sondern ein `<h1 class="eyebrow">` direkt im Textblock —
klein, großgeschrieben, türkis, linksbündig. Zusätzlich, nur auf Datenschutz: die zwölf
nummerierten Zwischenüberschriften ("1. Verschlüsselte Übertragung" usw.) tragen jetzt
denselben Stil, nicht mehr die größere, dunkle Standard-H2-Optik — auf Wunsch, damit die
ganze Seite optisch durchgängig wirkt. Rechtstext an keiner der drei Stellen verändert.
`PageHero` selbst bleibt unangetastet und wird weiterhin von den Seiten mit echtem
Splitt-Hero verwendet (Startseite, Über uns, Angebote, Beratung, Workshops, Kennenlernen,
Selbsthilfegruppe, Blog, FAQs) — nur diese drei reinen Rechts-/Utility-Seiten sind
umgestellt. Bitte im echten Browser gegenprüfen, ob das auf allen drei Seiten so gewollt
ist, insbesondere die zwölf umgestylten Datenschutz-Überschriften.
