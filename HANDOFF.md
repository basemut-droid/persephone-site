# Handoff — structure-fix + remaining-pages session (IN PROGRESS)

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
