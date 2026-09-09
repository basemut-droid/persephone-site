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
`%LOCALAPPDATA%\ms-playwright`. Safe to reinstall next session if
`node_modules/playwright` is gone; a throwaway `scratch-*.mjs` pattern
(git-ignored via `.git/info/exclude`) is the convention for one-off screenshot/
measurement scripts — see recent commit messages for examples.

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
- **Kontakt's form has no submission endpoint yet** (#4) — Microsoft Forms is the
  decided approach, but no actual form exists yet to point it at.
- **`astro.config.mjs`'s domain is a placeholder** (#6) — blocked on the hosting
  decision.
- **Mobile rendering** has been spot-checked repeatedly (390px contexts on the nav,
  Angebote's selector, hero bands, Über uns's bands/teasers, FAQs) but not
  exhaustively across every page — worth a pass on a real device before launch.
- Two of the ten meta descriptions carry a wording question back to the owner
  ("psychodukativ", "(i.A.u.S)" without a period — fuer-marina.md Frage 16);
  Kontakt's Anliegen dropdown stays as-is (owner decided 2026-09-08, no fifth
  option); 301 redirects for the domain switch are blocked on hosting (#15) but
  now include `/termine/`→`/kennenlernen/` (`docs/START-CHECKLISTE.md` Teil 3).

## Next step

Nothing queued. `docs/NACHTLAUF-2026-09-08.md` and `docs/NACHTLAUF-2026-09-09.md`
are both fully worked through (see `docs/decisions.md`'s matching entries for the
phase-by-phase record). `docs/NACHTLAUF-2026-09-09.md`'s Teil F (repo hygiene —
stray uncommitted files Claudio noticed in VS Code) was explicitly out of scope
for that run and is still open, waiting on a decision about what to do with
`Claude outputs/` and the other untracked docs sitting in the working tree.
Otherwise pick up from `OPEN-QUESTIONS.md` for what's still waiting on the
owner, or from a fresh screenshot comparison against live if more polish is
wanted.
