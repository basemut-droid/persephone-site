# Open questions — waiting on you

Created during the Phase 2 content re-parse session. Each item is something the code
can't decide and nothing should be guessed at. Current implemented state is noted for
each so nothing blocks on you overnight.

## 1. H1 masthead weight: 900 vs 400 — RESOLVED 2026-09-06

Decided in `fuer-marina.md` Q2: **400**, matching the live site, over the August-2026
brand book's 900/Black spec. Implemented in `src/styles/global.css`'s `--weight-heading`
token, which every masthead `<h1>` site-wide reads from (homepage hero + every subpage's
`PageHero` title) — still a one-value edit back to 900 if this is ever revisited.

## 2. The "Newsletter" page — RESOLVED 2026-09-06

Decided in `fuer-marina.md` Q8 (option (a)): `/newsletter/` now redirects straight to
the MailerLite form via Astro's `redirects` config in `astro.config.mjs`, matching the
live site's own 301 exactly. `src/pages/newsletter.astro` (the invented full page) and
the now-unused `src/components/NewsletterForm.astro` are both deleted. Nothing was
invented; a real on-site opt-in page remains a small, well-scoped future addition
whenever the owner writes real copy for it (per `fuer-marina.md`'s own note: the only
new thing that would need building then is the sign-up field itself).

## 3. Ten pages ship no meta description — needs the owner's copy

No `<meta name="description">` exists on the live site for most of these, and Phase 3.8
(external-review.md finding #5) also stopped a bug where they all silently inherited the
*homepage's* description instead of shipping their own — worse for search engines than
having none. `BaseLayout.astro` no longer falls back to a site-wide default; a page
either passes its own real description or ships none.

**Currently shipping no description at all — needs real copy from the owner, one
sentence each, whenever there's time (not blocking launch):**
Über uns, Angebote, Beratung, Workshops, Selbsthilfegruppe, Kontakt, Termine, Disclaimer,
Datenschutz, Blog index. (FAQs and Impressum already have their own; every blog post has
its own via frontmatter.)

**Recommendation:** ship empty until the owner writes these — inventing SEO copy isn't
this run's call to make. Not urgent (search engines synthesize a snippet from page text
in the meantime); worth doing before launch, not overnight.

## 4. The live site ships duplicate/conflicting meta description tags — homepage and every blog post

The live homepage's `<head>` has **two** `<meta name="description">` tags: the real one
("Persephone begleitet Dich und Deine:n Partner:in…") and an unremoved Avada theme demo
default ("Discover the ultimate Life Coach website built using Avada…").

