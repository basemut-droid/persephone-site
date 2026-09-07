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

## 0b. The ochre/amber curved shape on subpage heroes — could not confirm from markup

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

## 7. EN/IT homepage's own nav links to subpages that don't exist — NOT YET FIXED

Discovered while fixing the language switcher's own dead-link bug (now resolved —
see `docs/decisions.md`): `site/en.json` and `site/it.json` each define a full
header-nav config as if translated subpages exist — `{"label": "About", "href":
"/en/about/"}`, a "Services" dropdown with three children, "Blog", "Contact", plus a
CTA to `/en/appointments/` and a footer newsletter link to `/en/newsletter/` (same
shape in Italian). None of these routes are built — only `/en/` and `/it/` themselves
exist. Visiting the EN or IT homepage and clicking almost anything in its own header
or footer leads to a 404.

A new build-check (`internal-links-resolve`, non-blocking, in `scripts/build-check.mjs`)
now catches this going forward — confirms **66 dead links, all confined to `/en/` and
`/it/`, zero on any German page**.

**Why not fixed already:** this is a bigger call than hiding switcher entries — it
means deciding what the EN/IT homepage's *own navigation* should look like when
almost nothing behind it is translated (hide the untranslated items? point them at
the German version with a language notice? something else?). `external-review.md`'s
own recommendation ("Ship German-only; add locales when there is content to add")
would solve this by removing EN/IT nav depth entirely, but the multilingual homepage
itself should stay — it still works as a landing page; the nav *inside* it is the
part that's broken.

**Recommendation:** trim `nav.items`/`footer.columns` in `site/en.json`/`site/it.json`
down to only what's real (the homepage link and, once true, anything else translated)
until more pages are actually translated.

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
