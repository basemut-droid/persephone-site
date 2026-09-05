# Persephone — Website Rebuild

Astro rebuild of [persephone.at](https://persephone.at/) (currently WordPress + the Avada
theme). Phase 1: reproduce the homepage 1:1 visually, cleaner technically, with the
DE/EN/IT and blog/events infrastructure already in place for phase 2.

## Status (Phase 1)

- ✅ Homepage rebuilt for `de` (default), `en`, `it` — content in
  `src/content/site/*.json`. **`de.json` is the real, verbatim copy from the live site.
  `en.json` and `it.json` are AI-drafted translations, flagged `"reviewStatus": "ai-draft"`
  and shown with a banner on the page — have a native speaker check these before launch.**
- ✅ Blog + events content collections wired up (`src/content.config.ts`), with 4 stub
  blog posts (titles/teasers only — full article text still needs migrating from WP).
- ⏳ Not yet real: the newsletter form (`src/components/NewsletterForm.astro`) has no
  provider wired in; the consent/cookie banner isn't implemented (none was found active
  on the live site — confirm with the client whether one should exist); Impressum/
  Datenschutz pages are structural placeholders; colors/fonts are inferred from the live
  site's CSS, not an official style guide — see `src/styles/global.css` for details.

## Assumptions made — please confirm

| Item | What was assumed | Why |
|---|---|---|
| Colors | Teal (#48b0b0/#309898/#90c8c0) + terracotta (#b33a3b/#d83830) on cream (#fbf8f5/#f3ece6), ink text #181a2b | Read from the live site's own CSS custom properties — not an official CD doc |
| Fonts | Body: DM Sans · Headings: Jost | DM Sans confirmed in the page's own inline styles; Jost is self-hosted alongside it and is the best fit for the remaining weights found |
| Newsletter provider | None wired — form is a provider-agnostic stub | Nothing in the live site's markup pointed to a specific provider |
| Consent/cookie tool | None implemented | No consent-management script was found running on the live site |

## Project structure

```
src/
  content.config.ts       # blog, events, and site (text) collection schemas
  content/
    site/{de,en,it}.json   # every homepage + nav/footer string, per locale
    blog/{de,en,it}/*.md    # blog posts (Decap's "multiple folders" i18n layout)
    events/{de,en,it}/*.md  # same layout, ready for phase 2
  i18n/utils.ts            # locale helpers, language-switcher path logic
  layouts/BaseLayout.astro # head/meta/OG/hreflang/schema.org, header+footer shell
  components/              # Header, Footer, LanguageSwitcher, HomePage, cards, etc.
  pages/
    index.astro, en/index.astro, it/index.astro
    404.astro, impressum.astro, datenschutz.astro
public/
  admin/                   # Decap CMS (not usable until deployed — see config.yml)
  robots.txt               # explicitly allows AI/LLM crawlers (GEO)
```

## Commands

| Command           | Action                                      |
| ------------------ | -------------------------------------------- |
| `npm run dev`       | Local dev server at `localhost:4321`         |
| `npm run build`     | Production build to `./dist/`                |
| `npm run preview`   | Preview the production build locally          |

## Editing text without touching code (once deployed)

All site copy lives in `src/content/site/{de,en,it}.json`. Once the site is deployed and
a Decap CMS backend is wired up (see the comments in `public/admin/config.yml`), your
wife will be able to edit these through a web form instead of JSON — one tab per
language. Blog posts and events work the same way, one folder per language under
`src/content/blog/` and `src/content/events/`.
