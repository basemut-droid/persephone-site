# Handoff — current state

Read this first at the start of every session. History and past decisions moved to
`docs/decisions.md` (2026-09-07) so this file stays short enough to actually read —
see `external-review.md`'s "PROCESS NOTE" for why that matters.

## Nachtlauf 2026-09-08 — in progress

Working through `docs/NACHTLAUF-2026-09-08.md` (replaces `RUN-2026-09-07-B2.md`),
unattended overnight, per its own rules: no questions, open items go to
`OPEN-QUESTIONS.md`, build + commit per finished task, this section updated after
each commit so the tree stays in a good state if interrupted.

**Done:**
- A0 (`34b2e83`, added to the brief mid-run): fixed `.hero-grid`'s
  `height`→`min-height` (Phase 1b) leaving the hero image free to inflate the
  band on a portrait photo (Über uns: 1176px instead of 520px). `.hero-image
  img` is now taken out of flow (`position: absolute; inset: 0`); the
  container gets its own `aspect-ratio` below 900px, explicitly unset back to
  `auto` at ≥900px (aspect-ratio itself turned out to count as "definite" for
  the grid's auto row-sizing the same way a percentage height had, just
  uniformly instead of Über-uns-only — caught by re-measuring before
  committing). Verified at 390px/1440px on every hero page via a local
  playwright script.
- A1 (`7444f73`): `.icon-list-check .icon` background #309898→#48b0b0 (teal);
  `--color-text-muted` #32373c→#181a2b (leaked WordPress gray, not a real tone).
- A2 (`dab71fb`): redrew `book`/`scroll` (was `document`) icons, thickened
  every glyph's stroke and enlarged the check/meeting-detail circle so the
  glyph doesn't overflow. Verified with a local playwright screenshot.
- A3 (`dce80b6`): Workshops list markers are now small sage `<Icon>`s
  (book/scroll matching the section tile), not plain dots.
- A4 (`456ede2`): new shared `ImagePlaceholder.astro` — muted fruit-icon
  signet + "Foto folgt" on a sage panel, replacing grey diagonal stripes.
  Used by Über uns's closing teasers today; B2.2 will reuse it at new
  dimensions. Gestalterische Freiheit genutzt (see commit message for why).

- A5 (`bc5597e`): footer wave divider redrawn as an irregular, tapering
  brushstroke path instead of a regular scallop wave. Gestalterische
  Freiheit genutzt.

- A6 (`5d54040`): shared `.reveal` scroll-fade mechanism, progressive
  enhancement (visible by default; JS-only, reduced-motion-aware). Built
  for B2.1 to apply to Über uns's qualification band.

**Teil A complete.**
- B1 (`ee82d0b`): homepage — 'abonieren' typo, founder CTA button color,
  blog-teaser overlapping white card, services lede downgraded to <p>,
  blog category order. Aria-labels on image-only links were already fixed
  in a prior run.

- B2.1 (`395e7f7`): Über uns qualification block rebuilt as three
  full-bleed alternating teal/#309898 bands + granatapfel illustration,
  with A6's .reveal fade-in. Removed the duplicate 90x90 badge.
- B2.2 (`751642b`): Über uns closing teasers to FEEDBACK #1's measured
  proportions (1200px block, 420fr/680fr columns, per-photo aspect ratios,
  card = 75%/77% of photo width anchored bottom:-130px, left photo +30px).
- B2.3 (`939be74`): Über uns's ClosingCta instance opts into 48px heading /
  336x390 portrait via new ClosingCta props (default unaffected elsewhere).

