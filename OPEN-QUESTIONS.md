# Open questions — waiting on you

Created during the Phase 2 content re-parse session. Each item is something the code
can't decide and nothing should be guessed at. Current implemented state is noted for
each so nothing blocks on you overnight.

## 1. H1 masthead weight: 900 vs 400 — RESOLVED 2026-09-06

Decided in `fuer-marina.md` Q2: **400**, matching the live site, over the August-2026
brand book's 900/Black spec. Implemented in `src/styles/global.css`'s `--weight-heading`
token, which every masthead `<h1>` site-wide reads from (homepage hero + every subpage's
`PageHero` title) — still a one-value edit back to 900 if this is ever revisited.

## 2. The "Newsletter" page has no real source content

`https://www.persephone.at/newsletter/` (and the nav's "e-Brief abonnieren" link,
`https://persephone.at/newsletter`) both 301-redirect straight to an external hosted
form: `https://preview.mailerlite.io/forms/1771229/164345144764532398/share`. There is
no WordPress page behind it — nothing to extract verbatim.

The repo's existing `src/pages/newsletter.astro` (full page, `NewsletterForm` component,
German copy) therefore was **not** sourced from the live site — it looks like it was
invented during the earlier "poor" parse.

**Options:**
- **(a)** Redirect `/newsletter/` straight to the MailerLite form, matching live-site
  behavior exactly (nothing to invent — recommended for now).
- **(b)** Keep the existing local page as an interim placeholder until you decide on a
  newsletter provider/flow for the rebuild.
- **(c)** Something else — e.g. you want a real on-site opt-in this time instead of an
  external redirect.

**Recommendation:** (a), until you say otherwise — it's the only option that doesn't
invent copy.

## 3. Several live pages ship no meta description at all

No `<meta name="description">` or `og:description` exists on the live site for:
**ueber-uns, angebote-2, beratung, workshops, selbsthilfegruppe, kontakt, termine,
disclaimer**. (`faqs` has one: "Häufig gestellte Fragen". Blog posts each have their own
via `og:description`.)

**Question:** should the rebuild ship these pages with an empty/omitted description
(matches the source exactly, but is a real SEO gap), or should new descriptions be
written for them? Writing new ones is new copy, not extracted content — needs your
voice/approval, not something to freehand.

**Recommendation:** ship empty for now (matches source, invents nothing); flag as a
backlog item for you to write real ones later.

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

## 5. Impressum's meta description is a mangled auto-excerpt

The live Impressum page's meta description is plugin-auto-generated from the page's
visible text with no spacing between merged sentences ("Impressum Marina
BletsasLandstraßer Hauptstraße 86, 2/81030 Wien, Österreich…" — no space between
concatenated fragments). Real content, badly formatted, not deliberate copy.

**Question:** carry it verbatim (accurate to source, but visibly broken) or write a
clean one-sentence description instead (a content change, however small, needs your
sign-off)?

**Recommendation:** write a plain, minimal description once you've reviewed it — flagging
here rather than guessing at the wording myself.

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

**Current state — all four now fixed in the built site** (Task 3): Über-uns's two
teaser cards link to `/beratung/`/`/workshops/`; the two blog posts link to
`/termine/` and `/blog/ist-unfruchtbarkeit-immer-noch-frauensache/` respectively.
Über-uns's fix is render-time (a lookup map in `ueber-uns.astro`); the two blog
posts' fix is a direct edit to their content-collection `.md` files (only the URL,
zero prose changed) — Astro's `render()` reads a pre-rendered HTML cache for content
collections, so a render-time patch (what every other page uses) silently has no
effect for content rendered via `<Content />`, and the alternative
(`remarkPlugins` in `astro.config.mjs`) requires a new dependency in this Astro
version. `ueber-uns.md` itself still records its two dead hrefs verbatim (Task 2's
job); the two blog posts' source files no longer do, by necessity.

**Still worth doing independent of this rebuild:** tell whoever manages the live
WordPress site about all four dead links, since the "likely intended target" guesses
above (especially the two blog-post ones) were judgment calls made without visibility
into what was actually meant.

## 7. Selbsthilfegruppe has an unremoved English theme-demo heading and a doubled intro

The live Selbsthilfegruppe page renders **two** h1s back to back: "Selbsthilfegruppe" and,
immediately after it, "Your Journey to a Fulfilling Life" — English, and reading exactly
like an Avada theme demo-content default that was never replaced (the same pattern as
Open Question #4's leftover homepage meta description). It's followed by **two** near-
identical German intro paragraphs with slightly different wording ("...die die Erfahrung
der Kinderwunschkrise teilen" vs "...die ähnliche Erfahrungen haben") — not an extraction
artifact; both are genuinely present in the source, worded differently enough that they
aren't a simple duplicate.

**Current state:** `src/content/pages/de/selbsthilfegruppe.md` preserves all of it
verbatim (both headings, both paragraphs) per Task 2's "faithful record" rule. The page
is now built (`selbsthilfegruppe.astro`): the English demo heading is dropped (that part
wasn't ambiguous), but the choice between the two intro paragraphs is **still open** —
the page currently renders "...die ähnliche Erfahrungen haben" as a placeholder, not a
decision. Swap to `src/lib/parseMarkdownBlocks.ts`'s block index for the other paragraph
(or new copy) once you've picked.

**Recommendation:** pick whichever reads better — your call, not a coin flip I should
make.

## 8. Two verbatim typos worth knowing about before Task 3

Preserved exactly, not fixed, per the "German copy stays verbatim" rule — but flagging
so they aren't mistaken for new transcription errors when the pages get built:

- The live Workshops page's own on-page `<h1>` reads **"Workhops & Einzeltrainings"**
  (missing the first "s") — even though its `<title>` tag correctly says "Workshops &
  Einzeltrainings". Same typo also showed up in Open Question #6's dead link
  (`/workhops-einzeltrainings/`), so it's a consistent, real slip on the live site, not
  a one-off.
- The live Selbsthilfegruppe page has one heading spelled "Nächstes SHG-Treffen" (h1) and
  a second, lower one spelled **"Nächtes SHG-Treffen"** (h3, missing the "s") for what
  reads like the same label used twice.

**Recommendation:** correct both when actually building these pages' on-page copy (typos,
not a style choice) — flagging here rather than silently "fixing" them inside the Phase 2
extraction, which is supposed to mirror the source exactly, bugs included.

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

## 10. Über-uns's two closing teaser cards use a plain style, not ServiceCard

The live page's "Beratung & Coaching (i.A.u.S.)" / "Workshops & trainings" closing
teasers are each just a linked heading + one paragraph — no separate button/CTA
label exists in the source, unlike the homepage's `ServiceCard` pattern, which
requires one (`cta` prop, e.g. "Jetzt entdecken"). Writing an invented label just to
reuse `ServiceCard` would be new copy with no source, so this page renders them as
plain bordered cards instead (tokens-only: `--color-bg-alt`, `--radius`, no one-off
values) rather than matching `ServiceCard`'s vibrant gradient treatment.

**Recommendation:** once you're happy with real button copy for these two
(something like "Mehr erfahren" / "Jetzt entdecken"), switching them to
`ServiceCard` is a small, contained change — flagging now so the quieter current
look isn't mistaken for an oversight.

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
