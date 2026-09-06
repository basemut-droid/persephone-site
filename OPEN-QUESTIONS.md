# Open questions — waiting on you

Created during the Phase 2 content re-parse session. Each item is something the code
can't decide and nothing should be guessed at. Current implemented state is noted for
each so nothing blocks on you overnight.

## 1. H1 masthead weight: 900 vs 400

Carried over from the previous session's `HANDOFF.md`. `docs/brand/Brandbook.pdf`
(dated August 2026) specifies H1 *and* H2 at weight 900/Black. The live persephone.at
actually renders its h1 at weight 400. You previously chose "900 for the masthead h1
only, H2 stays 400" and asked to see it against the live site before finalizing — that
comparison is what surfaced the 400-vs-900 conflict.

**Current state:** 900, via the `--weight-heading` token → `.heading-black` utility
class, applied to the one masthead `<h1>` per page (homepage hero + every subpage's
`PageHero` title). Verified this session (see Task 1 below): every masthead h1 in the
codebase goes through this single token — switching 900 → 400 is a one-value edit in
`src/styles/global.css`, nothing else to touch.

**Recommendation:** keep 900 until you've compared it against the brand book in person;
it's already a one-line revert if you decide otherwise.

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

**Current state:** every content-collection file (`ueber-uns.md`, the two blog posts)
records these hrefs exactly as found on the live pages — Task 2 is a faithful record
of the source, bugs included.

**Recommendation:** when each of these pages actually gets built/republished, point
the links at their likely real targets from the table above instead of reproducing a
live 404 — flagging here since three of the four involve a judgment call about which
page was actually intended, not just a typo fix. Also worth telling whoever manages
the live WordPress site about all four, independent of this rebuild.

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

## 9. Important: the live Datenschutzerklärung describes fonts the new site doesn't use

This one carries real legal weight, not just a copy-fidelity note. The live
Datenschutzerklärung has two sections — **"6. Google Fonts"** and **"7. Typekit
Fonts"** — describing font files loaded from Google and Adobe. The **new Astro site
does not do this**: `CLAUDE.md` and `DESIGN-SYSTEM.md` both confirm DM Sans is
self-hosted via `@fontsource`, with no external font requests at all. A privacy policy
has to describe what the site *actually* does, not what the old WordPress site did — so
these two sections would be **factually false** if carried over unchanged.

**Good news:** this was already caught and fixed once. The current
`src/pages/datenschutz.astro` (Section 6, "Schriftarten (Fonts)") already replaces both
live sections with a single accurate one: *"Diese neue Version der Website lädt keine
Schriftarten von Google Fonts oder Adobe Typekit mehr... direkt auf unserem eigenen
Server hinterlegt."* That fix should be **kept**, not reverted, whenever this page's
content gets consolidated into the collection version.

**Current state:** `src/content/pages/de/datenschutzerklaerung.md` (this session,
Phase 2) stores the live site's text verbatim, Google Fonts/Typekit sections included —
correct for Task 2's "faithful record of the source" job, but **not what should ship**.
The numbered section labels ("1. Verschlüsselte Übertragung", etc.) are also plain
paragraphs in the live source, not real headings — `src/pages/datenschutz.astro`
already promotes them to `<h2>`, which is a reasonable accessibility improvement to
keep, not something to revert to match the source.

**Recommendation:** when this page is next touched, use the existing
`datenschutz.astro` wording for the fonts section (already correct) rather than the
freshly re-parsed live text — flagging this prominently since it's the one item in this
whole list where shipping the "verbatim" source text would actually be wrong, not just
undecided.

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

## 11. Not a decision — just worth knowing

Several `<li>` elements in the live Über-uns page's "Ausbildung"/"Felderfahrung" lists
carry a leftover CSS class, `font-claude-response-body`, in their raw HTML — a tell that
this text was pasted into the WordPress editor directly from a Claude.ai chat response
at some point (that class is claude.ai's own chat-UI styling hook, not anything
WordPress/Avada would generate). It has zero visible effect on the live page, and the
actual visible text matches genuine content documented elsewhere (`DESIGN-SYSTEM.md`'s
own credentials-grid list), so this isn't flagged as a content problem — just an
FYI in case you want to clean up the live WordPress page's HTML source at some point.
