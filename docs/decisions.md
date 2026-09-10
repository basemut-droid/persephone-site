# Decisions and session history

Append-only archive of past sessions' work, moved out of `HANDOFF.md` so that file
can stay a "current state only" document (`external-review.md`'s "PROCESS NOTE" and
`docs/NIGHT-RUN.md`'s closing instruction). Newest entries at the top.

---

# Lauf — 2026-09-10 (`docs/LAUF-2026-09-10.md`, complete)

Marina's 34-point feedback list (`docs/feedback-2026-09-10/`) plus a new Kontaktseite
built from her own Claude Design prototype (`docs/mockups/kontakt-prototype.dc.html`).
Four commits, one per Teil (A/B/C, D folded into C's commit plus this record).

**Teil A — site-wide.** A1: Fließtext columns to ~1200px — the fix was almost always
removing/raising a narrower class (`.section-narrow`, blog's own `42rem`, homepage's
`.narrow`) rather than touching `.container`, whose own ~1168px already matches;
Punkt 3's "two columns end at the same height" done via CSS `align-items:stretch` +
a `justify-content:space-between` paragraph wrapper, not a re-measured pixel constant
(self-adjusts if the copy length ever changes, unlike the previous run's fix for the
same complaint). A2: hero title→text gap to 25px (was 55px). A3: `.button-primary`
gradient restored — Marina asked for it explicitly; a fresh live measurement
confirmed it's genuinely there, reversing `RUN-2026-09-07-B1.md` Phase 1.3's
"solid fill" call, which was based on an earlier, apparently mistaken read. A4:
homepage sections actually alternate dunkel/hell now (previously two dunkel
sections could sit back-to-back). A5: footer background fixed to `--color-bg-alt`,
its untokenized `#e9dccd` literal deleted from the project; footer links get a new
proposed token `--color-teal-darker` (green, pending Marina's sign-off — contrast
math in the token's own `global.css` comment). A6: wavy footer divider replaced with
a hairline (Avada original stays off-limits). A7: "e-Brief" lowercased everywhere,
including a `.eyebrow` uppercase-transform trap in the footer that would have
silently produced "E-BRIEF". A8: FAQ answers were rendering literal `*asterisks*`
instead of italics — `faqs.astro` was interpolating `{item.answer}` directly instead
of through `mdInlineHtml()`, the same bug every other markdown-sourced page had
already been fixed against. A9: heroes gained direction-aware reveal animations
(`.reveal-left`/`.reveal-right`, new modifiers on the existing `.reveal` mechanism —
matches the live site's own Avada `fadeInLeft`/`fadeInRight`), same no-JS/reduced-
motion safety contract as before.

**Teil B — page by page.** B1: the header's "Trennpunkt zwischen Angebote und Blog"
was the dropdown's "▾" text glyph rendering as a barely-visible dot at this size in
DM Sans — replaced with an inline SVG chevron (screenshot-verified against the
running dev server; a first attempt just repositioning the old glyph didn't fix it,
because the glyph itself was the problem). B2: newsletter fragment sentence
removed. B3: Disclaimer's title forced to one line, hyperlinks get a sage-green
highlight behind them (not recolored text — the only WCAG-passing option of the
ones measured). B4: FAQs got real clickable category tabs — the tablist itself needs its
enhancement script (ARIA roles, keyboard nav, show/hide), so it ships `hidden`
until JS confirms it's running; verified with Playwright, JavaScript fully
disabled, that all 13 questions across all three categories stay reachable exactly
as before (the plain stacked-sections fallback), and separately that the *other*
tab-like mechanism this run built (Angebote's B8 selector, pure CSS `:has()`) needs
no JavaScript at all for its interaction to work. B5/B6: already correct, no change needed. B7: Über uns's
hero title forced onto Marina's requested two lines (needed both a forced `<br>` and
widening the hero-copy column — the shared 500px column was too narrow for line one
alone); qualification bands switched to sage/dark-text (lighter *and* higher-
contrast, not a straight swap — the literal ask didn't work as stated, described in
the code); band-overlap transparency fixed by moving the crossfade's opacity from
the whole band onto just the image, so text is never see-through. B8: Angebote's
selector now starts with no statement selected and full-width statements (`checked`
default removed); clicking one aligns the response card to it via a small
enhancement script (no more scroll-following `position:sticky`); the whole mechanism
still works with JavaScript off, confirmed with Playwright (native radio inputs +
`:has()`); new colored "button-Kästchen" teasers reusing the existing
recognition-panel offer data; intro paragraph before the H2 removed; Angebote's
photo/logo now overlap (`layout="pair"` removed, reversing a prior session's
"confirmed non-overlap" finding for this specific page — Marina's fresh screenshot
disagreed). B9: Angebote-dropdown entries recolored to teal (live-plausible, not
directly measurable — flagged). B10: Beratung's Dauer/Ort badges moved above their
lists; Beratung/Workshops' photo+logo switched *to* `layout="pair"` (opposite
direction from Angebote — each page needed the correction the other one didn't).
B11: Workshops' two cards stack now; the Ressourcen icon was redrawn a *second*
time — the first redraw (2026-09-08) was a vertical tube that Marina again couldn't
identify, so this one uses a horizontal-roll convention instead (rendered and
visually checked via `sharp`-rasterized SVG before committing to the final path).
B12: Selbsthilfegruppe's duplicate heading removed, Aktuelles sits in a
`--color-bg-alt` box, its data no longer bold, more space before the principles
heading. B13: blog articles now use the shared split-hero component (with a new
subtitle, reusing the post's existing `description` field) instead of a plain
banner + separately-stacked image.

**Teil C — Kontaktseite neu.** Rebuilt from scratch against Version A of
`docs/mockups/kontakt-prototype.dc.html`, not incrementally patched — the old page's
content-collection extraction (`kontakt.md`'s body) no longer matches the new shape
at all; only its `title`/`description` are still read. `ContactForm.astro`'s fields
changed to match the prototype (dropped phone, changed Anliegen to the prototype's
three options). New `mail` icon added to `Icon.astro`. The "Schreib mir" disclosure
is a native `<details>`, not a scripted toggle — works with zero JavaScript by
construction, verified with Playwright. Three things the brief explicitly said not
to decide are marked in the code and listed in `OPEN-QUESTIONS.md` #25–27: the
form's real submission endpoint, the three-vs-four Anliegen-option conflict, and
overlay-vs-link for "Termin buchen".

**Teil D — closing.** `npm run build` (which runs `build-check.mjs`) is clean.
Visual/interaction verification used Playwright (`npm install --no-save`, already
present from an earlier session — see `HANDOFF.md`'s Session note) at 1440px and
390px, JavaScript on and off, on the pages this run changed most: Über uns, Angebote,
Kontakt, FAQs. An initial attempt at the same checks via a raw `msedge.exe
--headless --screenshot` CLI invocation produced what looked like a real 390px
horizontal-overflow bug on every hero (`.hero-copy`'s text overflowing past the
viewport) — extensively chased with several CSS fixes before isolating it to the
screenshot tool itself: reproduced with plain system fonts and zero site CSS at
narrow `--window-size` values on this machine, absent at the same widths under
Playwright. The two defensive CSS changes made while chasing it
(`grid-template-columns: minmax(0, 1fr)` instead of bare `1fr` on `.hero-grid`;
`.hero-copy`'s `align-items: stretch` instead of `flex-start`, with the CTA button
opted back out via `align-self`) were kept — both are correct practice on their own
terms even though they weren't fixing a bug that turned out not to exist — but their
`global.css` comments were corrected afterward to not overstate that dead end as a
confirmed sitewide defect. Lesson for next time, recorded in `HANDOFF.md`: reach for
Playwright first, not a bare headless-browser CLI invocation, for exactly this kind
of narrow-viewport check.

**Two live corrections, mid-review, after the report above was first written:**
(1) Kontakt's two cards weren't equal height, and clicking "Schreib mir" grew only
that one card instead of unfolding the form below the whole row — the message panel
had been nested inside the `<details>`, so only its own card's box grew. Fixed by
moving the panel to a sibling of `.kontakt-cards` and revealing it via
`.kontakt-cards:has(.kontakt-card-write[open]) + .kontakt-message-panel` (same
`:has()` technique as Angebote's B8, still zero JavaScript — reconfirmed with
Playwright, JS disabled) with `align-items: stretch` making both cards match height
regardless of open state. (2) Disclaimer's B3 hyperlinks — the LAUF doc's own
literal reading of "unterlegen" (a background chip, the only option that cleared
4.5:1 contrast) wasn't what was wanted; corrected to plain `--color-accent` text,
underlined, no background, per a screenshot given directly in this session. Contrast
is 3.27:1, under the 4.5:1 body-text threshold — a known trade-off of this explicit
direction, not an oversight.

**Two more, same session, same pattern (live screenshot > written brief when they
conflict):** (3) `.button-primary` — A3 had it as a gradient again; pixel-sampling
actual screenshots of the button at rest and on hover (not eyeballing) showed both
states are flat solid fills with zero variation, so the gradient came back out —
rest `--color-accent-strong` (#b33a3b), hover a new token `--color-terracotta-hover`
(#863232, measured, not a formulaic darken of an existing token). (4) Kontakt's
hero — screenshot-compared against every other page's hero, its prototype-inherited
1fr/1fr column split and #D83830 title color were both dropped in favor of the
shared `.hero-grid`'s 45%/55% and `.hero-headline`'s `--color-accent-strong`, so the
page no longer carries its own hero deviation at all. Caught in passing: the h1 had
been missing the `.hero-headline` class entirely (only the now-removed
`.kontakt-title` override), so it was never getting the shared 25px title→text gap
either — fixed as part of the same edit. Also from this round: the message panel's
own 15rem/1fr desktop column split had been silently stuck at its 1fr mobile value
at every width, because the `:has()` visibility rule's higher specificity was
setting `grid-template-columns` too and always winning over the `min-width:900px`
rule meant to override it — split into a `display`-only rule so the column width is
owned in exactly one place again. And `ContactForm`'s submit button was stretching
to the form's full width — Grid's own default `justify-items: stretch`, not
anything about `.button`'s own sizing — `justify-self: start` opts it back out.

---

# Night run — 2026-09-06/07 (Phases 1-6, complete)

Executed `docs/NIGHT-RUN.md` unattended, per `docs/external-review.md` (authority for
the run) and `docs/fuer-marina.md` (owner decisions). Full commit-by-commit detail is
in `git log`; this is the condensed record.

**Phase 1 — Stop the bleeding.** Added `scripts/build-check.mjs` (wired into
`npm run build`), eight checks over the built site, one (source headings must appear
in their built page) blocking. Root-caused the silent-content-loss bug: added
`BlockTracker` to `src/lib/parseMarkdownBlocks.ts` so every block a page reads is
either rendered or explicitly excluded with a reason, checked at build time
(`.assertAllHandled()`). Retrofitted every page using it. Restored content lost to
the old positional-selection bug: Beratung's "Was ist Beratung?"/"Formate" headings,
Workshops' "Was ist Psychoedukation?" heading, Kontakt's "Erreichbarkeit"/"Standorte"
headings, and Angebote's ten self-recognition statements (re-extracted from the live
site's raw HTML).

**Phase 2 — Separated the archive from the live copy.** `docs/source-archive/` froze
a verbatim, one-time record of the original extraction; `src/content/` became the
site's real, correctable copy. `CLAUDE.md` updated accordingly.

**Phase 3 — Applied all ten of the owner's decisions** from `fuer-marina.md`: six
typos corrected; heading weight set to 400; Selbsthilfegruppe's intro kept variant A
only; the English demo heading stayed removed; the blog's "hier" link now points at
`/selbsthilfegruppe/`; Impressum got a clean meta description; `/newsletter/` now
redirects to MailerLite (the invented page and its component deleted); the
homepage-meta-description fallback bug (11 pages inheriting one description) is gone;
the two absolute `persephone.at` links are now relative; `astro.config.mjs`'s
placeholder domain got a prominent TODO, logged as blocked on the hosting decision.

**Phase 4 — Structural fixes.** "Angebote" in the header nav is now a real link
(previously `<details>/<summary>` could only disclose, never navigate) with a
separate toggle for its submenu. Über uns's two closing teasers now use the real
design: a black-and-white (CSS-filter) placeholder photo, explicitly labelled so it
can't ship unnoticed, with a cream text card overlapping it, the two staggered
vertically. Termine got explanatory copy, a click-to-load booking embed (was an
always-on iframe — a cookie-banner-triggering issue per the review's 3c), a fallback
link, and cross-links with Kontakt. The language switcher now hides locale entries
for pages that aren't actually translated. **Found in the process:** the EN/IT
homepage's own nav links to 66 subpages that don't exist — logged, not fixed (a
bigger call than the switcher), with a new build-check (`internal-links-resolve`)
watching for it going forward.

**Phase 5 — Verified.** Disclaimer's text confirmed word-for-word against the live
page; Über uns's three "i.A.u.S." and Beratung's three "Ausbildung unter Supervision"
occurrences all confirmed present. One real, pre-existing, undocumented deviation
found: `PageHero`'s intro paragraph (768px) is narrower than `.section-narrow`
(896px) — logged, not changed (a design call). Mobile rendering remains unverified —
this environment's headless browser unreliably renders narrow viewports.

**Phase 6 — Left for review.** Full-page 1920px screenshots of every page in
`docs/screenshots/2026-09-07/`, with `-before.png` for the five most-changed pages
(taken from a clean worktree at the pre-run commit, not guessed at). Verified
`npm run dev` and `npm run build && npm run preview` both start cleanly on the
default port 4321.

---

# Handoff — structure-fix + remaining-pages session (COMPLETE)

## Done and committed this session

- **Task 0 (fix Über uns structure) — commit `5e3de9e`:** the previous session's
  Über uns build got the masthead and narrative section wrong — PageHero's plain
  banner instead of the live page's actual split-hero (text left, full-bleed
  portrait right, same pattern the homepage already uses), and a new two-column
  photo+text component for "Wer Dir hier begegnet" that isn't in the live design at
  all (that section is centered, no image). Fixed both, extracting
  `.hero`/`.hero-grid`/`.hero-copy`/`.hero-headline`/`.hero-image` out of
  `HomePage.astro`'s scoped style into `global.css` so both pages share the exact
  same component instead of two implementations of the same shape. Section
  backgrounds now match the live page's actual pattern (light masthead, beige
  narrative, light credentials, beige teasers, teal CTA — read directly from each
  row's `--awb-background-color` custom property, cross-referenced against Avada's
  own dynamic CSS file rather than guessed). Added a new "Reuse before you build"
  rule to `CLAUDE.md`/`AGENTS.md` per the brief.

  **Also found and fixed while doing this:** the masthead's real image is a CSS
  `background-image` (`MG_7803`), not an `<img>` tag — the original Task 2
  extractor only looks for `<img>` tags, so it never found this one. The image
  previously used as `heroImage` (`marina-von-persephone.jpg`) actually sits next
  to the closing CTA further down the live page instead. Corrected
  `ueber-uns.md`'s frontmatter to the real hero image; **the misplaced
  `marina-von-persephone.jpg` reference has not been relocated yet** — that's
  Task 2's (content fidelity audit) job, flagged there.

  Screenshot verification: the live page failed to render its JS-driven layout in
  headless Edge (text/images didn't paint, only the header) — the same known
  limitation this project's history already documented (see below and
  `DESIGN-SYSTEM.md`'s H1-weight entry). Verified structure/colors from the raw
  HTML + Avada's dynamic CSS instead, which doesn't depend on JS executing.
  Local build screenshotted at 1920px and sent to the user. Verified with
  `npm run build` (23 pages, no errors) and `npx astro check` (0 errors).

- **Task 1 (adversarial design-system review) — commit `430f41a`:** fresh-context
  subagent reviewed `ueber-uns.astro` against `DESIGN-SYSTEM.md`/`global.css`/
  `HomePage.astro`; both real findings fixed. `@media (min-width: 800px)` (the
  only 800px breakpoint anywhere in the codebase — everything else uses 900px for
  the same single→multi-column transition) changed to 900px.
  `.teaser-grid`/`.teaser-card` (a generic linked-card pattern) moved out of
  `ueber-uns.astro`'s scoped style into `global.css` — same trapped-scope shape as
  the historical `.section` bug. `.credentials-grid`/`.credentials-badge` judged
  lower-risk (page-specific content shape) and left where they were — logged, not
  acted on; revisit if a future page needs the same layout.

- **Task 2 (content fidelity audit) — commit `bd01275`:** re-verified all 16
  checkable content-collection pages character-by-character against a fresh
  render from each page's original extraction JSON (never eyeballed, never
  word-counted). Found and fixed 2 real mismatches: a lost non-breaking space in
  `beratung.md` (root cause not fully pinned down — a from-scratch repro of the
  same regeneration step did *not* reproduce it, so treat this as "verify again
  after any future bulk regeneration," not a one-time fix), and a misplaced image
  in `ueber-uns.md` (dropped instead of relocated when Task 0 corrected the
  masthead) plus a Unicode-normalization (NFC vs NFD) mismatch on that same
  image's alt text. `docs/content-audit.md` has the full table: heading
  count/hierarchy, image existence, alt-text status, meta title/description
  presence, and every internal persephone.at link found with its status.
  **Important carry-forward for Task 3:** content-collection files correctly keep
  absolute `persephone.at` URLs (a few real, working ones — `/termine/`,
  `/kontakt/`, `/ueber-uns/` — turned up in Angebote/Beratung/Disclaimer, not just
  the already-known dead ones) — every page built from here needs those rewritten
  to local routes at build time, same pattern Task 0 established for Über uns's
  two dead links.

## Task 3 (build remaining pages) — in progress, one commit per page

- **Angebote — commit `c1723f4`:** built from `pages/de/angebote.md`. Plain PageHero
  (confirmed via raw HTML: this page's masthead has no background-image, unlike
  Über uns) + one centered `.section-centered`/`.section-narrow` body. Fixed the
  same class of content-collection error Task 0 found on Über uns: `mg-7425.jpg`
  was wrongly set as `heroImage` — it's actually a small inline photo near the
  closing CTA. Corrected. CTA href rewritten from the verbatim
  `https://www.persephone.at/termine/` to the local `/termine/` route.
  **Process note:** while fixing Angebote's image, also fixed the *same* wrong-
  heroImage mistake found on `beratung.md`, `workshops.md`, and `kontakt.md`
  (all three had `marina-von-persephone.jpg`/`mg-7811.png` wrongly set as
  `heroImage` too — confirmed via the same raw-HTML check) and staged everything
  together, so those three fixes landed in this commit rather than each page's
  own. Their own upcoming page-build commits won't repeat that content fix — it's
  already done.

- **Beratung & Coaching — commit `5be643e`:** built from `pages/de/beratung.md`.
  Same PageHero-banner pattern. Found and fixed a real bug in
  `parseMarkdownBlocks.ts`'s `section()` helper: it stopped at the next heading
  of *any* level, so a section heading immediately followed by a deeper
  sub-heading (exactly "Gut zu wissen" h2 → four h4 FAQ questions, no paragraph
  between) returned nothing. Fixed to stop only at same-level-or-shallower —
  **verified this doesn't regress Über uns** (its three narrative headings still
  render). Also fixed a bug this exposed: FAQ questions are same-page anchor
  links (no matching `#id` in this static rebuild) — were rendering raw markdown
  link syntax; now render just the label via `parseLinkHeading`. CTA href
  rewritten to local `/termine/`. Not rendered: the "Formate" heading is an
  empty grouping label in the source (no body text) — skipped, logged not
  silently dropped.

- **Workshops & Einzeltrainings — commit `78865b9`:** built from
  `pages/de/workshops.md`. Same continuous-section pattern as Beratung. Closing
  heading appears twice back-to-back (h3 then h1, identical text, responsive
  duplicate) — `section()` would've hit the second as a false boundary, so this
  page locates the last matching heading by hand instead. Verbatim "Workhops"
  typo preserved (OQ#8). Two bare location-tag paragraphs ("WIEN, GRAZ, ONLINE"/
  "ONLINE") not rendered, no existing pattern fits — logged, not dropped
  silently.

- **Selbsthilfegruppe — commit `f9e55dc`:** built from
  `pages/de/selbsthilfegruppe.md`. Dropped the unremoved English demo heading
  (unambiguous); still rendering a placeholder choice between the two
  near-duplicate intro paragraphs pending your call (OQ#7, updated to reflect
  this). Second masthead-level heading mid-page rendered as plain h2, not a
  second `.heading-black`. Found a second `section()`-related bug (a caller
  mistake this time, not the helper): "Aktuelles" hierarchically contains its
  "Nächtes SHG-Treffen" sub-heading, so pulling "all paragraphs" out of it
  double-counted the closing paragraph after the sign-up button — bounded
  manually instead.

- **Kontakt — commit `efc066f`:** built from `pages/de/kontakt.md`. Live page's h1
  appears twice back-to-back (with/without trailing period, responsive
  duplicate) — first used for PageHero, duplicate skipped. Portrait photo (added
  inline during Task 2's audit) now actually rendered on the page. `ContactForm`
  unchanged — already correctly inert. Added OPEN-QUESTIONS.md #11 (form
  endpoint not decided) since it wasn't previously logged anywhere; caught and
  corrected a factual error while drafting it — mistakenly claimed this repo
  deploys via `wrangler.toml` (that's the *other* repo from earlier in this
  session, `gm-scheduler` — verified this repo has no deploy config at all before
  the entry was committed).

- **FAQs — commit `dca7e77`:** built from `pages/de/faqs.md`. Kept the existing
  native `<details>`/`<summary>` accordion (already a good pattern), fed it the
  real 13 verbatim Q&A pairs instead of paraphrased ones. Live page's own
  category-jump nav (3 links, all literally `href="#"`) skipped rather than
  reproduced as dead links. Dropped a one-off `52rem` `.section-narrow` override
  that didn't match the global `56rem` token. **Tooling note:** the long-running
  dev server (17+ hrs uptime) briefly 500'd this page after the edit — confirmed
  via its logs as dev-server module-cache staleness (static build was already
  correct), fixed by restarting it (`astro dev stop` then `astro dev
  --background`). Worth remembering if another page 500s unexpectedly later in
  this session.

- **Disclaimer — commit `07f477b`:** built from `pages/de/disclaimer.md`. Added a
  shared `toLocalRoute()`/`rewriteLocalLinks()` pair to `parseMarkdownBlocks.ts`
  (Angebote/Beratung each had their own inline regex for the same rewrite — not
  retrofitted, but every page from here uses the shared one). Both inline links
  rewritten to local routes.

- **Impressum — commit `9ac9eaf`:** content was already accurate but the page
  used a bare `<h1>` + one-off `.legal-page` class instead of
  PageHero/`.section`/`.section-narrow` — rewritten to use the design system,
  now actually rendering from `pages/de/impressum.md`. Kept the earlier
  session's tel: link format fix (source's own is non-functional, has spaces).
  Mangled auto-excerpt description (OQ#5) not shipped — falls back to the
  site-wide default.

- **Datenschutzerklärung — commit `d05ea99`:** per this task's explicit
  instruction, wording left untouched — only the wrapper markup changed
  (bare `<h1>`/`.legal-page` → `PageHero`/`.section`/`.section-narrow`),
  verified via `git diff` to be zero words changed. **Still does not render
  from the content collection** — `datenschutz.astro`'s existing fonts-section
  correction stays authoritative; `pages/de/datenschutzerklaerung.md` remains a
  verbatim (but not-shipped) record. OPEN-QUESTIONS.md #9 rewritten from
  "resolved" to **needs human sign-off** — the client's wife approves this
  page's wording, not this rebuild, and it needs a re-check at launch against
  whatever the site actually loads by then.

- **Termine — commit `a756810`:** the page's eyebrow/title/intro were all
  invented in an earlier session (the live page has zero narrative text — it's
  one Microsoft Bookings iframe, nothing else). Replaced with just the real
  page title, nothing invented. Iframe embed unchanged, already correct.

- **Blog — commit `887675f`:** blog index's `PageHero` copy was invented ("Texte
  über den Weg durch die Krise" has no source) — found the real text by reading
  the live page's raw HTML directly (its own heading is wrapped oddly, a `<p>`
  nested inside an `<h1>`), added `pages/de/blog.md` for it matching the usual
  convention. Post grid itself (`BlogTeaserCard`/`getCollection`) was already
  correctly content-driven, no change needed. **Important technical finding:**
  the render-time link-rewrite pattern every other page uses (patch a string,
  re-render) silently does nothing for blog posts — Astro's `render()` reads a
  pre-rendered HTML cache, not the live body. A `remarkPlugins` hook in
  `astro.config.mjs` would work but requires installing `@astrojs/markdown-remark`
  as a new dependency in this Astro version — blocked by the "no new
  dependencies" rule. Landed on editing the two affected posts' exact dead URLs
  directly in their content-collection files instead (only the URL, zero prose)
  — a deliberate, logged exception to "content collections stay verbatim." Both
  fixes verified in the built output.

## Task 4 (whole-site check) — commit `47f173f`

- **Production build:** `npm run build` — 23 pages, 0 errors, throughout.
- **Internal links + images, whole site:** a scratchpad crawler
  (`link-check.mjs`) walked every built HTML file, extracted every
  `<a href>`/`<img src>`, and checked internal ones against `dist/`. Result:
  **0 broken images, 0 broken internal links to the site's own content.**
  21 external links found (mailto/tel/real third-party URLs), all left
  alone — out of scope for a static-build correctness check.
- **Real bug found and fixed: unparsed bold/italic markdown on 4 blog
  posts.** WordPress-source `<strong>`/`<em>` tags with a leading or
  trailing space inside them converted to invalid CommonMark
  (`**text **`), which Astro's strict default compiler for the `blog`
  collection refuses to render as bold/italic — showing literal asterisks
  on the page instead. Found via screenshot review, confirmed site-wide via
  a grep of every built blog post's HTML for literal `*`/`**`. Fixed in
  `maenner-im-kinderwunsch-mythos-maennerohnmacht.md` (2 instances),
  `maenner-im-kinderwunsch-mythos-stille-staerke.md` (1),
  `texte-stimmen-lieder.md` (1), and `zwischen-lichterglanz-und-leere.md`
  (2) — pure whitespace relocation, no wording touched. Verified clean
  (zero literal asterisks) across all 6 built posts after the fix.
  Full technical writeup in `docs/content-audit.md`'s Task 4 addendum.
- **Real, pre-existing bug found (not fixed — logged as a decision):** the
  language switcher (`LanguageSwitcher.astro`) offers `/en/`/`/it/` links
  on every page regardless of whether that page has a real translation,
  so 105 of the site's links 404 (only the homepage has real EN/IT
  content). This predates this session's work. Logged as
  `OPEN-QUESTIONS.md` #12 with three options and a recommendation, since
  the right fix is a design decision (hide untranslated links vs. point
  them at the locale homepage vs. remove the switcher entries until more
  translations exist), not something to silently patch.
- **Screenshots at 1920px:** every page reviewed — homepage, Über uns,
  Angebote + all 3 sub-pages, Kontakt, FAQs, all 3 legal pages, Termine,
  Blog index, all 6 blog posts, 404, EN/IT homepages. No structural
  inconsistencies found beyond the bold-markdown bug above (already fixed).
- **Mobile rendering: still unverified.** As documented in this file's
  earlier Phase-2 entry, 390px headless-Edge screenshots are unreliable in
  this environment (content lays out as if the viewport were wider, then
  gets cropped — reproduced even on the already-shipped, unmodified
  homepage, so it's an environment limitation, not a site bug). This
  applies to every page built this session too, not just the ones already
  flagged. **A real device or a manually-resized real browser window is
  still needed before launch to confirm mobile rendering — this has not
  been done for any page in this repo.**

## Session summary

**Built:** the 12 remaining standalone pages plus all 6 blog posts (Angebote
and its 3 sub-pages, Kontakt, FAQs, all 3 legal pages, Termine, Blog index +
posts), each from its real content-collection entry, each screenshotted and
checked against the homepage/Über uns for container width, gutters, type
scale, section rhythm, backgrounds, and buttons before moving on. Über uns's
masthead/narrative structure was corrected first (Task 0) so the shared
hero pattern was right before 11 more pages could reuse it.

**Fixed:** two real bugs in the shared `parseMarkdownBlocks.ts` helper
(a heading-boundary bug and its downstream double-counting implication)
that would otherwise have silently broken content on multiple pages; 4
dead internal links (2 on Über uns, 2 in blog posts); several
wrongly-set `heroImage` frontmatter values (a mistake pattern caught once
and then swept across all affected files); a lost non-breaking space and a
Unicode NFC/NFD mismatch; an `800px` breakpoint that didn't match the
site's established `900px`; and, in Task 4, unparsed bold/italic markdown
on 4 blog posts.

**Fidelity audit found:** re-verifying all 16 checkable content-collection
pages character-by-character against a fresh mechanical render from source
found exactly 2 real mismatches (both fixed) — everything else was already
verbatim. Full table with heading/image/meta/link checks per page is in
`docs/content-audit.md`.

**Waiting on your decision** — see `OPEN-QUESTIONS.md` for the full list
with options and recommendations; the ones that block launch rather than
just being FYI:
- **#9 Datenschutzerklärung** needs your wife's sign-off on the wording,
  and a re-check at launch against whatever the site actually loads by
  then (legal document, not a code decision).
- **#11 Kontakt's form** has no submission backend yet — deliberately left
  inert rather than inventing one; needs a hosting/service decision.
- **#12 Language switcher** 404s on untranslated pages — needs a decision
  on how untranslated locales should behave.
- **#1 H1/H2 weight** (900 vs. 400) — carried over from the previous
  session, still unresolved pending a look at the brand book in person.
- **Mobile rendering is unverified sitewide** — needs a real device check
  before launch, this environment can't produce a trustworthy mobile
  screenshot.

---

# Handoff — Phase 2 re-parse + Über uns rebuild session (COMPLETE, stopped per brief)

Every task in this run (0–3) is done and committed. Per the brief, this session
stops here — Task 3 explicitly said not to build the remaining pages until Über uns
is approved. **Next step is yours: review Über uns, then say go for the rest.**

## Done and committed this session

- **Task 0 (clean tree):** already clean at session start — nothing to commit.
- **Task 1 (isolate the h1 weight decision) — commit `0236d22`:** the previous
  `HANDOFF.md`/`DESIGN-SYSTEM.md` claimed every masthead h1 already ran through the
  `.heading-black` utility. That claim was **false** — four pages (`404.astro`,
  `datenschutz.astro`, `impressum.astro`, `blog/[...slug].astro`) rendered a bare
  `<h1>` with no class. Fixed by adding `class="heading-black"` to each. **Now true:**
  every masthead h1 site-wide takes its weight from `--weight-heading`; flipping
  900 → 400 in `global.css` is genuinely a one-value change.
- **Task 2 (re-parse everything from persephone.at) — commits `8a9a567`, `7f30182`,
  `25b4c85`, `c9c5f62`, `b85a9ef`:** all 12 standalone pages and
  all 6 blog posts re-extracted from live HTML into `src/content/pages/de/` and
  `src/content/blog/de/`, replacing the old "poor" parse and the blog posts' literal
  placeholder stubs entirely. `docs/content-inventory.md` written (page, source URL,
  word/image counts, extraction issues). Method: raw HTML via `curl` → a small
  dependency-free Node HTML→block extractor (`html2md.mjs`, session scratchpad only,
  **not committed** — redo the `curl` + extractor pass if this needs revisiting) →
  real images downloaded, no hotlinking → markdown **mechanically generated** from
  the block JSON, never hand-typed, then byte-diffed against the repo file before
  committing. **One real mistake happened and is fully disclosed in the commit
  history and `docs/content-inventory.md`:** early on, three paragraphs of
  `beratung.md` got hand-paraphrased from a truncated terminal preview instead of
  transcribed verbatim. Caught during a verification pass before committing; fixed by
  switching to the mechanical-generation + byte-diff process for every page from
  then on, including re-doing the pages already affected.
- **Task 3 (build Über uns) — commit `67e056a`:** `src/pages/ueber-uns.astro`
  rewritten to render from `src/content/pages/de/ueber-uns.md` (a new
  `src/lib/parseMarkdownBlocks.ts` utility splits that one flowing markdown body
  into blocks so different sections feed different components — no content
  duplicated into separate typed fields). Composed entirely from existing
  components/tokens: `PageHero`, a new page-scoped bio-photo+narrative section, a
  3-column credentials grid (adds "Sprachen", the old version only had 2 columns),
  two closing teaser cards, and `CtaBand`. Applies Open Question #6's fix directly —
  the two teaser cards link to the real `/beratung/`/`/workshops/` pages, not the
  source's own dead links. Verified with `npm run build` + `npx astro check`
  (0 errors both). **Per the brief, stopped here — the remaining pages are not
  built.**

### Screenshot verification (Task 3) — 1920px clean, 390px unreliable, documented not faked

No browser-automation tool (Playwright/Puppeteer/etc.) exists in this environment or
as a dependency; system `msedge.exe` driven headless via CLI (`--headless
--window-size=W,H --screenshot=...`) filled in instead.

- **1920px:** worked cleanly. Screenshotted Über uns against the homepage —
  container width, gutters, type scale, section rhythm, and button styling all
  matched with **no deviations found** (both screenshots were sent to you in-chat).
- **390px: unreliable, not used as evidence.** Every screenshot at this width showed
  text clipped mid-word at the right edge — but the *identical* artifact appeared on
  the already-shipped, unmodified homepage and `/beratung/` page too, reproduced
  with a completely clean browser profile and both legacy and `--headless=new`
  modes. The output PNG is genuinely 390px wide, so the browser is laying out
  content as if the viewport were wider, then cropping — a headless-viewport-
  emulation limitation of driving Edge via bare CLI flags (no real device-metrics
  emulation available without a devtools-protocol library, which would be a new
  dependency), not a site bug. **Mobile responsiveness for the new page was instead
  verified by code parity**: identical `.container`/`.section` usage, identical
  grid-collapses-to-`1fr`-below-800px pattern as every other already-shipped
  subpage, no fixed-pixel widths introduced. This is a real, unresolved
  verification gap, not equivalent to an actual mobile screenshot — worth a look on
  a real device or a manually resized real browser window.

## Open — waiting on you

See `OPEN-QUESTIONS.md` for the full list (now 11 items) with options and
recommendations. Headlines:

1. H1/H2 weight, 900 vs 400 (carried over; 900 stays until compared against the
   brand book in person — a one-value revert either way).
2. The live "Newsletter" page/nav-link 301-redirects to an external MailerLite form
   — no real page content exists, so local `newsletter.astro`'s copy was invented in
   an earlier session. Recommend redirecting to match the live site.
3. Several live pages ship no meta description at all. Recommend shipping empty
   rather than inventing SEO copy.
4. The live site ships duplicate/conflicting meta description tags — on the
   homepage *and* on all 6 blog posts (a plugin/theme conflict). The rebuild uses
   only the real one in each case.
5. Impressum's live meta description is a mangled, space-less auto-excerpt.
6. **Four dead internal links found site-wide** (Über uns ×2, two blog posts ×1
   each) — likely stale slugs from page renames. Über uns's two are already fixed in
   the built page; the two in blog posts are recorded verbatim, not yet fixed
   anywhere (no page currently renders that body content).
7. Selbsthilfegruppe has an unremoved English Avada demo heading plus two
   near-duplicate German intro paragraphs.
8. Two verbatim typos preserved from the live site (Workshops h1, one
   Selbsthilfegruppe heading).
9. **Important:** the live Datenschutzerklärung describes Google Fonts/Typekit
   loading the new site doesn't do — the existing `datenschutz.astro` already fixed
   this correctly; don't let a future edit revert to the freshly re-parsed (but
   factually wrong for this site) text.
10. Über uns's two teaser cards use a plain style, not `ServiceCard` — reusing
    `ServiceCard` needs a button-label prop with no source text to draw from.
11. FYI only: a few Über-uns list items carry a leftover `font-claude-response-body`
    CSS class in the live HTML — harmless, a sign text was once pasted from a
    Claude.ai chat.

---

# Handoff — end of design-system gap-closing session

## Done and committed (this checkpoint)

- **`DESIGN-SYSTEM.md`** (new): full design system derived from the front page's actual
  code — colors, typography, spacing, buttons, component inventory, header/footer specs,
  interaction states, a spacing-scale audit, and a running log of every gap found and
  either fixed or flagged for a decision.
- **`CLAUDE.md`/`AGENTS.md`**: stack, commands, the tokens-only and German-verbatim rules,
  plus a warning about Astro's component-style scoping (see bug below).
- **Root-cause fix**: `.section`/`.section-alt`/`.section-centered`/`.section-narrow`/
  `.section-heading` used to live inside `HomePage.astro`'s own scoped `<style>` block,
  so they silently matched only elements in that one file. Every other page/component
  using bare `class="section"` — `CtaBand`, and nearly every subpage — got zero padding
  from it. Moved to `global.css` where a shared class actually works everywhere. Verified
  via stash/unstash A-B test (not a regression, pre-existing) and spot-checked on
  `ueber-uns.astro`.
- `CtaBand.astro`: copy measure `60ch` → `56rem` (matches `.section-narrow`, no new value
  invented); internal eyebrow→h2→copy→button rhythm now uses explicit `--space-6`/
  `--space-7` instead of bare default margins.
- `ServiceCard.astro`: `.card-button` radius now uses `var(--radius)`.
- `Footer.astro` / `global.css`: footer background tokenized as `--color-footer-bg`
  (flagged: this color is not one of the brand book's 8 official tones — confirm with
  client eventually, not blocking).
- `HomePage.astro` / `PageHero.astro` / `global.css`: `.heading-black` utility added
  (weight 900), applied to the one masthead `<h1>` per page (homepage hero + every
  subpage's `PageHero`); homepage hero's h1 also dropped its fixed `2.75rem` override and
  now shares the same size clamp as every subpage's h1.
- `global.css`: `.button-hero` added for the homepage hero CTA only (bigger, italic).
  `.button-primary` itself stays compact — an earlier attempt to promote the hero style to
  every primary button (including nav) was reverted after screenshots showed it broke the
  mobile nav menu (button overflowed the viewport) and looked wrong in the header.
- `global.css`: `--space-1`…`--space-9` spacing tokens defined. **Not yet adopted
  site-wide** — currently used only by `CtaBand`'s rhythm fix above. Everything else
  flagged as "ad hoc" in `DESIGN-SYSTEM.md`'s spacing audit is still ad hoc.

## Open — waiting on you

**H1/H2 weight, 900 vs 400 — the one real open decision.** `docs/brand/Brandbook.pdf`
(dated **August 2026** — newer than today's live site) specifies H1 *and* H2 at
weight 900/Black. The actual live persephone.at renders its h1 at weight **400**
(confirmed by tracing its own CSS custom-property chain to `--awb-typography1-font-weight:
400`; a pixel screenshot of the live hero wasn't obtainable — Avada's JS-driven heading
sizer never resolves under headless browser automation, tried six ways). You'd earlier
chosen "900 for the masthead h1 only, H2 stays 400," and that's what's implemented and
now committed — but you then asked to see it against the real live site before finalizing,
given that discrepancy. That comparison is what surfaced the 400-vs-900 conflict and the
brand book's August 2026 date, which raises the open question underneath this: is the
90-day-old brand book a not-yet-applied rebrand direction, or is the live site still the
correct target? That's a judgment call for you and your wife, not something in the code
to fix. Current state: 900 stays in the code until you say otherwise.

## Working tree

Clean after this commit — `git status` should show nothing pending. `DESIGN-SYSTEM.md`
and this file are new; everything else is a modification, all in one checkpoint commit.

## Next step

Once the H1/H2 weight question above is settled (keep 900, revert to 400, or something
else), **Phase 2 starts**: discard the existing subpage content in `src/pages/*.astro`
(`ueber-uns`, `angebote`, `beratung`, `workshops`, etc. — the "poor" parse from the earlier
session) and re-extract every page from persephone.at from scratch into content
collections, per the original brief. Nothing in Phase 2 has started yet.

---

# Resolved open questions (moved from OPEN-QUESTIONS.md, 2026-09-07)

## H1 masthead weight: 900 vs 400 — RESOLVED 2026-09-06

Decided in `fuer-marina.md` Q2: 400, matching the live site, over the August-2026
brand book's 900/Black spec. Implemented in `src/styles/global.css`'s
`--weight-heading` token, which every masthead `<h1>` site-wide reads from — still a
one-value edit back to 900 if this is ever revisited.

## The "Newsletter" page — RESOLVED 2026-09-06

Decided in `fuer-marina.md` Q8 (option a): `/newsletter/` redirects straight to the
MailerLite form via Astro's `redirects` config, matching the live site's own 301
exactly. The invented full page and its now-unused form component are deleted.

## Impressum's meta description — RESOLVED 2026-09-06

Decided in `fuer-marina.md` Q6: "Impressum und Offenlegung von Persephone – Marina
Bletsas, Wien." replaces the live site's mangled, space-less auto-excerpt.

## Four dead internal links across the live site (Über-uns + 2 blog posts) — RESOLVED

Über-uns's two teaser cards link to `/beratung/`/`/workshops/`; the two blog posts
link to `/blog/ist-unfruchtbarkeit-immer-noch-frauensache/` and, as of the 2026-09-06
run, `/selbsthilfegruppe/` (confirmed in `fuer-marina.md` Q7 — the sentence refers to
the self-help group's next meeting and registration link).

## Selbsthilfegruppe's English demo heading and doubled intro — RESOLVED 2026-09-06

Decided in `fuer-marina.md` Q3/Q4: the English Avada demo heading stays dropped; the
intro keeps variant A ("...die die Erfahrung der Kinderwunschkrise teilen") — chosen
because it comes first on the live page and names the topic concretely. Variant B is
removed from the content collection itself.

## Six verbatim typos — RESOLVED 2026-09-06

All six corrected per `fuer-marina.md` Q1: Workshops' "Workhops" h1, Über uns's
"linguistiche", Selbsthilfegruppe's "Einbzeltermine" and its "Nächtes SHG-Treffen"
heading, and FAQs' "Geleggenheit" and "(ehmals)".

## Über-uns's two closing teasers use a plain style, not ServiceCard — SUPERSEDED

This question proposed adding button copy so the two teasers could reuse
`ServiceCard`. `external-review.md` finding #4b confirmed the opposite: the live
design has no button — the heading itself is the link — and the owner confirmed
that's intentional (`fuer-marina.md` Q5). The real fix (the black-and-white photo +
offset cream text-card layout) landed in the 2026-09-06/07 night run, Phase 4.2.

## Language switcher offering /en/ and /it/ links that 404 — RESOLVED 2026-09-06

`BaseLayout`/`Header`/`LanguageSwitcher` now take an `availableLocales` prop
(default: just the current locale) filtering both the visible switcher's entries and
the hreflang `<link>` tags in `<head>`. Only the homepage passes all three locales;
every other page correctly advertises German-only now.

## Run 2026-09-07 (`docs/RUN-2026-09-07.md` / `docs/FIXES-2026-09-07.md`) — done and committed

Full order-of-operations and findings live in those two files; this is the record of
what shipped, for future reference. Every commit below passed a clean
`npm run build` first. Live-site claims were verified against raw HTML (`curl -A
"Mozilla/5.0 ..." <url>`), never a text/summary fetch — see RUN-2026-09-07.md's own
"HOW TO VERIFY" section for why that rule exists (three of the previous night's four
wrong conclusions came from exactly that shortcut).

- **Phase A** (`c947478`) — the Angebote nav dropdown was physically unreachable by
  mouse: an empty margin between trigger and menu broke `:hover` mid-transit, no
  close delay existed, and a CSS `:focus-within` fallback fought the JS-driven
  Escape-close. Fixed in `Header.astro`; also tightened the visual gap before "Blog"
  that the toggle button's touch target was creating. Verified with a real
  Chromium session: a stepped pointer path across the gap, full keyboard flow, and a
  touch-emulated 390px context.
- **Phase B** (`c9675a0`) — `Icon.astro` (shared inline-SVG set: book, document, pin,
  calendar, clock, shield, heart, group, check) and `Pill.astro` (shared sage
  badge), recorded in DESIGN-SYSTEM.md's new "Icon set"/"Badge/pill" sections.
- **Phase C** (`f4df68d`) — `ClosingCta.astro`, the site-wide two-column
  portrait-over-tile closing CTA, replacing four pages' worth of stray badges and
  ad-hoc centered layouts. Beratung and Über uns were confirmed (not assumed) to
  have the same live composition before applying it.
- **Phase D** — the four Angebote subpages, one commit each:
  - D1 `7acb408` (Beratung): re-extracted duration/location badges (new
    `formatBadges` schema field), eyebrow/centering fixes, beige no-border cards,
    teal circular check-mark list.
  - D2 `b68d8eb` (Workshops): eyebrow/centering, card treatment reusing Beratung's
    card shape, circular section icons, sage list markers, location pills.
  - D3 `3fbd105` (Angebote): the ten-statement self-recognition selector, rebuilt
    from real data — the live page's own inline script literal (all ten
    statement/response/offer triples, confirmed word-for-word against the owner's
    screenshot) turned out to be sitting in the raw HTML the whole time, not fetched
    client-side as an earlier session assumed. New `recognitionPanel` schema field;
    the interaction itself is radio+label+CSS `:has()`, zero JavaScript.
  - D4 `4abe81f` (Selbsthilfegruppe): three principle labels (new `principles`
    field), a real meeting-details card with teal icons in the live page's actual
    order, the downloaded Selbsthilfe-Steiermark partner logo/band, and a top-to-
    bottom re-check that found "Über die Gruppe"/"Grundprinzipien"/"Aktuelles" are
    one continuous background section on the live site, not three alternating
    bands as previously built.
- **Phase E** (`f3cf4c9`) — hero images. `PageHero.astro` now supports the same
  split-hero pattern the homepage/Über uns already used, with a default pomegranate
  image and a per-page override. Confirmed via raw HTML, not assumed: Angebote,
  Beratung, Workshops, Selbsthilfegruppe, Kontakt get the pomegranate; Blog gets its
  own downloaded photo (Marina at her desk); Termine, FAQs, Impressum, Datenschutz,
  Disclaimer confirmed to genuinely have none. The ochre/amber decorative shape at
  the hero's lower-left could not be found in any page's markup or the source
  illustration itself — logged in OPEN-QUESTIONS.md #0b rather than invented.
- **Phase F** — the rest:
  - Task 3 `308cb9d`: blog listing rebuilt as single-column rows (date badge,
    description, byline, `<time>`), `category` widened to a list on the schema
    (two posts needed a second category, two needed the existing one's name
    corrected — all re-confirmed against each post's own live page).
  - Task 4 `582ab34`: EN/IT get `noindex` + sitemap exclusion (a legal problem, not
    cosmetic — the English homepage was found to drop the training-status
    disclosure entirely) and an honest one-line nav pointing back to German,
    replacing a full set of dead links.
  - Task 5a `3529cc5`: fixed doubled canonical URLs on the locale homepages
    (`/en/en/` → `/en/`).
  - Tasks 5b/5c/6 `30c641d`: Über uns's teaser eyebrows became real headings; every
    image on the five flagged pages got either real alt text (Marina's portrait,
    reusing the founder photo's existing approved copy) or `aria-hidden="true"`
    directly on the `<img>`; `scripts/build-check.mjs` gained two new BLOCKING
    checks (alt-text, and a new "every schema field is rendered or allow-listed"
    check that caught blog's unused `updatedDate` field — closed by rendering it,
    not allow-listing it away).
  - Task 5e `af9fcdd`: Termine's calendar embeds directly again (owner's husband's
    decision, reverting the click-to-load version), with the consent-banner
    trade-off recorded in OPEN-QUESTIONS.md #0c rather than decided in code.

**Open questions this run added**, all in `OPEN-QUESTIONS.md`: #0 (Selbsthilfe
Steiermark logo permission), #0b (the ochre hero shape), #0c (Termine's consent-
banner trade-off), #7b (EN/IT need the owner's line-by-line read before publishing).

## Nachtlauf 2026-09-08 (`docs/NACHTLAUF-2026-09-08.md`) — done and committed, unattended

Run overnight per the brief's own rules: no questions, open items to `OPEN-QUESTIONS.md`,
build + commit per task, `HANDOFF.md` updated after each commit. Authority for every value
was `docs/FEEDBACK-2026-09-08.md` and `docs/VERGLEICH-2026-09-07.md`; four spots had
explicit gestalterische Freiheit (A4, A5, A6, B2.1). Mid-run, an addendum (Teil A0) was
added to the brief and handled first, before continuing Teil A.

- **A0** (`34b2e83`) — Phase 1b's `.hero-grid` `height`→`min-height` left the hero image
  free to inflate the band on a portrait photo (Über uns: 1176px instead of 520px, since a
  percentage height on the image doesn't count as "definite" during the grid's auto row-
  sizing pass). Fixed by taking `.hero-image img` out of flow entirely
  (`position: absolute; inset: 0`); the container gets its own `aspect-ratio` below 900px,
  explicitly unset back to `auto` at ≥900px — aspect-ratio turned out to have the exact same
  "counts as definite" problem, just uniformly instead of Über-uns-only, caught by
  re-measuring before committing.
- **A1** (`7444f73`) — two color fixes, each already centralized behind one token/class:
  `.icon-list-check .icon` background #309898→#48b0b0; `--color-text-muted`
  #32373c→#181a2b (a leaked WordPress gray, not a real second tone).
- **A2** (`dab71fb`) — `Icon.astro`'s `book`/`scroll` (renamed from `document`) glyphs
  redrawn for recognizability; every glyph's stroke thickened, the check/meeting-detail
  circle enlarged to match.
- **A3** (`dce80b6`) — Workshops' list markers became small sage `<Icon>`s (matching the
  section tile above), not plain dots — same `<Icon>`-per-`<li>` mechanism
  `.icon-list-check` already used.
- **A4** (`456ede2`, gestalterische Freiheit) — new shared `ImagePlaceholder.astro`: the
  fruit-icon signet muted to a monochrome watermark on a sage panel + "Foto folgt",
  replacing grey diagonal stripes.
- **A5** (`bc5597e`, gestalterische Freiheit) — footer wave redrawn as an irregular,
  tapering brushstroke path instead of a regular scallop wave.
- **A6** (`5d54040`) — shared `.reveal` scroll-fade mechanism: progressive enhancement,
  visible by default, JS-only and reduced-motion-aware.
- **B1** (`ee82d0b`) — homepage: 'abonieren'→'abonnieren' typo, founder CTA button color
  (was the secondary beige/teal style meant only for the service cards), blog-teaser's
  white card now overlaps its photo instead of sitting beside it, services lede downgraded
  from `<h2>` to `<p>`, blog category order fixed on two posts.
- **B2** — Über uns, the largest single page:
  - B2.1 (`395e7f7`): qualification block rebuilt from scratch (live's panel is an Avada
    asset) as three full-bleed alternating `#309898` bands + the granatapfel illustration,
    with A6's `.reveal` fade-in; removed a duplicate 90x90 badge.
  - B2.2 (`751642b`): closing teasers rebuilt from FEEDBACK #1's 1440px measurements as
    generative rules (420fr/680fr columns, per-photo aspect ratios, card = 75%/77% of
    photo width anchored via `bottom: -130px` so it overhangs by exactly that much
    regardless of the card's own text-driven height) rather than copied absolute pixels —
    checked by arithmetic that the measured "150px lower" second card position falls out
    of the other four rules instead of needing a fifth, independent one.
  - B2.3 (`939be74`): `ClosingCta.astro` gained opt-in `headingSize`/`portraitSize="large"`
    props for Über uns's own measured 48px heading / 336x390 portrait, defaulting to the
    28px/230x307 every other page already had right.
- **B3** (`97c1122`) — Angebote: `ClosingCta` gained `layout="pair"` (two equal same-size
  images side by side, live's actual composition there) instead of the usual overlap; the
  self-recognition selector's response card is now `position: sticky` (≥900px) while
  scrolling the statement list.
- **B4** (`fc33fdf`) — Beratung's "Gut zu wissen" became a collapsed `<details>` accordion
  (new shared `.accordion-item`/`.icon-circle-sm`/-`sage`/-`terracotta-dark` pieces in
  `global.css`, reused by B8) with a centered eyebrow instead of a dark h2; format cards
  are equal-height with their badges anchored to the bottom.
- **B5** (`534db28`) — Workshops cards: same equal-height/bottom-anchored-pill mechanism
  as B4 (icons were already fixed in Teil A).
- **B6** (`360edbb`) — Selbsthilfegruppe: added the missing 40px "Nächstes SHG-Treffen"
  heading above "AKTUELLES" (live has it twice — the small `<h3>` inside the meeting card
  was already there and stays); Steiermark logo to 368x177 right-aligned, companion text
  to 20px.
- **B7** (`0a22bc3`) — Kontakt: "Erreichbarkeit"/"Standorte" became icon eyebrows (reusing
  `.icon-circle`, clock/pin), submit button text "Senden".
- **B8** (`85e6cff`) — FAQs grouped into their three live categories. The question→category
  mapping isn't in this repo's markdown at all, so it was fetched from the live DOM
  (persephone.at/faqs/, rendered markup — each accordion post there carries a
  `fusion-faq-post-<id>` class plus a category class, keyed against this repo's own
  `#collapse-1-<id>` anchors) rather than guessed from question text, per this run's own
  rule after three prior wrong findings came from a text conversion instead. Accordion
  restyled with B4's shared pieces (red circle, 24px icon/heading, both live-measured).
- **B9** (`7c13739`) — blog articles: the missing author/newsletter block (text fetched
  from a live article page's own rendered DOM) and a "Verwandte Beiträge" section derived
  from shared categories (not copied from live's WordPress plugin picks, per the brief's
  own "aus den Kategorien abgeleitet"); in-article `##` subheadings render uppercase via
  `:global()` since they come from the markdown renderer, not this page's own template.
- **C1** (`8bcab82`) — nine meta descriptions added verbatim from `fuer-marina.md` Frage
  16, including two rough edges she flagged herself and hasn't answered yet
  ("psychodukativ", "(i.A.u.S)" without a period) — not silently corrected.
- **C2** (`f7f3858`) — `/termine/`→`/kennenlernen/`, name and url: Marina named it, the
  owner decided the path moves too. Every internal reference updated (nav CTA in all three
  locales, Kontakt's cross-link, Beratung's/Angebote's closing-CTA hrefs), verified by the
  blocking `internal-links-resolve` check. `docs/START-CHECKLISTE.md` Teil 3 got the
  additional launch-time redirect this needs.
- **Teil D** (`9694a4d`, `565850f`) — meta-description check flipped to BLOCKING now that
  all ten exist; `DESIGN-SYSTEM.md` brought back in sync (new components, tokens, sizes).

**Verification method throughout:** a local Playwright install (`npm install --no-save
playwright@1.63.0`, not in `package.json`/lock, reusing the chromium binary already cached
under `%LOCALAPPDATA%\ms-playwright`) took screenshots and measurements against the running
dev server for every visual change, and fetched the *rendered* live DOM (not a text/markdown
conversion) for the two places this run needed real live-site facts (FAQs' category mapping,
blog's author-block copy) — per the brief's own explicit warning that three prior wrong
findings in this project came from exactly that shortcut.

**Open questions this run resolved**, all in `OPEN-QUESTIONS.md`: #8/#24 (Termine's rename,
now done both ways). No new open questions were added — everything not explicitly covered by
FEEDBACK/VERGLEICH or gestalterische Freiheit either had a literal answer to follow or wasn't
touched.

## Nachtlauf 2026-09-09 (`docs/NACHTLAUF-2026-09-09.md`) — done and committed

Ten screenshot-driven feedback items from Claudio's own comparison (Original vs. Vorschau,
`docs/screenshots/2026-09-09-feedback/`, 16 phone/browser photos — not pixel measurements).
Per the brief's own Regel 1 (`docs/UEBERGABE-CHAT.md`): every "vermutlich Original/Rebuild"
guess in the brief was re-checked against rendered markup and computed styles before acting,
not taken on the screenshot's word alone — a local Playwright script (`playwright@1.63.0`,
already installed per the 2026-09-08 session note) drove both `persephone.at` and
`localhost:4321` at a 1440px viewport for this.

- **E1** (`22db34a`) — Über uns's three bio headings ("Wer Dir hier begegnet" / "Was aus
  meiner Kinderwunschkrise wuchs" / "Persephone als soziales Unternehmen") were plain `<h2>`
  (28px/dark/normal-case); live measures all three at 18px/400/uppercase/teal — exactly
  `.eyebrow`. Switched to `class="eyebrow"`. The brief's own screenshot-based guess here was
  correct (screenshot 02 = live).
- **E2** (`22db34a`) — two findings:
  - **Bullet-style correction to the brief's own speculation.** The brief guessed screenshot
    03 (no markers, centered text) was "vermutlich Original" and screenshot 04 (left-aligned
    disc bullets) was the rebuild getting it wrong. Live-measuring the actual
    Ausbildung/Felderfahrung `<li>`s showed the opposite: live really does use plain
    left-aligned disc bullets (`list-style-type: disc`, `text-align: start`) — screenshot 04
    was the accurate one. Fixed by giving the `<ul>` variant of `.quals-list` real bullets and
    left alignment (the `<div>` Sprachen variant keeps its centered treatment, unaffected).
    **Lesson for next session:** a screenshot's own "vermutlich Original/Rebuild" label in a
    brief is still a guess, not a measurement — this is the second time in this project a
    labeled guess turned out backwards (see `docs/UEBERGABE-CHAT.md` Regel 1's own three
    prior examples); always re-derive it from the live DOM before trusting the label.
  - **Ochre curve:** not present anywhere in the current build (0 matches for `#eda444`/its
    rgb form) — screenshot 04 was stale relative to the current code, not a live regression
    of the `docs/UEBERGABE-CHAT.md` "entails ersatzlos" decision. Nothing to fix.
  - **Crossfade ("Faden") feature**, Claudio's own new request: the three qualification bands
    now scroll-crossfade into each other on capable, motion-OK, ≥900px viewports (progressive
    enhancement — IntersectionObserver + `position: sticky`, no scroll-position math, no
    library); everyone else (no JS, `prefers-reduced-motion: reduce`, <900px) gets the
    unchanged plain stacked-bands render, including the existing `.reveal` fade-in. Verified
    all three fallback paths plus the active-band handoff via Playwright before committing —
    stayed inside the brief's own one-to-two-hour box, so no mid-run checkpoint was needed.
- **E3** (`22db34a`) — Über uns's Beratung/Workshops teasers swapped from the photo+overlap
  placeholder layout to `ServiceCard`/`.service-grid` (Claudio's decision: screenshot 07's
  teal gradient cards, same shape the homepage already uses for these two services).
  `.service-grid` moved out of `HomePage.astro`'s scoped `<style>` into `global.css` first —
  it was trapped there exactly the way `CLAUDE.md` warns about for `.section`. The old
  photo-teaser markup/CSS stays in the file as a clearly labeled, commented-out block
  (Claudio's own preferred option: kept as a findable backup for whenever real photos exist
  and Marina edits this in the CMS, rather than only recoverable from git history).
- **E5** (`22db34a`) — "Der Persephone-Ansatz"'s two columns (text left, four `ValueTile`s
  right) ended ~180px apart at 1440px on both original and rebuild alike (not a
  live-vs-rebuild difference — Claudio flagged it as an existing problem in both). Live's own
  row genuinely renders both columns equal-height (confirmed via `fusion-builder-row`'s two
  children both measuring 994px). Closed the gap (now 3px) with slightly looser
  paragraph line-height/spacing on the left column plus a small `ValueTile` padding trim on
  the right — text, order and paragraph count all unchanged, per Claudio's own condition. A
  line-height-only version was tried first and looked oddly airy within each paragraph; most
  of the extra height comes from between-paragraph spacing instead.
- **E4** (`45e18aa`) — homepage blog-grid cards: category eyebrow was a bespoke 12px/
  letter-spaced rule where live measures 18px/uppercase/teal (i.e. plain `.eyebrow`); the
  "Weiterlesen" link was terracotta at 13.6px where live is teal at 15px. Cards within a row
  are now equal-height regardless of title line count (the 4-line "Männer im Kinderwunsch:
  Mythos 'stille Stärke'" card no longer leaves 2-line siblings visibly shorter) via the same
  flex-column + `height: 100%` pattern `.format-card`/`.workshop-card` already established.
  Title color/size (dark, 26px, normal-case) already matched — one of `UEBERGABE-CHAT.md`'s
  four documented deliberate deviations from live, left alone.
- **E6** (`5781d5f`) — blog article in-body `<h2>` subheadings measured teal
  (`--color-accent`) on live; the rebuild had uppercase but no color, inheriting dark
  `--color-text`. One-line fix on `:global(.post-body h2)`.
- **E7** (`5781d5f`) — "Verwandte Beiträge" now reuses `BlogTeaserCard` (image + eyebrow +
  title + "Weiterlesen"), matching the homepage's blog grid, instead of the old
  image-less `.post-related-item` text cards. Grid widened to 3 columns at ≥900px (was 3 at
  ≥700px on the narrower old cards).
- **E8** (`ebadd1a`) — Workshops' two lists switched from `icon-list-sage` (bare book/scroll
  glyph per item) to `icon-list-check` (filled teal circle + check glyph), matching
  Beratung's format cards exactly, per Claudio's explicit instruction. Not independently
  re-verified against live — reused Beratung's own already-live-verified pattern
  (`NACHTLAUF-2026-09-08.md` B4) rather than re-measuring a value that's already on record.
- **E9** (`6c88bd8`) — Kennenlernen's masthead: Claudio's own deliberate design decision, not
  a live-site correction (the prior text-only hero was itself a confirmed-correct read of the
  live page at the time). Title → "Kennenlernen vereinbaren"; hero now the same split-hero
  with the default pomegranate image every other subpage has; intro sentence moved from
  under the calendar into the hero.
- **E10** (`6c88bd8`) — the booking calendar not using the full section width was
  `.booking-wrap`'s own 56rem reading-width cap (896px), narrower than the regular
  `.container` (1248px) — confirmed by measuring `getBoundingClientRect()` on the iframe vs.
  both wrapping elements, not Microsoft Bookings self-centering (the brief's other
  hypothesis). Cap removed; iframe now measures 1168px (container minus padding).

**Open questions this run added:** none — every item had either a literal live measurement
to follow or an explicit decision from Claudio to implement. **Teil F** (repo hygiene / stray
uncommitted files) was explicitly out of scope for this run, per the brief itself.

Build (`npm run build`) and `npx astro check` both clean after every commit above; only the
pre-existing non-blocking `astro.config.mjs` placeholder-domain warning remains (blocked on
the hosting decision, see `OPEN-QUESTIONS.md` #6).
