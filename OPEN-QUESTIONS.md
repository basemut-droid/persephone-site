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

## 4. Homepage ships two conflicting meta descriptions

The live homepage's `<head>` has **two** `<meta name="description">` tags: the real one
("Persephone begleitet Dich und Deine:n Partner:in…") and an unremoved Avada theme demo
default ("Discover the ultimate Life Coach website built using Avada…"). This is a bug
on the *live* site itself, not something the rebuild should replicate.

**Recommendation:** the rebuild will use only the real one (already what `site/de.json`
does). Worth telling whoever manages the live WordPress site to remove the leftover
theme-default tag, independent of this rebuild.

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

## 7. Über-uns has two dead-end CTA links on the live site

The live Über-uns page's two closing teaser cards link to `/beratung-coaching/` and
`/workhops-einzeltrainings/` (note the source's own typo, "workhops") — both return a
live **404** on persephone.at right now. The obvious matching real pages are
`/beratung/` (`<title>Beratung & Coaching - Persephone</title>`) and `/workshops/`
(`<title>Workshops & Einzeltrainings - Persephone</title>`) — titles match almost
word-for-word, so this reads as stale slugs left over from a page rename rather than a
deliberate removal.

**Current state:** `src/content/pages/de/ueber-uns.md` records the CTA hrefs exactly as
found on the live page (Task 2 is a faithful record of the source, bugs included).

**Recommendation:** when the actual Über-uns page gets built (Task 3), point these two
links at the working `/beratung/` and `/workshops/` pages instead of reproducing a
live 404 — flagging here since it's a content/URL decision, not obviously "just fix
it" if there's a reason those specific slugs existed. Also worth telling whoever
manages the live WordPress site, independent of this rebuild.

## 8. Not a decision — just worth knowing

Several `<li>` elements in the live Über-uns page's "Ausbildung"/"Felderfahrung" lists
carry a leftover CSS class, `font-claude-response-body`, in their raw HTML — a tell that
this text was pasted into the WordPress editor directly from a Claude.ai chat response
at some point (that class is claude.ai's own chat-UI styling hook, not anything
WordPress/Avada would generate). It has zero visible effect on the live page, and the
actual visible text matches genuine content documented elsewhere (`DESIGN-SYSTEM.md`'s
own credentials-grid list), so this isn't flagged as a content problem — just an
FYI in case you want to clean up the live WordPress page's HTML source at some point.
