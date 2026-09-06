# Content fidelity audit

Follow-up to `docs/content-inventory.md`, prompted by a disclosed mistake in that
session: a few paragraphs were hand-transcribed and paraphrased before the process
switched to generating text mechanically from the parser. This audit verifies nothing
of that survived, **character by character** (not by eye, not by word count — a
paraphrase passes a word count) — every page's body was re-rendered fresh from its
original `<slug>.json` extraction (html2md.mjs's direct output from the raw HTML,
never touched via an intermediate copy step) and byte-compared against the current
repo file. Method and script are described in full at the end of this document.

## Verbatim check — result: 2 real mismatches found and fixed, 0 remaining

| Page | Verbatim check |
|---|---|
| Über uns | **Fixed** — see below |
| Angebote | Pass |
| Beratung & Coaching | **Fixed** — see below |
| Workshops & Einzeltrainings | Pass |
| Selbsthilfegruppe | Pass |
| Kontakt | Pass |
| Termine | N/A — no extractable narrative content on the source at all (the live page is a single Microsoft Bookings iframe); its file is a hand-written note describing that, not extracted copy |
| FAQs | Pass |
| Disclaimer | Pass |
| Impressum | Pass |
| Datenschutzerklärung | Pass |
| Einsam im Kinderwunschprozess? | Pass |
| Ist Unfruchtbarkeit immer noch Frauensache? | Pass |
| Männer im Kinderwunsch: Mythos „Männerohnmacht“ | Pass |
| Männer im Kinderwunsch: Mythos „stille Stärke“ | Pass |
| Texte. Stimmen. Lieder. | Pass |
| Zwischen Lichterglanz und Leere | Pass |

**What was actually wrong, found and fixed:**

1. **Beratung & Coaching, one paragraph:** a non-breaking space (U+00A0) between
   "Sprachwissenschaftlerin" and "und" had been silently replaced by a regular space
   (U+0020) somewhere in an earlier session's regeneration pass — invisible in every
   terminal preview and even in a naive `diff` (both render identically), only caught
   by the character-exact comparison this audit ran. This is not the same class of
   error as the earlier disclosed paraphrasing — the *words* were always correct here;
   one whitespace character's exact identity was not. Restored to match source
   exactly. The root cause of exactly how that one character got swapped was not
   fully pinned down (a from-scratch reproduction of the same regeneration step did
   *not* reproduce it) — flagging that it happened at all as a reason this kind of
   audit is worth repeating after any future bulk content regeneration, not a
   one-time fix.
2. **Über uns, missing image + one Unicode-normalization mismatch:** while fixing
   Über uns's structure (this session's Task 0), it came out that the masthead's real
   image is a CSS background-image the original extractor couldn't see (no `<img>`
   tag), and that the image previously used as the hero
   (`marina-von-persephone.jpg`) actually belongs later in the body, next to the
   closing newsletter CTA. It had been dropped from the body entirely rather than
   relocated — added back in its correct document position. Separately, found the
   *other* image's alt text ("Logo Kongruenz und Authenzität_05") was stored using
   precomposed Unicode for "ä" (U+00E4) where the live source actually uses
   decomposed form (U+0061 + U+0308, "a" + combining diaeresis) — visually and
   semantically identical, renders the same everywhere, but not byte-identical to
   source. Fixed to match the source's exact byte sequence, since exact-match was the
   explicit bar for this audit — flagged as a much lower-severity finding than the
   NBSP case above, since nothing about the text itself was wrong.

## Heading count and hierarchy

Implied by the verbatim check above for every "Pass"/"Fixed" row — headings are part
of each page's body text, so a character-exact body match makes its heading text and
level exact too. Counts, for reference (level → count):

| Page | Headings by level |
|---|---|
| Über uns | h1×2, h2×8 |
| Angebote | h1×1, h2×1, h3×1 |
| Beratung & Coaching | h1×1, h2×5, h3×1, h4×4 |
| Workshops & Einzeltrainings | h1×2, h2×3, h3×1 |
| Selbsthilfegruppe | h1×3, h2×3, h3×1 |
| Kontakt | h1×2, h2×2 |
| Termine | (none — no body) |
| FAQs | h1×1, h3×13 |
| Disclaimer | h1×1 |
| Impressum | h2×1 |
| Datenschutzerklärung | h2×1 |
| Einsam im Kinderwunschprozess? | h2×5 |
| Ist Unfruchtbarkeit immer noch Frauensache? | h2×4 |
| Männer im Kinderwunsch: Mythos „Männerohnmacht“ | h2×4 |
| Männer im Kinderwunsch: Mythos „stille Stärke“ | h2×4 |
| Texte. Stimmen. Lieder. | h2×2, h3×4 |
| Zwischen Lichterglanz und Leere | h2×7, h3×3 |

