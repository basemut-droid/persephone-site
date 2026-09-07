# Handoff — current state

Read this first at the start of every session. History and past decisions moved to
`docs/decisions.md` (2026-09-07) so this file stays short enough to actually read —
see `external-review.md`'s "PROCESS NOTE" for why that matters.

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

**Stop point, per the run's own instruction: Phase 2 (`docs/RUN-2026-09-07-B2.md`)
is not authorized yet — do not start it without the owner's sign-off on this run.**

**Flagged, not fixed, during Phase 1.1** (see `OPEN-QUESTIONS.md` #17): `.hero-grid`'s
fixed 520px desktop height, shared by the homepage hero and every subpage's `PageHero`
image variant, is now close to its ceiling with the intro paragraph at 20px — a
subpage with a longer intro than the homepage's could overflow it. Not checked in a
real browser this run (budget) and not changed (out of this run's scope).
