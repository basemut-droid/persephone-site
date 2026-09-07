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
original extraction. The ten owner decisions from `fuer-marina.md` are all applied
(see `docs/decisions.md` for the full list). The header nav, Über uns's closing
teasers, Termine's booking embed, and the language switcher all match the live
site's actual behavior/design now — see `docs/decisions.md`'s Phase 4 entry.

## Verified working

- `npm run build` (`astro build && node scripts/build-check.mjs`) and `npx astro check`
  are both clean. The build fails if a source heading goes missing from its built
  page (`scripts/build-check.mjs`, blocking) — see that file for the other seven
  non-blocking checks and what they catch.
- `npm run dev` and `npm run build && npm run preview` both start cleanly on the
  default port 4321 (verified 2026-09-07, nothing else was left running).
- Disclaimer's text and the "i.A.u.S."/"Ausbildung unter Supervision" occurrences on
  Über uns/Beratung are confirmed word-for-word/count-for-count against the live
  site (external-review.md's legal-weight check, 3c).
- Full-page 1920px screenshots of every page are in `docs/screenshots/2026-09-07/`,
  with a README describing what changed on each; `-before.png` for the five
  most-changed pages lets you compare directly.

## Known gaps — not fixed, not this run's call

See `OPEN-QUESTIONS.md` for the full list with options and recommendations. The ones
that matter most:

- **Datenschutzerklärung needs the owner's sign-off** (#9) — a legal document, not a
  code decision, and needs a re-check at launch against whatever the site actually
  loads by then.
- **Kontakt's form has no submission endpoint yet** (#11) — Microsoft Forms is the
  decided approach, but no actual form exists yet to point it at.
- **EN/IT homepage's own nav links to 66 subpages that don't exist** (#15) — found
  this run while fixing the language switcher; a bigger call than that fix was
  (changes what EN/IT visitors see), left for the owner.
- **`astro.config.mjs`'s domain is a placeholder** (#14) — blocked on the hosting
  decision (see `external-review.md`'s "DECISIONS PENDING" section).
- **Mobile rendering is unverified sitewide** — this environment's headless browser
  can't produce a trustworthy narrow-viewport screenshot; needs a real device or a
  manually resized real browser window before launch.
- Ten pages ship no meta description (#3), Kontakt's Anliegen dropdown needs a fifth
  option's wording (#11), Termine's title could be better (#16), and a few smaller
  items — all listed in `OPEN-QUESTIONS.md`, none urgent.

## Next step — mid-run, 2026-09-07

Working through `docs/RUN-2026-09-07.md` (order-of-operations for
`docs/FIXES-2026-09-07.md`, today's authority — supersedes older notes where they
disagree). **Phase A done and committed** (`c947478`): the Angebote dropdown's dead
hover gap, missing close delay, and an Escape/`:focus-within` conflict are fixed in
`Header.astro`, verified with a real Chromium session (pointer path, keyboard,
touch-emulated 390px — see that commit message for specifics).

**Next: Phase B** — build the shared pieces (eyebrow pattern, icon set, badge/pill
component) before touching Beratung/Workshops/Selbsthilfegruppe/Angebote, so they're
built once and reused, not rebuilt three times. Then Phase C (closing-CTA component),
D (the pages), E (hero images), F (the rest). Full order and rules in
`docs/RUN-2026-09-07.md`; findings in `docs/FIXES-2026-09-07.md`.

If cut off mid-run: check `git log` for the last commit's phase/task label, then
resume at the next uncommitted task in `docs/RUN-2026-09-07.md`'s order. Nothing here
should be half-applied — every commit in this run is preceded by a clean build.
