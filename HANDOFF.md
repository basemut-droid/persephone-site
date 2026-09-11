# Handoff — current state

Read this first at the start of every session. History and past decisions moved to
`docs/decisions.md` (2026-09-07) so this file stays short enough to actually read —
see `external-review.md`'s "PROCESS NOTE" for why that matters.

## Most recent run: NACHTRAG-2026-09-11 (`docs/NACHTRAG-2026-09-11.md` N1–N4) + live follow-ups

N1–N4 done, then a long cascade of live corrections (Claudio watching over WLAN on his
phone) that go beyond the written Nachtrag — several *supersede* earlier written decisions
rather than just implement them, so check `OPEN-QUESTIONS.md` #34–37 before assuming the
current code is the final word:

- N1: the "Button-Kästchen" tiles moved from Angebote to Über uns (misfiled originally).
- N2/live: qualification bands are 2:1 panel:image, fixed-height (`100svh - 117px`,
  live-corrected from N2's own "height follows content" text once a side-by-side of all
  three original bands showed they're actually identical), near-full-bleed width, plus a
  new slideshow-position indicator not in any written brief.
- N3: the rust-orange accent (`#c26d32`) removed per the ochre ban — but flagged in
  `OPEN-QUESTIONS.md` #35, since the true original screenshots shown live this session do
  feature that exact accent as part of the illustration, not a stray element.
- N4: the crossfade rebuilt so the bands overlay at a fixed position (only opacity
  changes) instead of each being independently `position: sticky`, which had been reading
  as a slide-over rather than a fade.
- ClosingCta (photo+logo, 4 pages) unified to one shape — square portrait, bottom-left
  overlap, sized to match the tile — reversing Workshops/Beratung's "no overlap" decision
  from `LAUF-2026-09-10.md` B10/B11. See `OPEN-QUESTIONS.md` #36.
- Dev server is running with `--host` on the LAN (`http://192.168.178.44:4321/`) for this
  review — stop it (`astro dev stop`) once done; it's this machine's own dev server, not a
  deployment, and the IP is only reachable on this WLAN.

Full record: `docs/decisions.md`'s "Nachtrag 2026-09-11" entry.

## Previous run: LAUF-2026-09-10 (`docs/LAUF-2026-09-10.md`) + live follow-ups

Several rounds of live screenshot corrections followed the written run below —
Kontakt's card heights/panel columns, `.button-primary`'s color, Kontakt's hero,
the header dropdown's open-state color, and Über uns's qualification-band
color/shape/decoration. See `docs/decisions.md`'s entries and `OPEN-QUESTIONS.md`
#31–33 for the newest ones (the qualification-band contrast trade-off, the
hand-approximated decorative background, and the crossfade transition needing a
real-browser look this session couldn't give it).

## Original run: LAUF-2026-09-10 (`docs/LAUF-2026-09-10.md`)

Marina's 34-point feedback list plus a brand-new Kontaktseite from her own Claude
Design prototype. All four parts done; see `docs/decisions.md`'s matching entry for
the full record and `OPEN-QUESTIONS.md` #25–30 for what's still waiting on her/Claudio.

**Teil A (site-wide):** Fließtext columns widened to ~1200px everywhere
(`.section-narrow` no longer binds below `.container`'s own width); hero title→text
gap corrected to 25px; `.button-primary` is a gradient again (Marina's explicit ask,
reversing an earlier session's "solid fill" call); homepage sections now genuinely
alternate dunkel/hell; footer background fixed to `--color-bg-alt` and its old
untokenized `#e9dccd` literal removed from the project; footer's wavy divider replaced
with a hairline; footer links use a new `--color-teal-darker` token (green, pending
Marina's sign-off); "e-Brief" lowercased everywhere including a `.eyebrow` uppercase
trap in the footer; FAQ answers now render `*Persephone*` as real italics (were
literal asterisks — `mdInlineHtml()` wasn't being called); heroes gained left/right
slide-in reveal animations (existing `.reveal` mechanism, two new direction
modifiers).

**Teil B (page by page):** header dropdown's "▾" text glyph — the actual cause of
"Trennpunkt zwischen Angebote und Blog" — replaced with an inline SVG chevron;
Disclaimer's title/mint-link-highlight/width; FAQs got real clickable tabs (pure CSS
`:has()`, works with JavaScript disabled); Über uns's hero title forces onto two
lines, its three qualification bands are lighter/higher-contrast and no longer let
text show through the pomegranate image; Angebote's recognition-panel behavior
inverted (starts statement-only, response card aligns to the clicked statement via a
small script, no more scroll-following) plus new colored "button-Kästchen"
teasers; Workshops' two cards stack instead of sitting side by side and its
Ressourcen icon was redrawn a second time (a horizontal paper roll, not a vertical
tube); Beratung/Workshops/Angebote's photo+logo layout corrected per page (some
needed `layout="pair"`, Angebote needed the opposite); Selbsthilfegruppe's
duplicate heading removed and its Aktuelles block sits in a darker box; blog
articles now use the shared split-hero (with a subtitle) instead of a plain banner.

**Teil C:** Kontakt rebuilt from scratch against
`docs/mockups/kontakt-prototype.dc.html` (Version A) — split hero, two equal-height
cards ("Schreib mir" is a native `<details>`, no JavaScript needed at all; "Termin
buchen" links to `/kennenlernen/`), and a message panel (Marina's photo/Standorte/
Terminverfügbarkeit plus the contact form) that unfolds full-width *below* the card
row rather than growing the "Schreib mir" card itself — the panel is a sibling of
the card row, shown via `.kontakt-cards:has(.kontakt-card-write[open]) +
.kontakt-message-panel`, the same `:has()`-only technique as Angebote's B8, so it's
still zero JavaScript (a first version nested the panel inside the `<details>`
instead, which only grew that one card — corrected live from a screenshot mid-
session). Two more live-screenshot corrections, same session: Kontakt's hero now
uses the shared `.hero-grid`/`.hero-headline` unmodified (was its own 1fr/1fr split
and #D83830 title, both dropped after comparing against every other page's hero —
the h1 had also been missing the `.hero-headline` class outright, so it never had
the shared 25px title-gap either, fixed the same pass); and `.button-primary`
(global, not Kontakt-specific) turned out to be flat solid fills with no gradient
at rest or on hover, once actually pixel-sampled from a screenshot rather than
assumed from A3's written "Farbverlauf" ask — see `--color-terracotta-hover` in
`global.css`. Verified end-to-end with Playwright (installed locally, not in
package.json — see "Session note" below) at 1440px and 390px, JavaScript on and
off. Three things intentionally left for Marina/Claudio, not decided here: the
form's real submission endpoint, three vs.
four Anliegen options, and whether "Termin buchen" should become an overlay.

## What's built

All 14 pages (homepage + 12 standalone pages + blog) render from their real content
collection entries (`src/content/pages/de/`, `src/content/blog/de/`, `src/content/site/`)
via `parseMarkdownBlocks.ts` + `BlockTracker` (see `DESIGN-SYSTEM.md`'s "Page
composition" section for how and why). `src/content/` is the site's live, editable
copy; `docs/source-archive/` is a frozen, never-touched verbatim record of the
original extraction.

The runs recorded in `docs/RUN-2026-09-07.md`/`docs/FIXES-2026-09-07.md`,
`docs/RUN-2026-09-07-B1.md`, `docs/RUN-2026-09-07-B2.md` Phase 1b,
`docs/NACHTLAUF-2026-09-08.md` and `docs/NACHTLAUF-2026-09-09.md` are all
**complete** — see `docs/decisions.md`'s dated entries for the phase-by-phase
record with commit hashes. As of the 2026-09-08 Nachtlauf: the type scale,
eyebrows, buttons and hero band all match live's measured values; Über uns has
its full teal qualification-band treatment, live-proportioned closing teasers,
and a 48px/336x390 CTA; Angebote's CTA shows two same-size images side by side
and its response card is sticky; Beratung's "Gut zu wissen" and every FAQ are
real accordions (FAQs grouped into their three live categories);
Workshops/Beratung's cards are equal-height with bottom-anchored badges;
Kontakt has icon eyebrows; Selbsthilfegruppe has its missing 40px heading and a
correctly-sized partner logo; blog articles have an author/newsletter block and
derived "Verwandte Beiträge"; all ten pages have a real meta description (the
owner's own words); `/termine/` is now `/kennenlernen/` everywhere; and the
build blocks on missing alt text, unrendered schema fields, broken internal
links, unlabeled links, and (new) missing meta descriptions.

As of the 2026-09-09 Nachtlauf (Claudio's own screenshot feedback, ten items —
see `docs/decisions.md`'s matching entry for the live-measurement corrections,
including one place a brief's own screenshot guess turned out backwards): Über
uns's bio headings are `.eyebrow`, its qualification lists have real bullets,
its Beratung/Workshops teasers are `ServiceCard`s, and its three qualification
bands crossfade into each other on scroll (progressive enhancement, ≥900px,
motion-OK); the homepage's philosophy-grid columns end at the same height and
its blog cards are equal-height with corrected eyebrow/link color; blog
articles' in-body `<h2>`s are teal and "Verwandte Beiträge" reuses
`BlogTeaserCard`; Workshops' lists use the same check-circle markers as
Beratung; Kennenlernen has a split-hero (title now "Kennenlernen vereinbaren")
and its calendar uses the full container width.

Five places now carry deliberate design decisions rather than a literal live
value: the photo placeholder (`ImagePlaceholder.astro`, a branded panel with a
muted signet), the footer's brushstroke divider, the `.reveal` scroll-fade
mechanism, Über uns's rebuilt (not copied — the live one is an Avada asset)
qualification band, and (new) that same band's scroll-crossfade interaction.
See `docs/decisions.md`'s Nachtlauf entries for the reasoning on each.

## Verified working

- `npm run build` (`astro build && node scripts/build-check.mjs`) and `npx astro
  check` are both clean. **Six** checks are now BLOCKING: source headings, image
  alt text, schema fields rendered/allow-listed, internal links resolve, link
  accessible names, and (since the 2026-09-08 Nachtlauf) meta descriptions — see
  `scripts/build-check.mjs` for these plus the remaining non-blocking checks.
- `npm run dev` and `npm run build && npm run preview` both start cleanly on the
  default port 4321.
- Termine/Kennenlernen's Microsoft Bookings iframe refuses to load under
  `localhost` in dev (`frame-ancestors` CSP from Microsoft's own side, not this
  site's) — expected for a non-whitelisted/placeholder domain; re-check once real
  hosting is live.

**Session note:** `playwright@1.63.0` is installed locally via `npm install
--no-save` for visual QA (screenshots, live-DOM checks) — not in
`package.json`/lock, reuses the chromium binary cached under
`%LOCALAPPDATA%\ms-playwright`. Still present and reused as of LAUF-2026-09-10 (worth
knowing sooner next time than this run found out — a plain `msedge.exe --headless
--screenshot` CLI invocation was tried first and gave unreliable results at narrow
window widths on this machine, specifically; Playwright's own `page.screenshot()`
did not have that problem and is the one to reach for first). Safe to reinstall if
`node_modules/playwright` is gone; a throwaway `scratch-*.mjs` pattern (git-ignored
via `.git/info/exclude`) is the convention for one-off screenshot/measurement
scripts — see recent commit messages for examples.

## Known gaps — not fixed, not this run's call

See `OPEN-QUESTIONS.md` for the full list with options and recommendations. The ones
that matter most:

- **EN/IT must not be published until the owner reads them line by line** (#7b) —
  the English homepage was found to drop the required training-status disclosure
  entirely. `noindex` + sitemap exclusion are in place as a stopgap.
- **Datenschutzerklärung needs the owner's sign-off** (#3) — a legal document, not a
  code decision, and needs a re-check at launch against whatever the site actually
  loads by then.
- **Termine's/Kennenlernen's direct calendar embed costs a cookie banner** (#0c) —
  owner decision, implemented as asked; the consent-banner trade-off is hers.
- **The ochre/amber hero decoration** (#0b) and **Selbsthilfe Steiermark logo
  permission** (#0) — both since resolved/decided; see `OPEN-QUESTIONS.md` for
  the record.
- **Kontakt's form has no submission endpoint yet** (#4, #25) — Microsoft Forms is
  the decided approach, but no actual form exists yet to point it at. The new
  Kontakt page's fields now match Marina's own Claude Design prototype rather than
  the earlier ad-hoc set.
- **Kontakt's Anliegen options: three or four?** (#26) — the earlier "no fifth
  option, four total" decision and the new prototype's three options actually
  conflict; this run kept the prototype's three (it's the newer record) but did not
  resolve the conflict itself.
- **Kontakt's "Termin buchen"** (#27) links to `/kennenlernen/` for now rather than
  the prototype's overlay — the safer default, not a final call.
- **`astro.config.mjs`'s domain is a placeholder** (#6) — blocked on the hosting
  decision.
- **Two proposed color values need Marina's sign-off, not just correctness**
  (#28) — `--color-teal-darker` for the footer's green text, and whether the
  Angebote-dropdown teal (B9) is legible enough as-is.
- **Mobile rendering (390px)** was checked this run with Playwright (not the ad-hoc
  CLI screenshot approach — see the Session note above) across Über uns, Angebote,
  Kontakt, and FAQs, JavaScript on and off; no overflow or broken layout found. Not
  exhaustively re-checked on every page this run touched, though nothing about the
  changes themselves is width-dependent in a new way — worth a pass on a real
  device before launch regardless.
- Two of the ten meta descriptions carry a wording question back to the owner
  ("psychodukativ", "(i.A.u.S)" without a period — fuer-marina.md Frage 16); 301
  redirects for the domain switch are blocked on hosting (#15) but now include
  `/termine/`→`/kennenlernen/` (`docs/START-CHECKLISTE.md` Teil 3).
- **B10 Punkt 28 ("Gut zu wissen" styling) could not be confirmed** (#30) — the
  screenshot Marina attached doesn't match what the current shared accordion CSS
  actually renders; left unchanged rather than guessed at.

## Next step

`docs/LAUF-2026-09-10.md` and `docs/NACHTRAG-2026-09-11.md` (N1–N4) are both fully worked
through — see `docs/decisions.md`'s two matching entries. Pick up from
`OPEN-QUESTIONS.md` #34–37 first — these are the ones from this run's live-correction
cascade that *reverse* earlier written decisions (ClosingCta overlap on Workshops/Beratung,
the qualification bands' fixed-equal-size height, the rust-orange accent's removal) and
need an explicit yes rather than being assumed settled; #25–33 are the rest of what's
waiting on Marina/Claudio from the last two runs specifically, or the rest of that file for
everything still open from earlier runs. `docs/NACHTLAUF-2026-09-09.md`'s Teil F (repo
hygiene — stray uncommitted files Claudio noticed in VS Code) is still open too, waiting on
a decision about `Claude outputs/` and the other untracked docs sitting in the working tree.