The same underlying pattern shows up on **all 6 blog posts**, via `og:description`
instead: a short, clearly hand-written one-sentence hook comes first (e.g. "Wie das
Teilen von Erfahrungen im unerfüllten Kinderwunsch ein Wendepunkt für psychische
Gesundheit sein kann."), immediately followed by a second `og:description` tag that's
just the post's opening ~300 characters auto-generated and cut off mid-clause. Same
SEO-plugin-vs-theme conflict, most likely, as the homepage's — just via a different
meta tag. This is a bug on the *live* site itself, not something the rebuild should
replicate.

**Recommendation:** the rebuild uses only the real one in each case — already what
`site/de.json` does for the homepage, and what every blog post's re-parsed frontmatter
in `src/content/blog/de/*.md` now does (the first, hand-written `og:description`).
Worth telling whoever manages the live WordPress site to find and remove whatever's
producing the duplicate tags, independent of this rebuild.

## 5. Impressum's meta description — RESOLVED 2026-09-06

Decided in `fuer-marina.md` Q6: "Impressum und Offenlegung von Persephone – Marina
Bletsas, Wien." replaces the live site's mangled, space-less auto-excerpt ("Impressum
Marina BletsasLandstraßer Hauptstraße 86, 2/81030 Wien, Österreich…"). Implemented in
`src/pages/impressum.astro`.

## 6. Four dead internal links found across the live site (Über-uns + 2 blog posts)

The live site has more broken internal links than just one page — found while
re-parsing Über-uns and the blog posts:

| Found on | Live href | HTTP status | Likely intended target |
|---|---|---|---|
| Über-uns (2 CTAs) | `/beratung-coaching/` | 404 | `/beratung/` (`<title>Beratung & Coaching - Persephone</title>` matches almost word-for-word) |
| Über-uns (2 CTAs) | `/workhops-einzeltrainings/` (source's own typo, "workhops") | 404 | `/workshops/` (`<title>Workshops & Einzeltrainings - Persephone</title>`) |
| Blog: "Mythos Männerohnmacht" | `/featured/unfruchtbarkeit-ist-paarsache/` | 404 | Probably the sibling post `/ist-unfruchtbarkeit-immer-noch-frauensache-2/` (near-identical topic, reversed phrasing) — but could also be a since-deleted third post; not certain enough to just swap in |
| Blog: "Ist Unfruchtbarkeit...Frauensache" | `/aktuelles/` ("come to our next meeting, find date + signup link here") | 404 | `/termine/` (the real booking/events page) reads like the obvious match given the surrounding sentence |

All four read as stale slugs left over from page renames, not deliberate removals —
but stale-slug guessing is exactly the kind of thing that shouldn't be silently
resolved.

**Current state — all four now fixed in the built site**, and confirmed 2026-09-06
(`fuer-marina.md` Q7): Über-uns's two teaser cards link to `/beratung/`/`/workshops/`;
the two blog posts link to `/blog/ist-unfruchtbarkeit-immer-noch-frauensache/` (the
"Mythos Männerohnmacht" link — confirmed correct by its own link text) and, as of
Phase 3, `/selbsthilfegruppe/` rather than `/termine/` for the second (the sentence
refers to the next self-help group meeting and its registration link, which lives on
the Selbsthilfegruppe page). Über-uns's fix is render-time (a lookup map in
`ueber-uns.astro`); the two blog posts' fix is a direct edit to their
content-collection `.md` files (only the URL, zero prose changed) — Astro's
`render()` reads a pre-rendered HTML cache for content collections, so a render-time
patch (what every other page uses) silently has no effect for content rendered via
`<Content />`, and the alternative (`remarkPlugins` in `astro.config.mjs`) requires a
new dependency in this Astro version. `ueber-uns.md` itself still records its two
dead hrefs verbatim in `docs/source-archive/`, per that archive's own purpose; the
two blog posts' live source files no longer do, by necessity.

**Still worth doing independent of this rebuild:** tell whoever manages the live
WordPress site about all four dead links, since the "likely intended target" guesses
above (especially the two blog-post ones) were judgment calls made without visibility
into what was actually meant.

## 7. Selbsthilfegruppe's English demo heading and doubled intro — RESOLVED 2026-09-06

Decided in `fuer-marina.md` Q3/Q4: the English Avada demo heading ("Your Journey to a
Fulfilling Life") stays dropped, and the intro keeps **variant A** ("...die die Erfahrung
der Kinderwunschkrise teilen") — chosen because it comes first on the live page and names
the topic concretely. Variant B ("...die ähnliche Erfahrungen haben") is removed from
`src/content/pages/de/selbsthilfegruppe.md` itself (the frozen verbatim record in
`docs/source-archive/` still has both, per its own purpose).

## 8. Six verbatim typos — RESOLVED 2026-09-06

All six corrected per `fuer-marina.md` Q1 (Phase 3.1): Workshops' "Workhops" h1, Über
uns's "linguistiche", Selbsthilfegruppe's "Einbzeltermine" and its "Nächtes SHG-Treffen"
heading, and FAQs' "Geleggenheit" and "(ehmals)". The frozen verbatim record in
`docs/source-archive/` still has the originals, per that archive's own purpose. Note the
two dead-link slugs in Open Question #6 above (`/workhops-einzeltrainings/`) still carry
the old typo — that's the *live site's own URL*, not something this rebuild controls.

## 9. Datenschutzerklärung — NEEDS HUMAN SIGN-OFF (not resolved by code)

This is a legal document for a real business. Your wife approves the wording, not
this rebuild — nothing below should be read as "settled," including the parts marked
"fixed." It also needs a fresh re-check at launch against whatever the live site
actually loads by then (its fonts/analytics/embeds could easily have changed again
between now and launch).

**What's different from the live source, and why:** the live Datenschutzerklärung has
two sections — "6. Google Fonts" and "7. Typekit Fonts" — describing font files loaded
from Google and Adobe. The new Astro site doesn't do this (`CLAUDE.md`/
`DESIGN-SYSTEM.md` confirm DM Sans is self-hosted via `@fontsource`, no external font
requests at all), so carrying those two sections over unchanged would describe
something the new site doesn't actually do. `src/pages/datenschutz.astro`'s own
Section 6 ("Schriftarten (Fonts)") replaces both with one sentence stating the new
site self-hosts its font and contacts neither Google nor Adobe. This is the only
wording change from the live source anywhere in this document; every other sentence
is the live site's own text, carried over verbatim (via `src/pages/impressum.astro`'s
sibling page's original session, predating this one).

**What this session did to this page (Task 3):** rewrote the page's wrapper markup
only — swapped a bare `<h1>` + one-off `.legal-page` class for `PageHero` +
`.section`/`.section-narrow`, matching the rest of the rebuilt site. Verified via
`git diff` that this changed only tags/classes, zero words — every sentence, including
the fonts-section rewrite above, is untouched by this session.

**Current state:** `src/content/pages/de/datenschutzerklaerung.md` (content
collection, Task 2) stores the live site's text fully verbatim, Google Fonts/Typekit
sections included — a faithful record of the source, correct for Task 2's job, but
**not what's actually shipped**. `src/pages/datenschutz.astro` (the real, live page)
has the fonts-section rewrite described above and is what visitors see. The two files
intentionally disagree on this one point; that's not a bug to reconcile away without
your wife's say.

**Needs from you before launch:**
- Your wife's sign-off on the fonts-section wording (and everything else on the page,
  even the parts that are the live site's own existing words — "already live
  elsewhere" isn't the same as "she's approved it for this rebuild").
- A re-check of this whole page against whatever the live site (or your actual
  deployment) loads at launch time — cookies, analytics, embedded forms (Microsoft
  Bookings/Forms are both referenced in the body text), fonts — since any of that
  could have changed since this extraction.

## 10. Über-uns's two closing teasers — SUPERSEDED 2026-09-06

This question proposed adding button copy so the two teasers could reuse
`ServiceCard`. `external-review.md` finding #4b confirms the opposite is correct: the
live design has **no button** — the heading itself is the link — and the owner
confirmed that's intentional (`fuer-marina.md` Q5). Withdrawn; see NIGHT-RUN.md Phase
4.2 for the actual open work here (the black-and-white photo + offset cream text-card
layout, still missing — needs placeholder images, not button copy).

## 11. Kontakt's form has nowhere to submit yet

`ContactForm.astro` (name/phone/email/topic/message/consent + honeypot) is built and
styled and now live on the rebuilt Kontakt page, but it's deliberately inert —
`action="#"`, with a `TODO` comment in the file itself. No backend, endpoint, or
third-party form service has been decided, so nothing was invented here.

**Options:**
- **(a)** A serverless function on whatever this site ends up hosted on, emailing
  the submission or writing it somewhere you check. Depends on the hosting
  decision, which isn't visible in this repo (no deploy config committed yet).
- **(b)** A hosted form service (Formspree-style) — fastest to wire up regardless of
  host, but sends submissions through a third party.
- **(c)** A plain `mailto:` fallback — no backend at all, but a worse UX (opens the
  visitor's own email client) and no honeypot/spam protection actually functions
  without a real submit handler.

**Recommendation:** (b) if you want this working before a hosting decision is made,
(a) once you know where the site will actually run — either way, an
infrastructure decision, not something to pick for you.

## 12. Language switcher offers /en/ and /it/ links that 404 (pre-existing bug, not introduced this session)

Task 4's whole-site link check crawled all 23 built pages and found 0 broken
internal links/images among the site's own content — but it also flags 105
occurrences of `<a href>` pointing at `/en/...` or `/it/...` paths that don't
resolve to any built page. All of these come from one place:
`LanguageSwitcher.astro`, which unconditionally renders a link for every
locale in `i18n.locales` (`de`, `en`, `it`) via `getRelativeLocaleUrl`,
regardless of whether a translated version of the current page actually
exists. Since only the homepage has real English/Italian content right now,
every other page's switcher offers two links that 404.

This is a real, pre-existing bug (not something this session's page-building
introduced), but fixing it is a design decision, not a code fix, so it's
logged here rather than silently patched:

**Options:**
- **(a)** Hide the switcher entries for locales that have no translation of
  the current page (check the relevant content-collection entry exists
  before rendering the link). Cleanest UX, matches what
  `astro.config.mjs`'s own comment says was intended ("a visible 'not
  translated yet' notice, not a silent redirect" — implying the switcher
  itself should already know which locales are real).
- **(b)** Keep all three links always visible, but point untranslated
  locales at that locale's homepage instead of a 404 (e.g. `/en/` instead of
  `/en/ueber-uns/`). Simpler code change, but hides the fact that the page
  itself isn't translated.