- B3 (`97c1122`): Angebote — ClosingCta's new `layout='pair'` renders two
  equal same-size images side by side (live's actual composition) instead
  of the usual overlap; response card is sticky (>=900px) while scrolling
  the statement list.

- B4 (`fc33fdf`): Beratung's 'Gut zu wissen' is now a collapsed accordion
  (new shared `.accordion-item`/`.icon-circle-sm` pattern in global.css,
  reusable for FAQs/B8) with a centered eyebrow instead of a dark h2;
  format cards are equal-height with badges anchored to the bottom.

- B5 (`534db28`): Workshops cards equal-height, location pill anchored to
  bottom (same mechanism as B4). Icons were already done in Teil A.

- B6 (`360edbb`): Selbsthilfegruppe — added the missing 40px "Nächstes
  SHG-Treffen" heading above "AKTUELLES", Steiermark logo to 368x177
  right-aligned, companion text to 20px.

- B7 (`0a22bc3`): Kontakt — icon eyebrows (clock/pin, .icon-circle reused)
  for Erreichbarkeit/Standorte, submit button "Senden".

- B8 (`85e6cff`): FAQs grouped into their three live categories (mapping
  fetched from the live DOM's fusion-faq-post-<id>/category classes, keyed
  against this repo's existing #collapse-1-<id> anchors), accordion
  restyled with the shared B4 pieces (red circle, 24px icon/heading).

- B9 (`7c13739`): blog articles gained the missing author/newsletter block
  (text fetched from a live article page's own rendered DOM) and a
  'Verwandte Beiträge' section derived from shared categories; in-article
  ## subheadings now render uppercase via :global().

**Teil B complete. Not started yet:** Teil C, Teil D. See
`docs/NACHTLAUF-2026-09-08.md` for the full task list and target values.

**Session note:** `playwright@1.63.0` is installed locally via
`npm install --no-save` for this run's own visual QA (screenshots), same as
a previous session — not in `package.json`/lock, reuses the chromium binary
already cached under `%LOCALAPPDATA%\ms-playwright`. A throwaway
`scratch-shot.mjs` (git-ignored via `.git/info/exclude`, not tracked) takes
clipped screenshots for checking icon/layout detail without a full-page
image. Safe to `npm install` again next session if `node_modules/playwright`
is gone.

## What's built

All 14 pages (homepage + 12 standalone pages + blog) render from their real content
collection entries (`src/content/pages/de/`, `src/content/blog/de/`, `src/content/site/`)
via `parseMarkdownBlocks.ts` + `BlockTracker` (see `DESIGN-SYSTEM.md`'s "Page
composition" section for how and why). `src/content/` is the site's live, editable
copy; `docs/source-archive/` is a frozen, never-touched verbatim record of the
original extraction.

The full run recorded in `docs/RUN-2026-09-07.md`/`docs/FIXES-2026-09-07.md` is
**complete** (see `docs/decisions.md`'s "Run 2026-09-07" entry for the phase-by-phase
record with commit hashes). Since then: the Angebote nav dropdown works with a
mouse; Beratung/Workshops/Angebote/Selbsthilfegruppe all have their real
eyebrow/card/icon treatment instead of oversized headings and plain lists;
Angebote's ten-statement self-recognition selector is a real, working,
JavaScript-free interaction; Selbsthilfegruppe has its principle labels, meeting
card, and the Selbsthilfe Steiermark partner band; every subpage that has a hero
image on the live site has one here too (default pomegranate + per-page override,
`PageHero.astro`); the blog listing shows date/description/byline in the live
site's actual single-column layout; EN/IT are `noindex`ed and out of the sitemap
until reviewed; and the build now blocks on missing alt text and on any collection
schema field nothing renders.

## Verified working

- `npm run build` (`astro build && node scripts/build-check.mjs`) and `npx astro
  check` are both clean. Three checks are now BLOCKING (source headings, image alt
  text, schema fields all rendered/allow-listed) — see `scripts/build-check.mjs`
  for these plus the remaining non-blocking checks and what each one catches.
- `npm run dev` and `npm run build && npm run preview` both start cleanly on the
  default port 4321.
- A playwright Chromium install was fetched via `npx --yes playwright@1.63.0` for
  this run's own verification (pointer/keyboard/touch interaction tests,
  screenshots) — not added to `package.json`; the browser binary is cached under
  `%LOCALAPPDATA%\ms-playwright` if a future session wants to reuse it rather than
  re-downloading.
- Termine's Microsoft Bookings iframe refuses to load under `localhost` in dev
  (`frame-ancestors` CSP from Microsoft's own side, not this site's) — expected for
  a non-whitelisted/placeholder domain; re-check once real hosting is live.

## Known gaps — not fixed, not this run's call

See `OPEN-QUESTIONS.md` for the full list with options and recommendations. The ones
that matter most:

- **EN/IT must not be published until the owner reads them line by line** (#7b) —
  the English homepage was found to drop the required training-status disclosure
  entirely. `noindex` + sitemap exclusion are in place as a stopgap.
- **Datenschutzerklärung needs the owner's sign-off** (#3) — a legal document, not a
  code decision, and needs a re-check at launch against whatever the site actually
  loads by then.
- **Termine's direct calendar embed costs a cookie banner** (#0c) — owner decision,
  implemented as asked; the consent-banner trade-off is hers to make, not decided
  here.
- **The ochre/amber hero decoration** (#0b) and **Selbsthilfe Steiermark logo
  permission** (#0) — two small items genuinely blocked on information this run
  doesn't have (a closer screenshot / the live theme's compiled CSS; the partner
  org's sign-off).
- **Kontakt's form has no submission endpoint yet** (#4) — Microsoft Forms is the
  decided approach, but no actual form exists yet to point it at.
- **`astro.config.mjs`'s domain is a placeholder** (#6) — blocked on the hosting
  decision (see `external-review.md`'s "DECISIONS PENDING" section).
- **Mobile rendering** was spot-checked this run (touch-emulated 390px contexts on
  the nav, Angebote's selector, and several full pages) but not exhaustively across
  every page — worth a pass on a real device before launch.
- Ten pages ship no meta description (#1), Kontakt's Anliegen dropdown needs a
  fifth option's wording (#4), Termine's title could be better (#8) — all listed in
  `OPEN-QUESTIONS.md`, none urgent.

## Next step

**`docs/RUN-2026-09-07-B1.md` is complete (Phase 0 + Phase 1).** Authority for every
value was `docs/VERGLEICH-2026-09-07.md`. Commits, in order: `1fd8cca` (0.1 — EN/IT
dead links, blocking `internal-links-resolve`), `0f46903` (0.2 — aria-label on blog
image-only links, blocking `link-accessible-name`), `31fde39` (0.3 — EN/IT footer
links to German legal pages), `183a68a` (1.1 — type scale: base 20px, h3 28px,
founder h2 36px, blog-teaser h3 26px), `73ef0ab` (1.2 — eyebrow 18px/400/no
letter-spacing), `ec2966f` (1.3 — buttons solid/17px/4px-radius/upright),
`038cf74` (1.4 — hero band on `--color-bg-alt`), `d7bdfc9` (DESIGN-SYSTEM.md
brought back in sync).

**`docs/RUN-2026-09-07-B2.md` Phase 1b is complete** (the three follow-ups from
`docs/PRUEFUNG-B1.md`, measured against the live dev server after B1). **Phase 1c,
Phase 2, Phase 3, Phase 4 were explicitly out of scope for this pass and were not
started.**

- 1b.1 (`6cc2f84`): `ServiceCard`'s `.card-button` (stale 12px/italic, missed by the
  B1 button rework) dissolved into the shared `.button.button-outline`.
- 1b.2 (`4b8f457`): h2 32px→28px, now sharing h3's clamp — `VERGLEICH-2026-09-07.md`
  A1's table only named H3, an omission in the table, not the B1 implementation.
- 1b.3 (`d1b389d`): `.hero-grid` `height`→`min-height` — measured zero overflow on
  any hero page at 1024–1920px per `PRUEFUNG-B1.md`; fixed structurally anyway.

**Flag for the next session, not acted on:** `OPEN-QUESTIONS.md` and
`docs/fuer-marina.md` were modified on disk outside git (uncommitted, pre-dating this
session) between the B1 and B2 passes — most of it is genuine new content (Marina's
8.9.2026 answers, items #21–24), but item #7 was also reverted from B1's "RESOLVED,
corrected" text back to "NICHT ERLEDIGT," and B1's #17 (the `.hero-grid` height flag
this pass just closed in code) is gone from the file entirely. The dead-link fix
itself is still intact in the actual source (`src/content/site/en.json`/`it.json`,
verified via `git diff`) — only the doc's description of #7 is now stale. Left
as-is per instruction (don't revert someone else's on-disk edit); worth a look.
