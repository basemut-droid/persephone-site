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

## 1. Ten pages ship no meta description — needs the owner's copy

No `<meta name="description">` exists on the live site for most of these, and a bug
that made them silently inherit the *homepage's* description instead (worse for
search engines than having none) is now fixed — `BaseLayout.astro` no longer falls
back to a site-wide default; a page either passes its own real description or ships
none.

**Currently shipping no description at all — needs real copy from the owner, one
sentence each, whenever there's time (not blocking launch):**
Über uns, Angebote, Beratung, Workshops, Selbsthilfegruppe, Kontakt, Termine, Disclaimer,
Datenschutz, Blog index. (FAQs and Impressum already have their own; every blog post has
its own via frontmatter.)

**Recommendation:** ship empty until the owner writes these — inventing SEO copy isn't
this run's call to make. Not urgent (search engines synthesize a snippet from page text
in the meantime); worth doing before launch, not overnight.

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

**Also still open:** the wording for a fifth Anliegen dropdown option (currently
Beratung, Workshops & Trainings, Selbsthilfegruppe, Sonstiges) so
collaboration/interview/press enquiries have a home — the owner suggested "Kooperation
& Presse", "Zusammenarbeit", or "Anfrage als Medium/Organisation" but hasn't picked
one. Do not add an option or guess wording.

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

## 7. EN/IT homepage's own nav links to subpages that don't exist — RESOLVED 2026-09-07, corrected 2026-09-07 (run B1)

`site/en.json` and `site/it.json` used to define a full header-nav config as if
translated subpages existed (About/Services/Blog/Contact plus a CTA and footer
links) when only the homepage itself was ever built. First fix (earlier same-day
run) trimmed `nav.items` to one honest line per language and pointed the header
CTA at `/termine/` — but left the homepage's own body content untouched, so both
locale homepages still shipped nine dead internal links each (services cards,
the founder "Learn more" link, both e-letter buttons, and four blog-teaser
image/title/read-more links). The closing report of that run called this an
"honest reduced nav" and `docs/build-check-report.md` from the same run listed
the 42 remaining dead links as non-blocking — true, but the nav itself was never
the whole story, and this item was marked RESOLVED before the body content was
actually fixed. See `docs/RUN-2026-09-07-B1.md` Phase 0.1 for how this was found.

**What run B1 actually did:**
- The three service cards and the founder card's "Learn more" link now point at
  the locale homepage itself (`/en/`, `/it/`) — the only page that exists in
  that language, same principle as the nav trim.
- Both e-letter buttons (hero + newsletter band) now link to `/newsletter/`
  (no locale prefix) — the real redirect stub to the external Mailerlite
  subscribe form (see `astro.config.mjs`'s `redirects`), which works from any
  locale and is exactly what the button promises, rather than a self-link.
- The four blog-teaser cards use the German fallback posts' *real* URLs
  (`/blog/<slug>/`, no locale prefix) instead of a fabricated `/en/blog/<slug>/`
  path — consistent with the fallback notice already telling the visitor these
  articles are only available in German.
- `internal-links-resolve` in `scripts/build-check.mjs` is now **blocking** —
  it was the non-blocking report that caught this in the first place and then
  got read past; see Phase 0.1's own note on why.

Zero dead internal links remain on either locale homepage as of this run.

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

## 8. Termine's page title — needs the owner's wording

"Termine" doesn't say what happens on this page (a 20-minute, free, no-obligation
"Kennenlernen" call). **Suggestion:** "Kennenlernen vereinbaren" — the exact phrase
already used site-wide for this same call (the header CTA, and Kontakt's cross-link
to this page), so adopting it as the title keeps the whole site's language for this
one thing consistent rather than introducing a second name for it. Not implemented —
the page's `<title>`/`<h1>` (from `src/content/pages/de/termine.md`'s `title` field)
still say "Termine"; changing it is the owner's call, one line in that file once
decided.

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

## 13. Über uns, Qualifikationsblock — ENTSCHIEDEN 7.9.2026: Teal-Band wiederherstellen

Live ist das ein **volles Band in Teal (#309898)** mit weißer Schrift, zentrierten
Überschriften und den Sprachen in 34 px — ein deutlicher Farbakzent mitten auf der Seite.
Der Rebuild macht daraus einen cremefarbenen Abschnitt mit kleinen tealen Überschriften.

Das ist der auffälligste Einzelunterschied der Seite und keine Kleinigkeit: er verändert
den Rhythmus der ganzen Seite.

**Entscheidung (Claudio): wiederherstellen** — volles Band in #309898, weiße Schrift,
zentrierte Überschriften, Sprachen in 34 px, wie live. Der Block trägt die Qualifikationen;
genau das soll bei einer Beraterin in Ausbildung sichtbar sein.

## 14. FAQs: die drei Kategorien fehlen

Live sind die dreizehn Fragen in drei Reitern gruppiert: „Zu Persephone", „Zu Coaching und
Beratung", „Zur Selbsthilfe". Der Rebuild zeigt eine flache Liste. Die Zuordnung Frage →
Kategorie ist im Repo nicht vorhanden und muss von der Live-Seite geholt werden.

**Keine Frage an Marina, sondern eine Aufgabe** — hier steht nur, dass es kein
Darstellungsproblem ist, sondern fehlende Daten.

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