- **(c)** Leave all pages unprefixed/German-only for now and remove the
  `en`/`it` entries from the switcher entirely until real translations for
  more than the homepage exist, re-adding them page-by-page as translations
  land.

**Recommendation:** (a) — it directly fixes the 404s and matches the
existing code comment's stated intent, without waiting on new translated
content or removing the multilingual homepage that already works.

## 13. Not a decision — just worth knowing

Several `<li>` elements in the live Über-uns page's "Ausbildung"/"Felderfahrung" lists
carry a leftover CSS class, `font-claude-response-body`, in their raw HTML — a tell that
this text was pasted into the WordPress editor directly from a Claude.ai chat response
at some point (that class is claude.ai's own chat-UI styling hook, not anything
WordPress/Avada would generate). It has zero visible effect on the live page, and the
actual visible text matches genuine content documented elsewhere (`DESIGN-SYSTEM.md`'s
own credentials-grid list), so this isn't flagged as a content problem — just an
FYI in case you want to clean up the live WordPress page's HTML source at some point.

## 14. `astro.config.mjs`'s `site` is still a placeholder — BLOCKED ON HOSTING

`site: 'https://persephone.example'` — every built page's canonical URL, `og:url`, and
the sitemap all derive from this, and all of them are currently wrong. Left as a
placeholder deliberately (NIGHT-RUN.md Phase 3.10): guessing a production domain isn't
this run's call, and the real value depends on the hosting decision, not just the domain
— see `docs/external-review.md`'s "DECISIONS PENDING" section (item 1: domain, hosting,
and where the owner writes are three independent choices, and hosting is the one that
gates everything else — the contact form endpoint, deploy config, the Datenschutz
re-check, and the DNS cutover).

**Recommendation:** decide hosting first (a European static host simplifies the
Datenschutzerklärung's processor disclosure — see the review's item 3c), then set `site`
to the real domain in one line. `astro.config.mjs` carries a `// TODO` comment marking
exactly where.
