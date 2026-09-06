# Content inventory — Phase 2 re-parse

Every page and post re-extracted from the live persephone.at into
`src/content/pages/de/` and `src/content/blog/de/`, replacing all previously "poor"
or invented content entirely, per Task 2's brief. Method: raw HTML via `curl` (a
real browser wasn't available in this environment — see `HANDOFF.md`'s tooling note),
parsed by a small dependency-free Node script into structured blocks, then
mechanically rendered to markdown and byte-diffed against that output before being
committed — never hand-transcribed. Word counts are computed from each file's
markdown body (frontmatter excluded, link/image syntax collapsed to its visible
label text).

## Standalone pages

| Page | Source URL | Words | Images | Notes |
|---|---|--:|--:|---|
| Über uns | `/ueber-uns/` | 552 | 2 | Old parse was missing an entire narrative section and one credential-list item each in "Ausbildung"/"Felderfahrung". Two CTA links are live 404s, recorded verbatim — see Open Questions #6. |
| Angebote | `/angebote-2/` (local slug drops WordPress's `-2`) | 112 | 2 | Shortest standalone page — a single orientation/triage section. |
| Beratung & Coaching | `/beratung/` | 403 | 3 | Includes 4 FAQ-accordion Q&A pairs whose headings link to same-page anchor fragments (`#8de675...` etc.) — recorded as bare fragments, not full URLs (an earlier draft of this file mistakenly prepended the page URL; caught and fixed before commit). |
| Workshops & Einzeltrainings | `/workshops/` | 216 | 3 | On-page `<h1>` reads "Workhops & Einzeltrainings" (real one-letter typo, `<title>` tag spells it correctly) — preserved verbatim, see Open Questions #8. |
| Selbsthilfegruppe | `/selbsthilfegruppe/` | 278 | 0 | Live page has an unremoved English Avada demo heading ("Your Journey to a Fulfilling Life") and two near-duplicate German intro paragraphs — both preserved verbatim, see Open Questions #7. |
| Kontakt | `/kontakt/` | 65 | 1 | Short — mostly contact details, no form copy (the form itself is a separate component, `ContactForm.astro`, not page body text). |
| Termine | `/termine/` | 25 | 0 | The entire page is one embedded Microsoft Bookings iframe — there is no narrative copy in the source at all. Word count is this file's own explanatory note, not extracted text. |
| FAQs | `/faqs/` | 913 | 0 | 13 real Q&A pairs plus a non-functional category-jump nav (hrefs are literally `#` in the source). |
| Disclaimer | `/disclaimer/` | 99 | 0 | Two paragraphs, clean extraction. |
| Impressum | `/impressum/` | 75 | 0 | Matches the previously-existing inline page almost exactly — re-parsed from scratch anyway per Task 2, confirms that earlier parse was accurate. `tel:` link in the source literally contains spaces (`tel:+43 665 67221738`) — recorded as found; the current `impressum.astro` already uses the corrected, functional format. |
| Datenschutzerklärung | `/datenschutzerklaerung/` | 1736 | 0 | **Important:** the live text's "Google Fonts"/"Typekit Fonts" sections describe font-loading the new site doesn't do (DM Sans is self-hosted). Recorded verbatim per Task 2, but should **not** ship as-is — see Open Questions #9, which also covers the source's section headers being plain paragraphs, not real headings. |

**Not re-parsed — no real source exists:** `newsletter.astro`'s content was not
sourced from the live site. `/newsletter/` (and the "e-Brief abonnieren" nav link)
both 301-redirect straight to an external MailerLite form; there is no WordPress page
behind it. See Open Questions #2.

## Blog posts

| Post | Source URL | Words | Images | Notes |
|---|---|--:|--:|---|
| Einsam im Kinderwunschprozess? | `/einsam-im-kinderwunschprozess/` | 705 | 1 | Clean extraction; hero image/alt already correct in the old parse (byte-verified against a fresh download). |
| Ist Unfruchtbarkeit immer noch Frauensache? | `/ist-unfruchtbarkeit-immer-noch-frauensache-2/` (local slug drops the `-2`) | 671 | 1 | Was missing a hero image entirely — downloaded fresh; no alt text exists on the source, so alt falls back to a plain reading of the image's own WordPress filename ("Paar in der Kinderwunschkrise"). Contains a link to `/aktuelles/`, a live 404 — see Open Questions #6. |
| Männer im Kinderwunsch: Mythos „Männerohnmacht“ | `/maenner-im-kinderwunsch-mythos-maennerohnmacht/` | 1149 | 1 | Was also missing a hero image — same fallback-alt treatment ("Nebel lichtet sich im Kinderwunsch"). Contains a link to `/featured/unfruchtbarkeit-ist-paarsache/`, a live 404 — see Open Questions #6. |
| Männer im Kinderwunsch: Mythos „stille Stärke“ | `/maenner-im-kinderwunsch-mythos-stille-staerke/` | 689 | 1 | Clean extraction; hero image/alt already correct. |
| Texte. Stimmen. Lieder. | `/texte-stimmen-lieder/` | 1188 | 1 | This post's live HTML uniquely leaks raw WordPress comment-form boilerplate ("Leave A Comment", in English) into the article body — excluded, not present on any other post. |
| Zwischen Lichterglanz und Leere | `/zwischen-lichterglanz-und-leere/` | 1683 | 1 | Clean extraction; hero image/alt already correct. Longest post. |

Every post's live page carries **two** `og:description` tags — a short hand-written
hook followed by a long auto-truncated duplicate. Each post's frontmatter
`description` now uses the hand-written one; see Open Questions #4 for the pattern
(also present on the homepage) and how close this came to being extracted wrong.

All 6 posts share one identical trailing template block (author bio photo + "Marina
von Persephone" link + newsletter CTA + "Verwandte Beiträge" heading and an empty,
JS-populated related-posts list) — excluded from every post's body since it's shared
boilerplate, not unique article content, and would otherwise be duplicated
word-for-word six times.

## Methodology notes (apply across the whole inventory)

- **Alt text:** no image on any re-parsed page has real `alt` text on the live site.
  Where the underlying `<img>` has a non-empty `title` attribute (a WordPress
  media-library field, distinct from `alt`), that literal text was used as the
  markdown alt instead of leaving it blank — still sourced text, not invented. Where
  neither existed (the two blog-post hero images above), alt falls back to a plain
  reading of the image's own filename. Nothing here is descriptive prose written from
  scratch.
- **Images use the largest available resolution**, not necessarily the bare `src`
  attribute — WordPress often points `src` at a small cropped thumbnail while
  offering the original via `srcset`; the extractor picks the widest `srcset`
  candidate.
- **Headings, typos, and dead links are preserved exactly as found**, including the
  ones flagged throughout `OPEN-QUESTIONS.md` — Task 2's job is a faithful record of
  the source, decisions about what to fix belong to whoever builds each page.
- **One process failure, corrected:** while writing `beratung.md` by hand from a
  truncated terminal preview early in this session, three paragraphs were
  paraphrased instead of transcribed verbatim. Caught during a verification pass
  before committing; fixed by re-deriving that page's (and every subsequent page's)
  body mechanically from the extractor's own output and byte-diffing the result
  against the repo file, rather than ever hand-retyping body text again. See
  `HANDOFF.md` for the full account.
