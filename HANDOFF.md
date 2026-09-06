# Handoff — Phase 2 re-parse session (IN PROGRESS, updated after every commit)

## Done and committed this session

- **Task 0 (clean tree):** working tree was already clean at session start — nothing
  needed committing.
- **Task 1 (isolate the h1 weight decision) — commit `0236d22`:** the previous
  `HANDOFF.md`/`DESIGN-SYSTEM.md` claimed every masthead h1 already ran through the
  `.heading-black` utility (`--weight-heading` token). That claim was **false** —
  grepping every `<h1>` in `src/` found four pages rendering a bare `<h1>` with no
  class: `404.astro`, `datenschutz.astro`, `impressum.astro`, and
  `blog/[...slug].astro` (the post-title h1). Fixed by adding `class="heading-black"`
  to each. Verified with `npm run build` (23 pages built, no errors) before
  committing. **Now true:** every masthead h1 site-wide takes its weight from
  `--weight-heading`; flipping 900 → 400 in `global.css` is genuinely a one-value
  change, nothing else to touch.
- **`OPEN-QUESTIONS.md` created — same commit:** carries forward the H1/H2 weight
  decision from this file's earlier "Open" section, plus new items below.
- **`pages` content collection + Über uns re-parsed — commit `8a9a567`:** added the
  collection to `src/content.config.ts` (same de/en/it convention as blog/events).
  `src/content/pages/de/ueber-uns.md` is the real, complete extraction from
  `https://www.persephone.at/ueber-uns/` — the old `src/pages/ueber-uns.astro` content
  was missing an entire narrative section and one credential-list item each in
  "Ausbildung"/"Felderfahrung". Both real images downloaded into
  `src/assets/pages/ueber-uns/` (no hotlinking). Two dead CTA links found on the live
  page, logged as Open Question #7 instead of silently fixed or reproduced.
  `src/pages/ueber-uns.astro` itself has **not been touched yet** — it still renders
  the old inline content; nothing consumes the new collection yet. Verified with
  `npm run build` + `npx astro check` (0 errors each).

## Phase 2 (content re-parse) — status: extraction in progress, NOT yet in the repo

Nothing from Phase 2 has been committed yet. What exists so far is scratch work only,
outside the repo (in the session's temp scratchpad, not persisted):

- Downloaded raw HTML for every real page on persephone.at (via `curl`, not a browser —
  see tooling note below) into a scratch dir: homepage, ueber-uns, angebote-2, beratung,
  workshops, selbsthilfegruppe, kontakt, termine, faqs, disclaimer, impressum,
  datenschutzerklaerung, blog index, and all 6 blog posts.
- Built and validated a small dependency-free Node script
  (`html2md.mjs` in the session scratchpad) that walks a page's `.post-content` block
  and emits structured blocks (heading/paragraph/list/quote/cta/image) plus a
  deduplicated image list — tuned for this site's Avada/Fusion-Builder markup, since a
  real DOM/HTML-parsing library would be a new dependency. Spot-checked thoroughly
  against `ueber-uns` only so far: correctly extracted 27 blocks including a 4-item
  "Ausbildung" list and 4-item "Felderfahrung" list that are each **more complete**
  than what's currently in `src/pages/ueber-uns.astro` (which has only 3 items each) —
  confirms the existing subpage content is the "poor" old parse and genuinely needs
  replacing, not just reformatting.
- Confirmed real site page list (from actual `<a href>`s on the homepage + blog index,
  not guessed): the 12 non-blog pages listed above are ALL real, plus 6 real blog posts.
  One existing local page, `newsletter.astro`, has **no real source** — see Open
  Questions #2.
- Collected `<title>`/meta-description findings for every page (see Open Questions
  #3–#5 for the gaps/oddities found).

### Exact next step to resume

1. Re-run/re-verify the scratch extraction (raw HTML + `html2md.mjs` output) — it was
   not persisted anywhere durable, so if this session ended, redo the `curl` downloads
   (URLs are all listed in `docs/content-inventory.md` once that's written, or see the
   page list above) and re-run the extractor per page.
2. Add a `pages` collection to `src/content.config.ts` (schema: `title`, `description`
   meta fields, `sourceUrl`, body = markdown mirroring the extracted heading/paragraph/
   list/quote/cta structure).
3. Write one `.md` file per page under `src/content/pages/de/<slug>.md` from the
   extractor's output, downloading every real (non-decorative, non-data-URI) image
   into `src/assets/pages/<slug>/` with its alt/title text preserved in frontmatter or
   inline markdown image syntax.
4. Replace the 6 blog posts' placeholder bodies
   (currently literally `_Platzhalter-Eintrag: Der vollständige Originaltext dieses
   Artikels von persephone.at muss noch übertragen werden._`) with the real extracted
   article text the same way.
5. Write `docs/content-inventory.md` (page, source URL, word count, image count,
   extraction issues) and commit Phase 2 in small chunks (e.g. one commit for the
   content-collection schema + ueber-uns, one for the rest of the standalone pages,
   one for blog posts, one for the inventory doc) — not one giant commit.
6. Only then start Task 3 (build the Über uns page from the new collection).

### Tooling gap found this session

No browser-automation tool (Playwright/Puppeteer/etc.) is available in this
environment and none is an existing dependency — adding one would violate the "no new
dependencies" rule. `msedge.exe` is present system-wide
(`C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`) and can be driven
headless via CLI flags (`--headless --disable-gpu --screenshot=... --window-size=W,H`)
for the Task 3 pixel-comparison screenshots — this was found but not yet tried
end-to-end. If it doesn't work reliably, that itself is an open question for
Task 3, not something to fake.

## Open — waiting on you

See `OPEN-QUESTIONS.md` for the full list with options and recommendations. Summary:

1. H1/H2 weight, 900 vs 400 (carried over; 900 stays until you compare against the
   brand book — now genuinely a one-value revert either way).
2. The live "Newsletter" page/nav-link is a 301 redirect to an external MailerLite
   form — no real page content exists to extract, so the local `newsletter.astro`'s
   copy was invented in an earlier session. Recommend redirecting to match the live
   site until you decide otherwise.
3. Several live pages ship no meta description at all (ueber-uns, angebote-2, beratung,
   workshops, selbsthilfegruppe, kontakt, termine, disclaimer). Recommend shipping
   empty rather than inventing SEO copy.
4. The live homepage ships two conflicting meta-description tags (real one + an
   unremoved Avada demo default) — a live-site bug, not something to replicate.
5. The live Impressum page's meta description is a mangled, space-less auto-excerpt.
   Recommend writing a clean one once you've reviewed it.
6. FYI only, not a decision: a few Über-uns list items carry a leftover
   `font-claude-response-body` CSS class in the live HTML — harmless, just a sign that
   text was once pasted in from a Claude.ai chat.

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