Über uns's h1×2 (two masthead-level headings on one page — "Persephone ist die Frucht
der eigenen Krise" and "Dein nächster Schritt") and several pages' multiple h1s
generally are **verbatim to source**, not an extraction artifact — the live site
doesn't consistently use one h1 per page. Not a fidelity problem; a live-site
authoring quirk, already noted in `OPEN-QUESTIONS.md` where it's specific enough to
matter (e.g. #8's typo entries).

## Images: count, existence, alt text

Every image referenced by every content-collection file (frontmatter `heroImage` +
inline markdown images) was checked against the filesystem — **all exist**:

| Page | heroImage | Inline images | All files exist? |
|---|---|---|---|
| Über uns | `marina-portrait-hero.png` | `marina-von-persephone.jpg`, `logo-kongruenz-und-authentizitaet.png` | Yes |
| Angebote | `mg-7425.jpg` | `logo-geborgenheit.png` | Yes |
| Beratung & Coaching | `marina-von-persephone.jpg` | `marina-von-persephone.jpg`, `logo-empathie.png` | Yes |
| Workshops & Einzeltrainings | `marina-von-persephone.jpg` | `marina-von-persephone.jpg`, `logo-wissenschaft.png` | Yes |
| Kontakt | `mg-7811.png` | — | Yes |
| Selbsthilfegruppe, Termine, FAQs, Disclaimer, Impressum, Datenschutzerklärung | (none — matches source, these pages have no real content images) | — | N/A |
| All 6 blog posts | one hero each | — | Yes |

**Alt text: no image on any page has real alt text, on any page** — this matches the
live site exactly; persephone.at itself supplies no `alt` attribute anywhere in this
content. Per the methodology already documented in `content-inventory.md`: where the
source `<img>` had a non-empty `title` attribute (a different, WordPress-specific
field), that literal text was used as the markdown alt instead of leaving it blank;
where neither existed, alt falls back to a plain reading of the image's own
filename. Nothing here is descriptive prose written from scratch — flagging this as a
**systemic gap inherited from the source**, already covered by `OPEN-QUESTIONS.md`,
not a new per-page miss.

**Known, disclosed gap, not fixed here:** the `marina-von-persephone.jpg` reference
now correctly sitting in Über uns's body text (next to the closing CTA) is not
currently rendered on the page — `CtaBand`, the shared component that section uses,
has no image slot, and adding one would change every other page that already uses
`CtaBand` (homepage, and eventually Angebote/Workshops/Beratung). Out of scope for
this audit and for Task 0; noted here so it isn't mistaken for an oversight.

## Meta title and description

**Title: present on every page** (from the live `<title>` tag, site-suffix stripped
per the established convention).

**Description:** present only where the live source actually has one — this was a
deliberate decision (`OPEN-QUESTIONS.md` #3), not a miss:

| Has a description | Missing (matches source exactly) |
|---|---|
| FAQs, Impressum, Datenschutzerklärung*, all 6 blog posts | Über uns, Angebote, Beratung, Workshops, Selbsthilfegruppe, Kontakt, Termine, Disclaimer |

*Impressum's description is the live site's own mangled, space-less auto-excerpt
(`OPEN-QUESTIONS.md` #5) — present, but not clean; not re-litigated here.

## Internal links: new routes vs. old WordPress URLs

Every `persephone.at` URL still appearing in a content-collection file's body, found
by scanning all 17 files:

| Page | persephone.at link found | Status |
|---|---|---|
| Über uns | `/beratung-coaching/`, `/workhops-einzeltrainings/` | **Rewritten to `/beratung/` / `/workshops/` in the built page** (`ueber-uns.astro`) — the content-collection record correctly keeps the verbatim (broken) source URLs; only the rendered page needed fixing, and already was, in Task 0's predecessor session |
| Über uns | `https://persephone.at/newsletter` | Correctly left as an external URL — real MailerLite redirect, not a local route (`OPEN-QUESTIONS.md` #2) |
| Angebote | `/termine/` | Real, working page — no fix needed, but **still an absolute persephone.at URL, not a local `/termine/` route** — becomes Task 3's job when this page is built, same pattern as Über uns |
| Beratung & Coaching | `/termine/` | Same as above — real page, needs rewriting to a local route when built |
| Disclaimer | `/kontakt/`, `/ueber-uns/` | Both real, working pages — same "still absolute, needs local-route rewrite at build time" note |
| Ist Unfruchtbarkeit... | `/aktuelles/` | **Dead (404)** — already logged in `OPEN-QUESTIONS.md` #6, not re-decided here |
| Mythos „Männerohnmacht“ | `/featured/unfruchtbarkeit-ist-paarsache/` | **Dead (404)** — already logged in `OPEN-QUESTIONS.md` #6, not re-decided here |
| Everything else | (none) | — |

**Conclusion:** no content-collection file has an internal link that's wrong *for a
faithful record* — every one matches what's actually on the live page, dead links
included, which is Task 2's original job. What's still open is that **content
collections deliberately keep absolute persephone.at URLs**, and rewriting them to
this site's own local routes happens at build time, per the pattern Task 0
established for Über uns (a `deadLinkFixes`-style map, or a straightforward
`https://www.persephone.at/x/` → `/x/` rewrite for links that aren't dead). Every
still-unbuilt page in Task 3 needs the same treatment — flagging this explicitly so
it isn't missed page-by-page: **when building each remaining page, rewrite every
internal persephone.at link to its local route, and to the corrected route from
`OPEN-QUESTIONS.md` #6 wherever the live link is dead.**

## Method

For each page: read its original `<slug>.json` (html2md.mjs's structured-block
output from the raw HTML, produced once per page during the original extraction),
apply the same per-page image-exclusion/trailing-boilerplate-trim rules used when the
file was first written, render straight to markdown with no manual step in between,
and compare the result byte-for-byte against the current repo file's body (frontmatter
stripped, line endings normalized, exactly one trailing newline enforced on both
sides so a cosmetic difference can't masquerade as a real one — and, just as
importantly, can't hide one either). Any remaining difference after that
normalization is real. The comparison script lives in this session's scratchpad, not
the repo (it's a one-off audit tool, not part of the site).
