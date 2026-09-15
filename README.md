# Persephone — Website Rebuild

Astro rebuild of [persephone.at](https://persephone.at/) (currently WordPress + the Avada
theme), for Marina Bletsas's psychotherapy/coaching practice. All 14 pages (homepage + 12
standalone pages + blog) are built and content-complete, with a working CMS editor and a
deploy pipeline to the real host (easyname) — this is a pre-launch site, not an early
prototype. **Read [HANDOFF.md](HANDOFF.md) first** for exactly what's done, what's still
open, and what to do next — this file only covers what the codebase *is*, not its current
state.

## Documentation map

This project keeps a deliberately layered set of docs — each has one job, don't duplicate
between them:

- **[CLAUDE.md](CLAUDE.md)** — standing rules for working in this repo (stack, the
  content/archive split, "reuse before you build," never one-off CSS).
- **[HANDOFF.md](HANDOFF.md)** — current state only: what's done, what's open, what's
  next. Read this at the start of every session.
- **[docs/decisions.md](docs/decisions.md)** — the full append-only history: every past
  session's reasoning, in detail, newest first.
- **[OPEN-QUESTIONS.md](OPEN-QUESTIONS.md)** — every item still waiting on the owner,
  Marina, or Claudio, with options and a recommendation.
- **[DESIGN-SYSTEM.md](DESIGN-SYSTEM.md)** — the design tokens, components, and layout
  specs, kept fact-checked against the actual code in `src/styles/global.css` and
  `src/components/`.
- **[docs/LAUNCH-TAG-RUNBOOK.md](docs/LAUNCH-TAG-RUNBOOK.md)** — the ordered, attended
  checklist for the actual cutover day.

## Stack

- **Astro 7**, static output, deployed via GitHub Actions → FTPS → easyname.
- **DM Sans** — the only font, self-hosted via `@fontsource` (no external font requests).
- **i18n**: `de` (default, unprefixed) / `en` / `it` — only the homepage is translated so
  far, and EN/IT stay `noindex`ed until the owner reads them line by line (see
  `HANDOFF.md`).
- **Content collections** (`src/content.config.ts`): `pages` (one flowing markdown body
  per standalone page — deliberately unstructured, since different pages need very
  different components, see `DESIGN-SYSTEM.md`'s "Page composition" section), `blog`,
  `site` (nav/footer/homepage text), and `events` (schema exists, not used yet — no real
  event content, a phase-2 placeholder).
- **Decap CMS** (`public/admin/`) — GitHub-backed, via a self-hosted PHP OAuth broker
  (`public/cms-auth.php`/`cms-callback.php`, not a third-party service). Built and tested
  end-to-end; see `HANDOFF.md` for what's still needed before Marina can use it herself.

## Project structure

```
src/
  content.config.ts        # pages, blog, events, site collection schemas
  content/
    pages/de/*.md           # one markdown body per standalone page (see BlockTracker below)
    site/{de,en,it}.json    # nav/footer/homepage text, per locale
    blog/{de,en,it}/*.md    # blog posts
    events/{de,en,it}/      # schema-only, unused so far
  lib/parseMarkdownBlocks.ts # splits a page's markdown body into blocks; BlockTracker
                              # asserts every block is rendered or explicitly excluded
  i18n/utils.ts              # locale helpers, language-switcher path logic
  layouts/BaseLayout.astro   # head/meta/OG/hreflang/schema.org, header+footer shell
  components/                # Header, Footer, PageHero, ServiceCard, ClosingCta, etc.
                              # — see DESIGN-SYSTEM.md's Component inventory
  pages/
    index.astro, en/index.astro, it/index.astro
    angebote.astro, beratung.astro, workshops.astro, selbsthilfegruppe.astro,
    ueber-uns.astro, kontakt.astro, kennenlernen.astro, faqs.astro, disclaimer.astro,
    impressum.astro, datenschutz.astro, blog/, 404.astro
  styles/global.css          # every design token + shared layout class (see the warning
                              # in DESIGN-SYSTEM.md about why this must stay global, never
                              # scoped inside one component)
public/
  admin/                     # Decap CMS config
  cms-auth.php, cms-callback.php   # the OAuth broker (see docs/CMS-BROKER-SETUP.md)
  kontakt-senden.php         # Kontakt form's own backend — in-house, no third party
  cms-secrets.local.php      # gitignored, never committed — uploaded by hand via FTP
  robots.txt                 # explicitly allows AI/LLM crawlers (GPTBot, ClaudeBot, etc.)
```

## Commands

| Command | Action |
| --- | --- |
| `npm run dev` | Local dev server at `localhost:4321` |
| `npm run build` | Production build to `./dist/`, then `scripts/build-check.mjs` — blocks on missing alt text, unrendered schema fields, broken internal links, unlabeled links, and missing meta descriptions |
| `npm run preview` | Preview the production build locally |

Per `CLAUDE.md`: start the dev server with `astro dev --background`, manage it with
`astro dev stop`/`status`/`logs`, rather than a plain foreground `npm run dev`.

## Editing text through the CMS

Once the CMS is fully rolled out (see `HANDOFF.md` for what's still open — an easyname
firewall exception and Marina's own GitHub access), she'll edit most pages' text and
images through `/admin/`, a real web form — no code, no git, no terminal. Two pages
(`angebote.md`'s `recognitionPanel`, `beratung.md`'s `formatBadges`) aren't editable this
way yet — their content has a shape no Decap widget represents cleanly without real
follow-up work.
