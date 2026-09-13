# Handoff — current state

Read this first at the start of every session. History and past decisions moved to
`docs/decisions.md` (2026-09-07) so this file stays short enough to actually read —
see `external-review.md`'s "PROCESS NOTE" for why that matters.

## Most recent: 2026-09-13, night run toward launch — ACTIVE BUG, read "Next step" first

The owner decided to go live "tomorrow" and asked for a night run to get everything
ready. Full reasoning for every decision below is in `docs/decisions.md`'s four
matching entries ("Night run toward launch", "Kontakt form implemented", "Hosting
decision", the Datenschutzbeauftragter-briefing rework, and the CMS-prep entry) —
this section is the short version. `docs/LAUNCH-TAG-RUNBOOK.md` is the ordered,
attended-by-a-human checklist for the actual cutover day; don't duplicate it here.

**What got built and deployed:**
- **Hosting decided and live**: easyname (small Webhosting package, prepaid to May
  2028; domain moved there too). The owner's household had already bought it before
  a same-day Hetzner analysis finished — real purchase won over recommendation.
- **Kontakt form rebuilt in-house** (`public/kontakt-senden.php`) — Microsoft Forms
  turned out unable to accept an external `<form>` POST at all; web3forms was
  considered and dropped for processing on US servers. The PHP script sends
  straight to marinabletsas@persephone.at, no third party, no database.
- **Kennenlernen's Bookings calendar switched to click-to-load** — removes the need
  for a site-wide cookie banner (`src/pages/kennenlernen.astro`).
- **Datenschutzerklärung corrected** against the actual code (`src/pages/datenschutz.astro`)
  — new Hosting section, corrected Kontakt/Cookies sections, Matomo and Kommentare
  marked "planned, not active" rather than deleted or left wrong. **Not Marina's
  sign-off, not the DSB's review yet** — see `docs/DATENSCHUTZBEAUFTRAGTER-BRIEFING.md`,
  reworked the same night, which flags the Kommentare-section wording as a real,
  deliberately unresolved tension (it was kept on the owner's explicit instruction
  despite matching the exact pattern Marina's own fuer-marina.md #12 argued against).
- **Redirects verified and expanded** (`public/.htaccess`) against the live site's
  actual sitemap.xml — caught and fixed a wrong blog slug in the old list
  (`ist-unfruchtbarkeit-immer-noch-frauensache-2`, missing its "-2").
- **Deploy pipeline built and proven**: `.github/workflows/deploy.yml` builds and
  FTPS-uploads to easyname, deliberately targeting `neu.persephone.at`'s folder
  (`apps/wordpress-180662/`) rather than the account root — **the live WordPress
  site shares this same easyname account**, one level up
  (`apps/wordpress-124063/`), and must never be touched by this workflow. A real
  deploy succeeded (GitHub Actions run #2) after fixing an unrelated YAML syntax
  error (an unquoted colon in the workflow's own `name:` field).
- **CMS editor prepared but not deployed**: `public/admin/config.yml` switched from
  Netlify Identity/`git-gateway` (never viable on easyname) to a GitHub backend, all
  six previously-missing `site` schema sections added, and a real (untested) OAuth
  broker written (`cms-oauth-worker/`). Needs the owner's own Cloudflare + GitHub
  OAuth App to actually go live — steps in `cms-oauth-worker/README.md`. Treat as
  separate from launch, not urgent.

**Active bug, found by the owner testing the live form, not yet fixed in what's
deployed:** a real contact-form submission landed in Marina's spam folder. A likely
cause was found and fixed in the code (`kontakt-senden.php`'s `mail()` call had no
envelope-sender override, which can fail DMARC's strict SPF alignment —
`persephone.at`'s DNS has `aspf=s`) — **but that fix (commit `d0bf770`) was not yet
pushed to GitHub when the failing test happened**, so it has never actually been
tried. See "Next step" below; this is priority zero for the next session.

## Previous: 2026-09-12, PageHero title alignment (FAQs/Disclaimer/Impressum/Datenschutz)

An initial pass wrongly swapped Disclaimer/Impressum/Datenschutz's big red `PageHero` title
for a small eyebrow-style one — corrected within the hour: **all four pages keep the big
red `PageHero` title** (Datenschutz's twelve numbered `<h2>`s are the one thing that *does*
stay small/eyebrow-styled). The real, correctly-scoped fix: `PageHero.astro`'s own
`.page-hero-inner` was capped at 768px against these pages' 1200px-wide (A1) body text
below it — a short title's own narrower centered box read as optically centered even
though `text-align` was always `start`. Fixed once, centrally, at 1200px. Also found and
fixed a real (previously invisible) bug this surfaced: Disclaimer's own nowrap/font-size
title override had a floor that didn't actually fit at 390px — measured and lowered.
See `OPEN-QUESTIONS.md` #41/#45 and `docs/decisions.md`'s 2026-09-12 entry.

## Previous run: NACHTRAG-2026-09-11 (`docs/NACHTRAG-2026-09-11.md` N1–N4) + live follow-ups

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

**The live-correction cascade kept going after that** — `OPEN-QUESTIONS.md` #38–44, full
record in `docs/decisions.md`'s second entry for this session ("Live-correction cascade").
Short version: `.button-primary`'s gradient is back at rest (hover untouched);
`ServiceCard`'s orange seed-texture decoration is gone; `CtaBand`'s heading→text gap is 0;
Disclaimer's title is genuinely left-aligned now (was optically centered — `PageHero`'s
shared 768px inner cap vs. the body's A1-widened 1200px); Datenschutz's big red
`PageHero` banner is gone, replaced with a small eyebrow label matching the live page (no
`PageHero` at all there); Kontakt's name→"Standorte" gap is wider; and the qualification
bands got a lighter fill, a **real bug fix** (Felderfahrung's text column was narrower than
the other two — `order: 2` was swapping grid tracks, not just paint order; now
`grid-template-areas`), bigger list text, and Über uns's section-background alternation
actually alternates now (three beige sections had been stacked in a row). A pre-existing,
unrelated 390px overflow on Disclaimer was found (not caused) while checking this — see
`OPEN-QUESTIONS.md` #41, unfixed, logged for later.

Full record: `docs/decisions.md`'s two "2026-09-11" entries.

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

See `OPEN-QUESTIONS.md` for the full list with options and recommendations.
**Resolved since the list below was last written, no longer open:** the hosting
placeholder in `astro.config.mjs` (#6, now `persephone.at`); Kontakt's missing
submission endpoint (#4, #25 — now the in-house PHP script, see tonight's entry
above); the cookie-banner cost of the Bookings embed (#0c — now click-to-load,
banner no longer needed, pending confirmation it's legally sufficient, see the DSB
briefing). The ones that still matter:

- **Datenschutzerklärung needs the owner's *and* the DSB's sign-off** (#3) — a
  corrected draft exists now (see tonight's entry above) but is not reviewed or
  approved. `docs/DATENSCHUTZBEAUFTRAGTER-BRIEFING.md` lists the specific open legal
  questions, top one being the Kommentare-section wording tension.
- **EN/IT must not be published until the owner reads them line by line** (#7b) —
  unchanged, still gating on the training-status disclosure fix.
- **Kontakt's Anliegen options**: now three (`frage`/`kooperation`/`sonstiges`) —
  the phone field was also dropped. Matches what's actually built; the older
  three-vs-four conflict (#26) is moot now that the field set changed again.
- **Kontakt's "Termin buchen"** (#27) still links to `/kennenlernen/` rather than
  an overlay — unchanged, still the safer default not a final call.
- **Two proposed color values need Marina's sign-off** (#28) — unchanged.
- **Mobile rendering (390px)** — unchanged from the note below; **additionally,
  nobody has clicked through the actual deployed site on a real phone yet** (see
  `docs/LAUNCH-TAG-RUNBOOK.md` point 2).
- **CMS editor** is prepared in code but not deployed (see tonight's entry above,
  `cms-oauth-worker/README.md`) — separate from launch, not urgent.
- Two of the ten meta descriptions still carry a wording question (fuer-marina.md
  Frage 16); **redirects are no longer blocked on hosting** — implemented and
  expanded in `public/.htaccess`, see tonight's entry above.
- **B10 Punkt 28 ("Gut zu wissen" styling) could not be confirmed** (#30) — unchanged.

## Next step

**Priority zero, before anything else:** two commits from last night
(`d0bf770` — the mail() envelope-sender fix — and `26df2bd` — CMS prep) are sitting
local-only, never pushed. Push them, wait for the deploy workflow to finish, then
have someone submit the Kontakt form on the real site again and check whether it
still lands in spam. If it does, the envelope-sender fix wasn't sufficient — look at
whether easyname offers DKIM-signing for outbound mail (a hosting-level setting, not
a code fix) and whether the SPF record has had time to fully propagate. Don't assume
the fix worked without an actual retest — it was never tried before context cleared.

After that's confirmed, work through `docs/LAUNCH-TAG-RUNBOOK.md` top to bottom —
it's the single ordered checklist for the rest of launch day, consolidated from
`docs/START-CHECKLISTE.md` Teil 2 and everything found last night. Everything on it
needs the owner's (or Marina's, or the DSB's) attention, not more unattended code
work — see that file's own closing line.

Older backlog, still valid but lower priority than the above: `OPEN-QUESTIONS.md`
#34–37 (live-correction-cascade reversals needing an explicit yes) and #25–33
(waiting on Marina/Claudio from earlier runs). `docs/NACHTLAUF-2026-09-09.md`'s Teil F
(repo hygiene — `Claude outputs/` and other untracked docs sitting in the working
tree) is also still open.
